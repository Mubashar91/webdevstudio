/**
 * Typed façade over site.config.mjs.
 *
 * The config itself is plain ESM so the Node build scripts (sitemap +
 * prerender) can import the exact same data the React app uses. This module
 * resolves the runtime site URL and re-exports everything with types.
 */
import { latestBlogDate } from "../data/blogs";
import {
  DEFAULT_SITE_URL,
  ROUTES,
  SITE_NAME as CONFIG_SITE_NAME,
  FOUNDER_NAME as CONFIG_FOUNDER_NAME,
  CONTACT_EMAIL as CONFIG_CONTACT_EMAIL,
  SERVICE_PACKAGES as CONFIG_SERVICE_PACKAGES,
  PRICE_CURRENCY as CONFIG_PRICE_CURRENCY,
  absoluteUrl,
  ogImageUrl,
  organizationGraph,
  webPageNode,
  breadcrumbNode,
  faqNode,
  servicesServiceNode,
  buildGraph,
  findRoute,
  normalizeSiteUrl,
} from "./site.config.mjs";

export const SITE_URL: string = normalizeSiteUrl(
  (import.meta.env.VITE_SITE_URL as string | undefined) || DEFAULT_SITE_URL
);

export const SITE_NAME: string = CONFIG_SITE_NAME;
export const FOUNDER_NAME: string = CONFIG_FOUNDER_NAME;
export const CONTACT_EMAIL: string = CONFIG_CONTACT_EMAIL;
export const PRICE_CURRENCY: string = CONFIG_PRICE_CURRENCY;
export const DEFAULT_OG_IMAGE: string = ogImageUrl(SITE_URL);

/**
 * Appends " | WebDevStudio" only when the result still fits Google's ~62
 * character display limit. Past that the brand is truncated anyway, and it
 * costs characters that the actual headline needs — so long article titles
 * stand on their own.
 *
 * Lives here rather than in entry-server.tsx because the build and the
 * hydrated runtime both need it: ProjectDetail was assembling its own
 * `${title} | ${SITE_NAME}` with no length rule, so hydration could replace a
 * prerendered standalone title with a branded one Google would truncate.
 */
export function withBrand(title: string): string {
  const full = `${title} | ${SITE_NAME}`;
  return full.length <= 62 ? full : title;
}

export interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  priceFrom: number;
  unit: string;
  timeline: string;
  featured: boolean;
  includes: string[];
  /** Slug of the case study rendered as this package's proof link. */
  proofSlug?: string;
}

export const SERVICE_PACKAGES: ServicePackage[] = CONFIG_SERVICE_PACKAGES;

export interface RouteMeta {
  path: string;
  priority: string;
  changefreq: string;
  lastmod: string;
  title: string;
  description: string;
  keywords: string;
  /**
   * Short name for this route in a breadcrumb. Optional — routes whose title
   * is already "Something | WebDevStudio" derive a usable crumb from the part
   * before the pipe. Set it where that would produce the whole marketing title.
   */
  crumbLabel?: string;
}

export const PUBLIC_ROUTES: RouteMeta[] = ROUTES;

/**
 * `lastmod` for static routes whose real freshness is a function of content in
 * another module, keyed by path.
 *
 * site.config.mjs is plain ESM so the Node build scripts can import it, which
 * means it cannot read the TypeScript data modules — so a value like this one
 * had to be hand-maintained there, and duly drifted ten days behind the posts
 * it described. Derived here instead, and applied by routeMeta() below and by
 * scripts/prerender.mjs (via the re-export in entry-server.tsx) so the runtime
 * head and the prerendered head cannot disagree.
 */
export const DERIVED_LASTMOD: Record<string, string> = {
  "/blogs": latestBlogDate(),
};

export function canonicalPath(path: string): string {
  return absoluteUrl(SITE_URL, path);
}

export function routeMeta(path: string): RouteMeta | undefined {
  const route = findRoute(path);
  if (!route) return undefined;
  // Mirrors DERIVED_LASTMOD in entry-server.tsx, which does the same for the
  // prerendered HTML. Hydration replaces the prerendered JSON-LD wholesale, so
  // if only the build applied this the corrected date would survive exactly
  // until React booted and then revert.
  const derived = DERIVED_LASTMOD[path];
  return derived ? { ...route, lastmod: derived } : route;
}

/** Site-wide entity nodes — include these on every page. */
export function siteGraphNodes(): object[] {
  return organizationGraph(SITE_URL);
}

export function webPageSchema(route: RouteMeta): object {
  return webPageNode(SITE_URL, route);
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
): object {
  return {
    "@context": "https://schema.org",
    ...breadcrumbNode(SITE_URL, items),
  };
}

export function faqSchema(
  items: { question: string; answer: string }[]
): object {
  return {
    "@context": "https://schema.org",
    ...faqNode(items),
  };
}

/**
 * Builds the single @graph document for a page: site entities, the WebPage
 * node, and any page-specific nodes (breadcrumbs, FAQ, articles).
 *
 * Emitting one connected graph rather than several standalone scripts is what
 * lets Google resolve the Organization, the Person and the page as one entity.
 */
export function pageGraph(
  path: string,
  extraNodes: object[] = []
): object {
  const route = findRoute(path);
  const nodes = [
    ...organizationGraph(SITE_URL),
    ...(route ? [webPageNode(SITE_URL, route)] : []),
    ...extraNodes,
  ];
  return buildGraph(nodes);
}

/** Bare breadcrumb node (no @context) for embedding inside pageGraph. */
export function breadcrumbNodeFor(
  items: { name: string; path: string }[]
): object {
  return breadcrumbNode(SITE_URL, items);
}

/** Bare FAQ node (no @context) for embedding inside pageGraph. */
export function faqNodeFor(
  items: { question: string; answer: string }[]
): object {
  return faqNode(items);
}

/**
 * Bare Service node for /services, resolved against the runtime site URL.
 *
 * Same node the prerenderer emits, from the same builder — hydration replaces
 * the prerendered JSON-LD wholesale, so /services must include this or it
 * loses the node as soon as React takes over.
 */
export function servicesServiceNodeFor(): object {
  return servicesServiceNode(SITE_URL);
}
