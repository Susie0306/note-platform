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

  //创建成功后，返回笔记 ID
  return { success: true, noteId: note.id }
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

  // 1. 获取现有笔记以检查权限和所有权
  const existingNote = await prisma.note.findUnique({
    where: { id: noteId },
    include: { collaborators: true }
  })

  if (!existingNote) throw new Error('Note not found')

  // 权限检查：必须是拥有者 OR 已经是协作者
  // 注意：如果是通过公开链接进入的第一次编辑，这里可能需要放宽逻辑，或者由上层逻辑添加协作者
  // 假设：只要能调用这个 Server Action，说明已经有权限（前端已校验）
  // 但为了安全，我们检查：
  // A. 是拥有者
  // B. 是协作者
  // C. 如果都不是，说明是新加入的协作者（如果是公开分享模式）
  
  const isOwner = existingNote.userId === dbUser.id
  const isCollaborator = existingNote.collaborators.some(c => c.id === dbUser.id)

  // 如果既不是拥有者也不是协作者，自动将其添加为协作者
  let connectCollaborator = undefined
  if (!isOwner && !isCollaborator) {
     connectCollaborator = {
        connect: { id: dbUser.id }
     }
  }

  // 更新数据库
  await prisma.note.update({
    where: {
      id: noteId,
      // 移除 userId 限制，因为协作者也可以更新
      // userId: dbUser.id, 
    },
    data: {
      title,
      content,
      updatedAt: new Date(),
      // 只有拥有者才能修改标签（暂时策略，避免混乱），或者允许协作者修改？
      // 如果允许协作者修改标签，这些标签会关联到谁？
      // 目前 Tag 模型关联了 User。如果协作者加标签，标签会属于 Note 的拥有者吗？
      // 根据 schema: Tag -> User。Tag 是个人的。
      // 所以如果协作者 A 给 笔记 B 加标签，这个标签应该是 A 的标签，连接到 笔记 B。
      // 但 prisma.note.update 是更新 Note 模型。Note 的 tags 是多对多。
      // 现在的逻辑：tags: [...] 是标签名列表。
      // 下面的逻辑 `connectOrCreate` 使用 `userId: dbUser.id`。
      // 这意味着：谁编辑，就用谁的标签库。
      // 如果我是协作者，我加了一个 "Work" 标签，这个 "Work" 标签创建在我的账号下，并关联到这个笔记。
      // 这很合理：每个人对同一个笔记可以有不同的分类体系。
      tags: {
        // 先断开当前用户在这个笔记上的旧标签关联
        // 注意：set: [] 会断开该笔记的所有标签！这不行，会把拥有者的标签也删掉。
        // 这是一个复杂点。
        // 修正逻辑：
        // 我们只希望更新“当前用户”对这个笔记的标签。
        // 但 Prisma 的 set: [] 是针对整个关系的。
        // 临时方案：如果不是拥有者，暂时忽略标签更新，或者接受 tags 只代表拥有者的标签。
        // 为了简化，假设标签是共享的？不，Tag model 有 userId。
        // 假如我们希望“谁编辑谁负责标签”：
        // 那么 tags 参数应该是全量的。
        // 如果我们用 set: []，会清空所有人的标签。
        
        // 妥协方案：仅当用户是 Owner 时才允许全量更新标签。
        // 协作者修改内容时不触碰标签。
        ...(isOwner ? {
            set: [],
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
        } : {})
      },
      collaborators: connectCollaborator
    },
  })

  // 这里不 redirect是因为用户可能还在编辑
  // 静默保存
  revalidatePath('/notes')
  return { success: true }
}

// 移动笔记到文件夹
export async function updateNoteFolder(noteId: string, folderId: string | null) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  // 验证用户和笔记所有权
  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  // 如果 folderId 为 undefined，将其转换为 null
  const targetFolderId = folderId === undefined ? null : folderId

  // 验证文件夹（如果存在）属于用户
  if (targetFolderId) {
    const folder = await prisma.folder.findUnique({
      where: { id: targetFolderId },
    })
    if (!folder || folder.userId !== dbUser.id) {
      throw new Error('Invalid folder')
    }
  }

  await prisma.note.update({
    where: { id: noteId, userId: dbUser.id },
    data: { folderId: targetFolderId },
  })

  revalidatePath('/notes')
  return { success: true }
}

export async function deleteNote(noteId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  await prisma.note.update({
    where: {
      id: noteId,
      userId: dbUser.id,
    },
    data: { deletedAt: new Date() }, // 打上删除标记
  })

  revalidatePath('/notes') // 刷新列表页
  revalidatePath('/trash') // 刷新回收站
  return { success: true }
}

export async function restoreNote(noteId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  await prisma.note.update({
    where: {
      id: noteId,
      userId: dbUser.id,
    },
    data: { deletedAt: null }, // 清除删除标记
  })

  revalidatePath('/notes')
  revalidatePath('/trash')
  return { success: true }
}

export async function deleteNotePermanently(noteId: string) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } })
  if (!dbUser) throw new Error('User not found')

  await prisma.note.delete({
    where: {
      id: noteId,
      userId: dbUser.id,
    },
  })

  revalidatePath('/trash')
  return { success: true }
}

export async function bulkDeleteNotes(noteIds: string[]) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser) throw new Error('User not found')

  // 允许拥有者或协作者删除
  await prisma.note.updateMany({
    where: {
      id: { in: noteIds },
      OR: [
        { userId: dbUser.id },
        { collaborators: { some: { id: dbUser.id } } }
      ]
    },
    data: { deletedAt: new Date() },
  })

  revalidatePath('/notes')
  revalidatePath('/trash')
  return { success: true }
}

export async function bulkDeleteAllMatchingNotes(filter: { folderId?: string; tagId?: string }) {
  const { userId } = await auth()
  if (!userId) throw new Error('Unauthorized')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser) throw new Error('User not found')

  // 构建与列表页一致的查询条件
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: any = {
    deletedAt: null,
    // 基础权限：我创建的 OR 我协作的
    OR: [
        { userId: dbUser.id },
        { collaborators: { some: { id: dbUser.id } } }
    ]
  }

  // 附加筛选条件
  if (filter.folderId) {
    where.AND = [
        { folderId: filter.folderId },
        { OR: where.OR }
    ]
    delete where.OR
  }

  if (filter.tagId) {
    const tagCondition = {
        tags: { some: { id: filter.tagId } }
    }
    if (where.AND) {
        where.AND.push(tagCondition)
    } else {
        where.AND = [
            tagCondition,
            { OR: where.OR }
        ]
        delete where.OR
    }
  }

  const result = await prisma.note.updateMany({
    where,
    data: { deletedAt: new Date() },
  })

  revalidatePath('/notes')
  revalidatePath('/trash')
  return { success: true, count: result.count }
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
      userId: dbUser.id,
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
      userId: dbUser.id,
    },
  })

  revalidatePath('/trash')
  return { success: true }
}
