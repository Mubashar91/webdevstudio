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
import { fileURLToPath } from "node:url";

import {
  ROUTES,
  SITE_NAME,
  absoluteUrl,
  normalizeSiteUrl,
  ogImageUrl,
  routeGraph,
} from "../src/lib/site.config.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = join(__dirname, "..", "dist");

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
 * Replaces the crawler-relevant tags in the built index.html.
 * Everything else (asset links, favicons, fonts) is preserved as-is.
 */
function renderHead(templateHtml, route) {
  const url = absoluteUrl(SITE_URL, route.path);
  const ogImage = ogImageUrl(SITE_URL);

  let html = templateHtml;

  // Title
  html = html.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeAttr(route.title)}</title>`
  );

  // Simple name/property meta replacements
  const metaReplacements = [
    [/(<meta\s+name="description"\s+content=")[^"]*(")/, route.description],
    [/(<meta\s+name="keywords"\s+content=")[^"]*(")/, route.keywords],
    [/(<meta\s+property="og:title"\s+content=")[^"]*(")/, route.title],
    [/(<meta\s+property="og:description"\s+content=")[^"]*(")/, route.description],
    [/(<meta\s+property="og:url"\s+content=")[^"]*(")/, url],
    [/(<meta\s+property="og:image"\s+content=")[^"]*(")/, ogImage],
    [/(<meta\s+name="twitter:title"\s+content=")[^"]*(")/, route.title],
    [/(<meta\s+name="twitter:description"\s+content=")[^"]*(")/, route.description],
    [/(<meta\s+name="twitter:image"\s+content=")[^"]*(")/, ogImage],
    [/(<link\s+rel="canonical"\s+href=")[^"]*(")/, url],
  ];

  for (const [pattern, value] of metaReplacements) {
    if (!pattern.test(html)) {
      throw new Error(
        `prerender: index.html is missing the tag matched by ${pattern}. ` +
          `Update scripts/prerender.mjs if you changed the head markup.`
      );
    }
    html = html.replace(pattern, `$1${escapeAttr(value)}$2`);
  }

  // Replace all build-time JSON-LD with this route's single connected graph.
  html = html.replace(
    /\s*<script type="application\/ld\+json">[\s\S]*?<\/script>/g,
    ""
  );
  html = html.replace(
    "</head>",
    `  <script type="application/ld+json">${escapeJsonLd(
      routeGraph(SITE_URL, route)
    )}</script>\n  </head>`
  );

  return html;
}

function renderSitemap() {
  const urls = ROUTES.map(
    (route) => `  <url>
    <loc>${absoluteUrl(SITE_URL, route.path)}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`
  ).join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
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

  for (const route of ROUTES) {
    const html = renderHead(template, route);

    // "/" overwrites dist/index.html; every other route becomes
    // dist/<path>/index.html, which static hosts serve directly.
    const outPath =
      route.path === "/"
        ? join(distDir, "index.html")
        : join(distDir, route.path.replace(/^\//, ""), "index.html");

    await mkdir(dirname(outPath), { recursive: true });
    await writeFile(outPath, html, "utf8");
    console.log(`  ✓ ${route.path.padEnd(32)} → ${outPath.replace(distDir, "dist")}`);
  }

  await writeFile(join(distDir, "sitemap.xml"), renderSitemap(), "utf8");
  console.log(`  ✓ sitemap.xml (${ROUTES.length} URLs)`);

  console.log(`\nprerender: ${SITE_NAME} — ${ROUTES.length} routes at ${SITE_URL}`);
}

main().catch((err) => {
  console.error("prerender failed:", err);
  process.exit(1);
});
