import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { Search, Tag } from 'lucide-react'

import prisma from '@/lib/prisma'
import { NoteCard } from '@/components/NoteCard'
import { SearchBar } from '@/components/SearchBar'
import { Badge } from '@/components/ui/badge'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    tag?: string
  }>
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser) return <div>暂无数据</div>

  // 获取 URL 参数
  const params = await searchParams
  const queryText = params.q || ''
  const queryTag = params.tag || ''

  // 构建动态查询条件
  // 只有当 queryText 或 queryTag 存在时才查询
  let notes: any[] = []
  const hasSearchCondition = queryText || queryTag

  if (hasSearchCondition) {
    // 构建 AND 条件数组
    const andConditions: any[] = []

    // 如果有文字搜索
    if (queryText) {
      andConditions.push({
        OR: [
          { title: { contains: queryText, mode: 'insensitive' } },
          { content: { contains: queryText, mode: 'insensitive' } },
        ],
      })
    }

    // 如果有标签筛选
    if (queryTag) {
      andConditions.push({
        tags: {
          some: {
            name: queryTag,
          },
        },
      })
    }

    // 执行查询
    notes = await prisma.note.findMany({
      where: {
        userId: dbUser.id,
        deletedAt: null,
        AND: andConditions, // 同时满足所有条件
      },
      orderBy: { updatedAt: 'desc' },
      include: { tags: true },
    })
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">搜索</h1>
      </div>

      {/* 搜索框 */}
      <div className="max-w-xl">
        <SearchBar />
      </div>

      {/* 展示当前筛选状态 (Active Filters) */}
      {queryTag && (
        <div className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>当前筛选标签:</span>
          <Badge variant="secondary" className="gap-1 pr-1">
            <Tag className="h-3 w-3" />
            {queryTag}
            {/* 点击 X 清除标签筛选 (保留文字搜索 q) */}
            <Link
              href={`/search${queryText ? `?q=${queryText}` : ''}`}
              className="hover:text-foreground ml-1"
            >
              ×
            </Link>
          </Badge>
        </div>
      )}

      {/* 结果展示 */}
      {hasSearchCondition ? (
        notes.length > 0 ? (
          <div className="space-y-4">
            <p className="text-muted-foreground text-sm">找到 {notes.length} 条结果：</p>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {notes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          </div>
        ) : (
          <div className="py-20 text-center text-gray-500">
            <p>
              没有找到
              {queryTag && (
                <span>
                  {' '}
                  标签为 "<b>{queryTag}</b>"{' '}
                </span>
              )}
              {queryText && queryTag && <span> 且 </span>}
              {queryText && (
                <span>
                  {' '}
                  包含 "<b>{queryText}</b>"{' '}
                </span>
              )}
              的笔记
            </p>
          </div>
        )
      ) : (
        <div className="py-20 text-center text-gray-400">
          <Search className="mx-auto mb-4 h-12 w-12 opacity-20" />
          <p>输入关键词或点击笔记标签开始搜索...</p>
        </div>
      )}
    </div>
  )
}
