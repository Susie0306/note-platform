'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@clerk/nextjs'
import { RefreshCw, Wifi, WifiOff } from 'lucide-react'
import { toast } from 'sonner'

import { popSyncQueue, saveNotesToLocal } from '@/lib/indexeddb'
import { createNote, deleteNote, updateNote } from '@/app/actions/notes' // 引入现有的 Server Actions

// 注意：我们需要一个新的 Server Action 来获取所有笔记用于缓存，稍后创建

export function SyncManager() {
  const [isOnline, setIsOnline] = useState(true)
  const [isSyncing, setIsSyncing] = useState(false)
  const { isSignedIn } = useAuth()

  // 监听网络状态
  useEffect(() => {
    // 初始化状态
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      toast.success('网络已连接，正在同步...')
      processQueue() // 网络恢复，立即处理队列
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.warning('网络已断开，进入离线模式')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // 处理同步队列的核心逻辑
  const processQueue = async () => {
    if (isSyncing) return
    setIsSyncing(true)

    try {
      const queue = await popSyncQueue()
      if (queue.length === 0) {
        setIsSyncing(false)
        return
      }

      console.log(`正在处理 ${queue.length} 个离线任务...`)

      for (const task of queue) {
        try {
          if (task.type === 'UPDATE') {
            // 先检查 payload 是否存在
            if (task.payload) {
              const { title, content, tags } = task.payload
              await updateNote(task.noteId, title, content, tags)
            }
          } else if (task.type === 'DELETE') {
            await deleteNote(task.noteId)
          }
        } catch (err) {
          console.error('同步任务失败:', task, err)
        }
      }

      toast.success('所有离线操作已同步！')
    } catch (error) {
      console.error('同步过程出错', error)
    } finally {
      setIsSyncing(false)
    }
  }
  // 简单的 UI 反馈 (显示在右下角)
  if (!isSignedIn) return null

  return (
    <div className="bg-background/80 fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium shadow-lg backdrop-blur">
      {isSyncing ? (
        <>
          <RefreshCw className="h-3 w-3 animate-spin text-blue-500" />
          <span>同步中...</span>
        </>
      ) : isOnline ? (
        <>
          <Wifi className="h-3 w-3 text-green-500" />
          <span className="text-muted-foreground">已连接</span>
        </>
      ) : (
        <>
          <WifiOff className="h-3 w-3 text-red-500" />
          <span className="text-red-500">离线模式</span>
        </>
      )}
    </div>
  )
}
