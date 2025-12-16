import * as react_jsx_runtime from 'react/jsx-runtime';
import * as class_variance_authority_types from 'class-variance-authority/types';
import * as React from 'react';
import { VariantProps } from 'class-variance-authority';
import { PlateContentProps, PlateViewProps } from 'platejs/react';

declare const editorContainerVariants: (props?: ({
    variant?: "default" | "comment" | "demo" | "select" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
declare function EditorContainer({ className, variant, ...props }: React.ComponentProps<'div'> & VariantProps<typeof editorContainerVariants>): react_jsx_runtime.JSX.Element;
declare const editorVariants: (props?: ({
    disabled?: boolean | null | undefined;
    focused?: boolean | null | undefined;
    variant?: "default" | "comment" | "demo" | "select" | "ai" | "aiChat" | "fullWidth" | "none" | null | undefined;
} & class_variance_authority_types.ClassProp) | undefined) => string;
type EditorProps = PlateContentProps & VariantProps<typeof editorVariants>;
declare const Editor: {
    ({ className, disabled, focused, variant, ref, ...props }: EditorProps & {
        ref?: React.RefObject<HTMLDivElement | null>;
    }): react_jsx_runtime.JSX.Element;
    displayName: string;
};
declare function EditorView({ className, variant, ...props }: PlateViewProps & VariantProps<typeof editorVariants>): react_jsx_runtime.JSX.Element;
declare namespace EditorView {
    var displayName: string;
}

export { Editor as E, EditorContainer as a, EditorView as b, type EditorProps as c };
