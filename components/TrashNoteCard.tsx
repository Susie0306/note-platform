'use client'

import { useState, useTransition } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Trash2, Undo2 } from 'lucide-react' // Undo2 是恢复图标

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { deleteNotePermanently, restoreNote } from '@/app/actions/notes'

interface TrashNoteCardProps {
  note: {
    id: string
    title: string
    content: string | null
    deletedAt: Date | null
  }
  isSelectionMode?: boolean
  isSelected?: boolean
  onSelectChange?: (checked: boolean) => void
}

export function TrashNoteCard({ 
  note,
  isSelectionMode = false,
  isSelected = false,
  onSelectChange
}: TrashNoteCardProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  // 恢复逻辑
  const handleRestore = () => {
    startTransition(async () => {
      await restoreNote(note.id)
    })
  }

  // 彻底删除逻辑
  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    startTransition(async () => {
      await deleteNotePermanently(note.id)
      setShowDeleteDialog(false)
    })
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    // e.stopPropagation() // Not strictly needed here as there's no surrounding Link, but good practice
  }

  return (
    <div className="relative group h-full">
      {isSelectionMode && (
        <div className="absolute top-2 right-2 z-20">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={onSelectChange}
            onClick={handleCheckboxClick}
            className="data-[state=checked]:bg-primary data-[state=checked]:border-primary bg-background/80 backdrop-blur-sm"
          />
        </div>
      )}
      
      <Card className={`flex h-full flex-col border-dashed bg-gray-50/50 dark:bg-zinc-900/50 dark:border-zinc-700 ${isSelected ? 'ring-2 ring-primary border-primary' : ''}`}>
        <CardHeader>
          <CardTitle className="line-clamp-1 text-lg text-gray-600 dark:text-gray-300 pr-6">
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

          {!isSelectionMode && (
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
                onClick={handleDeleteClick}
                disabled={isPending}
                title="彻底删除"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          )}
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="彻底删除笔记"
        description="此操作无法撤销。这将永久删除您的笔记和数据。"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        loading={isPending}
        confirmText="彻底删除"
      />
    </div>
  )
}
