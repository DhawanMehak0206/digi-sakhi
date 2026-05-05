import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X } from "lucide-react";
import RichTextEditor from "@/components/site/RichTextEditor";
import {
  blogs as blogsData, categories, addBlog, updateBlog, deleteBlog, type Blog,
} from "@/lib/mockData";
import ConfirmDialog from "@/components/site/ConfirmDialog";

const empty = {
  title: "", slug: "", content: "", cover_image: "",
  tags: [] as string[], category_id: null as string | null, featured: false,
};

export default function AdminBlogs() {
  const [, force] = useState(0);
  const refresh = () => force((n) => n + 1);
  const [editing, setEditing] = useState<any | null>(null);
  const [tagsInput, setTagsInput] = useState("");
  const [delId, setDelId] = useState<string | null>(null);

  const openNew = () => { setEditing({ ...empty }); setTagsInput(""); };
  const openEdit = (b: Blog) => { setEditing(b); setTagsInput((b.tags || []).join(", ")); };

  const save = () => {
    if (!editing.title) return toast.error("Title is required");
    const tags = tagsInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = { ...editing, tags, cover_image: editing.cover_image || null };
    if (editing.id) {
      updateBlog(editing.id, payload);
    } else {
      const { id, created_at, ...rest } = payload;
      addBlog(rest);
    }
    toast.success("Saved");
    setEditing(null); refresh();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Blogs</h1>
        <Button onClick={openNew} className="rounded-none bg-accent hover:bg-accent/90"><Plus className="h-4 w-4 mr-1" /> New blog</Button>
      </div>

      <div className="grid gap-3">
        {blogsData.length === 0 && <p className="text-sm text-muted-foreground">No blogs yet.</p>}
        {blogsData.map((b) => (
          <div key={b.id} className="bg-card border border-border p-4 flex justify-between gap-4 items-start">
            <div className="min-w-0">
              <div className="font-semibold truncate">{b.title}</div>
              <div className="text-xs text-muted-foreground truncate">/{b.slug}</div>
              <div className="mt-1 flex flex-wrap gap-1 text-xs">
                {b.featured && <span className="bg-accent-soft text-accent px-2 py-0.5">Featured</span>}
                {b.tags.slice(0, 3).map((t) => <span key={t} className="bg-secondary px-2 py-0.5">#{t}</span>)}
              </div>
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" className="rounded-none" onClick={() => openEdit(b)}><Pencil className="h-3 w-3" /></Button>
              <Button size="sm" variant="outline" className="rounded-none text-destructive" onClick={() => setDelId(b.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-primary/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border w-full max-w-3xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold">{editing.id ? "Edit blog" : "New blog"}</h2>
              <button onClick={() => setEditing(null)}><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-4">
              <Field label="Title"><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} /></Field>
              <Field label="Slug (optional)"><input value={editing.slug || ""} onChange={(e) => setEditing({ ...editing, slug: e.target.value })} className={inp} placeholder="auto from title" /></Field>
              <Field label="Cover image URL"><input value={editing.cover_image || ""} onChange={(e) => setEditing({ ...editing, cover_image: e.target.value })} className={inp} /></Field>
              <Field label="Category">
                <select value={editing.category_id || ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className={inp}>
                  <option value="">— None —</option>
                  {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <Field label="Tags (comma separated)"><input value={tagsInput} onChange={(e) => setTagsInput(e.target.value)} className={inp} /></Field>
              <Field label="Content">
                <ReactQuill
                  theme="snow"
                  value={editing.content}
                  onChange={(val) => setEditing({ ...editing, content: val })}
                  modules={quillModules}
                />
              </Field>
              <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2">
              <Button variant="outline" className="rounded-none" onClick={() => setEditing(null)}>Cancel</Button>
              <Button className="rounded-none bg-accent hover:bg-accent/90" onClick={save}>Save</Button>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!delId}
        onOpenChange={(o) => !o && setDelId(null)}
        title="Delete this blog?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => { if (delId) { deleteBlog(delId); toast.success("Deleted"); refresh(); } }}
      />
    </div>
  );
}

const inp = "w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>;
}
