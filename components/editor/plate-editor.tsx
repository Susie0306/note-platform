'use client'

import React from 'react'
import { AutoformatPlugin } from '@platejs/autoformat'
import { toggleList } from '@platejs/list'
import { MarkdownPlugin, serializeMd } from '@platejs/markdown'
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

import { AIAssistant } from '@/components/AIAssistant' // 引入 AI 助手
import { BasicNodesKit } from '@/components/basic-nodes-kit'
import { BlockToolbarButton } from '@/components/ui/block-toolbar-button'
import { Editor, EditorContainer } from '@/components/ui/editor'
import { FixedToolbar } from '@/components/ui/fixed-toolbar'
import { ToolbarGroup } from '@/components/ui/toolbar' // 引入分组组件
import { ToolbarButton } from '@/components/ui/toolbar-button'

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
    return editor.api.markdown.serialize()
  }

  const handleInsert = (text: string) => {
    editor.insertText(text)
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
        <ToolbarButton onClick={() => editor.api.mark.toggle(KEYS.bold)} tooltip="加粗 (Mod+B)">
          <Bold className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.api.mark.toggle(KEYS.italic)} tooltip="斜体 (Mod+I)">
          <Italic className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.api.mark.toggle(KEYS.strikethrough)} tooltip="删除线">
          <Strikethrough className="h-4 w-4" />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.api.mark.toggle(KEYS.code)} tooltip="代码">
          <CodeIcon className="h-4 w-4" />
        </ToolbarButton>
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
}

export function PlateEditor({ initialMarkdown, onChange }: PlateEditorProps) {
  const editor = usePlateEditor({
    plugins: [
      ...BasicNodesKit,
      MarkdownPlugin.configure({
        serialize: { children: true },
        deserialize: { children: true },
      }),
      AutoformatPlugin.configure({
        options: {
          enableUndoOnDelete: true,
          rules: autoformatRules,
        },
      }),
    ],
    value: (e) => e.api.markdown.deserialize(initialMarkdown || ''),
  })

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
