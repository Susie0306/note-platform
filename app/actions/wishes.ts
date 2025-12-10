'use server'

import { revalidatePath } from 'next/cache'
import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'

// ... existing createWish and getWishes ...

export async function createWish(formData: FormData) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error('User not found')

  const title = formData.get('title') as string
  const targetDateStr = formData.get('targetDate') as string
  const targetDate = targetDateStr ? new Date(targetDateStr) : null

  await prisma.wish.create({
    data: {
      title,
      targetDate,
      userId: user.id,
    },
  })

  revalidatePath('/wishes')
}

export async function getWishes() {
  const { userId } = await auth()
  if (!userId) return []

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return []

  return await prisma.wish.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: 'desc' },
  })
}

// 获取单个心愿详情（包含日志）
export async function getWish(id: string) {
  const { userId } = await auth()
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return null

  return await prisma.wish.findFirst({
    where: {
      id,
      userId: user.id,
    },
    include: {
      logs: {
        orderBy: { createdAt: 'desc' },
      },
    },
  })
}

// 更新心愿进度
export async function updateWishProgress(id: string, progress: number) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error('User not found')

  // 验证归属权
  const wish = await prisma.wish.findFirst({
    where: { id, userId: user.id },
  })

  if (!wish) throw new Error('Wish not found')

  const status = progress >= 100 ? 'COMPLETED' : 'IN_PROGRESS'

  await prisma.wish.update({
    where: { id },
    data: { progress, status },
  })

  revalidatePath(`/wishes/${id}`)
  revalidatePath('/wishes')
}

// 添加心路历程日志
export async function createWishLog(wishId: string, content: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) throw new Error('User not found')

  // 验证归属权
  const wish = await prisma.wish.findFirst({
    where: { id: wishId, userId: user.id },
  })

  if (!wish) throw new Error('Wish not found')

  await prisma.wishLog.create({
    data: {
      content,
      wishId,
    },
  })

  revalidatePath(`/wishes/${wishId}`)
}
