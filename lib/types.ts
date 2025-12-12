import { Prisma } from '@prisma/client'

// 包含笔记计数的文件夹类型
export type FolderWithCount = Prisma.FolderGetPayload<{
  include: {
    _count: {
      select: { notes: true }
    }
  }
}>

// 包含笔记计数的标签类型
export type TagWithCount = Prisma.TagGetPayload<{
  include: {
    _count: {
      select: { notes: true }
    }
  }
}>

// 简单的文件夹类型（用于不需要计数的情况，或者作为基础类型）
export type Folder = Prisma.FolderGetPayload<{}>
export type Tag = Prisma.TagGetPayload<{}>
