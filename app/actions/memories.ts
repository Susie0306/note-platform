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

  // 尝试寻找“去年今日”（或者“往年今日”）的笔记

  const allNotes = await prisma.note.findMany({
    where: {
      userId: user.id,
      deletedAt: null,
      content: { not: '' }, // 排除空笔记
    },
    select: { id: true, title: true, content: true, createdAt: true },
  })

  // 寻找“往年今日”
  const anniversaryNotes = allNotes.filter((note) => {
    const d = new Date(note.createdAt)
    return (
      d.getMonth() + 1 === month && d.getDate() === day && d.getFullYear() !== today.getFullYear()
    )
  })

  if (anniversaryNotes.length > 0) {
    // 随机返回一条
    const note = anniversaryNotes[Math.floor(Math.random() * anniversaryNotes.length)]
    const yearsAgo = today.getFullYear() - new Date(note.createdAt).getFullYear()
    return {
      ...note,
      type: 'anniversary',
      yearsAgo,
    }
  }

  // 如果没有“往年今日”，则随机回顾一条 > 30 天前的笔记（漫游模式）
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const oldNotes = allNotes.filter((note) => new Date(note.createdAt) < thirtyDaysAgo)

  if (oldNotes.length > 0) {
    const note = oldNotes[Math.floor(Math.random() * oldNotes.length)]
    return {
      ...note,
      type: 'random',
    }
  }

  return null
}
