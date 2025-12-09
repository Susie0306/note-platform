## 目标
- 按你提供的 PlatenUI 安装+配置指南，全面清理旧版 Plate 相关代码（含 @udecode/*）、避免版本冲突，并用最新版 platejs + PlatenUI 重新实现笔记编辑器的 Markdown 所见即所得体验。
- 继续以 Markdown 字符串作为持久化格式，保留现有标题/标签/自动保存/手动保存/离线降级逻辑不变。

## 现状梳理
- 旧版编辑器：`components/PlateEditor.tsx` 使用 `@udecode/*` v36 包和 `@udecode/plate-serializer-md`。
- 已改造的编辑器：`components/NoteEditor.tsx` 引入了部分最新版 `platejs/*` 包（含 `@platejs/markdown`、`@platejs/list`、`@platejs/indent`、`@platejs/autoformat`）并内置简易工具栏，但与旧文件并存且包版本杂糅，存在冲突风险。
- 依赖中仍保留旧版 `@udecode/*` 与新包并存，需要统一清理。

## 清理与依赖统一
1. 卸载旧版 Plate 相关包：`@udecode/plate-*`、`@udecode/plate-serializer-md` 等所有 `@udecode/*`。
2. 安装并统一到最新版：
   - 核心：`platejs`
   - 基本节点：`@platejs/basic-nodes`
   - Markdown：`@platejs/markdown`
   - 列表/缩进：`@platejs/list`、`@platejs/indent`
   - 自动格式化：`@platejs/autoformat`
   - 代码块（如需要）：`@platejs/code-block`
   - PlatenUI 组件：按你的指南指定来源（例如内置 UI 组件库或你提供的组件集合路径），确保与 Tailwind v4 兼容。
3. TypeScript/Next 配置对齐：
   - 若指南要求，`tsconfig.json` 设置 ESM/`moduleResolution: bundler`（或指南指定值），避免 React/Next ESM 路径问题。
   - 保持 Next 16/React 19 兼容，严格按指南的 import 路径（避免错误的 `/react` 或 base 路径混用）。

## 代码重构（仅编辑器板块）
1. 移除旧版文件与旧实现：
   - 删除 `components/PlateEditor.tsx`（@udecode v36 实现）。
   - 清理 `components/NoteEditor.tsx` 里既有 PlateJS 逻辑，改为使用 PlatenUI 的标准 Editor 组合。
2. 新建或引入 PlatenUI 的 Editor 组件：
   - 采用你指南中的 Editor 容器、内容组件与固定/浮动工具栏（例如 `Editor`/`EditorContainer`/`FixedToolbar`/`MarkToolbarButton`/`TurnInto`/`ListToolbarButton` 等），以 Tailwind v4 风格集成。
   - 插件阵列：
     - 基本块/标记：`H1/H2/H3/Paragraph/Blockquote/Bold/Italic/Strikethrough`（如需 `Underline`，按指南选择是否启用并配置 Markdown/MDX 兼容）。
     - 列表/缩进：`ListPlugin` + `IndentPlugin`。
     - 代码块（可选）：`CodeBlockPlugin`。
     - Markdown 双向转换：`MarkdownPlugin`。
     - 自动格式化：`AutoformatPlugin`（规则下文详述）。
3. Markdown ↔ 所见即所得对齐：
   - 初始载入：`usePlateEditor({ plugins, value: (e) => e.api.markdown.deserialize(initialContent) })`。
   - 变更时：`onValueChange` 中执行 `editor.api.markdown.serialize()` 写回 `content`。
   - 若指南包含 MDX 扩展：按指南增加 `remark`/`mdast` 支持；若仅需纯 Markdown，过滤非标准节点（避免 `mdxJsxTextElement` 报错）。
4. 自动格式化（满足“写 Markdown 纯文本并回车自动转换”）：
   - 启用 `AutoformatPlugin` 并配置常用规则：
     - 块：`# `→ h1、`## `→ h2、`### `→ h3、`> `→ blockquote、``` → codeBlock、`* `/`- `→ 无序列表、`1. `→ 有序列表。
     - 标记：`**`→ bold、`*`→ italic、`~~`→ strikethrough、`` ` ``→ code。
   - 列表用 `toggleList`，支持编号重启与待办列表（如指南要求）。
5. 工具栏与快捷键：
   - 使用 PlatenUI 提供的 `MarkToolbarButton`/`TurnInto`/`InsertToolbar` 等，替代自制按钮，遵循指南的组件与交互方式。
   - 保留现有保存快捷键 `mod+s`，不影响编辑器快捷键（如 `mod+b`）。
6. 与平台代码对接：
   - `NoteEditor` 保留标题、标签与保存逻辑（`performSave`/`fallbackToLocal`/`debouncedSave`）。
   - 编辑器仅替换输入区与工具栏，实现 WYSIWYG + Markdown 持久化。

## 验证与自查纠错
1. 启动开发服务，进入笔记编辑页：
   - 测试输入 `# `、`> `、`* `、`1. ` 等快捷语法，按空格/回车自动转换为对应块。
   - 测试 `**粗体**`、`*斜体*`、`~~删除线~~`、`` `代码` `` 自动转换与工具栏切换。
   - 测试自动保存/手动保存/离线降级逻辑是否仍然工作（仅内容序列化为 Markdown）。
2. 修复残留问题：
   - 若出现 `mdxJsxTextElement` 或其他未知节点错误，按指南启用或关闭对应扩展；若仅需纯 Markdown，保证过滤策略生效。
   - 确认 Tailwind v4 样式加载（`app/globals.css` `@import 'tailwindcss';`）与 PlatenUI 样式配合正常。

## 交付物
- 统一依赖后的 `package.json`。
- 仅保留新版实现的编辑器组件（采用 PlatenUI），移除旧版 `components/PlateEditor.tsx`。
- `components/NoteEditor.tsx` 内集成新版 Editor，完成 Markdown 双向与自动格式化。
- 通过页面自测与错误消除，保证编辑体验与存储逻辑稳定。

## 备注
- 我将严格按照你提供的 PlatenUI 安装+配置指南的具体组件/路径/参数来落地（当前计划中如有组件名或路径与指南不一致，将以指南为准进行替换）。
- 如指南要求使用特定的 Kit（例如 EditorKit、BasicMarksKit、ListKit 等），将直接采用 Kit 注入方式，减少重复配置。