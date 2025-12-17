# Xiji (熙记) - Protecting every small wish through notes

[English](./README_EN.md) | [简体中文](./README.md)

**Xiji (熙记)** is a modern note platform centered on both emotional needs and practical utility. With the mission of “protecting every small wish through notes”, it builds a product ecosystem that balances functionality and warmth.

Xiji is not only a knowledge note tool, but also an emotional carrier that safeguards users’ life wishes. Through practical baseline features, emotionally designed special modules, and convenient cross-device sync, every record becomes meaningful — every small wish can be seen, tracked, and achieved — aiming to become the “witness of your beautiful moments.”

From a technical perspective, the project is built on **Next.js 14 (App Router)**, deeply integrating a smooth **Local-First** experience with **Real-Time Collaboration**, showcasing technical depth in complex state management, offline synchronization, and rich text customization.

## ✨ Key Features

- **📝 Powerful Rich Text Editor**: Built on Plate.js (Slate), supporting Markdown syntax, Slash Commands, code block highlighting, and media embedding.
- **🤝 Real-Time Collaborative Editing**: Multiple users editing the same document simultaneously, with synchronized updates (Powered by Liveblocks Storage API).
- **⚡️ Local-First & Offline Support**: Uses IndexedDB for local storage, remaining usable offline, and automatically synchronizing data via a Sync Queue upon network recovery.
- **🤖 AI Intelligent Assistance**: Combines custom DeepSeek integration for advanced commands like polishing and summarization.
- **📂 Flexible Organization Structure**: Supports infinite nested folders and a many-to-many tag classification system.
- **🌟 Wishboard**: A dedicated wish-tracking module with timeline notes. Set target milestones and deadlines (e.g., “Learn guitar in 3 months”), and visualize progress with built-in templates.
- **💊 Memory Capsule**: A time-capsule feature that delivers warm reminders when the set time arrives, helping you revisit past wishes and cherish growth over time.

## 📱 Mobile Experience (Android App)

To make recording accessible anytime, anywhere, Xiji is now available on Android. Built with **Capacitor**, it encapsulates the powerful features of the Web into a native experience.

- **🔄 Seamless Sync**: Real-time cloud synchronization between desktop and mobile.
- **🎨 Immersive Design**: Optimized gestures and responsive layout, supporting immersive status bars and notch adaptation.
- **🔐 Native Auth**: Integrated with Clerk authentication for smooth in-app login.

### 📥 Download & Install

1. Click **Releases** in the sidebar.
2. Download the latest `.apk` package (e.g., `Xiji-v1.0.0.apk`).
3. Install it on your phone (allow "Install from unknown sources" if prompted).

## 🛠 Tech Stack

### Core Architecture

- **Framework**: Next.js 14 (App Router, Server Actions)
- **Mobile**: Capacitor 6 (Android)
- **Language**: TypeScript (Strict Type Checking)
- **Database**: PostgreSQL (Supabase) + Prisma ORM
- **Authentication**: Clerk

### Editor & Collaboration

- **Rich Text Engine**: Plate.js / Slate.js
- **Editor Package**: `@susie/editor` (Standalone npm package)
- **Real-Time Collaboration**: Liveblocks (Storage API)
- **State Management**: Zustand (Global), React Context (Local)

### Offline & Storage

- **Local Database**: IndexedDB (idb)
- **File Storage**: UploadThing
- **Sync Mechanism**: Self-developed bi-directional sync queue (Optimistic UI)

---

## 💡 Technical Highlights & Challenges Resolved

### 1. Hybrid Real-time Collaboration

Solved the core challenge of switching seamlessly between "Local-Only Editing" and "Multi-User Real-Time Collaboration".

- **Challenge**: Desynchronization between Plate.js/Slate's internal state (`Value`) and Liveblocks' shared storage (`Storage`) can lead to infinite loops.
- **Solution**: Implemented precise bi-directional binding in `components/editor/plate-editor.tsx` with an `isApplyingRemoteChangeRef` lock mechanism.

### 2. Local-First & Offline Sync Queue

- **Read Path**: Prioritizes IndexedDB for instant rendering, followed by background revalidation (`Lazy Sync`).
- **Write Path**: Operations are first written to local IndexedDB with **Optimistic Updates** on the UI.
- **Sync Manager**: Maintains a `syncQueue` in `lib/indexeddb.ts` that automatically consumes and pushes data via Server Actions upon network recovery.

### 3. Modular Editor Package (`@susie/editor`)

The core editor functionality is decoupled into an independent npm package for high reusability.

- **Architecture**: Supports multiple entry points (Main, Kits, Collaborative, Components).
- **On-Demand Loading**: 58 Kit modules (e.g., `TableKit`, `MediaKit`) can be imported separately, supporting Tree-shaking.
- **Implementation**: Built with **tsup**, supporting ESM and strict TypeScript declarations.

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+
- PostgreSQL Database

### Installation Steps

1. **Clone & Install**:
   ```bash
   git clone [https://github.com/your-username/note-platform.git](https://github.com/your-username/note-platform.git)
   cd note-platform
   npm install
   ```

````

2. **Database Migration**:

```bash
npx prisma generate
npx prisma db push

```

3. **Start Development**:

```bash
npm run dev

```

## 📂 Directory Structure

```
├── app/                # Routes and Server Actions
├── components/         # UI and Editor core logic
├── lib/                # IndexedDB and sync queue logic
├── packages/           # Monorepo packages (@susie/editor)
├── prisma/             # Database Schema
└── public/             # Static assets

```

## 📄 License

MIT License

```
````
