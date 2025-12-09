'use client'

import { useEffect, useState } from 'react'
import { Loader2, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'

import { getAllSyncTasks, removeSyncTask, type SyncTask } from '@/lib/indexeddb'
import { deleteNote, updateNote } from '@/app/actions/notes'

export function SyncManager() {
  const [isSyncing, setIsSyncing] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  const processQueue = async () => {
    if (isSyncing) return
    setIsSyncing(true)

    try {
      // 1. 获取所有待同步任务 (只读取，不删除)
      const tasks = await getAllSyncTasks()

      if (tasks.length === 0) {
        setIsSyncing(false)
        return
      }

      console.log(`发现 ${tasks.length} 个离线任务，开始同步...`)
      let processedCount = 0

      for (const task of tasks) {
        try {
          // 2. 根据任务类型执行操作
          if (task.type === 'UPDATE' && task.payload) {
            const { title, content, tags } = task.payload
            await updateNote(task.noteId, title, content, tags)
          } else if (task.type === 'DELETE') {
            await deleteNote(task.noteId)
          }

          // 3. 只有同步成功了，才从 IndexedDB 移除该任务
          if (task.id) {
            await removeSyncTask(task.id)
            processedCount++
          }
        } catch (err) {
          console.error(`任务 ${task.id} 同步失败，保留在队列中:`, err)
          // 失败的任务会保留在 DB 中，等待下一次联网时重试
        }
      }

      if (processedCount > 0) {
        toast.success(`已同步 ${processedCount} 项离线变更`)
      }
    } catch (error) {
      console.error('同步过程发生错误:', error)
    } finally {
      setIsSyncing(false)
    }
  }

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => {
      setIsOnline(true)
      toast.info('网络已恢复，正在同步数据...')
      processQueue()
    }

    const handleOffline = () => {
      setIsOnline(false)
      toast.warning('网络已断开，进入离线模式')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // 组件挂载时，如果在线，尝试同步一次
    if (navigator.onLine) {
      processQueue()
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // UI 渲染逻辑
  if (!isOnline) {
    return (
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-orange-500 px-4 py-2 text-xs text-white shadow-lg">
        <RefreshCw className="h-3 w-3 animate-spin" />
        离线模式
      </div>
    )
  }

  if (isSyncing) {
    return (
      <div className="fixed right-4 bottom-4 z-50 flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-xs text-white shadow-lg">
        <Loader2 className="h-3 w-3 animate-spin" />
        正在同步...
      </div>
    )
  }

  return null
}
