# 熙记 (Xiji) - 以笔记为载体，守护每一份小希冀

[English](./README_EN.md) | [简体中文](./README.md)

**熙记 (Xiji)** 是一款以用户情感需求与实用需求为双核心的现代化笔记平台。我们致力于“以笔记为载体，守护每一份小希冀”，构建兼具功能性与温度感的产品生态。

熙记不止是一款知识笔记工具，更是守护用户生活希冀的情感载体。通过基础功能的实用性、特色功能的情感化、以及跨端同步的便捷性，我们让每一次记录都充满意义，让每一份小希冀都能被看见、被追踪、被实现，致力于成为您生活中不可或缺的“美好见证者”。

从技术角度来看，本项目基于 **Next.js 14 (App Router)** 构建，深度融合了 **本地优先 (Local-First)** 的流畅体验与 **实时协作** 的强大功能，展示了在复杂状态管理、离线同步及富文本定制方面的技术深度。

## ✨ 核心特性

- **📝 强大的富文本编辑器**: 基于 Plate.js (Slate) 构建，支持 Markdown 语法、快捷指令 (Slash Command)、代码块高亮及媒体嵌入。
- **🤝 实时协同编辑**: 多人同时编辑同一文档，同步更新文档最新情况 (Powered by Liveblocks Storage API)。
- **⚡️ 本地优先 & 离线支持**: 采用 IndexedDB 进行本地存储，断网状态下依然可用，网络恢复后自动通过同步队列 (Sync Queue) 同步数据。
- **🤖 AI 智能辅助**: 结合自定义 DeepSeek 集成实现润色、总结等高级指令。
- **📂 灵活的组织结构**: 支持无限层级文件夹与多标签 (Many-to-Many) 分类系统。
- **🌟 “小希冀”板块**: 专属的心愿追踪模块，支持创建带时间轴的心愿笔记，设定目标节点与完成期限（如“3 个月学会弹吉他”），直观呈现心愿实现过程。内置“希冀清单”模板（旅行规划、学习目标等），让每一份小期待都有处安放。
- **💊 回忆胶囊**: 独特的时空投递功能。当设定的时间到达，您将收到温馨提醒，重温过往许下的希冀，感受时光流转中的成长与美好。

## 📱 移动端体验 (Android App)

为了让记录随时随地发生，熙记现已推出 Android 客户端。基于 **Capacitor** 构建，将 Web 端的强大功能封装于原生体验之中，让每一份“希冀”触手可及。

- **🔄 无缝同步**: 无论是在电脑前还是旅途中，您的笔记数据通过云端实时互通。
- **🎨 沉浸体验**: 针对移动端优化的手势操作与响应式布局，支持沉浸式状态栏与刘海屏适配。
- **🔐 原生级登录**: 集成 Clerk 身份验证，支持在 App 内部流畅登录，无需跳转外部浏览器。

### 📥 下载与安装

1. 点击右侧侧边栏的 Releases。
2. 下载最新版本的 `.apk` 安装包 ( `Xiji-v1.0.0.apk`)。
3. 发送到手机进行安装（如遇安全提示，请允许“安装未知来源应用”）。

## 🛠 技术栈

### 核心架构

- **框架**: Next.js 14 (App Router, Server Actions)
- **移动端**: Capacitor 6 (Android)
- **语言**: TypeScript (严格类型检查)
- **数据库**: PostgreSQL (Supabase) + Prisma ORM
- **身份认证**: Clerk

### 编辑器与协作

- **富文本引擎**: Plate.js / Slate.js
- **实时协作**: Liveblocks (Storage API)
- **状态管理**: Zustand (全局), React Context (局部)

### 离线与存储

- **本地数据库**: IndexedDB (idb)
- **文件存储**: UploadThing
- **同步机制**: 自研双向同步队列 (Optimistic UI 更新)

### UI/UX

- **组件库**: Shadcn/ui (Radix UI + Tailwind CSS)
- **动画**: Framer Motion
- **通知**: Sonner

---

## 💡 技术亮点与难点解析

### 1. 混合架构下的实时协作 (Hybrid Real-time Collaboration)

本项目并未简单套用协作库，而是解决了一个核心难题：**如何在“仅本地编辑”与“多人实时协作”模式间无缝切换。**

- **难点**: Plate.js/Slate 的内部状态 (`Value`) 与 Liveblocks 的共享存储 (`Storage`) 数据结构不同步会导致死循环或内容闪烁。
- **解决方案**:
  - 在 `components/editor/plate-editor.tsx` 中实现了精细的**双向绑定控制**。
  - 利用 `useStorage` 订阅远程变更，使用 `useMutation` 提交本地变更。
  - 引入 `isApplyingRemoteChangeRef` 锁机制，精准区分“用户输入”与“远程同步”，防止更新循环。
  - 实现了防抖 (Debounce) 与 轮询 (Polling) 的双重保障机制，确保在弱网环境下数据的一致性。

### 2. 本地优先 (Local-First) 与离线同步队列

为了提供极致的加载速度和离线可用性，实现了一套完整的离线同步策略。

- **架构设计**:
  - **读取路径**: 优先从 IndexedDB 读取数据渲染 UI，随后并在后台 Revalidate 数据 (`Lazy Sync`)。
  - **写入路径**: 所有操作（增删改）优先写入本地 IndexedDB，并在 UI 上进行**乐观更新 (Optimistic Update)**。
  - **同步管理器 (`SyncManager`)**:
    - 在 `lib/indexeddb.ts` 中维护一个基于操作日志的 `syncQueue` (CREATE/UPDATE/DELETE)。
    - 监听 `online/offline` 事件，网络恢复时自动消费队列，通过 Server Actions 批量同步至 PostgreSQL。
    - 处理最终一致性问题（如本地 ID 与服务器 ID 的映射）。

### 3. 类型安全的系统设计

全面采用 TypeScript 并进行了严格的类型定义，拒绝 `any`。

- **Prisma 类型扩展**: 在 `lib/types.ts` 中定义了 `FolderWithCount` 等复合类型，解决了 Prisma 关联查询 (`include` / `_count`) 返回类型推断复杂的问题。
- **编辑器类型**: 针对 Plate.js 复杂的插件系统，定制了 `MyEditor` 类型，确保在编写自定义插件（如 AI 插件、媒体插件）时获得完整的代码提示与类型安全。

### 4. 高性能的侧边栏导航

针对大量笔记和文件夹的场景，重构了侧边栏组件。

- **优化**:
  - 将原本的递归组件优化为扁平化数据结构 (`NavNode`) 处理，在前端即时构建树形结构。
  - 分离了 `MobileNavWrapper` 与桌面端逻辑，实现了响应式布局下的状态隔离。
  - 利用 Next.js 的 `revalidatePath` 配合乐观 UI，使得文件夹创建/移动操作感觉不到延迟。

---

## 🚀 快速开始

### 环境要求

- Node.js 18+
- PostgreSQL 数据库

### 安装步骤

1. **克隆项目**

   ```bash
   git clone https://github.com/your-username/note-platform.git
   cd note-platform
   ```

2. **安装依赖**

   ```bash
   npm install
   # 或
   pnpm install
   ```

3. **配置环境变量**
   复制 `.env.example` 为 `.env` 并填入以下服务密钥：

   ```env
   # Database
   DATABASE_URL="postgresql://..."
   DIRECT_URL="postgresql://..."

   # Auth (Clerk)
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=...
   CLERK_SECRET_KEY=...

   # Collaboration (Liveblocks)
   NEXT_PUBLIC_LIVEBLOCKS_PUBLIC_KEY=...
   LIVEBLOCKS_SECRET_KEY=...

   # File Upload (UploadThing)
   UPLOADTHING_SECRET=...
   UPLOADTHING_APP_ID=...
   ```

4. **数据库迁移**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

打开 [http://localhost:3000](http://localhost:3000) 即可访问。

## 📂 目录结构

```
├── app/                # Next.js App Router 路由与页面
│   ├── actions/        # Server Actions (后端逻辑)
│   ├── api/            # Route Handlers
│   └── notes/          # 笔记列表与详情页
├── components/         # React 组件
│   ├── editor/         # Plate 编辑器核心逻辑
│   ├── ui/             # Shadcn UI 基础组件
│   └── ...
├── lib/                # 工具函数与配置
│   ├── indexeddb.ts    # 本地数据库与同步队列逻辑
│   ├── prisma.ts       # 数据库客户端
│   └── types.ts        # 全局类型定义
├── prisma/             # 数据库模型 (Schema)
└── public/             # 静态资源
```

## 🤝 贡献

欢迎提交 Issue 或 Pull Request。对于重大变更，请先在 Issue 中进行讨论。

## 📄 许可证

MIT License
