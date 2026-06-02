import { Link } from "react-router-dom";
import { getYouTubeThumb } from "@/lib/content";
import { PlayCircle } from "lucide-react";
import { useCourses } from "@/hooks/useSupabaseData";

export interface VideoCardData {
  id: string;
  title: string;
  description?: string | null;
  youtube_url: string;
  thumbnail?: string | null;
  category_id?: string | null;
  course_id?: string | null;
  tags?: string[];
}

export function VideoCard({ v }: { v: VideoCardData }) {
  const { data: courses = [] } = useCourses();
  const course = courses.find((c) => c.id === v.course_id) || null;
  return (
    <Link to={`/videos/${v.id}`} className="group block bg-card border border-border card-hover">
      <div className="relative aspect-video overflow-hidden bg-secondary">
        <img
          src={getYouTubeThumb(v.youtube_url, v.thumbnail)}
          alt={v.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/30 transition-colors flex items-center justify-center">
          <PlayCircle className="h-14 w-14 text-white opacity-0 group-hover:opacity-100 transition-opacity" strokeWidth={1.5} />
        </div>
        {course && (
          <span className="absolute top-2 left-2 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1">
            {course.title}
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
        {v.tags && v.tags.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {v.tags.slice(0, 3).map((t) => (
              <span key={t} className="text-[10px] uppercase tracking-wider px-2 py-0.5 bg-accent-soft text-accent">
                #{t}
              </span>
            ))}
          </div>
        )}
      </div>
    </Link>
  );
}
