'use client'

import React, { useTransition } from 'react'
import confetti from 'canvas-confetti'
import { updateWishProgress } from '@/app/actions/wishes'
import { Slider } from '@/components/ui/slider'

interface ProgressUpdaterProps {
  wishId: string
  currentProgress: number
}

export function ProgressUpdater({ wishId, currentProgress }: ProgressUpdaterProps) {
  const [isPending, startTransition] = useTransition()
  const [value, setValue] = React.useState([currentProgress])

  // 防抖更新（这里简化处理，在 onValueCommit 时提交）
  const handleValueCommit = (val: number[]) => {
    const newProgress = val[0]
    startTransition(async () => {
      try {
        await updateWishProgress(wishId, newProgress)
        if (newProgress === 100) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
          })
        }
      } catch (error) {
        console.error('Failed to update progress', error)
        // 可以在这里加 toast
      }
    })
  }

  return (
    <div className="space-y-4 rounded-lg border bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-medium text-gray-900">当前进度</h3>
        <span className="text-2xl font-bold text-primary dark:text-black">{value[0]}%</span>
      </div>
      <Slider
        disabled={isPending}
        defaultValue={[currentProgress]}
        value={value}
        onValueChange={setValue}
        onValueCommit={handleValueCommit}
        max={100}
        step={1}
        className="py-2 dark:[&_.bg-primary]:bg-black dark:[&_.bg-secondary]:bg-gray-100"
      />
      <p className="text-xs text-gray-500">
        {value[0] === 100 ? '🎉 恭喜达成！' : '拖动滑块更新进度，记录你的每一步成长。'}
      </p>
    </div>
  )
}

