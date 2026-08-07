import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppProviders, AppRoutes } from "./App";
import { BLOG_POSTS, faqsOf, wordCountOf } from "./data/blogs";
import { buildAreaServed, cyGeo, nzGeo } from "./data/geoPageData";
import { STATIC_PROJECTS } from "./data/projects";
import {
  SITE_NAME,
  absoluteUrl,
  servicesServiceNode,
} from "./lib/site.config.mjs";

/**
 * Blog and project detail routes, derived from the same data the pages render.
 *
 * Exported for scripts/prerender.mjs, which cannot import the TypeScript data
 * modules directly. Without these, /blogs/:slug and /projects/:id fell through
 * the SPA rewrite to index.html — and since index.html is now the fully
 * prerendered homepage, every detail URL served homepage content with
 * `canonical` pointing at "/", declaring all nine pages duplicates of the home
 * page.
 */
/**
 * Appends " | WebDevStudio" only when the result still fits Google's ~62
 * character display limit. Past that the brand is truncated anyway, and it
 * costs characters that the actual headline needs — so long article titles
 * stand on their own.
 */
function withBrand(title: string): string {
  const full = `${title} | ${SITE_NAME}`;
  return full.length <= 62 ? full : title;
}

export const DYNAMIC_ROUTES = [
  ...BLOG_POSTS.map((post) => ({
    path: `/blogs/${post.slug}`,
    title: withBrand(post.title),
    description: post.excerpt,
    keywords: post.tags.join(", "),
    lastmod: post.updatedAt ?? post.publishedAt,
    changefreq: "monthly",
    priority: "0.7",
    ogType: "article",
    image: post.coverImage,
    // routeGraph() emits FAQPage whenever a route carries FAQs, the same path
    // /services and the location pages already use. The three buyer-intent
    // posts target question-format queries and had the Q&A on the page but no
    // markup around it, so AI Overviews and Copilot had nothing to extract.
    // Empty for posts with no FAQ section, and `faqs?.length` gates the node.
    faqs: faqsOf(post),
  })),
  ...STATIC_PROJECTS.map((project) => ({
    path: `/projects/${project._id}`,
    title: withBrand(project.title),
    description: project.description,
    keywords: project.technologies.join(", "),
    lastmod: project.updatedAt,
    changefreq: "monthly",
    priority: "0.6",
    ogType: "article",
    image: project.image,
  })),
];

/**
 * Page-specific Schema.org nodes, keyed by route path.
 *
 * These previously existed ONLY in the JSON-LD that useSEO() injects at
 * runtime, so the prerendered HTML carried just the site-wide entities plus
 * WebPage/BreadcrumbList. Googlebot renders JS and would eventually see them,
 * but the AI crawlers robots.txt invites in do not — meaning BlogPosting,
 * the project ItemList and the country-scoped Service nodes were invisible to
 * exactly the engines this site is trying to be cited by.
 *
 * Built here rather than in site.config.mjs because these nodes derive from
 * the TypeScript data modules, which the plain-ESM config cannot import.
 */
export function pageSchema(siteUrl: string): Record<string, object[]> {
  const url = (p: string) => absoluteUrl(siteUrl, p);
  const orgRef = { "@id": `${url("/")}#organization` };
  const founderRef = { "@id": `${url("/")}#founder` };

  const map: Record<string, object[]> = {
    // Shared with the React runtime via site.config.mjs — see the note there
    // on why this must not be built twice.
    "/services": [servicesServiceNode(siteUrl)],
    "/projects": [
      {
        "@type": "CollectionPage",
        "@id": `${url("/projects")}#collection`,
        name: "Projects by WebDevStudio",
        url: url("/projects"),
        author: orgRef,
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: STATIC_PROJECTS.length,
          itemListElement: STATIC_PROJECTS.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "CreativeWork",
              name: p.title,
              description: p.description,
              url: url(`/projects/${p._id}`),
              keywords: p.technologies.join(", "),
              creator: orgRef,
            },
          })),
        },
      },
    ],
    "/blogs": [
      {
        "@type": "Blog",
        "@id": `${url("/blogs")}#blog`,
        name: "WebDevStudio — Developer Blog",
        url: url("/blogs"),
        publisher: orgRef,
        blogPost: BLOG_POSTS.map((post) => ({
          "@type": "BlogPosting",
          "@id": `${url(`/blogs/${post.slug}`)}#article`,
          headline: post.title,
          description: post.excerpt,
          url: url(`/blogs/${post.slug}`),
          image: post.coverImage,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt ?? post.publishedAt,
          keywords: post.tags.join(", "),
          author: founderRef,
          publisher: orgRef,
        })),
      },
    ],
    "/about": [
      {
        "@type": "AboutPage",
        "@id": `${url("/about")}#aboutpage`,
        url: url("/about"),
        mainEntity: founderRef,
      },
    ],
    "/contact": [
      {
        "@type": "ContactPage",
        "@id": `${url("/contact")}#contactpage`,
        url: url("/contact"),
        mainEntity: orgRef,
      },
    ],
  };

  // Country-scoped Service nodes for the two location landing pages. These
  // are the highest-intent pages on the site, and the areaServed cities are
  // exactly what an AI engine matches on for "React developer in Limassol".
  // The city list comes from geoPageData rather than being written out here.
  // That module is also what the pages render their visible "Cities I work
  // with" section from, so a city can never be claimed in areaServed without
  // also appearing in the page copy.
  const locations = [
    { path: "/web-development-new-zealand", geo: nzGeo },
    { path: "/web-development-cyprus", geo: cyGeo },
  ];
  for (const { path, geo } of locations) {
    map[path] = [
      {
        "@type": "Service",
        "@id": `${url(path)}#service`,
        name: `Web Development Services for ${geo.country} Businesses`,
        description: `Remote React.js, MERN stack, and full-stack web development for businesses in ${geo.country}, delivered by ${SITE_NAME}.`,
        url: url(path),
        serviceType: "Web Development",
        provider: orgRef,
        areaServed: buildAreaServed(geo),
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: url("/contact"),
          availableLanguage: { "@type": "Language", name: "English" },
        },
      },
    ];
  }

  // Individual article pages — the roadmap's highest-priority schema gap.
  for (const post of BLOG_POSTS) {
    map[`/blogs/${post.slug}`] = [
      {
        "@type": "BlogPosting",
        "@id": `${url(`/blogs/${post.slug}`)}#article`,
        headline: post.title,
        description: post.excerpt,
        url: url(`/blogs/${post.slug}`),
        mainEntityOfPage: url(`/blogs/${post.slug}`),
        image: post.coverImage,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt ?? post.publishedAt,
        keywords: post.tags.join(", "),
        articleSection: post.category,
        wordCount: wordCountOf(post),
        inLanguage: "en",
        author: founderRef,
        publisher: orgRef,
      },
    ];
  }

  // Individual case-study pages.
  for (const p of STATIC_PROJECTS) {
    map[`/projects/${p._id}`] = [
      {
        "@type": "CreativeWork",
        "@id": `${url(`/projects/${p._id}`)}#project`,
        name: p.title,
        description: p.fullDescription ?? p.description,
        url: url(`/projects/${p._id}`),
        ...(p.image ? { image: p.image } : {}),
        keywords: p.technologies.join(", "),
        creator: orgRef,
        // CreativeWork has no rich result to lose, but an undated portfolio
        // gives an AI crawler no way to tell a current build from a five-year-
        // old one when it decides whether the work is worth citing. updatedAt
        // is the date of the last real revision to the write-up, which is the
        // honest available signal — omitted rather than faked when unset.
        ...(p.updatedAt ? { dateCreated: p.updatedAt } : {}),
        inLanguage: "en",
      },
    ];
  }

  return map;
}

/**
 * Server entry used only at build time by scripts/prerender.mjs.
 *
 * Renders a route to static HTML so the deployed pages ship real body content
 * instead of an empty <div id="root">. Previously prerendering only rewrote
 * <head> tags, so every crawler that does not execute JavaScript — which is
 * all of GPTBot, PerplexityBot, ClaudeBot, ChatGPT-User and OAI-SearchBot,
 * the very agents robots.txt invites in — saw a blank page.
 *
 * The client still hydrates normally; this markup is what a non-JS fetch gets.
 */
export function render(url: string): string {
  return renderToString(
    <AppProviders withToasters={false}>
      <StaticRouter location={url}>
        <AppRoutes />
      </StaticRouter>
    </AppProviders>
  );
}
