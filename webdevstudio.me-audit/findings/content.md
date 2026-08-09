# Content Quality / E-E-A-T Audit — webdevstudio.me

Audit date: 2026-08-09
Method: live sitemap fetch (webdevstudio.me/sitemap.xml) + render_page.py spot-check of homepage/about + direct read of the source-of-truth content files that feed the prerenderer (`src/data/blogs.ts`, `src/data/case-studies/*.ts`, `src/data/testimonials.ts`, `src/components/About.tsx`, `src/components/Contact.tsx`, `src/lib/site.config.mjs`, geo pages). The site is a prerendered SPA (`scripts/prerender.mjs` bakes these files into static HTML per route), so the source data is authoritative for what ships.

Prior audit for comparison: 2026-07-30, overall score 39/100.

## Content Quality Score: 63/100

Up from 39/100 in July. The blog and location-page thinness issues that drove the July score down are substantially resolved. The score is now held down almost entirely by one unresolved issue: **all six portfolio case studies still have zero verifiable proof** (no repo link, no live demo, no screenshot) and five of six also have no outcome number, and testimonials are still empty.

## E-E-A-T Breakdown

| Factor | Weight | Score | Notes |
|---|---|---|---|
| Experience | 20% | 14/20 | Blog and About page carry strong first-hand, specific detail. Case studies — the primary place a freelancer demonstrates hands-on experience — remain unverifiable (see Finding 1). |
| Expertise | 25% | 21/25 | Technical accuracy is good: correct Core Web Vitals thresholds (LCP <2.5s, INP <200ms, CLS <0.1), named tools rather than vague claims, real code samples, accurate framing of PCI scope reduction, GPU-compositing tradeoffs, etc. |
| Authoritativeness | 25% | 13/25 | Thin external validation: only 2 `sameAs` profiles (GitHub, LinkedIn), zero published testimonials, zero checkable case-study artifacts, no third-party mentions/citations found. Solo freelancer with limited external footprint is expected, but the site currently asserts nothing a third party can independently confirm. |
| Trustworthiness | 30% | 22/30 | Real name, real email/phone, transparent pricing bands with market comparisons, honest self-correction of a prior CV timeline inconsistency, deliberate choice to hide (not fabricate) testimonials, honeypot spam protection with graceful mailto fallback, honest derived read-time/word-count (not hand-typed), named human `author` (not just Organization) on BlogPosting schema. Held back by the case-study proof gap and by cover images on "case studies" of real shipped work being generic Unsplash stock rather than actual product screenshots. |

**Weighted E-E-A-T score: 70/100**

## AI Citation Readiness: 78/100

Strong signals:
- Blog posts use structured content blocks (h2/h3, lists, code, tables) rather than flat paragraphs — headings correctly nest (h3 under h2), which preserves the outline crawlers/LLMs use.
- Quotable, specific facts throughout: e.g. "NZ$2,500–$6,000 + GST," "starts at USD $900," "LCP under 2.5 seconds, INP under 200 milliseconds, CLS under 0.1," named library/tool choices (Socket.io, Stripe, TanStack Virtual).
- `BlogPosting` schema carries a named `Person` author (`@id` reference to the founder node), real `datePublished`/`dateModified`, and a genuinely computed `wordCount` (via `wordCountOf()`, prose only, code excluded) rather than a fabricated figure.
- Internal linking between related posts (e.g. `does-i-need-app-or-website` ↔ `why-website-not-showing-on-google` ↔ `signs-your-website-is-losing-customers`) builds topical clusters an AI answer engine can traverse.
- `CreativeWork` schema on case studies is honest by omission — `dateCreated`/`codeRepository` are only emitted when the underlying field is non-null, so schema never contradicts the visible page.

Weaknesses:
- Case-study `CreativeWork` nodes are missing `dateCreated` for all 6 projects (no `completedAt`), which — per the code's own comment — gives a crawler no way to tell a current build from a five-year-old one.
- FAQPage schema is present on `/services`, `/web-development-new-zealand`, and `/web-development-cyprus` (`faqNodeFor()`). **Info only, not a defect**: Google retired FAQ rich results for all sites on 2026-05-07, so this schema no longer earns SERP rich-result real estate. It is harmless to leave in place (the visible Q&A content itself may still be read by AI answer engines independent of rich-result eligibility) — no removal is recommended, and no confirmed AI-citation benefit should be assumed from the schema alone.

## Status of July 30 Findings — verified fresh against current source

| July finding | Status now | Evidence |
|---|---|---|
| Testimonials empty | **STILL OPEN** | `src/data/testimonials.ts`: `TESTIMONIALS = []`, zero `verified: true` entries. Section self-hides (`publishedTestimonials()` filters on `verified`). Design intent is documented and reasonable (no fake headshots/quotes), but the underlying gap — zero social proof anywhere on the site — is unchanged. |
| Location pages thin (~380 words) | **RESOLVED / substantially improved** | Both `/web-development-new-zealand` and `/web-development-cyprus` now carry: 4 country-specific value props, an industries list, 4-question FAQ each, a `CitiesServed` block naming 5-6 real cities with schema-matched `areaServed`, and a market-pricing comparison section with local-currency figures (NZ$/€) plus a link to a dedicated pricing blog post. Estimated 650-750 unique words per page before shared components (Services/Pricing/Testimonials) — clears the 500-600 word location-page floor. |
| Only 3 blog posts, ~90 words each | **RESOLVED** | 13 posts now live (confirmed against both `src/data/blogs.ts` and the live `sitemap.xml`), each spanning 150-315 lines of structured content with real headings, code samples, tables, and specific numeric/technical detail — an order of magnitude past the prior ~90-word stubs and comfortably clearing the 1,500-word blog floor for the technical posts. Content reads as genuinely first-person and specific (e.g. the "does-my-website-need-a-developer" post advises readers away from a rebuild even when that costs the author the larger job) — not generic AI filler. |
| Case-study proof fields all null (outcome, hardPart, roleDetail, context, completedAt, repoUrl, retrospective, screenshots) | **MOSTLY STILL OPEN — the single biggest issue on the site** | Checked all 6 files in `src/data/case-studies/`: `repoUrl`, `demoUrl`, `context`, `completedAt`, `roleDetail`, and `screenshots` are `null`/`[]` for **all six** projects, with no exception. `outcome` (a claim with a number) is `null` for all six. `hasVerifiableProof()` — the codebase's own helper — therefore returns `false` for every case study: nothing on any of the 6 project pages is independently checkable. One file, `software-house-website.ts`, now has `hardPart` and `retrospective` filled in with strong, specific, first-hand engineering narrative (a genuine Experience/Expertise signal) — but even that page has no outcome number and no proof artifact. |
| Zero images sitewide | **Partially resolved, substantive gap remains** | Raw count is no longer zero: 19 Unsplash stock-photo usages across blog cover images and case-study hero images. But these are generic stock photography, not real screenshots of shipped work — `screenshots: []` for all 6 case studies confirms no actual product imagery exists anywhere on the site. Using stock photography as the "cover image" for a page presented as a real project is the same category of risk the codebase's own `testimonials.ts` comment warns about for fake headshots (reverse-image-searchable, credibility risk if noticed) — worth the owner's attention even though it's a lower-severity version of that problem. |

## Other notable findings

**Finding: Component reuse creates cross-page near-duplication.** `Services`, `Pricing`, `Testimonials`, and `FAQ` components are rendered near-verbatim across `/`, `/services`, `/web-development-new-zealand`, and `/web-development-cyprus`. Each page wraps them in unique intro/FAQ/geo copy, which mitigates the risk, but the shared blocks (service list, pricing table) form a large fraction of total page content on the two geo pages. Low-to-moderate risk given the unique wrapper copy is substantial, but worth watching if more geo/service pages are added (see `seo-programmatic` for template-driven page guidance).

**Finding: Strong trust engineering on Contact/About.** `src/components/About.tsx` explicitly resolves a previously-flagged CV inconsistency (an overlapping-dates note explaining that WebDevStudio ran part-time alongside a degree and employed roles) rather than leaving it for a reader to puzzle out — this is exactly the kind of transparency Google's guidelines reward. Contact form has honeypot spam protection, a graceful mailto fallback if the API fails, and a real 24-hour response commitment tied to visible contact info (email, phone, Mian Channu, Pakistan). `Person` schema carries `jobTitle` and 2 `sameAs` links (GitHub, LinkedIn) — thin but real and verifiable.

**Finding: Sitemap and content are in sync.** Live `https://www.webdevstudio.me/sitemap.xml` lists 27 URLs matching current routes and blog posts exactly (verified against `src/data/blogs.ts` slugs and `src/data/case-studies/index.ts`). `lastmod` dates are staggered and plausible (not a single fabricated date across all URLs), which is itself a freshness-credibility signal.

## Recommendations, ranked by impact

1. **Fix the case-study proof gap first** — it is a whole-portfolio problem, not a per-page one, exactly as the codebase's own `pendingCaseStudyFields()` comment states. Any ONE of {repoUrl, demoUrl, screenshot} per project clears `hasVerifiableProof()`. Six "case studies" with zero checkable artifacts between them is the highest-severity credibility risk on the site for a technical buyer evaluating a freelancer.
2. **Add at least one real, numeric `outcome` per case study.** `pendingCaseStudyFields()` already flags outcomes with no digit in them as equivalent to no claim at all — currently all 6 are simply `null`.
3. **Get 2-3 real, verified testimonials** (owner already has the `verified: true` mechanism built and documented — this is a data-entry gap, not an engineering one).
4. Replace stock cover images on case-study pages with real application screenshots once available (also clears part of Finding 1 via the `screenshots` array).
5. Add `completedAt` to case studies so `CreativeWork.dateCreated` can be emitted — currently every project schema omits it, leaving no freshness signal for crawlers evaluating portfolio recency.
6. No action needed on FAQ schema (Info only per the 2026-05-07 FAQ rich-result retirement) — leave as-is.
