/**
 * Post-build step: writes a real HTML file per public route with that route's
 * title, meta, Open Graph tags and Schema.org graph baked into the markup.
 *
 * Why this exists
 * ───────────────
 * The app is a client-rendered SPA, so every <head> tag is injected by
 * useSEO() after React boots. Googlebot renders JS eventually, but the
 * crawlers that matter for winning work do not:
 *
 *   • LinkedIn, Facebook, X, Slack, WhatsApp link previews
 *   • GPTBot, PerplexityBot, ClaudeBot, Bingbot's AI surfaces
 *
 * Before this step they all saw index.html's homepage <head> for every URL,
 * so /services and /contact shared one title and none of the structured data
 * was visible. Now each route ships correct metadata in the raw HTML while
 * React still hydrates and takes over normally.
 *
 * Also emits sitemap.xml from the same route config so the two cannot drift.
 */
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

import {
  INDEXNOW_KEY,
  ROUTES,
  SITE_NAME,
  absoluteUrl,
  normalizeSiteUrl,
  ogImageUrl,
  routeGraph,
} from "../src/lib/site.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");
const ssrEntry = join(__dirname, "..", "dist-ssr", "entry-server.js");

const SITE_URL = normalizeSiteUrl(
  process.env.VITE_SITE_URL || process.env.SITE_URL
);

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

/** Prevents a "</script>" inside JSON-LD from terminating the script tag. */
const escapeJsonLd = (value) =>
  JSON.stringify(value).replace(/</g, "\\u003c");

/**
 * Injects server-rendered markup into <div id="root"></div>.
 *
 * React hydrates over this on load, so the visible result is unchanged for
 * real users — but a crawler that never runs JS now receives the full page.
 */
function injectBody(html, bodyHtml) {
  const rootPattern = /(<div id="root">)(<\/div>)/;
  if (!rootPattern.test(html)) {
    throw new Error(
      'prerender: could not find <div id="root"></div> in the built HTML.'
    );
  }
  return html.replace(rootPattern, (_m, open, close) => `${open}${bodyHtml}${close}`);
}

/**
 * Replaces the crawler-relevant tags in the built index.html.
 * Everything else (asset links, favicons, fonts) is preserved as-is.
 */
function renderHead(templateHtml, route, extraSchema = []) {
  const url = absoluteUrl(SITE_URL, route.path);
  const ogImage = ogImageUrl(SITE_URL);

  let html = templateHtml;

  // Title. Replacer function for the same reason as below — "$" sequences in
  // dynamic content must never be interpreted as replacement patterns.
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    () => `<title>${escapeAttr(route.title)}</title>`
  );

  // Detail pages carry their own cover image and are articles, not the site
  // homepage — sharing a blog post should show that post's image.
  const pageImage = route.image || ogImage;
  const pageOgType = route.ogType || "website";

  // Simple name/property meta replacements
  const metaReplacements = [
    [/(<meta\s+name="description"\s+content=")[^"]*(")/, route.description],
    [/(<meta\s+name="keywords"\s+content=")[^"]*(")/, route.keywords],
    [/(<meta\s+property="og:type"\s+content=")[^"]*(")/, pageOgType],
    [/(<meta\s+property="og:title"\s+content=")[^"]*(")/, route.title],
    [/(<meta\s+property="og:description"\s+content=")[^"]*(")/, route.description],
    [/(<meta\s+property="og:url"\s+content=")[^"]*(")/, url],
    [/(<meta\s+property="og:image"\s+content=")[^"]*(")/, pageImage],
    [/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, route.title],
    [/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, route.description],
    [/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, pageImage],
    [/(<link\s+rel="canonical"\s+href=")[^"]*(")/, url],
  ];

  for (const [pattern, value] of metaReplacements) {
    if (!pattern.test(html)) {
      throw new Error(
        `prerender: index.html is missing the tag matched by ${pattern}. ` +
          `Update scripts/prerender.mjs if you changed the head markup.`
      );
    }
    // Replacer FUNCTION, not a replacement string. With a string, "$" is
    // special: the services description contains "$2,500" and "$1,200", and
    // String.replace read those as backreferences to capture groups 2 and 1,
    // rewriting the description to '..."500, monthly retainers from <meta
    // name="description" content=",200...'. A function receives the groups as
    // arguments, so "$" in the content is never interpreted.
    html = html.replace(pattern, (_match, open, close) =>
      `${open}${escapeAttr(value)}${close}`
    );
  }

  // Replace all build-time JSON-LD with this route's single connected graph.
  html = html.replace(
    /\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g,
    ""
  );
  // The graph embeds price copy ("$900", "$2,500"), so this also uses a
  // replacer function — with a string replacement "$&", "$`" and "$'" stay
  // special even when the search pattern is a plain string.
  html = html.replace(
    "</head>",
    () =>
      `  <script type="application/ld+json">${escapeJsonLd(
        routeGraph(SITE_URL, route, extraSchema)
      )}</script>\n  </head>`
  );

  return html;
}

function renderSitemap(allRoutes) {
  const urls = allRoutes
    .map(
      (route) => `  <url>
    <loc>${absoluteUrl(SITE_URL, route.path)}</loc>${
        // lastmod is omitted rather than faked. Stamping every URL with the
        // build date makes the signal meaningless and Google starts ignoring
        // it, so only pages with a real content date carry one.
        route.lastmod ? `\n    <lastmod>${route.lastmod}</lastmod>` : ""
      }
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

/**
 * robots.txt is generated rather than kept static so its Sitemap: line always
 * matches the origin everything else is built with. A hardcoded copy silently
 * pointed at the dead webdevstudio.me host.
 */
function renderRobots() {
  const aiBots = [
    "GPTBot",
    "OAI-SearchBot",
    "ChatGPT-User",
    "PerplexityBot",
    "ClaudeBot",
    "Google-Extended",
    "Applebot-Extended",
  ];

  return `# ${SITE_NAME} — ${SITE_URL}

User-agent: *
Allow: /
Disallow: /admin
Disallow: /admin/

# ── AI answer engines ──
# Named explicitly so the intent survives future edits to the group above.
${aiBots
  .map((bot) => `User-agent: ${bot}\nAllow: /\nDisallow: /admin\n`)
  .join("\n")}
Sitemap: ${SITE_URL}/sitemap.xml
`;
}

/**
 * llms.txt — a plain-text site summary some AI engines read. Previously this
 * path fell through the SPA catch-all and returned the HTML shell with a 200,
 * which is worse than a 404 because it looks like a valid file.
 *
 * Google Search and AI Overviews do not use llms.txt; this is cheap coverage
 * for the engines that do.
 */
function renderLlmsTxt() {
  const lines = ROUTES.map(
    (r) => `- [${r.title.split("|")[0].trim()}](${absoluteUrl(SITE_URL, r.path)}): ${r.description}`
  ).join("\n");

  return `# ${SITE_NAME}

> React, TypeScript and MERN stack web development for businesses worldwide.
> Led by Muhammad Mubashar Shahzad. Remote delivery, fixed-price projects.

## Pages

${lines}

## Contact

- Email: mmubasharshahzad40@gmail.com
- Quote requests: ${absoluteUrl(SITE_URL, "/contact")}
`;
}

/**
 * A real 404 page. Vercel serves dist/404.html for paths that match no file
 * and no rewrite, which — combined with the narrowed rewrite rules in
 * vercel.json — replaces the soft-200 that previously served the full
 * homepage (including its canonical and JSON-LD) for every bad URL.
 */
function render404(template) {
  let html = template;
  html = html.replace(/<title>[\s\S]*?<\/title>/, () => "<title>Page not found | " + SITE_NAME + "</title>");
  html = html.replace(
    /(<meta\s+name="robots"\s+content=")[^"]*(")/,
    (_m, open, close) => `${open}noindex, follow${close}`
  );
  // A 404 must not assert a canonical URL or carry the homepage entity graph.
  html = html.replace(/\s*<link rel="canonical"[^>]*>/g, "");
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
  return html;
}

/**
 * A content-free SPA shell: no body markup, no canonical, no JSON-LD.
 * Served only for detail URLs that had no prerendered file at build time.
 */
function renderShell(template) {
  let html = template;
  html = html.replace(/\s*<link rel="canonical"[^>]*>/g, "");
  html = html.replace(/\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g, "");
  return html;
}

async function main() {
  let template;
  try {
    template = await readFile(join(distDir, "index.html"), "utf8");
  } catch {
    console.error(
      "prerender: dist/index.html not found — run `vite build` first."
    );
    process.exit(1);
  }

  let render, DYNAMIC_ROUTES, pageSchema;
  try {
    ({ render, DYNAMIC_ROUTES, pageSchema } = await import(pathToFileURL(ssrEntry).href));
  } catch (err) {
    console.error(
      "prerender: could not load dist-ssr/entry-server.js — run `npm run build:ssr` first.\n",
      err.message
    );
    process.exit(1);
  }

  // Blog posts and project case studies are prerendered too. Without them the
  // SPA rewrite served index.html — the prerendered homepage — for every
  // detail URL, canonical included.
  const allRoutes = [...ROUTES, ...DYNAMIC_ROUTES];
  const schemaByPath = pageSchema(SITE_URL);

  for (const route of allRoutes) {
    let html = renderHead(template, route, schemaByPath[route.path] ?? []);

    // Server-render the route's markup into the root div. A failure here is
    // fatal rather than silently falling back to an empty body — shipping a
    // blank page to crawlers is the exact regression this step prevents.
    const body = render(route.path);
    if (!body || body.length < 500) {
      throw new Error(
        `prerender: ${route.path} rendered only ${body?.length ?? 0} chars of HTML. ` +
          `Expected a full page — check for a render-time error in that route.`
      );
    }
    html = injectBody(html, body);

    // "/" overwrites dist/index.html; every other route becomes
    // dist/<path>/index.html, which static hosts serve directly.
    const outPath =
      route.path === "/"
        ? join(distDir, "index.html")
        : join(distDir, route.path.replace(/^\//, ""), "index.html");

    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    console.log(
      `  ✓ ${route.path.padEnd(32)} → ${outPath.replace(distDir, "dist")}  (${(
        body.length / 1024
      ).toFixed(0)} KB body)`
    );
  }

  await writeFile(join(distDir, "404.html"), render404(template), "utf8");
  console.log("  ✓ 404.html");

  // Neutral shell for detail URLs that have no prerendered file — e.g. a
  // project created through the admin API after this build. Pointing the
  // fallback rewrite at index.html would serve the homepage's content and
  // canonical for those URLs; this shell asserts neither and lets the
  // client-side useSEO hook populate the head.
  await writeFile(join(distDir, "spa.html"), renderShell(template), "utf8");
  console.log("  ✓ spa.html (fallback for un-prerendered detail routes)");

  await writeFile(join(distDir, "sitemap.xml"), renderSitemap(allRoutes), "utf8");
  console.log(
    `  ✓ sitemap.xml (${allRoutes.length} URLs — ${ROUTES.length} static, ${DYNAMIC_ROUTES.length} detail)`
  );

  await writeFile(join(distDir, "robots.txt"), renderRobots(), "utf8");
  console.log("  ✓ robots.txt");

  await writeFile(join(distDir, "llms.txt"), renderLlmsTxt(), "utf8");
  console.log("  ✓ llms.txt");

  // IndexNow ownership key. Must be reachable at the site root for Bing to
  // accept URL submissions; see scripts/indexnow.mjs.
  if (INDEXNOW_KEY) {
    await writeFile(join(distDir, `${INDEXNOW_KEY}.txt`), INDEXNOW_KEY, "utf8");
    console.log(`  ✓ ${INDEXNOW_KEY}.txt (IndexNow key)`);
  }

  console.log(`\nprerender: ${SITE_NAME} — ${ROUTES.length} routes at ${SITE_URL}`);
}

main().catch((err) => {
  console.error("prerender failed:", err);
  process.exit(1);
});
