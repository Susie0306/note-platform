import * as platejs_react from 'platejs/react';
import * as platejs from 'platejs';
import { Value } from 'platejs';
import * as react_jsx_runtime from 'react/jsx-runtime';
import * as React from 'react';

type TComment = {
    id: string;
    contentRich: Value;
    createdAt: Date;
    discussionId: string;
    isEdited: boolean;
    userId: string;
};
declare function Comment(props: {
    comment: TComment;
    discussionLength: number;
    editingId: string | null;
    index: number;
    setEditingId: React.Dispatch<React.SetStateAction<string | null>>;
    documentContent?: string;
    showDocumentContent?: boolean;
    onEditorClick?: () => void;
}): react_jsx_runtime.JSX.Element;
declare function CommentCreateForm({ autoFocus, className, discussionId: discussionIdProp, focusOnMount, }: {
    autoFocus?: boolean;
    className?: string;
    discussionId?: string;
    focusOnMount?: boolean;
}): react_jsx_runtime.JSX.Element;
declare const formatCommentDate: (date: Date) => string;

type TDiscussion = {
    id: string;
    comments: TComment[];
    createdAt: Date;
    isResolved: boolean;
    userId: string;
    documentContent?: string;
};
declare const DiscussionKit: platejs_react.PlatePlugin<platejs.PluginConfig<"discussion", {
    currentUserId: string;
    discussions: TDiscussion[];
    users: Record<string, {
        id: string;
        avatarUrl: string;
        name: string;
        hue?: number;
    }>;
}, {}, {}, {
    currentUser: () => {
        id: string;
        avatarUrl: string;
        name: string;
        hue?: number;
    };
    user: (id: string) => {
        id: string;
        avatarUrl: string;
        name: string;
        hue?: number;
    };
}>>[];

export { Comment as C, DiscussionKit as D, type TDiscussion as T, type TComment as a, CommentCreateForm as b, formatCommentDate as f };
