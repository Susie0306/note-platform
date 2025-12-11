import Link from 'next/link'
import { redirect } from 'next/navigation'
import { auth, currentUser } from '@clerk/nextjs/server'
import { getDailyMemory } from '@/app/actions/memories'
import { MemoryCapsule } from '@/components/memories/MemoryCapsule'
import { formatDistanceToNow } from 'date-fns'
import { zhCN } from 'date-fns/locale'
import { ArrowRight, FileText, PenLine, Sparkles } from 'lucide-react'

import prisma from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default async function Home() {
  const { userId } = await auth()
  
  if (!userId) {
    return null
  }

  let user
  try {
    user = await currentUser()
  } catch (e) {
    console.error('Error fetching current user:', e)
    return null
  }

  if (!user) {
    return null
  }

  // 获取数据库用户
  const dbUser = await prisma.user.findUnique({
    where: { clerkId: userId },
    include: {
      _count: {
        select: { 
          notes: true,
          wishes: true // 获取心愿数量
        },
      },
      wishes: { // 获取进行中的心愿
        where: { status: 'IN_PROGRESS' },
        take: 3,
        orderBy: { updatedAt: 'desc' }
      }
    },
  })

  // 如果是新用户，还没同步到本地库
  if (!dbUser) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 px-4 text-center">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">欢迎来到熙记</h2>
          <p className="text-muted-foreground text-lg">
            以笔记为载体，守护每一份小希冀
          </p>
        </div>

        <div className="max-w-xl space-y-4 text-gray-500">
          <p>
            在这里，您可以记录生活点滴，通过<span className="font-semibold text-gray-900 dark:text-gray-100">心愿追踪</span>记录奔赴美好的过程，
            也会在不经意间收到<span className="font-semibold text-gray-900 dark:text-gray-100">回忆胶囊</span>的温馨提醒。
          </p>
        </div>

        <Button asChild size="lg" className="mt-4">
          <Link href="/notes">开始您的记录之旅</Link>
        </Button>
      </div>
    )
  }

  // 获取最近的 3 条笔记
  const recentNotes = await prisma.note.findMany({
    where: { userId: dbUser.id, deletedAt: null },
    orderBy: { updatedAt: 'desc' },
    take: 3,
  })

  // 获取今日回忆
  const memory = await getDailyMemory()

  const fullName =
    [user.firstName, user.lastName].filter(Boolean).join('') || user.username || '朋友'
  // 获取当前时间段的问候语
  const hour = new Date().getHours()
  let greeting = '你好'
  if (hour < 12) greeting = '早上好'
  else if (hour < 18) greeting = '下午好'
  else greeting = '晚上好'

  return (
    <div className="space-y-8">
      {/* 记忆胶囊 (浮动展示) */}
      <MemoryCapsule memory={memory} />

      {/* 顶部欢迎区域 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
            {greeting}，{fullName}
          </h1>
          <p className="mt-2 text-gray-500">今天有什么小希冀想要记录吗？</p>
        </div>
      </div>

      {/* 统计卡片区域 */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">总笔记</CardTitle>
            <FileText className="text-muted-foreground h-4 w-4" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{dbUser._count.notes}</div>
            <p className="text-muted-foreground text-xs">记录的点点滴滴</p>
          </CardContent>
        </Card>

        {/* 心愿统计 */}
        <Link href="/wishes" className="block transition-transform hover:scale-[1.02]">
          <Card className="h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">小希冀</CardTitle>
              <Sparkles className="text-muted-foreground h-4 w-4" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{dbUser._count.wishes}</div>
              <p className="text-muted-foreground text-xs">正在奔赴的美好</p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* 最近记录 */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">最近编辑</h2>
        {recentNotes.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {recentNotes.map((note) => (
              <Link key={note.id} href={`/notes/${note.id}`}>
                <Card className="h-full transition-colors hover:bg-gray-50 dark:hover:bg-gray-800/50">
                  <CardHeader>
                    <CardTitle className="line-clamp-1 text-lg">
                      {note.title || '无标题笔记'}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-sm text-gray-500">
                      {note.content || '暂无内容...'}
                    </p>
                    <p className="mt-4 text-xs text-gray-400">
                      {formatDistanceToNow(new Date(note.updatedAt), {
                        addSuffix: true,
                        locale: zhCN,
                      })}{' '}
                      更新
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed p-8 text-center text-gray-500">
            还没有记录，快去写下第一条笔记吧！
          </div>
        )}
      </div>
    </div>
  )
}
