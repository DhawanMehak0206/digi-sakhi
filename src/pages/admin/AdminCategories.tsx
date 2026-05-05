import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { slugify } from "@/lib/content";

interface Cat { id: string; name: string; slug: string }

export default function AdminCategories() {
  const [cats, setCats] = useState<Cat[]>([]);
  const [name, setName] = useState("");

  const load = async () => {
    const { data } = await supabase.from("categories").select("*").order("name");
    setCats((data as any) || []);
  };
  useEffect(() => { load(); }, []);

  const add = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    const { error } = await supabase.from("categories").insert({ name: name.trim(), slug: slugify(name) });
    if (error) return toast.error(error.message);
    setName(""); load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete category? Content in it will be uncategorized.")) return;
    const { error } = await supabase.from("categories").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <form onSubmit={add} className="flex gap-2 mb-6 max-w-md">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" className="flex-1 h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm" />
        <Button type="submit" className="rounded-none bg-accent hover:bg-accent/90"><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </form>
      <div className="grid gap-2 max-w-md">
        {cats.map((c) => (
          <div key={c.id} className="flex items-center justify-between bg-card border border-border px-4 py-3">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">/{c.slug}</div>
            </div>
            <Button size="sm" variant="outline" className="rounded-none text-destructive" onClick={() => remove(c.id)}><Trash2 className="h-3 w-3" /></Button>
          </div>
        ))}
      </div>
    </div>
  );
}
