import { NoteCardSkeleton } from '@/components/NoteCardSkeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/* 页面标题骨架 */}
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
      </div>

      {/* 网格布局，放置 6 个卡片骨架 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <NoteCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
