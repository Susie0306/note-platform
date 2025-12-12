'use client'

import React, { useState, useEffect } from 'react'
import { Folder as FolderIcon, Plus, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { createFolder, getNavigationData } from '@/app/actions/navigation'
import { updateNoteFolder } from '@/app/actions/notes'
import { toast } from 'sonner'
import { FolderWithCount } from '@/lib/types'

interface FolderSelectorProps {
  noteId: string
  currentFolderId: string | null | undefined
  onChange?: (folderId: string | null) => void
  onUpdate?: () => void
}

export function FolderSelector({ noteId, currentFolderId, onChange, onUpdate }: FolderSelectorProps) {
  const [open, setOpen] = useState(false)
  const [folders, setFolders] = useState<FolderWithCount[]>([])
  const [search, setSearch] = useState('')

  // 挂载和打开时加载文件夹
  const loadFolders = async () => {
    try {
      const { folders } = await getNavigationData()
      setFolders(folders)
    } catch (error) {
      console.error('Failed to load folders', error)
    }
  }

  useEffect(() => {
    loadFolders()
  }, [])

  const handleSelect = async (folderId: string | null) => {
    try {
      // 乐观更新
      if (onChange) onChange(folderId)
      
      await updateNoteFolder(noteId, folderId)
      if (onUpdate) onUpdate()
      setOpen(false)
      toast.success(folderId ? '已移动到文件夹' : '已移出文件夹')
    } catch (error) {
      toast.error('移动失败')
    }
  }

  const handleCreateFolder = async () => {
    if (!search.trim()) return
    try {
      await createFolder(search)
      await loadFolders() // 重新加载以获取新文件夹
      
      // 找到新文件夹（假设它是具有匹配名称的文件夹）
      // 更好的方法是 createFolder 返回新文件夹
      const { folders: newFolders } = await getNavigationData()
      const newFolder = newFolders.find((f) => f.name === search)
      
      if (newFolder) {
        handleSelect(newFolder.id)
      } else {
        // 回退重新加载
        setFolders(newFolders)
        toast.success('文件夹创建成功，请重新选择')
      }
    } catch (error) {
      toast.error('创建文件夹失败')
    }
  }

  const currentFolder = folders.find(f => f.id === currentFolderId)

  return (
    <Popover open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen)
      if (isOpen) loadFolders()
    }}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 gap-1 px-2 text-muted-foreground hover:text-foreground"
          onClick={(e) => e.stopPropagation()}
        >
          <FolderIcon className="h-4 w-4" />
          <span className="max-w-[100px] truncate text-xs">
            {currentFolder ? currentFolder.name : '未分类'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[200px] p-0" 
        align="start" 
        onClick={(e) => e.stopPropagation()}
      >
        <Command>
          <CommandInput 
            placeholder="搜索或创建文件夹..." 
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <CommandEmpty>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-full justify-start text-xs"
                onClick={handleCreateFolder}
              >
                <Plus className="mr-2 h-3 w-3" />
                创建 "{search}"
              </Button>
            </CommandEmpty>
            <CommandGroup heading="现有文件夹">
              <CommandItem value="未分类" onSelect={() => handleSelect(null)}>
                <div className="flex w-full items-center justify-between">
                  <span>未分类</span>
                  {!currentFolderId && <Check className="h-4 w-4" />}
                </div>
              </CommandItem>
              {folders.map((folder) => (
                <CommandItem key={folder.id} value={folder.name} onSelect={() => handleSelect(folder.id)}>
                  <div className="flex w-full items-center justify-between">
                    <span className="truncate">{folder.name}</span>
                    {currentFolderId === folder.id && <Check className="h-4 w-4" />}
                  </div>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}



