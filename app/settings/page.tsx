import { ModeToggle } from '@/components/ModeToggle'

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">设置</h1>

      <div className="flex items-center justify-between rounded-lg border p-4 shadow-sm">
        <div>
          <h3 className="font-medium">外观</h3>
          <p className="text-muted-foreground text-sm">自定义应用的主题颜色</p>
        </div>
        <ModeToggle />
      </div>
    </div>
  )
}
