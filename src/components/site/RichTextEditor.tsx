import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import {
  Bold, Italic, Strikethrough, Heading1, Heading2, Heading3,
  List, ListOrdered, Quote, Undo2, Redo2,
  Link as LinkIcon, Image as ImageIcon, Code, Minus,
} from "lucide-react";

interface Props {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function RichTextEditor({ value, onChange, placeholder }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({ heading: { levels: [1, 2, 3] } }),
      Link.configure({ openOnClick: false, HTMLAttributes: { class: "text-accent underline" } }),
      Image,
      Placeholder.configure({ placeholder: placeholder || "Start writing your blog…" }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          "prose prose-sm dark:prose-invert max-w-none min-h-[280px] px-4 py-3 focus:outline-none prose-headings:font-bold prose-a:text-accent",
      },
    },
  });

  if (!editor) return null;

  const Btn = ({
    onClick, active, disabled, label, children,
  }: {
    onClick: () => void; active?: boolean; disabled?: boolean; label: string; children: React.ReactNode;
  }) => (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={`p-2 border-r border-border hover:bg-accent-soft hover:text-accent transition-colors ${
        active ? "bg-accent-soft text-accent" : "text-foreground"
      } disabled:opacity-40 disabled:cursor-not-allowed`}
    >
      {children}
    </button>
  );

  const setLink = () => {
    const prev = editor.getAttributes("link").href;
    const url = window.prompt("URL", prev || "https://");
    if (url === null) return;
    if (url === "") { editor.chain().focus().extendMarkRange("link").unsetLink().run(); return; }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const addImage = () => {
    const url = window.prompt("Image URL");
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  return (
    <div className="border border-border bg-background">
      <div className="flex flex-wrap items-center border-b border-border bg-secondary">
        <Btn label="Heading 1" active={editor.isActive("heading", { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}><Heading1 className="h-4 w-4" /></Btn>
        <Btn label="Heading 2" active={editor.isActive("heading", { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}><Heading2 className="h-4 w-4" /></Btn>
        <Btn label="Heading 3" active={editor.isActive("heading", { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}><Heading3 className="h-4 w-4" /></Btn>
        <Btn label="Bold" active={editor.isActive("bold")}
          onClick={() => editor.chain().focus().toggleBold().run()}><Bold className="h-4 w-4" /></Btn>
        <Btn label="Italic" active={editor.isActive("italic")}
          onClick={() => editor.chain().focus().toggleItalic().run()}><Italic className="h-4 w-4" /></Btn>
        <Btn label="Strike" active={editor.isActive("strike")}
          onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough className="h-4 w-4" /></Btn>
        <Btn label="Bullet list" active={editor.isActive("bulletList")}
          onClick={() => editor.chain().focus().toggleBulletList().run()}><List className="h-4 w-4" /></Btn>
        <Btn label="Numbered list" active={editor.isActive("orderedList")}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered className="h-4 w-4" /></Btn>
        <Btn label="Quote" active={editor.isActive("blockquote")}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote className="h-4 w-4" /></Btn>
        <Btn label="Code block" active={editor.isActive("codeBlock")}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code className="h-4 w-4" /></Btn>
        <Btn label="Divider" onClick={() => editor.chain().focus().setHorizontalRule().run()}><Minus className="h-4 w-4" /></Btn>
        <Btn label="Link" active={editor.isActive("link")} onClick={setLink}><LinkIcon className="h-4 w-4" /></Btn>
        <Btn label="Image" onClick={addImage}><ImageIcon className="h-4 w-4" /></Btn>
        <div className="ml-auto flex">
          <Btn label="Undo" disabled={!editor.can().undo()} onClick={() => editor.chain().focus().undo().run()}><Undo2 className="h-4 w-4" /></Btn>
          <Btn label="Redo" disabled={!editor.can().redo()} onClick={() => editor.chain().focus().redo().run()}><Redo2 className="h-4 w-4" /></Btn>
        </div>
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
