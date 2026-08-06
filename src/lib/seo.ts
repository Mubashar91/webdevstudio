/**
 * Typed façade over site.config.mjs.
 *
 * The config itself is plain ESM so the Node build scripts (sitemap +
 * prerender) can import the exact same data the React app uses. This module
 * resolves the runtime site URL and re-exports everything with types.
 */
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

export interface ServicePackage {
  id: string;
  name: string;
  tagline: string;
  priceFrom: number;
  unit: string;
  timeline: string;
  featured: boolean;
  includes: string[];
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
}

export const PUBLIC_ROUTES: RouteMeta[] = ROUTES;

export function canonicalPath(path: string): string {
  return absoluteUrl(SITE_URL, path);
}

export function routeMeta(path: string): RouteMeta | undefined {
  return findRoute(path);
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
