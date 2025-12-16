'use client'

import { useState, useTransition } from 'react'
import { Note } from '@prisma/client'
import { Trash2, Undo2, X, CheckSquare, Square, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { TrashNoteCard } from '@/components/TrashNoteCard'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { bulkDeleteNotesPermanently, bulkRestoreNotes } from '@/app/actions/notes'

interface TrashNotesListProps {
  initialNotes: Note[]
}

export function TrashNotesList({ initialNotes }: TrashNotesListProps) {
  const [isSelectionMode, setIsSelectionMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const toggleSelectionMode = () => {
    setIsSelectionMode(!isSelectionMode)
    setSelectedIds(new Set())
  }

  const toggleSelectAll = () => {
    if (selectedIds.size === initialNotes.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(initialNotes.map(n => n.id)))
    }
  }

  const handleSelectChange = (id: string, checked: boolean) => {
    const newSelected = new Set(selectedIds)
    if (checked) {
      newSelected.add(id)
    } else {
      newSelected.delete(id)
    }
    setSelectedIds(newSelected)
  }

  const handleBulkRestore = () => {
    if (selectedIds.size === 0) return
    startTransition(async () => {
      try {
        await bulkRestoreNotes(Array.from(selectedIds))
        toast.success(`成功恢复了 ${selectedIds.size} 条笔记`)
        setIsSelectionMode(false)
        setSelectedIds(new Set())
      } catch (error) {
        toast.error('恢复失败，请重试')
      }
    })
  }

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return
    setShowDeleteDialog(true)
  }

  const confirmBulkDelete = () => {
    startTransition(async () => {
      try {
        await bulkDeleteNotesPermanently(Array.from(selectedIds))
        toast.success(`成功彻底删除了 ${selectedIds.size} 条笔记`)
        setIsSelectionMode(false)
        setSelectedIds(new Set())
        setShowDeleteDialog(false)
      } catch (error) {
        toast.error('删除失败，请重试')
      }
    })
  }

  return (
    <div className="space-y-4">
      {initialNotes.length > 0 && (
        <div className="flex items-center justify-end mb-4 h-10">
          <div className="flex items-center gap-2">
            {isSelectionMode ? (
              <>
                <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
                  {selectedIds.size === initialNotes.length ? <CheckSquare className="mr-2 h-4 w-4" /> : <Square className="mr-2 h-4 w-4" />}
                  全选
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleBulkRestore}
                  disabled={selectedIds.size === 0 || isPending}
                  className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                >
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Undo2 className="mr-2 h-4 w-4" />}
                  恢复 ({selectedIds.size})
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm" 
                  onClick={handleBulkDelete}
                  disabled={selectedIds.size === 0 || isPending}
                >
                  {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                  彻底删除 ({selectedIds.size})
                </Button>
                <Button variant="ghost" size="sm" onClick={toggleSelectionMode} disabled={isPending}>
                  <X className="mr-2 h-4 w-4" />
                  取消
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={toggleSelectionMode}>
                <CheckSquare className="mr-2 h-4 w-4" />
                批量管理
              </Button>
            )}
          </div>
        </div>
      )}

      {initialNotes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {initialNotes.map((note) => (
            <TrashNoteCard 
              key={note.id} 
              note={note} 
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.has(note.id)}
              onSelectChange={(checked) => handleSelectChange(note.id, checked)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-400">
          <Trash2 className="mx-auto mb-4 h-12 w-12 opacity-20" />
          <p>没有已删除的笔记</p>
        </div>
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="批量彻底删除笔记"
        description={`确定要将选中的 ${selectedIds.size} 条笔记永久删除吗？此操作无法撤销。`}
        onConfirm={confirmBulkDelete}
        variant="destructive"
        loading={isPending}
      />
    </div>
  )
}







