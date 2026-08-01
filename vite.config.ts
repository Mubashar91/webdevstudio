import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import {
  ROUTES,
  SITE_NAME,
  absoluteUrl,
  normalizeSiteUrl,
  ogImageUrl,
  routeGraph,
} from "./src/lib/site.config.mjs";

/**
 * Injects the homepage <head> (title, meta, Open Graph, canonical, JSON-LD)
 * into index.html at build and dev time, replacing the <!--seo-head-->
 * placeholder.
 *
 * Generating these from site.config.mjs rather than hand-writing them in
 * index.html means the runtime useSEO() hook, the static HTML and the sitemap
 * all read from one definition and cannot disagree.
 *
 * scripts/prerender.mjs runs after the build and rewrites this same block per
 * route into dist/<route>/index.html.
 */
function seoHead(siteUrl: string): Plugin {
  return {
    name: "seo-head",
    transformIndexHtml(html: string) {
      const home = ROUTES.find((r) => r.path === "/");
      if (!home) throw new Error("seo-head: no '/' route in site.config.mjs");

      const url = absoluteUrl(siteUrl, "/");
      const ogImage = ogImageUrl(siteUrl);
      const esc = (v: string) =>
        v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

      const head = `<title>${esc(home.title)}</title>
    <meta name="description" content="${esc(home.description)}" />
    <meta name="keywords" content="${esc(home.keywords)}" />
    <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
    <link rel="canonical" href="${esc(url)}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${esc(SITE_NAME)}" />
    <meta property="og:title" content="${esc(home.title)}" />
    <meta property="og:description" content="${esc(home.description)}" />
    <meta property="og:url" content="${esc(url)}" />
    <meta property="og:image" content="${esc(ogImage)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(SITE_NAME)} — React and MERN web development" />
    <meta property="og:locale" content="en" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(home.title)}" />
    <meta name="twitter:description" content="${esc(home.description)}" />
    <meta name="twitter:image" content="${esc(ogImage)}" />
    <meta name="twitter:image:alt" content="${esc(SITE_NAME)} — React and MERN web development" />

    <script type="application/ld+json">${JSON.stringify(
      routeGraph(siteUrl, home)
    ).replace(/</g, "\\u003c")}</script>`;

      // Google Analytics. Production builds only, so `npm run dev` never
      // sends hits into the real property.

      // Replacer functions: `head` embeds JSON-LD containing price strings, and
      // in a string replacement "$&", "$`", "$'" and "$$" are special even
      // when the search pattern is a plain string rather than a regex.
      return html.replace("<!--seo-head-->", () => head);
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode, command, isSsrBuild }) => {
  const siteUrl = normalizeSiteUrl(process.env.VITE_SITE_URL);

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      seoHead(siteUrl),
      mode === "development" && componentTagger(),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    build: {
      rollupOptions: {
        output: {
          // Client only. In the SSR build React is an external, and Rollup
          // errors if an external is named in manualChunks.
          manualChunks: isSsrBuild
            ? undefined
            : {
                // Splits the vendor bundle so a content change doesn't
                // invalidate React for returning visitors.
                react: ["react", "react-dom", "react-router-dom"],
              },
        },
      },
    },
  };
});
