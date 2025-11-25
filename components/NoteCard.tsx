'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteNote } from '@/app/actions/notes'

// 定义 Props 类型，这里直接对应 Prisma 返回的数据结构
interface NoteCardProps {
  note: {
    id: string
    title: string
    content: string | null
    createdAt: Date
    tags: { id: string; name: string }[]
  }
}

export function NoteCard({ note }: NoteCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault() // 防止触发 Link 跳转
    if (!confirm('确定要删除这条笔记吗？')) return

    startTransition(async () => {
      await deleteNote(note.id)
    })
  }
  // 标签点击处理函数
  const handleTagClick = (e: React.MouseEvent, tagName: string) => {
    e.preventDefault() // 阻止 Link 跳转详情页
    e.stopPropagation() // 阻止事件冒泡
    router.push(`/search?tag=${tagName}`) // 跳转到搜索页并带上参数
  }
  return (
    <Link href={`/notes/${note.id}`}>
      <Card className="group relative flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-lg">{note.title || '无标题笔记'}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1 space-y-3">
          {note.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {note.tags.map((tag) => (
                <Badge
                  key={tag.id}
                  variant="secondary"
                  className="hover:bg-secondary/80 cursor-pointer text-xs font-normal"
                  onClick={(e) => handleTagClick(e, tag.name)}
                >
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}
          {/* 简单的文本截断，显示前3行 */}
          <p className="line-clamp-3 h-[4.5em] text-sm text-gray-500">
            {note.content || '暂无内容...'}
          </p>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-xs text-gray-400">
          <span>
            {formatDistanceToNow(new Date(note.createdAt), {
              addSuffix: true,
              locale: zhCN,
            })}
          </span>

          {/* 删除按钮 - 只有鼠标悬停时才显示，或者一直显示也可 */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
            onClick={handleDelete}
            disabled={isPending}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </CardFooter>
      </Card>
    </Link>
  )
}
