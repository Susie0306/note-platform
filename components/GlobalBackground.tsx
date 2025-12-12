'use client'

import React from 'react'

export function GlobalBackground() {
  return (
    <div className="bg-background pointer-events-none fixed inset-0 -z-50 h-full w-full overflow-hidden">
      {/* 晕染 1(左上) */}
      <div className="bg-primary/40 animate-float-slow dark:bg-primary/30 absolute -top-[10%] -left-[10%] h-[50vh] w-[50vh] min-w-[400px] rounded-full mix-blend-multiply blur-[80px] dark:mix-blend-screen" />

      {/* 晕染 2(右下) */}
      <div className="bg-primary/50 animate-float-medium dark:bg-primary/30 absolute -right-[10%] -bottom-[10%] h-[60vh] w-[60vh] min-w-[500px] rounded-full mix-blend-multiply blur-[90px] dark:mix-blend-screen" />

      {/* 晕染 3(中下) */}
      <div className="bg-primary/40 animate-float-fast dark:bg-primary/30 absolute bottom-[20%] left-[30%] h-[30vh] w-[30vh] min-w-[300px] rounded-full mix-blend-multiply blur-[60px] dark:mix-blend-screen" />

      {/* 纹理噪点 */}
      <div
        className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
        }}
      />
    </div>
  )
}
