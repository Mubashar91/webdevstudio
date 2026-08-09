# Technical SEO Findings — webdevstudio.me

**Audited:** 2026-08-09
**Scope:** https://www.webdevstudio.me/ and all 27 URLs in sitemap.xml (8 primary pages, 13 blog posts, 6 project case studies)
**Method:** Live HTTP fetch (raw, non-JS) of headers/HTML per route, sitemap/robots discovery tooling, JSON-LD parsing, vercel.json routing review, redirect-chain tracing.

## Score: 68 / 100

Prior audit (2026-07-30) scored overall site health 39/100, but that figure blended content/authority/image gaps that are out of scope here. On technical-SEO fundamentals alone (crawlability, indexability, security, structure, CWV signals) the site is now well above that baseline — prerendering, headers and metadata are in good shape. The score is held down by one critical routing defect (soft-404 duplicate-content trap) and a handful of medium/low issues below.

---

## What Works

- **Crawlability:** `robots.txt` returns 200, live-verified to still `Allow: /` for `*`, `GPTBot`, `OAI-SearchBot`, `ChatGPT-User`, `PerplexityBot`, `ClaudeBot`, `Google-Extended`, `Applebot-Extended`, each with `Disallow: /admin` only. Sitemap is correctly declared and discovered via `sitemap_discovery.py` (`valid: true`, `kind: urlset`).
- **Sitemap:** `sitemap.xml` (27 URLs) is well-formed, all `<loc>` entries use the canonical `https://www.webdevstudio.me` host, `lastmod` dates are current and page-specific (not a blanket today-stamp), priorities are sensibly tiered by content type.
- **Indexability / SSR content:** Homepage and all 8 primary + 13 blog + 6 project routes tested return real, route-specific, non-JS HTML (confirmed via raw fetch, `is_spa: false`) — the prerender pipeline is doing its job for AI/social crawlers that don't execute JS.
- **Metadata:** Every tested route has a unique `<title>` (43–55 chars), unique meta description (138–153 chars, all within safe SERP truncation limits), self-referencing `<link rel="canonical">`, and `<meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1">`.
- **Structured data:** Homepage JSON-LD is a single valid `@graph` block (Organization, Person, WebSite, WebPage, OfferCatalog/Offer/PriceSpecification, ImageObject) using `@id` cross-references correctly. `/services` additionally carries valid `BreadcrumbList` and `FAQPage`/`Question`/`Answer` nodes, and the FAQ text is confirmed visible in the rendered HTML (not schema-only, which would risk a Google manual FAQ-rich-result penalty).
- **Security headers:** HTTPS enforced with `Strict-Transport-Security: max-age=63072000; includeSubDomains; preload` (HSTS preload-ready), `Content-Security-Policy` is a real allow-list (not `unsafe-inline` on scripts), plus `X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy`, `Cross-Origin-Opener-Policy`. Applied consistently across HTML and even `robots.txt`/`sitemap.xml` responses.
- **URL structure:** All URLs are clean, lowercase, hyphenated, no query-string cruft, no trailing-slash inconsistency (`trailingSlash: false` enforced in `vercel.json`).
- **HTTP→HTTPS→canonical host:** `http://www.webdevstudio.me/` redirects in a single 308 hop to HTTPS. Both `http://webdevstudio.me/` and `https://webdevstudio.me/` (apex) correctly land on `https://www.webdevstudio.me/` eventually (see Low finding on hop count).
- **True 404s work correctly at the top level:** an invalid top-level path (e.g. `/totally-made-up-route-xyz`) returns a real HTTP 404 with its own `<title>Page not found | WebDevStudio</title>`.
- **IndexNow:** `scripts/indexnow.mjs` exists in the repo and is wired into the build/deploy flow (present in `prerender.mjs` and `site.config.mjs`), giving Bing/Yandex/Naver push-based discovery in addition to the pull-based sitemap.
- **Mobile viewport:** `<meta name="viewport" content="width=device-width, initial-scale=1.0">` present sitewide, no `maximum-scale`/`user-scalable=no` blocking pinch-zoom.
- **CWV-friendly baseline:** Zero `<img>` tags sitewide (already flagged separately as a content gap) means zero image-driven CLS/LCP risk today; all icons are inline SVGs with explicit `width`/`height` (no icon-driven layout shift). Font loading uses the `rel="preload" as="style"` → `onload` swap pattern with a `<noscript>` fallback and a metrics-matched local fallback face (`Jakarta Fallback`, `size-adjust`/`ascent-override` tuned) to minimize CLS from web-font swap — genuinely good CWV engineering, not accidental.

---

## Findings

### CRITICAL — Wildcard route rewrites create a soft-404 duplicate-content trap on every invalid blog/project URL
**Severity:** Critical
**Category:** Indexability / Crawlability

`vercel.json` rewrites `/blogs/:slug` and `/projects/:id` unconditionally to `/spa.html` for *any* slug/id, with no validation against the known set of 13 blog posts / 6 projects:

```json
"rewrites": [
  { "source": "/projects/:id", "destination": "/spa.html" },
  { "source": "/blogs/:slug", "destination": "/spa.html" }
]
```

Verified live: `https://www.webdevstudio.me/blogs/nonexistent-post` and `https://www.webdevstudio.me/projects/nonexistent-project` both return **HTTP 200** (not 404). The body served is the raw pre-render `spa.html` template — confirmed by direct fetch:

- `<title>React &amp; MERN Web Development | WebDevStudio</title>` (homepage's title, not a 404 title, not the requested slug's)
- `<meta name="robots" content="index, follow, ...">` — explicitly tells crawlers to index this page
- `<meta property="og:url" content="https://www.webdevstudio.me/" />` (claims to be the homepage)
- **No `<link rel="canonical">` at all** in this template
- Body is `<div id="root"></div>` with nothing else — for any non-JS fetch (this includes every AI crawler explicitly allowlisted in `robots.txt`: GPTBot, ClaudeBot, PerplexityBot, Applebot-Extended, Google-Extended) this is a **blank page returning HTTP 200 with "index, follow" instructions**, which directly undermines the reason the prerendering pipeline exists in the first place (per project memory: "Head-only prerendering wasn't enough — a July 2026 audit found the body was still empty for them").

Note top-level invalid routes are unaffected (`/totally-made-up-route-xyz` correctly 404s) — this is specific to the `/blogs/:slug` and `/projects/:id` single-segment wildcard rewrites, because Vercel's rewrite matches before/instead of the filesystem 404 fallback for those two path shapes.

**Why this matters:**
1. Every fuzzed or guessed `/blogs/*` or `/projects/*` URL is a crawlable, indexable, 200-status page with no unique content and no canonical — textbook soft-404 / thin-duplicate pattern that Google Search Console will surface as "Indexed, though blocked" or "Soft 404" and that erodes crawl budget and site-quality signals across the whole domain.
2. It's an open door for parasite SEO / URL-injection abuse: any external party can link to `webdevstudio.me/blogs/<anything>` and get a 200 response carrying the site's title/description, which could be scraped or abused.
3. It contradicts the deliberate SSR-for-crawlers architecture documented for this project — non-JS AI crawlers get nothing useful from these URLs.

**Recommendation (infra config, not `site.config.mjs`):** This lives in `vercel.json`, not the generated-SEO-tag pipeline, so it's safe to fix directly:
- Add a `"handle": "filesystem"` entry before these two rewrites in the `rewrites` array so Vercel serves the real prerendered `dist/<route>/index.html` when it exists and only falls through to `/spa.html` for genuinely unmatched slugs, **and**
- Change the `/spa.html` fallback response to actually return **HTTP 404** (Vercel rewrites can't set status directly — either point unmatched slugs at the existing `/404.html` output instead of `/spa.html`, or add a dedicated catch-all `fallback` rewrite with a 404 status via a Vercel Edge Middleware / function), **and**
- At minimum, until the routing fix ships, add `<meta name="robots" content="noindex">` to the `spa.html` template itself (it currently inherits the homepage's `index, follow` default) so any slug that does slip through the filesystem check isn't invitng indexing.

---

### MEDIUM — Double redirect hop from bare HTTP apex to canonical HTTPS www
**Severity:** Medium
**Category:** URL Structure

`http://webdevstudio.me/` takes **two** 308 hops to reach the canonical URL:
```
http://webdevstudio.me/  →308→  https://webdevstudio.me/  →308→  https://www.webdevstudio.me/
```
(`https://webdevstudio.me/` apex→www is also a separate 308, so any inbound link to the bare apex over HTTP burns two hops before the crawler/browser reaches the canonical page.)

**Recommendation:** Collapse to a single hop at the Vercel domain layer — configure the apex domain to redirect straight to `https://www.webdevstudio.me/` rather than to `https://webdevstudio.me/` first. This is a DNS/Vercel domain-alias setting, not a `site.config.mjs` change. Low traffic impact (most real inbound links will already be HTTPS), but worth fixing since it compounds with every apex-linking backlink and slightly delays first byte for anyone landing on the bare domain.

---

### LOW — Unused Google Fonts preconnect/preload for a font that is never actually rendered
**Severity:** Low
**Category:** Core Web Vitals / Performance

The CSS bundle (`assets/index-*.css`) defines `font-family: Plus Jakarta Sans, Jakarta Fallback, system-ui, sans-serif` and ships a metrics-matched `@font-face` for the `Jakarta Fallback` name (using `local("Segoe UI")`, `size-adjust`, `ascent-override` — good CLS engineering), but the actual `Plus Jakarta Sans` webfont is only reachable via the `<link rel="preload" as="style" href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans...">` in the HTML `<head>`, which is promoted to a stylesheet by `boot.ts` at runtime (JS-dependent). For any non-JS fetch (crawlers, and the `spa.html` fallback discussed above), the real font never loads and the site silently renders in the system-font fallback — which is actually fine for CWV (no FOUT/CLS risk) but means the two `preconnect` hints to `fonts.googleapis.com`/`fonts.gstatic.com` are dead weight for those requests, and the branding typeface (Plus Jakarta Sans) is invisible to headless/no-JS renders including any screenshot tooling that doesn't execute JS.

**Recommendation:** No action required for CWV (current behavior is arguably the safer choice). If brand-consistent typography in prerendered/no-JS snapshots matters, consider self-hosting a `woff2` subset and referencing it directly in the prerendered `<head>` rather than relying on the JS-activated Google Fonts swap. Not a ranking or crawlability issue — informational only.

---

### LOW — Offer/PriceSpecification schema still carries placeholder prices
**Severity:** Low (cross-reference, not new)
**Category:** Structured Data

Homepage and `/services` JSON-LD `Offer` nodes publish `"price": "900"`, `"2500"`, `"1200"` as structured data (not just on-page copy), matching the on-page pricing. This is technically valid schema — no markup error — but per project memory (`webdevstudio-pending-owner-inputs.md`) these are assumed, not owner-confirmed figures. Structured pricing data carries more weight with rich-result eligibility than plain text, so shipping placeholder prices here is a slightly higher-stakes version of the same known content gap.

**Recommendation:** No technical fix needed; flagging so the content/business workstream prioritizes confirming real prices before rich-result eligibility (e.g. `Offer` in search) is checked/promoted further. Already tracked as a pending owner input — not a new action item for the technical workstream.

---

## Category Summary

| Category | Status |
|---|---|
| Crawlability | Pass — robots.txt live-verified correct, sitemap discovered and valid |
| Indexability | **Fail** — critical soft-404 duplicate-content issue on wildcard blog/project routes |
| Security | Pass — full modern header set, HSTS preload-ready, real CSP |
| URL Structure | Pass with Medium note — clean URLs, one redundant redirect hop on bare HTTP apex |
| Mobile | Pass — correct unrestricted viewport meta sitewide |
| Core Web Vitals (lab/source signals) | Pass — no images to cause CLS/LCP risk, deliberate font-swap CLS mitigation, prerendered content avoids JS-blocking render |
| Structured Data | Pass — valid JSON-LD graph, Organization/Person/Offer/FAQPage/BreadcrumbList all parse cleanly |
| JavaScript Rendering | Pass for real routes (SSR/prerendered) — **Fail for invalid blog/project slugs**, which fall back to a blank, JS-dependent shell |
| IndexNow | Pass — `scripts/indexnow.mjs` present and integrated into build/deploy |
