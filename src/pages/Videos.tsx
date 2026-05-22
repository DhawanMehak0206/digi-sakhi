import { useEffect, useMemo, useState } from "react";
import { VideoCard } from "@/components/site/VideoCard";
import { useCategories, useVideos } from "@/hooks/useSupabaseData";

export default function Videos() {
  const [active, setActive] = useState<string | null>(null);
  const { data: videos = [], isLoading: videosLoading } = useVideos();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();

  useEffect(() => { document.title = "Videos — Hertech"; }, []);

  const list = useMemo(
    () => active ? videos.filter((v) => v.category_id === active) : videos,
    [active, videos]
  );

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Videos</h1>
        <p className="mt-2 text-muted-foreground">Short AI & tech videos to learn, build, and grow.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 border-b border-border">
        <button onClick={() => setActive(null)} className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${!active ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>All</button>
        {categories.map((c) => (
          <button key={c.id} onClick={() => setActive(c.id)} className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${active === c.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{c.name}</button>
        ))}
      </div>

      {(videosLoading || categoriesLoading) && (
        <div className="py-20 text-center text-muted-foreground">Loading…</div>
      )}

      {list.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No videos in this category.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {list.map((v) => <VideoCard key={v.id} v={v} />)}
        </div>
      )}
    </div>
  );
}
