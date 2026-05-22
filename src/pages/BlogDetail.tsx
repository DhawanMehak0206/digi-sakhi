import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { BlogCard } from "@/components/site/BlogCard";
import { useBlogBySlug, useBlogs, useCategories } from "@/hooks/useSupabaseData";

export default function BlogDetail() {
  const { slug } = useParams();
  const { data: blog, isLoading } = useBlogBySlug(slug);
  const { data: blogs = [] } = useBlogs();
  const { data: categories = [] } = useCategories();
  const category = blog ? categories.find((c) => c.id === blog.category_id) || null : null;
  const related = useMemo(
    () => (blog ? blogs.filter((b) => b.id !== blog.id).slice(0, 3) : []),
    [blog, blogs]
  );

  useEffect(() => {
    if (blog) document.title = `${blog.title} — Hertech`;
  }, [blog]);

  if (isLoading) return <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>;
  if (!blog) return <div className="container-page py-20 text-center">Blog not found. <Link to="/blogs" className="text-accent">Back to blogs</Link></div>;

  return (
    <article className="container-page py-10 max-w-3xl">
      {category && (
        <Link to={`/category/${category.slug}`} className="text-xs uppercase tracking-wider text-accent font-medium">{category.name}</Link>
      )}
      <h1 className="mt-2 text-3xl md:text-5xl font-bold tracking-tight leading-tight">{blog.title}</h1>
      <div className="mt-3 text-sm text-muted-foreground">
        {new Date(blog.created_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
      </div>
      {blog.cover_image && (
        <div className="my-8 aspect-[16/9] overflow-hidden bg-secondary">
          <img src={blog.cover_image} alt={blog.title} className="w-full h-full object-cover" />
        </div>
      )}
      <div
        className="prose prose-neutral dark:prose-invert max-w-none prose-headings:font-bold prose-a:text-accent prose-img:my-6"
        dangerouslySetInnerHTML={{ __html: blog.content }}
      />
      {blog.tags && blog.tags.length > 0 && (
        <div className="mt-10 pt-6 border-t border-border flex flex-wrap gap-2">
          {blog.tags.map((t) => (
            <span key={t} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground">#{t}</span>
          ))}
        </div>
      )}

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="text-xl font-bold mb-5">Related reads</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {related.map((b) => <BlogCard key={b.id} b={b} />)}
          </div>
        </section>
      )}
    </article>
  );
}
