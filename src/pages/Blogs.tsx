import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { BlogCard, type BlogCardData } from "@/components/site/BlogCard";

export default function Blogs() {
  const [blogs, setBlogs] = useState<BlogCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    document.title = "Blogs — Hertech";
    supabase.from("blogs").select("id,slug,title,content,cover_image,tags,created_at,category:categories(name,slug)").order("created_at", { ascending: false }).then(({ data }) => {
      setBlogs((data as any) || []); setLoading(false);
    });
  }, []);

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Blogs</h1>
        <p className="mt-2 text-muted-foreground">Editorial deep-dives on AI, tools, and tech careers.</p>
      </header>
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-64 bg-secondary animate-pulse" />)}
        </div>
      ) : blogs.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No blogs published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((b) => <BlogCard key={b.id} b={b} />)}
        </div>
      )}
    </div>
  );
}
