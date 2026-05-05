import { useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { getYouTubeId, getYouTubeThumb } from "@/lib/content";
import { videos, getCategoryById } from "@/lib/mockData";
import Comments from "@/components/site/Comments";

export default function VideoDetail() {
  const { id } = useParams();
  const video = useMemo(() => videos.find((v) => v.id === id), [id]);
  const category = getCategoryById(video?.category_id);
  const recommendations = useMemo(
    () => video ? videos.filter((v) => v.id !== video.id).slice(0, 8) : [],
    [video]
  );

  useEffect(() => {
    if (video) document.title = `${video.title} — Hertech`;
    window.scrollTo(0, 0);
  }, [video]);

  if (!video) return <div className="container-page py-20 text-center">Video not found. <Link to="/videos" className="text-accent">Back to videos</Link></div>;

  const ytId = getYouTubeId(video.youtube_url);

  return (
    <div className="container-page py-8 lg:py-10">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 min-w-0">
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

          <Comments videoId={video.id} />
        </div>

        <aside className="space-y-3">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-2">Up next</h2>
          {recommendations.map((v) => (
            <Link
              key={v.id}
              to={`/videos/${v.id}`}
              className="flex gap-3 bg-card border border-border p-2 hover:border-accent transition-colors group"
            >
              <div className="relative w-32 aspect-video shrink-0 overflow-hidden bg-secondary">
                <img
                  src={getYouTubeThumb(v.youtube_url, v.thumbnail)}
                  alt={v.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="min-w-0 py-1">
                <h3 className="text-sm font-semibold leading-snug line-clamp-2 group-hover:text-accent transition-colors">
                  {v.title}
                </h3>
                {getCategoryById(v.category_id) && (
                  <div className="mt-1 text-[11px] uppercase tracking-wider text-muted-foreground">
                    {getCategoryById(v.category_id)?.name}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </aside>
      </div>
    </div>
  );
}
