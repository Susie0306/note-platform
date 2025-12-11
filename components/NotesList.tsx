'use client'

import { useState, useTransition } from 'react'
import { Note, Tag } from '@prisma/client'
import { Trash2, X, CheckSquare, Square, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { NoteCard } from '@/components/NoteCard'
import { Button } from '@/components/ui/button'
import { ConfirmDialog } from '@/components/ConfirmDialog'
import { bulkDeleteNotes } from '@/app/actions/notes'

interface NotesListProps {
  initialNotes: (Note & { tags: Tag[] })[]
}

export function NotesList({ initialNotes }: NotesListProps) {
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

  const handleBulkDelete = () => {
    if (selectedIds.size === 0) return
    setShowDeleteDialog(true)
  }

  const confirmBulkDelete = () => {
    startTransition(async () => {
      try {
        await bulkDeleteNotes(Array.from(selectedIds))
        toast.success(`成功删除了 ${selectedIds.size} 条笔记`)
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
      <div className="flex items-center justify-between mb-4 h-10">
        <div className="flex items-center gap-2">
           {/* If we want to show stats or title here */}
        </div>
        
        <div className="flex items-center gap-2">
          {isSelectionMode ? (
            <>
              <Button variant="ghost" size="sm" onClick={toggleSelectAll}>
                {selectedIds.size === initialNotes.length ? <CheckSquare className="mr-2 h-4 w-4" /> : <Square className="mr-2 h-4 w-4" />}
                全选
              </Button>
              <Button 
                variant="destructive" 
                size="sm" 
                onClick={handleBulkDelete}
                disabled={selectedIds.size === 0 || isPending}
              >
                {isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Trash2 className="mr-2 h-4 w-4" />}
                删除 ({selectedIds.size})
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

      {initialNotes.length > 0 ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {initialNotes.map((note) => (
            <NoteCard 
              key={note.id} 
              note={note} 
              isSelectionMode={isSelectionMode}
              isSelected={selectedIds.has(note.id)}
              onSelectChange={(checked) => handleSelectChange(note.id, checked)}
            />
          ))}
        </div>
      ) : (
        <div className="py-20 text-center text-gray-500">
          <p>还没有笔记，点击左侧“新建笔记”开始吧！</p>
        </div>
      )}

      <ConfirmDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        title="批量删除笔记"
        description={`确定要将选中的 ${selectedIds.size} 条笔记移至回收站吗？`}
        onConfirm={confirmBulkDelete}
        variant="destructive"
        loading={isPending}
      />
    </div>
  )
}
