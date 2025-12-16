'use client'

import React, { useEffect, useMemo, useRef } from 'react'
import { Plate, usePlateEditor } from 'platejs/react'

import { EditorKit } from './editor-kit'
import { Editor, EditorContainer } from './components/ui/editor'

export interface PlateEditorProps {
  /** Initial markdown content */
  initialMarkdown?: string
  /** Callback when content changes */
  onChange?: (markdown: string) => void
  /** Placeholder text */
  placeholder?: string
  /** Editor variant */
  variant?: 'default' | 'demo' | 'fullWidth'
  /** Custom plugins (defaults to EditorKit) */
  plugins?: any[]
  /** Additional className for the editor container */
  className?: string
  /** Minimum height for the editor */
  minHeight?: string
}

/**
 * A standalone rich-text editor component based on Plate.js
 * 
 * @example
 * ```tsx
 * import { PlateEditor } from '@susie/editor'
 * 
 * function MyEditor() {
 *   const [content, setContent] = useState('')
 *   
 *   return (
 *     <PlateEditor
 *       initialMarkdown={content}
 *       onChange={setContent}
 *       placeholder="Start writing..."
 *     />
 *   )
 * }
 * ```
 */
export function PlateEditor({
  initialMarkdown = '',
  onChange,
  placeholder = 'Start writing...',
  variant = 'demo',
  plugins,
  className,
  minHeight = '500px',
}: PlateEditorProps) {
  const editor = usePlateEditor({
    plugins: plugins ?? EditorKit,
  })

  // Initialize editor content
  const initialized = useRef(false)
  if (!initialized.current) {
    const e = editor as any
    if (e.api?.markdown && initialMarkdown) {
      const parsed = e.api.markdown.deserialize(initialMarkdown)
      if (parsed && parsed.length) {
        editor.children = parsed
        if (e.normalize) {
          e.normalize({ force: true })
        }
      }
    }
    initialized.current = true
  }

  return (
    <Plate
      editor={editor}
      onValueChange={() => {
        const md = editor.api.markdown.serialize()
        onChange?.(md)
      }}
    >
      <EditorContainer className={className}>
        <Editor
          variant={variant}
          placeholder={placeholder}
          className={`min-h-[${minHeight}] px-8 py-8 sm:px-12`}
        />
      </EditorContainer>
    </Plate>
  )
}
