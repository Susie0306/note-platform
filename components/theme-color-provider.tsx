'use client'

import * as React from 'react'

export type ThemeColor = 'neutral' | 'yellow' | 'purple' | 'orange' | 'blue' | 'brown'

type ThemeColorProviderProps = {
  children: React.ReactNode
  defaultTheme?: ThemeColor
  storageKey?: string
}

type ThemeColorContextType = {
  themeColor: ThemeColor
  setThemeColor: (theme: ThemeColor) => void
}

const ThemeColorContext = React.createContext<ThemeColorContextType | undefined>(undefined)

export function ThemeColorProvider({
  children,
  defaultTheme = 'yellow',
  storageKey = 'xi-ji-theme-color',
}: ThemeColorProviderProps) {
  const [themeColor, setThemeColorState] = React.useState<ThemeColor>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem(storageKey) as ThemeColor) || defaultTheme
    }
    return defaultTheme
  })

  // 使用 useCallback 包裹函数，使其在多次渲染间保持稳定
  // 依赖项是 [storageKey]，只有 key 变了函数才会变
  const setThemeColor = React.useCallback(
    (color: ThemeColor) => {
      setThemeColorState(color)
      localStorage.setItem(storageKey, color)
    },
    [storageKey]
  )

  React.useEffect(() => {
    const root = window.document.body
    root.classList.remove(
      'theme-yellow',
      'theme-purple',
      'theme-orange',
      'theme-blue',
      'theme-brown'
    )

    if (themeColor !== 'neutral') {
      root.classList.add(`theme-${themeColor}`)
    }
  }, [themeColor])

  // 将 setThemeColor 加入依赖数组
  const value = React.useMemo(
    () => ({
      themeColor,
      setThemeColor,
    }),
    [themeColor, setThemeColor]
  )

  return <ThemeColorContext.Provider value={value}>{children}</ThemeColorContext.Provider>
}

export const useThemeColor = () => {
  const context = React.useContext(ThemeColorContext)
  if (context === undefined) {
    throw new Error('useThemeColor must be used within a ThemeColorProvider')
  }
  return context
}
