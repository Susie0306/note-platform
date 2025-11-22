'use client'

import { useTransition } from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'

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
  }
}

export function NoteCard({ note }: NoteCardProps) {
  const [isPending, startTransition] = useTransition()

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault() // 防止触发 Link 跳转
    if (!confirm('确定要删除这条笔记吗？')) return

    startTransition(async () => {
      await deleteNote(note.id)
    })
  }

  return (
    <Link href={`/notes/${note.id}`}>
      <Card className="group relative flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md">
        <CardHeader>
          <CardTitle className="line-clamp-1 text-lg">{note.title || '无标题笔记'}</CardTitle>
        </CardHeader>
        <CardContent className="flex-1">
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
