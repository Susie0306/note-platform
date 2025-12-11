'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { ConfirmDialog } from '@/components/ConfirmDialog'
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
  isSelectionMode?: boolean
  isSelected?: boolean
  onSelectChange?: (checked: boolean) => void
}

export function NoteCard({ 
  note, 
  isSelectionMode = false,
  isSelected = false,
  onSelectChange
}: NoteCardProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.preventDefault() // 防止触发 Link 跳转
    e.stopPropagation()
    setShowDeleteDialog(true)
  }

  const handleConfirmDelete = () => {
    startTransition(async () => {
      await deleteNote(note.id)
      setShowDeleteDialog(false)
    })
  }

  // 标签点击处理函数
  const handleTagClick = (e: React.MouseEvent, tagName: string) => {
    e.preventDefault() // 阻止 Link 跳转详情页
    e.stopPropagation() // 阻止事件冒泡
    router.push(`/search?tag=${tagName}`) // 跳转到搜索页并带上参数
  }

  const handleCheckboxClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    // Checkbox internal logic handles the state change via onCheckedChange,
    // but we need to stop propagation here to avoid Link navigation.
  }

  return (
    <div className="relative group h-full">
      {/* Checkbox for selection */}
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

      <Link href={`/notes/${note.id}`} className="block h-full">
        <Card className={`group relative flex h-full cursor-pointer flex-col transition-shadow hover:shadow-md ${isSelected ? 'ring-2 ring-primary border-primary' : ''}`}>
          <CardHeader>
            <CardTitle className="line-clamp-1 text-lg pr-6">{note.title || '无标题笔记'}</CardTitle>
          </CardHeader>
          <CardContent className="flex-1 space-y-3">
            {note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {note.tags.map((tag) => (
                  <Badge
                    key={tag.id}
                    variant="outline"
                    className="bg-primary/10 text-primary hover:bg-primary/20 cursor-pointer border-transparent text-xs font-normal transition-colors"
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
            {/* 在选择模式下隐藏单个删除按钮，以免混淆 */}
            {!isSelectionMode && (
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 text-red-500 opacity-0 transition-opacity group-hover:opacity-100"
                onClick={handleDeleteClick}
                disabled={isPending}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            )}

            <ConfirmDialog
              open={showDeleteDialog}
              onOpenChange={setShowDeleteDialog}
              title="删除笔记"
              description="确定要将这条笔记移至回收站吗？可以在回收站中恢复。"
              onConfirm={handleConfirmDelete}
              variant="destructive"
              loading={isPending}
            />
          </CardFooter>
        </Card>
      </Link>
    </div>
  )
}
