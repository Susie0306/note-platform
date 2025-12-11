import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { Trash2, FileText, Sparkles } from 'lucide-react'

import prisma from '@/lib/prisma'
import { TrashNotesList } from '@/components/TrashNotesList'
import { TrashWishCard } from '@/components/wishes/TrashWishCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

export default async function TrashPage() {
  const { userId } = await auth()
  if (!userId) redirect('/')

  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
  })
  if (!dbUser) return <div>暂无数据</div>

  // 查询已删除笔记
  const deletedNotes = await prisma.note.findMany({
    where: {
      userId: dbUser.id,
      deletedAt: { not: null },
    },
    orderBy: { deletedAt: 'desc' },
    take: 50,
  })

  // 查询已删除心愿
  const deletedWishes = await prisma.wish.findMany({
    where: {
      userId: dbUser.id,
      deletedAt: { not: null },
    },
    orderBy: { deletedAt: 'desc' },
    take: 50,
  })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">回收站</h1>
        <span className="text-sm text-gray-500 dark:text-gray-400">
           最近删除的内容
        </span>
      </div>

      <Tabs defaultValue="notes" className="w-full">
        <TabsList>
          <TabsTrigger value="notes" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            笔记 ({deletedNotes.length})
          </TabsTrigger>
          <TabsTrigger value="wishes" className="flex items-center gap-2">
            <Sparkles className="h-4 w-4" />
            心愿 ({deletedWishes.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="notes" className="mt-4">
          <TrashNotesList initialNotes={deletedNotes} />
        </TabsContent>

        <TabsContent value="wishes" className="mt-4">
          {deletedWishes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {deletedWishes.map((wish) => (
                <TrashWishCard key={wish.id} wish={wish} />
              ))}
            </div>
          ) : (
            <div className="py-20 text-center text-gray-400">
              <Trash2 className="mx-auto mb-4 h-12 w-12 opacity-20" />
              <p>没有已删除的心愿</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
