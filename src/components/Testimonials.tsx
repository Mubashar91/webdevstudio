import { Star, Quote, ExternalLink } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { initialsOf, publishedTestimonials } from "@/data/testimonials";

/**
 * Renders client testimonials from src/data/testimonials.ts.
 *
 * Returns null when there are no verified entries, so the section simply does
 * not appear rather than showing placeholders. See that file for how to add
 * real ones.
 *
 * NOTE ON SCHEMA — deliberately no Review/AggregateRating markup here.
 * Google's structured data policy treats reviews a business collects and
 * publishes about itself as "self-serving", and they are ineligible for rich
 * results on Organization and LocalBusiness types; marking them up invites a
 * manual action rather than stars in the SERP. Testimonials still earn their
 * place as on-page social proof — they just should not be marked up. Verified
 * third-party ratings (Google Business Profile, Clutch, Trustpilot) are the
 * supported route to review stars.
 */
export const Testimonials = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 });
  const testimonials = publishedTestimonials();

  if (testimonials.length === 0) {
    if (import.meta.env.DEV) {
      console.info(
        "[Testimonials] No verified testimonials — section hidden. " +
          "Add real entries in src/data/testimonials.ts and set verified: true."
      );
    }
    return null;
  }

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-surface-alt pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />
      <div className="absolute top-0 left-1/3 w-[500px] h-[500px] bg-primary/4 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/3 w-[400px] h-[400px] bg-violet-500/4 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="section-label bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 mb-5">
            <Star className="h-4 w-4 fill-current" />
            Client Reviews
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            What Clients{" "}
            <span className="gradient-text">Say</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Don't just take my word for it — hear from clients who've experienced the difference
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {testimonials.map((t, i) => (
            <div
              key={`${t.name}-${t.company}`}
              className={`tilt-card group relative flex flex-col rounded-2xl border border-border/50 bg-card p-6
                hover:border-primary/30 hover:shadow-[0_12px_48px_hsl(var(--primary)/0.12)]
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 70}ms` }}
            >
              <Quote className="absolute top-4 right-4 h-12 w-12 text-primary/6 group-hover:text-primary/12 transition-colors" />

              <blockquote className="text-muted-foreground text-sm leading-relaxed flex-1 mb-6 relative z-10">
                "{t.content}"
              </blockquote>

              {/* Author */}
              <div className="flex items-center gap-3 pt-5 border-t border-border/40">
                <div className="relative flex-shrink-0">
                  {t.image ? (
                    <img
                      src={t.image}
                      alt=""
                      width={44}
                      height={44}
                      loading="lazy"
                      decoding="async"
                      className="w-11 h-11 rounded-full object-cover ring-2 ring-border/60
                        group-hover:ring-primary/40 transition-all duration-300"
                    />
                  ) : (
                    <div
                      aria-hidden="true"
                      className="w-11 h-11 rounded-full bg-gradient-to-br from-primary to-violet-600
                        flex items-center justify-center text-white text-sm font-bold
                        ring-2 ring-border/60 group-hover:ring-primary/40 transition-all duration-300"
                    >
                      {initialsOf(t.name)}
                    </div>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm group-hover:text-primary transition-colors">
                    {t.name}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {t.role}
                    {t.company && (
                      <>
                        {", "}
                        {t.companyUrl ? (
                          <a
                            href={t.companyUrl}
                            target="_blank"
                            rel="noopener noreferrer nofollow"
                            className="hover:text-primary transition-colors inline-flex items-center gap-0.5"
                          >
                            {t.company}
                            <ExternalLink className="h-2.5 w-2.5" />
                          </a>
                        ) : (
                          t.company
                        )}
                      </>
                    )}
                  </p>
                </div>
              </div>

              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/3 to-violet-500/3
                opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
