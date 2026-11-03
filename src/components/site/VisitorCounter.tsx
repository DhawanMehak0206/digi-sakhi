import { useEffect, useState } from "react";
import { Eye } from "lucide-react";
import { bumpVisitorCountOncePerSession } from "@/lib/analytics";

function formatCount(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

type Props = {
  className?: string;
  variant?: "default" | "onDark";
};

export default function VisitorCounter({ className = "", variant = "default" }: Props) {
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    void bumpVisitorCountOncePerSession().then((value) => {
      if (!cancelled) setCount(value);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  const tone =
    variant === "onDark"
      ? "text-white/90 bg-white/10 border border-white/20"
      : "text-muted-foreground";

  return (
    <div
      className={`inline-flex items-center gap-2 text-xs px-2.5 py-1.5 ${tone} ${className}`}
      aria-live="polite"
    >
      <Eye className={`h-3.5 w-3.5 ${variant === "onDark" ? "text-accent" : "text-accent"}`} />
      <span>
        {count === null ? "…" : formatCount(count)}{" "}
        <span className={variant === "onDark" ? "text-white/70" : "text-muted-foreground/80"}>
          site views
        </span>
      </span>
    </div>
  );
}
