import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronRight, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Breadcrumb {
  label: string;
  href?: string;
}

/**
 * Above-the-fold call to action.
 *
 * Interior pages previously put their first conversion button 1,500–3,600px
 * down the page — on mobile the only interactive element in the opening
 * viewport was the hamburger. A visitor arriving from search had to decide to
 * keep scrolling before the site ever asked for anything.
 *
 * `to` takes either an in-app route ("/contact") or a same-page anchor
 * ("#contact"); anchors render as a plain <a> so the browser handles the jump
 * natively instead of the router treating it as a route change.
 */
interface PageHeaderCta {
  label: string;
  to: string;
  /** Short objection-defusing line beside the button. */
  note?: ReactNode;
}

interface PageHeaderProps {
  title: string;
  highlight?: string;
  description: string;
  breadcrumbs: Breadcrumb[];
  /**
   * Optional supporting line rendered inside the header band, below the
   * description. Pages previously placed this as a sibling <p> with a
   * negative top margin, which pulled it across the header's bottom border —
   * the text ended up half on the header background and half on the page.
   */
  footnote?: ReactNode;
  cta?: PageHeaderCta;
}

export const PageHeader = ({
  title,
  highlight,
  description,
  breadcrumbs,
  footnote,
  cta,
}: PageHeaderProps) => (
  <header className="relative overflow-hidden border-b border-border/40 bg-surface-alt">
    <div className="absolute inset-0 line-grid opacity-[0.35] pointer-events-none" />
    <div className="absolute -top-24 right-0 w-[480px] h-[480px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute -bottom-32 left-0 w-[400px] h-[400px] bg-violet-500/6 rounded-full blur-[100px] pointer-events-none" />

    <div className="container mx-auto px-6 py-14 md:py-16 relative z-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            {/* The home icon renders at 14x14, which was the entire tap
                target. min-h/w-11 grows the hit area to the 44x44 guideline
                while the icon stays 14px, and -m-[15px] cancels exactly the
                15px of padding that creates, so the breadcrumb row lays out
                as it did before. */}
            <Link
              to="/"
              className="inline-flex items-center justify-center gap-1
                min-h-11 min-w-11 -m-[15px]
                hover:text-primary transition-colors"
            >
              <Home className="h-3.5 w-3.5" aria-hidden />
              <span className="sr-only">Home</span>
            </Link>
          </li>
          {breadcrumbs.map((crumb, i) => (
            <li key={i} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 opacity-40" aria-hidden />
              {crumb.href ? (
                <Link to={crumb.href} className="hover:text-primary transition-colors font-medium">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-foreground font-semibold" aria-current="page">
                  {crumb.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>

      <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 max-w-3xl">
        {title}
        {highlight && (
          <>
            {" "}
            <span className="gradient-text">{highlight}</span>
          </>
        )}
      </h1>
      <p className="text-muted-foreground text-base md:text-lg leading-relaxed max-w-2xl">
        {description}
      </p>

      {cta && (
        <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-x-4 gap-y-3">
          <Button
            asChild
            size="lg"
            className="h-12 px-7 font-bold gap-2 rounded-2xl shadow-glow-sm group w-full sm:w-auto"
          >
            {cta.to.startsWith("#") ? (
              <a href={cta.to}>
                {cta.label}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </a>
            ) : (
              <Link to={cta.to}>
                {cta.label}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            )}
          </Button>
          {cta.note && (
            <span className="text-sm text-muted-foreground">{cta.note}</span>
          )}
        </div>
      )}

      {footnote && (
        <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mt-5">
          {footnote}
        </p>
      )}
    </div>
  </header>
);
