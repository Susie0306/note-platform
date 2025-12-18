'use client'

import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownPreviewProps {
  content: string
}

export function MarkdownPreview({ content }: MarkdownPreviewProps) {
  return (
    <div className="prose prose-sm dark:prose-invert pointer-events-none max-w-none [&>*:first-child]:mt-0">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          img: ({ node, ...props }) => (
            <span className="text-muted-foreground text-xs">[图片]</span>
          ),
          h1: ({ node, ...props }) => (
            <p className="mb-1 text-base font-bold" {...props} />
          ),
          h2: ({ node, ...props }) => (
            <p className="mb-1 text-base font-bold" {...props} />
          ),
          h3: ({ node, ...props }) => (
            <p className="mb-1 text-base font-bold" {...props} />
          ),
          ul: ({ node, ...props }) => <ul className="my-0.5 list-disc pl-4" {...props} />,
          ol: ({ node, ...props }) => (
            <ol className="my-0.5 list-decimal pl-4" {...props} />
          ),
          li: ({ node, ...props }) => <li className="my-0" {...props} />,
          p: ({ node, ...props }) => <p className="my-0.5 leading-snug" {...props} />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
