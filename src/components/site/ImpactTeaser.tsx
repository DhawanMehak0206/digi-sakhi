import { Link } from "react-router-dom";
import { ArrowRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { impactStats, impactTestimonials, workshopImages } from "@/lib/workshopImages";

export default function ImpactTeaser() {
  return (
    <section className="py-16 md:py-20 border-b border-border bg-surface">
      <div className="container-page">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div className="max-w-2xl">
            <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-2">Impact</p>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">
              Real workshops. Real learners. Real change.
            </h2>
            <p className="mt-3 text-muted-foreground">
              DigiSakhi began with 25 women in a room — and is growing into a platform for digital
              and financial literacy across India.
            </p>
          </div>
          <Link to="/impact">
            <Button variant="outline" className="rounded-none">
              See full impact <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-12">
          {impactStats.map((stat) => (
            <div key={stat.label} className="border border-border bg-card p-5 md:p-6">
              <div className="text-3xl md:text-4xl font-bold text-accent tracking-tight">{stat.value}</div>
              <p className="mt-2 text-sm text-muted-foreground leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-3 mb-12">
          {workshopImages.slice(0, 3).map((image) => (
            <div key={image.src} className="overflow-hidden aspect-[4/3]">
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-5">
          {impactTestimonials.map((t) => (
            <blockquote key={t.name} className="border border-border bg-card p-6">
              <Quote className="h-5 w-5 text-accent mb-3" />
              <p className="text-sm leading-relaxed text-foreground/90">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </footer>
            </blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
