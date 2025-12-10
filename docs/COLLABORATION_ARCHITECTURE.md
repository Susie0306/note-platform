# 熙记 (Xi Ji) - 协同编辑功能实现方案

## 1. 核心目标
实现多终端（Desktop/Mobile）或多用户同时编辑同一篇笔记，内容实时同步，能够看到对方的光标和选中区域，且解决冲突问题。

## 2. 技术选型

### 2.1 核心算法：CRDT (Yjs)
传统的“锁机制”体验差，而 `OT` (Google Docs 使用) 实现极为复杂。
**Yjs** 是目前前端最流行的 CRDT 库，专门用于处理富文本协同。
*   **优势**：去中心化、高性能、支持离线编辑后自动合并。
*   **适配**：PlateJS 官方提供了 `@plate-editor/yjs` 插件。

### 2.2 通信协议：WebSockets
虽然 SSE (Server-Sent Events) 可以做推送，但协同编辑需要高频双向通信，**WebSockets** 是唯一选择。

### 2.3 WebSocket 服务端：Hocuspocus
由于 Next.js 的 Serverless 环境（如 Vercel）不适合托管长连接的 WebSocket 服务，我们需要一个独立的 WebSocket 服务。
*   **选择**：[Hocuspocus](https://tiptap.dev/hocuspocus) (基于 Node.js)
*   **理由**：轻量、开源、完美适配 Yjs、支持自定义鉴权（集成 Clerk）、支持持久化（集成 Prisma）。

---

## 3. 架构设计

```mermaid
graph TD
    UserA[用户 A (Browser)] <-->|WebSocket| WS_Server[Hocuspocus Server (Node.js)]
    UserB[用户 B (Mobile)] <-->|WebSocket| WS_Server
    
    subgraph "Next.js App"
        NextPage[页面渲染]
        NextAPI[API Routes]
    end
    
    WS_Server <-->|定期/防抖写入| DB[(PostgreSQL)]
    NextAPI <-->|读取/写入| DB
```

### 数据流转逻辑
1.  **加载**：用户打开笔记 -> 连接 WebSocket -> 从服务端获取最新的 Yjs 二进制状态。
2.  **编辑**：用户输入 -> 转化为 Yjs Update -> 广播给 WebSocket -> 广播给其他用户。
3.  **持久化**：
    *   WebSocket 服务在内存中维护文档状态。
    *   设置 `Debounce`（防抖），例如每 2 秒或所有用户断开连接后，将 Yjs 二进制数据（或转换后的 JSON）存回 PostgreSQL。

---

## 4. 详细实现步骤

### 第一步：安装依赖 (Frontend & Backend)

```bash
# 前端依赖
npm install yjs @plate-editor/yjs @hocuspocus/provider y-protocols

# WebSocket 服务端依赖 (建议新建一个 separate folder 或在根目录新建 server.ts)
npm install @hocuspocus/server @hocuspocus/extension-database
```

### 第二步：搭建 WebSocket 服务 (独立服务)

在项目根目录创建 `collaboration-server.ts` (需使用 `ts-node` 或编译运行)。

```typescript
// collaboration-server.ts 伪代码
import { Server } from '@hocuspocus/server'
import { Database } from '@hocuspocus/extension-database'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const server = Server.configure({
  port: 1234,
  
  // 鉴权 (集成 Clerk)
  async onAuthenticate(data) {
    const { token } = data
    // 验证 token，若失败则抛出错误
  },

  extensions: [
    new Database({
      // 加载文档
      fetch: async ({ documentName }) => {
        const note = await prisma.note.findUnique({ where: { id: documentName } })
        return note?.content // 这里假设 content 存储的是 Yjs Update (Uint8Array) 或 JSON
      },
      // 保存文档
      store: async ({ documentName, state }) => {
        // state 是 Yjs 的二进制更新数据
        await prisma.note.update({
          where: { id: documentName },
          data: { 
            content: state, // 需要调整数据库字段类型以支持二进制，或存为 JSON
            updatedAt: new Date() 
          },
        })
      },
    }),
  ],
})

server.listen()
```

### 第三步：调整数据库 Schema

协同编辑通常需要存储 Yjs 的二进制数据以便无损还原，或者存储序列化后的 JSON。

```prisma
// prisma/schema.prisma

model Note {
  // ... 其他字段
  // 建议增加一个字段专门存储 Yjs 二进制数据，用于协同
  yjsState  Bytes?  
  // 原有的 content 字段可作为纯文本/JSON备份，用于搜索或预览
}
```

### 第四步：前端编辑器集成

在 `NoteEditor.tsx` 中集成 Yjs 插件。

```tsx
// components/NoteEditor.tsx
import { HocuspocusProvider } from '@hocuspocus/provider'
import { createYjsPlugin } from '@plate-editor/yjs'
import * as Y from 'yjs'

// 在组件内部
const NoteEditor = ({ noteId, initialContent }) => {
  // 1. 创建 Yjs Doc
  const yDoc = useMemo(() => new Y.Doc(), [])

  // 2. 连接 WebSocket
  const provider = useMemo(() => {
    return new HocuspocusProvider({
      url: 'ws://localhost:1234', // 你的 WebSocket 服务地址
      name: noteId, // 房间名通常是 Note ID
      document: yDoc,
    })
  }, [noteId, yDoc])

  // 3. 配置插件
  const plugins = createPlugins([
    // ... 其他插件
    createYjsPlugin({
      doc: yDoc,
      cursor: {
        name: 'My Name', // 从 Clerk 获取当前用户名
        color: '#f00',   // 随机分配颜色
      },
    }),
  ])

  return (
    <Plate 
      plugins={plugins} 
      initialValue={initialContent}
      // ...
    >
      <Editor />
    </Plate>
  )
}
```

---

## 5. 部署注意事项

1.  **WebSocket 服务部署**：
    *   Next.js API Routes (Serverless) **不支持** 长连接 WebSocket。
    *   **解决方案**：
        *   **方案 A (自托管)**：购买一台小型的 VPS (阿里云/腾讯云/DigitalOcean)，使用 PM2 运行 `collaboration-server.ts`。
        *   **方案 B (托管服务)**：使用 [Tiptap Cloud](https://tiptap.dev/cloud) 或 [Liveblocks](https://liveblocks.io/)。这可以省去部署 WebSocket 服务器的麻烦，直接在前端连接他们的云服务。

2.  **安全性**：
    *   确保 WebSocket 握手阶段验证 Clerk Token。
    *   确保用户只能加入自己有权限的 `documentName` (Note ID)。

## 6. 推荐实施路线

鉴于我们是独立开发：

1.  **阶段一 (MVP)**：保留当前的 HTTP 保存模式，不急于上 WebSocket。
2.  **阶段二 (引入 Yjs)**：先在前端引入 Yjs 数据结构，但依然通过 HTTP 请求保存（模拟协同，解决冲突能力弱）。
3.  **阶段三 (实时协同)**：
    *   如果你不想运维服务器：推荐使用 **Liveblocks** (Next.js 适配极好，有免费额度)。
    *   如果你想完全掌控数据：搭建 **Hocuspocus** Server。

建议先尝试 **Liveblocks** 方案，因为它对 Next.js 开发者最友好，无需自己维护 Node 进程。

