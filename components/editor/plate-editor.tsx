'use client'

import React, { useEffect, useMemo } from 'react'
import { AutoformatPlugin } from '@platejs/autoformat'
import { BaseYjsPlugin, type UnifiedProvider } from '@platejs/yjs'
import { toggleList } from '@platejs/list'
import { MarkdownPlugin } from '@platejs/markdown'
import { LiveblocksYjsProvider } from '@liveblocks/yjs'
import remarkGfm from 'remark-gfm'
import type { Awareness } from 'y-protocols/awareness'
import {
  Bold,
  Code as CodeIcon,
  Heading1,
  Heading2,
  Heading3,
  Italic,
  List as ListIcon,
  ListOrdered,
  Quote,
  Strikethrough,
} from 'lucide-react'
import { KEYS } from 'platejs'
import { Plate, useEditorRef, usePlateEditor } from 'platejs/react'
import * as Y from 'yjs'

import { AIAssistant } from '@/components/AIAssistant' // 引入 AI 助手
import { BasicNodesKit } from '@/components/basic-nodes-kit'
import { BlockToolbarButton } from '@/components/ui/block-toolbar-button'
import { Editor, EditorContainer } from '@/components/ui/editor'
import { FixedToolbar } from '@/components/ui/fixed-toolbar'
import { MarkToolbarButton } from '@/components/ui/mark-toolbar-button'
import { ToolbarButton, ToolbarGroup } from '@/components/ui/toolbar' // 引入分组组件
import { useRoom } from '@/lib/liveblocks.config'

class LiveblocksProviderAdapter implements UnifiedProvider {
  type = 'liveblocks'
  awareness: Awareness
  document: Y.Doc
  private provider: LiveblocksYjsProvider
  private connected = false

  constructor(room: any, doc: Y.Doc) {
    this.provider = new LiveblocksYjsProvider(room, doc, {
      offlineSupport_experimental: true,
    })
    this.awareness = this.provider.awareness as unknown as Awareness
    this.document = doc
  }

  connect() {
    this.provider.connect()
    this.connected = true
  }

  disconnect() {
    this.provider.disconnect()
    this.connected = false
  }

  destroy() {
    this.provider.destroy()
    this.connected = false
  }

  get isConnected() {
    return this.connected
  }

  get isSynced() {
    return this.provider.synced ?? this.provider.getStatus() === 'synchronized'
  }
}

// --- 1. 配置分离 ---
const autoformatRules = [
  { match: '# ', mode: 'block', type: KEYS.h1 },
  { match: '## ', mode: 'block', type: KEYS.h2 },
  { match: '### ', mode: 'block', type: KEYS.h3 },
  { match: '> ', mode: 'block', type: KEYS.blockquote },
  { match: '**', mode: 'mark', type: KEYS.bold },
  { match: '*', mode: 'mark', type: KEYS.italic },
  { match: '~~', mode: 'mark', type: KEYS.strikethrough },
  { match: '`', mode: 'mark', type: KEYS.code },
  {
    match: ['* ', '- '],
    mode: 'block',
    type: 'list',
    format: (editor: any) => toggleList(editor, { listStyleType: KEYS.ul }),
  },
  {
    match: [String.raw`^\d+\.\s`, String.raw`^\d+\)\s`],
    matchByRegex: true,
    mode: 'block',
    type: 'list',
    format: (editor: any, { matchString }: any) =>
      toggleList(editor, {
        listStyleType: KEYS.ol,
        listRestartPolite: Number(matchString) || 1,
      }),
  },
] as any

// --- 2. UI 分离：工具栏组件 ---
function EditorToolbar() {
  const editor = useEditorRef()

  // AI 助手所需的辅助函数
  const getContent = () => {
  const api = editor.api as any;
  return api.markdown?.serialize() || '';
}

  const handleInsert = (text: string) => {
    (editor as any).insertText(text)
  }

  return (
    <FixedToolbar>
      {/* 第一组：AI 助手 (放在最前面或最后面都很醒目) */}
      <ToolbarGroup>
        <AIAssistant getContent={getContent} onInsert={handleInsert} />
      </ToolbarGroup>

      <div className="bg-border/50 mx-1.5 h-4 w-[1px]" />

      {/* 第二组：文本样式 */}
      <ToolbarGroup>
        <MarkToolbarButton nodeType={KEYS.bold} tooltip="加粗 (Mod+B)">
          <Bold className="h-4 w-4" />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.italic} tooltip="斜体 (Mod+I)">
          <Italic className="h-4 w-4" />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.strikethrough} tooltip="删除线">
          <Strikethrough className="h-4 w-4" />
        </MarkToolbarButton>
        <MarkToolbarButton nodeType={KEYS.code} tooltip="代码">
          <CodeIcon className="h-4 w-4" />
        </MarkToolbarButton>
      </ToolbarGroup>

      <div className="bg-border/50 mx-1.5 h-4 w-[1px]" />

      {/* 第三组：标题与引用 */}
      <ToolbarGroup>
        <BlockToolbarButton type={KEYS.h1} tooltip="标题 1">
          <Heading1 className="h-4 w-4" />
        </BlockToolbarButton>
        <BlockToolbarButton type={KEYS.h2} tooltip="标题 2">
          <Heading2 className="h-4 w-4" />
        </BlockToolbarButton>
        <BlockToolbarButton type={KEYS.h3} tooltip="标题 3">
          <Heading3 className="h-4 w-4" />
        </BlockToolbarButton>
        <BlockToolbarButton type={KEYS.blockquote} tooltip="引用">
          <Quote className="h-4 w-4" />
        </BlockToolbarButton>
      </ToolbarGroup>

      <div className="bg-border/50 mx-1.5 h-4 w-[1px]" />

      {/* 第四组：列表 */}
      <ToolbarGroup>
        <ToolbarButton
          onClick={() => toggleList(editor, { listStyleType: KEYS.ul })}
          tooltip="无序列表"
        >
          <ListIcon className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton
          onClick={() => toggleList(editor, { listStyleType: KEYS.ol })}
          tooltip="有序列表"
        >
          <ListOrdered className="h-4 w-4" />
        </ToolbarButton>
      </ToolbarGroup>
    </FixedToolbar>
  )
}

// --- 3. 主组件 ---
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
  const yDoc = useMemo(() => new Y.Doc(), [])
  const provider = useMemo(() => {
    if (!roomId) return null
    return new LiveblocksProviderAdapter(room, yDoc)
  }, [room, roomId, yDoc])

  useEffect(() => {
    if (!provider) return
    provider.awareness.setLocalStateField('user', {
      name: userName ?? '我',
      color: userColor ?? '#f59e0b',
    })
  }, [provider, userColor, userName])

  const plugins = useMemo(() => {
    const basePlugins = [
      ...BasicNodesKit,
      MarkdownPlugin.configure({
        options: { remarkPlugins: [remarkGfm] },
      }),
      AutoformatPlugin.configure({
        options: {
          enableUndoOnDelete: true,
          rules: autoformatRules,
        },
      }),
    ]

    if (!provider) return basePlugins

    return [
      BaseYjsPlugin.configure({
        options: {
          awareness: provider.awareness,
          providers: [provider],
          ydoc: yDoc,
          cursors: {},
        },
      }),
      ...basePlugins,
    ]
  }, [provider, yDoc])

  const editor = usePlateEditor({
    plugins,
    value: (e: any) => e.api.markdown.deserialize(initialMarkdown || ''),
  })

  useEffect(() => {
    if (!provider) return

    const initCollaboration = async () => {
      try {
        await editor.api.yjs.init({
          id: roomId ?? editor.id,
          autoConnect: true,
          value: () => editor.api.markdown.deserialize(initialMarkdown || ''),
        })
      } catch (error) {
        console.error('Failed to init Liveblocks Yjs provider', error)
      }
    }

    void initCollaboration()

    return () => {
      editor.api.yjs.destroy?.()
      provider.destroy()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor, initialMarkdown, provider, roomId])

  return (
    <Plate
      editor={editor}
      onValueChange={() => {
        const md = editor.api.markdown.serialize()
        onChange?.(md)
      }}
    >
      <EditorContainer>
        <EditorToolbar />
        <Editor
          variant="demo"
          placeholder="开始写作... (支持 Markdown 语法)"
          className="min-h-[500px] px-8 py-8 sm:px-12"
        />
      </EditorContainer>
    </Plate>
  )
}
