import { useEffect, useMemo, useState } from "react";
import { BlogCard } from "@/components/site/BlogCard";
import { useBlogs, useCategories } from "@/hooks/useSupabaseData";

export default function Blogs() {
  const [active, setActive] = useState<string>("all");
  const { data: blogs = [], isLoading } = useBlogs();
  const { data: categories = [], isLoading: categoriesLoading } = useCategories();
  useEffect(() => { document.title = "Blogs — Hertech"; }, []);

  const filtered = useMemo(() => {
    if (active === "all") return blogs;
    if (active === "other") return blogs.filter((blog) => !blog.category_id);
    const category = categories.find((entry) => entry.slug === active);
    return category ? blogs.filter((blog) => blog.category_id === category.id) : blogs;
  }, [active, blogs, categories]);

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Blogs</h1>
        <p className="mt-2 text-muted-foreground">Editorial deep-dives on AI, tools, and tech careers.</p>
      </header>
      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-3 mb-6 border-b border-border">
        <button
          onClick={() => setActive("all")}
          className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${active === "all" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => setActive(category.slug)}
            className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${active === category.slug ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}
          >
            {category.name}
          </button>
        ))}
        <button
          onClick={() => setActive("other")}
          className={`px-3 py-2 text-sm whitespace-nowrap border-b-2 -mb-px ${active === "other" ? "border-accent text-accent" : "border-transparent text-muted-foreground hover:text-foreground"}`}
        >
          Other
        </button>
      </div>
      {isLoading || categoriesLoading ? (
        <div className="py-20 text-center text-muted-foreground">Loading…</div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No blogs published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((b) => <BlogCard key={b.id} b={b} />)}
        </div>
      )}
    </div>
  );
}
