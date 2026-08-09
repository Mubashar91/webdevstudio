# Core Web Vitals / Performance Audit — webdevstudio.me

**Date:** 2026-08-09
**Pages tested:** `/`, `/services`, `/projects`, `/blogs/react-performance-tips-2025`
**Environment:** React + Vite, SSR-prerendered + client `hydrateRoot()`, hosted on Vercel

## Methodology / Data Source Disclosure

- **CrUX field data: unavailable.** `crux_history.py` returned `Error: API key required` (no `GOOGLE_API_KEY` configured in this environment). No 28-day real-user percentiles could be pulled.
- **PSI API: unavailable.** `pagespeed_check.py` returned `PSI rate limit exceeded (240 QPM / 25,000 QPD)` on the very first call for both mobile and desktop strategies — the shared/anonymous quota for this environment was already exhausted, not a per-run limit I could wait out productively.
- **Real lab measurements were obtained instead** by running the actual **Lighthouse 13.4.1 CLI** (`npx lighthouse`) headless against the live production URLs, mobile form factor + mobile screen emulation (Google's default/primary evaluation profile), performance category only. This is genuine Chrome trace data (LCP/CLS/TBT/element-level breakdowns), not a heuristic/static estimate — but it is **lab data, single-run, simulated mobile throttling**, not field data, and true INP cannot be measured in Lighthouse navigation mode (no real user interaction occurs), so **Total Blocking Time (TBT) is used as the closest lab proxy for INP risk**, consistent with the skill's guidance to treat Lighthouse as a lab diagnostic.
- Raw Lighthouse JSON reports saved to the scratchpad for reference (not persisted in the repo): `lh-home.json`, `lh-services.json`, `lh-projects.json`, `lh-blog.json`.
- **Correction to a prior audit assumption:** the brief noted "zero images sitewide" — this is **no longer accurate**. The homepage, `/projects`, and the blog post now load real hero/thumbnail images from `images.unsplash.com` (9 images / 343KB on home, 6 images / 229KB on projects, 1 image / 24KB on the blog post). Image weight is now a real, if secondary, factor — see findings below. `/services` still has zero images.

## Summary Scorecard (Lighthouse 13.4.1, mobile, single run)

| Page | Perf Score | LCP | CLS | TBT (INP proxy) | Verdict |
|---|---|---|---|---|---|
| `/` (home) | **58/100** | **4.80 s** — Poor | 0.00003 — Good | 400 ms | LCP fails |
| `/services` | **73/100** | 1.41 s — Good | **0.241** — Poor (borderline) | 480 ms | CLS fails |
| `/projects` | **71/100** | **4.23 s** — Poor | 0.0006 — Good | 324 ms | LCP fails |
| `/blogs/react-performance-tips-2025` | **63/100** | **6.42 s** — Poor | 0.0001 — Good | 255 ms | LCP fails badly |
| **Average** | **~66/100** | **3 of 4 pages fail LCP** | 1 of 4 pages fails CLS | All within "needs improvement" TBT band | **CWV assessment: FAIL** |

None of the 4 pages would pass the "75th percentile good on all three metrics" bar Google uses — and this is a single un-throttled-network-variance lab run, so real-world p75 (mixed devices/networks) is likely worse, not better, especially on LCP.

## Top Issues (prioritized by expected impact)

### 1. Scroll-reveal animation pattern delays LCP by 1.7–3.5s on 3 of 4 pages (highest impact)

Every page composes its main content sections with a homegrown `useIntersectionObserver` hook (`src/hooks/use-intersection-observer.tsx`) that starts elements at `opacity-0 translate-y-10` and only flips to `opacity-100` once React state updates *after* the IntersectionObserver fires post-hydration. This pattern is used in 18 components (`About.tsx`, `Blogs.tsx`, `Contact.tsx`, `CTA.tsx`, `Services.tsx`, `Projects.tsx`, `Stats.tsx`, etc. — 62 `opacity-0` occurrences across `src/components/`).

Because the LCP element is invisible (`opacity: 0`) until JS runs, hydrates, and the observer callback fires, Lighthouse's "Largest Contentful Paint" element-render-delay subpart is enormous even though the HTML is already prerendered/present in the DOM:

| Page | TTFB | Resource load | **Element render delay** | LCP element |
|---|---|---|---|---|
| `/` | 999 ms | — | **3,472 ms** | hero `<p>` subtext |
| `/services` | 287 ms | — | **1,761 ms** | header `<p>` description |
| `/projects` | 679 ms | 1,846 ms (image) | **3,474 ms** | project card `<img>` |
| `/blogs/...` | 1,603 ms | 5,457 ms (image) | 45 ms | article hero `<img>` |

On home, services, and projects, the render-delay component alone accounts for 60–80% of total LCP — far larger than network/TTFB. This is a **client-side rendering/animation architecture problem, not an asset-weight problem**. Elements above the fold (hero text, header copy, first project card) should never be gated behind an intersection observer — that pattern belongs on below-the-fold content only.

**Fix:** exempt above-the-fold / first-viewport content from the `useIntersectionObserver` reveal pattern (render it visible immediately, or use `threshold: 0` + trigger on mount for first section), or set `freezeOnceVisible` sections above the fold to default `isVisible = true` via SSR-safe initial state so prerendered HTML paints immediately instead of waiting for a client-side observer callback.

### 2. Blog post LCP is dominated by a 5.4s image load (6.42s total LCP — worst page tested)

On the blog post, TTFB is already elevated (1.6s — see Issue 4) but the bigger problem is `resourceLoadDuration: 5,457ms` for the Unsplash hero image (`images.unsplash.com/photo-1633356122544...`), despite the file only being 24KB. The `<img>` already has `fetchpriority="high"`, `loading="eager"`, and explicit `width`/`height` — good practices — but the third-party Unsplash origin itself is the bottleneck (no `<link rel="preconnect">` to `images.unsplash.com` was found, adding DNS+TLS negotiation time before the request can even start).

**Fix:** (a) add `<link rel="preconnect" href="https://images.unsplash.com" crossorigin>` to the document head; (b) self-host/proxy hero images through Vercel's own image optimization or an edge-cached copy instead of hot-linking Unsplash's origin directly, which has no SLA for this traffic; (c) consider `fetchpriority="high"` + `<link rel="preload" as="image">` for the specific LCP image URL per page.

### 3. `/services` has poor CLS (0.241) from a decorative background element shifting after web font load

The layout-shift culprit is `div.absolute.-bottom-32...w-[400px] h-[400px]` (a decorative blurred gradient blob in the header), with Lighthouse attributing the shift to `cause: "Web font loaded"` (Plus Jakarta Sans downloading from `fonts.gstatic.com`). When the font swaps in, surrounding text reflows and pushes the absolutely-positioned decorative blob's containing block, producing a large-area shift (400×400px = high impact score) even though the blob itself has fixed dimensions.

**Fix:** preload the primary font weight actually used above the fold (`<link rel="preload" as="font" type="font/woff2" crossorigin>` for `LDIoaomQNQcsA88c7O9yZ4KMCoOg4Ko20yygg_vb.woff2`) and/or add `font-display: optional` or size-adjusted fallback fonts (e.g., via `next/font`-style local metric matching, or CSS `size-adjust`) so text doesn't reflow when the webfont arrives. This is a one-page issue currently but the same font is loaded on all pages, so the pattern should be fixed globally to prevent regressions.

### 4. Elevated TTFB / server response on home and blog (999ms and 1,603ms respectively)

Services (287ms) and projects (679ms) TTFB are reasonable; home (999ms) and especially the blog post (1,603ms) are well above the <800ms CrUX-good target for the TTFB subpart. Given this is a Vercel-hosted Vite SSR/prerender setup, this smells like either cold-start on serverless functions or prerender-generation overhead on those specific routes rather than pure network latency.

**Fix:** confirm these routes are served from Vercel's static/prerendered output (not an on-demand serverless function per request) — if prerendering already runs at build time per the shared ESM config architecture, verify the deployed output actually serves the static HTML for `/` and blog posts rather than falling through to SSR-on-request. Consider edge caching (`Cache-Control: s-maxage`) for prerendered HTML.

### 5. Heavy/unused third-party and app JavaScript inflates TBT (INP risk) across all pages

- Google Tag Manager (`gtag.js`) ships 166–169KB with ~55% (92-93KB) unused/unexecuted on every single page load, and adds 50–62ms of main-thread time before any user interaction.
- The app's own bundle `assets/index-*.js` (143KB) has 37–43% unused bytes on every page (54–61KB wasted per page — code likely shared across routes that isn't needed on each one).
- TBT of 250–480ms (mobile, simulated throttling) across pages sits in the "needs improvement" range and, combined with "Style & Layout" (2.0–2.2s on home/services) dominating main-thread time — likely from the many Tailwind `transition-all` classes tied to the scroll-reveal pattern in Issue 1 — is the leading INP risk indicator in the absence of field data.

**Fix:** load GTM via a deferred/lazy strategy (e.g., load after first interaction or via `next/script`-style `worker`/`lazyOnload` equivalent, or a lightweight server-side tag manager); route-split the shared bundle so `/services` (currently DOM-light, no images) isn't pulling the same 143KB chunk as image-heavy pages; audit `transition-all` usage (which forces the browser to watch/animate *all* animatable CSS properties) and replace with explicit property lists (e.g., `transition-[opacity,transform]`) to reduce style/layout recalculation cost.

## What's Working Well

- DOM size is healthy on every page (271–943 elements, all well under the 1,500-element concern threshold).
- CLS is excellent on 3 of 4 pages (0.00003–0.0006) — images already ship explicit `width`/`height` attributes, and the SSR-prerender approach avoids most late-injected-content shift.
- No render-blocking resources flagged on any page (CSS/JS delivery strategy is already reasonable).
- `/services`, having no images, achieves the best LCP of the four pages (1.41s, "Good") — reinforcing that the animation-gating pattern (Issue 1), not image weight, is the dominant lever on this site.

## Recommended Priority Order

1. **Fix the intersection-observer reveal pattern for above-the-fold content** (Issue 1) — single highest-leverage change, likely worth 1.5–3.5s of LCP improvement on 3 of 4 pages.
2. **Preconnect to images.unsplash.com + reduce blog hero image load time** (Issue 2) — would bring blog LCP from 6.4s toward ~2-3s.
3. **Preload the Plus Jakarta Sans font file used above the fold** (Issue 3) — fixes the one clear CLS failure.
4. **Investigate TTFB on `/` and blog routes** (Issue 4) — confirm static/prerendered serving, not serverless cold starts.
5. **Defer GTM loading + trim unused JS per route** (Issue 5) — improves TBT/INP risk margin across the board.

## Caveats

- Single-run lab data only (no CrUX field percentiles available in this environment) — treat exact millisecond values as directional, not definitive; re-run PSI/CrUX once API quota/credentials are available to confirm against real-user p75.
- Desktop strategy was not tested (mobile is Google's primary/default evaluation surface and was prioritized given time constraints); desktop LCP is expected to be meaningfully better given faster CPU/network simulation, but the render-delay issue (JS-gated visibility) is CPU/JS-execution-driven, not purely network-driven, so it will likely still be present on desktop, just smaller in absolute terms.
- True INP requires field data or a Lighthouse timespan/user-flow run with simulated interaction; TBT is used here as the standard lab proxy per the CWV thresholds reference.
