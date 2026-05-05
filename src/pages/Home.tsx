import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { VideoCard } from "@/components/site/VideoCard";
import { BlogCard } from "@/components/site/BlogCard";
import { Button } from "@/components/ui/button";
import { ArrowRight, Cpu } from "lucide-react";
import { videos, blogs, categories } from "@/lib/mockData";

export default function Home() {
  useEffect(() => { document.title = "Hertech — AI & Tech Content for Women"; }, []);

  const trending = useMemo(() => videos.filter((v) => v.trending).slice(0, 8), []);
  const featured = useMemo(() => videos.filter((v) => v.featured).slice(0, 6), []);
  const recentBlogs = useMemo(() => blogs.slice(0, 3), []);

  return (
    <>
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-page py-20 md:py-28 hero-on-dark">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 border border-accent/40 text-sm mb-6">
              <Cpu className="h-3.5 w-3.5" /> AI &amp; Tech, for women
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Learn AI. Build the future. <span className="text-accent">On your terms.</span>
            </h1>
            <p className="mt-6 text-lg hero-muted max-w-2xl">
              Short, sharp videos and editorial blogs on artificial intelligence, tools, and tech careers — built for women shaping the future.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/videos"><Button size="lg" className="rounded-none bg-accent hover:bg-accent/90 text-white">Watch videos <ArrowRight className="ml-2 h-4 w-4" /></Button></Link>
              <Link to="/blogs"><Button size="lg" variant="outline" className="rounded-none border-white/30 bg-transparent text-white hover:bg-white hover:text-primary">Read blogs</Button></Link>
            </div>
          </div>
        </div>
      </section>

      {trending.length > 0 && (
        <section className="py-14">
          <div className="container-page">
            <SectionHeader title="Trending now" link="/videos" />
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 -mx-4 px-4 snap-x">
              {trending.map((v) => (
                <div key={v.id} className="min-w-[280px] sm:min-w-[320px] snap-start">
                  <VideoCard v={v} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="py-14 bg-surface border-y border-border">
        <div className="container-page">
          <SectionHeader title="Browse by category" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {categories.map((c) => (
              <Link key={c.id} to={`/category/${c.slug}`} className="bg-card border border-border p-5 card-hover">
                <div className="text-xs text-muted-foreground uppercase tracking-wider">Topic</div>
                <div className="mt-1 font-semibold">{c.name}</div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {featured.length > 0 && (
        <section className="py-14">
          <div className="container-page">
            <SectionHeader title="Featured videos" link="/videos" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {featured.map((v) => <VideoCard key={v.id} v={v} />)}
            </div>
          </div>
        </section>
      )}

      {recentBlogs.length > 0 && (
        <section className="py-14 bg-surface border-t border-border">
          <div className="container-page">
            <SectionHeader title="From the blog" link="/blogs" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {recentBlogs.map((b) => <BlogCard key={b.id} b={b} />)}
            </div>
          </div>
        </section>
      )}

      <section className="py-20">
        <div className="container-page">
          <div className="bg-primary text-primary-foreground p-10 md:p-14 text-center">
            <h2 className="text-3xl md:text-4xl font-bold">Ready to dive deeper?</h2>
            <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">Explore our full library of AI & tech content and start building today.</p>
            <Link to="/videos" className="inline-block mt-6">
              <Button size="lg" className="rounded-none bg-accent hover:bg-accent/90">Explore the library</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function SectionHeader({ title, link }: { title: string; link?: string }) {
  return (
    <div className="flex items-end justify-between mb-6">
      <h2 className="text-2xl md:text-3xl font-bold tracking-tight">{title}</h2>
      {link && (
        <Link to={link} className="text-sm font-medium text-accent hover:underline inline-flex items-center gap-1">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      )}
    </div>
  );
}
