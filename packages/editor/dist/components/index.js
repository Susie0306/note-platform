import { buildFormatLongFn, buildLocalizeFn, buildMatchFn, buildMatchPatternFn, insertBlock, insertInlineElement, cn, ToolbarButton, DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuRadioGroup, DropdownMenuRadioItem, ToolbarMenuGroup, DropdownMenuItem, Popover, PopoverTrigger, Button, format, PopoverContent, Calendar as Calendar$1, normalizeDates, startOfWeek } from '../chunk-VJEBNFCX.js';
export { AIToolbarButton, AudioElement, BlockContextMenu, BlockDiscussion, BlockDraggable, BlockSelection, BlockquoteElement, BulletedListToolbarButton, Button, Calendar, CalloutElement, Caption, CaptionTextarea, Checkbox, CodeBlockElement, CodeLeaf, CodeLineElement, CodeSyntaxLeaf, ColumnElement, ColumnGroupElement, Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, Comment, CommentLeaf, CommentToolbarButton, ContextMenu, ContextMenuContent, ContextMenuItem, ContextMenuTrigger, CursorOverlay, DateElement, Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger, DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger, Editor, EditorContainer, EditorView, EmojiToolbarButton, EquationElement, ExportToolbarButton, FileElement, FixedToolbar, FixedToolbarButtons, FloatingToolbar, FloatingToolbarButtons, FontColorToolbarButton, FontSizeToolbarButton, GhostText, H1Element, H2Element, H3Element, H4Element, H5Element, H6Element, HighlightLeaf, HrElement, ImageElement, ImportToolbarButton, InlineCombobox, InlineComboboxContent, InlineComboboxInput, InlineComboboxItem, InlineEquationElement, Input, KbdLeaf, LinkElement, LinkToolbarButton, MarkToolbarButton, MediaEmbedElement, MediaPreviewDialog, MediaToolbar, MediaToolbarButton, MediaUploadToast, MentionElement, MentionInputElement, ModeToolbarButton, MoreToolbarButton, NumberedListToolbarButton, ParagraphElement, PlaceholderElement, Popover, PopoverContent, PopoverTrigger, ResizeHandle, Separator, SlashInputElement, SuggestionLeaf, SuggestionToolbarButton, TableCellElement, TableCellHeaderElement, TableElement, TableRowElement, TableToolbarButton, TocElement, ToggleElement, ToggleToolbarButton, Toolbar, ToolbarButton, ToolbarGroup, ToolbarMenuGroup, ToolbarSeparator, Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, TurnIntoToolbarButton, VideoElement, blockSelectionVariants, buttonVariants } from '../chunk-VJEBNFCX.js';
import '../chunk-VGP27YFB.js';
import { jsx, jsxs } from 'react/jsx-runtime';
import { useEditorRef, useEditorPlugin, useSelectionFragmentProp } from 'platejs/react';
import { Transforms } from 'slate';
import * as React from 'react';
import { TextAlignPlugin, LineHeightPlugin } from '@platejs/basic-styles/react';
import { PilcrowIcon, Heading1Icon, Heading2Icon, Heading3Icon, TableIcon, FileCodeIcon, QuoteIcon, MinusIcon, ListIcon, ListOrderedIcon, SquareIcon, ChevronRightIcon, ImageIcon, FilmIcon, TableOfContentsIcon, Columns3Icon, RadicalIcon, PenToolIcon, Link2Icon, CalendarIcon, AlignLeftIcon, AlignCenterIcon, AlignRightIcon, AlignJustifyIcon, IndentIcon, OutdentIcon, WrapText, CheckIcon, PlusIcon, Calendar } from 'lucide-react';
import { useIndentButton, useOutdentButton } from '@platejs/indent/react';
import { DropdownMenuItemIndicator } from '@radix-ui/react-dropdown-menu';
import { KEYS } from 'platejs';

// ../../node_modules/date-fns/isSameWeek.js
function isSameWeek(laterDate, earlierDate, options) {
  const [laterDate_, earlierDate_] = normalizeDates(
    options?.in,
    laterDate,
    earlierDate
  );
  return +startOfWeek(laterDate_, options) === +startOfWeek(earlierDate_, options);
}

// ../../node_modules/date-fns/locale/zh-CN/_lib/formatDistance.js
var formatDistanceLocale = {
  lessThanXSeconds: {
    one: "\u4E0D\u5230 1 \u79D2",
    other: "\u4E0D\u5230 {{count}} \u79D2"
  },
  xSeconds: {
    one: "1 \u79D2",
    other: "{{count}} \u79D2"
  },
  halfAMinute: "\u534A\u5206\u949F",
  lessThanXMinutes: {
    one: "\u4E0D\u5230 1 \u5206\u949F",
    other: "\u4E0D\u5230 {{count}} \u5206\u949F"
  },
  xMinutes: {
    one: "1 \u5206\u949F",
    other: "{{count}} \u5206\u949F"
  },
  xHours: {
    one: "1 \u5C0F\u65F6",
    other: "{{count}} \u5C0F\u65F6"
  },
  aboutXHours: {
    one: "\u5927\u7EA6 1 \u5C0F\u65F6",
    other: "\u5927\u7EA6 {{count}} \u5C0F\u65F6"
  },
  xDays: {
    one: "1 \u5929",
    other: "{{count}} \u5929"
  },
  aboutXWeeks: {
    one: "\u5927\u7EA6 1 \u4E2A\u661F\u671F",
    other: "\u5927\u7EA6 {{count}} \u4E2A\u661F\u671F"
  },
  xWeeks: {
    one: "1 \u4E2A\u661F\u671F",
    other: "{{count}} \u4E2A\u661F\u671F"
  },
  aboutXMonths: {
    one: "\u5927\u7EA6 1 \u4E2A\u6708",
    other: "\u5927\u7EA6 {{count}} \u4E2A\u6708"
  },
  xMonths: {
    one: "1 \u4E2A\u6708",
    other: "{{count}} \u4E2A\u6708"
  },
  aboutXYears: {
    one: "\u5927\u7EA6 1 \u5E74",
    other: "\u5927\u7EA6 {{count}} \u5E74"
  },
  xYears: {
    one: "1 \u5E74",
    other: "{{count}} \u5E74"
  },
  overXYears: {
    one: "\u8D85\u8FC7 1 \u5E74",
    other: "\u8D85\u8FC7 {{count}} \u5E74"
  },
  almostXYears: {
    one: "\u5C06\u8FD1 1 \u5E74",
    other: "\u5C06\u8FD1 {{count}} \u5E74"
  }
};
var formatDistance = (token, count, options) => {
  let result;
  const tokenValue = formatDistanceLocale[token];
  if (typeof tokenValue === "string") {
    result = tokenValue;
  } else if (count === 1) {
    result = tokenValue.one;
  } else {
    result = tokenValue.other.replace("{{count}}", String(count));
  }
  if (options?.addSuffix) {
    if (options.comparison && options.comparison > 0) {
      return result + "\u5185";
    } else {
      return result + "\u524D";
    }
  }
  return result;
};

// ../../node_modules/date-fns/locale/zh-CN/_lib/formatLong.js
var dateFormats = {
  full: "y'\u5E74'M'\u6708'd'\u65E5' EEEE",
  long: "y'\u5E74'M'\u6708'd'\u65E5'",
  medium: "yyyy-MM-dd",
  short: "yy-MM-dd"
};
var timeFormats = {
  full: "zzzz a h:mm:ss",
  long: "z a h:mm:ss",
  medium: "a h:mm:ss",
  short: "a h:mm"
};
var dateTimeFormats = {
  full: "{{date}} {{time}}",
  long: "{{date}} {{time}}",
  medium: "{{date}} {{time}}",
  short: "{{date}} {{time}}"
};
var formatLong = {
  date: buildFormatLongFn({
    formats: dateFormats,
    defaultWidth: "full"
  }),
  time: buildFormatLongFn({
    formats: timeFormats,
    defaultWidth: "full"
  }),
  dateTime: buildFormatLongFn({
    formats: dateTimeFormats,
    defaultWidth: "full"
  })
};

// ../../node_modules/date-fns/locale/zh-CN/_lib/formatRelative.js
function checkWeek(date, baseDate, options) {
  const baseFormat = "eeee p";
  if (isSameWeek(date, baseDate, options)) {
    return baseFormat;
  } else if (date.getTime() > baseDate.getTime()) {
    return "'\u4E0B\u4E2A'" + baseFormat;
  }
  return "'\u4E0A\u4E2A'" + baseFormat;
}
var formatRelativeLocale = {
  lastWeek: checkWeek,
  // days before yesterday, maybe in this week or last week
  yesterday: "'\u6628\u5929' p",
  today: "'\u4ECA\u5929' p",
  tomorrow: "'\u660E\u5929' p",
  nextWeek: checkWeek,
  // days after tomorrow, maybe in this week or next week
  other: "PP p"
};
var formatRelative = (token, date, baseDate, options) => {
  const format2 = formatRelativeLocale[token];
  if (typeof format2 === "function") {
    return format2(date, baseDate, options);
  }
  return format2;
};

// ../../node_modules/date-fns/locale/zh-CN/_lib/localize.js
var eraValues = {
  narrow: ["\u524D", "\u516C\u5143"],
  abbreviated: ["\u524D", "\u516C\u5143"],
  wide: ["\u516C\u5143\u524D", "\u516C\u5143"]
};
var quarterValues = {
  narrow: ["1", "2", "3", "4"],
  abbreviated: ["\u7B2C\u4E00\u5B63", "\u7B2C\u4E8C\u5B63", "\u7B2C\u4E09\u5B63", "\u7B2C\u56DB\u5B63"],
  wide: ["\u7B2C\u4E00\u5B63\u5EA6", "\u7B2C\u4E8C\u5B63\u5EA6", "\u7B2C\u4E09\u5B63\u5EA6", "\u7B2C\u56DB\u5B63\u5EA6"]
};
var monthValues = {
  narrow: [
    "\u4E00",
    "\u4E8C",
    "\u4E09",
    "\u56DB",
    "\u4E94",
    "\u516D",
    "\u4E03",
    "\u516B",
    "\u4E5D",
    "\u5341",
    "\u5341\u4E00",
    "\u5341\u4E8C"
  ],
  abbreviated: [
    "1\u6708",
    "2\u6708",
    "3\u6708",
    "4\u6708",
    "5\u6708",
    "6\u6708",
    "7\u6708",
    "8\u6708",
    "9\u6708",
    "10\u6708",
    "11\u6708",
    "12\u6708"
  ],
  wide: [
    "\u4E00\u6708",
    "\u4E8C\u6708",
    "\u4E09\u6708",
    "\u56DB\u6708",
    "\u4E94\u6708",
    "\u516D\u6708",
    "\u4E03\u6708",
    "\u516B\u6708",
    "\u4E5D\u6708",
    "\u5341\u6708",
    "\u5341\u4E00\u6708",
    "\u5341\u4E8C\u6708"
  ]
};
var dayValues = {
  narrow: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"],
  short: ["\u65E5", "\u4E00", "\u4E8C", "\u4E09", "\u56DB", "\u4E94", "\u516D"],
  abbreviated: ["\u5468\u65E5", "\u5468\u4E00", "\u5468\u4E8C", "\u5468\u4E09", "\u5468\u56DB", "\u5468\u4E94", "\u5468\u516D"],
  wide: ["\u661F\u671F\u65E5", "\u661F\u671F\u4E00", "\u661F\u671F\u4E8C", "\u661F\u671F\u4E09", "\u661F\u671F\u56DB", "\u661F\u671F\u4E94", "\u661F\u671F\u516D"]
};
var dayPeriodValues = {
  narrow: {
    am: "\u4E0A",
    pm: "\u4E0B",
    midnight: "\u51CC\u6668",
    noon: "\u5348",
    morning: "\u65E9",
    afternoon: "\u4E0B\u5348",
    evening: "\u665A",
    night: "\u591C"
  },
  abbreviated: {
    am: "\u4E0A\u5348",
    pm: "\u4E0B\u5348",
    midnight: "\u51CC\u6668",
    noon: "\u4E2D\u5348",
    morning: "\u65E9\u6668",
    afternoon: "\u4E2D\u5348",
    evening: "\u665A\u4E0A",
    night: "\u591C\u95F4"
  },
  wide: {
    am: "\u4E0A\u5348",
    pm: "\u4E0B\u5348",
    midnight: "\u51CC\u6668",
    noon: "\u4E2D\u5348",
    morning: "\u65E9\u6668",
    afternoon: "\u4E2D\u5348",
    evening: "\u665A\u4E0A",
    night: "\u591C\u95F4"
  }
};
var formattingDayPeriodValues = {
  narrow: {
    am: "\u4E0A",
    pm: "\u4E0B",
    midnight: "\u51CC\u6668",
    noon: "\u5348",
    morning: "\u65E9",
    afternoon: "\u4E0B\u5348",
    evening: "\u665A",
    night: "\u591C"
  },
  abbreviated: {
    am: "\u4E0A\u5348",
    pm: "\u4E0B\u5348",
    midnight: "\u51CC\u6668",
    noon: "\u4E2D\u5348",
    morning: "\u65E9\u6668",
    afternoon: "\u4E2D\u5348",
    evening: "\u665A\u4E0A",
    night: "\u591C\u95F4"
  },
  wide: {
    am: "\u4E0A\u5348",
    pm: "\u4E0B\u5348",
    midnight: "\u51CC\u6668",
    noon: "\u4E2D\u5348",
    morning: "\u65E9\u6668",
    afternoon: "\u4E2D\u5348",
    evening: "\u665A\u4E0A",
    night: "\u591C\u95F4"
  }
};
var ordinalNumber = (dirtyNumber, options) => {
  const number = Number(dirtyNumber);
  switch (options?.unit) {
    case "date":
      return number.toString() + "\u65E5";
    case "hour":
      return number.toString() + "\u65F6";
    case "minute":
      return number.toString() + "\u5206";
    case "second":
      return number.toString() + "\u79D2";
    default:
      return "\u7B2C " + number.toString();
  }
};
var localize = {
  ordinalNumber,
  era: buildLocalizeFn({
    values: eraValues,
    defaultWidth: "wide"
  }),
  quarter: buildLocalizeFn({
    values: quarterValues,
    defaultWidth: "wide",
    argumentCallback: (quarter) => quarter - 1
  }),
  month: buildLocalizeFn({
    values: monthValues,
    defaultWidth: "wide"
  }),
  day: buildLocalizeFn({
    values: dayValues,
    defaultWidth: "wide"
  }),
  dayPeriod: buildLocalizeFn({
    values: dayPeriodValues,
    defaultWidth: "wide",
    formattingValues: formattingDayPeriodValues,
    defaultFormattingWidth: "wide"
  })
};

// ../../node_modules/date-fns/locale/zh-CN/_lib/match.js
var matchOrdinalNumberPattern = /^(第\s*)?\d+(日|时|分|秒)?/i;
var parseOrdinalNumberPattern = /\d+/i;
var matchEraPatterns = {
  narrow: /^(前)/i,
  abbreviated: /^(前)/i,
  wide: /^(公元前|公元)/i
};
var parseEraPatterns = {
  any: [/^(前)/i, /^(公元)/i]
};
var matchQuarterPatterns = {
  narrow: /^[1234]/i,
  abbreviated: /^第[一二三四]刻/i,
  wide: /^第[一二三四]刻钟/i
};
var parseQuarterPatterns = {
  any: [/(1|一)/i, /(2|二)/i, /(3|三)/i, /(4|四)/i]
};
var matchMonthPatterns = {
  narrow: /^(一|二|三|四|五|六|七|八|九|十[二一])/i,
  abbreviated: /^(一|二|三|四|五|六|七|八|九|十[二一]|\d|1[12])月/i,
  wide: /^(一|二|三|四|五|六|七|八|九|十[二一])月/i
};
var parseMonthPatterns = {
  narrow: [
    /^一/i,
    /^二/i,
    /^三/i,
    /^四/i,
    /^五/i,
    /^六/i,
    /^七/i,
    /^八/i,
    /^九/i,
    /^十(?!(一|二))/i,
    /^十一/i,
    /^十二/i
  ],
  any: [
    /^一|1/i,
    /^二|2/i,
    /^三|3/i,
    /^四|4/i,
    /^五|5/i,
    /^六|6/i,
    /^七|7/i,
    /^八|8/i,
    /^九|9/i,
    /^十(?!(一|二))|10/i,
    /^十一|11/i,
    /^十二|12/i
  ]
};
var matchDayPatterns = {
  narrow: /^[一二三四五六日]/i,
  short: /^[一二三四五六日]/i,
  abbreviated: /^周[一二三四五六日]/i,
  wide: /^星期[一二三四五六日]/i
};
var parseDayPatterns = {
  any: [/日/i, /一/i, /二/i, /三/i, /四/i, /五/i, /六/i]
};
var matchDayPeriodPatterns = {
  any: /^(上午?|下午?|午夜|[中正]午|早上?|下午|晚上?|凌晨|)/i
};
var parseDayPeriodPatterns = {
  any: {
    am: /^上午?/i,
    pm: /^下午?/i,
    midnight: /^午夜/i,
    noon: /^[中正]午/i,
    morning: /^早上/i,
    afternoon: /^下午/i,
    evening: /^晚上?/i,
    night: /^凌晨/i
  }
};
var match = {
  ordinalNumber: buildMatchPatternFn({
    matchPattern: matchOrdinalNumberPattern,
    parsePattern: parseOrdinalNumberPattern,
    valueCallback: (value) => parseInt(value, 10)
  }),
  era: buildMatchFn({
    matchPatterns: matchEraPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseEraPatterns,
    defaultParseWidth: "any"
  }),
  quarter: buildMatchFn({
    matchPatterns: matchQuarterPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseQuarterPatterns,
    defaultParseWidth: "any",
    valueCallback: (index) => index + 1
  }),
  month: buildMatchFn({
    matchPatterns: matchMonthPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseMonthPatterns,
    defaultParseWidth: "any"
  }),
  day: buildMatchFn({
    matchPatterns: matchDayPatterns,
    defaultMatchWidth: "wide",
    parsePatterns: parseDayPatterns,
    defaultParseWidth: "any"
  }),
  dayPeriod: buildMatchFn({
    matchPatterns: matchDayPeriodPatterns,
    defaultMatchWidth: "any",
    parsePatterns: parseDayPeriodPatterns,
    defaultParseWidth: "any"
  })
};

// ../../node_modules/date-fns/locale/zh-CN.js
var zhCN = {
  code: "zh-CN",
  formatDistance,
  formatLong,
  formatRelative,
  localize,
  match,
  options: {
    weekStartsOn: 1,
    firstWeekContainsDate: 4
  }
};
function Textarea({ className, ...props }) {
  return /* @__PURE__ */ jsx(
    "textarea",
    {
      "data-slot": "textarea",
      className: cn(
        "border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive dark:bg-input/30 flex field-sizing-content min-h-16 w-full rounded-md border bg-transparent px-3 py-2 text-base shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className
      ),
      ...props
    }
  );
}
function BlockToolbarButton({ type, children, tooltip }) {
  const editor = useEditorRef();
  const onClick = () => {
    if (!editor) return;
    const slateEditor = editor;
    Transforms.setNodes(slateEditor, { type }, {
      match: (n) => "type" in n && "children" in n
    });
  };
  return /* @__PURE__ */ jsx(ToolbarButton, { onClick, tooltip, children });
}
var items = [
  {
    icon: AlignLeftIcon,
    value: "left"
  },
  {
    icon: AlignCenterIcon,
    value: "center"
  },
  {
    icon: AlignRightIcon,
    value: "right"
  },
  {
    icon: AlignJustifyIcon,
    value: "justify"
  }
];
function AlignToolbarButton(props) {
  const { editor, tf } = useEditorPlugin(TextAlignPlugin);
  const value = useSelectionFragmentProp({
    defaultValue: "start",
    getProp: (node) => node.align
  }) ?? "left";
  const [open, setOpen] = React.useState(false);
  const IconValue = items.find((item) => item.value === value)?.icon ?? AlignLeftIcon;
  return /* @__PURE__ */ jsxs(DropdownMenu, { open, onOpenChange: setOpen, modal: false, ...props, children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(ToolbarButton, { pressed: open, tooltip: "Align", isDropdown: true, children: /* @__PURE__ */ jsx(IconValue, {}) }) }),
    /* @__PURE__ */ jsx(DropdownMenuContent, { className: "min-w-0", align: "start", children: /* @__PURE__ */ jsx(
      DropdownMenuRadioGroup,
      {
        value,
        onValueChange: (value2) => {
          tf.textAlign.setNodes(value2);
          editor.tf.focus();
        },
        children: items.map(({ icon: Icon, value: itemValue }) => /* @__PURE__ */ jsx(
          DropdownMenuRadioItem,
          {
            className: "pl-2 data-[state=checked]:bg-accent *:first:[span]:hidden",
            value: itemValue,
            children: /* @__PURE__ */ jsx(Icon, {})
          },
          itemValue
        ))
      }
    ) })
  ] });
}
function IndentToolbarButton(props) {
  const { props: buttonProps } = useIndentButton();
  return /* @__PURE__ */ jsx(ToolbarButton, { ...props, ...buttonProps, tooltip: "Indent", children: /* @__PURE__ */ jsx(IndentIcon, {}) });
}
function OutdentToolbarButton(props) {
  const { props: buttonProps } = useOutdentButton();
  return /* @__PURE__ */ jsx(ToolbarButton, { ...props, ...buttonProps, tooltip: "Outdent", children: /* @__PURE__ */ jsx(OutdentIcon, {}) });
}
function LineHeightToolbarButton(props) {
  const editor = useEditorRef();
  const { defaultNodeValue, validNodeValues: values = [] } = editor.getInjectProps(LineHeightPlugin);
  const value = useSelectionFragmentProp({
    defaultValue: defaultNodeValue,
    getProp: (node) => node.lineHeight
  });
  const [open, setOpen] = React.useState(false);
  return /* @__PURE__ */ jsxs(DropdownMenu, { open, onOpenChange: setOpen, modal: false, ...props, children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(ToolbarButton, { pressed: open, tooltip: "Line height", isDropdown: true, children: /* @__PURE__ */ jsx(WrapText, {}) }) }),
    /* @__PURE__ */ jsx(DropdownMenuContent, { className: "min-w-0", align: "start", children: /* @__PURE__ */ jsx(
      DropdownMenuRadioGroup,
      {
        value,
        onValueChange: (newValue) => {
          editor.getTransforms(LineHeightPlugin).lineHeight.setNodes(Number(newValue));
          editor.tf.focus();
        },
        children: values.map((value2) => /* @__PURE__ */ jsxs(
          DropdownMenuRadioItem,
          {
            className: "min-w-[180px] pl-2 *:first:[span]:hidden",
            value: value2,
            children: [
              /* @__PURE__ */ jsx("span", { className: "pointer-events-none absolute right-2 flex size-3.5 items-center justify-center", children: /* @__PURE__ */ jsx(DropdownMenuItemIndicator, { children: /* @__PURE__ */ jsx(CheckIcon, {}) }) }),
              value2
            ]
          },
          value2
        ))
      }
    ) })
  ] });
}
var groups = [
  {
    group: "Basic blocks",
    items: [
      {
        icon: /* @__PURE__ */ jsx(PilcrowIcon, {}),
        label: "Paragraph",
        value: KEYS.p
      },
      {
        icon: /* @__PURE__ */ jsx(Heading1Icon, {}),
        label: "Heading 1",
        value: "h1"
      },
      {
        icon: /* @__PURE__ */ jsx(Heading2Icon, {}),
        label: "Heading 2",
        value: "h2"
      },
      {
        icon: /* @__PURE__ */ jsx(Heading3Icon, {}),
        label: "Heading 3",
        value: "h3"
      },
      {
        icon: /* @__PURE__ */ jsx(TableIcon, {}),
        label: "Table",
        value: KEYS.table
      },
      {
        icon: /* @__PURE__ */ jsx(FileCodeIcon, {}),
        label: "Code",
        value: KEYS.codeBlock
      },
      {
        icon: /* @__PURE__ */ jsx(QuoteIcon, {}),
        label: "Quote",
        value: KEYS.blockquote
      },
      {
        icon: /* @__PURE__ */ jsx(MinusIcon, {}),
        label: "Divider",
        value: KEYS.hr
      }
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      }
    }))
  },
  {
    group: "Lists",
    items: [
      {
        icon: /* @__PURE__ */ jsx(ListIcon, {}),
        label: "Bulleted list",
        value: KEYS.ul
      },
      {
        icon: /* @__PURE__ */ jsx(ListOrderedIcon, {}),
        label: "Numbered list",
        value: KEYS.ol
      },
      {
        icon: /* @__PURE__ */ jsx(SquareIcon, {}),
        label: "To-do list",
        value: KEYS.listTodo
      },
      {
        icon: /* @__PURE__ */ jsx(ChevronRightIcon, {}),
        label: "Toggle list",
        value: KEYS.toggle
      }
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      }
    }))
  },
  {
    group: "Media",
    items: [
      {
        icon: /* @__PURE__ */ jsx(ImageIcon, {}),
        label: "Image",
        value: KEYS.img
      },
      {
        icon: /* @__PURE__ */ jsx(FilmIcon, {}),
        label: "Embed",
        value: KEYS.mediaEmbed
      }
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      }
    }))
  },
  {
    group: "Advanced blocks",
    items: [
      {
        icon: /* @__PURE__ */ jsx(TableOfContentsIcon, {}),
        label: "Table of contents",
        value: KEYS.toc
      },
      {
        icon: /* @__PURE__ */ jsx(Columns3Icon, {}),
        label: "3 columns",
        value: "action_three_columns"
      },
      {
        focusEditor: false,
        icon: /* @__PURE__ */ jsx(RadicalIcon, {}),
        label: "Equation",
        value: KEYS.equation
      },
      {
        icon: /* @__PURE__ */ jsx(PenToolIcon, {}),
        label: "Excalidraw",
        value: KEYS.excalidraw
      }
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertBlock(editor, value);
      }
    }))
  },
  {
    group: "Inline",
    items: [
      {
        icon: /* @__PURE__ */ jsx(Link2Icon, {}),
        label: "Link",
        value: KEYS.link
      },
      {
        focusEditor: true,
        icon: /* @__PURE__ */ jsx(CalendarIcon, {}),
        label: "Date",
        value: KEYS.date
      },
      {
        focusEditor: false,
        icon: /* @__PURE__ */ jsx(RadicalIcon, {}),
        label: "Inline Equation",
        value: KEYS.inlineEquation
      }
    ].map((item) => ({
      ...item,
      onSelect: (editor, value) => {
        insertInlineElement(editor, value);
      }
    }))
  }
];
function InsertToolbarButton(props) {
  const editor = useEditorRef();
  const [open, setOpen] = React.useState(false);
  return /* @__PURE__ */ jsxs(DropdownMenu, { open, onOpenChange: setOpen, modal: false, ...props, children: [
    /* @__PURE__ */ jsx(DropdownMenuTrigger, { asChild: true, children: /* @__PURE__ */ jsx(ToolbarButton, { pressed: open, tooltip: "Insert", isDropdown: true, children: /* @__PURE__ */ jsx(PlusIcon, {}) }) }),
    /* @__PURE__ */ jsx(
      DropdownMenuContent,
      {
        className: "flex max-h-[500px] min-w-0 flex-col overflow-y-auto",
        align: "start",
        children: groups.map(({ group, items: nestedItems }) => /* @__PURE__ */ jsx(ToolbarMenuGroup, { label: group, children: nestedItems.map(({ icon, label, value, onSelect }) => /* @__PURE__ */ jsxs(
          DropdownMenuItem,
          {
            className: "min-w-[180px]",
            onSelect: () => {
              onSelect(editor, value);
              editor.tf.focus();
            },
            children: [
              icon,
              label
            ]
          },
          value
        )) }, group))
      }
    )
  ] });
}
function DatePicker({ date, setDate, placeholder = "\u9009\u62E9\u65E5\u671F" }) {
  return /* @__PURE__ */ jsxs(Popover, { children: [
    /* @__PURE__ */ jsx(PopoverTrigger, { asChild: true, children: /* @__PURE__ */ jsxs(
      Button,
      {
        variant: "outline",
        className: cn(
          "w-full justify-start text-left font-normal",
          !date && "text-muted-foreground"
        ),
        children: [
          /* @__PURE__ */ jsx(Calendar, { className: "mr-2 h-4 w-4" }),
          date ? format(date, "yyyy\u5E74MM\u6708dd\u65E5", { locale: zhCN }) : /* @__PURE__ */ jsx("span", { children: placeholder })
        ]
      }
    ) }),
    /* @__PURE__ */ jsx(PopoverContent, { className: "w-auto p-0", align: "start", children: /* @__PURE__ */ jsx(
      Calendar$1,
      {
        mode: "single",
        selected: date,
        onSelect: setDate,
        initialFocus: true,
        locale: zhCN
      }
    ) })
  ] });
}

export { AlignToolbarButton, BlockToolbarButton, DatePicker, IndentToolbarButton, InsertToolbarButton, LineHeightToolbarButton, OutdentToolbarButton, Textarea };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map