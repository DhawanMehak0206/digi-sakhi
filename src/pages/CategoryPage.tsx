import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { VideoCard } from "@/components/site/VideoCard";
import { BlogCard } from "@/components/site/BlogCard";
import { useBlogs, useCategories, useVideos } from "@/hooks/useSupabaseData";

export default function CategoryPage() {
  const { name } = useParams();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  const { data: videos = [], isLoading: videosLoading } = useVideos();
  const { data: blogs = [], isLoading: blogsLoading } = useBlogs();
  const cat = useMemo(() => categories.find((c) => c.slug === name), [name, categories]);
  const cVideos = useMemo(() => (cat ? videos.filter((v) => v.category_id === cat.id) : []), [cat, videos]);
  const cBlogs = useMemo(() => (cat ? blogs.filter((b) => b.category_id === cat.id) : []), [cat, blogs]);

  useEffect(() => {
    if (cat) document.title = `${cat.name} — Hertech`;
  }, [cat]);

  if (categoriesLoading || videosLoading || blogsLoading) {
    return <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>;
  }
  if (!cat) return <div className="container-page py-20 text-center text-muted-foreground">Category not found.</div>;

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <div className="text-xs uppercase tracking-wider text-accent">Category</div>
        <h1 className="mt-1 text-3xl md:text-4xl font-bold">{cat.name}</h1>
      </header>

      <section className="mb-12">
        <h2 className="text-xl font-bold mb-5">Videos</h2>
        {cVideos.length === 0 ? (
          <p className="text-muted-foreground text-sm">No videos in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {cVideos.map((v) => <VideoCard key={v.id} v={v} />)}
          </div>
        )}
      </section>

      <section>
        <h2 className="text-xl font-bold mb-5">Blogs</h2>
        {cBlogs.length === 0 ? (
          <p className="text-muted-foreground text-sm">No blogs in this category yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {cBlogs.map((b) => <BlogCard key={b.id} b={b} />)}
          </div>
        )}
      </section>

      <div className="mt-16">
        <Link to="/" className="text-sm text-accent hover:underline">← Back to home</Link>
      </div>
    </div>
  );
}
