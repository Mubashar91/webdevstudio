import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ChevronRight, Home } from "lucide-react";

interface Breadcrumb {
  label: string;
  href?: string;
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
}

export const PageHeader = ({
  title,
  highlight,
  description,
  breadcrumbs,
  footnote,
}: PageHeaderProps) => (
  <header className="relative overflow-hidden border-b border-border/40 bg-surface-alt">
    <div className="absolute inset-0 line-grid opacity-[0.35] pointer-events-none" />
    <div className="absolute -top-24 right-0 w-[480px] h-[480px] bg-primary/8 rounded-full blur-[120px] pointer-events-none" />
    <div className="absolute -bottom-32 left-0 w-[400px] h-[400px] bg-violet-500/6 rounded-full blur-[100px] pointer-events-none" />

    <div className="container mx-auto px-6 py-14 md:py-16 relative z-10">
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
          <li>
            <Link
              to="/"
              className="inline-flex items-center gap-1 hover:text-primary transition-colors"
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

      {footnote && (
        <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl mt-5">
          {footnote}
        </p>
      )}
    </div>
  </header>
);
