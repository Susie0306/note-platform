'use client'

import React, { useEffect, useState } from 'react'
import { useOthers } from '@/lib/liveblocks.config'
import { useEditorRef } from 'platejs/react'
import { ReactEditor } from 'slate-react'
import { Range } from 'slate'

interface LiveblocksCursorOverlayProps {
  containerRef: React.RefObject<HTMLDivElement | null>
}

export function LiveblocksCursorOverlay({ containerRef }: LiveblocksCursorOverlayProps) {
  const others = useOthers()
  const editor = useEditorRef()

  return (
    <div className="pointer-events-none absolute inset-0 z-50 overflow-hidden">
      {others.map(({ connectionId, presence, info }) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const p = presence as any
        if (!p?.selection) return null

        return (
          <Cursor
            key={connectionId}
            editor={editor}
            selection={p.selection}
            color={p.color || '#f00'}
            name={p.name || 'Anonymous'}
            containerRef={containerRef}
          />
        )
      })}
    </div>
  )
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function Cursor({ editor, selection, color, name, containerRef }: any) {
  const [position, setPosition] = useState<{ top: number; left: number; height: number } | null>(null)

  useEffect(() => {
    let animationFrameId: number

    const updatePosition = () => {
      if (!editor || !selection || !containerRef.current) return

      try {
        // 尝试将 Slate Range 转换为 DOM Range
        const domRange = ReactEditor.toDOMRange(editor, selection)
        const rects = domRange.getClientRects()
        
        if (rects.length > 0) {
          // 这里的逻辑主要处理光标位置（collapsed selection）
          // 如果是选区，通常显示选区背景，这里简化为只显示光标在选区起点
          const rect = rects[0]
          const containerRect = containerRef.current.getBoundingClientRect()
          
          // 获取容器的滚动偏移
          const scrollTop = containerRef.current.scrollTop
          const scrollLeft = containerRef.current.scrollLeft

          // 计算相对于容器的坐标
          // 注意：如果容器有 padding，可能需要微调，但通常 rect 是相对于视口的
          const top = rect.top - containerRect.top + scrollTop
          const left = rect.left - containerRect.left + scrollLeft
          
          // 只有当位置发生显著变化时才更新 state，避免过于频繁的重渲染（可选）
          setPosition({
            top,
            left,
            height: rect.height
          })
        }
      } catch (e) {
        // 常见错误：节点未找到（可能尚未渲染）
      }

      // 继续下一帧更新，确保跟随滚动和内容变化
      animationFrameId = requestAnimationFrame(updatePosition)
    }

    updatePosition()

    return () => cancelAnimationFrame(animationFrameId)
  }, [editor, selection, containerRef])

  if (!position) return null

  return (
    <div
      className="absolute pointer-events-none transition-all duration-75 ease-out"
      style={{
        top: position.top,
        left: position.left,
        height: position.height,
      }}
    >
      {/* 光标竖线 */}
      <div className="w-[2px] h-full shadow-sm" style={{ backgroundColor: color }} />
      
      {/* 名字标签 */}
      <div
        className="absolute -top-6 left-0 px-1.5 py-0.5 text-[10px] font-bold text-white whitespace-nowrap rounded-sm shadow-md z-50 opacity-0 transition-opacity hover:opacity-100"
        style={{ 
            backgroundColor: color,
            // 默认显示名字，或者 hover 显示？ 
            // 现在的设计是 opacity-0 hover:opacity-100，也可以改为一直显示
            opacity: 1 
        }}
      >
        {name}
      </div>
    </div>
  )
}

