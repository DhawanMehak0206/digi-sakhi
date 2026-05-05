import { Link } from "react-router-dom";
import { getYouTubeThumb } from "@/lib/content";
import { Play } from "lucide-react";

export interface VideoCardData {
  id: string;
  title: string;
  description?: string | null;
  youtube_url: string;
  thumbnail?: string | null;
  category?: { name: string; slug: string } | null;
}

export function VideoCard({ v }: { v: VideoCardData }) {
  return (
    <Link to={`/videos/${v.id}`} className="group block bg-card border border-border card-hover">
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <img
          src={getYouTubeThumb(v.youtube_url, v.thumbnail)}
          alt={v.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/20 transition-colors flex items-center justify-center">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity h-12 w-12 bg-accent text-accent-foreground flex items-center justify-center">
            <Play className="h-5 w-5 fill-current" />
          </div>
        </div>
        {v.category && (
          <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1">
            {v.category.name}
          </span>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-sm leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {v.title}
        </h3>
        {v.description && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">{v.description}</p>
        )}
      </div>
    </Link>
  );
}
