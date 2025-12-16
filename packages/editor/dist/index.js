import { CopilotKit, BasicBlocksKit, CodeBlockKit, TableKit, ToggleKit, TocKit, MediaKit, CalloutKit, ColumnKit, MathKit, DateKit, LinkKit, MentionKit, FontKit, ListKit, AlignKit, LineHeightKit, SlashKit, AutoformatKit, CursorOverlayKit, BlockMenuKit, DndKit, EmojiKit, ExitBreakKit, DocxKit, BlockPlaceholderKit, FixedToolbarKit, FloatingToolbarKit } from './chunk-5PMWPIG2.js';
import { BasicMarksKit, DiscussionKit, CommentKit, SuggestionKit, MarkdownKit, EditorContainer, Editor } from './chunk-VJEBNFCX.js';
export { Editor, EditorContainer, EditorView, cn } from './chunk-VJEBNFCX.js';
import './chunk-VGP27YFB.js';
import { useRef } from 'react';
import { useEditorRef, usePlateEditor, Plate } from 'platejs/react';
export { Plate, PlateContent, PlateElement, PlateLeaf, useEditorRef, useEditorSelector, useElement, usePlateEditor, useReadOnly, useSelected } from 'platejs/react';
import { TrailingBlockPlugin } from 'platejs';
import { jsx } from 'react/jsx-runtime';

var EditorKit = [
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
  ...FloatingToolbarKit
];
var useEditor = () => useEditorRef();
function PlateEditor({
  initialMarkdown = "",
  onChange,
  placeholder = "Start writing...",
  variant = "demo",
  plugins,
  className,
  minHeight = "500px"
}) {
  const editor = usePlateEditor({
    plugins: plugins ?? EditorKit
  });
  const initialized = useRef(false);
  if (!initialized.current) {
    const e = editor;
    if (e.api?.markdown && initialMarkdown) {
      const parsed = e.api.markdown.deserialize(initialMarkdown);
      if (parsed && parsed.length) {
        editor.children = parsed;
        if (e.normalize) {
          e.normalize({ force: true });
        }
      }
    }
    initialized.current = true;
  }
  return /* @__PURE__ */ jsx(
    Plate,
    {
      editor,
      onValueChange: () => {
        const md = editor.api.markdown.serialize();
        onChange?.(md);
      },
      children: /* @__PURE__ */ jsx(EditorContainer, { className, children: /* @__PURE__ */ jsx(
        Editor,
        {
          variant,
          placeholder,
          className: `min-h-[${minHeight}] px-8 py-8 sm:px-12`
        }
      ) })
    }
  );
}

export { EditorKit, PlateEditor, useEditor };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map