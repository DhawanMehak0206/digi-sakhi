import { Link } from "react-router-dom";
import { useCategories } from "@/hooks/useSupabaseData";

export interface BlogCardData {
  id: string;
  slug: string;
  title: string;
  content: string;
  cover_image?: string | null;
  tags?: string[] | null;
  category_id?: string | null;
  created_at: string;
}

function excerpt(s: string, n = 140) {
  const plain = s.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
  return plain.length > n ? plain.slice(0, n) + "…" : plain;
}

export function BlogCard({ b }: { b: BlogCardData }) {
  const { data: categories = [] } = useCategories();
  const category = categories.find((c) => c.id === b.category_id) || null;
  const categoryLabel = category?.name || "Other";
  return (
    <Link to={`/blogs/${b.slug}`} className="group block bg-card border border-border card-hover">
      {b.cover_image && (
        <div className="aspect-[16/10] overflow-hidden bg-secondary">
          <img
            src={b.cover_image}
            alt={b.title}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
      )}
      <div className="p-5">
        <span className="inline-block text-xs font-medium uppercase tracking-wider text-accent mb-2">
          {categoryLabel}
        </span>
        <h3 className="font-semibold text-base leading-snug line-clamp-2 group-hover:text-accent transition-colors">
          {b.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-3">{excerpt(b.content)}</p>
        <div className="mt-3 text-xs text-muted-foreground">
          {new Date(b.created_at).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
        </div>
      </div>
    </Link>
  );
}
