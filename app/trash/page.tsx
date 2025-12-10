import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
// 使用 Trash2 图标
import { Trash2 } from 'lucide-react'

import prisma from '@/lib/prisma'
import { TrashNoteCard } from '@/components/TrashNoteCard'

export default async function TrashPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  // 获取数据库用户
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser) return <div>暂无数据</div>

  // 查询所有“已删除”的笔记 (deletedAt不为空)
  // 回收站一般不需要太复杂的分页，这里先查全部，或者限制最近50条
  const deletedNotes = await prisma.note.findMany({
    where: {
      userId: dbUser.id,
      deletedAt: { not: null },
    },
    orderBy: { deletedAt: 'desc' }, // 按删除时间倒序
    take: 50,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">回收站</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">共 {deletedNotes.length} 条 (最近删除)</span>
      </div>

      {deletedNotes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {deletedNotes.map((note) => (
            <TrashNoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-400">
          <Trash2 className="mx-auto mb-4 h-12 w-12 opacity-20" />
          <p>回收站是空的</p>
        </div>
      )}
    </div>
  )
}
