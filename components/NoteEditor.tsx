'use client'

import React, { useEffect, useRef, useState, useTransition } from 'react'
import { Cloud, CloudOff, Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

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
  const [title, setTitle] = useState(initialTitle || '')
  const [content, setContent] = useState(initialContent || '')
  const [tags, setTags] = useState<string[]>(initialTags || [])

  const [isSaving, startTransition] = useTransition()
  const [lastSaved, setLastSaved] = useState<Date | null>(null)

  // 使用 ref 来避免初始加载时触发自动保存
  const isMounted = useRef(false)

  // 核心逻辑：创建一个防抖的保存函数
  // 当用户停止输入 1000ms (1秒) 后，才会真正执行这个函数
  const debouncedSave = useDebouncedCallback(async (currentTitle, currentContent, currentTags) => {
    // 如果还没挂载（刚进页面），不保存
    if (!isMounted.current) return

    startTransition(async () => {
      try {
        await updateNote(noteId, currentTitle, currentContent, currentTags)
        setLastSaved(new Date())
        // 自动保存通常不需要弹 toast 干扰用户，右上角状态显示即可
        // toast.success('自动保存成功')
      } catch (error) {
        console.error('自动保存失败', error)
        toast.error('自动保存失败')
      }
    })
  }, 1000)

  // 监听数据变化，触发防抖保存
  useEffect(() => {
    if (isMounted.current) {
      debouncedSave(title, content, tags)
    } else {
      isMounted.current = true
    }
  }, [title, content, tags, debouncedSave])

  // 手动保存（点击按钮或快捷键）- 立即执行
  const handleManualSave = async () => {
    debouncedSave.cancel() // 取消还在排队的自动保存
    startTransition(async () => {
      try {
        await updateNote(noteId, title, content, tags)
        setLastSaved(new Date())
        toast.success('保存成功')
      } catch (error) {
        toast.error('保存失败')
      }
    })
  }

  // 快捷键监听
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault()
        handleManualSave()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [title, content, tags])

  return (
    <div className="flex h-[calc(100dvh-130px)] flex-col space-y-4">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入笔记标题..."
            className="placeholder:text-muted-foreground/70 h-auto border-none px-0 text-4xl font-bold shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center gap-2 text-sm text-gray-400">
            {/* 状态展示区域优化 */}
            {isSaving ? (
              <span className="flex items-center gap-1 text-blue-500">
                <Cloud className="h-4 w-4 animate-pulse" />
                保存中...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1">
                <Cloud className="h-4 w-4" />
                已保存 {lastSaved.toLocaleTimeString()}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CloudOff className="h-4 w-4" />
                未保存
              </span>
            )}

            {/* 保留手动保存按钮，以防万一 */}
            <Button
              onClick={handleManualSave}
              disabled={isSaving}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              <Save className="mr-2 h-4 w-4" />
              保存
            </Button>
          </div>
        </div>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* ... 主体区域 ... */}
      <div className="flex flex-1 gap-4 overflow-hidden rounded-lg border bg-white shadow-sm">
        <div className="h-full w-1/2 border-r bg-gray-50">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="开始用 Markdown 写作..."
            className="h-full w-full resize-none border-none bg-transparent p-4 font-mono text-sm focus-visible:ring-0"
          />
        </div>

        <div className="prose prose-slate dark:prose-invert h-full w-1/2 max-w-none overflow-y-auto p-8">
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
