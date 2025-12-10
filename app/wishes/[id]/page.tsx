import React from 'react'
import { notFound } from 'next/navigation'
import { getWish } from '@/app/actions/wishes'
import { LogCreator } from '@/components/wishes/LogCreator'
import { ProgressUpdater } from '@/components/wishes/ProgressUpdater'
import { WishMessage } from '@/components/wishes/WishMessage'
import { WishActions } from '@/components/wishes/WishActions'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Calendar, CheckCircle2, ChevronLeft, Clock, Flag, MapPin, Sparkles } from 'lucide-react'
import Link from 'next/link'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function WishDetailPage({ params }: PageProps) {
  const { id } = await params
  const wish = await getWish(id)

  if (!wish) {
    notFound()
  }

  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* 顶部导航 */}
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
          <Link href="/wishes">
            <ChevronLeft className="mr-1 h-4 w-4" />
            返回心愿列表
          </Link>
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* 左侧：时间轴与日志 */}
        <div className="space-y-8">
          {/* 头部信息 */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">{wish.title}</h1>
              <div className="flex items-center gap-2">
                {wish.status === 'COMPLETED' && (
                  <Badge className="bg-green-500 text-white hover:bg-green-600">
                    <CheckCircle2 className="mr-1 h-3 w-3" /> 已达成
                  </Badge>
                )}
                <WishActions wishId={wish.id} />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Flag className="h-4 w-4" />
                <span>
                  创建于 {formatDistanceToNow(new Date(wish.createdAt), { addSuffix: true, locale: zhCN })}
                </span>
              </div>
              {wish.targetDate && (
                <div className="flex items-center gap-1 text-primary">
                  <Clock className="h-4 w-4" />
                  <span>目标日期：{new Date(wish.targetDate).toLocaleDateString('zh-CN')}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* 记录输入框 */}
          <div className="space-y-2">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">心路历程</h3>
            <LogCreator wishId={wish.id} />
          </div>

          {/* 时间轴展示 */}
          <div className="relative space-y-8 border-l-2 border-dashed border-gray-200 pl-8 pt-2">
            {wish.logs.length === 0 ? (
              <div className="py-8 text-sm text-gray-400">
                还没有记录，写下你的第一条进度吧...
              </div>
            ) : (
              wish.logs.map((log) => (
                <div key={log.id} className="relative">
                  {/* 时间轴节点 */}
                  <div className="absolute -left-[39px] flex h-5 w-5 items-center justify-center rounded-full bg-primary/20 ring-4 ring-white">
                    <div className="h-2 w-2 rounded-full bg-primary" />
                  </div>
                  
                  {/* 日志卡片 */}
                  <div className="group rounded-lg border bg-white p-4 shadow-sm transition-shadow hover:shadow-md">
                    <div className="mb-2 text-xs text-gray-400">
                      {new Date(log.createdAt).toLocaleString('zh-CN', {
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                      })}
                    </div>
                    <div className="whitespace-pre-wrap text-gray-700">{log.content}</div>
                  </div>
                </div>
              ))
            )}
            
            {/* 起点 */}
            <div className="relative">
               <div className="absolute -left-[39px] flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white">
                 <div className="h-2 w-2 rounded-full bg-gray-300" />
               </div>
               <div className="py-1 text-sm text-gray-400">
                 许下心愿的这一天
               </div>
            </div>
          </div>
        </div>

        {/* 右侧：侧边信息与控制 */}
        <div className="space-y-6">
          {/* 进度控制 */}
          <ProgressUpdater wishId={wish.id} currentProgress={wish.progress} />
          
          {/* AI 希冀寄语 */}
          <WishMessage wishTitle={wish.title} />
        </div>
      </div>
    </div>
  )
}

