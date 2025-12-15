'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { useMutation, useRoom, useStorage, useUpdateMyPresence } from '@liveblocks/react'
import { Plate, usePlateEditor } from 'platejs/react'

import { EditorKit } from '@/components/editor-kit'
import { Editor, EditorContainer } from '@/components/ui/editor'
import { LiveblocksCursorOverlay } from '@/components/LiveblocksCursorOverlay'

interface PlateEditorProps {
  initialMarkdown?: string
  onChange?: (markdown: string) => void
  roomId?: string
  userName?: string
  userColor?: string
}

export function PlateEditor({
  initialMarkdown,
  onChange,
  roomId,
  userName,
  userColor,
}: PlateEditorProps) {
  const initialMarkdownValue = initialMarkdown ?? ''
  const isCollaborative = Boolean(roomId)

  // 使用 Liveblocks Storage 代替 Yjs
  const content = useStorage((root: any) => {
    if (!roomId || !root) {
      return null
    }
    try {
      // 在 Liveblocks 中，root 是 LiveObject，使用 get 方法
      // 但是如果 get 不存在，尝试直接属性访问
      let contentValue: any = null
      if (typeof root.get === 'function') {
        contentValue = root.get('content')
      } else if ('content' in root) {
        contentValue = root.content
      } else {
        // 如果可用，尝试 toObject()
        const obj = typeof root.toObject === 'function' ? root.toObject() : root
        contentValue = obj?.content
      }

      const result = typeof contentValue === 'string' ? contentValue : null
      return result
    } catch (error) {
      console.warn(
        'Storage read error:',
        error,
        'root type:',
        typeof root,
        'root keys:',
        root ? Object.keys(root) : 'null'
      )
      return null
    }
  })
  const updateContent = useMutation(
    ({ storage }, newContent: string) => {
      if (roomId && storage) {
        try {
          // 在 Liveblocks 中，storage 本身是根 LiveObject
          // 使用 set 方法更新 - 这应该是立即的
          const rootStorage = storage as any
          if (typeof rootStorage.set === 'function') {
            rootStorage.set('content', newContent)
            // 通过访问值强制立即同步
            // 这确保更新立即传播
          }
        } catch (error) {
          // 静默失败 - 身份验证可能尚未准备就绪
          // 这是初始加载期间预期的
        }
      }
    },
    [roomId]
  )

  // 检查存储是否准备就绪
  const storageReady = useStorage((root) => root !== null)

  const editor = usePlateEditor({
    plugins: EditorKit,
  })

  // 初始化编辑器内容
  const initialized = useRef(false)
  if (!initialized.current) {
    const source = isCollaborative && content ? content : initialMarkdownValue
    const e = editor as any
    if (e.api?.markdown) {
      const parsed = e.api.markdown.deserialize(source)
      if (parsed && parsed.length) {
        editor.children = parsed
        if (e.normalize) {
          e.normalize({ force: true })
        }
      }
    }
    initialized.current = true
  }

  // 跟踪我们已同步的内容以避免循环
  const lastSyncedToStorageRef = useRef<string>('')
  const lastSyncedFromStorageRef = useRef<string>('')
  const isApplyingRemoteChangeRef = useRef(false)
  const lastUserInputTimeRef = useRef<number>(0)
  const editorHasFocusRef = useRef(false)
  
  // 用于 CursorOverlay 的容器引用
  const containerRef = useRef<HTMLDivElement>(null)
  
  // 更新 Presence
  const updateMyPresence = useUpdateMyPresence()

  // 将编辑器更改同步到 Liveblocks Storage（当用户输入时）
  const handleEditorChange = () => {
    if (!isCollaborative || !editor || !storageReady || isApplyingRemoteChangeRef.current) return

    // 标记用户刚刚输入（这是我们为真实用户输入更新此内容的唯一地方）
    lastUserInputTimeRef.current = Date.now()
    editorHasFocusRef.current = true

    const md = editor.api.markdown.serialize()
    // 仅当内容实际更改且我们尚未同步此时才同步
    if (md !== lastSyncedToStorageRef.current) {
      lastSyncedToStorageRef.current = md
      try {
        updateContent(md)
      } catch (error) {
        console.warn('Failed to update Liveblocks storage:', error)
      }
    }
  }

  // 使用最小节流的立即同步以减少延迟
  const lastSyncTimeRef = useRef<number>(0)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const THROTTLE_MS = 20 // 非常短的节流（20ms = ~50 次更新/秒）

  const debouncedHandleChange = () => {
    const now = Date.now()
    const timeSinceLastSync = now - lastSyncTimeRef.current

    // 清除任何挂起的同步
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
      syncTimeoutRef.current = null
    }

    if (timeSinceLastSync >= THROTTLE_MS) {
      // 已经过了足够的时间，立即同步
      lastSyncTimeRef.current = now
      handleEditorChange()
    } else {
      // 为剩余时间安排同步（但使用 requestAnimationFrame 以获得更平滑的更新）
      const remainingTime = THROTTLE_MS - timeSinceLastSync
      // 使用 requestAnimationFrame 在下一帧尽快同步
      requestAnimationFrame(() => {
        syncTimeoutRef.current = setTimeout(
          () => {
            lastSyncTimeRef.current = Date.now()
            handleEditorChange()
            syncTimeoutRef.current = null
          },
          Math.max(0, remainingTime - 5)
        ) // 减少 5ms 以考虑帧时间
      })
    }
  }

  // 将内容从存储应用到编辑器的函数
  const applyContentToEditor = React.useCallback(
    (newContent: string) => {
      if (!editor || !newContent || typeof newContent !== 'string') return false
      if (isApplyingRemoteChangeRef.current) return false

      const currentMd = editor.api.markdown.serialize()

      // 仅当存储中的内容不同时更新
      if (newContent !== currentMd) {
        // 仅当我们刚刚发送的内容完全相同时跳过（以防止循环）
        if (newContent === lastSyncedToStorageRef.current) {
          // 这是我们自己的更新，忽略它
          return false
        }

        // 仅当用户刚刚输入（300ms 内）且编辑器具有焦点时阻止更新
        // 这是一个非常短的窗口，以防止在活动输入期间中断
        const timeSinceLastInput = Date.now() - lastUserInputTimeRef.current
        if (
          lastUserInputTimeRef.current > 0 &&
          editorHasFocusRef.current &&
          timeSinceLastInput < 300
        ) {
          return false
        }

        // 在解析之前设置标志，以防止 onValueChange 更新 lastUserInputTimeRef
        isApplyingRemoteChangeRef.current = true
        const parsed = editor.api.markdown.deserialize(newContent)
        if (parsed && parsed.length > 0) {
          try {
            // 更新前保存当前选择
            let savedSelection: any = null
            try {
              if (editor.selection && editor.selection.anchor) {
                savedSelection = {
                  anchor: { ...editor.selection.anchor },
                  focus: { ...editor.selection.focus },
                }
              }
            } catch (e) {
              // 选择保存失败，继续而不保存
            }

            // 使用更简单、更安全的更新方法以避免性能问题
            // 直接赋值更简单，不太可能引起问题
            editor.children = parsed
            // 如果可用，触发规范化
            const e = editor as any
            if (e.normalize) {
              e.normalize({ force: true })
            }

            lastSyncedFromStorageRef.current = newContent
            // 如果我们正在应用远程内容，清除我们发送的引用
            if (newContent.length > lastSyncedToStorageRef.current.length) {
              lastSyncedToStorageRef.current = ''
            }

            // 更新后重置标志（同步以避免计时问题）
            isApplyingRemoteChangeRef.current = false

            return true
          } catch (error) {
            console.error('[Apply] Failed to parse or prepare update:', error)
            isApplyingRemoteChangeRef.current = false
            return false
          }
        } else {
          isApplyingRemoteChangeRef.current = false
          return false
        }
      }
      return false
    },
    [editor]
  )

  // 将 Liveblocks Storage 更改同步到编辑器（当其他用户输入时）
  useEffect(() => {
    if (!isCollaborative || !content || !editor || typeof content !== 'string') return

    applyContentToEditor(content)
  }, [content, editor, isCollaborative, applyContentToEditor])

  // 轮询机制：定期检查并应用内容更新
  // 这确保即使编辑器没有焦点或 useStorage 没有触发，也会应用更新
  // 将内容存储在引用中，以便我们可以在轮询间隔中访问它
  const contentRef = useRef<string | null>(null)

  // 每当内容更改时更新引用（这应该始终有效，即使编辑器处于非活动状态）
  useEffect(() => {
    if (content && typeof content === 'string') {
      contentRef.current = content
    }
  }, [content])

  useEffect(() => {
    if (!isCollaborative || !storageReady || !editor) return

    const pollInterval = setInterval(() => {
      if (!editor || isApplyingRemoteChangeRef.current) return

      // 从引用获取最新内容（由 useStorage 更新）
      const latestContent = contentRef.current

      if (latestContent && typeof latestContent === 'string') {
        // 应用内容更新（applyContentToEditor 将处理保护逻辑）
        const currentMd = editor.api.markdown.serialize()
        if (latestContent !== currentMd && latestContent !== lastSyncedToStorageRef.current) {
          applyContentToEditor(latestContent)
        }
      }
    }, 100) // 每 100ms 检查一次以获得响应式更新

    return () => clearInterval(pollInterval)
  }, [isCollaborative, storageReady, editor, applyContentToEditor])

  // 跟踪编辑器焦点状态
  useEffect(() => {
    if (!editor) return

    const handleFocus = () => {
      editorHasFocusRef.current = true
    }
    const handleBlur = () => {
      editorHasFocusRef.current = false
    }

    // 监听编辑器焦点/模糊事件
    const e = editor as any
    const editorElement = e.element
    if (editorElement) {
      editorElement.addEventListener('focus', handleFocus, true)
      editorElement.addEventListener('blur', handleBlur, true)
      return () => {
        editorElement.removeEventListener('focus', handleFocus, true)
        editorElement.removeEventListener('blur', handleBlur, true)
      }
    }
  }, [editor])

  return (
    <Plate
      editor={editor}
      onValueChange={() => {
        // 如果我们正在应用远程更改，则跳过以防止循环
        if (isApplyingRemoteChangeRef.current) return

        const md = editor.api.markdown.serialize()

        // 仅当这是真实用户输入时更新 lastUserInputTimeRef
        // （内容与我们上次同步到存储的内容不同）
        // 如果内容与 lastSyncedToStorageRef 匹配，则很可能正在应用远程更新
        if (isCollaborative && md !== lastSyncedToStorageRef.current) {
          // 这是真实用户输入，标记它
          lastUserInputTimeRef.current = Date.now()
          editorHasFocusRef.current = true
        }
        
        // 协同光标同步
        if (isCollaborative) {
          // 这里使用 editor.selection 它是当前最新的
          // 不需要防抖，因为光标移动需要实时性
          // 但是 onValueChange 可能不会在仅光标移动时触发？
          // Plate 的 onValueChange 通常是在 document 变化时触发
          // 需要确认 Plate 是否有 onSelectionChange
        }

        onChange?.(md)
        // 触发同步到 Liveblocks Storage
        if (isCollaborative) {
          debouncedHandleChange()
        }
      }}
      onSelectionChange={(editor) => {
         if (isCollaborative && editor.selection) {
            // Liveblocks expects JSON-serializable data. Slate selection is technically compatible
            // but type definitions might conflict. Casting to any or ensuring it's a plain object helps.
            updateMyPresence({ selection: editor.selection as any })
         }
      }}
    >
      <EditorContainer ref={containerRef}>
        {isCollaborative && <LiveblocksCursorOverlay containerRef={containerRef} />}
        {isCollaborative && !storageReady && (
          <div className="pointer-events-none absolute top-0 right-0 left-0 z-10 flex justify-center p-2">
            <span className="text-muted-foreground bg-background/80 rounded border px-2 py-0.5 text-[10px] shadow-sm">
              Connecting...
            </span>
          </div>
        )}
        <Editor
          variant="demo"
          placeholder="Type here..."
          className="min-h-[500px] px-8 py-8 sm:px-12"
        />
      </EditorContainer>
    </Plate>
  )
}
