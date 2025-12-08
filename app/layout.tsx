import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { zhCN } from '@clerk/localizations'
import { ClerkProvider, SignedIn, SignedOut, SignInButton, SignUpButton } from '@clerk/nextjs'

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
              {/* 登录前 (SignedOut) 的布局：简单显示一个居中的登录框 */}
              <SignedOut>
                <div className="flex h-screen w-full items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <h1 className="mb-4 text-2xl font-bold">欢迎来到熙记</h1>
                    <div className="flex justify-center gap-4">
                      <SignInButton mode="modal">
                        <button className="rounded bg-black px-4 py-2 text-white transition hover:bg-gray-800">
                          登录
                        </button>
                      </SignInButton>
                      <SignUpButton mode="modal">
                        <button className="rounded bg-blue-600 px-4 py-2 text-white transition hover:bg-blue-700">
                          注册
                        </button>
                      </SignUpButton>
                    </div>
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
