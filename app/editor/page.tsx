import { ClientSideSuspense } from '@liveblocks/react/suspense'

import { PlateEditor } from '@/components/editor/plate-editor'
import { RoomProvider } from '@/lib/liveblocks.config'

export default function Page() {
  const roomId = 'editor-demo'

  return (
    <RoomProvider
      id={roomId}
      initialPresence={{ cursor: null, name: '协同演示', color: '#3b82f6' }}
    >
      <ClientSideSuspense
        fallback={
          <div className="flex h-screen w-full items-center justify-center text-sm text-muted-foreground">
            正在建立协同连接...
          </div>
        }
      >
        {() => (
          <div className="h-screen w-full">
            <PlateEditor roomId={roomId} userName="协同演示" userColor="#3b82f6" />
          </div>
        )}
      </ClientSideSuspense>
    </RoomProvider>
  )
}
