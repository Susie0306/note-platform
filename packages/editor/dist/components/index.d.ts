export { E as Editor, a as EditorContainer, c as EditorProps, b as EditorView } from '../editor-Fcqlu_uZ.js';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as class_variance_authority_types from 'class-variance-authority/types';
import * as React$1 from 'react';
import React__default from 'react';
import * as ToolbarPrimitive from '@radix-ui/react-toolbar';
import * as TooltipPrimitive from '@radix-ui/react-tooltip';
import { VariantProps } from 'class-variance-authority';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';
import { DropdownMenuProps } from '@radix-ui/react-dropdown-menu';
import { FloatingToolbarState } from '@platejs/floating';
import { PlateElementProps, PlateLeafProps, PlateElement, RenderNodeWrapper } from 'platejs/react';
import { TCodeBlockElement, TCodeSyntaxLeaf, TTableElement, TTableRowElement, TTableCellElement, TImageElement, TVideoElement, TResizableProps, TAudioElement, TFileElement, TMediaEmbedElement, TPlaceholderElement, TColumnElement, TDateElement, TLinkElement, TMentionElement, TComboboxInputElement, TEquationElement, TCommentText, TSuggestionText, TElement, NodeEntry, Path, AnyPluginConfig, WithRequiredKey } from 'platejs';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import * as PopoverPrimitive from '@radix-ui/react-popover';
import * as SeparatorPrimitive from '@radix-ui/react-separator';
import * as CheckboxPrimitive from '@radix-ui/react-checkbox';
import { Command as Command$1 } from 'cmdk';
import * as ContextMenuPrimitive from '@radix-ui/react-context-menu';
import { EmojiDropdownMenuOptions } from '@platejs/emoji/react';
import { Caption as Caption$1, CaptionTextarea as CaptionTextarea$1 } from '@platejs/caption/react';
import { ResizeHandle as ResizeHandle$1 } from '@platejs/resizable';
import { ComboboxPopover, ComboboxItemProps } from '@ariakit/react';
import { TResolvedSuggestion } from '@platejs/suggestion';
import { a as TComment, T as TDiscussion } from '../discussion-kit-LEJ4Df1C.js';
export { C as Comment, b as CommentCreateForm, f as formatCommentDate } from '../discussion-kit-LEJ4Df1C.js';
import { LinkFloatingToolbarState } from '@platejs/link/react';
import { DayPicker } from 'react-day-picker';

declare function DropdownMenu({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuPortal({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Portal>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuTrigger({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuContent({ className, sideOffset, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Content>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuGroup({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Group>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuItem({ className, inset, variant, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
}): react_jsx_runtime.JSX.Element;
declare function DropdownMenuCheckboxItem({ className, children, checked, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuRadioGroup({ ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>): react_jsx_runtime.JSX.Element;
declare function DropdownMenuSeparator({ className, ...props }: React$1.ComponentProps<typeof DropdownMenuPrimitive.Separator>): react_jsx_runtime.JSX.Element;

declare function TooltipProvider({ delayDuration, ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Provider>): react_jsx_runtime.JSX.Element;
declare function Tooltip({ ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function TooltipTrigger({ ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function TooltipContent$1({ className, sideOffset, children, ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Content>): react_jsx_runtime.JSX.Element;

declare function Toolbar({ className, ...props }: React$1.ComponentProps<typeof ToolbarPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function ToolbarSeparator({ className, ...props }: React$1.ComponentProps<typeof ToolbarPrimitive.Separator>): react_jsx_runtime.JSX.Element;
declare const toolbarButtonVariants: (props?: ({
    size?: "default" | "sm" | "lg" | null | undefined;
    variant?: "default" | "outline" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type ToolbarButtonProps = {
    isDropdown?: boolean;
    pressed?: boolean;
} & Omit<React$1.ComponentPropsWithoutRef<typeof ToolbarToggleItem>, 'asChild' | 'value'> & VariantProps<typeof toolbarButtonVariants>;
declare const ToolbarButton: ({ tooltip, tooltipContentProps, tooltipProps, tooltipTriggerProps, ...props }: TooltipProps<({ children, className, isDropdown, pressed, size, variant, ...props }: ToolbarButtonProps) => react_jsx_runtime.JSX.Element>) => react_jsx_runtime.JSX.Element;
declare function ToolbarToggleItem({ className, size, variant, ...props }: React$1.ComponentProps<typeof ToolbarPrimitive.ToggleItem> & VariantProps<typeof toolbarButtonVariants>): react_jsx_runtime.JSX.Element;
declare function ToolbarGroup({ children, className, }: React$1.ComponentProps<'div'>): react_jsx_runtime.JSX.Element;
type TooltipProps<T extends React$1.ElementType> = {
    tooltip?: React$1.ReactNode;
    tooltipContentProps?: Omit<React$1.ComponentPropsWithoutRef<typeof TooltipContent>, 'children'>;
    tooltipProps?: Omit<React$1.ComponentPropsWithoutRef<typeof Tooltip>, 'children'>;
    tooltipTriggerProps?: React$1.ComponentPropsWithoutRef<typeof TooltipTrigger>;
} & React$1.ComponentProps<T>;
declare function TooltipContent({ children, className, sideOffset, ...props }: React$1.ComponentProps<typeof TooltipPrimitive.Content>): react_jsx_runtime.JSX.Element;
declare function ToolbarMenuGroup({ children, className, label, ...props }: React$1.ComponentProps<typeof DropdownMenuRadioGroup> & {
    label?: string;
}): react_jsx_runtime.JSX.Element;

declare function FixedToolbar(props: React.ComponentProps<typeof Toolbar>): react_jsx_runtime.JSX.Element;

declare function FixedToolbarButtons(): react_jsx_runtime.JSX.Element;

declare function FloatingToolbar({ children, className, state, ...props }: React$1.ComponentProps<typeof Toolbar> & {
    state?: FloatingToolbarState;
}): react_jsx_runtime.JSX.Element | null;

declare function FloatingToolbarButtons(): react_jsx_runtime.JSX.Element;

declare function ParagraphElement(props: PlateElementProps): react_jsx_runtime.JSX.Element;

declare function H1Element(props: PlateElementProps): react_jsx_runtime.JSX.Element;
declare function H2Element(props: PlateElementProps): react_jsx_runtime.JSX.Element;
declare function H3Element(props: PlateElementProps): react_jsx_runtime.JSX.Element;
declare function H4Element(props: PlateElementProps): react_jsx_runtime.JSX.Element;
declare function H5Element(props: PlateElementProps): react_jsx_runtime.JSX.Element;
declare function H6Element(props: PlateElementProps): react_jsx_runtime.JSX.Element;

declare function BlockquoteElement(props: PlateElementProps): react_jsx_runtime.JSX.Element;

declare function HrElement(props: PlateElementProps): react_jsx_runtime.JSX.Element;

declare function CodeBlockElement(props: PlateElementProps<TCodeBlockElement>): react_jsx_runtime.JSX.Element;
declare function CodeLineElement(props: PlateElementProps): react_jsx_runtime.JSX.Element;
declare function CodeSyntaxLeaf(props: PlateLeafProps<TCodeSyntaxLeaf>): react_jsx_runtime.JSX.Element;

declare function CodeLeaf(props: PlateLeafProps): react_jsx_runtime.JSX.Element;

declare const TableElement: React$1.ForwardRefExoticComponent<Omit<PlateElementProps<TTableElement>, "ref"> & React$1.RefAttributes<unknown>>;
declare function TableRowElement({ children, ...props }: PlateElementProps<TTableRowElement>): react_jsx_runtime.JSX.Element;
declare function TableCellElement({ isHeader, ...props }: PlateElementProps<TTableCellElement> & {
    isHeader?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function TableCellHeaderElement(props: React$1.ComponentProps<typeof TableCellElement>): react_jsx_runtime.JSX.Element;

declare const ImageElement: React$1.ForwardRefExoticComponent<Omit<PlateElementProps<TImageElement>, "ref"> & React$1.RefAttributes<unknown>>;

declare const VideoElement: React$1.ForwardRefExoticComponent<Omit<PlateElementProps<TVideoElement & TResizableProps>, "ref"> & React$1.RefAttributes<unknown>>;

declare const AudioElement: React$1.ForwardRefExoticComponent<Omit<PlateElementProps<TAudioElement>, "ref"> & React$1.RefAttributes<unknown>>;

declare const FileElement: React$1.ForwardRefExoticComponent<Omit<PlateElementProps<TFileElement>, "ref"> & React$1.RefAttributes<unknown>>;

declare const MediaEmbedElement: React$1.ForwardRefExoticComponent<Omit<PlateElementProps<TMediaEmbedElement>, "ref"> & React$1.RefAttributes<unknown>>;

declare const PlaceholderElement: React$1.ForwardRefExoticComponent<Omit<PlateElementProps<TPlaceholderElement>, "ref"> & React$1.RefAttributes<unknown>>;

declare function CalloutElement({ attributes, children, className, ...props }: React$1.ComponentProps<typeof PlateElement>): react_jsx_runtime.JSX.Element;

declare const ColumnElement: React$1.ForwardRefExoticComponent<Omit<PlateElementProps<TColumnElement>, "ref"> & React$1.RefAttributes<unknown>>;
declare function ColumnGroupElement(props: PlateElementProps): react_jsx_runtime.JSX.Element;

declare function ToggleElement(props: PlateElementProps): react_jsx_runtime.JSX.Element;

declare function DateElement(props: PlateElementProps<TDateElement>): react_jsx_runtime.JSX.Element;

declare function LinkElement(props: PlateElementProps<TLinkElement>): react_jsx_runtime.JSX.Element;

declare function MentionElement(props: PlateElementProps<TMentionElement> & {
    prefix?: string;
}): react_jsx_runtime.JSX.Element;
declare function MentionInputElement(props: PlateElementProps<TComboboxInputElement>): react_jsx_runtime.JSX.Element;

declare function TocElement(props: PlateElementProps): react_jsx_runtime.JSX.Element;

declare function EquationElement(props: PlateElementProps<TEquationElement>): react_jsx_runtime.JSX.Element;
declare function InlineEquationElement(props: PlateElementProps<TEquationElement>): react_jsx_runtime.JSX.Element;

declare function HighlightLeaf(props: PlateLeafProps): react_jsx_runtime.JSX.Element;

declare function KbdLeaf(props: PlateLeafProps): react_jsx_runtime.JSX.Element;

declare function CommentLeaf(props: PlateLeafProps<TCommentText>): react_jsx_runtime.JSX.Element;

declare function SuggestionLeaf(props: PlateLeafProps<TSuggestionText>): react_jsx_runtime.JSX.Element;

declare const buttonVariants: (props?: ({
    variant?: "default" | "link" | "outline" | "destructive" | "secondary" | "ghost" | null | undefined;
    size?: "default" | "sm" | "lg" | "icon" | "icon-sm" | "icon-lg" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Button({ className, variant, size, asChild, ...props }: React$1.ComponentProps<"button"> & VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
}): react_jsx_runtime.JSX.Element;

declare function Dialog({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function DialogTrigger({ ...props }: React$1.ComponentProps<typeof DialogPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function DialogContent({ className, children, showCloseButton, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Content> & {
    showCloseButton?: boolean;
}): react_jsx_runtime.JSX.Element;
declare function DialogHeader({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function DialogFooter({ className, ...props }: React$1.ComponentProps<"div">): react_jsx_runtime.JSX.Element;
declare function DialogTitle({ className, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Title>): react_jsx_runtime.JSX.Element;
declare function DialogDescription({ className, ...props }: React$1.ComponentProps<typeof DialogPrimitive.Description>): react_jsx_runtime.JSX.Element;

declare function Popover({ ...props }: React$1.ComponentProps<typeof PopoverPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function PopoverTrigger({ ...props }: React$1.ComponentProps<typeof PopoverPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function PopoverContent({ className, align, sideOffset, ...props }: React$1.ComponentProps<typeof PopoverPrimitive.Content>): react_jsx_runtime.JSX.Element;

declare function Separator({ className, orientation, decorative, ...props }: React$1.ComponentProps<typeof SeparatorPrimitive.Root>): react_jsx_runtime.JSX.Element;

declare function Input({ className, type, ...props }: React$1.ComponentProps<"input">): react_jsx_runtime.JSX.Element;

declare function Textarea({ className, ...props }: React$1.ComponentProps<"textarea">): react_jsx_runtime.JSX.Element;

declare function Checkbox({ className, ...props }: React$1.ComponentProps<typeof CheckboxPrimitive.Root>): react_jsx_runtime.JSX.Element;

declare function Command({ className, ...props }: React$1.ComponentProps<typeof Command$1>): react_jsx_runtime.JSX.Element;
declare function CommandInput({ className, ...props }: React$1.ComponentProps<typeof Command$1.Input>): react_jsx_runtime.JSX.Element;
declare function CommandList({ className, ...props }: React$1.ComponentProps<typeof Command$1.List>): react_jsx_runtime.JSX.Element;
declare function CommandEmpty({ ...props }: React$1.ComponentProps<typeof Command$1.Empty>): react_jsx_runtime.JSX.Element;
declare function CommandGroup({ className, ...props }: React$1.ComponentProps<typeof Command$1.Group>): react_jsx_runtime.JSX.Element;
declare function CommandItem({ className, ...props }: React$1.ComponentProps<typeof Command$1.Item>): react_jsx_runtime.JSX.Element;

declare function ContextMenu({ ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Root>): react_jsx_runtime.JSX.Element;
declare function ContextMenuTrigger({ ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Trigger>): react_jsx_runtime.JSX.Element;
declare function ContextMenuContent({ className, ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Content>): react_jsx_runtime.JSX.Element;
declare function ContextMenuItem({ className, inset, variant, ...props }: React$1.ComponentProps<typeof ContextMenuPrimitive.Item> & {
    inset?: boolean;
    variant?: "default" | "destructive";
}): react_jsx_runtime.JSX.Element;

declare function MarkToolbarButton({ clear, nodeType, ...props }: React$1.ComponentProps<typeof ToolbarButton> & {
    nodeType: string;
    clear?: string[] | string;
}): react_jsx_runtime.JSX.Element;

interface BlockToolbarButtonProps {
    type: string;
    children: React__default.ReactNode;
    tooltip?: string;
}
declare function BlockToolbarButton({ type, children, tooltip }: BlockToolbarButtonProps): react_jsx_runtime.JSX.Element;

declare function AlignToolbarButton(props: DropdownMenuProps): react_jsx_runtime.JSX.Element;

declare function IndentToolbarButton(props: React$1.ComponentProps<typeof ToolbarButton>): react_jsx_runtime.JSX.Element;
declare function OutdentToolbarButton(props: React$1.ComponentProps<typeof ToolbarButton>): react_jsx_runtime.JSX.Element;

declare function LineHeightToolbarButton(props: DropdownMenuProps): react_jsx_runtime.JSX.Element;

declare function LinkToolbarButton(props: React$1.ComponentProps<typeof ToolbarButton>): react_jsx_runtime.JSX.Element;

declare function BulletedListToolbarButton(): react_jsx_runtime.JSX.Element;
declare function NumberedListToolbarButton(): react_jsx_runtime.JSX.Element;
declare function TodoListToolbarButton(props: React$1.ComponentProps<typeof ToolbarButton>): react_jsx_runtime.JSX.Element;

declare function MediaToolbarButton({ nodeType, ...props }: DropdownMenuProps & {
    nodeType: string;
}): react_jsx_runtime.JSX.Element;

declare function TableToolbarButton(props: DropdownMenuProps): react_jsx_runtime.JSX.Element;

declare function ToggleToolbarButton(props: React$1.ComponentProps<typeof ToolbarButton>): react_jsx_runtime.JSX.Element;

declare function TurnIntoToolbarButton(props: DropdownMenuProps): react_jsx_runtime.JSX.Element;

declare function MoreToolbarButton(props: DropdownMenuProps): react_jsx_runtime.JSX.Element;

declare function InsertToolbarButton(props: DropdownMenuProps): react_jsx_runtime.JSX.Element;

declare function RedoToolbarButton(props: React$1.ComponentProps<typeof ToolbarButton>): react_jsx_runtime.JSX.Element;
declare function UndoToolbarButton(props: React$1.ComponentProps<typeof ToolbarButton>): react_jsx_runtime.JSX.Element;

declare function ModeToolbarButton(props: DropdownMenuProps): react_jsx_runtime.JSX.Element;

declare function FontSizeToolbarButton(): react_jsx_runtime.JSX.Element;

declare function FontColorToolbarButton({ children, nodeType, tooltip, }: {
    nodeType: string;
    tooltip?: string;
} & DropdownMenuProps): react_jsx_runtime.JSX.Element;

declare function EmojiToolbarButton({ options, ...props }: {
    options?: EmojiDropdownMenuOptions;
} & React$1.ComponentPropsWithoutRef<typeof ToolbarButton>): react_jsx_runtime.JSX.Element;

declare function InlineEquationToolbarButton(props: React$1.ComponentProps<typeof ToolbarButton>): react_jsx_runtime.JSX.Element;

declare function CommentToolbarButton(): react_jsx_runtime.JSX.Element;

declare function SuggestionToolbarButton(): react_jsx_runtime.JSX.Element;

type AskAIFunction = (command: string, context: string) => Promise<string | null>;
interface AIToolbarButtonProps {
    /** Custom AI function. If not provided, uses the AIContext */
    askAI?: AskAIFunction;
}
declare function AIToolbarButton({ askAI: askAIProp }?: AIToolbarButtonProps): react_jsx_runtime.JSX.Element;

declare function ExportToolbarButton(props: DropdownMenuProps): react_jsx_runtime.JSX.Element;

declare function ImportToolbarButton(props: DropdownMenuProps): react_jsx_runtime.JSX.Element;

declare const captionVariants: (props?: ({
    align?: "center" | "left" | "right" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function Caption({ align, className, ...props }: React$1.ComponentProps<typeof Caption$1> & VariantProps<typeof captionVariants>): react_jsx_runtime.JSX.Element;
declare function CaptionTextarea(props: React$1.ComponentProps<typeof CaptionTextarea$1>): react_jsx_runtime.JSX.Element;

declare const resizeHandleVariants: (props?: ({
    direction?: "bottom" | "left" | "right" | "top" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function ResizeHandle({ className, options, ...props }: React$1.ComponentProps<typeof ResizeHandle$1> & VariantProps<typeof resizeHandleVariants>): react_jsx_runtime.JSX.Element | null;

type FilterFn = (item: {
    value: string;
    group?: string;
    keywords?: string[];
    label?: string;
}, search: string) => boolean;
type InlineComboboxProps = {
    children: React$1.ReactNode;
    element: TElement;
    trigger: string;
    filter?: FilterFn | false;
    hideWhenNoValue?: boolean;
    showTrigger?: boolean;
    value?: string;
    setValue?: (value: string) => void;
};
declare const InlineCombobox: ({ children, element, filter, hideWhenNoValue, setValue: setValueProp, showTrigger, trigger, value: valueProp, }: InlineComboboxProps) => react_jsx_runtime.JSX.Element;
declare const InlineComboboxInput: {
    ({ className, ref: propRef, ...props }: React$1.HTMLAttributes<HTMLInputElement> & {
        ref?: React$1.RefObject<HTMLInputElement | null>;
    }): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare const InlineComboboxContent: typeof ComboboxPopover;
declare const InlineComboboxItem: ({ className, focusEditor, group, keywords, label, onClick, ...props }: {
    focusEditor?: boolean;
    group?: string;
    keywords?: string[];
    label?: string;
} & ComboboxItemProps & Required<Pick<ComboboxItemProps, "value">>) => react_jsx_runtime.JSX.Element | null;

declare function GhostText(): react_jsx_runtime.JSX.Element | null;

declare function SlashInputElement(props: PlateElementProps<TComboboxInputElement>): react_jsx_runtime.JSX.Element;

declare function EmojiInputElement(props: PlateElementProps): react_jsx_runtime.JSX.Element;

declare function CursorOverlay(): react_jsx_runtime.JSX.Element;

declare const blockSelectionVariants: (props?: ({
    active?: boolean | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function BlockSelection(props: PlateElementProps): react_jsx_runtime.JSX.Element | null;

declare function BlockContextMenu({ children }: {
    children: React$1.ReactNode;
}): string | number | bigint | boolean | react_jsx_runtime.JSX.Element | Iterable<React$1.ReactNode> | Promise<string | number | bigint | boolean | React$1.ReactPortal | React$1.ReactElement<unknown, string | React$1.JSXElementConstructor<any>> | Iterable<React$1.ReactNode> | null | undefined> | null | undefined;

declare const BlockDraggable: RenderNodeWrapper;

interface ResolvedSuggestion extends TResolvedSuggestion {
    comments: TComment[];
}
declare function BlockSuggestionCard({ idx, isLast, suggestion, }: {
    idx: number;
    isLast: boolean;
    suggestion: ResolvedSuggestion;
}): react_jsx_runtime.JSX.Element;
declare const useResolveSuggestion: (suggestionNodes: NodeEntry<TElement | TSuggestionText>[], blockPath: Path) => ResolvedSuggestion[];
declare const isResolvedSuggestion: (suggestion: ResolvedSuggestion | TDiscussion) => suggestion is ResolvedSuggestion;

declare const BlockDiscussion: RenderNodeWrapper<AnyPluginConfig>;

declare function LinkFloatingToolbar({ state, }: {
    state?: LinkFloatingToolbarState;
}): react_jsx_runtime.JSX.Element | null;

declare function MediaToolbar({ children, plugin, }: {
    children: React$1.ReactNode;
    plugin: WithRequiredKey;
}): react_jsx_runtime.JSX.Element;

declare function MediaPreviewDialog(): react_jsx_runtime.JSX.Element;

declare function MediaUploadToast(): null;

interface DatePickerProps {
    date?: Date;
    setDate: (date?: Date) => void;
    placeholder?: string;
}
declare function DatePicker({ date, setDate, placeholder }: DatePickerProps): react_jsx_runtime.JSX.Element;

declare function Calendar({ className, classNames, showOutsideDays, captionLayout, buttonVariant, formatters, components, ...props }: React$1.ComponentProps<typeof DayPicker> & {
    buttonVariant?: React$1.ComponentProps<typeof Button>["variant"];
}): react_jsx_runtime.JSX.Element;

export { AIToolbarButton, AlignToolbarButton, AudioElement, BlockContextMenu, BlockDiscussion, BlockDraggable, BlockSelection, BlockSuggestionCard, BlockToolbarButton, BlockquoteElement, BulletedListToolbarButton, Button, Calendar, CalloutElement, Caption, CaptionTextarea, Checkbox, CodeBlockElement, CodeLeaf, CodeLineElement, CodeSyntaxLeaf, ColumnElement, ColumnGroupElement, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommentLeaf, CommentToolbarButton, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, CursorOverlay, DateElement, DatePicker, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger, EmojiInputElement, EmojiToolbarButton, EquationElement, ExportToolbarButton, FileElement, FixedToolbar, FixedToolbarButtons, FloatingToolbar, FloatingToolbarButtons, FontColorToolbarButton, FontSizeToolbarButton, GhostText, H1Element, H2Element, H3Element, H4Element, H5Element, H6Element, HighlightLeaf, HrElement, ImageElement, ImportToolbarButton, IndentToolbarButton, InlineCombobox, InlineComboboxContent, InlineComboboxInput, InlineComboboxItem, InlineEquationElement, InlineEquationToolbarButton, Input, InsertToolbarButton, KbdLeaf, LineHeightToolbarButton, LinkElement, LinkFloatingToolbar, LinkToolbarButton, MarkToolbarButton, MediaEmbedElement, MediaPreviewDialog, MediaToolbar, MediaToolbarButton, MediaUploadToast, MentionElement, MentionInputElement, ModeToolbarButton, MoreToolbarButton, NumberedListToolbarButton, OutdentToolbarButton, ParagraphElement, PlaceholderElement, Popover, PopoverContent, PopoverTrigger, RedoToolbarButton, ResizeHandle, type ResolvedSuggestion, Separator, SlashInputElement, SuggestionLeaf, SuggestionToolbarButton, TComment, TableCellElement, TableCellHeaderElement, TableElement, TableRowElement, TableToolbarButton, Textarea, TocElement, TodoListToolbarButton, ToggleElement, ToggleToolbarButton, Toolbar, ToolbarButton, ToolbarGroup, ToolbarMenuGroup, ToolbarSeparator, Tooltip, TooltipContent$1 as TooltipContent, TooltipProvider, TooltipTrigger, TurnIntoToolbarButton, UndoToolbarButton, VideoElement, blockSelectionVariants, buttonVariants, isResolvedSuggestion, useResolveSuggestion };
