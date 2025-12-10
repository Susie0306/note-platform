'use client'

import React, { useState, useTransition } from 'react'
import { Sparkles, RefreshCw } from 'lucide-react'
import { generateWishMessage } from '@/app/actions/ai'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface WishMessageProps {
  wishTitle: string
}

export function WishMessage({ wishTitle }: WishMessageProps) {
  const [message, setMessage] = useState('每一次的记录，都是通往梦想的脚印。坚持下去，美好的事情正在发生！')
  const [isPending, startTransition] = useTransition()

  const handleRefresh = () => {
    startTransition(async () => {
      const newMessage = await generateWishMessage(wishTitle)
      setMessage(newMessage)
    })
  }

  return (
    <div className="rounded-lg bg-secondary p-4 text-sm text-secondary-foreground relative group">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold flex items-center gap-2">
          <Sparkles className="h-4 w-4" /> 希冀寄语
        </h4>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-secondary-foreground/10"
          onClick={handleRefresh}
          disabled={isPending}
        >
          <RefreshCw className={cn("h-3 w-3", isPending && "animate-spin")} />
          <span className="sr-only">刷新寄语</span>
        </Button>
      </div>
      <p className={cn("transition-opacity duration-300", isPending ? "opacity-50" : "opacity-100")}>
        {message}
      </p>
    </div>
  )
}

