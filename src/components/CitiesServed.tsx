import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

export interface CitiesServedProps {
  /** Eyebrow label above the heading, e.g. "Coverage" */
  eyebrow?: string;
  /** Section heading, e.g. "Cities I work with across New Zealand" */
  heading: string;
  /** One or two sentences under the heading */
  intro: string;
  /** City names in the order you want them read */
  cities: string[];
  /**
   * Optional city -> route map for cities that have their own landing page.
   *
   * /web-developer-auckland shipped with a route, meta, FAQs and schema, but
   * nothing on the site ever linked to it — a full-site crawl found it as the
   * only orphan page (0 inbound internal links) while still sitting in the
   * sitemap. A page reachable only from sitemap.xml is a page Google has
   * little reason to rank. Cities without an entry stay plain text.
   */
  cityLinks?: Record<string, string>;
  /** Short closing line under the city grid */
  note?: string;
  /** Where the CTA points */
  ctaHref?: string;
  ctaLabel?: string;
}

/**
 * Names individual cities in visible body copy.
 *
 * This exists because city names were previously only present in the
 * `keywords` meta tag (ignored by Google since 2009) and the `areaServed`
 * schema. Search Console showed the difference clearly: Nicosia, which is named
 * in the Cyprus page copy, is the site's strongest non-brand query, while
 * Hamilton was pulling impressions despite appearing nowhere on the site.
 *
 * Keep the `cities` array in sync with `areaServed` — both now read from
 * src/data/geoPageData.ts precisely so they can't diverge.
 */
export const CitiesServed = ({
  eyebrow = "Coverage",
  heading,
  intro,
  cities,
  cityLinks,
  note,
  ctaHref = "/contact",
  ctaLabel = "Book a free 30-min call",
}: CitiesServedProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section
      aria-labelledby="cities-served-heading"
      className="py-24 border-t border-border/40 relative overflow-hidden"
    >
      <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />

      <div
        ref={ref}
        className={`container mx-auto px-6 relative z-10 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <div className="section-label mb-6">
          <MapPin className="h-4 w-4" />
          {eyebrow}
        </div>

        <h2
          id="cities-served-heading"
          className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4 max-w-3xl"
        >
          {heading}
        </h2>

        <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
          {intro}
        </p>

        <ul className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cities.map((city) => {
            const href = cityLinks?.[city];
            return (
              <li
                key={city}
                className="rounded-xl border border-border/50 bg-card text-center
                  text-sm font-bold shadow-card
                  hover:border-primary/40 hover:text-primary transition-colors duration-300"
              >
                {href ? (
                  // block + padding on the anchor, not the li, so the whole
                  // tile stays a 44px+ tap target rather than just the word.
                  <Link to={href} className="block px-4 py-3">
                    {city}
                  </Link>
                ) : (
                  <span className="block px-4 py-3">{city}</span>
                )}
              </li>
            );
          })}
        </ul>

        {note && (
          <p className="mt-8 max-w-2xl text-sm md:text-base leading-relaxed text-muted-foreground">
            {note}
          </p>
        )}

        <Button
          asChild
          size="lg"
          className="mt-8 h-12 px-7 font-bold gap-2 rounded-2xl shadow-glow-sm group"
        >
          <Link to={ctaHref}>
            {ctaLabel}
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </section>
  );
};

export default CitiesServed;
