import '../chunk-VGP27YFB.js';
import { useState, useEffect } from 'react';
import { useOthers, createRoomContext } from '@liveblocks/react';
export { RoomProvider, useMutation, useMyPresence, useOthers, useRoom, useSelf, useStorage, useUpdateMyPresence } from '@liveblocks/react';
import { useEditorRef } from 'platejs/react';
import { ReactEditor } from 'slate-react';
import { jsx, jsxs } from 'react/jsx-runtime';
import { createClient } from '@liveblocks/client';
export { ClientSideSuspense } from '@liveblocks/react/suspense';

function LiveblocksCursorOverlay({ containerRef }) {
  const others = useOthers();
  const editor = useEditorRef();
  return /* @__PURE__ */ jsx("div", { className: "pointer-events-none absolute inset-0 z-50 overflow-hidden", children: others.map(({ connectionId, presence, info }) => {
    const p = presence;
    if (!p?.selection) return null;
    return /* @__PURE__ */ jsx(
      Cursor,
      {
        editor,
        selection: p.selection,
        color: p.color || "#f00",
        name: p.name || "Anonymous",
        containerRef
      },
      connectionId
    );
  }) });
}
function Cursor({ editor, selection, color, name, containerRef }) {
  const [position, setPosition] = useState(null);
  useEffect(() => {
    let animationFrameId;
    const updatePosition = () => {
      if (!editor || !selection || !containerRef.current) {
        animationFrameId = requestAnimationFrame(updatePosition);
        return;
      }
      try {
        const domRange = ReactEditor.toDOMRange(editor, selection);
        const rects = domRange.getClientRects();
        if (rects.length > 0) {
          const rect = rects[0];
          const containerRect = containerRef.current.getBoundingClientRect();
          const scrollTop = containerRef.current.scrollTop;
          const scrollLeft = containerRef.current.scrollLeft;
          if (rect.width === 0 && rect.height === 0 && rect.x === 0 && rect.y === 0) {
          } else {
            const top = rect.top - containerRect.top + scrollTop;
            const left = rect.left - containerRect.left + scrollLeft;
            setPosition({
              top,
              left,
              height: rect.height || 20
              // 兜底高度
            });
          }
        }
      } catch (e) {
      }
      animationFrameId = requestAnimationFrame(updatePosition);
    };
    updatePosition();
    return () => cancelAnimationFrame(animationFrameId);
  }, [editor, selection, containerRef]);
  if (!position) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "absolute pointer-events-none transition-all duration-100 ease-out z-[9999]",
      style: {
        top: position.top,
        left: position.left,
        height: position.height
        // 添加一个 border 方便调试，发布时去掉
        // border: `1px solid ${color}` 
      },
      children: [
        /* @__PURE__ */ jsx("div", { className: "w-[2px] h-full shadow-sm", style: { backgroundColor: color } }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "absolute -top-6 left-0 px-2 py-0.5 text-[10px] font-bold text-white whitespace-nowrap rounded-sm shadow-md transition-opacity duration-200",
            style: {
              backgroundColor: color,
              opacity: 1
              // 强制一直显示
            },
            children: name
          }
        )
      ]
    }
  );
}
function createLiveblocksConfig(options) {
  const client = createClient(options);
  const {
    RoomProvider: RoomProvider2,
    useRoom: useRoom2,
    useOthers: useOthers3,
    useSelf: useSelf2,
    useStorage: useStorage2,
    useMutation: useMutation2,
    useMyPresence: useMyPresence2,
    useUpdateMyPresence: useUpdateMyPresence2
  } = createRoomContext(client);
  return {
    RoomProvider: RoomProvider2,
    useRoom: useRoom2,
    useOthers: useOthers3,
    useSelf: useSelf2,
    useStorage: useStorage2,
    useMutation: useMutation2,
    useMyPresence: useMyPresence2,
    useUpdateMyPresence: useUpdateMyPresence2
  };
}

export { LiveblocksCursorOverlay, createLiveblocksConfig };
//# sourceMappingURL=index.js.map
//# sourceMappingURL=index.js.map