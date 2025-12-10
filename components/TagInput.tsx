'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'

import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

interface TagInputProps {
  tags: string[]
  setTags: (tags: string[]) => void
  placeholder?: string
}
const SUGGESTED_TAGS = ['工作', '生活', '学习', '旅行', '小希冀']
export function TagInput({ tags, setTags, placeholder }: TagInputProps) {
  const [inputValue, setInputValue] = useState('')

  // 处理键盘事件
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      const newTag = inputValue.trim()

      // 只有非空且不重复的标签才添加
      if (newTag && !tags.includes(newTag)) {
        setTags([...tags, newTag])
        setInputValue('')
      }
    } else if (e.key === 'Backspace' && !inputValue && tags.length > 0) {
      // 输入框为空时按退格，删除最后一个标签
      e.preventDefault()
      setTags(tags.slice(0, -1))
    }
  }

  // 删除标签
  const removeTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove))
  }

  return (
    <div className="space-y-1">
      <div className="focus-within:ring-ring ring-offset-background flex flex-wrap gap-2 rounded-md bg-transparent py-1 focus-within:ring-2 focus-within:ring-offset-2">
        {tags.map((tag, index) => (
          <Badge
            key={index}
            variant="outline"
            className="bg-primary/10 text-primary gap-1 border-transparent px-2 py-1 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="ring-offset-background focus:ring-ring hover:bg-primary/20 ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
            >
              <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
              <span className="sr-only">Remove {tag}</span>
            </button>
          </Badge>
        ))}

        <Input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder || '输入标签，按回车添加...' : ''}
          className="h-7 min-w-[120px] flex-1 border-none px-1 shadow-none focus-visible:ring-0"
        />
      </div>
      <div className="flex items-center gap-2 text-xs text-gray-500 flex-wrap">
        <span>快速添加:</span>
        {SUGGESTED_TAGS.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => {
              if (!tags.includes(tag)) setTags([...tags, tag])
            }}
            className="cursor-pointer rounded-full bg-secondary/10 px-3 py-1 text-xs text-secondary-foreground hover:bg-secondary/20 transition-colors"
          >
            {tag}
          </button>
        ))}
      </div>
    </div>
  )
}
