import React from 'react'
import Link from 'next/link'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { Calendar, MoreHorizontal, Target } from 'lucide-react'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'

interface WishCardProps {
  wish: {
    id: string
    title: string
    targetDate: Date | null
    progress: number
    status: string
    createdAt: Date
  }
}

export function WishCard({ wish }: WishCardProps) {
  const daysLeft = wish.targetDate
    ? Math.ceil((new Date(wish.targetDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  return (
    <Link href={`/wishes/${wish.id}`}>
      <Card className="group relative overflow-hidden transition-all hover:shadow-md cursor-pointer">
        {/* 顶部装饰条 */}
        <div className={`h-2 w-full ${wish.status === 'COMPLETED' ? 'bg-green-500' : 'bg-primary'}`} />
        
        <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <Badge variant="outline" className="mb-2 w-fit font-normal text-muted-foreground">
            {wish.status === 'COMPLETED' ? '已达成' : '进行中'}
          </Badge>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </div>
        <CardTitle className="line-clamp-2 text-lg leading-snug">{wish.title}</CardTitle>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>完成进度</span>
            <span>{wish.progress}%</span>
          </div>
          <Progress value={wish.progress} className="h-2" />
        </div>
        
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {wish.targetDate && (
            <div className="flex items-center gap-1">
              <Target className="h-3 w-3" />
              <span>
                {daysLeft && daysLeft > 0 ? `还有 ${daysLeft} 天` : '已到期'}
              </span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            <span>{formatDistanceToNow(new Date(wish.createdAt), { addSuffix: true, locale: zhCN })}许下</span>
          </div>
        </div>
      </CardContent>
    </Card>
    </Link>
  )
}

