import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

export function NoteCardSkeleton() {
  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        {/* 标题骨架 */}
        <Skeleton className="h-6 w-2/3" />
      </CardHeader>
      <CardContent className="flex-1 space-y-3">
        {/* 标签骨架 */}
        <div className="flex gap-2">
          <Skeleton className="h-5 w-12" />
          <Skeleton className="h-5 w-16" />
        </div>
        {/* 内容骨架 (模拟3行文本) */}
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </CardContent>
      <CardFooter>
        {/* 底部时间骨架 */}
        <Skeleton className="h-3 w-24" />
      </CardFooter>
    </Card>
  )
}
