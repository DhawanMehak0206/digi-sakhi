import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Quote, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import VisitorCounter from "@/components/site/VisitorCounter";
import { impactStats, impactTestimonials, workshopImages } from "@/lib/workshopImages";

export default function Impact() {
  useEffect(() => {
    document.title = "Impact — Digi Sakhi";
  }, []);

  return (
    <div>
      <section className="relative overflow-hidden border-b border-border" style={{ background: "var(--gradient-hero)" }}>
        <div className="container-page py-16 md:py-24 hero-on-dark">
          <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-3">Impact</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight max-w-3xl">
            Measuring what matters: women learning, building, and belonging online
          </h1>
          <p className="mt-5 text-lg hero-muted max-w-2xl">
            From a first bootcamp of 25 women to an expanding network of workshops, chapters, and
            vernacular video lessons — here&apos;s the difference DigiSakhi is making.
          </p>
          <div className="mt-6">
            <VisitorCounter variant="onDark" />
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-8">Key numbers</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {impactStats.map((stat) => (
            <div key={stat.label} className="border border-border bg-card p-6">
              <div className="text-4xl font-bold text-accent tracking-tight">{stat.value}</div>
              <p className="mt-3 text-sm text-muted-foreground leading-snug">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="py-14 bg-surface border-y border-border">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">On the ground</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            Photos from DigiSakhi workshops — hands-on mentoring, lab sessions, and graduation
            moments with learners and community partners.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {workshopImages.map((image) => (
              <div key={image.src} className="overflow-hidden aspect-[4/3]">
                <img src={image.src} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Voices from the community</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          Stories and reflections from learners and partners who make DigiSakhi&apos;s impact real.
        </p>
        <div className="grid md:grid-cols-3 gap-5">
          {impactTestimonials.map((t) => (
            <blockquote key={t.name} className="border border-border bg-card p-6">
              <Quote className="h-5 w-5 text-accent mb-3" />
              <p className="text-sm leading-relaxed">&ldquo;{t.quote}&rdquo;</p>
              <footer className="mt-4 text-sm">
                <div className="font-semibold">{t.name}</div>
                <div className="text-muted-foreground">{t.role}</div>
              </footer>
            </blockquote>
          ))}
        </div>
      </section>

      <section className="py-14 bg-surface border-t border-border">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-bold mb-3">Partners &amp; collaborators</h2>
          <p className="text-muted-foreground mb-8 max-w-2xl">
            DigiSakhi works with schools, student chapters, and NGOs to bring digital and financial
            literacy into communities across India.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="border border-border bg-card p-6 flex flex-col items-center justify-center text-center min-h-[140px]">
              <img src="/logo.png" alt="Digi Sakhi" className="h-24 w-auto object-contain bg-transparent mb-3" />
              <div className="text-sm font-semibold">DigiSakhi</div>
            </div>
            {["Schools across India", "Student chapters", "Community NGOs"].map((label) => (
              <div
                key={label}
                className="border border-border bg-card p-6 flex flex-col items-center justify-center text-center min-h-[140px]"
              >
                <div className="h-12 w-12 mb-3 bg-accent/10 text-accent flex items-center justify-center text-lg font-bold">
                  {label.charAt(0)}
                </div>
                <div className="text-sm font-semibold">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-16">
        <div className="bg-primary text-primary-foreground p-10 md:p-14 text-center">
          <h2 className="text-3xl font-bold">Help grow this impact</h2>
          <p className="mt-3 text-primary-foreground/80 max-w-xl mx-auto">
            Partner with DigiSakhi, host a workshop, or start learning with our video library.
          </p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/contact">
              <Button size="lg" className="rounded-none bg-accent hover:bg-accent/90">Get in touch</Button>
            </Link>
            <Link to="/about">
              <Button size="lg" variant="outline" className="rounded-none border-white/30 bg-transparent text-white hover:bg-white hover:text-primary">
                About DigiSakhi <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
