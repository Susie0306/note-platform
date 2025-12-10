'use client'

import { useState, useTransition } from 'react'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Sparkles, Trash2, Undo2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { deleteWishPermanently, restoreWish } from '@/app/actions/wishes'
import { Progress } from '@/components/ui/progress'

interface TrashWishCardProps {
  wish: {
    id: string
    title: string
    progress: number
    deletedAt: Date | null
  }
}

export function TrashWishCard({ wish }: TrashWishCardProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleRestore = () => {
    startTransition(async () => {
      await restoreWish(wish.id)
    })
  }

  const handleDeleteClick = () => {
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    startTransition(async () => {
      await deleteWishPermanently(wish.id)
      setShowDeleteDialog(false)
    })
  }

  return (
    <>
      <Card className="flex h-full flex-col border-dashed bg-gray-50/50 dark:bg-zinc-900/50 dark:border-zinc-700">
        <CardHeader className="pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span className="text-xs text-muted-foreground">心愿</span>
          </div>
          <CardTitle className="line-clamp-1 text-lg text-gray-600 dark:text-gray-300">
            {wish.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-1 pb-2">
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>达成进度</span>
              <span>{wish.progress}%</span>
            </div>
            <Progress value={wish.progress} className="h-2" />
          </div>
        </CardContent>
        <CardFooter className="flex items-center justify-between text-xs text-gray-400">
          <span>
            删除于:{' '}
            {wish.deletedAt &&
              formatDistanceToNow(new Date(wish.deletedAt), {
                addSuffix: true,
                locale: zhCN,
              })}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-blue-600 hover:bg-blue-50 hover:text-blue-700 dark:hover:bg-blue-950"
              onClick={handleRestore}
              disabled={isPending}
              title="恢复心愿"
            >
              <Undo2 className="h-4 w-4" />
            </Button>

            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950"
              onClick={handleDeleteClick}
              disabled={isPending}
              title="彻底删除"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </CardFooter>
      </Card>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="彻底删除心愿"
        description="此操作无法撤销。这将永久删除您的心愿和所有相关记录。"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        loading={isPending}
        confirmText="彻底删除"
      />
    </>
  )
}

