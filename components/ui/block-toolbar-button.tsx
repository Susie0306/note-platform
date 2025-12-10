'use client'

import React from 'react'
import { useEditorRef } from 'platejs/react'
import { Editor, Transforms } from 'slate'
import { ToolbarButton } from '@/components/ui/toolbar'

interface BlockToolbarButtonProps {
  type: string
  children: React.ReactNode
  tooltip?: string
}

export function BlockToolbarButton({ type, children, tooltip }: BlockToolbarButtonProps) {
  const editor = useEditorRef()
  const onClick = () => {
    if (!editor) return
    // platejs 的 editor 类型与 slate BaseEditor 存在类型不兼容，这里做一次宽松转换
    const slateEditor = editor as any
    Transforms.setNodes(slateEditor, { type } as any, {
      match: (n) => 'type' in (n as any) && 'children' in (n as any),
    })
  }
  return (
    <ToolbarButton onClick={onClick} tooltip={tooltip}>
      {children}
    </ToolbarButton>
  )
}
