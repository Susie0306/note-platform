# Xiji (熙记) - Protecting every small wish through notes

[English](./README_EN.md) | [简体中文](./README.md)

**Xiji (熙记)** is a modern note platform centered on both emotional needs and practical utility. With the mission of **“protecting every small wish through notes”**, it builds a product ecosystem that balances functionality and warmth.

Xiji is not only a knowledge note tool, but also an emotional carrier that safeguards users’ life wishes. Through practical baseline features, emotionally designed special modules, and convenient cross-device sync, every record becomes meaningful — every small wish can be seen, tracked, and achieved — aiming to become the “witness of your beautiful moments.”

From a technical perspective, the project is built on **Next.js 14 (App Router)**, deeply integrating a smooth **Local-First** experience with **Real-Time Collaboration**, showcasing technical depth in complex state management, offline synchronization, and rich text customization.

## ✨ Core Features

- **📝 Powerful Rich Text Editor**: Built on Plate.js (Slate), supporting Markdown syntax, Slash Commands, code block highlighting, and media embedding.
- **🤝 Real-Time Collaborative Editing**: Multiple users editing the same document simultaneously, with synchronized updates (Powered by Liveblocks Storage API).
- **⚡️ Local-First & Offline Support**: Uses IndexedDB for local storage, remaining usable offline, and automatically synchronizing data via a Sync Queue upon network recovery.
- **🤖 AI Intelligent Assistance**: Combines custom DeepSeek integration for advanced commands like polishing and summarization.
- **📂 Flexible Organization Structure**: Supports infinite nested folders and a many-to-many tag classification system.
- **🌟 “Little Wishes” Board**: A dedicated wish-tracking module with timeline notes. Set target milestones and deadlines (e.g., “Learn guitar in 3 months”), and visualize progress with built-in templates (travel planning, study goals, etc.), giving every small expectation a place to settle.
- **💊 Memory Capsule**: A unique time-delivery feature. When the set time arrives, you will receive a warm reminder to revisit past wishes and feel the growth and beauty in the flow of time.

## 📱 Mobile Experience (Android App)

To make recording accessible anytime, anywhere, Xiji is now available on Android. Built with **Capacitor**, it encapsulates the powerful features of the Web into a native experience, making every "wish" within reach.

- **🔄 Seamless Sync**: Real-time cloud synchronization between desktop and mobile.
- **🎨 Immersive Design**: Optimized gestures and responsive layout, supporting immersive status bars and notch adaptation.
- **🔐 Native Auth**: Integrated with Clerk authentication for smooth in-app login without jumping to external browsers.

### 📥 Download & Install

1. Click **Releases** in the right sidebar.
2. Download the latest `.apk` package (`Xiji-v1.0.0.apk`).
3. Send it to your phone for installation (allow "Install from unknown sources" if prompted).

## 🛠 Tech Stack

### Core Architecture

- **Framework**: Next.js 14 (App Router, Server Actions)
- **Mobile**: Capacitor 6 (Android)
- **Language**: TypeScript (Strict Type Checking)
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Authentication**: Clerk

### Editor & Collaboration

- **Rich Text Engine**: Plate.js / Slate.js
- **Editor Package**: `@susie/editor` (Standalone npm package, supporting modular import)
- **Real-Time Collaboration**: Liveblocks (Storage API)
- **State Management**: Zustand (Global), React Context (Local)

### Offline & Storage

- **Local Database**: IndexedDB (idb)
- **File Storage**: UploadThing
- **Sync Mechanism**: Self-developed bi-directional sync queue (Optimistic UI Updates)

### UI/UX

- **Component Library**: Shadcn/ui (Radix UI + Tailwind CSS)
- **Animation**: Framer Motion
- **Notifications**: Sonner

---

## 💡 Technical Highlights & Challenges Resolved

### 1. Hybrid Real-time Collaboration

This project does not simply apply a collaboration library, but solves a core challenge: **How to seamlessly switch between "Local-Only Editing" and "Multi-User Real-Time Collaboration" modes.**

- **Challenge**: Desynchronization between Plate.js/Slate's internal state (`Value`) and Liveblocks' shared storage (`Storage`) can lead to infinite loops or content flickering.
- **Solution**:
  - Implemented precise **bi-directional binding control** in `components/editor/plate-editor.tsx`.
  - Used `useStorage` to subscribe to remote changes and `useMutation` to submit local changes.
  - Introduced an `isApplyingRemoteChangeRef` lock mechanism to precisely distinguish "user input" from "remote sync", preventing update loops.
  - Implemented dual protection mechanisms of Debounce and Polling to ensure data consistency in weak network environments.

### 2. Local-First & Offline Sync Queue

To provide ultimate loading speed and offline availability, a complete offline synchronization strategy was implemented.

- **Architecture Design**:
  - **Read Path**: Prioritizes reading data from IndexedDB for UI rendering, then Revalidates data in the background (`Lazy Sync`).
  - **Write Path**: All operations (create/update/delete) are first written to local IndexedDB and **optimistically updated** on the UI.
  - **Sync Manager (`SyncManager`)**:
    - Maintains a log-based `syncQueue` (CREATE/UPDATE/DELETE) in `lib/indexeddb.ts`.
    - Listens for `online/offline` events; automatically consumes the queue upon network recovery and batch syncs to PostgreSQL via Server Actions.
    - Handles eventual consistency issues (such as mapping local IDs to server IDs).

### 3. Type-Safe System Design

Fully adopted TypeScript with strict type definitions, rejecting `any`.

- **Prisma Type Extensions**: Defined complex types like `FolderWithCount` in `lib/types.ts` to solve the problem of complex return type inference in Prisma relation queries (`include` / `_count`).
- **Editor Types**: Customized `MyEditor` type for Plate.js's complex plugin system, ensuring full code completion and type safety when writing custom plugins (such as AI plugins, media plugins).

### 4. High-Performance Sidebar Navigation

Refactored the sidebar component for scenarios with a large number of notes and folders.

- **Optimization**:
  - Optimized the original recursive component into a flattened data structure (`NavNode`) for processing, building the tree structure instantly on the frontend.
  - Separated `MobileNavWrapper` from desktop logic, implementing state isolation under responsive layouts.
  - Utilized Next.js `revalidatePath` combined with Optimistic UI to make folder creation/move operations feel latency-free.

### 5. Modular Editor Package (`@susie/editor`)

To improve code reusability and maintainability, we stripped the core editor functionality into an independent npm package.

- **Architecture Design**:
  - **Multi-Entry Export**: Supports independent imports for main entry (`@susie/editor`), feature modules (`@susie/editor/kits`), collaborative modules (`@susie/editor/collaborative`), and UI components (`@susie/editor/components`).
  - **On-Demand Loading**: 58 functional Kit modules can be imported individually, such as `BasicBlocksKit`, `TableKit`, `MediaKit`, etc., supporting Tree-shaking to optimize bundle size.
  - **Collaboration Optional**: Liveblocks related dependencies are set as `peerDependencies`, so they don't need to be installed when collaboration features are not required.

- **Technical Implementation**:
  - Built using **tsup**, supporting ESM format output and TypeScript type declarations.
  - Unified internal imports via path aliases (`@/`), automatically resolved by esbuild during build.
  - AI features injected via `AIProvider` or props, decoupling dependencies on specific backends.

- **Usage Example**:

  ```tsx
  // Full features
  import { EditorKit, PlateEditor } from '@susie/editor'
  // Collaborative features
  import { RoomProvider } from '@susie/editor/collaborative'
  // On-demand import
  import { BasicBlocksKit, TableKit } from '@susie/editor/kits'
  ```

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL Database

### Installation Steps

1. **Clone the Project**

   ```bash
   git clone https://github.com/your-username/note-platform.git
   cd note-platform
   ```

2. **Install Dependencies**

   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Configure Environment Variables**
   Copy `.env.example` to `.env` and fill in the following service keys:

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

4. **Database Migration**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to access.

## 📂 Directory Structure

```
├── app/                    # Next.js App Router routes & pages
│   ├── actions/            # Server Actions (Backend logic)
│   ├── api/                # Route Handlers
│   └── notes/              # Note list & details pages
├── components/             # React components
│   ├── editor/             # Plate editor core logic
│   ├── ui/                 # Shadcn UI base components
│   └── ...
├── lib/                    # Utilities & configuration
│   ├── indexeddb.ts        # Local database & sync queue logic
│   ├── prisma.ts           # Database client
│   └── types.ts            # Global type definitions
├── packages/               # Monorepo packages
│   └── editor/             # @susie/editor standalone package
│       ├── src/
│       │   ├── kits/       # Feature modules (58 independent)
│       │   ├── components/ # UI components
│       │   └── collaborative/ # Collaborative modules
│       └── dist/           # Build output
├── prisma/                 # Database Schema
└── public/                 # Static assets
```

## 🤝 Contribution

Issues and Pull Requests are welcome. For major changes, please discuss them in an Issue first.

## 📄 License

MIT License
