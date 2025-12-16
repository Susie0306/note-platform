'use client'

// Collaborative Editor Components
export { LiveblocksCursorOverlay } from './LiveblocksCursorOverlay'

// Liveblocks config helper
export { createLiveblocksConfig } from './liveblocks-config'
export type { LiveblocksConfig, EditorPresence, EditorUserMeta } from './liveblocks-config'

// Re-export useful Liveblocks hooks for convenience
export {
  RoomProvider,
  useRoom,
  useOthers,
  useSelf,
  useStorage,
  useMutation,
  useMyPresence,
  useUpdateMyPresence,
} from '@liveblocks/react'

export { ClientSideSuspense } from '@liveblocks/react/suspense'
