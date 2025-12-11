'use client'

import { useState } from 'react'
import { FileText, Loader2, Play, Sparkles, Wand2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'

import { useCompletion } from '@ai-sdk/react'

interface AIAssistantProps {
  // 获取当前编辑器内容的函数
  getContent: () => string
  // 将 AI 结果插入编辑器的函数
  onInsert: (text: string) => void
}

export function AIAssistant({ getContent, onInsert }: AIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeCommand, setActiveCommand] = useState<string | null>(null)

  // 使用 Vercel AI SDK 的 useCompletion 钩子
  const { completion, complete, isLoading, stop } = useCompletion({
    api: '/api/ai',
    onFinish: () => {
      // 完成后可以做些什么
    },
  })

  const handleCommand = (command: 'continue' | 'polish' | 'summarize') => {
    setActiveCommand(command)
    const context = getContent()

    if (!context) {
      alert('请先输入一些内容')
      return
    }

    // 发送请求
    complete('', {
      body: {
        command,
        context: context.slice(0, 2000), // 限制长度防止超长
      },
    })
  }

  const handleReplace = () => {
    if (completion) {
      onInsert(completion)
      setIsOpen(false)
    }
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-purple-500 hover:bg-purple-50 hover:text-purple-600"
        >
          <Sparkles className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0" align="start">
        <div className="p-4">
          <div className="mb-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-purple-500" />
            <h4 className="leading-none font-semibold">AI 助手 (DeepSeek)</h4>
          </div>

          {!isLoading && !completion && (
            <div className="grid gap-2">
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => handleCommand('continue')}
              >
                <Play className="mr-2 h-4 w-4" />
                续写 (接着往下写)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => handleCommand('polish')}
              >
                <Wand2 className="mr-2 h-4 w-4" />
                润色 (优化选中/全文)
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="justify-start"
                onClick={() => handleCommand('summarize')}
              >
                <FileText className="mr-2 h-4 w-4" />
                总结 (生成摘要)
              </Button>
            </div>
          )}

          {(isLoading || completion) && (
            <div className="space-y-4">
              <ScrollArea className="h-[200px] w-full rounded-md border bg-slate-50 p-4 text-sm">
                {completion}
                {isLoading && <Loader2 className="ml-2 inline h-3 w-3 animate-spin" />}
              </ScrollArea>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  className="flex-1"
                  onClick={handleReplace}
                  disabled={isLoading || !completion}
                >
                  插入内容
                </Button>
                {isLoading && (
                  <Button size="sm" variant="destructive" onClick={stop}>
                    停止
                  </Button>
                )}
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  )
}
