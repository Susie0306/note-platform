'use client'

import React, { useEffect, useRef, useState, useTransition } from 'react'
import { Cloud, CloudOff, HardDrive, Save } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

// 引入本地数据库工具
import {
  enqueueSyncTask,
  saveNoteToLocal,
  type NoteData,
  type NoteUpdatePayload,
} from '@/lib/indexeddb'
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
  initialCreatedAt: Date
}

export function NoteEditor({
  noteId,
  initialTitle,
  initialContent,
  initialTags,
  initialCreatedAt,
}: NoteEditorProps) {
  const [title, setTitle] = useState(initialTitle || '')
  const [content, setContent] = useState(initialContent || '')
  const [tags, setTags] = useState<string[]>(initialTags || [])

  const [isSaving, startTransition] = useTransition()
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveLocation, setSaveLocation] = useState<'cloud' | 'local' | null>(null)

  const isMounted = useRef(false)

  // 核心保存逻辑
  const performSave = async (
    currentTitle: string,
    currentContent: string,
    currentTags: string[]
  ) => {
    const now = new Date()

    const noteData: NoteData = {
      id: noteId,
      title: currentTitle,
      content: currentContent,
      tags: currentTags.map((name) => ({ id: 'local-temp', name })),
      createdAt: initialCreatedAt,
      updatedAt: now,
    }

    const payload: NoteUpdatePayload = {
      title: currentTitle,
      content: currentContent,
      tags: currentTags,
    }

    if (navigator.onLine) {
      try {
        await updateNote(noteId, currentTitle, currentContent, currentTags)
        await saveNoteToLocal(noteData)
        setSaveLocation('cloud')
        setLastSaved(now)
      } catch (error) {
        console.error('云端保存失败，尝试降级到本地...', error)
        await fallbackToLocal(noteData, payload)
      }
    } else {
      await fallbackToLocal(noteData, payload)
    }
  }

  const fallbackToLocal = async (noteData: NoteData, payload: NoteUpdatePayload) => {
    try {
      await saveNoteToLocal(noteData)
      await enqueueSyncTask('UPDATE', noteId, payload)
      setSaveLocation('local')
      setLastSaved(new Date())
    } catch (err) {
      console.error('本地保存失败', err)
      toast.error('保存失败：无法写入本地存储')
    }
  }

  const debouncedSave = useDebouncedCallback((t: string, c: string, tg: string[]) => {
    if (!isMounted.current) return
    startTransition(() => performSave(t, c, tg))
  }, 1000)

  useEffect(() => {
    if (isMounted.current) {
      debouncedSave(title, content, tags)
    } else {
      isMounted.current = true
    }
  }, [title, content, tags, debouncedSave])

  const handleManualSave = () => {
    debouncedSave.cancel()
    startTransition(async () => {
      await performSave(title, content, tags)
      toast.success(navigator.onLine ? '已保存到云端' : '已保存到本地')
    })
  }

  // 快捷键
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
            {isSaving ? (
              <span className="flex items-center gap-1 text-blue-500">
                <Cloud className="h-4 w-4 animate-pulse" />
                保存中...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1 transition-colors duration-500">
                {saveLocation === 'local' ? (
                  <HardDrive className="h-4 w-4 text-orange-500" />
                ) : (
                  <Cloud className="h-4 w-4 text-green-500" />
                )}
                {saveLocation === 'local' ? '已存本地' : '已同步'} {lastSaved.toLocaleTimeString()}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CloudOff className="h-4 w-4" />
                未保存
              </span>
            )}

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

      <div className="flex flex-1 gap-4 overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-zinc-950">
        <div className="h-full w-1/2 border-r bg-gray-50 dark:bg-zinc-900/50">
          <Textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="开始用 Markdown 写作..."
            className="h-full w-full resize-none border-none bg-transparent p-4 font-mono text-sm focus-visible:ring-0"
          />
        </div>

        <div className="prose prose-slate dark:prose-invert h-full w-1/2 max-w-none overflow-y-auto p-8">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content || '*预览区域*'}</ReactMarkdown>
        </div>
      </div>
    </div>
  )
}
