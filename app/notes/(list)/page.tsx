import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { Note, Tag } from '@prisma/client'
import { ChevronLeft, ChevronRight } from 'lucide-react'

import prisma from '@/lib/prisma'
import { NotesList } from '@/components/NotesList'
import { Button } from '@/components/ui/button'

// 每页显示多少条
const PAGE_SIZE = 9

interface NotesPageProps {
  // searchParams 在 Next.js 15 中是异步的
  searchParams: Promise<{
    page?: string
    sort?: string
    folderId?: string
    tagId?: string
  }>
}

export default async function NotesPage({ searchParams }: NotesPageProps) {
  const { userId } = await auth()
  if (!userId) redirect('/')

  // 获取当前用户在本地数据库的 ID (需要这一步是因为 Note 关联的是本地 User ID)
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })

  // 处理分页参数
  const params = await searchParams
  const currentPage = Number(params.page) || 1
  const skip = (currentPage - 1) * PAGE_SIZE
  const { folderId, tagId } = params

  // 获取文件夹/标签信息以便显示标题
  let pageTitle = '我的笔记'
  if (folderId) {
    const folder = await prisma.folder.findUnique({ where: { id: folderId } })
    if (folder) pageTitle = `文件夹：${folder.name}`
  } else if (tagId) {
    const tag = await prisma.tag.findUnique({ where: { id: tagId } })
    if (tag) pageTitle = `标签：${tag.name}`
  }

  // 处理排序参数
  const sort = params.sort || 'updatedAt_desc'
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let orderBy: any = { updatedAt: 'desc' }
  switch (sort) {
    case 'createdAt_desc':
      orderBy = { createdAt: 'desc' }
      break
    case 'createdAt_asc':
      orderBy = { createdAt: 'asc' }
      break
    case 'updatedAt_asc':
      orderBy = { updatedAt: 'asc' }
      break
    case 'updatedAt_desc':
    default:
      orderBy = { updatedAt: 'desc' }
      break
  }

  // 并行查询：获取数据列表 + 总条数 (用于计算总页数)
  // 使用 Promise.all 提高性能
  let notes: (Note & { tags: Tag[] })[] = []
  let totalCount = 0

  if (dbUser) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const where: any = {
      deletedAt: null,
      OR: [
        { userId: dbUser.id },
        { collaborators: { some: { id: dbUser.id } } }
      ]
    }

    // 如果指定了文件夹或标签，通常只在自己的笔记中筛选（或者如果共享笔记也有标签，可以放宽）
    // 目前简单处理：如果是筛选模式，就只筛选属性
    if (folderId) {
      where.folderId = folderId
      // 移除 OR 条件，因为通常 folder 是个人的。
      // 如果要支持共享文件夹，逻辑会更复杂。现在假设共享笔记没有归入接收者的文件夹。
      // 但为了安全，我们保持 OR 限制，即只能看自己相关的
      where.AND = [
        { folderId },
        {
           OR: [
             { userId: dbUser.id },
             { collaborators: { some: { id: dbUser.id } } }
           ]
        }
      ]
      delete where.OR
      delete where.folderId // 移入 AND
    }

    if (tagId) {
       // 同上逻辑
       where.AND = [
        {
          tags: {
            some: {
              id: tagId,
            },
          }
        },
        {
           OR: [
             { userId: dbUser.id },
             { collaborators: { some: { id: dbUser.id } } }
           ]
        }
      ]
      delete where.OR
    }

    const [data, count] = await Promise.all([
      prisma.note.findMany({
        where,
        orderBy: orderBy,
        take: PAGE_SIZE,
        skip: skip,
        include: { tags: true },
      }),
      prisma.note.count({
        where,
      }),
    ])
    notes = data
    totalCount = count
  }
  const totalPages = Math.ceil(totalCount / PAGE_SIZE)

  // 构建分页链接的 helper
  const getPageLink = (page: number) => {
    const searchParamsObj = new URLSearchParams()
    if (page > 1) searchParamsObj.set('page', page.toString())
    if (sort !== 'updatedAt_desc') searchParamsObj.set('sort', sort)
    if (folderId) searchParamsObj.set('folderId', folderId)
    if (tagId) searchParamsObj.set('tagId', tagId)
    const queryString = searchParamsObj.toString()
    return `/notes${queryString ? `?${queryString}` : ''}`
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{pageTitle}</h1>
        <span className="text-sm text-gray-500">共 {totalCount} 条</span>
      </div>

      {/* 笔记列表组件 - 处理批量选择 */}
      <NotesList initialNotes={notes} />

      {/* 分页控制栏 */}
      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          <Button variant="outline" size="icon" disabled={currentPage <= 1} asChild>
            {/* asChild 允许 Button 渲染为 Link，保留按钮样式 */}
            {currentPage > 1 ? (
              <Link href={getPageLink(currentPage - 1)}>
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
              <Link href={getPageLink(currentPage + 1)}>
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
