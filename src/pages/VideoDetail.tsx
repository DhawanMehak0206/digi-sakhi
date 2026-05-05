import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getYouTubeId } from "@/lib/content";
import { VideoCard } from "@/components/site/VideoCard";
import { videos, getCategoryById } from "@/lib/mockData";

export default function VideoDetail() {
  const { id } = useParams();
  const video = useMemo(() => videos.find((v) => v.id === id), [id]);
  const category = getCategoryById(video?.category_id);
  const related = useMemo(
    () => video ? videos.filter((v) => v.id !== video.id && v.category_id === video.category_id).slice(0, 3) : [],
    [video]
  );

  useEffect(() => {
    if (video) document.title = `${video.title} — Hertech`;
  }, [video]);

  if (!video) return <div className="container-page py-20 text-center">Video not found. <Link to="/videos" className="text-accent">Back to videos</Link></div>;

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
          {category && (
            <Link to={`/category/${category.slug}`} className="text-xs uppercase tracking-wider text-accent font-medium">{category.name}</Link>
          )}
          <h1 className="mt-2 text-2xl md:text-3xl font-bold">{video.title}</h1>
          {video.description && <p className="mt-4 text-muted-foreground whitespace-pre-line">{video.description}</p>}
          {video.tags && video.tags.length > 0 && (
            <div className="mt-6 pt-6 border-t border-border flex flex-wrap gap-2">
              {video.tags.map((t) => (
                <span key={t} className="text-xs px-2 py-1 bg-secondary text-secondary-foreground">#{t}</span>
              ))}
            </div>
          )}
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
