import { NoteCardSkeleton } from '@/components/NoteCardSkeleton'

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        {/* 页面标题骨架 */}
        <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
        <div className="h-4 w-20 animate-pulse rounded bg-gray-200" />
      </div>

      {/* 排序和操作栏骨架 */}
      <div className="mb-4 flex h-10 items-center justify-end gap-2">
        <div className="h-9 w-[140px] animate-pulse rounded-md bg-gray-200" />
        <div className="h-9 w-[100px] animate-pulse rounded-md bg-gray-200" />
      </div>

      {/* 网格布局，放置 9 个卡片骨架 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <NoteCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}
