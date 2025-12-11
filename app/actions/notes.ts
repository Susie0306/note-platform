'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'

export async function createNote() {
  //获取 Clerk 当前登录用户
  const { userId: clerkId } = await auth()
  const user = await currentUser()

  if (!clerkId || !user) {
    throw new Error('Unauthorized')
  }

  //查找或同步用户 (Lazy Sync)
  //尝试在本地数据库找这个用户
  let dbUser = await prisma.user.findUnique({
    where: { clerkId },
  })

  //如果本地没找到（说明是第一次操作），则立即同步创建
  if (!dbUser) {
    const email = user.emailAddresses[0]?.emailAddress || ''
    dbUser = await prisma.user.create({
      data: {
        clerkId,
        email,
      },
    })
  }

  //创建笔记
  //这里的 userId 是本地数据库的 id
  const note = await prisma.note.create({
    data: {
      title: '无标题笔记',
      content: '', //初始内容为空
      userId: dbUser.id,
    },
  })

  //创建成功后，重定向到笔记详情页（编辑页）
  redirect(`/notes/${note.id}`)
}

export async function updateNote(
  noteId: string,
  title: string,
  content: string,
  tags: string[] = []
) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // 简单的校验
  if (!noteId) throw new Error('Note ID is required')

  // 获取本地用户 ID (因为 Tag 需要关联 userId)
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser) throw new Error('User not found')

  // 更新数据库
  await prisma.note.update({
    where: { id: noteId },
    data: {
      title,
      content,
      updatedAt: new Date(),
      tags: {
        // 先断开所有旧标签的关联 (set: [])
        set: [],
        // 然后重新关联或创建新标签
        connectOrCreate: tags.map((tagName) => ({
          where: {
            name_userId: {
              name: tagName,
              userId: dbUser.id,
            },
          },
          create: {
            name: tagName,
            userId: dbUser.id,
          },
        })),
      },
    },
  })

  // 这里不 redirect是因为用户可能还在编辑
  // 静默保存
  revalidatePath('/notes')
  return { success: true }
}

export async function deleteNote(noteId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await prisma.note.update({
    where: { id: noteId },
    data: { deletedAt: new Date() }, // 打上删除标记
  })

  revalidatePath('/notes') // 刷新列表页
  revalidatePath('/trash') // 刷新回收站
  return { success: true }
}

export async function restoreNote(noteId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await prisma.note.update({
    where: { id: noteId },
    data: { deletedAt: null }, // 清除删除标记
  })

  revalidatePath('/notes')
  revalidatePath('/trash')
  return { success: true }
}

export async function deleteNotePermanently(noteId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  await prisma.note.delete({
    where: { id: noteId },
  })

  revalidatePath('/trash')
  return { success: true }
}

export async function bulkDeleteNotes(noteIds: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')
  
  // Need to get dbUser id to ensure ownership if we want to be strict, 
  // but updateMany with where clause on user relation is not directly supported on Note unless we query user first or join.
  // Actually, Note has userId field which is our internal ID.
  // We have clerkId.
  // Let's get the internal user ID first.
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser) throw new Error('User not found')

  await prisma.note.updateMany({
    where: {
      id: { in: noteIds },
      userId: dbUser.id
    },
    data: { deletedAt: new Date() },
  })

  revalidatePath('/notes')
  revalidatePath('/trash')
  return { success: true }
}

export async function bulkRestoreNotes(noteIds: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser) throw new Error('User not found')

  await prisma.note.updateMany({
    where: {
      id: { in: noteIds },
      userId: dbUser.id
    },
    data: { deletedAt: null },
  })

  revalidatePath('/notes')
  revalidatePath('/trash')
  return { success: true }
}

export async function bulkDeleteNotesPermanently(noteIds: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser) throw new Error('User not found')

  await prisma.note.deleteMany({
    where: {
      id: { in: noteIds },
      userId: dbUser.id
    },
  })

  revalidatePath('/trash')
  return { success: true }
}
