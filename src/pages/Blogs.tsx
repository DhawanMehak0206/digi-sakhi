import { useEffect } from "react";
import { BlogCard } from "@/components/site/BlogCard";
import { blogs } from "@/lib/mockData";

export default function Blogs() {
  useEffect(() => { document.title = "Blogs — Hertech"; }, []);

  return (
    <div className="container-page py-10">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Blogs</h1>
        <p className="mt-2 text-muted-foreground">Editorial deep-dives on AI, tools, and tech careers.</p>
      </header>
      {blogs.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground">No blogs published yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {blogs.map((b) => <BlogCard key={b.id} b={b} />)}
        </div>
      )}
    </div>
  );
}
