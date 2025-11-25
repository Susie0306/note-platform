'use client'

import React, { useEffect, useState, useTransition } from 'react'
import { Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'

import { TagInput } from '@/components/TagInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { updateNote } from '@/app/actions/notes'

interface NoteEditorProps {
  noteId: string
  initialTitle: string
  initialContent: string
  initialTags: string[]
}

export function NoteEditor({ noteId, initialTitle, initialContent, initialTags }: NoteEditorProps) {
  //  状态管理
  const [title, setTitle] = useState(initialTitle || '')
  const [content, setContent] = useState(initialContent || '')
  const [tags, setTags] = useState<string[]>(initialTags || [])
  const [isSaving, startTransition] = useTransition()
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // 处理保存 (手动点击 + 快捷键 Ctrl/Cmd+S)
  const handleSave = async () => {
    startTransition(async () => {
      try {
        await updateNote(noteId, title, content, tags)
        setLastSaved(new Date())
        toast.success('保存成功')
      } catch (error) {
        toast.error('保存失败，请重试')
      }
    })
  }

  // 监听快捷键
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [title, content, tags])

  return (
    <div className="flex h-[calc(100vh-120px)] flex-col space-y-4">
      {/* 顶部区域：标题 + 保存按钮 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入笔记标题..."
            className="h-auto border-none px-0 text-2xl font-bold shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center gap-2">
            {lastSaved && (
              <span className="text-xs text-gray-400">已保存 {lastSaved.toLocaleTimeString()}</span>
            )}
            <Button onClick={handleSave} disabled={isSaving} size="sm">
              <Save className="mr-2 h-4 w-4" />
              {isSaving ? '保存中...' : '保存'}
            </Button>
          </div>
        </div>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* 主体区域：两栏布局 */}
      <div className="flex flex-1 gap-4 overflow-hidden rounded-lg border bg-white shadow-sm">
        {/* 左侧：编辑区 */}
        <div className="h-full w-1/2 border-r bg-gray-50">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="开始用 Markdown 写作..."
            className="h-full w-full resize-none border-none bg-transparent p-4 font-mono text-sm focus-visible:ring-0"
          />
        </div>

        {/* 右侧：预览区 */}
        <div className="prose prose-slate dark:prose-invert h-full w-1/2 max-w-none overflow-y-auto p-8">
          {/* prose 类名来自 @tailwindcss/typography，自动美化 Markdown */}
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
              a: ({ node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
            }}
          >
            {content || '*预览区域*'}
          </ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
