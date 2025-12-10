'use client'

import React, { useState, useTransition } from 'react'
import { createWishLog } from '@/app/actions/wishes'
import { Loader2, Send } from 'lucide-react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'

interface LogCreatorProps {
  wishId: string
}

export function LogCreator({ wishId }: LogCreatorProps) {
  const [content, setContent] = useState('')
  const [isPending, startTransition] = useTransition()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    startTransition(async () => {
      try {
        await createWishLog(wishId, content)
        setContent('')
        toast.success('记录成功')
      } catch (error) {
        toast.error('记录失败')
      }
    })
  }

  return (
    <form onSubmit={handleSubmit} className="relative">
      <div className="overflow-hidden rounded-lg border bg-white shadow-sm focus-within:ring-2 focus-within:ring-primary/20">
        <Textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="写下这一刻的心情、进展或感悟..."
          className="min-h-[100px] resize-none border-none focus-visible:ring-0"
        />
        <div className="flex items-center justify-between border-t bg-gray-50/50 px-3 py-2">
          <span className="text-xs text-gray-400">支持 Markdown 语法</span>
          <Button
            type="submit"
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
    </form>
  )
}

