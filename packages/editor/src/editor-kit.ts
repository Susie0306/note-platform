'use client'

import { type Value, TrailingBlockPlugin } from 'platejs'
import { type TPlateEditor, useEditorRef } from 'platejs/react'

import { AlignKit } from './kits/align-kit'
import { AutoformatKit } from './kits/autoformat-kit'
import { BasicBlocksKit } from './kits/basic-blocks-kit'
import { BasicMarksKit } from './kits/basic-marks-kit'
import { BlockMenuKit } from './kits/block-menu-kit'
import { BlockPlaceholderKit } from './kits/block-placeholder-kit'
import { CalloutKit } from './kits/callout-kit'
import { CodeBlockKit } from './kits/code-block-kit'
import { ColumnKit } from './kits/column-kit'
import { CommentKit } from './kits/comment-kit'
import { CopilotKit } from './kits/copilot-kit'
import { CursorOverlayKit } from './kits/cursor-overlay-kit'
import { DateKit } from './kits/date-kit'
import { DiscussionKit } from './kits/discussion-kit'
import { DndKit } from './kits/dnd-kit'
import { DocxKit } from './kits/docx-kit'
import { EmojiKit } from './kits/emoji-kit'
import { ExitBreakKit } from './kits/exit-break-kit'
import { FixedToolbarKit } from './kits/fixed-toolbar-kit'
import { FloatingToolbarKit } from './kits/floating-toolbar-kit'
import { FontKit } from './kits/font-kit'
import { LineHeightKit } from './kits/line-height-kit'
import { LinkKit } from './kits/link-kit'
import { ListKit } from './kits/list-kit'
import { MarkdownKit } from './kits/markdown-kit'
import { MathKit } from './kits/math-kit'
import { MediaKit } from './kits/media-kit'
import { MentionKit } from './kits/mention-kit'
import { SlashKit } from './kits/slash-kit'
import { SuggestionKit } from './kits/suggestion-kit'
import { TableKit } from './kits/table-kit'
import { TocKit } from './kits/toc-kit'
import { ToggleKit } from './kits/toggle-kit'

/**
 * Default editor plugin configuration
 * Includes all commonly used features
 */
export const EditorKit = [
  ...CopilotKit,

  // Elements
  ...BasicBlocksKit,
  ...CodeBlockKit,
  ...TableKit,
  ...ToggleKit,
  ...TocKit,
  ...MediaKit,
  ...CalloutKit,
  ...ColumnKit,
  ...MathKit,
  ...DateKit,
  ...LinkKit,
  ...MentionKit,

  // Marks
  ...BasicMarksKit,
  ...FontKit,

  // Block Styles
  ...ListKit,
  ...AlignKit,
  ...LineHeightKit,

  // Collaboration
  ...DiscussionKit,
  ...CommentKit,
  ...SuggestionKit,

  // Editing
  ...SlashKit,
  ...AutoformatKit,
  ...CursorOverlayKit,
  ...BlockMenuKit,
  ...DndKit,
  ...EmojiKit,
  ...ExitBreakKit,
  TrailingBlockPlugin,

  // Parsers
  ...DocxKit,
  ...MarkdownKit,

  // UI
  ...BlockPlaceholderKit,
  ...FixedToolbarKit,
  ...FloatingToolbarKit,
]

export type MyEditor = TPlateEditor<Value, (typeof EditorKit)[number]>

export const useEditor = (): MyEditor => useEditorRef<MyEditor>()
