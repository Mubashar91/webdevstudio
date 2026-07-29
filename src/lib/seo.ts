/** Canonical site URL — set VITE_SITE_URL in production if the domain differs */
export const SITE_URL =
  (import.meta.env.VITE_SITE_URL as string | undefined)?.replace(/\/$/, "") ||
  "https://webdevstudio.me";

export const SITE_NAME = "WebDevStudio";
/** The individual behind the studio — used for Person schema and bio content, not the site brand. */
export const FOUNDER_NAME = "Muhammad Mubashar Shahzad";
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-image.jpg`;

export const PUBLIC_ROUTES = [
  { path: "/", priority: "1.0", changefreq: "weekly" },
  { path: "/about", priority: "0.8", changefreq: "monthly" },
  { path: "/projects", priority: "0.9", changefreq: "weekly" },
  { path: "/blogs", priority: "0.8", changefreq: "weekly" },
  { path: "/services", priority: "0.8", changefreq: "monthly" },
  { path: "/contact", priority: "0.7", changefreq: "monthly" },
  { path: "/web-development-new-zealand", priority: "0.85", changefreq: "monthly" },
  { path: "/web-development-cyprus", priority: "0.85", changefreq: "monthly" },
] as const;

export function canonicalPath(path: string): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `${SITE_URL}/` : `${SITE_URL}${normalized}`;
}

export function breadcrumbSchema(
  items: { name: string; path: string }[]
): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: canonicalPath(item.path),
    })),
  };
}

export function faqSchema(items: { question: string; answer: string }[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
