import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

export interface Crumb {
  label: string;
  /** Omitted on the last crumb — the current page is not a link to itself. */
  href?: string;
}

/**
 * The visible breadcrumb trail.
 *
 * Extracted from PageHeader, which is where it used to live inline. That made
 * the trail available only to pages built on PageHeader, and /about and the
 * project detail pages are not — so the two page types carrying the site's
 * strongest trust signals were the only ones shipping BreadcrumbList JSON-LD
 * with no visible trail to match it. Google wants the markup and the visible
 * navigation to agree.
 *
 * Home is an icon with a visually-hidden label rather than an aria-label, so
 * "Home" is present in textContent for crawlers and LLM scrapers too.
 */
export const Breadcrumbs = ({
  items,
  className = "",
}: {
  items: Crumb[];
  className?: string;
}) => (
  <nav aria-label="Breadcrumb" className={className}>
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
      {items.map((crumb, i) => (
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
);
