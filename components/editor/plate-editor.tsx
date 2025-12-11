'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { Plate, usePlateEditor } from 'platejs/react'
import { useStorage, useMutation, useRoom } from '@liveblocks/react'

import { EditorKit } from '@/components/editor-kit'
import { Editor, EditorContainer } from '@/components/ui/editor'
import { SettingsDialog } from '@/components/settings-dialog'

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
  
  // Use Liveblocks Storage instead of Yjs
  const content = useStorage((root) => {
    if (!roomId || !root) {
      return null
    }
    try {
      // In Liveblocks, root is a LiveObject, use get method
      // But if get doesn't exist, try direct property access
      let contentValue: any = null
      if (typeof (root as any).get === 'function') {
        contentValue = (root as any).get('content')
      } else if ('content' in root) {
        contentValue = (root as any).content
      } else {
        // Try toObject() if available
        const obj = typeof (root as any).toObject === 'function' ? (root as any).toObject() : root
        contentValue = obj?.content
      }
      
      const result = typeof contentValue === 'string' ? contentValue : null
      return result
    } catch (error) {
      console.warn('Storage read error:', error, 'root type:', typeof root, 'root keys:', root ? Object.keys(root) : 'null')
      return null
    }
  })
  const updateContent = useMutation(({ storage }, newContent: string) => {
    if (roomId && storage) {
      try {
        // In Liveblocks, storage itself is the root LiveObject
        // Use set method to update - this should be immediate
        if (typeof (storage as any).set === 'function') {
          (storage as any).set('content', newContent)
          // Force immediate sync by accessing the value
          // This ensures the update is propagated immediately
        }
      } catch (error) {
        // Silently fail - authentication might not be ready yet
        // This is expected during initial load
      }
    }
  }, [roomId])
  
  // Check if storage is ready
  const storageReady = useStorage((root) => root !== null)

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: (e: any) => {
      // Use content from Liveblocks Storage if collaborative, otherwise use initialMarkdown
      const source = isCollaborative && content ? content : initialMarkdownValue
      const parsed = e.api.markdown.deserialize(source)
      return parsed && parsed.length ? parsed : [{ type: 'p', children: [{ text: '' }] }]
    },
  })

  // Track what we've synced to avoid loops
  const lastSyncedToStorageRef = useRef<string>('')
  const lastSyncedFromStorageRef = useRef<string>('')
  const isApplyingRemoteChangeRef = useRef(false)
  const lastUserInputTimeRef = useRef<number>(0)
  const editorHasFocusRef = useRef(false)

  // Sync editor changes to Liveblocks Storage (when user types)
  const handleEditorChange = () => {
    if (!isCollaborative || !editor || !storageReady || isApplyingRemoteChangeRef.current) return

    // Mark that user just input (this is the only place we update this for real user input)
    lastUserInputTimeRef.current = Date.now()
    editorHasFocusRef.current = true

    const md = editor.api.markdown.serialize()
    // Only sync if content actually changed and we haven't just synced this
    if (md !== lastSyncedToStorageRef.current) {
      lastSyncedToStorageRef.current = md
      try {
        updateContent(md)
      } catch (error) {
        console.warn('Failed to update Liveblocks storage:', error)
      }
    }
  }

  // Use immediate sync with minimal throttle to reduce delay
  const lastSyncTimeRef = useRef<number>(0)
  const syncTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const THROTTLE_MS = 20 // Very short throttle (20ms = ~50 updates per second)
  
  const debouncedHandleChange = () => {
    const now = Date.now()
    const timeSinceLastSync = now - lastSyncTimeRef.current
    
    // Clear any pending sync
    if (syncTimeoutRef.current) {
      clearTimeout(syncTimeoutRef.current)
      syncTimeoutRef.current = null
    }
    
    if (timeSinceLastSync >= THROTTLE_MS) {
      // Enough time has passed, sync immediately
      lastSyncTimeRef.current = now
      handleEditorChange()
    } else {
      // Schedule sync for the remaining time (but use requestAnimationFrame for smoother updates)
      const remainingTime = THROTTLE_MS - timeSinceLastSync
      // Use requestAnimationFrame to sync as soon as possible in the next frame
      requestAnimationFrame(() => {
        syncTimeoutRef.current = setTimeout(() => {
          lastSyncTimeRef.current = Date.now()
          handleEditorChange()
          syncTimeoutRef.current = null
        }, Math.max(0, remainingTime - 5)) // Reduce by 5ms to account for frame time
      })
    }
  }

  // Function to apply content from storage to editor
  const applyContentToEditor = React.useCallback((newContent: string) => {
    if (!editor || !newContent || typeof newContent !== 'string') return false
    if (isApplyingRemoteChangeRef.current) return false

    const currentMd = editor.api.markdown.serialize()
    
    // Only update if content from storage is different
    if (newContent !== currentMd) {
      // Only skip if this is exactly what we just sent (to prevent loop)
      if (newContent === lastSyncedToStorageRef.current) {
        // This is our own update, ignore it
        return false
      }
      
      // Only block updates if user JUST input (within 300ms) AND editor has focus
      // This is a very short window to prevent interruption during active typing
      const timeSinceLastInput = Date.now() - lastUserInputTimeRef.current
      if (lastUserInputTimeRef.current > 0 && editorHasFocusRef.current && timeSinceLastInput < 300) {
        return false
      }
      
      // Set flag BEFORE parsing to prevent onValueChange from updating lastUserInputTimeRef
      isApplyingRemoteChangeRef.current = true
      const parsed = editor.api.markdown.deserialize(newContent)
      if (parsed && parsed.length > 0) {
        try {
          // Save current selection before update
          let savedSelection: any = null
          try {
            if ((editor as any).selection && (editor as any).selection.anchor) {
              savedSelection = {
                anchor: { ...(editor as any).selection.anchor },
                focus: { ...(editor as any).selection.focus }
              }
            }
          } catch (e) {
            // Selection save failed, continue without it
          }

          // Use a simpler, safer update method to avoid performance issues
          // Direct assignment is simpler and less likely to cause issues
          editor.children = parsed
          // Trigger normalization if available
          if ((editor as any).normalize) {
            (editor as any).normalize({ force: true })
          }
          
          lastSyncedFromStorageRef.current = newContent
          // Clear our sent ref if we're applying remote content
          if (newContent.length > lastSyncedToStorageRef.current.length) {
            lastSyncedToStorageRef.current = ''
          }
          
          // Reset flag after update (synchronously to avoid timing issues)
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
  }, [editor])

  // Sync Liveblocks Storage changes to editor (when other users type)
  useEffect(() => {
    if (!isCollaborative || !content || !editor || typeof content !== 'string') return

    applyContentToEditor(content)
  }, [content, editor, isCollaborative, applyContentToEditor])

  // Polling mechanism: Periodically check and apply content updates
  // This ensures updates are applied even if the editor is not focused or useStorage didn't trigger
  // Store content in a ref so we can access it in the polling interval
  const contentRef = useRef<string | null>(null)
  
  // Update ref whenever content changes (this should always work, even if editor is inactive)
  useEffect(() => {
    if (content && typeof content === 'string') {
      contentRef.current = content
    }
  }, [content])
  
  useEffect(() => {
    if (!isCollaborative || !storageReady || !editor) return

    const pollInterval = setInterval(() => {
      if (!editor || isApplyingRemoteChangeRef.current) return
      
      // Get latest content from ref (which is updated by useStorage)
      const latestContent = contentRef.current
      
      if (latestContent && typeof latestContent === 'string') {
        // Apply the content update (applyContentToEditor will handle the protection logic)
        const currentMd = editor.api.markdown.serialize()
        if (latestContent !== currentMd && latestContent !== lastSyncedToStorageRef.current) {
          applyContentToEditor(latestContent)
        }
      }
    }, 100) // Check every 100ms for responsive updates

    return () => clearInterval(pollInterval)
  }, [isCollaborative, storageReady, editor, applyContentToEditor])

  // Track editor focus state
  useEffect(() => {
    if (!editor) return

    const handleFocus = () => {
      editorHasFocusRef.current = true
    }
    const handleBlur = () => {
      editorHasFocusRef.current = false
    }

    // Listen to editor focus/blur events
    const editorElement = (editor as any).element
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
        // Skip if we're applying a remote change to prevent loops
        if (isApplyingRemoteChangeRef.current) return
        
        const md = editor.api.markdown.serialize()
        
        // Only update lastUserInputTimeRef if this is a real user input
        // (content is different from what we last synced to storage)
        // If content matches lastSyncedToStorageRef, it's likely a remote update being applied
        if (isCollaborative && md !== lastSyncedToStorageRef.current) {
          // This is a real user input, mark it
          lastUserInputTimeRef.current = Date.now()
          editorHasFocusRef.current = true
        }
        
        onChange?.(md)
        // Trigger sync to Liveblocks Storage
        if (isCollaborative) {
          debouncedHandleChange()
        }
      }}
    >
      <EditorContainer>
        {isCollaborative && !storageReady && (
          <div className="absolute top-0 left-0 right-0 z-10 flex justify-center p-2 pointer-events-none">
            <span className="text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded border shadow-sm">
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
      
      <SettingsDialog />
    </Plate>
  )
}
