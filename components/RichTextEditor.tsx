'use client';

import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Placeholder from '@tiptap/extension-placeholder';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  AlignLeft, 
  AlignCenter, 
  AlignRight, 
  AlignJustify,
  Undo,
  Redo,
  Eraser
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const MenuBar = ({ editor }: { editor: any }) => {
  if (!editor) {
    return null;
  }

  return (
    <div className="flex flex-wrap gap-1 p-2 border-b border-[var(--border)] bg-[var(--foreground)]/5 rounded-t-xl">
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={`p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors ${editor.isActive('bold') ? 'bg-blue-500/20 text-blue-600' : 'text-gray-500 dark:text-[var(--muted-foreground)]'}`}
        title="Bold"
      >
        <Bold className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={`p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors ${editor.isActive('italic') ? 'bg-blue-500/20 text-blue-600' : 'text-gray-500 dark:text-[var(--muted-foreground)]'}`}
        title="Italic"
      >
        <Italic className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleUnderline().run()}
        className={`p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors ${editor.isActive('underline') ? 'bg-blue-500/20 text-blue-600' : 'text-gray-500 dark:text-[var(--muted-foreground)]'}`}
        title="Underline"
      >
        <UnderlineIcon className="w-4 h-4" />
      </button>
      
      <div className="w-px h-6 bg-[var(--border)] mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={`p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors ${editor.isActive('bulletList') ? 'bg-blue-500/20 text-blue-600' : 'text-gray-500 dark:text-[var(--muted-foreground)]'}`}
        title="Bullet List"
      >
        <List className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleOrderedList().run()}
        className={`p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors ${editor.isActive('orderedList') ? 'bg-blue-500/20 text-blue-600' : 'text-gray-500 dark:text-[var(--muted-foreground)]'}`}
        title="Ordered List"
      >
        <ListOrdered className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-[var(--border)] mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('left').run()}
        className={`p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors ${editor.isActive({ textAlign: 'left' }) ? 'bg-blue-500/20 text-blue-600' : 'text-gray-500 dark:text-[var(--muted-foreground)]'}`}
        title="Align Left"
      >
        <AlignLeft className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('center').run()}
        className={`p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors ${editor.isActive({ textAlign: 'center' }) ? 'bg-blue-500/20 text-blue-600' : 'text-gray-500 dark:text-[var(--muted-foreground)]'}`}
        title="Align Center"
      >
        <AlignCenter className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('right').run()}
        className={`p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors ${editor.isActive({ textAlign: 'right' }) ? 'bg-blue-500/20 text-blue-600' : 'text-gray-500 dark:text-[var(--muted-foreground)]'}`}
        title="Align Right"
      >
        <AlignRight className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().setTextAlign('justify').run()}
        className={`p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors ${editor.isActive({ textAlign: 'justify' }) ? 'bg-blue-500/20 text-blue-600' : 'text-gray-500 dark:text-[var(--muted-foreground)]'}`}
        title="Justify"
      >
        <AlignJustify className="w-4 h-4" />
      </button>

      <button
        type="button"
        onClick={() => editor.chain().focus().unsetAllMarks().clearNodes().run()}
        className="p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors text-gray-500 dark:text-[var(--muted-foreground)]"
        title="Clear Formatting"
      >
        <Eraser className="w-4 h-4" />
      </button>

      <div className="w-px h-6 bg-[var(--border)] mx-1 self-center" />

      <button
        type="button"
        onClick={() => editor.chain().focus().undo().run()}
        disabled={!editor.can().chain().focus().undo().run()}
        className="p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors text-gray-500 dark:text-[var(--muted-foreground)] disabled:opacity-30"
        title="Undo"
      >
        <Undo className="w-4 h-4" />
      </button>
      <button
        type="button"
        onClick={() => editor.chain().focus().redo().run()}
        disabled={!editor.can().chain().focus().redo().run()}
        className="p-2 rounded hover:bg-[var(--foreground)]/10 transition-colors text-gray-500 dark:text-[var(--muted-foreground)] disabled:opacity-30"
        title="Redo"
      >
        <Redo className="w-4 h-4" />
      </button>
    </div>
  );
};

export default function RichTextEditor({ value, onChange, placeholder }: RichTextEditorProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        bulletList: {
          keepMarks: true,
          keepAttributes: false,
        },
        orderedList: {
          keepMarks: true,
          keepAttributes: false,
        },
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        defaultAlignment: 'justify',
      }),
      Placeholder.configure({
        placeholder: placeholder || 'Ketik di sini...',
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose prose-sm dark:prose-invert max-w-none focus:outline-none min-h-[120px] p-4 text-justify leading-relaxed text-[var(--foreground)] break-words',
      },
    },
  });

  return (
    <div className="w-full border border-[var(--border)] rounded-xl bg-[var(--foreground)]/5 focus-within:ring-2 focus-within:ring-blue-500 transition-all">
      <MenuBar editor={editor} />
      <EditorContent editor={editor} />
      <style jsx global>{`
        .tiptap p {
          margin-bottom: 0.5em;
          text-align: justify;
          line-height: 1.6;
          word-break: break-word;
        }
        .tiptap ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 0.5em;
        }
        .tiptap ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 0.5em;
        }
        .tiptap li {
          margin-bottom: 0.25em;
        }
        .tiptap p.is-editor-empty:first-child::before {
          content: attr(data-placeholder);
          float: left;
          color: var(--muted-foreground);
          pointer-events: none;
          height: 0;
          opacity: 0.5;
        }
      `}</style>
    </div>
  );
}
