'use client'

import React, { useState, useTransition } from 'react'
import { Loader2, Plus, Sparkles } from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { DatePicker } from '@/components/ui/date-picker'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createWish } from '@/app/actions/wishes'

const WISH_TEMPLATES = [
  { title: '来一次说走就走的旅行 ✈️', desc: '探索未知的世界' },
  { title: '读完 10 本好书 📚', desc: '充实精神世界' },
  { title: '学会一项新技能 🎸', desc: '吉他/编程/画画' },
  { title: '坚持运动 50 天 🏃', desc: '强健体魄' },
]

export function CreateWishDialog() {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState<Date>()
  const [isPending, startTransition] = useTransition()

  async function onSubmit(formData: FormData) {
    if (date) {
      formData.set('targetDate', date.toISOString())
    }

    startTransition(async () => {
      try {
        await createWish(formData)
        setOpen(false)
        setTitle('')
        setDate(undefined)
        toast.success('许愿成功！愿望一定会实现✨')
      } catch (error) {
        toast.error('许愿失败，请稍后重试')
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" />
          许个愿望
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="bg-primary/20 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
            <Sparkles className="text-primary h-6 w-6" />
          </div>
          <DialogTitle className="text-center">许下一个小希冀</DialogTitle>
          <DialogDescription className="text-center">
            写下你的心愿，设定一个目标日期，我们一起见证它的实现。
          </DialogDescription>
        </DialogHeader>

        <div className="mb-2 grid grid-cols-2 gap-2">
          {WISH_TEMPLATES.map((template) => (
            <button
              key={template.title}
              type="button"
              onClick={() => setTitle(template.title)}
              className={cn(
                'hover:bg-primary/5 flex flex-col items-start rounded-lg border p-3 text-left transition-colors',
                title === template.title
                  ? 'border-primary bg-primary/10 ring-primary ring-1'
                  : 'border-gray-200'
              )}
            >
              <span className="text-sm font-medium text-gray-900">{template.title}</span>
              <span className="mt-1 text-xs text-gray-500">{template.desc}</span>
            </button>
          ))}
        </div>

        <form action={onSubmit} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="title">心愿内容</Label>
            <Input
              id="title"
              name="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="例如：今年学会弹吉他..."
              required
              className="col-span-3"
            />
          </div>
          <div className="grid gap-2">
            <Label>目标日期 (可选)</Label>
            <DatePicker date={date} setDate={setDate} />
          </div>
          <DialogFooter>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90 w-full"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  许愿中...
                </>
              ) : (
                '确认许愿'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
