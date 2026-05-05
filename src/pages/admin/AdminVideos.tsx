import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2, Edit3, X } from "lucide-react";
import { getYouTubeThumb } from "@/lib/content";

interface Cat { id: string; name: string }
interface Video { id: string; title: string; youtube_url: string; thumbnail: string | null; description: string | null; category_id: string | null; featured: boolean; trending: boolean }

const empty: Omit<Video, "id"> = { title: "", youtube_url: "", thumbnail: "", description: "", category_id: null, featured: false, trending: false };

export default function AdminVideos() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [cats, setCats] = useState<Cat[]>([]);
  const [editing, setEditing] = useState<any | null>(null);

  const load = async () => {
    const { data } = await supabase.from("videos").select("*").order("created_at", { ascending: false });
    setVideos((data as any) || []);
  };

  useEffect(() => {
    load();
    supabase.from("categories").select("id,name").order("name").then(({ data }) => setCats((data as any) || []));
  }, []);

  const save = async () => {
    if (!editing.title || !editing.youtube_url) { toast.error("Title and YouTube URL are required"); return; }
    const payload = { ...editing, thumbnail: editing.thumbnail || null, description: editing.description || null, category_id: editing.category_id || null };
    const { id, ...rest } = payload;
    const op = id
      ? supabase.from("videos").update(rest).eq("id", id)
      : supabase.from("videos").insert(rest);
    const { error } = await op;
    if (error) { toast.error(error.message); return; }
    toast.success("Saved");
    setEditing(null); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this video?")) return;
    const { error } = await supabase.from("videos").delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted"); load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Videos</h1>
        <Button onClick={() => setEditing({ ...empty })} className="rounded-none bg-accent hover:bg-accent/90"><Plus className="h-4 w-4 mr-1" /> New video</Button>
      </div>

      <div className="grid gap-3">
        {videos.length === 0 && <p className="text-sm text-muted-foreground">No videos yet.</p>}
        {videos.map((v) => (
          <div key={v.id} className="bg-card border border-border p-3 flex gap-3 items-start">
            <img src={getYouTubeThumb(v.youtube_url, v.thumbnail)} alt="" className="w-32 aspect-video object-cover bg-secondary" />
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{v.title}</div>
              <div className="text-xs text-muted-foreground truncate">{v.youtube_url}</div>
              <div className="mt-1 flex gap-2 text-xs">
                {v.featured && <span className="bg-accent-soft text-accent px-2 py-0.5">Featured</span>}
                {v.trending && <span className="bg-accent-soft text-accent px-2 py-0.5">Trending</span>}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-none" onClick={() => setEditing(v)}><Edit3 className="h-3 w-3" /></Button>
              <Button size="sm" variant="outline" className="rounded-none text-destructive" onClick={() => remove(v.id)}><Trash2 className="h-3 w-3" /></Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-primary/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold">{editing.id ? "Edit video" : "New video"}</h2>
              <button onClick={() => setEditing(null)}><X className="h-4 w-4" /></button>
            </div>
            <div className="p-5 space-y-3">
              <Field label="Title"><input value={editing.title} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} /></Field>
              <Field label="YouTube URL"><input value={editing.youtube_url} onChange={(e) => setEditing({ ...editing, youtube_url: e.target.value })} className={inp} placeholder="https://youtube.com/watch?v=..." /></Field>
              <Field label="Custom thumbnail (optional)"><input value={editing.thumbnail || ""} onChange={(e) => setEditing({ ...editing, thumbnail: e.target.value })} className={inp} placeholder="https://..." /></Field>
              <Field label="Description"><textarea rows={4} value={editing.description || ""} onChange={(e) => setEditing({ ...editing, description: e.target.value })} className={inp} /></Field>
              <Field label="Category">
                <select value={editing.category_id || ""} onChange={(e) => setEditing({ ...editing, category_id: e.target.value || null })} className={inp}>
                  <option value="">— None —</option>
                  {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </Field>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.featured} onChange={(e) => setEditing({ ...editing, featured: e.target.checked })} /> Featured</label>
                <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={editing.trending} onChange={(e) => setEditing({ ...editing, trending: e.target.checked })} /> Trending</label>
              </div>
            </div>
            <div className="p-5 border-t border-border flex justify-end gap-2">
              <Button variant="outline" className="rounded-none" onClick={() => setEditing(null)}>Cancel</Button>
              <Button className="rounded-none bg-accent hover:bg-accent/90" onClick={save}>Save</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

const inp = "w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm";
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <div><label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label><div className="mt-1">{children}</div></div>;
}
