import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, X, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/site/ConfirmDialog";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCourses, useVideos } from "@/hooks/useSupabaseData";
import { deleteCourse, replaceCourseItems, upsertCourse } from "@/lib/supabaseApi";

const inp =
  "w-full h-10 px-3 bg-background border border-border rounded-none focus:outline-none focus:border-accent text-sm";

type CourseVideoItem = { video_id: string; locked: boolean };
type CourseShape = {
  id?: string;
  created_at?: string;
  title: string;
  description: string;
  items: CourseVideoItem[];
};

const empty: CourseShape = {
  title: "",
  description: "",
  items: [],
};

export default function AdminCourses() {
  const qc = useQueryClient();
  const { data: coursesData = [] } = useCourses();
  const { data: videos = [] } = useVideos();

  const [editing, setEditing] = useState<CourseShape | null>(null);
  const [delId, setDelId] = useState<string | null>(null);

  const openNew = () => setEditing({ ...empty, items: [] });
  const openEdit = (c: any) =>
    setEditing({
      id: c.id,
      created_at: c.created_at,
      title: c.title,
      description: c.description || "",
      items: (c.course_items || []).map((it: any) => ({ video_id: it.video_id, locked: !!it.locked })),
    });

  const selectedVideoIds = useMemo(() => new Set((editing?.items || []).map((i) => i.video_id)), [editing]);

  const toggleVideo = (videoId: string) => {
    if (!editing) return;
    const items = editing.items || [];
    if (items.some((i) => i.video_id === videoId)) {
      setEditing({ ...editing, items: items.filter((i) => i.video_id !== videoId) });
    } else {
      const next: CourseVideoItem = { video_id: videoId, locked: false };
      setEditing({ ...editing, items: [...items, next] });
    }
  };

  const setLocked = (videoId: string, locked: boolean) => {
    if (!editing) return;
    setEditing({
      ...editing,
      items: (editing.items || []).map((i) => (i.video_id === videoId ? { ...i, locked } : i)),
    });
  };

  const move = (videoId: string, dir: -1 | 1) => {
    if (!editing) return;
    const items = [...(editing.items || [])];
    const idx = items.findIndex((i) => i.video_id === videoId);
    if (idx < 0) return;
    const to = idx + dir;
    if (to < 0 || to >= items.length) return;
    const t = items[idx];
    items[idx] = items[to];
    items[to] = t;
    setEditing({ ...editing, items });
  };

  const save = () => {
    if (!editing) return;
    if (!editing.title?.trim()) return toast.error("Course title is required");
    if (!editing.items?.length) return toast.error("Select at least 1 video");

    saveMutation.mutate(
      {
        id: editing.id,
        title: editing.title.trim(),
        description: (editing.description || "").trim(),
        items: editing.items || [],
      },
      {
        onSuccess: () => {
          toast.success("Saved");
          setEditing(null);
        },
        onError: (e: any) => toast.error(e.message || "Save failed"),
      },
    );
  };

  const videoTitle = (id: string) => videos.find((v) => v.id === id)?.title || id;

  const saveMutation = useMutation({
    mutationFn: async (payload: CourseShape) => {
      const { items, ...course } = payload;
      const saved = await upsertCourse(course as any);
      await replaceCourseItems(saved.id, items);
      return saved;
    },
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => deleteCourse(id),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["courses"] });
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Courses</h1>
          <p className="text-sm text-muted-foreground">Create courses and add ordered videos. Lock videos to require progress.</p>
        </div>
        <Button onClick={openNew} className="rounded-none bg-accent hover:bg-accent/90">
          <Plus className="h-4 w-4 mr-1" /> New course
        </Button>
      </div>

      <div className="grid gap-3">
        {coursesData.length === 0 && <p className="text-sm text-muted-foreground">No courses yet.</p>}
        {coursesData.map((c) => (
          <div key={c.id} className="bg-card border border-border p-3 flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-semibold truncate">{c.title}</div>
              <div className="text-xs text-muted-foreground truncate">
                {(c.course_items || []).length} video{(c.course_items || []).length === 1 ? "" : "s"}
                {c.description ? ` • ${c.description}` : ""}
              </div>
            </div>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" className="rounded-none" onClick={() => openEdit(c)}>
                <Pencil className="h-3 w-3" />
              </Button>
              <Button size="sm" variant="outline" className="rounded-none text-destructive" onClick={() => setDelId(c.id)}>
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 bg-primary/50 flex items-center justify-center p-4" onClick={() => setEditing(null)}>
          <div className="bg-card border border-border w-full max-w-4xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between p-5 border-b border-border">
              <h2 className="font-bold">{editing.id ? "Edit course" : "New course"}</h2>
              <button onClick={() => setEditing(null)}><X className="h-4 w-4" /></button>
            </div>

            <div className="p-5 space-y-4">
              <Field label="Title">
                <input value={editing.title || ""} onChange={(e) => setEditing({ ...editing, title: e.target.value })} className={inp} />
              </Field>
              <Field label="Description (optional)">
                <textarea
                  rows={3}
                  value={editing.description || ""}
                  onChange={(e) => setEditing({ ...editing, description: e.target.value })}
                  className={inp + " h-auto py-2"}
                />
              </Field>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Select videos</div>
                  <div className="border border-border bg-background max-h-80 overflow-y-auto divide-y divide-border">
                    {videos.map((v) => (
                      <label key={v.id} className="flex items-center gap-3 p-3 text-sm cursor-pointer">
                        <input type="checkbox" checked={selectedVideoIds.has(v.id)} onChange={() => toggleVideo(v.id)} />
                        <div className="min-w-0">
                          <div className="font-medium truncate">{v.title}</div>
                          <div className="text-xs text-muted-foreground truncate">
                            {v.quiz_id ? "Quiz assigned" : "No quiz"}
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground mb-2">Order & locks</div>
                  {(editing.items || []).length === 0 ? (
                    <p className="text-sm text-muted-foreground">Pick videos to build the course.</p>
                  ) : (
                    <div className="space-y-2">
                      {(editing.items || []).map((it, idx) => (
                        <div key={it.video_id} className="border border-border bg-background p-3">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <div className="text-xs text-muted-foreground">#{idx + 1}</div>
                              <div className="font-medium truncate">{videoTitle(it.video_id)}</div>
                              <div className="mt-2 flex items-center gap-3">
                                <label className="flex items-center gap-2 text-sm">
                                  <input
                                    type="checkbox"
                                    checked={it.locked}
                                    onChange={(e) => setLocked(it.video_id, e.target.checked)}
                                  />
                                  Locked
                                </label>
                                <div className="text-xs text-muted-foreground">
                                  {videos.find((v) => v.id === it.video_id)?.quiz_id ? "Unlock requires passing previous quiz/progress" : "Unlock via progress"}
                                </div>
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button size="sm" variant="outline" className="rounded-none" onClick={() => move(it.video_id, -1)} disabled={idx === 0}>
                                <ArrowUp className="h-3 w-3" />
                              </Button>
                              <Button size="sm" variant="outline" className="rounded-none" onClick={() => move(it.video_id, 1)} disabled={idx === (editing.items || []).length - 1}>
                                <ArrowDown className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
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
        title="Delete this course?"
        description="This action cannot be undone."
        confirmLabel="Delete"
        destructive
        onConfirm={() => {
          if (!delId) return;
          deleteMutation.mutate(delId, {
            onSuccess: () => { toast.success("Deleted"); setDelId(null); },
            onError: (e: any) => toast.error(e.message || "Delete failed"),
          });
        }}
      />
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
