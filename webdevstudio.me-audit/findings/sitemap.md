# Sitemap Audit — https://www.webdevstudio.me/sitemap.xml

**Audited:** 2026-08-09
**Score: 94 / 100**

## Method

- Sitemap discovered via `sitemap_discovery.py` (found through `robots.txt`, status 200, `urlset`, valid).
- Live-fetched `sitemap.xml` (27 URLs) and `robots.txt`.
- Checked HTTP status + final URL (redirect chain) for all 27 `<loc>` entries.
- Checked `<link rel="canonical">` and `<meta name="robots">` on all 27 rendered pages.
- Cross-checked sitemap coverage against `src/App.tsx` route table and the generation source (`scripts/prerender.mjs`, `src/lib/site.config.mjs`, `src/entry-server.tsx`, `src/data/blogs.ts`, `src/data/projects.ts` / `src/data/case-studies/*.ts`).

## Summary

The sitemap is generated (not hand-authored) from a single ESM config (`src/lib/site.config.mjs`) plus two TypeScript data modules (`src/data/blogs.ts`, `src/data/case-studies/*.ts`), assembled by `scripts/prerender.mjs` at build time. This is a well-engineered setup: XML is valid, every URL is live and self-canonical, `lastmod` is a deliberately hand-maintained content-change signal rather than a build-timestamp (the generator comments explicitly document this: *"lastmod is omitted rather than faked... only pages with a real content date carry one"*), and coverage matches the live route table with no gaps. Do not hand-edit `dist/sitemap.xml` — regenerate via the prerender script per the repo's own architecture notes.

## Validation Checks

| Check | Result | Notes |
|---|---|---|
| XML well-formed | PASS | Valid `urlset`, correct namespace, UTF-8 declared |
| Declared in robots.txt | PASS | `Sitemap: https://www.webdevstudio.me/sitemap.xml` present |
| robots.txt reachable & sane | PASS | `Allow: /`, `Disallow: /admin` only; explicit allow rules for GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, ClaudeBot, Google-Extended, Applebot-Extended |
| URL count vs 50,000 cap | PASS | 27 URLs — far under limit |
| File size vs 50MB cap | PASS | ~3.5 KB |
| All `<loc>` return 200 | PASS | 27/27 checked live, no 3xx/4xx/5xx |
| No redirect hops in sitemap | PASS | `url_effective` == `loc` for all 27 |
| Self-referencing canonical on every sitemap URL | PASS | 27/27 match exactly (protocol, host, path, trailing-slash all consistent) |
| No noindexed URLs in sitemap | PASS | All 27 pages carry `index, follow` robots meta |
| `lastmod` present & valid W3C date | PASS | `YYYY-MM-DD` format on all 27 entries |
| `lastmod` reflects real content changes (not boilerplate/build stamp) | PASS | Verified against source dates in `blogs.ts` (`publishedAt`/`updatedAt`) and `case-studies/*.ts` (`updatedAt`); generator explicitly omits `lastmod` rather than faking it |
| Deprecated `priority`/`changefreq` tags | INFO | Present on every URL; Google ignores both. Not harmful, just dead weight |
| Sitemap coverage vs crawlable routes (`App.tsx`) | PASS | Every public route (`/`, `/services`, `/projects`, `/projects/:id`×6, `/about`, `/blogs`, `/blogs/:slug`×12, `/contact`, 2 geo pages) is in the sitemap. `/admin*` correctly excluded and disallowed in robots.txt |
| Orphaned/extra sitemap entries (404 or redirected) | PASS (none found) | — |

## Coverage Detail

27 URLs in sitemap, matching live route table exactly:
- 8 static pages: `/`, `/services`, `/projects`, `/about`, `/blogs`, `/contact`, `/web-development-new-zealand`, `/web-development-cyprus`
- 12 blog posts under `/blogs/<slug>`
- 6 project case studies under `/projects/<slug>` (previously undocumented in the audit brief — confirmed live, all 200, all indexable, all present in sitemap: `expense-sharing-app`, `hospital-management-system`, `software-house-website`, `ecommerce-dashboard`, `restful-api-service`, `portfolio-blog-platform`)
- `/admin`, `/admin/login`, `/admin/signup`, `/admin/*` — correctly absent from both sitemap and crawl surface (disallowed in robots.txt)

No missing indexable pages, no extra/orphaned sitemap entries.

## Location Page Quality Gate

- Current geo pages: 2 (`/web-development-new-zealand`, `/web-development-cyprus`) — **well under the 30-page WARNING threshold and the 50-page HARD STOP.**
- Not doorway pages: each carries a distinct `FAQPage` schema (`NZ_FAQS` / `CYPRUS_FAQS` in `site.config.mjs`), country-specific pricing/timezone/payment copy, and city-level detail (NZ: Auckland, Wellington, Hamilton, Christchurch, Dunedin, Tauranga; Cyprus: Limassol, Nicosia, Larnaca, Paphos, Famagusta) rather than templated city-swap text.
- **Watch item, not a current violation:** if a third geo page is added, re-run this gate — the pattern (one config-driven template + FAQ block per country) is exactly the kind of structure that scales into doorway-page territory once it passes ~10-15 near-identical variants. At 2 pages there is no finding.

## Findings

### Low severity
1. **`priority` and `changefreq` tags are present on all 27 URLs.** Both are ignored by Google (and most modern crawlers). Not causing harm, but they're dead weight that could be dropped from `renderSitemap()` in `scripts/prerender.mjs` to simplify the generated file. Optional cleanup, not required.
2. **All 6 project case-study pages share an identical `lastmod` of 2026-08-09.** Verified as legitimate — `src/data/projects.ts` records that the case-study content was split out of a monolith file into `src/data/case-studies/*.ts` on this date, and each file hardcodes `updatedAt: "2026-08-09"` accordingly. Not a fabricated/build-stamped date, but flagging because six identical dates landing on today is the classic pattern this check exists to catch — worth confirming the *next* time one of these six pages changes, its `updatedAt` actually gets bumped individually rather than staying frozen at 2026-08-09 indefinitely.

### Informational (no action required)
- No `<sitemap:>` index file is used — correct choice at 27 URLs; do not introduce one prematurely.
- No image sitemap extension despite every blog/project page having a cover image. Not required, but a cheap incremental-SEO addition later given the content already has `coverImage`/`image` fields wired through `site.config.mjs`/`entry-server.tsx`.
- Sitemap is growing quickly (9 new blog posts + a case-study restructure in roughly the last week per `lastmod`/`publishedAt` dates). Volume itself is not a sitemap defect, but pairs with the content-quality audit: verify each new post clears real word-count/uniqueness bars before the next crawl, since sitemap presence signals "please index this" regardless of depth.

## Score Rationale

**94/100.** Deducted 6 points total: 3 for shipping deprecated `priority`/`changefreq` on every URL (informational but present at 100% of entries), 3 for the six-way identical `lastmod` on project pages being a coincidence that's indistinguishable from a build-stamp bug without reading source — worth a comment in `case-studies/*.ts` noting the date is intentional/manual so it doesn't get "fixed" into a build timestamp later. No critical, high, or medium severity issues: XML is valid, every URL is 200 and canonical, coverage is complete, robots.txt/sitemap cross-reference is correct, and the location-page quality gate is not triggered.

## Source Files Referenced (do not hand-edit generated output)

- `C:\Users\mmuba\Downloads\frontend\frontend\src\lib\site.config.mjs` — static route SEO config + `lastmod` source of truth for the 8 top-level pages
- `C:\Users\mmuba\Downloads\frontend\frontend\src\entry-server.tsx` — assembles `DYNAMIC_ROUTES` (blog + project detail pages) for prerender/sitemap
- `C:\Users\mmuba\Downloads\frontend\frontend\scripts\prerender.mjs` — generates `dist/sitemap.xml`, `dist/robots.txt`, `dist/llms.txt` from the above
- `C:\Users\mmuba\Downloads\frontend\frontend\src\data\blogs.ts` — blog post `publishedAt`/`updatedAt`
- `C:\Users\mmuba\Downloads\frontend\frontend\src\data\projects.ts` and `C:\Users\mmuba\Downloads\frontend\frontend\src\data\case-studies\*.ts` — project `updatedAt`
- `C:\Users\mmuba\Downloads\frontend\frontend\src\App.tsx` — live route table used to cross-check sitemap coverage
