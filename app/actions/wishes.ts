'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'

// 获取所有心愿 (排除已删除)
export async function getWishes() {
  const { userId } = await auth()
  if (!userId) return []

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!dbUser) return []

  return prisma.wish.findMany({
    where: {
      userId: dbUser.id,
      deletedAt: null, // 只查询未删除的
    },
    orderBy: { createdAt: 'desc' },
  })
}

// 获取单个心愿详情 (排除已删除，除非特殊处理)
export async function getWish(id: string) {
  const { userId } = await auth()
  if (!userId) return null

  // 校验权限
  const wish = await prisma.wish.findUnique({
    where: { id },
    include: {
      logs: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })

  // 如果心愿不存在或属于他人，或者是已删除的，则返回 null
  // 注意：如果是回收站逻辑，可能需要单独的 getDeletedWish 或者允许 deletedAt 不为 null
  // 这里暂时严格一些
  if (!wish || wish.deletedAt !== null) {
    // 再检查一下是否是当前用户的（虽然查不到也不影响，但严谨点）
    return null
  }

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser || wish.userId !== dbUser.id) return null

  return wish
}

// 创建心愿
export async function createWish(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const title = formData.get('title') as string
  const targetDateStr = formData.get('targetDate') as string

  if (!title) throw new Error('Title is required')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser) throw new Error('User not found')

  await prisma.wish.create({
    data: {
      title,
      targetDate: targetDateStr ? new Date(targetDateStr) : null,
      userId: dbUser.id,
    },
  })

  revalidatePath('/wishes')
  revalidatePath('/') // 首页也有概览
}

// 更新进度
export async function updateWishProgress(wishId: string, progress: number) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  // 🔒 安全修复：确保只能更新自己的心愿
  await prisma.wish.update({
    where: { 
      id: wishId,
      userId: dbUser.id 
    },
    data: {
      progress,
      status: progress === 100 ? 'COMPLETED' : 'IN_PROGRESS',
    },
  })

  revalidatePath(`/wishes/${wishId}`)
  revalidatePath('/wishes')
}

// 创建日志
export async function createWishLog(wishId: string, content: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  // 🔒 权限校验：确保心愿属于当前用户
  const wish = await prisma.wish.findUnique({
    where: { id: wishId, userId: dbUser.id }
  })
  if (!wish) throw new Error('Wish not found or unauthorized')

  await prisma.wishLog.create({
    data: {
      wishId,
      content,
    },
  })

  revalidatePath(`/wishes/${wishId}`)
}

// --- 软删除相关 ---

// 软删除心愿
export async function deleteWish(wishId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  await prisma.wish.update({
    where: {
      id: wishId,
      userId: dbUser.id,
    },
    data: {
      deletedAt: new Date(),
    },
  })

  revalidatePath('/wishes')
  revalidatePath('/trash')
}

// 恢复心愿
export async function restoreWish(wishId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  await prisma.wish.update({
    where: {
      id: wishId,
      userId: dbUser.id,
    },
    data: {
      deletedAt: null,
    },
  })

  revalidatePath('/wishes')
  revalidatePath('/trash')
}

// 彻底删除心愿
export async function deleteWishPermanently(wishId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  await prisma.wish.delete({
    where: {
      id: wishId,
      userId: dbUser.id,
    },
  })

  revalidatePath('/trash')
}
