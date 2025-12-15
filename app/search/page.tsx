import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { Search, Sparkles, Tag } from 'lucide-react'

import prisma from '@/lib/prisma'
import { NoteCard } from '@/components/NoteCard'
import { SearchBar } from '@/components/SearchBar'
import { Badge } from '@/components/ui/badge'
import { expandQueryWithAI } from '@/app/actions/ai-search'

interface SearchPageProps {
  searchParams: Promise<{
    q?: string
    tag?: string
    ai?: string
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
  const isAiMode = params.ai === 'true'

  // 构建动态查询条件
  // 只有当 queryText 或 queryTag 存在时才查询
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let notes: any[] = []
  let aiKeywords: string[] = []
  const hasSearchCondition = queryText || queryTag

  if (hasSearchCondition) {
    // 构建 AND 条件数组
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const andConditions: any[] = []

    // 如果有文字搜索
    if (queryText) {
      const searchTerms = [queryText]

      // AI 扩展逻辑
      if (isAiMode) {
        // 并行请求数据库和 AI 可能会更快，但这里我们需要 AI 的结果来构建 SQL
        // 所以必须 await
        try {
          aiKeywords = await expandQueryWithAI(queryText)
          if (aiKeywords.length > 0) {
             searchTerms.push(...aiKeywords)
          }
        } catch (e) {
          console.error('AI Search Error', e)
        }
      }

      andConditions.push({
        OR: searchTerms.flatMap(term => [
          { title: { contains: term, mode: 'insensitive' } },
          { content: { contains: term, mode: 'insensitive' } },
        ]),
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
      <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground min-h-[2rem]">
        {queryTag && (
          <div className="flex items-center gap-2">
            <span>标签:</span>
            <Badge variant="secondary" className="gap-1 pr-1">
              <Tag className="h-3 w-3" />
              {queryTag}
              {/* 点击 X 清除标签筛选 (保留文字搜索 q 和 ai 状态) */}
              <Link
                href={`/search?q=${encodeURIComponent(queryText)}${isAiMode ? '&ai=true' : ''}`}
                className="hover:text-foreground ml-1"
              >
                ×
              </Link>
            </Badge>
          </div>
        )}

        {/* 显示 AI 扩展词 */}
        {isAiMode && aiKeywords.length > 0 && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-left-2 duration-500">
             <div className="flex items-center gap-1.5 rounded-full bg-indigo-100/50 dark:bg-indigo-500/10 px-3 py-1 text-xs font-medium text-indigo-600 dark:text-indigo-300 border border-indigo-200/50 dark:border-indigo-500/20">
               <Sparkles className="h-3 w-3" />
               <span>AI 联想: {aiKeywords.join('、')}</span>
             </div>
          </div>
        )}
      </div>

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
                  标签为 &quot;<b>{queryTag}</b>&quot;{' '}
                </span>
              )}
              {queryText && queryTag && <span> 且 </span>}
              {queryText && (
                <span>
                  {' '}
                  包含 &quot;<b>{queryText}</b>&quot;{' '}
                </span>
              )}
              的笔记
            </p>
          </div>
        )
      ) : (
        <div className="py-20 text-center text-gray-400">
          <Search className="mx-auto mb-4 h-12 w-12 opacity-20" />
          <p>输入标题或内容关键词开始搜索...</p>
        </div>
      )}
    </div>
  )
}
