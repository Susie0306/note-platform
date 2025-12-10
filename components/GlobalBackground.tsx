'use client'

import React from 'react'

export function GlobalBackground() {
  return (
    <div className="fixed inset-0 -z-50 h-full w-full overflow-hidden pointer-events-none bg-background">
      {/* 
        光斑层设计理念：
        模拟阳光透过树叶/窗户投射在地面的光斑，带有温度和呼吸感。
        使用 CSS 变量 (primary/accent/secondary) 自动适配 5 种主题色。
      */}

      {/* 光斑 1: 主光源 (左上) */}
      <div className="absolute -left-[10%] -top-[10%] h-[50vh] w-[50vh] min-w-[400px] rounded-full bg-primary/40 blur-[80px] animate-float-slow mix-blend-multiply dark:mix-blend-screen dark:bg-primary/30" />

      {/* 光斑 2: 辅助光 (右下) */}
      <div className="absolute -right-[10%] -bottom-[10%] h-[60vh] w-[60vh] min-w-[500px] rounded-full bg-primary/50 blur-[90px] animate-float-medium mix-blend-multiply dark:mix-blend-screen dark:bg-primary/30" />

      {/* 光斑 3: 游离光点 (中下) */}
      <div className="absolute left-[30%] bottom-[20%] h-[30vh] w-[30vh] min-w-[300px] rounded-full bg-primary/40 blur-[60px] animate-float-fast mix-blend-multiply dark:mix-blend-screen dark:bg-primary/30" />

      {/* 纹理噪点 (可选，增加纸质/胶片质感，降低透明度使其极难察觉但提升质感) */}
      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" 
           style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} 
      />
    </div>
  )
}

