'use client'

import React, { useState, useTransition } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import {
  ChevronDown,
  ChevronRight,
  Folder,
  FolderOpen,
  Hash,
  MoreHorizontal,
  Plus,
  Trash2,
} from 'lucide-react'
import { toast } from 'sonner'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createFolder, createTag, deleteFolder, deleteTag } from '@/app/actions/navigation'

import { FolderWithCount, TagWithCount } from '@/lib/types'

// 定义简单的树节点接口
interface NavNode {
  id: string
  name: string
  parentId: string | null
  count?: number
  children?: NavNode[]
  type: 'folder' | 'tag'
}

interface SidebarNavTreeProps {
  folders: FolderWithCount[]
  tags: TagWithCount[]
}

export function SidebarNavTree({ folders, tags }: SidebarNavTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set())
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newItemType, setNewItemType] = useState<'folder' | 'tag'>('folder')
  const [newItemName, setNewItemName] = useState('')
  const [newItemParentId, setNewItemParentId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const pathname = usePathname()
  const searchParams = useSearchParams()
  const currentFolderId = searchParams.get('folderId')
  const currentTagId = searchParams.get('tagId')

  // 构建树结构
  const buildTree = (items: (FolderWithCount | TagWithCount)[], type: 'folder' | 'tag'): NavNode[] => {
    const itemMap = new Map<string, NavNode>()
    const roots: NavNode[] = []

    // 1. 初始化所有节点
    items.forEach((item) => {
      itemMap.set(item.id, {
        id: item.id,
        name: item.name,
        parentId: item.parentId,
        count: item._count?.notes || 0,
        children: [],
        type,
      })
    })

    // 2. 组装父子关系
    items.forEach((item) => {
      const node = itemMap.get(item.id)!
      if (item.parentId && itemMap.has(item.parentId)) {
        itemMap.get(item.parentId)!.children!.push(node)
      } else {
        roots.push(node)
      }
    })

    return roots
  }

  const folderTree = buildTree(folders, 'folder')
  const tagTree = buildTree(tags, 'tag')

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    const newExpanded = new Set(expandedIds)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedIds(newExpanded)
  }

  const handleCreateSubmit = () => {
    if (!newItemName.trim()) return

    startTransition(async () => {
      try {
        if (newItemType === 'folder') {
          await createFolder(newItemName, newItemParentId || undefined)
        } else {
          await createTag(newItemName, newItemParentId || undefined)
        }
        setIsDialogOpen(false)
        setNewItemName('')
        setNewItemParentId(null)
        toast.success(`创建${newItemType === 'folder' ? '文件夹' : '标签'}成功`)
      } catch (error) {
        toast.error('创建失败')
      }
    })
  }

  const handleDelete = (id: string, type: 'folder' | 'tag') => {
    startTransition(async () => {
      try {
        if (type === 'folder') await deleteFolder(id)
        else await deleteTag(id)
        toast.success('删除成功')
      } catch (e) {
        toast.error('删除失败')
      }
    })
  }

  const openCreateDialog = (type: 'folder' | 'tag', parentId: string | null = null) => {
    setNewItemType(type)
    setNewItemParentId(parentId)
    setNewItemName('')
    setIsDialogOpen(true)
  }

  // 递归渲染树节点
  const renderTree = (nodes: NavNode[], depth = 0) => {
    return nodes.map((node) => {
      const isExpanded = expandedIds.has(node.id)
      const hasChildren = node.children && node.children.length > 0
      const isActive =
        node.type === 'folder' ? currentFolderId === node.id : currentTagId === node.id

      return (
        <div key={node.id}>
          <div
            className={cn(
              'group hover:bg-accent hover:text-accent-foreground flex items-center justify-between rounded-md px-2 py-1.5 text-sm font-medium',
              isActive ? 'bg-accent text-accent-foreground' : 'text-muted-foreground'
            )}
            style={{ paddingLeft: `${depth * 12 + 8}px` }}
          >
            <Link
              href={`/notes?${node.type === 'folder' ? 'folderId' : 'tagId'}=${node.id}`}
              className="flex flex-1 items-center gap-2 overflow-hidden"
            >
              {hasChildren ? (
                <button
                  onClick={(e) => toggleExpand(node.id, e)}
                  className="h-4 w-4 shrink-0 opacity-50 hover:opacity-100"
                >
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4" />
                  ) : (
                    <ChevronRight className="h-4 w-4" />
                  )}
                </button>
              ) : (
                <span className="w-4" /> // 占位
              )}

              {node.type === 'folder' ? (
                isExpanded ? (
                  <FolderOpen className="h-4 w-4 shrink-0 text-blue-500" />
                ) : (
                  <Folder className="h-4 w-4 shrink-0 text-blue-500" />
                )
              ) : (
                <Hash className="h-3 w-3 shrink-0 text-orange-500" />
              )}

              <span className="truncate">{node.name}</span>
              {node.count !== undefined && node.count > 0 && (
                <span className="ml-auto text-xs opacity-50">{node.count}</span>
              )}
            </Link>

            {/* 操作菜单 */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 opacity-0 group-hover:opacity-100"
                >
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => openCreateDialog(node.type, node.id)}>
                  <Plus className="mr-2 h-4 w-4" />
                  新建子{node.type === 'folder' ? '文件夹' : '标签'}
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600"
                  onClick={() => handleDelete(node.id, node.type)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  删除
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {isExpanded && node.children && (
            <div className="mt-1">{renderTree(node.children, depth + 1)}</div>
          )}
        </div>
      )
    })
  }

  return (
    <div className="space-y-4 px-3">
      {/* 文件夹部分 */}
      <div>
        <div className="mb-1 flex items-center justify-between px-2 py-1">
          <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            文件夹
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => openCreateDialog('folder')}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-0.5">{renderTree(folderTree)}</div>
      </div>

      {/* 标签部分 */}
      <div>
        <div className="mt-4 mb-1 flex items-center justify-between px-2 py-1">
          <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            标签
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-5 w-5"
            onClick={() => openCreateDialog('tag')}
          >
            <Plus className="h-3 w-3" />
          </Button>
        </div>
        <div className="space-y-0.5">{renderTree(tagTree)}</div>
      </div>

      {/* 创建对话框 */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {newItemParentId ? '新建子' : '新建'}
              {newItemType === 'folder' ? '文件夹' : '标签'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>名称</Label>
              <Input
                value={newItemName}
                onChange={(e) => setNewItemName(e.target.value)}
                placeholder={`请输入${newItemType === 'folder' ? '文件夹' : '标签'}名称`}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleCreateSubmit()
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              取消
            </Button>
            <Button onClick={handleCreateSubmit} disabled={isPending || !newItemName.trim()}>
              {isPending && <Plus className="mr-2 h-4 w-4 animate-spin" />}
              创建
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


