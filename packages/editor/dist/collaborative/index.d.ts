import * as react_jsx_runtime from 'react/jsx-runtime';
import React__default from 'react';
import { createRoomContext } from '@liveblocks/react';
export { RoomProvider, useMutation, useMyPresence, useOthers, useRoom, useSelf, useStorage, useUpdateMyPresence } from '@liveblocks/react';
export { ClientSideSuspense } from '@liveblocks/react/suspense';

interface LiveblocksCursorOverlayProps {
    containerRef: React__default.RefObject<HTMLDivElement | null>;
}
declare function LiveblocksCursorOverlay({ containerRef }: LiveblocksCursorOverlayProps): react_jsx_runtime.JSX.Element;

type EditorPresence = {
    cursor: {
        x: number;
        y: number;
    } | null;
    selection: any | null;
    name: string;
    color: string;
};
type EditorUserMeta = {
    id: string;
    info: {
        name: string;
        color: string;
        avatar?: string;
    };
};
interface LiveblocksConfig {
    RoomProvider: ReturnType<typeof createRoomContext>['RoomProvider'];
    useRoom: ReturnType<typeof createRoomContext>['useRoom'];
    useOthers: ReturnType<typeof createRoomContext>['useOthers'];
    useSelf: ReturnType<typeof createRoomContext>['useSelf'];
    useStorage: ReturnType<typeof createRoomContext>['useStorage'];
    useMutation: ReturnType<typeof createRoomContext>['useMutation'];
    useMyPresence: ReturnType<typeof createRoomContext>['useMyPresence'];
    useUpdateMyPresence: ReturnType<typeof createRoomContext>['useUpdateMyPresence'];
}
/**
 * Create Liveblocks configuration for collaborative editing
 *
 * @example
 * ```ts
 * // In your app's liveblocks.config.ts
 * import { createLiveblocksConfig } from '@susie/editor/collaborative'
 *
 * export const {
 *   RoomProvider,
 *   useRoom,
 *   useOthers,
 *   useSelf,
 *   useStorage,
 *   useMutation,
 *   useMyPresence,
 *   useUpdateMyPresence,
 * } = createLiveblocksConfig({
 *   authEndpoint: '/api/liveblocks-auth',
 * })
 * ```
 */
declare function createLiveblocksConfig(options: {
    authEndpoint: string;
} | {
    publicApiKey: string;
}): LiveblocksConfig;

export { type EditorPresence, type EditorUserMeta, type LiveblocksConfig, LiveblocksCursorOverlay, createLiveblocksConfig };
