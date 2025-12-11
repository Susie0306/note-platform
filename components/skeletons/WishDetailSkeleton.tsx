import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { ChevronLeft } from "lucide-react"

export function WishDetailSkeleton() {
  return (
    <div className="container mx-auto max-w-4xl p-6">
      {/* 顶部导航 */}
      <div className="mb-6 flex items-center gap-2">
        <Button variant="ghost" size="sm" disabled className="text-muted-foreground">
          <ChevronLeft className="mr-1 h-4 w-4" />
          返回心愿列表
        </Button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
        {/* 左侧：时间轴与日志 */}
        <div className="space-y-8">
          {/* 头部信息 */}
          <div className="space-y-4">
            <div className="flex items-start justify-between gap-4">
              <Skeleton className="h-10 w-2/3" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-9 w-9 rounded-full" />
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4">
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-40" />
            </div>
          </div>

          <Separator />

          {/* 记录输入框 */}
          <div className="space-y-2">
            <Skeleton className="h-7 w-24 mb-4" />
            <Skeleton className="h-32 w-full rounded-md" />
            <div className="flex justify-end">
              <Skeleton className="h-9 w-24" />
            </div>
          </div>

          {/* 时间轴展示 */}
          <div className="relative space-y-8 border-l-2 border-dashed border-gray-200 ml-2 pl-8 pt-2">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="relative">
                {/* 时间轴节点 */}
                <div className="absolute -left-[43px] flex h-5 w-5 items-center justify-center rounded-full bg-gray-100 ring-4 ring-white">
                  <div className="h-2 w-2 rounded-full bg-gray-300" />
                </div>
                
                {/* 日志卡片 */}
                <div className="rounded-lg border bg-white p-4 shadow-sm">
                  <Skeleton className="h-4 w-32 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 右侧：侧边信息与控制 */}
        <div className="space-y-6">
          {/* 进度控制 */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <Skeleton className="h-6 w-24" />
            <div className="flex justify-between items-center">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-4 w-12" />
            </div>
            <Skeleton className="h-2 w-full rounded-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          
          {/* AI 希冀寄语 */}
          <div className="rounded-xl border bg-card text-card-foreground shadow-sm p-6 space-y-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-5 w-5" />
              <Skeleton className="h-6 w-24" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


