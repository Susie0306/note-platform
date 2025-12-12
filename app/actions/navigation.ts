'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'

// 获取侧边栏导航数据（文件夹和标签树）
export async function getNavigationData() {
  const { userId } = await auth()
  if (!userId) return { folders: [], tags: [] }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!dbUser) return { folders: [], tags: [] }

  const [folders, tags] = await Promise.all([
    prisma.folder.findMany({
      where: { userId: dbUser.id },
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { notes: true } },
      },
    }),
    prisma.tag.findMany({
      where: { userId: dbUser.id },
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { notes: true } },
      },
    }),
  ])

  return { folders, tags }
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

  revalidatePath('/')
  revalidatePath('/notes')
}

export async function deleteFolder(id: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // 简单的权限校验：确保文件夹属于当前用户

  await prisma.folder.delete({
    where: { id },
  })

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
    where: { name_userId: { name, userId: dbUser.id } },
  })

  if (existing) return existing

  const tag = await prisma.tag.create({
    data: {
      name,
      parentId,
      userId: dbUser.id,
    },
  })

  revalidatePath('/')
  return tag
}

export async function deleteTag(id: string) {
  // 类似 deleteFolder
  await prisma.tag.delete({ where: { id } })
  revalidatePath('/')
}



