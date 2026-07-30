import { Link } from "react-router-dom";
import { Check, Tag, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { SERVICE_PACKAGES } from "@/lib/seo";

interface PricingProps {
  compactHeader?: boolean;
}

/**
 * Pricing tiers. Reads SERVICE_PACKAGES from site.config.mjs — the same source
 * that generates the Offer/PriceSpecification schema — so the prices shown on
 * the page and the prices in structured data can never disagree. Mismatched
 * prices are a structured-data policy violation, not just an inconsistency.
 */
export const Pricing = ({ compactHeader = false }: PricingProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  return (
    <section id="pricing" className="py-24 relative overflow-hidden">
      {/* No alt band here. On the homepage this sits between Projects and
          Blogs, which are both alt — three identical bands in a row merged
          into one undifferentiated slab. Alternating base/alt gives the page
          its rhythm. */}
      <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />
      <div className="absolute top-0 right-1/4 w-[520px] h-[520px] bg-primary/4 rounded-full blur-[130px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        {!compactHeader && (
          <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="section-label mb-5">
              <Tag className="h-4 w-4" />
              Pricing
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
              Clear pricing,{" "}
              <span className="gradient-text">no surprises</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Every project starts with a free call and a fixed written quote.
              You approve the scope and the number before any work begins.
            </p>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
          {SERVICE_PACKAGES.map((pkg, i) => (
            <div
              key={pkg.id}
              className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-500
                ${pkg.featured
                  ? "border-primary/40 bg-card shadow-[0_16px_56px_hsl(var(--primary)/0.16)] md:-mt-4 md:pb-9"
                  : "border-border/50 bg-card shadow-card hover:border-primary/25 hover:shadow-card-hover"}
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${i * 90}ms` }}
            >
              {pkg.featured && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full
                  bg-gradient-to-r from-primary to-violet-600 text-white text-xs md:text-[11px] font-bold
                  uppercase tracking-wider shadow-glow-sm whitespace-nowrap">
                  Most popular
                </span>
              )}

              <h3 className="text-lg font-extrabold mb-1.5">{pkg.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6 min-h-[2.5rem]">
                {pkg.tagline}
              </p>

              {/* Price. "from" sits on its own line rather than inline —
                  at three columns the inline version pushed "/project" past
                  the card edge and clipped it. */}
              <p className="text-xs md:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.14em] mb-1">
                from
              </p>
              <div className="flex items-baseline flex-wrap gap-x-1.5 mb-1">
                <span className="text-3xl lg:text-4xl font-extrabold tracking-tight">
                  ${pkg.priceFrom.toLocaleString("en-US")}
                </span>
                <span className="text-sm text-muted-foreground font-medium">
                  /{pkg.unit}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-6">
                Typical delivery: {pkg.timeline}
              </p>

              <ul className="space-y-3 mb-8 flex-1">
                {pkg.includes.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <span className="text-foreground/80 leading-snug">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                variant={pkg.featured ? "default" : "outline"}
                className={`w-full h-11 font-bold rounded-xl gap-2 group
                  ${pkg.featured ? "shadow-glow-sm" : ""}`}
              >
                <Link to="/contact">
                  Get a quote
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </div>
          ))}
        </div>

        {/* Reassurance footer */}
        <div className={`max-w-6xl mx-auto mt-10 flex flex-col sm:flex-row items-center justify-center
          gap-x-8 gap-y-3 text-sm text-muted-foreground transition-all duration-700 delay-300
          ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <span className="inline-flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-primary" />
            Fixed price agreed before work starts
          </span>
          <span className="hidden sm:inline text-border">·</span>
          <span>Invoiced in USD, EUR or NZD</span>
          <span className="hidden sm:inline text-border">·</span>
          <span>Happy to work under your NDA</span>
        </div>
      </div>
    </section>
  );
};
