'use server'

import { auth } from '@clerk/nextjs/server'
import prisma from '@/lib/prisma'

export interface MemoryNote {
  id: string
  title: string
  content: string | null
  createdAt: Date
  type: 'anniversary' | 'random'
  yearsAgo?: number
}

export async function getDailyMemory(): Promise<MemoryNote | null> {
  const { userId } = await auth()
  if (!userId) return null

  const user = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  if (!user) return null

  const today = new Date()
  const month = today.getMonth() + 1
  const day = today.getDate()

  // 1. 尝试寻找“去年今日”（或者往年今日）的笔记
  // 由于 Prisma 不支持直接的 date part 查询，我们需要用 raw query 或者获取所有笔记后过滤
  // 为了性能，我们这里用 raw query (Postgres)
  
  // 注意：Prisma 的 queryRaw 返回的是 raw data，字段名可能是下划线风格，需要映射
  // 但为了简化，我们先尝试用 findMany 获取字段，然后内存过滤（如果用户笔记数不是巨大的话）
  // 或者使用 Prisma 的 raw query.

  // 让我们尝试用 findMany 加上时间范围过滤。
  // 简单的做法：获取该用户所有笔记的 createdAt，在内存中匹配 month 和 day。
  // 这种方式在笔记数 < 10000 时性能尚可。
  
  const allNotes = await prisma.note.findMany({
    where: { 
      userId: user.id,
      deletedAt: null,
      content: { not: '' } // 排除空笔记
    },
    select: { id: true, title: true, content: true, createdAt: true },
  })

  // 寻找往年今日
  const anniversaryNotes = allNotes.filter(note => {
    const d = new Date(note.createdAt)
    return d.getMonth() + 1 === month && d.getDate() === day && d.getFullYear() !== today.getFullYear()
  })

  if (anniversaryNotes.length > 0) {
    // 优先返回最近的一条（或者随机一条）
    const note = anniversaryNotes[Math.floor(Math.random() * anniversaryNotes.length)]
    const yearsAgo = today.getFullYear() - new Date(note.createdAt).getFullYear()
    return {
      ...note,
      type: 'anniversary',
      yearsAgo
    }
  }

  // 2. 如果没有“往年今日”，则随机回顾一条 > 30 天前的笔记（漫游模式）
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const oldNotes = allNotes.filter(note => new Date(note.createdAt) < thirtyDaysAgo)

  if (oldNotes.length > 0) {
    const note = oldNotes[Math.floor(Math.random() * oldNotes.length)]
    return {
      ...note,
      type: 'random'
    }
  }

  return null
}

