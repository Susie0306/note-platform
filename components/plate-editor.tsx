'use client'

import { Plate, usePlateEditor } from 'platejs/react'
import { KEYS } from 'platejs'
import { AutoformatPlugin } from '@platejs/autoformat'
import { MarkdownPlugin } from '@platejs/markdown'
import { toggleList } from '@platejs/list'
import { Bold, Heading1, Heading2, Heading3, Italic, List as ListIcon, ListOrdered, Quote, Strikethrough, Code as CodeIcon } from 'lucide-react'

import { BasicNodesKit } from '@/components/basic-nodes-kit'
import { Editor, EditorContainer } from '@/components/ui/editor'
import { ToolbarButton } from '@/components/ui/toolbar-button'
import { BlockToolbarButton } from '@/components/ui/block-toolbar-button'

export function PlateEditor({ initialMarkdown, onChange }: { initialMarkdown?: string; onChange?: (markdown: string) => void }) {
  const editor = usePlateEditor({
    plugins: [
      ...BasicNodesKit,
      MarkdownPlugin.configure({
        serialize: (n: { type?: string }) => n?.type !== 'mdxJsxTextElement',
        deserialize: () => true,
      }),
      AutoformatPlugin.configure({
        options: {
          enableUndoOnDelete: true,
          rules: [
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
              format: (editor) => toggleList(editor, { listStyleType: KEYS.ul }),
            },
            {
              match: [String.raw`^\d+\.\s`, String.raw`^\d+\)\s`],
              matchByRegex: true,
              mode: 'block',
              type: 'list',
              format: (editor, { matchString }) =>
                toggleList(editor, {
                  listStyleType: KEYS.ol,
                  listRestartPolite: Number(matchString) || 1,
                }),
            },
          ],
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
        <div className="sticky top-0 z-10 flex items-center gap-1 border-b bg-background/80 p-2 backdrop-blur">
          <ToolbarButton onClick={() => editor.api.mark.toggle(KEYS.bold)}>
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.api.mark.toggle(KEYS.italic)}>
            <Italic className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.api.mark.toggle(KEYS.strikethrough)}>
            <Strikethrough className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => editor.api.mark.toggle(KEYS.code)}>
            <CodeIcon className="h-4 w-4" />
          </ToolbarButton>
          <BlockToolbarButton type={KEYS.blockquote}>
            <Quote className="h-4 w-4" />
          </BlockToolbarButton>
          <BlockToolbarButton type={KEYS.h1}>
            <Heading1 className="h-4 w-4" />
          </BlockToolbarButton>
          <BlockToolbarButton type={KEYS.h2}>
            <Heading2 className="h-4 w-4" />
          </BlockToolbarButton>
          <BlockToolbarButton type={KEYS.h3}>
            <Heading3 className="h-4 w-4" />
          </BlockToolbarButton>
          <ToolbarButton onClick={() => toggleList(editor, { listStyleType: KEYS.ul })}>
            <ListIcon className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={() => toggleList(editor, { listStyleType: KEYS.ol })}>
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>
        <Editor variant="demo" placeholder="开始写作..." />
      </EditorContainer>
    </Plate>
  )
}
