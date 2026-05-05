import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { VideoCard, type VideoCardData } from "@/components/site/VideoCard";
import { BlogCard, type BlogCardData } from "@/components/site/BlogCard";

export default function CategoryPage() {
  const { name } = useParams();
  const [cat, setCat] = useState<any>(null);
  const [videos, setVideos] = useState<VideoCardData[]>([]);
  const [blogs, setBlogs] = useState<BlogCardData[]>([]);

  useEffect(() => {
    if (!name) return;
    (async () => {
      const { data: c } = await supabase.from("categories").select("*").eq("slug", name).maybeSingle();
      setCat(c);
      if (!c) return;
      document.title = `${c.name} — Hertech`;
      const [{ data: v }, { data: b }] = await Promise.all([
        supabase.from("videos").select("id,title,description,youtube_url,thumbnail,category:categories(name,slug)").eq("category_id", c.id).order("created_at", { ascending: false }),
        supabase.from("blogs").select("id,slug,title,content,cover_image,tags,created_at,category:categories(name,slug)").eq("category_id", c.id).order("created_at", { ascending: false }),
      ]);
      setVideos((v as any) || []); setBlogs((b as any) || []);
    })();
  }, [name]);

  if (!cat) return <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-wider text-accent">Category</div>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold">{cat.name}</h1>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-5">Videos</h2>
        {videos.length === 0 ? (
          <p className="text-muted-foreground text-sm">No videos in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {videos.map((v) => <VideoCard key={v.id} v={v} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-5">Blogs</h2>
        {blogs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No blogs in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {blogs.map((b) => <BlogCard key={b.id} b={b} />)}
          </div>
        )}
      </section>

      <div className="mt-16">
        <Link to="/" className="text-sm text-accent hover:underline">← Back to home</Link>
      </div>
    </div>
  );
}
