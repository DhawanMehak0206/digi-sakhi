import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard, type VideoCardData } from "@/components/site/VideoCard";

interface Category { id: string; name: string; slug: string }

export default function Videos() {
  const [videos, setVideos] = useState<VideoCardData[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [active, setActive] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Videos — Hertech";
    supabase.from("categories").select("*").order("name").then(({ data }) => setCats((data as any) || []));
  }, []);

  useEffect(() => {
    setLoading(true);
    let q = supabase.from("videos").select("id,title,description,youtube_url,thumbnail,category:categories(name,slug)").order("created_at", { ascending: false });
    if (active) q = q.eq("category_id", active);
    q.then(({ data }) => { setVideos((data as any) || []); setLoading(false); });
  }, [active]);

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Videos</h1>
        <p className="mt-2 text-muted-foreground">Short AI & tech videos to learn, build, and grow.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 border-b border-border">
        <button onClick={() => setActive(null)} className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${!active ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>All</button>
        {cats.map((c) => (
          <button key={c.id} onClick={() => setActive(c.id)} className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${active === c.id ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}>{c.name}</button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/3] bg-secondary animate-pulse" />)}
        </div>
      ) : videos.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No videos yet. Check back soon.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {videos.map((v) => <VideoCard key={v.id} v={v} />)}
        </div>
      )}
    </div>
  );
}
