'use client'

import React from 'react'
import { useEditorRef } from 'platejs/react'
import { Editor, Transforms } from 'slate'
import { ToolbarButton } from '@/components/ui/toolbar'

interface BlockToolbarButtonProps {
  type: string
  children: React.ReactNode
}

export function BlockToolbarButton({ type, children }: BlockToolbarButtonProps) {
  const editor = useEditorRef()
  const onClick = () => {
    if (!editor) return
    Transforms.setNodes(editor, { type }, { match: (n) => Editor.isBlock(editor, n) })
  }
  return <ToolbarButton onClick={onClick}>{children}</ToolbarButton>
}

