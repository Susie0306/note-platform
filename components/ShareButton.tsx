'use client'

import { useState } from 'react'
import { Check, Copy, Share2, Users } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { toast } from 'sonner'

export function ShareButton() {
  const [copied, setCopied] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('链接已复制，快去分享给好友吧！')
      
      setTimeout(() => {
        setCopied(false)
      }, 2000)
    } catch (err) {
      toast.error('复制失败，请手动复制链接')
    }
  }

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="hidden sm:flex"
          >
            {copied ? (
              <Check className="mr-2 h-4 w-4 text-green-500" />
            ) : (
              <Share2 className="mr-2 h-4 w-4" />
            )}
            {copied ? '已复制' : '协作'}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>点击复制链接，邀请好友一起编辑</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

