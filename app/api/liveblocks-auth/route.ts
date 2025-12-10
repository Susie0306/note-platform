import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { createClient } from '@liveblocks/node'

const secret = process.env.LIVEBLOCKS_SECRET_KEY
const liveblocksClient = secret ? createClient({ secret }) : null

export async function POST(req: Request) {
  if (!liveblocksClient) {
    return NextResponse.json(
      { error: 'LIVEBLOCKS_SECRET_KEY 未配置' },
      { status: 500 }
    )
  }

  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const user = await currentUser()

  const body = await req.json().catch(() => null)
  const room = body?.room as string | undefined
  if (!room) return NextResponse.json({ error: 'Missing room id' }, { status: 400 })

  const session = liveblocksClient.prepareSession(userId, {
    userInfo: {
      name: user?.fullName ?? user?.username ?? '访客',
      avatar: user?.imageUrl,
    },
  })

  session.allow(room, session.FULL_ACCESS)
  const { status, body: token } = await session.authorize()

  return new NextResponse(token, {
    status,
    headers: { 'Content-Type': 'application/json' },
  })
}

