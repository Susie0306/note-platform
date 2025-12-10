'use client'

import React, { useState } from 'react'
import { MemoryNote } from '@/app/actions/memories'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Mail, Sparkles, X } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

interface MemoryCapsuleProps {
  memory: MemoryNote | null
}

export function MemoryCapsule({ memory }: MemoryCapsuleProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const router = useRouter()

  if (!memory || !isVisible) return null

  // 提取 Markdown 前 100 个字符作为预览
  const previewContent = memory.content 
    ? memory.content.slice(0, 150) + (memory.content.length > 150 ? '...' : '')
    : '（空笔记）'

  return (
    <>
      {/* 悬浮胶囊入口 - 放在页面右下角或特定的展示区域 */}
      <div className="fixed bottom-8 right-8 z-40 animate-bounce-slow">
        <div className="relative group">
          <Button
            onClick={() => setIsOpen(true)}
            className="h-14 w-14 rounded-full bg-gradient-to-tr from-yellow-400 to-orange-400 text-white shadow-lg transition-all hover:scale-110 hover:shadow-orange-200"
          >
            <Mail className="h-6 w-6" />
          </Button>
          
          {/* 气泡提示 */}
          <div className="absolute bottom-full right-0 mb-2 w-max max-w-[200px] origin-bottom-right scale-0 rounded-xl bg-white p-3 text-xs font-medium text-gray-600 shadow-xl transition-all group-hover:scale-100">
            {memory.type === 'anniversary' ? (
              <span>✨ 发现一份 {memory.yearsAgo} 年前的今天写下的回忆</span>
            ) : (
              <span>✨ 拾起一份被遗忘的时光碎片</span>
            )}
            <div className="absolute -bottom-2 right-4 h-4 w-4 rotate-45 bg-white" />
          </div>

          {/* 关闭按钮 */}
          <button 
            onClick={(e) => { e.stopPropagation(); setIsVisible(false); }}
            className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-gray-200 text-gray-500 opacity-0 transition-opacity hover:bg-gray-300 group-hover:opacity-100"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      </div>

      {/* 回忆卡片弹窗 */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-md overflow-hidden border-none bg-transparent p-0 shadow-none sm:max-w-lg">
          <div className="relative overflow-hidden rounded-2xl bg-[#fffef9] shadow-2xl">
            {/* 信纸纹理背景 - 添加 pointer-events-none 防止遮挡点击 */}
            <div className="pointer-events-none absolute inset-0 opacity-50" 
                 style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '20px 20px' }} 
            />
            
            {/* 顶部装饰 */}
            <div className="relative h-32 bg-gradient-to-br from-yellow-100 to-orange-50 p-6">
              <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-yellow-200/50 blur-2xl" />
              <div className="flex flex-col gap-1">
                <span className="flex items-center gap-2 text-xs font-medium uppercase tracking-wider text-yellow-700/60">
                  <Sparkles className="h-3 w-3" />
                  Memory Capsule
                </span>
                <DialogTitle className="font-serif text-2xl font-bold text-gray-800">
                  {memory.type === 'anniversary' ? '那年今日' : '时光漫游'}
                </DialogTitle>
                <p className="text-sm text-gray-500">
                  {new Date(memory.createdAt).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}
                  {' · '}
                  {formatDistanceToNow(new Date(memory.createdAt), { addSuffix: true, locale: zhCN })}
                </p>
              </div>
            </div>

            {/* 内容区域 */}
            <div className="relative p-6">
              <div className="mb-4 text-xl font-bold text-gray-900">{memory.title}</div>
              <div className="prose prose-sm prose-stone max-h-[300px] overflow-y-auto rounded-lg bg-white/50 p-4">
                 <ReactMarkdown remarkPlugins={[remarkGfm]}>
                   {previewContent}
                 </ReactMarkdown>
              </div>
            </div>

            {/* 底部互动 - 添加 relative z-10 确保在最上层 */}
            <div className="relative z-10 bg-gray-50 px-6 py-4 text-center">
              <p className="mb-3 text-xs italic text-gray-400">
                "此刻的你，想对那时的自己说些什么？"
              </p>
              <Button 
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white"
                onClick={() => {
                   console.log('Navigating to note:', memory.id)
                   setIsOpen(false)
                   toast.success('已收到你的跨时空回信 📨')
                   router.push(`/notes/${memory.id}`)
                }}
              >
                收下这份回忆
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}

