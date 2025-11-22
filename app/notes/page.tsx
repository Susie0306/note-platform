import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import prisma from '@/lib/prisma'
import { NoteCard } from '@/components/NoteCard'
import { Button } from '@/components/ui/button'

// 每页显示多少条
const PAGE_SIZE = 9

interface NotesPageProps {
  // searchParams 在 Next.js 15 中是异步的
  searchParams: Promise<{
    page?: string
  }>
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { userId } = await auth()
  if (!userId) redirect('/')

  // 获取当前用户在本地数据库的 ID (需要这一步是因为 Note 关联的是本地 User ID)
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  // 如果用户没同步过，理论上他不应该有笔记，直接返回空
  if (!dbUser) return <div>暂无数据</div>

  // 处理分页参数
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const skip = (currentPage - 1) * PAGE_SIZE

  // 并行查询：获取数据列表 + 总条数 (用于计算总页数)
  // 使用 Promise.all 提高性能
  const [notes, totalCount] = await Promise.all([
    prisma.note.findMany({
      where: { userId: dbUser.id, deletedAt: null },
      orderBy: { updatedAt: 'desc' }, // 按更新时间倒序
      take: PAGE_SIZE,
      skip: skip,
    }),
    prisma.note.count({
      where: { userId: dbUser.id, deletedAt: null },
    }),
  ])

  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">我的笔记</h1>
        <span className="text-sm text-gray-500">共 {totalCount} 条</span>
      </div>

      {/* 笔记网格列表 */}
      {notes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p>还没有笔记，点击左侧“新建笔记”开始吧！</p>
        </div>
      )}

      {/* 分页控制栏 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button variant="outline" size="icon" disabled={currentPage <= 1} asChild>
            {/* asChild 允许 Button 渲染为 Link，保留按钮样式 */}
            {currentPage > 1 ? (
              <Link href={`/notes?page=${currentPage - 1}`}>
                <ChevronLeft className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <ChevronLeft className="h-4 w-4" />
              </span>
            )}
          </Button>

          <span className="flex items-center px-4 text-sm">
            第 {currentPage} 页 / 共 {totalPages} 页
          </span>

          <Button variant="outline" size="icon" disabled={currentPage >= totalPages} asChild>
            {currentPage < totalPages ? (
              <Link href={`/notes?page=${currentPage + 1}`}>
                <ChevronRight className="h-4 w-4" />
              </Link>
            ) : (
              <span>
                <ChevronRight className="h-4 w-4" />
              </span>
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
