'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import { Extension } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import dynamic from 'next/dynamic';

interface InlineBioEditorProps {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
}

export const InlineBioEditor = ({ initialValue, onSave }: InlineBioEditorProps) => {
  const editor = useEditor({
    extensions: [
      Extension.create({
        name: 'submit-command',
        addKeyboardShortcuts() {
          return {
            'Mod-Enter': () => {
              this.editor.commands.blur();
              return true;
            },
          };
        },
      }),
      Placeholder.configure({
        placeholder: 'Write something...',
      }),
      Link.configure({
        HTMLAttributes: {
          // Change rel to different value
          // Allow search engines to follow links(remove nofollow)
          rel: 'noopener noreferrer',
          // Remove target entirely so links open in current tab
          target: '_blank',
        },
      }),
      StarterKit.configure({
        hardBreak: {
          keepMarks: true,
        },
      }),
    ],
    content: initialValue,
    editorProps: {
      attributes: {
        class: 'prose prose-sm max-w-full focus:outline-none',
      },
    },
    onBlur: async () => {
      if (editor && editor.getHTML() !== initialValue) {
        await onSave(editor.getHTML());
      }
    },
    immediatelyRender: false,
  });

  return (
    <div className="rounded-md p-2 transition-all duration-300 hover:bg-slate-50">
      <EditorContent editor={editor} />
    </div>
  );
};
