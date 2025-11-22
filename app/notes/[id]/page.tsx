import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

import prisma from '@/lib/prisma'
import { NoteEditor } from '@/components/NoteEditor'

interface NotePageProps {
  params: Promise<{
    id: string
  }>
}

export default async function NotePage({ params }: NotePageProps) {
  // 权限检查：确保用户已登录
  const { userId } = await auth()
  if (!userId) redirect('/')

  // 异步获取 params (Next.js 15 规范)
  const { id } = await params

  // 从数据库获取笔记
  const note = await prisma.note.findUnique({
    where: {
      id: id,
    },
  })

  // 简单的权限控制：如果笔记不存在或不属于该用户
  // 由于还没做 User.id 和 Clerk.id 的复杂映射查询，
  // 这里暂时先只判断 note 是否存在。严谨的判断需要查 User 表。
  if (!note) {
    return <div>笔记未找到</div>
  }

  return (
    <div className="h-full">
      <NoteEditor noteId={note.id} initialTitle={note.title} initialContent={note.content || ''} />
    </div>
  )
}
