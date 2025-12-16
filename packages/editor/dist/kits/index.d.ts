import * as platejs_react from 'platejs/react';
import * as platejs from 'platejs';
import { Path } from 'platejs';
import * as lowlight from 'lowlight';
import { createLowlight } from 'lowlight';
import * as _platejs_table from '@platejs/table';
import * as _platejs_toc from '@platejs/toc';
import * as _platejs_media_react from '@platejs/media/react';
import * as _platejs_media from '@platejs/media';
import * as React$1 from 'react';
import * as _platejs_link_react from '@platejs/link/react';
import * as _platejs_combobox from '@platejs/combobox';
import * as _platejs_list from '@platejs/list';
import * as _platejs_basic_styles from '@platejs/basic-styles';
export { D as DiscussionKit } from '../discussion-kit-LEJ4Df1C.js';
import * as _platejs_autoformat from '@platejs/autoformat';
import * as _platejs_selection_react from '@platejs/selection/react';
import * as react_dnd from 'react-dnd';
import * as _platejs_dnd from '@platejs/dnd';
import _emoji_mart_data__default from '@emoji-mart/data';
import * as remark_stringify from 'remark-stringify';
import * as unified from 'unified';
import * as _platejs_markdown from '@platejs/markdown';
import { serializeMd } from '@platejs/markdown';
import * as _platejs_ai_react from '@platejs/ai/react';
import * as _platejs_link from '@platejs/link';
import * as _platejs_indent from '@platejs/indent';
import 'react/jsx-runtime';

declare const BasicBlocksKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"p", {}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<any, {}, {}, Record<any, {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"blockquote", {}, {}, Record<"blockquote", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"hr", {}, {}, {}, {}>>)[];

declare const BasicNodesKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"p", {}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<any, {}, {}, Record<any, {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"blockquote", {}, {}, Record<"blockquote", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"hr", {}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"bold", {}, {}, Record<"bold", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"italic", {}, {}, Record<"italic", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"underline", {}, {}, Record<"underline", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"code", {}, {}, Record<"code", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"strikethrough", {}, {}, Record<"strikethrough", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"subscript", {}, {}, Record<"subscript", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"superscript", {}, {}, Record<"superscript", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"highlight", {}, {}, Record<"highlight", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"kbd", {}, {}, Record<"kbd", {
    toggle: () => void;
}>, {}>>)[];

declare const CodeBlockKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"code_block", {
    defaultLanguage?: string | null;
    lowlight?: ReturnType<typeof createLowlight> | null;
}, {}, Record<"code_block", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<any, {}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"code_syntax", {}, {}, {}, {}>>)[];

declare const TableKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"table", {
    _cellIndices: Record<string, {
        col: number;
        row: number;
    }>;
    selectedCells: platejs.TElement[] | null;
    selectedTables: platejs.TElement[] | null;
    disableExpandOnInsert?: boolean;
    disableMarginLeft?: boolean;
    disableMerge?: boolean;
    enableUnsetSingleColSize?: boolean;
    initialTableWidth?: number;
    minColumnWidth?: number;
}, {
    create: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, header, rowCount, ...cellOptions }?: _platejs_table.GetEmptyTableNodeOptions) => platejs.TTableElement>;
        tableCell: platejs.OmitFirst<(editor: platejs.SlateEditor, { children, header, row }?: _platejs_table.CreateCellOptions) => {
            children: platejs.Descendant[];
            type: string;
        }>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, ...cellOptions }?: _platejs_table.GetEmptyRowNodeOptions) => {
            children: {
                children: platejs.Descendant[];
                type: string;
            }[];
            type: string;
        }>;
    };
    table: {
        getCellBorders: platejs.OmitFirst<(editor: platejs.SlateEditor, { cellIndices, defaultBorder, element }: {
            element: platejs.TTableCellElement;
            cellIndices?: _platejs_table.CellIndices;
            defaultBorder?: platejs.TTableCellBorder;
        }) => _platejs_table.BorderStylesDefault>;
        getCellSize: platejs.OmitFirst<(editor: platejs.SlateEditor, { cellIndices, colSizes, element, rowSize }: {
            element: platejs.TTableCellElement;
            cellIndices?: _platejs_table.CellIndices;
            colSizes?: number[];
            rowSize?: number;
        }) => {
            minHeight: number | undefined;
            width: number;
        }>;
        getColSpan: (cellElem: platejs.TTableCellElement) => number;
        getRowSpan: (cellElem: platejs.TTableCellElement) => number;
        getCellChildren: (cell: platejs.TTableCellElement) => platejs.Descendant[];
    };
} & {
    create: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, header, rowCount, ...cellOptions }?: _platejs_table.GetEmptyTableNodeOptions) => platejs.TTableElement>;
        tableCell: platejs.OmitFirst<(editor: platejs.SlateEditor, { children, header, row }?: _platejs_table.CreateCellOptions) => {
            children: platejs.Descendant[];
            type: string;
        }>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, ...cellOptions }?: _platejs_table.GetEmptyRowNodeOptions) => {
            children: {
                children: platejs.Descendant[];
                type: string;
            }[];
            type: string;
        }>;
    };
    table: {
        getCellBorders: platejs.OmitFirst<(editor: platejs.SlateEditor, { cellIndices, defaultBorder, element }: {
            element: platejs.TTableCellElement;
            cellIndices?: _platejs_table.CellIndices;
            defaultBorder?: platejs.TTableCellBorder;
        }) => _platejs_table.BorderStylesDefault>;
        getCellSize: platejs.OmitFirst<(editor: platejs.SlateEditor, { cellIndices, colSizes, element, rowSize }: {
            element: platejs.TTableCellElement;
            cellIndices?: _platejs_table.CellIndices;
            colSizes?: number[];
            rowSize?: number;
        }) => {
            minHeight: number | undefined;
            width: number;
        }>;
        getColSpan: (cellElem: platejs.TTableCellElement) => number;
        getRowSpan: (cellElem: platejs.TTableCellElement) => number;
        getCellChildren: (cell: platejs.TTableCellElement) => platejs.Descendant[];
    };
}, {
    insert: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, header, rowCount }?: _platejs_table.GetEmptyTableNodeOptions, { select: shouldSelect, ...options }?: platejs.InsertNodesOptions) => void>;
        tableColumn: platejs.OmitFirst<(editor: platejs.SlateEditor, options?: {
            at?: platejs.Path;
            before?: boolean;
            fromCell?: platejs.Path;
            header?: boolean;
            select?: boolean;
        }) => void>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor, options?: {
            at?: platejs.Path;
            before?: boolean;
            fromRow?: platejs.Path;
            header?: boolean;
            select?: boolean;
        }) => void>;
    };
    remove: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        tableColumn: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
    };
    table: {
        merge: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        split: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
    };
} & {
    insert: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, header, rowCount }?: _platejs_table.GetEmptyTableNodeOptions, { select: shouldSelect, ...options }?: platejs.InsertNodesOptions) => void>;
        tableColumn: platejs.OmitFirst<(editor: platejs.SlateEditor, options?: {
            at?: platejs.Path;
            before?: boolean;
            fromCell?: platejs.Path;
            header?: boolean;
            select?: boolean;
        }) => void>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor, options?: {
            at?: platejs.Path;
            before?: boolean;
            fromRow?: platejs.Path;
            header?: boolean;
            select?: boolean;
        }) => void>;
    };
    remove: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        tableColumn: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
    };
    table: {
        merge: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        split: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
    };
}, {
    cellIndices?: (id: string) => _platejs_table.CellIndices;
}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"tr", {}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"td", {}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"th", {}, {}, {}, {}>>)[];

declare const ToggleKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"indent", {
    indentMax?: number;
    offset?: number;
    unit?: string;
}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"toggle", {
    openIds?: Set<string>;
} & {
    toggleIndex?: ReturnType<(elements: platejs.Value) => Map<string, string[]>>;
}, {
    toggle: {
        toggleIds: (ids: string[], force?: boolean | null) => void;
    };
}, {}, {
    isOpen?: (toggleId: string) => boolean;
    someClosed?: (toggleIds: string[]) => boolean;
}>>)[];

declare const TocKit: platejs_react.PlatePlugin<platejs.PluginConfig<"toc", {
    isScroll: boolean;
    topOffset: number;
    queryHeading?: (editor: platejs.SlateEditor) => _platejs_toc.Heading[];
}, {}, {}, {}>>[];

declare const MediaKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"placeholder", _platejs_media.MediaPlaceholderOptions & {
    disableEmptyPlaceholder: boolean;
    disableFileDrop: boolean;
    uploadConfig: _platejs_media_react.UploadConfig;
    uploadingFiles: Record<string, File>;
    error?: _platejs_media_react.UploadError | null;
    maxFileCount?: number;
    multiple?: boolean;
}, {
    placeholder: _platejs_media_react.PlaceholderApi;
} & Record<"placeholder", {
    addUploadingFile: (id: string, file: File) => void;
    getUploadingFile: (id: string) => File;
    removeUploadingFile: (id: string) => void;
}>, {
    insert: {
        media: (files: FileList, options?: (Omit<platejs.InsertNodesOptions, "at"> & {
            at?: platejs.Path;
        }) | undefined) => any;
    };
}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"media_embed", _platejs_media.MediaPluginOptions, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"img", {
    disableEmbedInsert?: boolean;
    disableUploadInsert?: boolean;
    uploadImage?: (dataUrl: ArrayBuffer | string) => ArrayBuffer | Promise<ArrayBuffer | string> | string;
} & _platejs_media.MediaPluginOptions, {}, {
    insert: {
        imageFromFiles: (files: FileList, options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"video", {}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"audio", {}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"file", {}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"caption", {
    focusEndPath: platejs.Path | null;
    focusStartPath: platejs.Path | null;
    query: {
        allow: string[];
    };
    visibleId: string | null;
}, {}, {}, {
    isVisible?: (elementId: string) => boolean;
}>>)[];

declare const CalloutKit: platejs_react.PlatePlugin<platejs.PluginConfig<"callout", {}, {}, {
    insert: {
        callout: (args_0?: ({
            batchDirty?: boolean;
            hanging?: boolean;
            nextBlock?: boolean;
            removeEmpty?: platejs.QueryNodeOptions | boolean;
            select?: boolean;
        } & {
            id?: boolean | string;
            block?: boolean;
            empty?: boolean;
            match?: platejs.Predicate<platejs.NodeIn<platejs.Value>> | undefined;
            text?: boolean;
        } & platejs.QueryAt & platejs.QueryMode & platejs.QueryVoids & {
            icon?: string;
            variant?: (string & {}) | platejs.TCalloutElement["variant"];
        }) | undefined) => void;
    };
}, {}>>[];

declare const ColumnKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"column_group", {}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"column", {}, {}, {}, {}>>)[];

declare const MathKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"inline_equation", {}, {}, {
    insert: {
        inlineEquation: (texExpression?: string | undefined, options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"equation", {}, {}, {
    insert: {
        equation: (options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>>)[];

declare const DateKit: platejs_react.PlatePlugin<platejs.PluginConfig<"date", {}, {}, {
    insert: {
        date: (args_0?: ({
            date?: string;
        } & {
            batchDirty?: boolean;
            hanging?: boolean;
            nextBlock?: boolean;
            removeEmpty?: platejs.QueryNodeOptions | boolean;
            select?: boolean;
        } & {
            id?: boolean | string;
            block?: boolean;
            empty?: boolean;
            match?: platejs.Predicate<platejs.NodeIn<platejs.Value>> | undefined;
            text?: boolean;
        } & platejs.QueryAt & platejs.QueryMode & platejs.QueryVoids) | undefined) => void;
    };
}, {}>>[];

declare const LinkKit: platejs_react.PlatePlugin<platejs.PluginConfig<"a", {
    allowedSchemes?: string[];
    dangerouslySkipSanitization?: boolean;
    defaultLinkAttributes?: React.AnchorHTMLAttributes<HTMLAnchorElement>;
    forceSubmit?: boolean;
    keepSelectedTextOnPaste?: boolean;
    rangeBeforeOptions?: platejs.EditorBeforeOptions;
    triggerFloatingLinkHotkeys?: string[] | string;
    getLinkUrl?: (prevUrl: string | null) => Promise<string | null>;
    getUrlHref?: (url: string) => string | undefined;
    isUrl?: (text: string) => boolean;
    transformInput?: (url: string) => string | undefined;
} & {
    isEditing: boolean;
    mode: _platejs_link_react.FloatingLinkMode;
    mouseDown: boolean;
    newTab: boolean;
    openEditorId: string | null;
    text: string;
    updated: boolean;
    url: string;
    triggerFloatingLinkHotkeys?: string;
}, {
    floatingLink: {
        hide: () => void;
        reset: () => void;
        show: (mode: _platejs_link_react.FloatingLinkMode, editorId: string) => void;
    };
    link: {
        getAttributes: platejs.OmitFirst<(editor: platejs.SlateEditor, link: platejs.TLinkElement) => Pick<React$1.AnchorHTMLAttributes<HTMLAnchorElement>, "href" | "target"> & platejs.UnknownObject>;
    };
}, {}, {
    isOpen?: (editorId: string) => boolean;
}>>[];

declare const MentionKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"mention", {
    insertSpaceAfterMention?: boolean;
} & _platejs_combobox.TriggerComboboxPluginOptions, {}, {
    insert: {
        mention: (options: {
            search: string;
            value: any;
            key?: any;
        }) => void;
    };
}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"mention_input", {}, {}, {}, {}>>)[];

declare const BasicMarksKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"bold", {}, {}, Record<"bold", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"italic", {}, {}, Record<"italic", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"underline", {}, {}, Record<"underline", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"code", {}, {}, Record<"code", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"strikethrough", {}, {}, Record<"strikethrough", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"subscript", {}, {}, Record<"subscript", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"superscript", {}, {}, Record<"superscript", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"highlight", {}, {}, Record<"highlight", {
    toggle: () => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"kbd", {}, {}, Record<"kbd", {
    toggle: () => void;
}>, {}>>)[];

declare const FontKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"fontSize", {}, {}, Record<"fontSize", {
    addMark: (value: string) => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"color", {}, {}, Record<"color", {
    addMark: (value: string) => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"backgroundColor", {}, {}, Record<"backgroundColor", {
    addMark: (value: string) => void;
}>, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"fontFamily", {}, {}, Record<"fontFamily", {
    addMark: (value: string) => void;
}>, {}>>)[];

declare const ListKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"indent", {
    indentMax?: number;
    offset?: number;
    unit?: string;
}, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"list", {
    getSiblingListOptions?: _platejs_list.GetSiblingListOptions<platejs.TElement>;
    getListStyleType?: (element: HTMLElement) => _platejs_list.ListStyleType;
}, {}, {}, {}>>)[];

declare const AlignKit: platejs_react.PlatePlugin<platejs.PluginConfig<"textAlign", {}, {}, Record<"textAlign", {
    setNodes: (value: _platejs_basic_styles.Alignment, setNodesOptions?: platejs.SetNodesOptions | undefined) => void;
}>, {}>>[];

declare const LineHeightKit: platejs_react.PlatePlugin<platejs.PluginConfig<"lineHeight", {}, {}, Record<"lineHeight", {
    setNodes: (value: number, setNodesOptions?: platejs.SetNodesOptions | undefined) => void;
}>, {}>>[];

declare const IndentKit: platejs_react.PlatePlugin<platejs.PluginConfig<"indent", {
    indentMax?: number;
    offset?: number;
    unit?: string;
}, {}, {}, {}>>[];

declare const CommentKit: platejs_react.PlatePlugin<platejs.PluginConfig<"comment", {
    activeId: string | null;
    commentingBlock: Path | null;
    hoverId: string | null;
    uniquePathMap: Map<string, Path>;
}, {
    comment: {
        has: (options: {
            id: string;
        }) => boolean;
        node: (options?: platejs.EditorNodesOptions & {
            id?: string;
            isDraft?: boolean;
        }) => platejs.NodeEntry<platejs.TCommentText> | undefined;
        nodeId: (leaf: platejs.TCommentText) => string | undefined;
        nodes: (options?: platejs.EditorNodesOptions & {
            id?: string;
            isDraft?: boolean;
            transient?: boolean;
        }) => platejs.NodeEntry<platejs.TCommentText>[];
    };
}, {
    comment: {
        removeMark: () => void;
        setDraft: (options?: platejs.SetNodesOptions) => void;
        unsetMark: (options: {
            id?: string;
            transient?: boolean;
        }) => void;
    };
} & Record<"comment", {
    setDraft: () => void;
}>, {}>>[];

declare const SuggestionKit: platejs_react.PlatePlugin<platejs.PluginConfig<"suggestion", {
    currentUserId: string | null;
    isSuggesting: boolean;
} & {
    activeId: string | null;
    hoverId: string | null;
    uniquePathMap: Map<string, Path>;
}, {
    suggestion: {
        dataList: (node: platejs.TSuggestionText) => platejs.TInlineSuggestionData[];
        isBlockSuggestion: (node: platejs.TNode) => node is platejs.TSuggestionElement;
        node: (options?: platejs.EditorNodesOptions & {
            id?: string;
            isText?: boolean;
        }) => platejs.NodeEntry<platejs.TSuggestionElement | platejs.TSuggestionText> | undefined;
        nodeId: (node: platejs.TElement | platejs.TSuggestionText) => string | undefined;
        nodes: (options?: platejs.EditorNodesOptions & {
            transient?: boolean;
        }) => platejs.NodeEntry<platejs.TElement | platejs.TSuggestionText>[];
        suggestionData: (node: platejs.TElement | platejs.TSuggestionText) => platejs.TInlineSuggestionData | platejs.TSuggestionElement["suggestion"] | undefined;
        withoutSuggestions: (fn: () => void) => void;
    };
}, {}, {}>>[];

declare const SlashKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"slash_command", _platejs_combobox.TriggerComboboxPluginOptions, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"slash_input", {}, {}, {}, {}>>)[];

declare const AutoformatKit: platejs.SlatePlugin<_platejs_autoformat.AutoformatConfig>[];

declare const CursorOverlayKit: platejs_react.PlatePlugin<platejs.PluginConfig<"cursorOverlay", {
    cursors: Record<string, _platejs_selection_react.CursorState<_platejs_selection_react.CursorData>>;
}, {
    cursorOverlay: {
        addCursor: (id: string, cursor: Omit<_platejs_selection_react.CursorState<_platejs_selection_react.CursorData>, "id">) => void;
        removeCursor: (id: (string & {}) | "drag" | "selection") => void;
    };
} & Record<"cursorOverlay", {
    addCursor: (id: string, cursor: Omit<_platejs_selection_react.CursorState<_platejs_selection_react.CursorData>, "id">) => void;
    removeCursor: (id: (string & {}) | "drag" | "selection") => void;
}>, {}, {}>>[];

declare const BlockMenuKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"blockMenu", {
    openId: ((string & {}) | "context") | null;
    position: {
        x: number;
        y: number;
    };
}, {
    blockMenu: {
        hide: () => void;
        show: (id: (string & {}) | "context", position?: {
            x: number;
            y: number;
        }) => void;
        showContextMenu: (blockId: string, position: {
            x: number;
            y: number;
        }) => void;
    };
} & Record<"blockMenu", Partial<{
    hide: () => void;
    show: (id: (string & {}) | "context", position?: {
        x: number;
        y: number;
    }) => void;
    showContextMenu: (blockId: string, position: {
        x: number;
        y: number;
    }) => void;
}>>, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"blockSelection", {
    anchorId?: string | null;
    areaOptions?: {
        document?: Document;
    } & {
        container?: (string | HTMLElement | (string | HTMLElement)[]) | undefined;
        behaviour?: {
            intersect?: ("center" | "cover" | "touch") | undefined;
            overlap?: ("drop" | "invert" | "keep") | undefined;
            scrolling?: {
                manualSpeed?: number | undefined;
                speedDivider?: number | undefined;
                startScrollMargins?: {
                    x?: number | undefined;
                    y?: number | undefined;
                } | undefined;
            } | undefined;
            startThreshold?: number | {
                x?: number | undefined;
                y?: number | undefined;
            } | undefined;
            triggers?: ((0 | 1 | 2 | 3 | 4) | {
                button: 0 | 1 | 2 | 3 | 4;
                modifiers: ("shift" | "alt" | "ctrl")[];
            })[] | undefined;
        } | undefined;
        boundaries?: (string | HTMLElement | (string | HTMLElement)[]) | undefined;
        features?: {
            range?: boolean | undefined;
            singleTap?: {
                allow?: boolean | undefined;
                intersect?: ("touch" | "native") | undefined;
            } | undefined;
            touch?: boolean | undefined;
        } | undefined;
        selectables?: (string | string[]) | undefined;
        selectionAreaClass?: string | undefined;
        startAreas?: (string | HTMLElement | (string | HTMLElement)[]) | undefined;
    };
    editorPaddingRight?: React$1.CSSProperties["width"];
    enableContextMenu?: boolean;
    isSelecting?: boolean;
    isSelectionAreaVisible?: boolean;
    rightSelectionAreaClassName?: string;
    selectedIds?: Set<string>;
    shadowInputRef?: React.RefObject<HTMLInputElement | null>;
    isSelectable?: (element: platejs.TElement, path: platejs.Path) => boolean;
    onKeyDownSelecting?: (editor: platejs.SlateEditor, e: KeyboardEvent) => void;
}, {
    blockSelection: {
        addOnContextMenu: platejs.OmitFirst<(editor: platejs_react.PlateEditor, { disabledWhenFocused, element, event }: {
            element: platejs.TElement;
            event: React.MouseEvent<HTMLDivElement, MouseEvent>;
            disabledWhenFocused?: boolean;
        }) => void>;
        setSelectedIds: platejs.OmitFirst<(editor: platejs.SlateEditor, { added, ids, removed }: Partial<{
            added: Element[];
            removed: Element[];
        }> & {
            ids?: string[];
        }) => void>;
        add: (id: string[] | string) => void;
        addSelectedRow: (id: string, options?: {
            clear?: boolean;
            delay?: number;
        }) => void;
        clear: () => void;
        delete: (id: string[] | string) => void;
        deselect: () => void;
        first: () => platejs.NodeEntry<platejs.TIdElement> | null;
        focus: () => void;
        getNodes: (options?: {
            collapseTableRows?: boolean;
            selectionFallback?: boolean;
            sort?: boolean;
        }) => platejs.NodeEntry<platejs.TIdElement>[];
        has: (id: string[] | string) => boolean;
        isSelectable: (element: platejs.TElement, path: platejs.Path) => boolean;
        moveSelection: (direction: "down" | "up") => void;
        resetSelectedIds: () => void;
        selectAll: () => void;
        set: (id: string[] | string) => void;
        shiftSelection: (direction: "down" | "up") => void;
        unselect: () => void;
    };
} & Record<"blockSelection", Partial<{
    addOnContextMenu: platejs.OmitFirst<(editor: platejs_react.PlateEditor, { disabledWhenFocused, element, event }: {
        element: platejs.TElement;
        event: React.MouseEvent<HTMLDivElement, MouseEvent>;
        disabledWhenFocused?: boolean;
    }) => void>;
    setSelectedIds: platejs.OmitFirst<(editor: platejs.SlateEditor, { added, ids, removed }: Partial<{
        added: Element[];
        removed: Element[];
    }> & {
        ids?: string[];
    }) => void>;
    add: (id: string[] | string) => void;
    addSelectedRow: (id: string, options?: {
        clear?: boolean;
        delay?: number;
    }) => void;
    clear: () => void;
    delete: (id: string[] | string) => void;
    deselect: () => void;
    first: () => platejs.NodeEntry<platejs.TIdElement> | null;
    focus: () => void;
    getNodes: (options?: {
        collapseTableRows?: boolean;
        selectionFallback?: boolean;
        sort?: boolean;
    }) => platejs.NodeEntry<platejs.TIdElement>[];
    has: (id: string[] | string) => boolean;
    isSelectable: (element: platejs.TElement, path: platejs.Path) => boolean;
    moveSelection: (direction: "down" | "up") => void;
    resetSelectedIds: () => void;
    selectAll: () => void;
    set: (id: string[] | string) => void;
    shiftSelection: (direction: "down" | "up") => void;
    unselect: () => void;
}>>, Record<"blockSelection", {
    duplicate: () => void;
    insertBlocksAndSelect: (nodes: platejs.TElement[], args_1: {
        at: platejs.Path;
        insertedCallback?: () => void;
    }) => void;
    removeNodes: () => void;
    select: () => void;
    selectBlocks: (at: platejs.Path | platejs.TNode) => void;
    setIndent: (indent: number, options?: platejs.SetNodesOptions | undefined) => void;
    setNodes: (props: Partial<Omit<platejs.TElement, "children">>, options?: platejs.SetNodesOptions | undefined) => void;
    setTexts: (props: Partial<Omit<platejs.TText, "text">>, options?: Omit<platejs.SetNodesOptions, "at"> | undefined) => void;
}>, {
    isSelected?: (id?: string) => boolean;
    isSelectingSome?: () => boolean;
}>>)[];

declare const BlockSelectionKit: platejs_react.PlatePlugin<platejs.PluginConfig<"blockSelection", {
    anchorId?: string | null;
    areaOptions?: {
        document?: Document;
    } & {
        container?: (string | HTMLElement | (string | HTMLElement)[]) | undefined;
        behaviour?: {
            intersect?: ("center" | "cover" | "touch") | undefined;
            overlap?: ("drop" | "invert" | "keep") | undefined;
            scrolling?: {
                manualSpeed?: number | undefined;
                speedDivider?: number | undefined;
                startScrollMargins?: {
                    x?: number | undefined;
                    y?: number | undefined;
                } | undefined;
            } | undefined;
            startThreshold?: number | {
                x?: number | undefined;
                y?: number | undefined;
            } | undefined;
            triggers?: ((0 | 1 | 2 | 3 | 4) | {
                button: 0 | 1 | 2 | 3 | 4;
                modifiers: ("shift" | "alt" | "ctrl")[];
            })[] | undefined;
        } | undefined;
        boundaries?: (string | HTMLElement | (string | HTMLElement)[]) | undefined;
        features?: {
            range?: boolean | undefined;
            singleTap?: {
                allow?: boolean | undefined;
                intersect?: ("touch" | "native") | undefined;
            } | undefined;
            touch?: boolean | undefined;
        } | undefined;
        selectables?: (string | string[]) | undefined;
        selectionAreaClass?: string | undefined;
        startAreas?: (string | HTMLElement | (string | HTMLElement)[]) | undefined;
    };
    editorPaddingRight?: React$1.CSSProperties["width"];
    enableContextMenu?: boolean;
    isSelecting?: boolean;
    isSelectionAreaVisible?: boolean;
    rightSelectionAreaClassName?: string;
    selectedIds?: Set<string>;
    shadowInputRef?: React.RefObject<HTMLInputElement | null>;
    isSelectable?: (element: platejs.TElement, path: platejs.Path) => boolean;
    onKeyDownSelecting?: (editor: platejs.SlateEditor, e: KeyboardEvent) => void;
}, {
    blockSelection: {
        addOnContextMenu: platejs.OmitFirst<(editor: platejs_react.PlateEditor, { disabledWhenFocused, element, event }: {
            element: platejs.TElement;
            event: React.MouseEvent<HTMLDivElement, MouseEvent>;
            disabledWhenFocused?: boolean;
        }) => void>;
        setSelectedIds: platejs.OmitFirst<(editor: platejs.SlateEditor, { added, ids, removed }: Partial<{
            added: Element[];
            removed: Element[];
        }> & {
            ids?: string[];
        }) => void>;
        add: (id: string[] | string) => void;
        addSelectedRow: (id: string, options?: {
            clear?: boolean;
            delay?: number;
        }) => void;
        clear: () => void;
        delete: (id: string[] | string) => void;
        deselect: () => void;
        first: () => platejs.NodeEntry<platejs.TIdElement> | null;
        focus: () => void;
        getNodes: (options?: {
            collapseTableRows?: boolean;
            selectionFallback?: boolean;
            sort?: boolean;
        }) => platejs.NodeEntry<platejs.TIdElement>[];
        has: (id: string[] | string) => boolean;
        isSelectable: (element: platejs.TElement, path: platejs.Path) => boolean;
        moveSelection: (direction: "down" | "up") => void;
        resetSelectedIds: () => void;
        selectAll: () => void;
        set: (id: string[] | string) => void;
        shiftSelection: (direction: "down" | "up") => void;
        unselect: () => void;
    };
} & Record<"blockSelection", Partial<{
    addOnContextMenu: platejs.OmitFirst<(editor: platejs_react.PlateEditor, { disabledWhenFocused, element, event }: {
        element: platejs.TElement;
        event: React.MouseEvent<HTMLDivElement, MouseEvent>;
        disabledWhenFocused?: boolean;
    }) => void>;
    setSelectedIds: platejs.OmitFirst<(editor: platejs.SlateEditor, { added, ids, removed }: Partial<{
        added: Element[];
        removed: Element[];
    }> & {
        ids?: string[];
    }) => void>;
    add: (id: string[] | string) => void;
    addSelectedRow: (id: string, options?: {
        clear?: boolean;
        delay?: number;
    }) => void;
    clear: () => void;
    delete: (id: string[] | string) => void;
    deselect: () => void;
    first: () => platejs.NodeEntry<platejs.TIdElement> | null;
    focus: () => void;
    getNodes: (options?: {
        collapseTableRows?: boolean;
        selectionFallback?: boolean;
        sort?: boolean;
    }) => platejs.NodeEntry<platejs.TIdElement>[];
    has: (id: string[] | string) => boolean;
    isSelectable: (element: platejs.TElement, path: platejs.Path) => boolean;
    moveSelection: (direction: "down" | "up") => void;
    resetSelectedIds: () => void;
    selectAll: () => void;
    set: (id: string[] | string) => void;
    shiftSelection: (direction: "down" | "up") => void;
    unselect: () => void;
}>>, Record<"blockSelection", {
    duplicate: () => void;
    insertBlocksAndSelect: (nodes: platejs.TElement[], args_1: {
        at: platejs.Path;
        insertedCallback?: () => void;
    }) => void;
    removeNodes: () => void;
    select: () => void;
    selectBlocks: (at: platejs.Path | platejs.TNode) => void;
    setIndent: (indent: number, options?: platejs.SetNodesOptions | undefined) => void;
    setNodes: (props: Partial<Omit<platejs.TElement, "children">>, options?: platejs.SetNodesOptions | undefined) => void;
    setTexts: (props: Partial<Omit<platejs.TText, "text">>, options?: Omit<platejs.SetNodesOptions, "at"> | undefined) => void;
}>, {
    isSelected?: (id?: string) => boolean;
    isSelectingSome?: () => boolean;
}>>[];

declare const BlockPlaceholderKit: platejs_react.PlatePlugin<platejs.PluginConfig<"blockPlaceholder", {
    _target: {
        node: platejs.TElement;
        placeholder: string;
    } | null;
    placeholders: Record<string, string>;
    query: (context: platejs_react.PlatePluginContext<platejs_react.BlockPlaceholderConfig> & {
        node: platejs.TElement;
        path: platejs.Path;
    }) => boolean;
    className?: string;
}, {}, {}, {
    placeholder: (node: platejs.TElement) => string | undefined;
}>>[];

declare const DndKit: platejs_react.PlatePlugin<platejs.PluginConfig<"dnd", {
    _isOver?: boolean;
    draggingId?: string[] | string | null;
    dropTarget?: {
        id: string | null;
        line: _platejs_dnd.DropLineDirection;
    };
    enableScroller?: boolean;
    isDragging?: boolean;
    multiplePreviewRef?: React.RefObject<HTMLDivElement | null> | null;
    scrollerProps?: Partial<_platejs_dnd.ScrollerProps>;
    onDropFiles?: (props: {
        id: string;
        dragItem: _platejs_dnd.FileDragItemNode;
        editor: platejs_react.PlateEditor;
        monitor: react_dnd.DropTargetMonitor<_platejs_dnd.DragItemNode, unknown>;
        nodeRef: any;
        target?: platejs.Path;
    }) => void;
}, {}, {}, {}>>[];

declare const EmojiKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"emoji", {
    data?: _emoji_mart_data__default.EmojiMartData;
    createEmojiNode?: (emoji: _emoji_mart_data__default.Emoji) => platejs.Descendant;
} & _platejs_combobox.TriggerComboboxPluginOptions, {}, {}, {}>> | platejs_react.PlatePlugin<platejs.PluginConfig<"emoji_input", {}, {}, {}, {}>>)[];

declare const ExitBreakKit: platejs.SlatePlugin<platejs.PluginConfig<"exitBreak", {}, {}, Record<"exitBreak", {
    insert: (options: Omit<platejs.InsertExitBreakOptions, "reverse">) => true | undefined;
    insertBefore: (options: Omit<platejs.InsertExitBreakOptions, "reverse">) => true | undefined;
}>, {}>>[];

declare const DocxKit: (platejs.SlatePlugin<platejs.PluginConfig<"docx", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"juice", {}, {}, {}, {}>>)[];

declare const MarkdownKit: platejs.SlatePlugin<platejs.PluginConfig<"markdown", {
    allowedNodes: _platejs_markdown.PlateType[] | null;
    disallowedNodes: _platejs_markdown.PlateType[] | null;
    remarkPlugins: unified.Plugin[];
    remarkStringifyOptions: remark_stringify.Options | null;
    rules: _platejs_markdown.MdRules | null;
    allowNode?: _platejs_markdown.AllowNodeConfig;
    plainMarks?: _platejs_markdown.PlateType[] | null;
}, {
    markdown: {
        deserialize: platejs.OmitFirst<(editor: platejs.SlateEditor, data: string, options?: Omit<_platejs_markdown.DeserializeMdOptions, "editor">) => platejs.Value>;
        deserializeInline: platejs.OmitFirst<(editor: platejs.SlateEditor, text: string, options?: _platejs_markdown.DeserializeMdOptions) => platejs.Descendant[]>;
        serialize: platejs.OmitFirst<(editor: platejs.SlateEditor, options?: Omit<_platejs_markdown.SerializeMdOptions, "editor">) => string>;
    };
} & Record<"markdown", {
    deserialize: (data: string, options?: Omit<_platejs_markdown.DeserializeMdOptions, "editor"> | undefined) => platejs.Value;
    deserializeInline: (text: string, options?: _platejs_markdown.DeserializeMdOptions | undefined) => platejs.Descendant[];
    serialize: (options?: Omit<_platejs_markdown.SerializeMdOptions, "editor"> | undefined) => string;
}>, {}, {}>>[];

declare const FixedToolbarKit: platejs_react.PlatePlugin<platejs.PluginConfig<"fixed-toolbar", {}, {}, {}, {}>>[];

declare const FloatingToolbarKit: platejs_react.PlatePlugin<platejs.PluginConfig<"floating-toolbar", {}, {}, {}, {}>>[];

declare const CopilotKit: (platejs_react.PlatePlugin<platejs.PluginConfig<"copilot", {
    abortController?: AbortController | null;
    completion?: string | null;
    error?: Error | null;
    isLoading?: boolean;
} & {
    completeOptions?: Partial<_platejs_ai_react.CompleteOptions>;
    debounceDelay?: number;
    getNextWord?: _platejs_ai_react.GetNextWord;
    renderGhostText?: (() => React.ReactNode) | null;
    shouldAbort?: boolean;
    suggestionNodeId?: string | null;
    suggestionText?: string | null;
    autoTriggerQuery?: (options: {
        editor: platejs_react.PlateEditor;
    }) => boolean;
    getPrompt?: (options: {
        editor: platejs_react.PlateEditor;
    }) => string;
    triggerQuery?: (options: {
        editor: platejs_react.PlateEditor;
    }) => boolean;
}, {
    copilot: {
        triggerSuggestion: platejs.OmitFirst<(editor: platejs_react.PlateEditor) => Promise<false | undefined>>;
        reject: () => false | undefined;
        setBlockSuggestion: (options: {
            text: string;
            id?: string;
        }) => void;
        stop: () => void;
    };
} & Record<"copilot", Omit<{
    triggerSuggestion: platejs.OmitFirst<(editor: platejs_react.PlateEditor) => Promise<false | undefined>>;
    reject: () => false | undefined;
    setBlockSuggestion: (options: {
        text: string;
        id?: string;
    }) => void;
    stop: () => void;
}, "reject">> & Record<"copilot", {
    reject: () => false | undefined;
}>, {
    copilot: {
        accept: platejs.OmitFirst<(editor: platejs_react.PlateEditor) => false | undefined>;
        acceptNextWord: platejs.OmitFirst<(editor: platejs_react.PlateEditor) => false | undefined>;
    };
} & Record<"copilot", {
    accept: () => false | undefined;
    acceptNextWord: () => false | undefined;
}>, {
    isSuggested?: (id: string) => boolean;
}>> | platejs.SlatePlugin<platejs.PluginConfig<"markdown", {
    allowedNodes: _platejs_markdown.PlateType[] | null;
    disallowedNodes: _platejs_markdown.PlateType[] | null;
    remarkPlugins: unified.Plugin[];
    remarkStringifyOptions: remark_stringify.Options | null;
    rules: _platejs_markdown.MdRules | null;
    allowNode?: _platejs_markdown.AllowNodeConfig;
    plainMarks?: _platejs_markdown.PlateType[] | null;
}, {
    markdown: {
        deserialize: platejs.OmitFirst<(editor: platejs.SlateEditor, data: string, options?: Omit<_platejs_markdown.DeserializeMdOptions, "editor">) => platejs.Value>;
        deserializeInline: platejs.OmitFirst<(editor: platejs.SlateEditor, text: string, options?: _platejs_markdown.DeserializeMdOptions) => platejs.Descendant[]>;
        serialize: platejs.OmitFirst<typeof serializeMd>;
    };
} & Record<"markdown", {
    deserialize: (data: string, options?: Omit<_platejs_markdown.DeserializeMdOptions, "editor"> | undefined) => platejs.Value;
    deserializeInline: (text: string, options?: _platejs_markdown.DeserializeMdOptions | undefined) => platejs.Descendant[];
    serialize: (options?: Omit<_platejs_markdown.SerializeMdOptions, "editor"> | undefined) => string;
}>, {}, {}>>)[];

declare const BaseBasicBlocksKit: (platejs.SlatePlugin<platejs.PluginConfig<"p", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<any, {}, {}, Record<any, {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"blockquote", {}, {}, Record<"blockquote", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"hr", {}, {}, {}, {}>>)[];

declare const BaseBasicMarksKit: (platejs.SlatePlugin<platejs.PluginConfig<"bold", {}, {}, Record<"bold", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"italic", {}, {}, Record<"italic", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"underline", {}, {}, Record<"underline", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"code", {}, {}, Record<"code", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"strikethrough", {}, {}, Record<"strikethrough", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"subscript", {}, {}, Record<"subscript", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"superscript", {}, {}, Record<"superscript", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"highlight", {}, {}, Record<"highlight", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"kbd", {}, {}, Record<"kbd", {
    toggle: () => void;
}>, {}>>)[];

declare const BaseCodeBlockKit: (platejs.SlatePlugin<platejs.PluginConfig<any, {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"code_block", {
    defaultLanguage?: string | null;
    lowlight?: ReturnType<typeof createLowlight> | null;
}, {}, Record<"code_block", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"code_syntax", {}, {}, {}, {}>>)[];

declare const BaseTableKit: (platejs.SlatePlugin<platejs.PluginConfig<"table", {
    _cellIndices: Record<string, {
        col: number;
        row: number;
    }>;
    selectedCells: platejs.TElement[] | null;
    selectedTables: platejs.TElement[] | null;
    disableExpandOnInsert?: boolean;
    disableMarginLeft?: boolean;
    disableMerge?: boolean;
    enableUnsetSingleColSize?: boolean;
    initialTableWidth?: number;
    minColumnWidth?: number;
}, {
    create: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, header, rowCount, ...cellOptions }?: _platejs_table.GetEmptyTableNodeOptions) => platejs.TTableElement>;
        tableCell: platejs.OmitFirst<(editor: platejs.SlateEditor, { children, header, row }?: _platejs_table.CreateCellOptions) => {
            children: platejs.Descendant[];
            type: string;
        }>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, ...cellOptions }?: _platejs_table.GetEmptyRowNodeOptions) => {
            children: {
                children: platejs.Descendant[];
                type: string;
            }[];
            type: string;
        }>;
    };
    table: {
        getCellBorders: platejs.OmitFirst<(editor: platejs.SlateEditor, { cellIndices, defaultBorder, element }: {
            element: platejs.TTableCellElement;
            cellIndices?: _platejs_table.CellIndices;
            defaultBorder?: platejs.TTableCellBorder;
        }) => _platejs_table.BorderStylesDefault>;
        getCellSize: platejs.OmitFirst<(editor: platejs.SlateEditor, { cellIndices, colSizes, element, rowSize }: {
            element: platejs.TTableCellElement;
            cellIndices?: _platejs_table.CellIndices;
            colSizes?: number[];
            rowSize?: number;
        }) => {
            minHeight: number | undefined;
            width: number;
        }>;
        getColSpan: (cellElem: platejs.TTableCellElement) => number;
        getRowSpan: (cellElem: platejs.TTableCellElement) => number;
        getCellChildren: (cell: platejs.TTableCellElement) => platejs.Descendant[];
    };
}, {
    insert: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, header, rowCount }?: _platejs_table.GetEmptyTableNodeOptions, { select: shouldSelect, ...options }?: platejs.InsertNodesOptions) => void>;
        tableColumn: platejs.OmitFirst<(editor: platejs.SlateEditor, options?: {
            at?: platejs.Path;
            before?: boolean;
            fromCell?: platejs.Path;
            header?: boolean;
            select?: boolean;
        }) => void>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor, options?: {
            at?: platejs.Path;
            before?: boolean;
            fromRow?: platejs.Path;
            header?: boolean;
            select?: boolean;
        }) => void>;
    };
    remove: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        tableColumn: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
    };
    table: {
        merge: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        split: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
    };
}, {
    cellIndices?: (id: string) => _platejs_table.CellIndices;
}>> | platejs.SlatePlugin<platejs.PluginConfig<"tr", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"td", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"th", {}, {}, {}, {}>>)[];

declare const BaseToggleKit: platejs.SlatePlugin<platejs.PluginConfig<"toggle", {
    openIds?: Set<string>;
}, {
    toggle: {
        toggleIds: (ids: string[], force?: boolean | null) => void;
    };
} & Record<"toggle", {
    toggleIds: (ids: string[], force?: boolean | null) => void;
}>, {}, {
    isOpen?: (toggleId: string) => boolean;
    someClosed?: (toggleIds: string[]) => boolean;
}>>[];

declare const BaseTocKit: platejs.SlatePlugin<_platejs_toc.TocConfig>[];

declare const BaseMediaKit: (platejs.SlatePlugin<platejs.PluginConfig<"img", {
    disableEmbedInsert?: boolean;
    disableUploadInsert?: boolean;
    uploadImage?: (dataUrl: ArrayBuffer | string) => ArrayBuffer | Promise<ArrayBuffer | string> | string;
} & _platejs_media.MediaPluginOptions, {}, {
    insert: {
        imageFromFiles: (files: FileList, options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"video", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"audio", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"file", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"caption", {
    focusEndPath: platejs.Path | null;
    focusStartPath: platejs.Path | null;
    query: {
        allow: string[];
    };
    visibleId: string | null;
}, {}, {}, {
    isVisible?: (elementId: string) => boolean;
}>> | platejs.SlatePlugin<_platejs_media.MediaEmbedConfig> | platejs.SlatePlugin<platejs.PluginConfig<"placeholder", _platejs_media.MediaPlaceholderOptions, {}, {
    insert: {
        audioPlaceholder: (options?: platejs.InsertNodesOptions | undefined) => void;
        filePlaceholder: (options?: platejs.InsertNodesOptions | undefined) => void;
        imagePlaceholder: (options?: platejs.InsertNodesOptions | undefined) => void;
        videoPlaceholder: (options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>>)[];

declare const BaseCalloutKit: platejs.SlatePlugin<platejs.PluginConfig<"callout", {}, {}, {
    insert: {
        callout: (args_0?: ({
            batchDirty?: boolean;
            hanging?: boolean;
            nextBlock?: boolean;
            removeEmpty?: platejs.QueryNodeOptions | boolean;
            select?: boolean;
        } & {
            id?: boolean | string;
            block?: boolean;
            empty?: boolean;
            match?: platejs.Predicate<platejs.NodeIn<platejs.Value>> | undefined;
            text?: boolean;
        } & platejs.QueryAt & platejs.QueryMode & platejs.QueryVoids & {
            icon?: string;
            variant?: (string & {}) | platejs.TCalloutElement["variant"];
        }) | undefined) => void;
    };
}, {}>>[];

declare const BaseColumnKit: (platejs.SlatePlugin<platejs.PluginConfig<"column_group", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"column", {}, {}, {}, {}>>)[];

declare const BaseMathKit: (platejs.SlatePlugin<platejs.PluginConfig<"inline_equation", {}, {}, {
    insert: {
        inlineEquation: (texExpression?: string | undefined, options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"equation", {}, {}, {
    insert: {
        equation: (options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>>)[];

declare const BaseDateKit: platejs.SlatePlugin<platejs.PluginConfig<"date", {}, {}, {
    insert: {
        date: (args_0?: ({
            date?: string;
        } & {
            batchDirty?: boolean;
            hanging?: boolean;
            nextBlock?: boolean;
            removeEmpty?: platejs.QueryNodeOptions | boolean;
            select?: boolean;
        } & {
            id?: boolean | string;
            block?: boolean;
            empty?: boolean;
            match?: platejs.Predicate<platejs.NodeIn<platejs.Value>> | undefined;
            text?: boolean;
        } & platejs.QueryAt & platejs.QueryMode & platejs.QueryVoids) | undefined) => void;
    };
}, {}>>[];

declare const BaseLinkKit: platejs.SlatePlugin<_platejs_link.BaseLinkConfig>[];

declare const BaseMentionKit: platejs.SlatePlugin<platejs.PluginConfig<"mention", {
    insertSpaceAfterMention?: boolean;
} & _platejs_combobox.TriggerComboboxPluginOptions, {}, {
    insert: {
        mention: (options: {
            search: string;
            value: any;
            key?: any;
        }) => void;
    };
}, {}>>[];

declare const BaseFontKit: (platejs.SlatePlugin<platejs.PluginConfig<"color", {}, {}, Record<"color", {
    addMark: (value: string) => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"backgroundColor", {}, {}, Record<"backgroundColor", {
    addMark: (value: string) => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"fontSize", {}, {}, Record<"fontSize", {
    addMark: (value: string) => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"fontFamily", {}, {}, Record<"fontFamily", {
    addMark: (value: string) => void;
}>, {}>>)[];

declare const BaseListKit: (platejs.SlatePlugin<_platejs_indent.IndentConfig> | platejs.SlatePlugin<_platejs_list.BaseListConfig>)[];

declare const BaseAlignKit: platejs.SlatePlugin<platejs.PluginConfig<"textAlign", {}, {}, Record<"textAlign", {
    setNodes: (value: _platejs_basic_styles.Alignment, setNodesOptions?: platejs.SetNodesOptions | undefined) => void;
}>, {}>>[];

declare const BaseLineHeightKit: platejs.SlatePlugin<platejs.PluginConfig<"lineHeight", {}, {}, Record<"lineHeight", {
    setNodes: (value: number, setNodesOptions?: platejs.SetNodesOptions | undefined) => void;
}>, {}>>[];

declare const BaseIndentKit: platejs.SlatePlugin<_platejs_indent.IndentConfig>[];

declare const BaseCommentKit: platejs.SlatePlugin<platejs.PluginConfig<"comment", {}, {
    comment: {
        has: (options: {
            id: string;
        }) => boolean;
        node: (options?: platejs.EditorNodesOptions & {
            id?: string;
            isDraft?: boolean;
        }) => platejs.NodeEntry<platejs.TCommentText> | undefined;
        nodeId: (leaf: platejs.TCommentText) => string | undefined;
        nodes: (options?: platejs.EditorNodesOptions & {
            id?: string;
            isDraft?: boolean;
            transient?: boolean;
        }) => platejs.NodeEntry<platejs.TCommentText>[];
    };
} & Record<"comment", {
    has: (options: {
        id: string;
    }) => boolean;
    node: (options?: platejs.EditorNodesOptions & {
        id?: string;
        isDraft?: boolean;
    }) => platejs.NodeEntry<platejs.TCommentText> | undefined;
    nodeId: (leaf: platejs.TCommentText) => string | undefined;
    nodes: (options?: platejs.EditorNodesOptions & {
        id?: string;
        isDraft?: boolean;
        transient?: boolean;
    }) => platejs.NodeEntry<platejs.TCommentText>[];
}>, {
    comment: {
        removeMark: () => void;
        setDraft: (options?: platejs.SetNodesOptions) => void;
        unsetMark: (options: {
            id?: string;
            transient?: boolean;
        }) => void;
    };
} & Record<"comment", {
    removeMark: () => void;
    setDraft: (options?: platejs.SetNodesOptions) => void;
    unsetMark: (options: {
        id?: string;
        transient?: boolean;
    }) => void;
}>, {}>>[];

declare const BaseSuggestionKit: platejs.SlatePlugin<platejs.PluginConfig<"suggestion", {
    currentUserId: string | null;
    isSuggesting: boolean;
}, {
    suggestion: {
        dataList: (node: platejs.TSuggestionText) => platejs.TInlineSuggestionData[];
        isBlockSuggestion: (node: platejs.TNode) => node is platejs.TSuggestionElement;
        node: (options?: platejs.EditorNodesOptions & {
            id?: string;
            isText?: boolean;
        }) => platejs.NodeEntry<platejs.TSuggestionElement | platejs.TSuggestionText> | undefined;
        nodeId: (node: platejs.TElement | platejs.TSuggestionText) => string | undefined;
        nodes: (options?: platejs.EditorNodesOptions & {
            transient?: boolean;
        }) => platejs.NodeEntry<platejs.TElement | platejs.TSuggestionText>[];
        suggestionData: (node: platejs.TElement | platejs.TSuggestionText) => platejs.TInlineSuggestionData | platejs.TSuggestionElement["suggestion"] | undefined;
        withoutSuggestions: (fn: () => void) => void;
    };
} & Record<"suggestion", {
    dataList: (node: platejs.TSuggestionText) => platejs.TInlineSuggestionData[];
    isBlockSuggestion: (node: platejs.TNode) => node is platejs.TSuggestionElement;
    node: (options?: platejs.EditorNodesOptions & {
        id?: string;
        isText?: boolean;
    }) => platejs.NodeEntry<platejs.TSuggestionElement | platejs.TSuggestionText> | undefined;
    nodeId: (node: platejs.TElement | platejs.TSuggestionText) => string | undefined;
    nodes: (options?: platejs.EditorNodesOptions & {
        transient?: boolean;
    }) => platejs.NodeEntry<platejs.TElement | platejs.TSuggestionText>[];
    suggestionData: (node: platejs.TElement | platejs.TSuggestionText) => platejs.TInlineSuggestionData | platejs.TSuggestionElement["suggestion"] | undefined;
    withoutSuggestions: (fn: () => void) => void;
}>, {}, {}>>[];

declare const BaseEditorKit: (platejs.SlatePlugin<platejs.PluginConfig<"p", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"comment", {}, {
    comment: {
        has: (options: {
            id: string;
        }) => boolean;
        node: (options?: platejs.EditorNodesOptions & {
            id?: string;
            isDraft?: boolean;
        }) => platejs.NodeEntry<platejs.TCommentText> | undefined;
        nodeId: (leaf: platejs.TCommentText) => string | undefined;
        nodes: (options?: platejs.EditorNodesOptions & {
            id?: string;
            isDraft?: boolean;
            transient?: boolean;
        }) => platejs.NodeEntry<platejs.TCommentText>[];
    };
} & Record<"comment", {
    has: (options: {
        id: string;
    }) => boolean;
    node: (options?: platejs.EditorNodesOptions & {
        id?: string;
        isDraft?: boolean;
    }) => platejs.NodeEntry<platejs.TCommentText> | undefined;
    nodeId: (leaf: platejs.TCommentText) => string | undefined;
    nodes: (options?: platejs.EditorNodesOptions & {
        id?: string;
        isDraft?: boolean;
        transient?: boolean;
    }) => platejs.NodeEntry<platejs.TCommentText>[];
}>, {
    comment: {
        removeMark: () => void;
        setDraft: (options?: platejs.SetNodesOptions) => void;
        unsetMark: (options: {
            id?: string;
            transient?: boolean;
        }) => void;
    };
} & Record<"comment", {
    removeMark: () => void;
    setDraft: (options?: platejs.SetNodesOptions) => void;
    unsetMark: (options: {
        id?: string;
        transient?: boolean;
    }) => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"markdown", {
    allowedNodes: _platejs_markdown.PlateType[] | null;
    disallowedNodes: _platejs_markdown.PlateType[] | null;
    remarkPlugins: unified.Plugin[];
    remarkStringifyOptions: remark_stringify.Options | null;
    rules: _platejs_markdown.MdRules | null;
    allowNode?: _platejs_markdown.AllowNodeConfig;
    plainMarks?: _platejs_markdown.PlateType[] | null;
}, {
    markdown: {
        deserialize: platejs.OmitFirst<(editor: platejs.SlateEditor, data: string, options?: Omit<_platejs_markdown.DeserializeMdOptions, "editor">) => platejs.Value>;
        deserializeInline: platejs.OmitFirst<(editor: platejs.SlateEditor, text: string, options?: _platejs_markdown.DeserializeMdOptions) => platejs.Descendant[]>;
        serialize: platejs.OmitFirst<(editor: platejs.SlateEditor, options?: Omit<_platejs_markdown.SerializeMdOptions, "editor">) => string>;
    };
} & Record<"markdown", {
    deserialize: (data: string, options?: Omit<_platejs_markdown.DeserializeMdOptions, "editor"> | undefined) => platejs.Value;
    deserializeInline: (text: string, options?: _platejs_markdown.DeserializeMdOptions | undefined) => platejs.Descendant[];
    serialize: (options?: Omit<_platejs_markdown.SerializeMdOptions, "editor"> | undefined) => string;
}>, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"suggestion", {
    currentUserId: string | null;
    isSuggesting: boolean;
}, {
    suggestion: {
        dataList: (node: platejs.TSuggestionText) => platejs.TInlineSuggestionData[];
        isBlockSuggestion: (node: platejs.TNode) => node is platejs.TSuggestionElement;
        node: (options?: platejs.EditorNodesOptions & {
            id?: string;
            isText?: boolean;
        }) => platejs.NodeEntry<platejs.TSuggestionElement | platejs.TSuggestionText> | undefined;
        nodeId: (node: platejs.TElement | platejs.TSuggestionText) => string | undefined;
        nodes: (options?: platejs.EditorNodesOptions & {
            transient?: boolean;
        }) => platejs.NodeEntry<platejs.TElement | platejs.TSuggestionText>[];
        suggestionData: (node: platejs.TElement | platejs.TSuggestionText) => platejs.TInlineSuggestionData | platejs.TSuggestionElement["suggestion"] | undefined;
        withoutSuggestions: (fn: () => void) => void;
    };
} & Record<"suggestion", {
    dataList: (node: platejs.TSuggestionText) => platejs.TInlineSuggestionData[];
    isBlockSuggestion: (node: platejs.TNode) => node is platejs.TSuggestionElement;
    node: (options?: platejs.EditorNodesOptions & {
        id?: string;
        isText?: boolean;
    }) => platejs.NodeEntry<platejs.TSuggestionElement | platejs.TSuggestionText> | undefined;
    nodeId: (node: platejs.TElement | platejs.TSuggestionText) => string | undefined;
    nodes: (options?: platejs.EditorNodesOptions & {
        transient?: boolean;
    }) => platejs.NodeEntry<platejs.TElement | platejs.TSuggestionText>[];
    suggestionData: (node: platejs.TElement | platejs.TSuggestionText) => platejs.TInlineSuggestionData | platejs.TSuggestionElement["suggestion"] | undefined;
    withoutSuggestions: (fn: () => void) => void;
}>, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"textAlign", {}, {}, Record<"textAlign", {
    setNodes: (value: _platejs_basic_styles.Alignment, setNodesOptions?: platejs.SetNodesOptions | undefined) => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<any, {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<any, {}, {}, Record<any, {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"blockquote", {}, {}, Record<"blockquote", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"hr", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"bold", {}, {}, Record<"bold", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"italic", {}, {}, Record<"italic", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"underline", {}, {}, Record<"underline", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"code", {}, {}, Record<"code", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"strikethrough", {}, {}, Record<"strikethrough", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"subscript", {}, {}, Record<"subscript", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"superscript", {}, {}, Record<"superscript", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"highlight", {}, {}, Record<"highlight", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"kbd", {}, {}, Record<"kbd", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"callout", {}, {}, {
    insert: {
        callout: (args_0?: ({
            batchDirty?: boolean;
            hanging?: boolean;
            nextBlock?: boolean;
            removeEmpty?: platejs.QueryNodeOptions | boolean;
            select?: boolean;
        } & {
            id?: boolean | string;
            block?: boolean;
            empty?: boolean;
            match?: platejs.Predicate<platejs.NodeIn<platejs.Value>> | undefined;
            text?: boolean;
        } & platejs.QueryAt & platejs.QueryMode & platejs.QueryVoids & {
            icon?: string;
            variant?: (string & {}) | platejs.TCalloutElement["variant"];
        }) | undefined) => void;
    };
}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"code_block", {
    defaultLanguage?: string | null;
    lowlight?: ReturnType<typeof lowlight.createLowlight> | null;
}, {}, Record<"code_block", {
    toggle: () => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"code_syntax", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"column_group", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"column", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"date", {}, {}, {
    insert: {
        date: (args_0?: ({
            date?: string;
        } & {
            batchDirty?: boolean;
            hanging?: boolean;
            nextBlock?: boolean;
            removeEmpty?: platejs.QueryNodeOptions | boolean;
            select?: boolean;
        } & {
            id?: boolean | string;
            block?: boolean;
            empty?: boolean;
            match?: platejs.Predicate<platejs.NodeIn<platejs.Value>> | undefined;
            text?: boolean;
        } & platejs.QueryAt & platejs.QueryMode & platejs.QueryVoids) | undefined) => void;
    };
}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"color", {}, {}, Record<"color", {
    addMark: (value: string) => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"backgroundColor", {}, {}, Record<"backgroundColor", {
    addMark: (value: string) => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"fontSize", {}, {}, Record<"fontSize", {
    addMark: (value: string) => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"fontFamily", {}, {}, Record<"fontFamily", {
    addMark: (value: string) => void;
}>, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"lineHeight", {}, {}, Record<"lineHeight", {
    setNodes: (value: number, setNodesOptions?: platejs.SetNodesOptions | undefined) => void;
}>, {}>> | platejs.SlatePlugin<_platejs_link.BaseLinkConfig> | platejs.SlatePlugin<_platejs_indent.IndentConfig> | platejs.SlatePlugin<_platejs_list.BaseListConfig> | platejs.SlatePlugin<platejs.PluginConfig<"inline_equation", {}, {}, {
    insert: {
        inlineEquation: (texExpression?: string | undefined, options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"equation", {}, {}, {
    insert: {
        equation: (options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"img", {
    disableEmbedInsert?: boolean;
    disableUploadInsert?: boolean;
    uploadImage?: (dataUrl: ArrayBuffer | string) => ArrayBuffer | Promise<ArrayBuffer | string> | string;
} & _platejs_media.MediaPluginOptions, {}, {
    insert: {
        imageFromFiles: (files: FileList, options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"video", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"audio", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"file", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"caption", {
    focusEndPath: platejs.Path | null;
    focusStartPath: platejs.Path | null;
    query: {
        allow: string[];
    };
    visibleId: string | null;
}, {}, {}, {
    isVisible?: (elementId: string) => boolean;
}>> | platejs.SlatePlugin<_platejs_media.MediaEmbedConfig> | platejs.SlatePlugin<platejs.PluginConfig<"placeholder", _platejs_media.MediaPlaceholderOptions, {}, {
    insert: {
        audioPlaceholder: (options?: platejs.InsertNodesOptions | undefined) => void;
        filePlaceholder: (options?: platejs.InsertNodesOptions | undefined) => void;
        imagePlaceholder: (options?: platejs.InsertNodesOptions | undefined) => void;
        videoPlaceholder: (options?: platejs.InsertNodesOptions | undefined) => void;
    };
}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"mention", {
    insertSpaceAfterMention?: boolean;
} & _platejs_combobox.TriggerComboboxPluginOptions, {}, {
    insert: {
        mention: (options: {
            search: string;
            value: any;
            key?: any;
        }) => void;
    };
}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"table", {
    _cellIndices: Record<string, {
        col: number;
        row: number;
    }>;
    selectedCells: platejs.TElement[] | null;
    selectedTables: platejs.TElement[] | null;
    disableExpandOnInsert?: boolean;
    disableMarginLeft?: boolean;
    disableMerge?: boolean;
    enableUnsetSingleColSize?: boolean;
    initialTableWidth?: number;
    minColumnWidth?: number;
}, {
    create: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, header, rowCount, ...cellOptions }?: _platejs_table.GetEmptyTableNodeOptions) => platejs.TTableElement>;
        tableCell: platejs.OmitFirst<(editor: platejs.SlateEditor, { children, header, row }?: _platejs_table.CreateCellOptions) => {
            children: platejs.Descendant[];
            type: string;
        }>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, ...cellOptions }?: _platejs_table.GetEmptyRowNodeOptions) => {
            children: {
                children: platejs.Descendant[];
                type: string;
            }[];
            type: string;
        }>;
    };
    table: {
        getCellBorders: platejs.OmitFirst<(editor: platejs.SlateEditor, { cellIndices, defaultBorder, element }: {
            element: platejs.TTableCellElement;
            cellIndices?: _platejs_table.CellIndices;
            defaultBorder?: platejs.TTableCellBorder;
        }) => _platejs_table.BorderStylesDefault>;
        getCellSize: platejs.OmitFirst<(editor: platejs.SlateEditor, { cellIndices, colSizes, element, rowSize }: {
            element: platejs.TTableCellElement;
            cellIndices?: _platejs_table.CellIndices;
            colSizes?: number[];
            rowSize?: number;
        }) => {
            minHeight: number | undefined;
            width: number;
        }>;
        getColSpan: (cellElem: platejs.TTableCellElement) => number;
        getRowSpan: (cellElem: platejs.TTableCellElement) => number;
        getCellChildren: (cell: platejs.TTableCellElement) => platejs.Descendant[];
    };
}, {
    insert: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor, { colCount, header, rowCount }?: _platejs_table.GetEmptyTableNodeOptions, { select: shouldSelect, ...options }?: platejs.InsertNodesOptions) => void>;
        tableColumn: platejs.OmitFirst<(editor: platejs.SlateEditor, options?: {
            at?: platejs.Path;
            before?: boolean;
            fromCell?: platejs.Path;
            header?: boolean;
            select?: boolean;
        }) => void>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor, options?: {
            at?: platejs.Path;
            before?: boolean;
            fromRow?: platejs.Path;
            header?: boolean;
            select?: boolean;
        }) => void>;
    };
    remove: {
        table: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        tableColumn: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        tableRow: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
    };
    table: {
        merge: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
        split: platejs.OmitFirst<(editor: platejs.SlateEditor) => void>;
    };
}, {
    cellIndices?: (id: string) => _platejs_table.CellIndices;
}>> | platejs.SlatePlugin<platejs.PluginConfig<"tr", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"td", {}, {}, {}, {}>> | platejs.SlatePlugin<platejs.PluginConfig<"th", {}, {}, {}, {}>> | platejs.SlatePlugin<_platejs_toc.TocConfig> | platejs.SlatePlugin<platejs.PluginConfig<"toggle", {
    openIds?: Set<string>;
}, {
    toggle: {
        toggleIds: (ids: string[], force?: boolean | null) => void;
    };
} & Record<"toggle", {
    toggleIds: (ids: string[], force?: boolean | null) => void;
}>, {}, {
    isOpen?: (toggleId: string) => boolean;
    someClosed?: (toggleIds: string[]) => boolean;
}>>)[];

export { AlignKit, AutoformatKit, BaseAlignKit, BaseBasicBlocksKit, BaseBasicMarksKit, BaseCalloutKit, BaseCodeBlockKit, BaseColumnKit, BaseCommentKit, BaseDateKit, BaseEditorKit, BaseFontKit, BaseIndentKit, BaseLineHeightKit, BaseLinkKit, BaseListKit, BaseMathKit, BaseMediaKit, BaseMentionKit, BaseSuggestionKit, BaseTableKit, BaseTocKit, BaseToggleKit, BasicBlocksKit, BasicMarksKit, BasicNodesKit, BlockMenuKit, BlockPlaceholderKit, BlockSelectionKit, CalloutKit, CodeBlockKit, ColumnKit, CommentKit, CopilotKit, CursorOverlayKit, DateKit, DndKit, DocxKit, EmojiKit, ExitBreakKit, FixedToolbarKit, FloatingToolbarKit, FontKit, IndentKit, LineHeightKit, LinkKit, ListKit, MarkdownKit, MathKit, MediaKit, MentionKit, SlashKit, SuggestionKit, TableKit, TocKit, ToggleKit };
