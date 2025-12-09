'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface ToolbarButtonProps {
  onClick: () => void
  pressed?: boolean
  children: React.ReactNode
}

export function ToolbarButton({ onClick, pressed, children }: ToolbarButtonProps) {
  return (
    <Button variant="ghost" size="sm" aria-pressed={pressed} onMouseDown={(e) => { e.preventDefault(); onClick() }}>
      {children}
    </Button>
  )
}

