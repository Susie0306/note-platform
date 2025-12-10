'use client'

import { useTransition } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Trash2, Undo2 } from 'lucide-react' // Undo2 是恢复图标

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { deleteNotePermanently, restoreNote } from '@/app/actions/notes'

interface TrashNoteCardProps {
  note: {
    id: string
    title: string
    content: string | null
    deletedAt: Date | null
  }
}

export function TrashNoteCard({ note }: TrashNoteCardProps) {
  const [isPending, startTransition] = useTransition()

  // 恢复逻辑
  const handleRestore = () => {
    startTransition(async () => {
      await restoreNote(note.id)
    })
  }

  // 彻底删除逻辑
  const handleDeletePermanently = () => {
    if (!confirm('彻底删除后无法恢复，确定吗？')) return
    startTransition(async () => {
      await deleteNotePermanently(note.id)
    })
  }

  return (
    <Card className="flex h-full flex-col border-dashed bg-gray-50/50 dark:bg-zinc-900/50 dark:border-zinc-700">
      <CardHeader>
        <CardTitle className="line-clamp-1 text-lg text-gray-600 dark:text-gray-300">
          {note.title || '无标题笔记'}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
        <p className="line-clamp-3 h-[4.5em] text-sm text-gray-400 dark:text-gray-500">
          {note.content || '暂无内容...'}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between text-xs text-gray-400 dark:text-gray-500">
        <span>
          删除于:{' '}
          {note.deletedAt &&
            formatDistanceToNow(new Date(note.deletedAt), {
              addSuffix: true,
              locale: zhCN,
            })}
        </span>

        <div className="flex gap-2">
          {/* 恢复按钮 */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700"
            onClick={handleRestore}
            disabled={isPending}
            title="恢复笔记"
          >
            <Undo2 className="h-4 w-4" />
          </Button>

          {/* 彻底删除按钮 */}
          <Button
            variant="outline"
            size="icon"
            className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600"
            onClick={handleDeletePermanently}
            disabled={isPending}
            title="彻底删除"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}
