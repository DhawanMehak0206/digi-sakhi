import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard, type VideoCardData } from "@/components/site/VideoCard";
import { BlogCard, type BlogCardData } from "@/components/site/BlogCard";
import { Search } from "lucide-react";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");
  const [videos, setVideos] = useState<VideoCardData[]>([]);
  const [blogs, setBlogs] = useState<BlogCardData[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => { document.title = "Search — Hertech"; }, []);

  useEffect(() => {
    const term = params.get("q")?.trim();
    if (!term) { setVideos([]); setBlogs([]); return; }
    setLoading(true);
    (async () => {
      const [{ data: v }, { data: b }] = await Promise.all([
        supabase.from("videos").select("id,title,description,youtube_url,thumbnail,category:categories(name,slug)").or(`title.ilike.%${term}%,description.ilike.%${term}%`),
        supabase.from("blogs").select("id,slug,title,content,cover_image,tags,created_at,category:categories(name,slug)").or(`title.ilike.%${term}%,content.ilike.%${term}%`),
      ]);
      setVideos((v as any) || []); setBlogs((b as any) || []);
      setLoading(false);
    })();
  }, [params]);

  const submit = (e: React.FormEvent) => { e.preventDefault(); setParams({ q }); };

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Search</h1>
      <form onSubmit={submit} className="relative max-w-xl mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search videos and blogs..." className="w-full h-12 pl-10 pr-4 bg-card border border-border rounded-none focus:outline-none focus:border-accent" autoFocus />
      </form>

      {loading && <p className="text-muted-foreground">Searching…</p>}

      {!loading && params.get("q") && (
        <>
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-5">Videos ({videos.length})</h2>
            {videos.length === 0 ? <p className="text-sm text-muted-foreground">No videos found.</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{videos.map((v) => <VideoCard key={v.id} v={v} />)}</div>
            )}
          </section>
          <section>
            <h2 className="text-xl font-bold mb-5">Blogs ({blogs.length})</h2>
            {blogs.length === 0 ? <p className="text-sm text-muted-foreground">No blogs found.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{blogs.map((b) => <BlogCard key={b.id} b={b} />)}</div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
