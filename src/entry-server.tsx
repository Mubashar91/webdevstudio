import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { AppProviders, AppRoutes } from "./App";
import { BLOG_POSTS, faqsOf, wordCountOf } from "./data/blogs";
import { DERIVED_LASTMOD, withBrand } from "./lib/seo";
import { schemaImage } from "./lib/images";
import { buildAreaServed, cityArea, cyGeo, nzGeo } from "./data/geoPageData";
import {
  LEGACY_PROJECT_REDIRECTS,
  STATIC_PROJECTS,
  pendingCaseStudyFields,
  projectPath,
  projectSchemaNode,
} from "./data/projects";
import {
  SITE_NAME,
  absoluteUrl,
  servicesServiceNode,
  maintenanceServiceNode,
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
 * Re-exported so scripts/prerender.mjs can check the vercel.json 301s against
 * the project data — it cannot import the TypeScript module directly.
 */
export { LEGACY_PROJECT_REDIRECTS };

/**
 * Case-study fields still waiting on facts only the owner has, keyed by path.
 *
 * Printed by scripts/prerender.mjs after every build. Nothing here can be
 * filled in from the codebase — the alternative to reporting these is
 * inventing them.
 */
export const PENDING_CASE_STUDY_INPUTS = STATIC_PROJECTS.map((project) => ({
  path: projectPath(project),
  missing: pendingCaseStudyFields(project),
})).filter((entry) => entry.missing.length > 0);

/**
 * Re-exported for scripts/prerender.mjs, which merges these over ROUTES before
 * writing the sitemap and the WebPage nodes. Defined in src/lib/seo.ts, not
 * here, so the React runtime and the build apply one identical value — see the
 * note there.
 */
export { DERIVED_LASTMOD };

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
    // `image` here only ever reaches <head> — og:image, twitter:image and
    // WebPage.primaryImageOfPage. The card on the page keeps the 800px URL;
    // head consumers want >=1200px. See schemaImage() in lib/images.ts.
    image: schemaImage(post.coverImage),
    // routeGraph() emits FAQPage whenever a route carries FAQs, the same path
    // /services and the location pages already use. The three buyer-intent
    // posts target question-format queries and had the Q&A on the page but no
    // markup around it, so AI Overviews and Copilot had nothing to extract.
    // Empty for posts with no FAQ section, and `faqs?.length` gates the node.
    faqs: faqsOf(post),
  })),
  ...STATIC_PROJECTS.map((project) => ({
    path: projectPath(project),
    title: withBrand(project.seoTitle ?? project.title),
    description: project.description,
    keywords: project.technologies.join(", "),
    lastmod: project.updatedAt,
    changefreq: "monthly",
    priority: "0.6",
    ogType: "article",
    image: schemaImage(project.image),
  })),
  // NOTE: the four /services/* sub-pages are NOT listed here. They are static
  // routes with hand-written metadata, so they live in ROUTES in
  // site.config.mjs — which is also where routeMeta() reads from, so they have
  // to be there regardless. Listing them in both arrays made the prerenderer
  // render each one twice and emitted duplicate <loc> entries in sitemap.xml.
  // This array is only for routes DERIVED from data: blog posts and projects.
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
    "/services/website-maintenance": [maintenanceServiceNode(siteUrl)],
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
              url: url(projectPath(p)),
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
          image: schemaImage(post.coverImage),
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

  // City landing pages: a Service scoped to one city rather than a whole
  // country. Built here so the prerendered HTML crawlers read carries the
  // Service node, and kept identical to the runtime node the page component
  // emits — both read areaServed from cityArea(), so hydration can't drop it.
  const cities = [
    { path: "/web-developer-auckland", city: "Auckland", country: "New Zealand" },
    { path: "/web-developer-nicosia", city: "Nicosia", country: "Cyprus" },
  ];
  for (const { path, city, country } of cities) {
    map[path] = [
      {
        "@type": "Service",
        "@id": `${url(path)}#service`,
        name: `Web Developer for ${city} Businesses`,
        description: `Remote React and MERN web development for businesses in ${city}, ${country} — fixed-price, delivered by ${SITE_NAME}.`,
        url: url(path),
        serviceType: "Web Development",
        provider: orgRef,
        areaServed: cityArea(city, country),
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
        image: schemaImage(post.coverImage),
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

  // Individual case-study pages. Built from the same node the React runtime
  // emits — useSEO() replaces the prerendered JSON-LD wholesale on hydration,
  // so any field only one of them knew about would vanish once React booted.
  // `creator` is the Person, not the Organization: a portfolio piece is
  // attributable to whoever built it.
  for (const p of STATIC_PROJECTS) {
    map[projectPath(p)] = [projectSchemaNode(p, { url, creator: founderRef })];
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
