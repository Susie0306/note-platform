'use client'

import React, { useState, useTransition } from 'react'
import { MoreVertical, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { deleteWish } from '@/app/actions/wishes'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ConfirmDialog'

interface WishActionsProps {
  wishId: string
  align?: 'end' | 'start' | 'center'
}

export function WishActions({ wishId, align = 'end' }: WishActionsProps) {
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    startTransition(async () => {
      try {
        await deleteWish(wishId)
        toast.success('已移至回收站')
        setShowDeleteDialog(false)
      } catch (error) {
        toast.error('删除失败')
      }
    })
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">更多操作</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align={align}>
          <DropdownMenuItem
            className="text-red-600 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50"
            onClick={handleDeleteClick}
            disabled={isPending}
          >
            <Trash2 className="mr-2 h-4 w-4 text-red-600" />
            移至回收站
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="移至回收站"
        description="确定要将此心愿移至回收站吗？您可以在回收站中恢复它。"
        onConfirm={handleConfirmDelete}
        variant="destructive"
        loading={isPending}
      />
    </>
  )
}

