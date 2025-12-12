'use client'

// 移动端专用的顶部导航栏（包含汉堡菜单）
import { useState } from 'react'
import { Menu } from 'lucide-react'

import { Sidebar } from '@/components/Sidebar'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'

import { FolderWithCount, TagWithCount } from '@/lib/types'

interface MobileNavWrapperProps {
  folders: FolderWithCount[]
  tags: TagWithCount[]
}

export function MobileNavWrapper({ folders, tags }: MobileNavWrapperProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="bg-background/80 sticky top-0 z-50 flex items-center border-b p-4 backdrop-blur-md md:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-72 pr-0">
          <SheetTitle className="sr-only">导航菜单</SheetTitle>
          <Sidebar
            className="h-full pt-4"
            onNavClick={() => setOpen(false)}
            folders={folders}
            tags={tags}
          />
        </SheetContent>
      </Sheet>
      <span className="text-lg font-bold tracking-tight">熙记</span>
    </div>
  )
}
