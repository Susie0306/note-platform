'use client'

import dynamic from 'next/dynamic'
import { Menu } from 'lucide-react'

import { Button } from '@/components/ui/button'

//定义一个“骨架屏”组件
function MobileNavSkeleton() {
  return (
    <div className="flex items-center border-b p-4 md:hidden">
      {/* 用一个不可点击的按钮占位 */}
      <Button variant="ghost" size="icon" className="mr-2" disabled>
        <Menu className="h-6 w-6 opacity-50" />
      </Button>
      {/* 标题占位 */}
      <span className="text-lg font-bold text-gray-400">笔记平台...</span>
    </div>
  )
}

//动态引入，配置 ssr: false 和 loading
const MobileNav = dynamic(() => import('@/components/Sidebar').then((mod) => mod.MobileNav), {
  ssr: false,
  //在 JS 加载前，先由服务器渲染这个骨架屏占位
  loading: () => <MobileNavSkeleton />,
})

export function MobileNavWrapper() {
  return <MobileNav />
}
