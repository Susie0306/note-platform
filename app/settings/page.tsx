'use client'

import { useEffect, useState } from 'react'
import { Check, Monitor, Moon, Sun } from 'lucide-react'
import { useTheme } from 'next-themes'

import { cn } from '@/lib/utils'
import { ThemeColor, useThemeColor } from '@/components/theme-color-provider'

// 主题色配置
const themeColors: { 
  name: string
  value: ThemeColor
  color: string
  description: string
  palette: string[]
}[] = [
  { 
    name: '柔暖日光黄', 
    value: 'yellow', 
    color: '#FFD166',
    description: '温暖治愈，如冬日暖阳',
    palette: ['#FFD166', '#FFF8E1', '#8B6B3D']
  },
  { 
    name: '治愈柔粉紫', 
    value: 'purple', 
    color: '#E8C8F7',
    description: '梦幻浪漫，温柔的遐想',
    palette: ['#E8C8F7', '#FAF3FD', '#7A5C85']
  },
  { 
    name: '活力暖橙红', 
    value: 'orange', 
    color: '#FF7F50',
    description: '热情洋溢，充满生命力',
    palette: ['#FF7F50', '#FFF2EC', '#9C3F1E']
  },
  { 
    name: '宁静浅青蓝', 
    value: 'blue', 
    color: '#87CEEB',
    description: '清新自然，像雨后的天',
    palette: ['#87CEEB', '#F0F9FF', '#2C5D75']
  },
  { 
    name: '复古暖棕黄', 
    value: 'brown', 
    color: '#D2B48C',
    description: '沉稳怀旧，岁月的痕迹',
    palette: ['#D2B48C', '#FDF8F3', '#6B563F']
  },
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

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 pt-2">
          {themeColors.map((item) => (
            <button
              key={item.value}
              onClick={() => handleThemeColor(item.value)}
              className={cn(
                'group relative flex flex-col items-start gap-3 rounded-xl border-2 p-4 transition-all hover:bg-accent/50',
                themeColor === item.value
                  ? 'border-primary bg-accent ring-1 ring-primary'
                  : 'border-transparent bg-card hover:border-border'
              )}
            >
              <div className="flex w-full items-center justify-between">
                <span className={cn(
                  "text-base font-semibold",
                  themeColor === item.value ? "text-primary" : "text-foreground"
                )}>
                  {item.name}
                </span>
                {themeColor === item.value && (
                  <div className="rounded-full bg-primary p-1 text-primary-foreground">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              
              <p className="text-left text-xs text-muted-foreground">
                {item.description}
              </p>

              {/* 色卡展示 */}
              <div className="mt-2 flex gap-2">
                {item.palette.map((color, index) => (
                  <div
                    key={index}
                    className="h-6 w-6 rounded-full border shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
