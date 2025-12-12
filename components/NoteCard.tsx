'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Trash2 } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

import { ConfirmDialog } from '@/components/ConfirmDialog'
import { FolderSelector } from '@/components/FolderSelector'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { deleteNote } from '@/app/actions/notes'

// 定义 Props 类型，这里直接对应 Prisma 返回的数据结构
interface NoteCardProps {
  note: {
    id: string
    title: string
    content: string | null
    createdAt: Date
    tags: { id: string; name: string }[]
    folderId?: string | null
  }
  isSelectionMode?: boolean
  isSelected?: boolean
  onSelectChange?: (checked: boolean) => void
  onUpdate?: () => void
}

export function NoteCard({
  note,
  isSelectionMode = false,
  isSelected = false,
  onSelectChange,
  onUpdate,
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
    // 复选框内部逻辑通过 onCheckedChange 处理状态更改，
    // 但我们需要在此处阻止传播以避免 Link 导航。
  }

  return (
    <div className="group relative h-full">
      {/* 用于选择的复选框 */}
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

      <Card
        className={`group relative flex h-full flex-col transition-shadow hover:shadow-md ${isSelected ? 'ring-primary border-primary ring-2' : ''}`}
      >
        <Link href={`/notes/${note.id}`} className="flex flex-1 cursor-pointer flex-col">
          <CardHeader>
            <CardTitle className="line-clamp-1 pr-6 text-lg">
              {note.title || '无标题笔记'}
            </CardTitle>
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
            {/* Markdown 预览区域 */}
            <div className="relative h-[4.5em] overflow-hidden text-sm text-gray-500">
              <div className="prose prose-sm dark:prose-invert pointer-events-none max-w-none [&>*:first-child]:mt-0">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    // 禁用图片渲染或限制图片大小，避免破坏卡片布局
                    img: ({ node, ...props }) => (
                      <span className="text-muted-foreground text-xs">[图片]</span>
                    ),
                    // 简化标题显示，避免太大
                    h1: ({ node, ...props }) => (
                      <p className="mb-1 text-base font-bold" {...props} />
                    ),
                    h2: ({ node, ...props }) => (
                      <p className="mb-1 text-base font-bold" {...props} />
                    ),
                    h3: ({ node, ...props }) => (
                      <p className="mb-1 text-base font-bold" {...props} />
                    ),
                    // 确保列表紧凑
                    ul: ({ node, ...props }) => <ul className="my-0.5 list-disc pl-4" {...props} />,
                    ol: ({ node, ...props }) => (
                      <ol className="my-0.5 list-decimal pl-4" {...props} />
                    ),
                    li: ({ node, ...props }) => <li className="my-0" {...props} />,
                    p: ({ node, ...props }) => <p className="my-0.5 leading-snug" {...props} />,
                  }}
                >
                  {note.content || '暂无内容...'}
                </ReactMarkdown>
              </div>
            </div>
          </CardContent>
        </Link>
        <CardFooter className="flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-2">
            <span>
              {formatDistanceToNow(new Date(note.createdAt), {
                addSuffix: true,
                locale: zhCN,
              })}
            </span>
            <div
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <FolderSelector
                noteId={note.id}
                currentFolderId={note.folderId}
                onUpdate={onUpdate}
              />
            </div>
          </div>

          {/* 删除按钮 */}
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
    </div>
  )
}
