import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";
import { categories, addCategory, deleteCategory } from "@/lib/mockData";
import ConfirmDialog from "@/components/site/ConfirmDialog";

export default function AdminCategories() {
  const [, force] = useState(0);
  const refresh = () => force((n) => n + 1);
  const [name, setName] = useState("");
  const [delId, setDelId] = useState<string | null>(null);

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    addCategory(name.trim());
    setName(""); refresh();
    toast.success("Category added");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Categories</h1>
      <form onSubmit={add} className="flex gap-2 mb-6 max-w-md">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="New category name" className="flex-1 h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm" />
        <Button type="submit" className="rounded-none bg-accent hover:bg-accent/90"><Plus className="h-4 w-4 mr-1" /> Add</Button>
      </form>
      <div className="grid gap-2 max-w-md">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between bg-card border border-border px-4 py-3">
            <div>
              <div className="font-medium">{c.name}</div>
              <div className="text-xs text-muted-foreground">/{c.slug}</div>
            </div>
            <Button size="sm" variant="outline" className="rounded-none text-destructive" onClick={() => setDelId(c.id)}><Trash2 className="h-3 w-3" /></Button>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={!!delId}
        onOpenChange={(o) => !o && setDelId(null)}
        title="Delete this category?"
        description="Content in this category will be uncategorized."
        confirmLabel="Delete"
        destructive
        onConfirm={() => { if (delId) { deleteCategory(delId); refresh(); toast.success("Deleted"); } }}
      />
    </div>
  );
}
