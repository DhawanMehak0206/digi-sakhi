import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { getYouTubeId } from "@/lib/content";
import { VideoCard, type VideoCardData } from "@/components/site/VideoCard";

export default function VideoDetail() {
  const { id } = useParams();
  const [video, setVideo] = useState<any>(null);
  const [related, setRelated] = useState<VideoCardData[]>([]);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const { data } = await supabase.from("videos").select("*, category:categories(name,slug)").eq("id", id).maybeSingle();
      if (!data) { setNotFound(true); return; }
      setVideo(data);
      document.title = `${data.title} — Hertech`;
      const { data: rel } = await supabase
        .from("videos")
        .select("id,title,description,youtube_url,thumbnail,category:categories(name,slug)")
        .neq("id", id)
        .eq("category_id", data.category_id || "")
        .limit(3);
      setRelated((rel as any) || []);
    })();
  }, [id]);

  if (notFound) return <div className="container-page py-20 text-center">Video not found. <Link to="/videos" className="text-accent">Back to videos</Link></div>;
  if (!video) return <div className="container-page py-20 text-center text-muted-foreground">Loading…</div>;

  const ytId = getYouTubeId(video.youtube_url);

  return (
    <div className="container-page py-8 lg:py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          <div className="aspect-video bg-primary mb-6">
            {ytId ? (
              <iframe className="w-full h-full" src={`https://www.youtube.com/embed/${ytId}`} title={video.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
            ) : (
              <div className="flex items-center justify-center h-full text-primary-foreground text-sm">Invalid video URL</div>
            )}
          </div>
          {video.category && (
            <Link to={`/category/${video.category.slug}`} className="text-xs uppercase tracking-wider text-accent font-medium">{video.category.name}</Link>
          )}
          <h1 className="mt-2 text-2xl md:text-3xl font-bold">{video.title}</h1>
          {video.description && <p className="mt-4 text-muted-foreground whitespace-pre-line">{video.description}</p>}
        </article>

        <aside>
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4">Related</h2>
          <div className="grid gap-4">
            {related.length === 0 && <p className="text-sm text-muted-foreground">No related videos yet.</p>}
            {related.map((v) => <VideoCard key={v.id} v={v} />)}
          </div>
        </aside>
      </div>
    </div>
  );
}
