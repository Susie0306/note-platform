'use client'

import React, { useState, useTransition } from 'react'
import { createWishLog } from '@/app/actions/wishes'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'
import { Plate, usePlateEditor } from 'platejs/react'

import { EditorKit } from '@/components/editor-kit'
import { Editor } from '@/components/ui/editor'
import { Button } from '@/components/ui/button'

interface LogCreatorProps {
  wishId: string
}

export function LogCreator({ wishId }: LogCreatorProps) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  const editor = usePlateEditor({
    plugins: EditorKit.filter(
      (p) => p.key !== 'fixed-toolbar' && p.key !== 'floating-toolbar'
    ),
    value: [{ type: 'p', children: [{ text: '' }] }],
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    startTransition(async () => {
      try {
        await createWishLog(wishId, content)
        // 重置状态
        setContent('')
        // 重置编辑器内容
        editor.tf.setValue([{ type: 'p', children: [{ text: '' }] }])
        
        toast.success('记录成功')
      } catch (error) {
        toast.error('记录失败')
      }
    })
  }

  return (
    <div className="relative">
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary/20 dark:bg-gray-950">
        <Plate
          editor={editor}
          onValueChange={() => {
            const md = editor.api.markdown.serialize()
            setContent(md)
          }}
        >
          <Editor
            variant="none"
            placeholder="写下这一刻的心情、进展或感悟..."
            className="min-h-[100px] w-full resize-none border-none p-3 focus-visible:outline-none focus-visible:ring-0"
          />
        </Plate>
        <div className="flex items-center justify-between border-t bg-gray-50/50 px-3 py-2 dark:bg-gray-900/50">
          <span className="text-xs text-gray-400">支持 Markdown 快捷语法 (如 # 标题)</span>
          <Button
            onClick={handleSubmit}
            size="sm"
            disabled={isPending || !content.trim()}
            className="bg-primary text-primary-foreground hover:bg-primary/90"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
            ) : (
              <Send className="mr-2 h-3 w-3" />
            )}
            记录
          </Button>
        </div>
      </div>
    </div>
  )
}

