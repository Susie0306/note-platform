'use client'

import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import { useUser } from '@clerk/nextjs'
import { ClientSideSuspense } from '@liveblocks/react/suspense'
import { Cloud, CloudOff, HardDrive, Save } from 'lucide-react'
import { toast } from 'sonner'
import { useDebouncedCallback } from 'use-debounce'

import {
  enqueueSyncTask,
  saveNoteToLocal,
  type NoteData,
  type NoteUpdatePayload,
} from '@/lib/indexeddb'
// ✅ 引用新的、优化后的编辑器组件
import { PlateEditor } from '@/components/editor/plate-editor'
import { ShareButton } from '@/components/ShareButton'
import { TagInput } from '@/components/TagInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { RoomProvider, useMyPresence, useOthers } from '@/lib/liveblocks.config'
import { updateNote } from '@/app/actions/notes'

interface NoteEditorProps {
  noteId: string
  initialTitle: string
  initialContent: string
  initialTags: string[]
  initialCreatedAt: Date
}

interface CollaborativeNoteEditorProps extends NoteEditorProps {
  roomId: string
  userName: string
  userColor: string
}

const collaboratorColors = [
  '#f97316',
  '#22c55e',
  '#3b82f6',
  '#a855f7',
  '#ef4444',
  '#0ea5e9',
  '#10b981',
]

const pickColor = (seed: string) => {
  if (!seed) return collaboratorColors[0]
  let hash = 0
  for (let i = 0; i < seed.length; i++) {
    hash = (hash << 5) - hash + seed.charCodeAt(i)
    hash |= 0
  }
  const index = Math.abs(hash) % collaboratorColors.length
  return collaboratorColors[index]
}

export function NoteEditor(props: NoteEditorProps) {
  const { user, isLoaded } = useUser()
  const roomId = `note-${props.noteId}`
  const displayName = isLoaded ? user?.fullName ?? user?.username ?? '我' : '我'
  const userColor = useMemo(() => pickColor(user?.id ?? roomId), [roomId, user?.id])

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ cursor: null, name: displayName, color: userColor }}
    >
      <ClientSideSuspense
        fallback={
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            正在连接协同编辑...
          </div>
        }
      >
        {() => (
          <NoteEditorContent
            {...props}
            roomId={roomId}
            userName={displayName}
            userColor={userColor}
          />
        )}
      </ClientSideSuspense>
    </RoomProvider>
  )
}

function NoteEditorContent({
  noteId,
  initialTitle,
  initialContent,
  initialTags,
  initialCreatedAt,
  roomId,
  userName,
  userColor,
}: CollaborativeNoteEditorProps) {
  // 状态管理
  const [title, setTitle] = useState(initialTitle || '')
  const [content, setContent] = useState(initialContent || '')
  const [tags, setTags] = useState<string[]>(initialTags || [])

  // 保存状态
  const [isSaving, startTransition] = useTransition()
  const [lastSaved, setLastSaved] = useState<Date | null>(null)
  const [saveLocation, setSaveLocation] = useState<'cloud' | 'local' | null>(null)

  const isMounted = useRef(false)
  const [, setMyPresence] = useMyPresence()
  const others = useOthers()
  const collaboratorAvatars = useMemo(
    () => [
      { id: 'me', name: userName, color: userColor },
      ...others.map((other) => ({
        id: `conn-${other.connectionId}`,
        name:
          (other.presence as any)?.name ??
          (other.info as any)?.name ??
          '协作者',
        color:
          (other.presence as any)?.color ??
          (other.info as any)?.color ??
          collaboratorColors[0],
      })),
    ],
    [others, userColor, userName]
  )

  useEffect(() => {
    setMyPresence({ name: userName, color: userColor })
  }, [setMyPresence, userColor, userName])

  // --- 保存逻辑 (保持不变，省略部分注释以精简) ---
  const performSave = async (title: string, content: string, tags: string[]) => {
    const now = new Date()
    const noteData: NoteData = {
      id: noteId,
      title,
      content,
      tags: tags.map((name) => ({ id: 'local', name })),
      createdAt: initialCreatedAt,
      updatedAt: now,
    }
    const payload: NoteUpdatePayload = { title, content, tags }

    if (navigator.onLine) {
      try {
        await updateNote(noteId, title, content, tags)
        await saveNoteToLocal(noteData)
        setSaveLocation('cloud')
        setLastSaved(now)
      } catch (error) {
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
      toast.error('本地保存失败')
    }
  }

  const debouncedSave = useDebouncedCallback((t, c, tg) => {
    if (!isMounted.current) return
    startTransition(() => performSave(t, c, tg))
  }, 1000)

  useEffect(() => {
    if (isMounted.current) debouncedSave(title, content, tags)
    else isMounted.current = true
  }, [title, content, tags, debouncedSave])

  const handleManualSave = () => {
    debouncedSave.cancel()
    startTransition(async () => {
      await performSave(title, content, tags)
      toast.success(navigator.onLine ? '已保存' : '已存本地')
    })
  }

  // 快捷键 Ctrl+S
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
      {/* 顶部元数据栏 */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between gap-4">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="无标题笔记"
            className="placeholder:text-muted-foreground/50 h-auto w-full min-w-0 border-none px-0 text-4xl sm:text-5xl md:text-5xl font-extrabold tracking-tight shadow-none focus-visible:ring-0"
          />
          <div className="flex items-center gap-3 text-sm text-gray-400">
            <div className="flex items-center gap-2">
              <div className="flex -space-x-2">
                {collaboratorAvatars.slice(0, 4).map((member) => (
                  <span
                    key={member.id}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-white text-[10px] font-medium text-white shadow-sm"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name?.[0] ?? '友'}
                  </span>
                ))}
              </div>
              <span>{others.length + 1} 人在线</span>
            </div>
            <ShareButton />
            {isSaving ? (
              <span className="flex items-center gap-1 text-blue-500">
                <Cloud className="h-4 w-4 animate-pulse" /> 保存中...
              </span>
            ) : lastSaved ? (
              <span className="flex items-center gap-1">
                {saveLocation === 'local' ? (
                  <HardDrive className="h-4 w-4 text-orange-500" />
                ) : (
                  <Cloud className="h-4 w-4 text-green-500" />
                )}
                {saveLocation === 'local' ? '已存本地' : '已同步'} {lastSaved.toLocaleTimeString()}
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <CloudOff className="h-4 w-4" /> 未保存
              </span>
            )}
            <Button
              onClick={handleManualSave}
              disabled={isSaving}
              variant="outline"
              size="sm"
              className="ml-2"
            >
              <Save className="mr-2 h-4 w-4" /> 保存
            </Button>
          </div>
        </div>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* 编辑器主体 */}
      <div className="flex flex-1 overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-zinc-950">
        <div className="h-full w-full overflow-y-auto">
          {/* ✅ 核心集成点：数据双向绑定 */}
          <PlateEditor
            roomId={roomId}
            userName={userName}
            userColor={userColor}
            initialMarkdown={content}
            onChange={(md) => setContent(md)}
          />
        </div>
      </div>
    </div>
  )
}
