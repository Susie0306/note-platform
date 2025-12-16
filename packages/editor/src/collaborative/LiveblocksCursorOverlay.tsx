'use client'

import React, { useEffect, useState } from 'react'
import { useOthers } from '@liveblocks/react'
import { useEditorRef } from 'platejs/react'
import { ReactEditor } from 'slate-react'

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
      // 检查 containerRef 是否有 current，如果没有，说明编辑器还没挂载好
      if (!editor || !selection || !containerRef.current) {
         // 可能在重新渲染，下一帧再试
         animationFrameId = requestAnimationFrame(updatePosition)
         return
      }

      try {
        // 尝试将 Slate Range 转换为 DOM Range
        // 这一步最容易失败，因为 Slate 的虚拟节点可能还没对应的 DOM
        const domRange = ReactEditor.toDOMRange(editor, selection)
        const rects = domRange.getClientRects()
        
        if (rects.length > 0) {
          const rect = rects[0]
          const containerRect = containerRef.current.getBoundingClientRect()
          
          const scrollTop = containerRef.current.scrollTop
          const scrollLeft = containerRef.current.scrollLeft

          // 核心修复：确保 rect 是有意义的
          // 比如当 rect 全部为 0 时可能是隐藏状态
          if (rect.width === 0 && rect.height === 0 && rect.x === 0 && rect.y === 0) {
             // 这种情况下可能是不可见的，跳过更新
          } else {
              const top = rect.top - containerRect.top + scrollTop
              const left = rect.left - containerRect.left + scrollLeft
              
              setPosition({
                top,
                left,
                height: rect.height || 20 // 兜底高度
              })
          }
        }
      } catch (e) {
        // 常见错误：Cannot find a DOM node for slate node
        // 这通常发生在远程内容刚同步过来，Slate 节点树还没完全渲染成 DOM 时
        // 忽略它，等待下一帧
      }

      animationFrameId = requestAnimationFrame(updatePosition)
    }

    // 启动循环
    updatePosition()

    return () => cancelAnimationFrame(animationFrameId)
  }, [editor, selection, containerRef])

  if (!position) return null

  return (
    <div
      className="absolute pointer-events-none transition-all duration-100 ease-out z-[9999]"
      style={{
        top: position.top,
        left: position.left,
        height: position.height,
        // 添加一个 border 方便调试，发布时去掉
        // border: `1px solid ${color}` 
      }}
    >
      {/* 光标竖线 */}
      <div className="w-[2px] h-full shadow-sm" style={{ backgroundColor: color }} />
      
      {/* 名字标签 - 调整样式确保可见 */}
      <div
        className="absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap rounded-sm shadow-md transition-opacity duration-200"
        style={{ 
            backgroundColor: color,
            opacity: 1 // 强制一直显示
        }}
      >
        {name}
      </div>
    </div>
  )
}

