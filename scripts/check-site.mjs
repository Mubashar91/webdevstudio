import assert from "node:assert/strict";
import { readFile, access, mkdir, writeFile } from "node:fs/promises";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { normalizeSiteUrl, ROUTES } from "../src/lib/site.config.mjs";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const origin = normalizeSiteUrl(process.env.VITE_SITE_URL || process.env.SITE_URL);
const decode = (text) => text.replaceAll("&amp;", "&").replaceAll("&quot;", '"').replaceAll("&#x27;", "'").replaceAll("&lt;", "<").replaceAll("&gt;", ">");
const attributes = (tag) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map((match) => [match[1], decode(match[2])]));
const sitemap = await readFile(join(root, "dist/sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map((match) => decode(match[1]));
assert.ok(urls.length >= ROUTES.length, "Sitemap must contain all static routes");
assert.equal(new Set(urls).size, urls.length, "Duplicate sitemap URLs");

const pages = new Map();
const titles = new Set();
const descriptions = new Set();
const results = [];
for (const url of urls) {
  assert.equal(new URL(url).origin, origin, "Unexpected sitemap origin");
  const path = new URL(url).pathname;
  const html = (await readFile(join(root, "dist", path === "/" ? "" : path.slice(1), "index.html"), "utf8")).replace(/<!--[\s\S]*?-->/g, "");
  const title = decode(html.match(/<title>(.*?)<\/title>/s)?.[1] || "");
  const meta = [...html.matchAll(/<meta\b[^>]*>/g)].map((match) => attributes(match[0]));
  const description = meta.find((tag) => tag.name === "description")?.content;
  const canonical = [...html.matchAll(/<link\b[^>]*>/g)].map((match) => attributes(match[0])).find((tag) => tag.rel === "canonical")?.href;
  assert.ok(title && title.length <= 62, `${path}: missing or long title (${title.length})`);
  assert.ok(description && description.length <= 165, `${path}: missing or long description`);
  assert.ok(!titles.has(title), `${path}: duplicate title`);
  assert.ok(!descriptions.has(description), `${path}: duplicate description`);
  titles.add(title); descriptions.add(description);
  assert.equal(canonical, url, `${path}: incorrect canonical`);
  assert.equal(meta.find((tag) => tag.property === "og:title")?.content, title, `${path}: Open Graph title mismatch`);
  assert.equal(meta.find((tag) => tag.name === "twitter:title")?.content, title, `${path}: Twitter title mismatch`);
  assert.ok(!meta.find((tag) => tag.name === "robots")?.content.includes("noindex"), `${path}: public URL is noindex`);
  const json = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((match) => JSON.parse(match[1]));
  assert.equal(json.length, 1, `${path}: expected one schema graph`);
  const graph = json[0]["@graph"];
  assert.ok(Array.isArray(graph), `${path}: missing schema graph`);
  const graphIds = graph.map((node) => node["@id"]).filter(Boolean);
  assert.equal(graphIds.length, new Set(graphIds).size, `${path}: duplicate schema nodes`);
  const body = html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/g, "");
  assert.equal((body.match(/<h1\b/g) || []).length, 1, `${path}: expected one H1`);
  const ids = [...body.matchAll(/\bid="([^"]+)"/g)].map((match) => decode(match[1]));
  assert.equal(ids.length, new Set(ids).size, `${path}: duplicate element IDs`);
  const images = [...body.matchAll(/<img\b[^>]*>/g)].map((match) => attributes(match[0]));
  for (const image of images) {
    assert.ok(Object.hasOwn(image, "alt"), `${path}: image missing alt`);
    if (image.src?.startsWith("/")) await access(join(root, "dist", image.src.slice(1)));
  }
  const links = [...body.matchAll(/<a\b[^>]*>/g)].map((match) => attributes(match[0]));
  for (const link of links) {
    if (link.target === "_blank") assert.match(link.rel || "", /noopener|noreferrer/, `${path}: unsafe new-window link`);
    assert.ok(!/^javascript:/i.test(link.href || ""), `${path}: unsafe link protocol`);
  }
  pages.set(path, { ids: new Set(ids), links });
  results.push({ path, title, titleLength: title.length, descriptionLength: description.length, images: images.length, status: "passed" });
}
const redirects = JSON.parse(await readFile(join(root, "vercel.json"), "utf8")).redirects || [];
let checkedLinks = 0;
for (const [path, page] of pages) {
  for (const link of page.links) {
    if (!link.href || /^(mailto:|tel:)/.test(link.href)) continue;
    const target = new URL(link.href, origin + path);
    if (target.origin !== origin) continue;
    const targetPath = target.pathname.replace(/\/$/, "") || "/";
    const redirect = redirects.find((entry) => entry.source === targetPath);
    const destination = pages.get(redirect?.destination || targetPath);
    assert.ok(destination, `${path}: broken internal link ${link.href}`);
    if (target.hash) assert.ok(destination.ids.has(decodeURIComponent(target.hash.slice(1))), `${path}: missing anchor ${link.href}`);
    checkedLinks++;
  }
}
for (const shell of ["404.html", "spa.html"]) {
  const html = await readFile(join(root, "dist", shell), "utf8");
  assert.match(html, /name="robots" content="noindex/, `${shell}: must be noindex`);
  assert.ok(!/<link rel="canonical"/.test(html), `${shell}: must not retain the homepage canonical`);
}
const manifest = JSON.parse(await readFile(join(root, "public/site.webmanifest"), "utf8"));
for (const icon of manifest.icons) await access(join(root, "public", icon.src.slice(1)));
const reportDirectory = join(root, "webdevstudio.me-audit");
await mkdir(reportDirectory, { recursive: true });
await writeFile(join(reportDirectory, "site-review.json"), JSON.stringify({ origin, pages: results.length, checkedLinks, results }, null, 2) + "\n");
console.log(`PASS: ${results.length} pages; titles, descriptions, canonicals, social metadata, schema, H1s, IDs, images, ${checkedLinks} internal links/anchors, fallback pages and manifest assets.`);
