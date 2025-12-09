**目标**

* 将左右分栏的 Markdown 输入+预览编辑器替换为基于 PlateJS 的所见即所得（WYSIWYG）编辑器。

* 仅修改编辑器相关代码，保留现有标题/标签/保存逻辑与数据结构（仍以 Markdown 字符串保存）。

**现状与定位**

* 当前编辑器在 `components/NoteEditor.tsx:178-190` 使用 `Textarea` + `ReactMarkdown`/`remark-gfm` 左写右预览。

* 项目已安装 Plate 相关包：`@udecode/plate-basic-marks`、`@udecode/plate-block-quote`、`@udecode/plate-common`、`@udecode/plate-heading`、`@udecode/plate-list`、`@udecode/plate-paragraph`、`@udecode/plate-serializer-md`，可直接使用。[参考: v36 Getting Started](https://v36.platejs.org/docs/getting-started)；Markdown 序列化包旧版说明与迁移参考见 npm 页面（已废弃，但本项目可继续用现有版本）[参考](https://www.npmjs.com/package/@udecode/plate-serializer-md)。

* Plate v36 提供 `createPlugins`、`Plate`/`PlateContent` 与插件工厂（如 `createBoldPlugin` 等）；Markdown 方向提供 `createDeserializeMdPlugin`/`serializeMd`/`deserializeMd` 能力（示例出现在 v36 文档与组件页）。[参考: v36 组件/插件示例页含](https://v36.platejs.org/docs/components/kbd-leaf) [`createDeserializeMdPlugin`](https://v36.platejs.org/docs/components/kbd-leaf) [引用](https://v36.platejs.org/docs/components/kbd-leaf)。新版文档关于 Markdown 的双向转换在 `platejs.org/docs/markdown`，供理解最新能力，[参考](https://platejs.org/docs/markdown)。

**实施方案**

* 依赖与框架：不新增依赖；使用已安装的 `@udecode/*` v36 包，保持 Next.js/React/Tailwind 现有配置。

* 插件配置：在编辑器中启用以下插件以覆盖常见 Markdown 能力：

  * 文本样式：`createBoldPlugin`、`createItalicPlugin`、`createUnderlinePlugin`、`createStrikethroughPlugin`、`createCodePlugin`（来自 `@udecode/plate-basic-marks`）。

  * 块级元素：`createParagraphPlugin`、`createHeadingPlugin`、`createListPlugin`、`createBlockquotePlugin`。

  * Markdown 适配：`createDeserializeMdPlugin`（用于粘贴/解析），并在初始化/保存时用 `deserializeMd`/`serializeMd` 完成内容与 Markdown 的互转。[参考](https://v36.platejs.org/docs/getting-started)、[参考](https://platejs.org/docs/markdown)。

* UI 改造：

  * 将 `Textarea`+右侧 `ReactMarkdown` 容器替换为单列的 `<Plate><PlateContent /></Plate>` 编辑区，支持所见即所得编辑。

  * 在编辑区上方添加简洁固定工具栏（Tailwind 样式），包含：加粗、斜体、下划线、删除线、行内代码、标题级别、项目/有序列表、引用。按钮触发插件对应的切换命令；同时保留快捷键（如 `mod+b`）。[参考: 工具栏与标记按钮用法](https://platejs.org/docs/toolbar)。

* 数据互转与保存：

  * 初始加载：`initialContent`（Markdown 字符串）经 `deserializeMd(...)` 转为 Plate 值并作为编辑器初始 `value`。

  * 变更时：在 `onChange` 中调用 `serializeMd(editor, { nodes: editor.children })` 生成 Markdown 字符串并写回 `content` state。

  * 现有保存与离线队列逻辑不变（`performSave`/`fallbackToLocal`/`debouncedSave` 等），继续按字符串 `content` 入库与同步；保留标题与标签逻辑。

* 样式与交互：

  * 使用 Tailwind v4 现有配置（`app/globals.css` 的 `@import 'tailwindcss';`）。

  * 保留顶部标题输入、标签输入、保存状态与“保存”按钮交互。

**变更范围**

* 主要修改文件：`components/NoteEditor.tsx`（替换编辑区，新增工具栏与 Plate 初始化/序列化逻辑）。

* 如需更清晰结构，可新增一个局部组件（例如 `components/editor/RichTextToolbar.tsx`），仅服务编辑器，不触及平台其他模块。

* 不修改数据库、服务端 API、路由、鉴权或其他平台功能。

**兼容性与细节**

* Markdown 支持：保留 GFM 常用特性（粗体/斜体/列表/引用/代码块等）。如遇极少数 Markdown 语法差异，按 Plate 解析行为回退或保留原文本。[参考: Markdown 能力说明](https://platejs.org/docs/markdown)。

* 粘贴行为：启用 `createDeserializeMdPlugin` 支持从 Markdown/HTML 粘贴的合理转换。[参考: v36 序列化/反序列化示例](https://v36.platejs.org/docs/serializing-html)。

* 不引入新包版本，避免与 React 19/Next 16/Tailwind v4 的耦合变更。

**验证**

* 单页联调：

  * 加载已有笔记，确认 Markdown → WYSIWYG 转换正确（标题、列表、引用、代码块渲染正确）。

  * 编辑后自动保存与手动保存均生效；断网情况下仍能落盘 IndexedDB 并入同步队列。

* 回读校验：刷新后从存储拉取 Markdown，确保 `deserializeMd` 重建编辑态一致。

* 快捷键测试：`mod+b`/`mod+i` 等生效。

**回滚策略**

* 改动仅限编辑器组件；若需回滚，恢复 `Textarea + ReactMarkdown` 布局及原事件绑定即可。

**参考资料**

* Plate v36 入门与插件配置: <https://v36.platejs.org/docs/getting-started>

* v36 组件页示例含 `createDeserializeMdPlugin`: <https://v36.platejs.org/docs/components/kbd-leaf>

* Markdown 双向转换（新版文档，理解用法与能力范围）: <https://platejs.org/docs/markdown>

* 旧版 Markdown 序列化包状态（项目当前已安装，可继续使用）: <https://www.npmjs.com/package/@udecode/plate-serializer-md>

