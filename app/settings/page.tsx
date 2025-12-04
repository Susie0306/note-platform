'use client'

import { useEffect, useState } from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'
import { ThemeColor, useThemeColor } from '@/components/theme-color-provider'

// 主题色配置
const themeColors: { name: string; value: ThemeColor; color: string }[] = [
  { name: '柔暖日光黄', value: 'yellow', color: '#FFD166' },
  { name: '柔粉紫', value: 'purple', color: '#E8C8F7' },
  { name: '暖橙红', value: 'orange', color: '#FF7F50' },
  { name: '浅青蓝', value: 'blue', color: '#87CEEB' },
  { name: '暖棕黄', value: 'brown', color: '#D2B48C' },
]

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { themeColor, setThemeColor } = useThemeColor()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMounted(true)
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  if (!mounted) return null

  // 处理基础外观点击 (互斥逻辑)
  const handleBaseAppearance = (mode: string) => {
    setTheme(mode)
    setThemeColor('neutral') // 选中基础外观时，清除主题色，回归黑白
  }

  // 处理主题色点击 (互斥逻辑)
  const handleThemeColor = (color: ThemeColor) => {
    setThemeColor(color)
    setTheme('light') // 选中彩色主题时，强制切回浅色模式以展示背景色
  }

  // 判断当前是否是基础外观选中状态
  // 只有当 themeColor 是 neutral 时，才显示基础外观被选中
  const isBaseSelected = (mode: string) => theme === mode && themeColor === 'neutral'

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold">设置</h1>

      {/* 基础外观 (纯净黑白) */}
      <div className="bg-card space-y-4 rounded-lg border p-4 shadow-sm">
        <div>
          <h3 className="text-lg font-medium">基础外观</h3>
          <p className="text-muted-foreground text-sm">纯净的中性色风格</p>
        </div>

        <div className="grid max-w-md grid-cols-3 gap-4">
          {[
            { value: 'light', label: '浅色', icon: Sun },
            { value: 'dark', label: '深色', icon: Moon },
            { value: 'system', label: '跟随系统', icon: Monitor },
          ].map((item) => (
            <button
              key={item.value}
              onClick={() => handleBaseAppearance(item.value)}
              className={cn(
                'hover:bg-accent hover:text-accent-foreground flex flex-col items-center justify-between rounded-md border-2 p-4 transition-all',
                // 选中状态：必须是 theme 匹配 且 themeColor 为 neutral
                isBaseSelected(item.value)
                  ? 'border-primary bg-accent text-accent-foreground'
                  : 'border-muted bg-popover'
              )}
            >
              <item.icon className="mb-2 h-6 w-6" />
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 情感主题 (全屏染色) */}
      <div className="bg-card space-y-4 rounded-lg border p-4 shadow-sm">
        <div>
          <h3 className="text-lg font-medium">情感主题</h3>
          <p className="text-muted-foreground text-sm">沉浸式的色彩体验 (自动切换为浅色模式)</p>
        </div>

        <div className="flex flex-wrap gap-6 pt-2">
          {themeColors.map((item) => (
            <button
              key={item.value}
              onClick={() => handleThemeColor(item.value)}
              className="group relative flex flex-col items-center gap-2"
            >
              <div
                className={cn(
                  'flex h-14 w-14 items-center justify-center rounded-full border-2 shadow-sm transition-all group-hover:scale-110',
                  themeColor === item.value
                    ? 'scale-110 border-black/50 ring-2 ring-black/20'
                    : 'border-transparent'
                )}
                style={{ backgroundColor: item.color }}
              >
                {themeColor === item.value && <Check className="h-6 w-6 text-black/60" />}
              </div>
              <span
                className={cn(
                  'text-xs font-medium transition-colors',
                  themeColor === item.value
                    ? 'text-foreground'
                    : 'text-muted-foreground group-hover:text-foreground'
                )}
              >
                {item.name}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
