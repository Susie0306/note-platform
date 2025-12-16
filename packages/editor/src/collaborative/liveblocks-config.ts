'use client'

import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

// Type definitions for editor presence and user meta
export type EditorPresence = {
  cursor: { x: number; y: number } | null
  selection: any | null
  name: string
  color: string
}

export type EditorUserMeta = {
  id: string
  info: {
    name: string
    color: string
    avatar?: string
  }
}

export type EditorStorage = {
  content: string
}

export interface LiveblocksConfig {
  RoomProvider: ReturnType<typeof createRoomContext>['RoomProvider']
  useRoom: ReturnType<typeof createRoomContext>['useRoom']
  useOthers: ReturnType<typeof createRoomContext>['useOthers']
  useSelf: ReturnType<typeof createRoomContext>['useSelf']
  useStorage: ReturnType<typeof createRoomContext>['useStorage']
  useMutation: ReturnType<typeof createRoomContext>['useMutation']
  useMyPresence: ReturnType<typeof createRoomContext>['useMyPresence']
  useUpdateMyPresence: ReturnType<typeof createRoomContext>['useUpdateMyPresence']
}

/**
 * Create Liveblocks configuration for collaborative editing
 * 
 * @example
 * ```ts
 * // In your app's liveblocks.config.ts
 * import { createLiveblocksConfig } from '@susie/editor/collaborative'
 * 
 * export const {
 *   RoomProvider,
 *   useRoom,
 *   useOthers,
 *   useSelf,
 *   useStorage,
 *   useMutation,
 *   useMyPresence,
 *   useUpdateMyPresence,
 * } = createLiveblocksConfig({
 *   authEndpoint: '/api/liveblocks-auth',
 * })
 * ```
 */
export function createLiveblocksConfig(
  options: { authEndpoint: string } | { publicApiKey: string }
): LiveblocksConfig {
  const client = createClient(options as any)

  const {
    RoomProvider,
    useRoom,
    useOthers,
    useSelf,
    useStorage,
    useMutation,
    useMyPresence,
    useUpdateMyPresence,
  } = createRoomContext<EditorPresence, EditorStorage, EditorUserMeta>(client)

  return {
    RoomProvider,
    useRoom,
    useOthers,
    useSelf,
    useStorage,
    useMutation,
    useMyPresence,
    useUpdateMyPresence,
  }
}
