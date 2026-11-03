import { useEffect } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { impactStats, workshopImages } from "@/lib/workshopImages";

export default function About() {
  useEffect(() => {
    document.title = "About — Digi Sakhi";
  }, []);

  return (
    <div>
      <section className="border-b border-border bg-surface">
        <div className="container-page py-14 md:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-xs uppercase tracking-wider text-accent font-semibold mb-3">About us</p>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
              DigiSakhi — a digital friend for women learning tech
            </h1>
            <p className="mt-5 text-lg text-muted-foreground leading-relaxed">
              Founded by Mehak Dhawan, DigiSakhi closes the gap between device access and meaningful
              digital literacy for women across India.
            </p>
          </div>
          <div className="overflow-hidden aspect-[4/3]">
            <img
              src={workshopImages[0].src}
              alt={workshopImages[0].alt}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-14 md:py-16 max-w-3xl">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Meet Mehak</h2>
        <div className="space-y-5 text-muted-foreground leading-relaxed">
          <p>
            Mehak Dhawan is a 17-year-old student based in Dubai, originally from Delhi, India.
            Passionate about the intersection of technology and social impact, she has spent years
            building and experimenting with technology, seeing firsthand how powerful it can be when
            applied thoughtfully to real-world problems.
          </p>
          <p>
            During one of her frequent visits to India to see her grandparents, she found herself
            surrounded by bright, curious women eager to learn but with few outlets to do so. Struck
            by their curiosity and potential, she decided to act: organizing a hands-on bootcamp to
            teach 25 women the basics of AI, coding, and UI/UX design over eight sessions.
          </p>
          <p>
            What began as a small gesture quickly turned into a realization. Watching these women
            engage so enthusiastically with concepts they&apos;d never been exposed to before, she
            noticed something important: even when they had access to devices, they still weren&apos;t
            engaging with the digital world in any meaningful way. Access wasn&apos;t the barrier —
            something else was missing.
          </p>
          <p>
            This pushed her to dig deeper. Her research into why so many women across India remain
            digitally illiterate and financially excluded revealed something counterintuitive — the
            issue wasn&apos;t a lack of access to digital tools, but a lack of accessible, relevant
            digital literacy education built specifically for them.
          </p>
          <p>
            Determined to extend her impact beyond the 25 women in that room, she created DigiSakhi
            (meaning &ldquo;digital friend&rdquo;) — an online learning platform designed to close this
            gap at scale. DigiSakhi offers bite-sized video lessons in native vernacular Indian
            languages, built around the reality that rural women often have limited time to spare.
            Alongside its video library, the platform runs student chapters, posts regular blogs and
            hosts workshops in schools and NGOs across India, bringing digital and financial literacy
            directly to the communities that need it most.
          </p>
        </div>
      </section>

      <section className="py-14 bg-surface border-y border-border">
        <div className="container-page">
          <h2 className="text-2xl md:text-3xl font-bold mb-8">Reach so far</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {impactStats.map((stat) => (
              <div key={stat.label} className="border border-border bg-card p-5">
                <div className="text-3xl font-bold text-accent">{stat.value}</div>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-8">
            <Link to="/impact">
              <Button variant="outline" className="rounded-none">
                Explore our impact <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="container-page py-14">
        <h2 className="text-2xl md:text-3xl font-bold mb-3">Workshops in action</h2>
        <p className="text-muted-foreground mb-8 max-w-2xl">
          From classroom mentoring to certificate celebrations — moments from DigiSakhi programs
          with learners and community partners.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {workshopImages.map((image) => (
            <div key={image.src} className="overflow-hidden aspect-[4/3]">
              <img src={image.src} alt={image.alt} className="h-full w-full object-cover" loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="border border-border p-8 md:p-10 flex flex-col md:flex-row gap-8 items-center">
          <img src="/logo.png" alt="Digi Sakhi" className="h-36 w-auto object-contain bg-transparent" />
          <div>
            <h2 className="text-xl font-bold">Organization</h2>
            <p className="mt-2 text-muted-foreground max-w-xl">
              DigiSakhi partners with schools, student chapters, and NGOs across India to deliver
              workshops and vernacular digital literacy education where it matters most.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link to="/videos">
                <Button className="rounded-none bg-accent hover:bg-accent/90">Watch lessons</Button>
              </Link>
              <Link to="/contact">
                <Button variant="outline" className="rounded-none">Partner with us</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
