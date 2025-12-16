# Xiji (熙记) - protecting every small wish through notes

[English](./README_EN.md) | [简体中文](./README.md)

**Xiji** is a modern note platform centered on both emotional needs and practical utility. With the mission of “protecting every small wish through notes”, it builds a product ecosystem that balances functionality and warmth.

Xiji is not only a knowledge note tool, but also an emotional carrier that safeguards users’ life wishes. Through practical baseline features, emotionally designed special modules, and convenient cross‑device sync, every record becomes meaningful — every small wish can be seen, tracked, and achieved — aiming to become the “witness of your beautiful moments.”

From a technical perspective, the project is built on **Next.js 14 (App Router)**, deeply integrating a smooth **Local‑First** experience with **Real‑Time Collaboration**, showcasing technical depth in complex state management, offline synchronization, and rich text customization.

## ✨ Key Features

- **📝 Powerful Rich Text Editor**: Built on Plate.js (Slate), supporting Markdown syntax, Slash Commands, code block highlighting, and media embedding.
- **🤝 Real-Time Collaborative Editing**: Multiple users editing the same document simultaneously, with synchronized updates of the latest document status (Powered by Liveblocks Storage API).
- **⚡️ Local-First & Offline Support**: Uses IndexedDB for local storage, remaining usable offline, and automatically synchronizing data via a Sync Queue upon network recovery.
- **🤖 AI Intelligent Assistance**: Combines custom DeepSeek integration for advanced commands like polishing and summarization.
- **📂 Flexible Organization Structure**: Supports infinite nested folders and a many-to-many tag classification system.
- **🌟 Wishboard**: A dedicated wish‑tracking module with timeline notes. Set target milestones and deadlines (e.g., “Learn guitar in 3 months”), and visualize progress with built‑in templates (travel planning, study goals, etc.).
- **💊 Memory Capsule**: A time‑capsule feature that delivers warm reminders when the set time arrives, helping you revisit past wishes and cherish growth over time.

## 📱 Mobile Experience (Android App)

To make recording accessible anytime, anywhere, Xiji is now available on Android. Built with **Capacitor**, it encapsulates the powerful features of the Web into a native experience, keeping every "hope" within reach.

- **🔄 Seamless Sync**: Whether at your desk or on the go, your notes are synchronized in real-time via the cloud.
- **🎨 Immersive Design**: Optimized gestures and responsive layout for mobile devices, supporting immersive status bars and notch adaptation.
- **🔐 Native Auth**: Integrated with Clerk authentication, supporting smooth login within the App without redirecting to an external browser.

### 📥 Download & Install

1. Click Releases in the sidebar.
2. Download the latest `.apk` installation package (e.g., `Xiji-v1.0.0.apk`).
3. Send it to your phone and install it (if prompted, please allow "Install apps from unknown sources").

## 🛠 Tech Stack

### Core Architecture

- **Framework**: Next.js 14 (App Router, Server Actions)
- **Mobile**: Capacitor 6 (Android)
- **Language**: TypeScript (Strict Type Checking)
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Authentication**: Clerk

### Editor & Collaboration

- **Rich Text Engine**: Plate.js / Slate.js
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

This project didn't simply apply a collaboration library but solved a core challenge: **How to switch seamlessly between "Local-Only Editing" and "Multi-User Real-Time Collaboration" modes.**

- **Challenge**: Desynchronization between Plate.js/Slate's internal state (`Value`) and Liveblocks' shared storage (`Storage`) data structure can lead to infinite loops or content flickering.
- **Solution**:
  - Implemented precise **bi-directional binding control** in `components/editor/plate-editor.tsx`.
  - Used `useStorage` to subscribe to remote changes and `useMutation` to commit local changes.
  - Introduced an `isApplyingRemoteChangeRef` lock mechanism to accurately distinguish between "user input" and "remote synchronization," preventing update loops.
  - Implemented a dual guarantee mechanism of Debounce and Polling to ensure data consistency in weak network environments.

### 2. Local-First & Offline Sync Queue

To provide ultimate loading speed and offline availability, a complete offline synchronization strategy was implemented.

- **Architecture Design**:
  - **Read Path**: Prioritizes reading data from IndexedDB to render UI, then revalidates data in the background (`Lazy Sync`).
  - **Write Path**: All operations (Create/Update/Delete) are first written to local IndexedDB, with **Optimistic Updates** on the UI.
  - **Sync Manager (`SyncManager`)**:
    - Maintains an operation log-based `syncQueue` (CREATE/UPDATE/DELETE) in `lib/indexeddb.ts`.
    - Listens for `online/offline` events, automatically consuming the queue upon network recovery and batch synchronizing to PostgreSQL via Server Actions.
    - Handles eventual consistency issues (e.g., mapping between local IDs and server IDs).

### 3. Type-Safe System Design

Fully adopted TypeScript with strict type definitions, rejecting `any`.

- **Prisma Type Extensions**: Defined composite types like `FolderWithCount` in `lib/types.ts`, solving the complexity of return type inference for Prisma relation queries (`include` / `_count`).
- **Editor Types**: Customized `MyEditor` type for Plate.js's complex plugin system, ensuring full code completion and type safety when writing custom plugins (such as AI plugins, media plugins).

### 4. High-Performance Sidebar Navigation

Refactored the sidebar component for scenarios with a large number of notes and folders.

- **Optimization**:
  - Optimized original recursive components into flat data structure (`NavNode`) processing, building the tree structure instantly on the frontend.
  - Separated `MobileNavWrapper` from desktop logic, achieving state isolation under responsive layouts.
  - Utilized Next.js's `revalidatePath` in conjunction with Optimistic UI, making folder creation/movement operations feel latency-free.

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
├── app/                # Next.js App Router routes and pages
│   ├── actions/        # Server Actions (Backend logic)
│   ├── api/            # Route Handlers
│   └── notes/          # Note list and detail pages
├── components/         # React Components
│   ├── editor/         # Plate editor core logic
│   ├── ui/             # Shadcn UI base components
│   └── ...
├── lib/                # Utility functions and configurations
│   ├── indexeddb.ts    # Local database and sync queue logic
│   ├── prisma.ts       # Database client
│   └── types.ts        # Global type definitions
├── prisma/             # Database models (Schema)
└── public/             # Static resources
```

## 🤝 Contribution

Issues and Pull Requests are welcome. For major changes, please discuss in an Issue first.

## 📄 License

MIT License
