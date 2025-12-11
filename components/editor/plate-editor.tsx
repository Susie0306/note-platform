'use client'

import React, { useEffect, useMemo, useState, useRef } from 'react'
import { BaseYjsPlugin } from '@platejs/yjs'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import * as Y from 'yjs'
import { Plate, usePlateEditor } from 'platejs/react'

import { EditorKit } from '@/components/editor-kit'
import { Editor, EditorContainer } from '@/components/ui/editor'
import { SettingsDialog } from '@/components/settings-dialog'
import { useRoom } from '@/lib/liveblocks.config'

class LiveblocksProviderAdapter {
  public type = 'liveblocks'
  public awareness: any
  public document: Y.Doc
  public provider: LiveblocksYjsProvider

  constructor(room: any, doc: Y.Doc) {
    this.document = doc
    this.provider = new LiveblocksYjsProvider(room, doc, {
      offlineSupport_experimental: true,
    })
    this.awareness = this.provider.awareness
  }

  connect() {
    this.provider.connect()
  }

  disconnect() {
    this.provider.disconnect()
  }

  destroy() {
    this.provider.destroy()
  }

  get isSynced() {
    return this.provider.synced
  }

  get isConnected() {
    return (this.provider.getStatus() as unknown as string) === 'connected'
  }

  on(name: string, listener: (...args: any[]) => void) {
    this.provider.on(name as any, listener)
  }

  off(name: string, listener: (...args: any[]) => void) {
    this.provider.off(name as any, listener)
  }
}

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
  const room = useRoom()
  const initialMarkdownRef = useRef(initialMarkdown)
  const isSeededRef = useRef(false)
  
  const [collaborationState, setCollaborationState] = useState<{
    doc: Y.Doc
    provider: LiveblocksProviderAdapter
  } | null>(null)

  useEffect(() => {
    if (!room) return

    const doc = new Y.Doc()
    const providerAdapter = new LiveblocksProviderAdapter(room, doc)
    providerAdapter.connect()
    
    setCollaborationState({ doc, provider: providerAdapter })

    return () => {
      providerAdapter.destroy()
      doc.destroy()
      setCollaborationState(null)
      isSeededRef.current = false // Reset seeded state on room change
    }
  }, [room])

  useEffect(() => {
    if (!collaborationState || !userName) return

    const { provider } = collaborationState
    provider.awareness.setLocalStateField('user', {
      name: userName,
      color: userColor,
    })
  }, [collaborationState, userName, userColor])

  const plugins = useMemo(() => {
    if (!collaborationState) {
      return EditorKit
    }

    const { doc, provider } = collaborationState

    return [
      BaseYjsPlugin.configure({
        options: {
          ydoc: doc,
          providers: [provider],
          // Using a new key to ensure clean slate
          sharedType: doc.get('plate-demo-v12', Y.XmlFragment) as any,
        },
      }),
      // ...EditorKit, // Revert to full kit if it works, or keep simplified?
      // Let's use Full kit now that we trust Webpack alias to fix the root cause.
      ...EditorKit,
    ]
  }, [collaborationState])

  // Force editor re-creation when collaboration state changes
  // This ensures the Yjs plugin is properly initialized with the provider
  const editorId = useMemo(() => {
    if (roomId && !collaborationState) return `${roomId}-loading`
    return roomId
  }, [roomId, collaborationState])

  const editor = usePlateEditor({
    id: editorId,
    plugins,
    value: (e: any) => {
      // Provide a fallback value for Plate initialization
      return [{ type: 'p', children: [{ text: '' }] }]
    },
  })

  // Seeding logic: If connected and doc is empty, insert initialMarkdown
  useEffect(() => {
    if (!collaborationState || !editor) return

    const { doc, provider } = collaborationState
    
    const seed = () => {
        if (isSeededRef.current) return
        
        const fragment = doc.get('plate-demo-v11', Y.XmlFragment);
        const isEmpty = fragment.length === 0;

        if (isEmpty) {
            const markdownToInsert = initialMarkdownRef.current
            if (markdownToInsert) {
                const parsed = editor.api.markdown.deserialize(markdownToInsert)
                if (parsed && parsed.length > 0) {
                     // Defer insertion to avoid race conditions during initial sync
                     setTimeout(() => {
                        // Double check emptiness after timeout
                        // Re-fetch fragment to be sure
                        const currentFragment = doc.get('plate-demo-v11', Y.XmlFragment);
                        if (currentFragment.length > 0) return;
                        
                        // Use editor.reset() if available to replace everything, or insertNodes
                        if ((editor as any).tf?.insertNodes) {
                             (editor as any).tf.insertNodes(parsed)
                        } else if ((editor as any).insertNodes) {
                             (editor as any).insertNodes(parsed)
                        }
                     }, 200) // Increase timeout slightly
                }
            }
        }
        isSeededRef.current = true
    }

    if (provider.provider.synced) {
        seed()
    } else {
        provider.provider.once('synced', seed)
    }

    // Debugging connection
    const onSync = () => console.log('Liveblocks synced:', provider.provider.synced)
    const onStatus = (status: any) => console.log('Liveblocks status:', status)
    
    provider.provider.on('synced', onSync)
    provider.provider.on('status', onStatus)
    
    return () => {
        provider.provider.off('synced', seed)
        provider.provider.off('synced', onSync)
        provider.provider.off('status', onStatus)
    }
  }, [collaborationState, editor]) // Removed initialMarkdown dependency

  return (
    <Plate
      editor={editor}
      onValueChange={() => {
        const md = editor.api.markdown.serialize()
        onChange?.(md)
      }}
    >
      <EditorContainer>
        {(!collaborationState || !collaborationState.provider.isConnected) && (
             <div className="absolute top-0 left-0 right-0 z-10 flex justify-center p-2 pointer-events-none">
                <span className="text-[10px] text-muted-foreground bg-background/80 px-2 py-0.5 rounded border shadow-sm">
                   {collaborationState ? 'Connecting...' : 'Initializing...'}
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
