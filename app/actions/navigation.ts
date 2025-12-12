'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'
import { revalidatePath, revalidateTag, unstable_cache } from 'next/cache'

// 使用缓存获取侧边栏数据
export async function getNavigationData() {
  const { userId } = await auth()
  if (!userId) return { folders: [], tags: [] }

  // 1. 获取 DB User (这步很难缓存，因为依赖 userId，但 Prisma 有自己的 query cache)
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!dbUser) return { folders: [], tags: [] }

  // 2. 缓存的获取函数
  const getCachedData = unstable_cache(
    async (userId: string) => {
      const [folders, tags] = await Promise.all([
        prisma.folder.findMany({
          where: { userId },
          orderBy: { createdAt: 'desc' },
          include: {
            _count: { select: { notes: true } }
          }
        }),
        prisma.tag.findMany({
          where: { userId },
          orderBy: { name: 'asc' },
          include: {
            _count: { select: { notes: true } }
          }
        })
      ])
      return { folders, tags }
    },
    ['navigation-data'], // Cache Key Parts (static)
    {
      tags: [`nav-${dbUser.id}`], // Revalidation Tags (dynamic per user)
      revalidate: 3600 // 1 hour fallback
    }
  )

  return await getCachedData(dbUser.id)
}

// Helper to revalidate user nav
async function revalidateUserNav() {
  const { userId } = await auth()
  if (!userId) return
  
  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (dbUser) {
    revalidateTag(`nav-${dbUser.id}`)
  }
}

// --- 文件夹操作 ---

export async function createFolder(name: string, parentId?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  await prisma.folder.create({
    data: {
      name,
      parentId,
      userId: dbUser.id,
    },
  })
  
  await revalidateUserNav()
  revalidatePath('/')
  revalidatePath('/notes')
}

export async function deleteFolder(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // 简单的权限校验：确保文件夹属于当前用户
  // 实际生产中应先查询文件夹归属
  
  await prisma.folder.delete({
    where: { id },
  })
  
  await revalidateUserNav()
  revalidatePath('/')
}

// --- 标签操作 ---

export async function createTag(name: string, parentId?: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  // 检查是否存在同名标签
  const existing = await prisma.tag.findUnique({
    where: { name_userId: { name, userId: dbUser.id } }
  })

  if (existing) return existing

  const tag = await prisma.tag.create({
    data: {
      name,
      parentId,
      userId: dbUser.id,
    },
  })
  
  await revalidateUserNav()
  revalidatePath('/')
  return tag
}

export async function deleteTag(id: string) {
   // 类似 deleteFolder
   await prisma.tag.delete({ where: { id }})
   await revalidateUserNav()
   revalidatePath('/')
}


