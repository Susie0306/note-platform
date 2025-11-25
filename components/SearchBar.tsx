'use client'

import { useEffect, useState, useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Loader2, Search } from 'lucide-react'
import { useDebounce } from 'use-debounce'

import { Input } from '@/components/ui/input'

export function SearchBar() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // 初始化状态：如果 URL 里已经有 q 参数，就填进去
  const [text, setText] = useState(searchParams.get('q') || '')

  // 防抖：300ms 后如果不输入了，query 才会变
  const [query] = useDebounce(text, 300)

  const [isPending, startTransition] = useTransition()

  // 监听 query 变化，更新 URL
  useEffect(() => {
    const params = new URLSearchParams(searchParams)

    if (query) {
      params.set('q', query)
    } else {
      params.delete('q')
    }

    startTransition(() => {
      // replace: true 表示不增加历史记录，用户按后退键不会陷入死循环
      router.replace(`/search?${params.toString()}`)
    })
  }, [query, router, searchParams])

  return (
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
  )
}
