'use client'

import React, { useState, useTransition, useEffect } from 'react'
import dynamic from 'next/dynamic'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { FileText, Home, Loader2, Menu, Plus, Search, Settings, Sparkles, Trash2 } from 'lucide-react'

// Dynamically import UserButton to avoid SSR hydration issues
const UserButton = dynamic(() => import('@clerk/nextjs').then(mod => mod.UserButton), {
  ssr: false,
})

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { createNote } from '@/app/actions/notes'
import { SidebarNavTree } from '@/components/SidebarNavTree'

// 侧边栏菜单配置
const sidebarNavItems = [
  {
    title: '首页',
    href: '/',
    icon: Home,
  },
  {
    title: '全部笔记',
    href: '/notes',
    icon: FileText,
  },
  {
    title: '小希冀',
    href: '/wishes',
    icon: Sparkles,
  },
  {
    title: '搜索',
    href: '/search',
    icon: Search,
  },
  {
    title: '设置',
    href: '/settings',
    icon: Settings,
  },
  {
    title: '回收站',
    href: '/trash',
    icon: Trash2,
  },
]

type SidebarProps = React.HTMLAttributes<HTMLDivElement> & {
  onNavClick?: () => void
  folders?: any[]
  tags?: any[]
}

export function Sidebar({ className, onNavClick, folders = [], tags = [] }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()


  const handleCreateNote = () => {
    startTransition(async () => {
      try {
        const result = await createNote() //调用后端逻辑
        if (result?.noteId) {
          router.push(`/notes/${result.noteId}`)
          if (onNavClick) onNavClick() //如果在移动端，创建后关闭菜单
        }
      } catch (error) {
        console.error('创建笔记失败:', error)
        // 这里以后可以加一个 toast 提示
      }
    })
  }
  return (
    <div className={cn('pb-12 h-full flex flex-col', className)}>
      <div className="space-y-4 py-4 flex-1 flex flex-col">
        <div className="px-3 py-2">
          <div className="mb-2 flex items-center justify-between px-4">
            <h2 className="text-lg font-semibold tracking-tight">我的笔记</h2>
            {/* 这里放置 Clerk 的用户按钮 */}
            <UserButton />
          </div>

          {/* "新建笔记" 按钮 - 核心功能 */}
          <div className="space-y-1 px-2">
            <Button
              className="w-full justify-start"
              variant="default"
              onClick={handleCreateNote}
              disabled={isPending} // 加载中禁止重复点击
            >
              {isPending ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> // 加载转圈
              ) : (
                <Plus className="mr-2 h-4 w-4" />
              )}
              {isPending ? '创建中...' : '新建笔记'}
            </Button>
          </div>
        </div>

        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">菜单</h2>
          <div className="space-y-1">
            <nav className="grid gap-1 px-2">
              {sidebarNavItems.map((item, index) => (
                <Link key={index} href={item.href} onClick={onNavClick}>
                  <span
                    className={cn(
                      'group hover:bg-accent hover:text-accent-foreground flex items-center rounded-md px-3 py-2 text-sm font-medium',
                      pathname === item.href
                        ? 'bg-primary/10 text-primary font-bold'
                        : 'text-muted-foreground hover:bg-primary/5 hover:text-primary'
                    )}
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    <span>{item.title}</span>
                  </span>
                </Link>
              ))}
            </nav>
          </div>
        </div>

        {/* 文件夹和标签树 */}
        <div className="flex-1 overflow-y-auto min-h-0">
           <SidebarNavTree folders={folders} tags={tags} />
        </div>
      </div>
    </div>
  )
}
