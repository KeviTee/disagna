'use client';

import { useEffect } from 'react';
import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Placeholder from '@tiptap/extension-placeholder';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const WysiwygEditor = ({ value, onChange }: Props) => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Placeholder.configure({
        placeholder: 'Start writing…'
      })
    ],
    content: value,
    editorProps: {
      attributes: {
        class: 'min-h-[200px] w-full focus:outline-none'
      }
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    }
  });

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value || '', false);
    }
  }, [value, editor]);

  if (!editor) return null;

  return (
    <div className="rounded border p-2">
      <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
        <div className="flex gap-1 rounded border bg-white p-1 shadow">
          <button
            onClick={() => editor.chain().focus().toggleBold().run()}
            className={`rounded px-2 py-1 text-sm ${editor.isActive('bold') ? 'bg-gray-200 font-bold' : ''}`}
          >
            B
          </button>
          <button
            onClick={() => editor.chain().focus().toggleItalic().run()}
            className={`rounded px-2 py-1 text-sm ${editor.isActive('italic') ? 'bg-gray-200 italic' : ''}`}
          >
            I
          </button>
          <button
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            className={`rounded px-2 py-1 text-sm ${editor.isActive('bulletList') ? 'bg-gray-200' : ''}`}
          >
            ••
          </button>
        </div>
      </BubbleMenu>
      <EditorContent editor={editor} />
    </div>
  );
};

export default WysiwygEditor;

