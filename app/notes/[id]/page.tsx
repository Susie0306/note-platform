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
  const { userId } = await auth()
  if (!userId) redirect('/')

  const { id } = await params

  // 使用 include 连带查询 tags
  const note = await prisma.note.findUnique({
    where: { id },
    include: { tags: true, folder: true },
  })

  if (!note) return <div>笔记未找到</div>

  return (
    <div className="h-full">
      <NoteEditor
        noteId={note.id}
        initialTitle={note.title}
        initialContent={note.content || ''}
        // 提取标签名字组成的数组传给组件
        initialTags={note.tags.map((tag) => tag.name)}
        initialCreatedAt={note.createdAt}
        initialFolderId={note.folderId}
        initialFolderName={note.folder?.name}
      />
    </div>
  )
}
