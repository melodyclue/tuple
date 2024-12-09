'use client';

import { useState, useEffect } from 'react';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import parse from 'html-react-parser';
import { Extension } from '@tiptap/core';
import Placeholder from '@tiptap/extension-placeholder';
import Link from '@tiptap/extension-link';
import { cn } from '@/lib/utils';

interface InlineBioEditorProps {
  initialValue: string;
  onSave: (value: string) => Promise<void>;
  className?: string;
}

export function InlineBioEditor({ initialValue, onSave, className }: InlineBioEditorProps) {
  // const [isEditing, setIsEditing] = useState(false);

  // if (!isEditing) {
  //   return (
  //     // biome-ignore lint/a11y/useKeyWithClickEvents: <explanation>
  //     <div
  //       onClick={() => setIsEditing(true)}
  //       className="tiptap cursor-pointer rounded-md p-2 text-slate-800 transition-all duration-300 hover:bg-slate-50"
  //     >
  //       {parse(initialValue)}
  //     </div>
  //   );
  // }

  return <EditBlock initialValue={initialValue} onSave={onSave} />;
}

const EditBlock = ({ initialValue, onSave }: { initialValue: string; onSave: (value: string) => Promise<void> }) => {
  const editor = useEditor({
    immediatelyRender: true,
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
        emptyEditorClass: 'is-editor-empty',
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
  });

  // if (!editor) {
  //   return (
  //     <div className="tiptap tiptap ProseMirror prose prose-sm p-2 text-slate-800 transition-all duration-300 hover:bg-slate-50 focus:outline-none">
  //       {parse(initialValue)}
  //     </div>
  //   );
  // }

  return (
    <div className="tiptap rounded-md p-2 text-slate-800 transition-all duration-300 hover:bg-slate-50">
      <EditorContent editor={editor} />
    </div>
  );
};
