'use client'

import { createClient } from '@liveblocks/client'
import { createRoomContext } from '@liveblocks/react'

const liveblocksClient = createClient({
  authEndpoint: '/api/liveblocks-auth',
})

export const {
  RoomProvider,
  useRoom,
  useSelf,
  useOthers,
  useMyPresence,
  useUpdateMyPresence,
} = createRoomContext(liveblocksClient)

