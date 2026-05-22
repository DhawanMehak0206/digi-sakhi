import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { VideoCard } from "@/components/site/VideoCard";
import { BlogCard } from "@/components/site/BlogCard";
import { Search } from "lucide-react";
import { useBlogs, useVideos } from "@/hooks/useSupabaseData";

export default function SearchPage() {
  const { data: videos = [], isLoading: videosLoading } = useVideos();
  const { data: blogs = [], isLoading: blogsLoading } = useBlogs();
  const [params, setParams] = useSearchParams();
  const [q, setQ] = useState(params.get("q") || "");

  useEffect(() => { document.title = "Search — Hertech"; }, []);

  const term = (params.get("q") || "").trim().toLowerCase();
  const vResults = useMemo(() => !term ? [] : videos.filter((v) =>
    v.title.toLowerCase().includes(term) ||
    (v.description || "").toLowerCase().includes(term) ||
    (v.tags || []).some((t) => t.toLowerCase().includes(term))
  ), [term]);
  const bResults = useMemo(() => !term ? [] : blogs.filter((b) =>
    b.title.toLowerCase().includes(term) ||
    b.content.toLowerCase().includes(term) ||
    (b.tags || []).some((t) => t.toLowerCase().includes(term))
  ), [term]);

  const submit = (e: React.FormEvent) => { e.preventDefault(); setParams({ q }); };

  return (
    <div className="container-page py-10">
      <h1 className="text-3xl md:text-4xl font-bold mb-6">Search</h1>
      <form onSubmit={submit} className="relative max-w-xl mb-10">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search videos and blogs..." className="w-full h-12 pl-10 pr-4 bg-card border border-border rounded-none focus:outline-none focus:border-accent" autoFocus />
      </form>

      {term && (
        <>
          {(videosLoading || blogsLoading) && (
            <div className="py-10 text-sm text-muted-foreground">Loading…</div>
          )}
          <section className="mb-12">
            <h2 className="text-xl font-bold mb-5">Videos ({vResults.length})</h2>
            {vResults.length === 0 ? <p className="text-sm text-muted-foreground">No videos found.</p> : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">{vResults.map((v) => <VideoCard key={v.id} v={v} />)}</div>
            )}
          </section>
          <section>
            <h2 className="text-xl font-bold mb-5">Blogs ({bResults.length})</h2>
            {bResults.length === 0 ? <p className="text-sm text-muted-foreground">No blogs found.</p> : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">{bResults.map((b) => <BlogCard key={b.id} b={b} />)}</div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
