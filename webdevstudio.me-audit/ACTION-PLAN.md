# Action Plan — webdevstudio.me

Sequenced by dependency, not just severity: Phase 1 unblocks crawlers and buyer trust; Phase 2 is the highest-ROI content/perf work; Phase 3 is the remaining owner-input-gated content; Phase 4 is ongoing verification.

## Phase 1 — Critical Fixes (Week 1)

- [x] **Fix the soft-404 in `vercel.json`.** ~~Add `"handle": "filesystem"` before the `/blogs/:slug` and `/projects/:id` rewrites~~ — see note below; the true fallback now returns HTTP 404, and the `spa.html` template is `noindex`.
  *Implemented differently to the recommendation, deliberately:* `"handle"` belongs to Vercel's legacy `routes` property and cannot be mixed with `rewrites`/`redirects`/`headers` in the same config — adding it would have failed deployment. It is also unnecessary: modern `rewrites` already run **after** the filesystem check, so prerendered pages were never the problem. The actual fix was to delete the `/blogs/:slug` rewrite entirely (every post is static data and therefore prerendered, so unmatched slugs now fall through to Vercel's `404.html` handling with a real 404 status), and to keep `/projects/:id` only for projects created through the admin API after a build — with `spa.html` now emitted as `noindex, follow`, since that rewrite cannot distinguish a real API project from a fuzzed URL. `/admin` was also repointed from `index.html` (the prerendered homepage, canonical and all) to the same neutral shell.
  *Verified:* `dist/spa.html` and `dist/404.html` both carry `noindex, follow`, neither carries a canonical or JSON-LD.

- [x] **Manually verify the blank footer/CTA band.** Verified against a local production build — **it is the scroll-animation capture artifact, not a content or contrast bug.** No action needed.
  *Evidence:* the reveal wrappers carry `opacity-0 translate-y-8` until the IntersectionObserver fires, and a full-page automated screenshot never scrolls, so it captures them blank. The content itself is fully present and correctly coloured: 14 links and ~474 characters of text in the footer, and the same markup is intact in the prerendered HTML, so crawlers were never affected either way.

- [x] **Align Cyprus pricing.** Both pages now lead with EUR and carry the USD figure alongside it, derived from one `USD_TO_EUR` rate in `site.config.mjs` rather than three hardcoded conversions. The route title is now "Web Developer in Cyprus — Fixed Prices from €830"; the linked cost guide quotes the same €830/€2,300 pair against its €800–€3,500 market range.

## Phase 2 — High-Impact Improvements (Weeks 2–3)

- [x] **Exempt above-the-fold content from the `useIntersectionObserver` reveal pattern.** Added an `initialVisible` option to the hook (starts visible, never attaches an observer) and an `aboveFold` prop on the six sections that open a page: `Services`, `Projects`, `Blogs`, `Contact`, `About`, and the value-prop grid in `LocationHighlights`. Below-the-fold sections keep the reveal.
  *Verified:* the first reveal wrapper inside `<main>` is now prerendered `opacity-100` on all seven interior routes. **Still needs a Lighthouse re-run to confirm the LCP number** — see Phase 4.

- [x] **Add `<link rel="preconnect" href="https://images.unsplash.com" crossorigin>`** — done, with the existing `dns-prefetch` kept as a fallback.
  *The font half was fixed at the root instead of by preloading:* `src/index.css` already defined a size-adjusted `'Jakarta Fallback'` face, but `tailwind.config.ts` omitted it from the `font-sans` stack — so every element using Tailwind's `font-sans` utility fell straight from the webfont to unadjusted `system-ui` and reflowed on swap. That is the likelier source of the 0.241 CLS than a missing preload, and it costs nothing at runtime. Preloading a specific `fonts.gstatic.com` woff2 was rejected as the primary fix: those URLs are unstable and a dead preload is pure waste.

- [x] **Fix the internal link matrix across the 13 blog posts** per `findings/cluster.md` §5 — all mandatory pillar↔spoke pairs, recommended spoke↔spoke pairs, and cross-cluster links applied as contextual closing paragraphs rather than a link dump.
  *Verified by script:* 13/13 posts now have **3+ inbound sibling links, zero inbound-orphans** (was 6 orphans, max 2 inbound), and no links to unknown slugs. Two links beyond the audit's matrix were needed to clear 3+ everywhere: `do-i-need-an-app-or-a-website → mern-stack-architecture-guide` and `custom-web-app-cost-2026 → do-i-need-an-app-or-a-website`.

- [ ] **Populate case-study proof fields.** For each of the 6 projects in `src/data/case-studies/*.ts`, add at minimum one of `{repoUrl, demoUrl, screenshot}` plus a numeric `outcome`.
  *Why this unblocks everything downstream:* the SXO persona scoring found Trust (avg. 6.4/25 across 5 personas) is the single lowest-scoring dimension sitewide, and it traces to this one root cause — home, `/services`, and both geo pages all point to these case studies as their proof mechanism.
  *How you'd know it worked:* the codebase's own `hasVerifiableProof()` returns `true` for at least the flagship 2–3 projects.
  **Not actionable in code — these are facts only you have.** `npm run build` already prints the exact missing field list per project.

- [x] **Add short `crumbLabel` fields** for the two geo-page breadcrumbs. Added, plus a `crumbLabelFor()` helper with a fallback to the existing title-split, and the visible breadcrumb + runtime schema on both pages updated to match (they must agree, and hydration replaces the prerendered graph).
  *Verified:* both pages now emit `Home > Cyprus` / `Home > New Zealand`.

### Also fixed in this pass (from `audit-data.json`, not listed above)

- [x] **`WebPage` never referenced its own `BreadcrumbList`** (Schema, Medium). `BreadcrumbList` now carries a stable `${url}#breadcrumb` `@id` and every non-home `WebPage` points at it.
- [x] **`/blogs` `dateModified` understated its own freshness** (Schema, Medium). Now derived from `Math.max()` of the post dates via `latestBlogDate()`, applied identically by the prerenderer and the React runtime. Was hand-maintained at 2026-07-30; now resolves to 2026-08-09.
- [x] **Article/case-study images below 1200px** (Schema, Low). Added `schemaImage()`, which re-requests the same Unsplash crop at 1200×675 for `og:image`, `twitter:image`, `BlogPosting.image` and `CreativeWork.image`. The on-page cards keep the 800px URL.
- [x] **`custom-web-app-cost-2026` missing a comparison table** (On-Page, Low). The three price bands were a bulleted list that the very next paragraph already called "that table" — now a real table matching the NZ/Cyprus posts' format.

## Phase 3 — Content & Authority (Month 2)

- [ ] Collect 2–3 real, verified testimonials (the `verified: true` gate is already built — this is data entry, not engineering).
- [ ] Replace stock case-study/blog cover images with real product screenshots as they become available (lowest-risk order: swap the images that currently risk reading as "misrepresented work" first — the 3 case-study cards with the most misleading stock photos).
- [ ] Add a founder headshot to `/about` — highest-trust placement currently empty.
- [ ] Expand the 4 content-cluster pillar posts toward true pillar depth (2,500–4,000 words). Priority order: `mern-stack-architecture-guide` (~850 words, worst gap, also the thinnest post site-wide), then `why-is-my-website-slow` (~1,200 words).
- [ ] Lengthen thin FAQ/answer passages toward the 134–167 word AI-citation sweet spot (currently 28–96 words) and add outbound citations (MDN, web.dev, framework docs) to blog posts — helps Perplexity/Google AI Overviews specifically.
- [ ] Add at least one identifiable client name/logo and a team/founder photo to both geo landing pages.
- [ ] Once case-study proof exists, create free/verified profiles on Clutch and DesignRush — the Comparison Shopper persona (45/100, the weakest of 5 tested) never reaches the site any other way.

## Phase 4 — Monitoring & Iteration (Ongoing)

- [ ] **Re-run Lighthouse on home/services/projects/blog** after the Phase 2 animation fix to confirm the LCP improvement lands as expected. *This is now the main open verification:* the fix is confirmed structurally (above-the-fold content is prerendered visible) but the 1.5–3.5s LCP claim has not been re-measured. Note the homepage may not move — its first viewport is the `Hero`, which never used the observer, so home's render delay has a different cause than `/services` and `/projects`.
- [ ] **Fix the apex double redirect** (Technical, Medium — `http://webdevstudio.me/` takes two 308 hops). Not a code change: set the apex domain alias at Vercel/DNS to redirect straight to `https://www.webdevstudio.me/`.
- [ ] Re-check Common Crawl / re-run the backlinks audit once the site accumulates its first referring domains (earliest plausible: next quarterly Common Crawl release).
- [ ] Confirm each future case-study edit bumps only that project's own `updatedAt` — don't let the current shared 2026-08-09 batch date freeze permanently.
- [ ] Watch the geo-page count against the 30-page quality-gate warning threshold if a 3rd+ country page is added.
- [ ] Investigate elevated TTFB on home (999ms) and blog (1,603ms) routes — confirm static/prerendered serving rather than serverless cold starts.

## Explicitly Deferred (owner input required, not a code task)

These are already tracked in project memory and don't need re-flagging as new work — they're prerequisites Phase 3 depends on, not independent action items:
- Real testimonials and confirmed production pricing (feeds directly into Phase 3's testimonial and case-study tasks above).
- Production `VITE_API_URL` — contact form currently falls back to mailto.
