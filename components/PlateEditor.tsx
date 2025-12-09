'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo, useRef } from 'react'
import {
  createBoldPlugin,
  createItalicPlugin,
  createStrikethroughPlugin,
  createUnderlinePlugin,
  MARK_BOLD,
  MARK_ITALIC,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
} from '@udecode/plate-basic-marks'
import { createBlockquotePlugin, ELEMENT_BLOCKQUOTE } from '@udecode/plate-block-quote'
import {
  createPlateEditor,
  createPlugins,
  Plate,
  PlateContent,
  type PlateEditor as PlateEditorType,
  type PlatePlugin,
  type TElement,
  type Value,
} from '@udecode/plate-common'
import { createHeadingPlugin, ELEMENT_H1, ELEMENT_H2 } from '@udecode/plate-heading'
import { createListPlugin, ELEMENT_OL, ELEMENT_UL } from '@udecode/plate-list'
import { createParagraphPlugin, ELEMENT_PARAGRAPH } from '@udecode/plate-paragraph'
import { deserializeMd, serializeMd } from '@udecode/plate-serializer-md'
import {
  Bold,
  Heading1,
  Heading2,
  Italic,
  List,
  ListOrdered,
  Quote,
  Strikethrough,
  Underline,
  type LucideIcon,
} from 'lucide-react'
// 引入 Slate 核心库
import { Editor, Element as SlateElement, Transforms } from 'slate'
// 引入 ReactEditor
import { ReactEditor } from 'slate-react'

import { cn } from '@/lib/utils'
import { AIAssistant } from '@/components/AIAssistant'
import { Button } from '@/components/ui/button'

const plugins = createPlugins([
  createParagraphPlugin(),
  createHeadingPlugin(),
  createBlockquotePlugin(),
  createListPlugin(),
  createBoldPlugin(),
  createItalicPlugin(),
  createUnderlinePlugin(),
  createStrikethroughPlugin(),
])

// 智能容错解析器
const safeDeserialize = (md: string) => {
  if (!md) return [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }]
  return md.split('\n').map((line) => {
    const text = line.trim()
    if (text.startsWith('# '))
      return { type: ELEMENT_H1, children: [{ text: text.replace('# ', '') }] }
    if (text.startsWith('## '))
      return { type: ELEMENT_H2, children: [{ text: text.replace('## ', '') }] }
    if (text.startsWith('> '))
      return { type: ELEMENT_BLOCKQUOTE, children: [{ text: text.replace('> ', '') }] }
    if (text.startsWith('- ') || text.startsWith('* '))
      return {
        type: ELEMENT_UL,
        children: [{ type: 'li', children: [{ text: text.replace(/^[-*] /, '') }] }],
      }
    return { type: ELEMENT_PARAGRAPH, children: [{ text: line }] }
  })
}

interface ToolbarButtonProps {
  format: string
  icon: LucideIcon
  editor: PlateEditorType
  type?: 'mark' | 'block'
}

const ToolbarButton = ({ format, icon: Icon, editor, type = 'mark' }: ToolbarButtonProps) => {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn('h-8 w-8 p-0')}
      onMouseDown={(e) => {
        e.preventDefault()

        // 使用原生 Slate API 进行操作
        const slateEditor = editor as unknown as ReactEditor

        if (type === 'mark') {
          const marks = Editor.marks(slateEditor)
          // 使用 (marks as any) 避免 TS 报错
          const isActive = marks ? (marks as any)[format] === true : false

          if (isActive) {
            Editor.removeMark(slateEditor, format)
          } else {
            Editor.addMark(slateEditor, format, true)
          }
        } else {
          Transforms.setNodes(
            slateEditor,
            // ✅ 修复：将属性对象整体断言为 any
            // 这告诉 TS：允许传递 type 属性，即使类型定义里看起来没有
            { type: format } as any,
            { match: (n) => SlateElement.isElement(n) && Editor.isBlock(slateEditor, n) }
          )
        }
      }}
    >
      <Icon className="h-4 w-4" />
    </Button>
  )
}

const EditorToolbar = ({ editor }: { editor: PlateEditorType }) => {
  if (!editor) return null

  return (
    <div className="bg-muted/20 sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b p-2 backdrop-blur-sm">
      <ToolbarButton format={ELEMENT_H1} icon={Heading1} editor={editor} type="block" />
      <ToolbarButton format={ELEMENT_H2} icon={Heading2} editor={editor} type="block" />
      <div className="bg-border mx-1 h-4 w-[1px]" />
      <ToolbarButton format={MARK_BOLD} icon={Bold} editor={editor} />
      <ToolbarButton format={MARK_ITALIC} icon={Italic} editor={editor} />
      <ToolbarButton format={MARK_UNDERLINE} icon={Underline} editor={editor} />
      <ToolbarButton format={MARK_STRIKETHROUGH} icon={Strikethrough} editor={editor} />
      <div className="bg-border mx-1 h-4 w-[1px]" />
      <ToolbarButton format={ELEMENT_UL} icon={List} editor={editor} type="block" />
      <ToolbarButton format={ELEMENT_OL} icon={ListOrdered} editor={editor} type="block" />
      <ToolbarButton format={ELEMENT_BLOCKQUOTE} icon={Quote} editor={editor} type="block" />
    </div>
  )
}

interface PlateEditorProps {
  initialMarkdown: string
  onChange: (markdown: string) => void
}

export function PlateEditor({ initialMarkdown, onChange }: PlateEditorProps) {
  const initialValue = useMemo<Value>(() => {
    return [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }]
  }, [])

  const editor = useMemo(() => {
    return createPlateEditor({ plugins })
  }, [])

  const isLoaded = useRef(false)
  useEffect(() => {
    if (!isLoaded.current && initialMarkdown && editor) {
      let nodes
      try {
        nodes = deserializeMd(editor, initialMarkdown)
      } catch (e) {
        nodes = safeDeserialize(initialMarkdown)
      }

      if (nodes && nodes.length > 0) {
        Object.assign(editor, { children: nodes })
        editor.onChange()
      }
      isLoaded.current = true
    }
  }, [initialMarkdown, editor])

  // 定义两个辅助函数传给 AI 组件

  // 1. 获取当前 Markdown 内容
  const getContent = () => {
    // 使用 as any 绕过类型检查，获取当前值序列化后的 Markdown
    const nodes = editor.children
    return serializeMd(editor, { nodes: nodes as any })
  }

  // 2. 插入 AI 生成的文本
  const handleInsert = (text: string) => {
    // 在光标处插入文本
    editor.insertText(text)
    // 或者你可以选择插入一个新的段落：
    // editor.insertNode({ type: ELEMENT_PARAGRAPH, children: [{ text }] });
  }

  return (
    <div className="bg-background flex h-full flex-col overflow-hidden rounded-md border shadow-sm">
      <Plate
        editor={editor}
        initialValue={initialValue}
        onChange={(newValue) => {
          const md = serializeMd(editor, { nodes: newValue as any })
          onChange(md)
        }}
      >
        <EditorToolbar editor={editor} />

        <div
          className="flex-1 cursor-text overflow-y-auto p-4 md:p-6"
          onClick={() => {
            ReactEditor.focus(editor as any)
          }}
        >
          <PlateContent
            placeholder="开始写作..."
            className="prose prose-slate dark:prose-invert min-h-full max-w-none outline-none"
          />
          <AIAssistant getContent={getContent} onInsert={handleInsert} />
        </div>
      </Plate>
    </div>
  )
}
