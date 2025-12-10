import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { zhCN } from '@clerk/localizations'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'
import { Sparkles, Sun } from 'lucide-react'

import { Sidebar } from '@/components/Sidebar'

import './globals.css'

import { MobileNavWrapper } from '@/components/MobileNavWrapper'
import { SyncManager } from '@/components/SyncManager'
import { ThemeColorProvider } from '@/components/theme-color-provider'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: '熙记 - 守护每一份小希冀',
  description: '在线知识笔记平台，记录生活中的小希冀',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider localization={zhCN}>
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased`}
          suppressHydrationWarning
        >
          {/* 防闪烁脚本 (必须放在 body 的第一个子元素) */}
          <script
            dangerouslySetInnerHTML={{
              __html: `
                (function() {
                  try {
                    var storageKey = 'xi-ji-theme-color';
                    var defaultTheme = 'yellow';
                    var color = localStorage.getItem(storageKey) || defaultTheme;
                    
                    // 如果不是中性色，立即加上类名
                    if (color !== 'neutral' && color !== 'default') {
                      document.body.classList.add('theme-' + color);
                    }
                  } catch (e) {}
                })()
              `,
            }}
          />
          {/* 先包裹 ThemeProvider (负责黑白模式) */}
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {/* 再包裹 ThemeColorProvider (负责彩色主题) */}
            <ThemeColorProvider>
              {/* 登录前 (SignedOut) 的布局：优化后的暖色主题落地页 */}
              <SignedOut>
                <div className="relative flex h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFFDE7] to-[#FFF59D] p-4 text-gray-800">
                  {/* 背景装饰：柔光光斑 */}
                  <div className="absolute left-[-10%] top-[-10%] h-[500px] w-[500px] animate-pulse rounded-full bg-yellow-300/30 blur-[100px]" />
                  <div className="absolute bottom-[-10%] right-[-10%] h-[600px] w-[600px] rounded-full bg-orange-200/20 blur-[120px]" />
                  
                  {/* 小装饰元素 */}
                  <div className="absolute left-[15%] top-[20%] text-yellow-500/40">
                    <Sun size={48} />
                  </div>
                  <div className="absolute bottom-[20%] right-[15%] text-orange-400/30">
                    <Sparkles size={32} />
                  </div>

                  {/* 主卡片 */}
                  <div className="relative z-10 w-full max-w-md rounded-2xl border border-white/50 bg-white/60 p-8 text-center shadow-xl backdrop-blur-md transition-all hover:bg-white/70">
                    <div className="mb-6 flex justify-center">
                      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-yellow-400/90 text-white shadow-lg shadow-yellow-200">
                        <Sparkles size={32} />
                      </div>
                    </div>
                    
                    <h1 className="mb-2 text-3xl font-bold text-gray-800">熙记</h1>
                    <p className="mb-6 text-lg font-medium text-gray-600">以笔记为载体，守护每一份小希冀</p>
                    
                    <p className="mb-8 text-sm leading-relaxed text-gray-500">
                      在这里，每一次记录都是奔赴美好的见证。<br />
                      无论灵感闪现、生活点滴，还是未来的心愿清单，<br />
                      熙记与你一同珍藏时光里的温暖。
                    </p>
                    
                    <div className="flex flex-col gap-3">
                      <SignInButton mode="modal">
                        <button className="w-full rounded-xl bg-yellow-500 py-3 font-medium text-white shadow-md transition-all hover:bg-yellow-600 hover:shadow-lg hover:shadow-yellow-200 active:scale-[0.98]">
                          登录我的空间
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="w-full rounded-xl border border-gray-200 bg-white py-3 font-medium text-gray-700 transition-all hover:bg-gray-50 hover:border-gray-300 active:scale-[0.98]">
                          注册新账号
                        </button>
                      </SignUpButton>
                    </div>
                  </div>
                  
                  {/* 底部版权/标语 */}
                  <div className="absolute bottom-6 text-xs text-gray-400/80">
                    记录生活 · 珍藏希冀 · 温暖随行
                  </div>
                </div>
              </SignedOut>

              {/* 登录后 (SignedIn) 的布局：显示侧边栏 + 主内容 */}
              <SignedIn>
                <div className="flex min-h-screen flex-col md:flex-row">
                  {/* 移动端顶部导航 (仅在手机显示) */}
                  <MobileNavWrapper />

                  {/* 桌面端侧边栏 (仅在桌面显示) */}
                  <aside className="bg-muted/40 hidden min-h-screen w-64 border-r md:block">
                    <Sidebar />
                  </aside>

                  {/* 主内容区域 */}
                  <main className="flex-1 p-6 md:p-6">{children}</main>
                </div>
                <SyncManager />
              </SignedIn>
              <Toaster />
            </ThemeColorProvider>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
