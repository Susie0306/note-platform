'use client'

// Core Editor
export { Editor, EditorContainer, EditorView } from './components/ui/editor'
export type { EditorProps } from './components/ui/editor'

// Plate Editor with collaboration support
export { PlateEditor } from './editor'
export type { PlateEditorProps } from './editor'

// Editor Kit (default plugin configuration)
export { EditorKit, useEditor } from './editor-kit'
export type { MyEditor } from './editor-kit'

// Utilities
export { cn } from './lib/utils'

// Re-export platejs core for convenience
export {
  Plate,
  PlateContent,
  PlateElement,
  PlateLeaf,
  usePlateEditor,
  useEditorRef,
  useEditorSelector,
  useElement,
  useSelected,
  useReadOnly,
} from 'platejs/react'

export type {
  PlateElementProps,
  PlateLeafProps,
  PlateContentProps,
} from 'platejs/react'

export type { Value } from 'platejs'
