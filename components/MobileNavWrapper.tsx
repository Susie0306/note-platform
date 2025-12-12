'use client'

// 移动端专用的顶部导航栏（包含汉堡菜单）
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Sidebar } from '@/components/Sidebar'

interface MobileNavWrapperProps {
  folders: any[]
  tags: any[]
}

export function MobileNavWrapper({ folders, tags }: MobileNavWrapperProps) {
  const [open, setOpen] = useState(false)
  return (
    <div className="flex items-center border-b bg-background/80 p-4 backdrop-blur-md md:hidden sticky top-0 z-50">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="mr-2">
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="pr-0 w-72">
          <SheetTitle className="sr-only">导航菜单</SheetTitle>
          <Sidebar 
            className="pt-4 h-full" 
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
