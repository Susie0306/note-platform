'use client'

/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useMemo } from 'react'
// ✅ 1. 只保留这两个核心包，移除所有 plugin 包的引用
import { withProps } from '@udecode/cn'
import {
  Plate,
  PlateContent,
  PlateElement,
  PlateLeaf,
  usePlateEditor,
  type PlateEditor as PlateEditorType,
} from '@udecode/plate-common/react'
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

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

// --- 2. 常量定义 ---
const ELEMENT_PARAGRAPH = 'p'
const ELEMENT_H1 = 'h1'
const ELEMENT_H2 = 'h2'
const ELEMENT_BLOCKQUOTE = 'blockquote'
const ELEMENT_UL = 'ul'
const ELEMENT_OL = 'ol'
const ELEMENT_LI = 'li' // 列表项

const MARK_BOLD = 'bold'
const MARK_ITALIC = 'italic'
const MARK_UNDERLINE = 'underline'
const MARK_STRIKETHROUGH = 'strikethrough'

// --- 3. 手动定义插件 (Zero-Dependency) ---
// 我们不再 import ParagraphPlugin，而是自己定义一个配置对象
// 这能 100% 避免 build error，因为根本没有引入外部文件
const plugins: any[] = [
  // Block 元素
  { key: ELEMENT_PARAGRAPH, isElement: true },
  { key: ELEMENT_H1, isElement: true },
  { key: ELEMENT_H2, isElement: true },
  { key: ELEMENT_BLOCKQUOTE, isElement: true },
  { key: ELEMENT_UL, isElement: true },
  { key: ELEMENT_OL, isElement: true },
  { key: ELEMENT_LI, isElement: true },

  // Mark 样式 (加粗、斜体等)
  { key: MARK_BOLD, isLeaf: true },
  { key: MARK_ITALIC, isLeaf: true },
  { key: MARK_UNDERLINE, isLeaf: true },
  { key: MARK_STRIKETHROUGH, isLeaf: true },
]

// --- 4. 手写简易解析器 ---
const manualDeserialize = (md: string) => {
  if (!md) return [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }]

  return md.split('\n').map((line) => {
    const text = line.trim()
    if (text.startsWith('# '))
      return { type: ELEMENT_H1, children: [{ text: text.replace('# ', '') }] }
    if (text.startsWith('## '))
      return { type: ELEMENT_H2, children: [{ text: text.replace('## ', '') }] }
    if (text.startsWith('> '))
      return { type: ELEMENT_BLOCKQUOTE, children: [{ text: text.replace('> ', '') }] }
    if (text.startsWith('- '))
      return {
        type: ELEMENT_UL,
        children: [{ type: ELEMENT_LI, children: [{ text: text.replace('- ', '') }] }],
      }
    // 注意：简易列表不支持嵌套，这里简化处理
    return { type: ELEMENT_PARAGRAPH, children: [{ text: line }] }
  })
}

const manualSerialize = (nodes: any[]) => {
  return nodes
    .map((node) => {
      const text = node.children?.map((c: any) => c.text).join('') || ''
      switch (node.type) {
        case ELEMENT_H1:
          return `# ${text}`
        case ELEMENT_H2:
          return `## ${text}`
        case ELEMENT_BLOCKQUOTE:
          return `> ${text}`
        case ELEMENT_UL:
          return `- ${text}` // 简易序列化
        default:
          return text
      }
    })
    .join('\n')
}

// --- 工具栏组件 ---
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
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()

        if (type === 'mark') {
          ;(editor as any).tf.toggle.mark({ key: format })
        } else {
          ;(editor as any).tf.toggle.block({ type: format })
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
  const initialValue = useMemo(() => {
    return [{ type: ELEMENT_PARAGRAPH, children: [{ text: '' }] }]
  }, [])

  const editor = usePlateEditor({
    plugins,
    value: initialValue,
    // ✅ 5. 关键：手动告诉 Plate 每个 Key 对应什么 HTML 标签
    override: {
      components: {
        // Block 渲染
        [ELEMENT_PARAGRAPH]: withProps(PlateElement, { as: 'p', className: 'mb-4' }),
        [ELEMENT_H1]: withProps(PlateElement, {
          as: 'h1',
          className: 'text-3xl font-bold mb-4 mt-6',
        }),
        [ELEMENT_H2]: withProps(PlateElement, {
          as: 'h2',
          className: 'text-2xl font-bold mb-2 mt-4',
        }),
        [ELEMENT_BLOCKQUOTE]: withProps(PlateElement, {
          as: 'blockquote',
          className: 'border-l-4 border-gray-300 pl-4 italic my-4',
        }),
        [ELEMENT_UL]: withProps(PlateElement, { as: 'ul', className: 'list-disc pl-6 mb-4' }),
        [ELEMENT_OL]: withProps(PlateElement, { as: 'ol', className: 'list-decimal pl-6 mb-4' }),
        [ELEMENT_LI]: withProps(PlateElement, { as: 'li', className: 'mb-1' }),

        // Mark 渲染 (Bold, Italic 等)
        [MARK_BOLD]: withProps(PlateLeaf, { as: 'strong' }),
        [MARK_ITALIC]: withProps(PlateLeaf, { as: 'em' }),
        [MARK_UNDERLINE]: withProps(PlateLeaf, { as: 'u' }),
        [MARK_STRIKETHROUGH]: withProps(PlateLeaf, { as: 's' }),
      },
    },
  })

  useEffect(() => {
    if (initialMarkdown && editor) {
      try {
        const nodes = manualDeserialize(initialMarkdown)
        ;(editor as any).tf.setValue(nodes)
      } catch (e) {
        console.warn('Deserialize failed', e)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editor])

  return (
    <div className="bg-background flex h-full flex-col overflow-hidden rounded-md border shadow-sm">
      <Plate
        editor={editor}
        onChange={({ value }) => {
          const md = manualSerialize(value as any)
          onChange(md)
        }}
      >
        <EditorToolbar editor={editor} />

        <div
          className="flex-1 cursor-text overflow-y-auto p-4 md:p-6"
          onClick={() => {
            ;(editor as any).tf.focus()
          }}
        >
          <PlateContent
            placeholder="开始输入内容..."
            className="prose prose-slate dark:prose-invert min-h-full max-w-none outline-none"
          />
        </div>
      </Plate>
    </div>
  )
}
