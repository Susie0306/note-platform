'use client'

import React, { useEffect, useMemo, useRef, useState, useTransition } from 'react'
import dynamic from 'next/dynamic'
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
import { RoomProvider, useMyPresence, useOthers } from '@/lib/liveblocks.config'
import { FolderSelector } from '@/components/FolderSelector'
import { ShareButton } from '@/components/ShareButton'
import { TagInput } from '@/components/TagInput'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { updateNote } from '@/app/actions/notes'

type Presence = {
  cursor: { x: number; y: number } | null
  selection: any | null // Slate Selection
  name: string
  color: string
}

type UserMeta = {
  id: string
  info: {
    name: string
    color: string
    avatar: string
  }
}

const PlateEditor = dynamic(
  () => import('@/components/editor/plate-editor').then((mod) => mod.PlateEditor),
  {
    ssr: false,
    loading: () => <div className="bg-muted/20 h-[500px] w-full animate-pulse rounded-md" />,
  }
)

interface NoteEditorProps {
  noteId: string
  initialTitle: string
  initialContent: string
  initialTags: string[]
  initialCreatedAt: Date
  initialFolderId?: string | null
  initialFolderName?: string | null
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
  const displayName = isLoaded ? (user?.fullName ?? user?.username ?? '我') : '我'
  const userColor = useMemo(() => pickColor(user?.id ?? roomId), [roomId, user?.id])

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ cursor: null, selection: null, name: displayName, color: userColor }}
      initialStorage={{ content: props.initialContent || '' }}
    >
      <ClientSideSuspense
        fallback={
          <div className="text-muted-foreground flex h-full items-center justify-center text-sm">
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
  initialFolderId,
  initialFolderName,
  roomId,
  userName,
  userColor,
}: CollaborativeNoteEditorProps) {
  // 状态管理
  const [title, setTitle] = useState(initialTitle || '')
  const [content, setContent] = useState(initialContent || '')
  const [tags, setTags] = useState<string[]>(initialTags || [])
  const [folderId, setFolderId] = useState<string | null>(initialFolderId || null)

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
      ...others.map((other) => {
        const presence = other.presence as Presence
        const info = other.info as UserMeta['info']
        return {
          id: `conn-${other.connectionId}`,
          name: presence?.name ?? info?.name ?? '协作者',
          color: presence?.color ?? info?.color ?? collaboratorColors[0],
        }
      }),
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
        <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="无标题笔记"
            className="placeholder:text-muted-foreground/50 h-auto w-full min-w-0 border-none px-0 text-3xl font-extrabold tracking-tight shadow-none focus-visible:ring-0 sm:text-4xl md:text-5xl"
          />
          <div className="text-muted-foreground/80 flex flex-shrink-0 items-center gap-2 text-sm">
            <div className="flex flex-col items-center justify-center gap-0.5">
              <div className="flex -space-x-2">
                {collaboratorAvatars.slice(0, 4).map((member) => (
                  <span
                    key={member.id}
                    className="border-background ring-background inline-flex h-6 w-6 items-center justify-center rounded-full border text-[9px] font-medium text-white shadow-sm ring-1"
                    style={{ backgroundColor: member.color }}
                  >
                    {member.name?.[0] ?? '友'}
                  </span>
                ))}
              </div>
              <span className="text-muted-foreground whitespace-nowrap text-[10px] leading-none">
                {others.length + 1} 人在线
              </span>
            </div>
            <FolderSelector 
              noteId={noteId} 
              currentFolderId={folderId} 
              currentFolderName={initialFolderName} 
              onChange={setFolderId} 
            />
            <ShareButton />
            <div className="hidden items-center gap-1 text-xs sm:flex sm:text-sm">
              {isSaving ? (
                <span className="flex items-center gap-1 text-blue-600 dark:text-blue-400">
                  <Cloud className="h-3 w-3 animate-pulse sm:h-4 sm:w-4" />
                  <span className="hidden lg:inline">保存中...</span>
                </span>
              ) : lastSaved ? (
                <span className="text-muted-foreground flex items-center gap-1">
                  {saveLocation === 'local' ? (
                    <HardDrive className="h-3 w-3 text-orange-600 sm:h-4 sm:w-4 dark:text-orange-400" />
                  ) : (
                    <Cloud className="h-3 w-3 text-green-600 sm:h-4 sm:w-4 dark:text-green-400" />
                  )}
                  <span className="xs:inline hidden whitespace-nowrap">
                    {saveLocation === 'local' ? '已存本地' : '已同步'}
                  </span>
                  <span className="hidden xl:inline">
                    {lastSaved.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </span>
              ) : (
                <span className="text-muted-foreground flex items-center gap-1">
                  <CloudOff className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden lg:inline">未保存</span>
                </span>
              )}
            </div>
            <Button
              onClick={handleManualSave}
              disabled={isSaving}
              variant="outline"
              size="sm"
              className="border-input bg-background hover:bg-background hover:text-foreground text-foreground ml-auto shadow-sm md:ml-2"
            >
              <Save className="mr-2 h-4 w-4" /> <span className="hidden sm:inline">保存</span>
            </Button>
          </div>
        </div>
        <TagInput tags={tags} setTags={setTags} />
      </div>

      {/* 编辑器主体 */}
      <div className="flex flex-1 overflow-hidden rounded-lg border bg-white shadow-sm dark:bg-zinc-950">
        <div className="h-full w-full overflow-y-auto">
          {/* 核心集成点：数据双向绑定 */}
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
