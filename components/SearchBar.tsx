'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Search, Sparkles } from 'lucide-react'
import { useDebounce } from 'use-debounce'

import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 初始化状态：如果 URL 里已经有 q 参数，就填进去
  const [text, setText] = useState(searchParams.get('q') || '')
  // AI 状态
  const [isAiEnabled, setIsAiEnabled] = useState(searchParams.get('ai') === 'true')

  // 防抖：300ms 后如果不输入了，query 才会变
  const [query] = useDebounce(text, 300)

  const [isPending, startTransition] = useTransition()

  // 监听 query 和 AI 模式变化，更新 URL
  useEffect(() => {
    // 避免初次渲染时的无限循环或不必要的 replace
    // 这里我们只在 query 或 isAiEnabled 实际发生变化（且与 URL 不符）时触发
    
    // 但是由于 useEffect 依赖项包含 searchParams，直接比较可能比较麻烦
    // 简单做法：每次变动都计算新的 params，如果 toString 变了再 replace
    
    const params = new URLSearchParams(searchParams.toString()) // Clone existing params

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    if (isAiEnabled) {
      params.set('ai', 'true')
    } else {
      params.delete('ai')
    }
    
    const newUrl = `/search?${params.toString()}`
    
    // 如果 URL 没变，就不操作
    // 注意：searchParams 是 ReadonlyURLSearchParams，toString() 得到的是 query string
    if (params.toString() === searchParams.toString()) {
        return
    }

    startTransition(() => {
      // replace: true 表示不增加历史记录，用户按后退键不会陷入死循环
      router.replace(newUrl)
    })
  }, [query, isAiEnabled, router, searchParams])

  return (
    <div className="flex flex-col gap-3">
      <div className="relative">
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        <Input
          placeholder="搜索笔记标题或内容..."
          className="pl-8"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        {isPending && (
          <Loader2 className="text-muted-foreground absolute top-2.5 right-2 h-4 w-4 animate-spin" />
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        <Switch
          id="ai-mode"
          checked={isAiEnabled}
          onCheckedChange={setIsAiEnabled}
        />
        <Label 
          htmlFor="ai-mode" 
          className={cn(
            "flex items-center gap-1.5 cursor-pointer text-sm font-medium transition-colors select-none",
            isAiEnabled ? "text-indigo-600 dark:text-indigo-400" : "text-muted-foreground"
          )}
        >
          <Sparkles className={cn("h-3.5 w-3.5", isAiEnabled && "fill-current")} />
          AI 语义检索 {isAiEnabled && <span className="text-xs font-normal opacity-80">(已启用)</span>}
        </Label>
      </div>
    </div>
  )
}
