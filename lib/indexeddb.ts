import { DBSchema, IDBPDatabase, openDB } from 'idb'

// 定义 Tag 类型
export interface Tag {
  id: string
  name: string
}

// 定义完整笔记类型
export interface NoteData {
  id: string
  title: string
  content: string | null
  tags: Tag[]
  createdAt: Date
  updatedAt: Date
}

// 定义更新 Payload
export interface NoteUpdatePayload {
  title: string
  content: string
  tags: string[]
}

// 提取并导出 SyncTask 接口，供 SyncManager 使用
export interface SyncTask {
  id?: number // IndexedDB 自动生成的 Key
  type: 'CREATE' | 'UPDATE' | 'DELETE'
  noteId: string
  payload?: NoteUpdatePayload
  createdAt: number
}

// 定义数据库结构
interface XiJiDB extends DBSchema {
  notes: {
    key: string
    value: NoteData & { isSynced: boolean }
    indexes: { 'by-updated': Date }
  }
  syncQueue: {
    key: number
    value: SyncTask // 使用上面定义的接口
  }
}

const DB_NAME = 'xiji-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<XiJiDB>>

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB<XiJiDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('notes')) {
          const store = db.createObjectStore('notes', { keyPath: 'id' })
          store.createIndex('by-updated', 'updatedAt')
        }
        if (!db.objectStoreNames.contains('syncQueue')) {
          db.createObjectStore('syncQueue', { keyPath: 'id', autoIncrement: true })
        }
      },
    })
  }
  return dbPromise
}

// 基础操作

export async function saveNoteToLocal(note: NoteData) {
  const db = await getDB()
  await db.put('notes', {
    ...note,
    isSynced: true,
  })
}

export async function saveNotesToLocal(notes: NoteData[]) {
  const db = await getDB()
  const tx = db.transaction('notes', 'readwrite')
  await Promise.all(notes.map((note) => tx.store.put({ ...note, isSynced: true })))
  await tx.done
}

export async function getLocalNote(id: string) {
  const db = await getDB()
  return db.get('notes', id)
}

export async function getAllLocalNotes() {
  const db = await getDB()
  return db.getAllFromIndex('notes', 'by-updated')
}

// 加入同步队列
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

// 获取所有同步任务 (不删除)
// 用于 SyncManager 查看有哪些任务需要处理
export async function getAllSyncTasks() {
  const db = await getDB()
  return db.getAll('syncQueue')
}

// 移除单个同步任务
// 用于 SyncManager 在任务成功同步到服务器后调用
export async function removeSyncTask(id: number) {
  const db = await getDB()
  await db.delete('syncQueue', id)
}

// (旧方法，保留兼容性，但 SyncManager 应该改用 getAll + remove 的组合以保证安全)
export async function popSyncQueue() {
  const db = await getDB()
  const tx = db.transaction('syncQueue', 'readwrite')
  const items = await tx.store.getAll()
  await tx.store.clear()
  await tx.done
  return items
}
