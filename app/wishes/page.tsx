import React from 'react'
import { getWishes } from '@/app/actions/wishes'
import { CreateWishDialog } from '@/components/wishes/CreateWishDialog'
import { WishCard } from '@/components/wishes/WishCard'
import { Sparkles } from 'lucide-react'

export default async function WishesPage() {
  const wishes = await getWishes()

  return (
    <div className="container mx-auto max-w-5xl space-y-8 p-6">
      {/* 顶部愿景墙区域 */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-primary/10 to-accent/10 p-8 md:p-12">
        {/* 装饰背景 */}
        <div className="absolute -right-10 -top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute -left-10 -bottom-10 h-64 w-64 rounded-full bg-accent/20 blur-3xl" />
        
        <div className="relative z-10 flex flex-col items-center justify-between gap-6 text-center md:flex-row md:text-left">
          <div className="space-y-4">
            <h1 className="flex items-center justify-center gap-3 text-3xl font-bold text-gray-800 dark:text-gray-100 md:justify-start">
              <Sparkles className="text-primary" />
              我的小希冀
            </h1>
            <p className="max-w-xl text-lg text-gray-600 dark:text-gray-300">
              这里记录着你对未来的每一份期待。设定目标，记录过程，让我们一起见证美好的发生。
            </p>
          </div>
          <CreateWishDialog />
        </div>
      </div>

      {/* 心愿列表区域 */}
      <div className="space-y-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">心愿清单</h2>
        
        {wishes.length === 0 ? (
          <div className="flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed bg-gray-50/50 dark:bg-zinc-900/50 dark:border-zinc-700 p-8 text-center">
            <div className="mb-4 rounded-full bg-gray-100 dark:bg-zinc-800 p-4">
              <Sparkles className="h-8 w-8 text-gray-400 dark:text-gray-500" />
            </div>
            <h3 className="mb-2 text-lg font-medium text-gray-900 dark:text-gray-100">还没有许下心愿</h3>
            <p className="mb-6 text-gray-500 dark:text-gray-400">试着许下第一个愿望吧，无论是大梦想还是小确幸</p>
            <CreateWishDialog />
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishes.map((wish) => (
              <WishCard key={wish.id} wish={wish} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
