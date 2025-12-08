import { DBSchema, IDBPDatabase, openDB } from 'idb'

// 定义 Tag 类型 (对应 Prisma 返回的结构)
export interface Tag {
  id: string
  name: string
}

// 定义完整笔记类型 (用于本地存储副本)
export interface NoteData {
  id: string
  title: string
  content: string | null // Prisma 中 content 可能是 null
  tags: Tag[] // 存储完整的 Tag 对象数组
  createdAt: Date
  updatedAt: Date
}

// 定义更新操作的 Payload (用于同步队列，只包含用户修改的字段)
export interface NoteUpdatePayload {
  title: string
  content: string
  tags: string[] // 用户编辑时只提交标签名的数组
}

// 定义数据库结构
interface XiJiDB extends DBSchema {
  notes: {
    key: string // 笔记 ID
    value: NoteData & { isSynced: boolean } // 交叉类型：笔记数据 + 同步状态
    indexes: { 'by-updated': Date }
  }
  syncQueue: {
    key: number // 自增 ID
    value: {
      id?: number
      type: 'CREATE' | 'UPDATE' | 'DELETE'
      noteId: string
      payload?: NoteUpdatePayload
      createdAt: number
    }
  }
}

const DB_NAME = 'xiji-db'
const DB_VERSION = 1

// 初始化数据库单例
let dbPromise: Promise<IDBPDatabase<XiJiDB>>

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<XiJiDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // 创建笔记存储表
        if (!db.objectStoreNames.contains('notes')) {
          const store = db.createObjectStore('notes', { keyPath: 'id' })
          store.createIndex('by-updated', 'updatedAt')
        }
        // 创建同步队列表
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true })
        }
      },
    })
  }
  return dbPromise
}

// --- 基础操作封装 ---

// 保存笔记到本地 (通常在从服务器获取数据后调用)
export async function saveNoteToLocal(note: NoteData) {
  const db = await getDB()
  await db.put('notes', {
    ...note,
    isSynced: true, // 默认为已同步
  })
}

// 批量保存 (用于列表页缓存)
export async function saveNotesToLocal(notes: NoteData[]) {
  const db = await getDB()
  const tx = db.transaction('notes', 'readwrite')
  await Promise.all(notes.map((note) => tx.store.put({ ...note, isSynced: true })))
  await tx.done
}

// 获取单条本地笔记
export async function getLocalNote(id: string) {
  const db = await getDB()
  return db.get('notes', id)
}

// 获取所有本地笔记
export async function getAllLocalNotes() {
  const db = await getDB()
  return db.getAllFromIndex('notes', 'by-updated')
}

// 加入同步队列 (离线操作时调用)
export async function enqueueSyncTask(
  type: 'CREATE' | 'UPDATE' | 'DELETE',
  noteId: string,
  payload?: NoteUpdatePayload
) {
  const db = await getDB()
  await db.add('syncQueue', {
    type,
    noteId,
    payload,
    createdAt: Date.now(),
  })
}

// 获取并清空队列 (网络恢复时调用)
export async function popSyncQueue() {
  const db = await getDB()
  const tx = db.transaction('syncQueue', 'readwrite')
  const items = await tx.store.getAll()
  await tx.store.clear() // 获取后立即清空，防止重复处理
  await tx.done
  return items
}
