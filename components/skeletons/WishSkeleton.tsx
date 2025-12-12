import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

export function WishSkeleton() {
  return (
    <div className="container mx-auto max-w-5xl space-y-8 p-6">
      {/* 顶部愿景墙区域 */}
      <div className="relative overflow-hidden rounded-3xl bg-gray-100 dark:bg-zinc-800 p-8 md:p-12">
        <div className="relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="space-y-4 w-full md:w-auto">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <Sparkles className="text-gray-300 dark:text-gray-600" />
              <Skeleton className="h-9 w-40" />
            </div>
            <Skeleton className="h-6 w-full md:w-96" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </div>

      {/* 心愿列表区域 */}
      <div className="space-y-6">
        <Skeleton className="h-7 w-24" />
        
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="relative overflow-hidden">
              <div className="h-2 w-full bg-gray-200 dark:bg-zinc-700" />
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between mb-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-8 w-8 rounded-full" />
                </div>
                <Skeleton className="h-7 w-3/4" />
              </CardHeader>
              <CardContent className="pb-4">
                <div className="mb-4 space-y-2">
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-12" />
                    <Skeleton className="h-4 w-8" />
                  </div>
                  <Skeleton className="h-2 w-full" />
                </div>
                <div className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-24" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}





