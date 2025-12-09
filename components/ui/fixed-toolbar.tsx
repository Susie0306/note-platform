'use client'

import React from 'react'

export function FixedToolbar({ children }: { children: React.ReactNode }) {
  return (
    <div className="sticky top-0 z-10 flex flex-wrap items-center gap-1 border-b bg-gray-50 p-2 backdrop-blur-sm dark:bg-zinc-900/50">
      {children}
    </div>
  )
}

