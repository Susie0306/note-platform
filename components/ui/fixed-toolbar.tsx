'use client'

import React from 'react'

import { cn } from '@/lib/utils'
import { Toolbar } from '@/components/ui/toolbar'

export function FixedToolbar({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    // 外部容器：负责定位（吸顶）和居中
    <div className="sticky top-4 z-50 mx-auto mb-4 w-fit transition-all duration-500 ease-in-out">
      {/* 内部 Toolbar：负责磨砂玻璃效果、圆角、边框和阴影 */}
      <Toolbar
        className={cn(
          'bg-background/95 supports-[backdrop-filter]:bg-background/60 flex items-center gap-1 rounded-full border p-1 px-2 shadow-md backdrop-blur dark:bg-zinc-900/80',
          className
        )}
      >
        {children}
      </Toolbar>
    </div>
  )
}
