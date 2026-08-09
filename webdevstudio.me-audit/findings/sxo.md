# SXO Audit — webdevstudio.me (Search Experience Optimization)

Scope: highest commercial-intent pages — `/web-development-new-zealand`, `/web-development-cyprus`, `/services`,
and the "cost of a website / cost of a custom web app" blog cluster — read against what Google actually
rewards in the live SERP for the buyer queries these pages are meant to win.

Site: solo freelance developer (Muhammad Mubashar Shahzad, Pakistan-based, React/TS/MERN) positioned as a
remote alternative to local agencies for NZ and Cyprus SMBs, "fixed scope, fixed price."

Pages fetched via `render_page.py --mode auto` (all resolved `mode_used=raw`, `is_spa=false` — the site is
a fully prerendered static build, so raw and rendered DOM are identical) and parsed via `parse_html.py`.

---

## 0. Primary Finding (lead insight)

**This is not primarily a page-type mismatch — it's a Trust/Authority mismatch wearing a page-type
disguise.** The site's page-type choices are architecturally sound and mostly match SERP consensus:

- `/web-development-new-zealand`, `/web-development-cyprus`, `/services` → built as **Service Pages**
  (process section, tiered pricing, FAQ, `Service`/`Organization` schema) — the correct type for the
  commercial head-terms they target.
- `/blogs/website-cost-new-zealand-2026`, `/blogs/website-cost-cyprus-2026`, `/blogs/custom-web-app-cost-2026`
  → built as **Blog Posts** (`BlogPosting` schema, FAQ, 1,300–1,900 words) — exactly the format that
  dominates the SERP for "website cost [place] 2026" queries.
- `/blogs/remote-developer-vs-local-agency` → built as a **Comparison Page** ("vs" framing, pros/cons,
  one `<table>`) — the correct type for the exact buyer decision this URL slug names.

So the *format* is right. What's missing is what the taxonomy calls the **Required Elements** for Service
Pages — "at least one case study or testimonial" and visual trust signals — and that gap is severe and
verifiable:

- Zero `<img>` tags on `/web-development-new-zealand`, `/web-development-cyprus`, or `/services`
  (`images: []` in every parse). No team photo, no client logos, no work-sample thumbnails.
- Zero genuine testimonial/review content anywhere in these three pages. Every "review" text match
  traced back to unrelated strings ("code review", "review progress") — confirmed by direct grep, not
  assumption.
- The pages' own proof mechanism — "View case study" links to `/projects/*` — point at case studies whose
  `outcome` / `hardPart` / `screenshots` fields are still null/empty per the 2026-08-08 audit, independently
  re-confirmed here: fetching `/projects/expense-sharing-app` and searching its rendered HTML for
  "outcome", "hard part", or "screenshot" returns **zero matches**. The proof section literally does not
  render.
- Google's actual top results for "web development New Zealand" and "web developer Cyprus" are dominated
  by NZ-/CY-domiciled agencies on local ccTLDs (`.co.nz`, `.com.cy`) with visible local addresses, teams,
  and portfolios (Somar Digital, The WebCo, Absolute Websites, Applab Projects), plus review-aggregator
  directories (Clutch, DesignRush, TechBehemoths) where WebDevStudio has no listed profile at all.

Net effect: a buyer who reaches these pages sees a well-structured, well-schema'd Service Page that reads
as **unproven** next to competitors who visibly are. This is scored explicitly under Authority/Trust below,
and it is the single lowest-scoring dimension across every page and every persona in this audit.

---

## 1. Page Inventory & Classification

| URL | Title | Word count | H2/H3 | Images | Schema blocks | Page type (taxonomy) |
|---|---|---:|---|---:|---:|---|
| `/web-development-new-zealand` | Web Developer for New Zealand — Fixed Prices from $900 | 1,162 | 8 / 21 | **0** | 8 | Service Page |
| `/web-development-cyprus` | Web Developer in Cyprus — Fixed Prices from $900 | 1,103 | 8 / 21 | **0** | 8 | Service Page |
| `/services` | Web Development Services & Pricing \| WebDevStudio | 898 | 7 / 19 | **0** | 8 | Service Page |
| `/blogs/website-cost-new-zealand-2026` | How Much Does a Website Cost in New Zealand in 2026? | 1,536 (1,341 body) | 13 / — | 1 | 8 (incl. `BlogPosting`) | Blog Post |
| `/blogs/website-cost-cyprus-2026` | How Much Does a Website Cost in Cyprus in 2026? | 1,307 | 13 / — | 1 | 8 | Blog Post |
| `/blogs/custom-web-app-cost-2026` | How Much Does a Custom Web App Cost in 2026? | 1,926 | 20 / — | 1 | 8 | Blog Post |
| `/blogs/remote-developer-vs-local-agency` | Remote Developer or Local Agency? An Honest Comparison | 1,609 | 13 / — | 1, 1 `<table>` | 8 | Comparison Page |
| `/` (home) | React & MERN Web Development \| WebDevStudio | — | 7 H2 | 9 (project/blog thumbnails) | 8 | Hybrid (Service + Content) |

Schema quality is consistently strong site-wide: `Organization`, `Person` (founder, with `knowsAbout`,
`alumniOf`), `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`, `Service`/`OfferCatalog` with priced
`Offer` nodes, and `BlogPosting` with `datePublished`/`dateModified`/`author` on posts. This is above
what most of the SERP competitors surfaced here appear to implement, and is a genuine strength — it is
not where the ranking problem lives.

---

## 2. SERP Consensus by Query

### "web development New Zealand" / "web development New Zealand company"
Dominant type: **Service Page (~55%)** + **Comparison/Directory (~35%)** (Clutch, TechBehemoths, DesignRush
rankings pages) + occasional local-agency blend. All non-directory results are NZ-domiciled agencies
(Somar Digital – Wellington, The WebCo – Auckland) with visible local address/team/portfolio.
Target page type (Service Page) = **ALIGNED** on format; **CRITICAL gap on Required Elements**
(case studies, testimonials, local-market authority) and on domain/geo authority (`.me` + PK address vs.
`.co.nz` competitors) — a ranking ceiling this audit cannot fix on-page.

### "website cost New Zealand 2026"
Dominant type: **Blog Post (~90%)** — cost-breakdown guides from NZ agencies (Spiritx, Fuel Design, Alpine
Studio, Lucid Media ×3, Weblumino), plus one **Tool/Interactive** (Kiwi Web Design's cost calculator).
Target page (`/blogs/website-cost-new-zealand-2026`) = **ALIGNED**. This is the strongest page on the site
relative to its SERP. Opportunity: none of WebDevStudio's cost content includes an interactive
calculator — the one differentiator a competitor already owns in this SERP.

### "website cost Cyprus 2026"
Dominant type: **Blog Post (~100%)** (onlinesolutions.com.cy, PGS Web Studio, DomainStar, Bandziuk,
Citrus & KTMA, Cyprus Digital Agency). Target page = **ALIGNED**.

### "custom web app development cost 2026"
Dominant type: **Blog Post (~100%)** — every visible result is a cost-breakdown/pricing-guide article
(Phaedra, Zao, SaM Solutions, Refact, Orbix, Cleveroad, Utsubo, Kavara). Target page
(`/blogs/custom-web-app-cost-2026`) = **ALIGNED**, and at 1,926 words / 20 H2s it is deeper than most
competitor guides — a genuine content-depth strength. Weakness: unlike its sibling cost posts, this page
has **zero `<table>` elements** despite structuring its core answer as "three price bands" — a scannability
and snippet-eligibility miss versus its own site siblings.

### "web developer Cyprus"
Mixed/ambiguous SERP: **Comparison/Directory (Clutch, DesignRush)** + **Service Page** (Absolute Websites,
Applab Projects, UntitledPros) + **job-seeker noise** (LinkedIn jobs, CyprusWork listings) — the head-term
is intent-contaminated by people looking for developer *jobs*, not people hiring one. Target page type
(Service Page) = **ALIGNED** for the commercial-intent slice of this SERP, but the keyword itself is a poor
primary target; a longer-tail variant ("hire a web developer in Cyprus" / "web development company Cyprus")
would return cleaner commercial intent.

**SERP consensus confidence note:** WebSearch results here are organic-link listings, not a full rendered
SERP — PAA boxes, ads, featured-snippet format, and AI Overview citations could not be directly observed
(see Limitations). Page-type classification of competitors is based on titles/URLs/domain signals only.

---

## 3. Page-Type Mismatch Ratings

| Page | Mismatch severity | Basis |
|---|---|---|
| `/web-development-new-zealand` | **MEDIUM** | Correct type (Service Page), but fails Required Elements: no case study, no image, no testimonial. |
| `/web-development-cyprus` | **MEDIUM** | Same as above. |
| `/services` | **ALIGNED** (format) / **MEDIUM** (trust) | Correctly delegates informational cost intent to dedicated blog posts rather than trying to rank the pricing page itself; same missing-proof gap. |
| `/blogs/website-cost-new-zealand-2026` | **ALIGNED** | Matches Blog Post SERP consensus closely; strongest page on the site. |
| `/blogs/website-cost-cyprus-2026` | **ALIGNED** | Same. |
| `/blogs/custom-web-app-cost-2026` | **ALIGNED** (type) / minor structural gap (no table) | Matches Blog Post consensus; missing comparison table its own sibling posts have. |
| `/blogs/remote-developer-vs-local-agency` | **ALIGNED** | Correct Comparison Page type for a "vs" decision query; directly serves both requested personas. |
| `/projects/*` case studies | **HIGH** (proof-of-claim mismatch) | SERP competitors' "case study"/"portfolio" content shows real outcomes; WebDevStudio's case-study template renders with `outcome`/`hardPart`/`screenshots` empty — independently re-confirmed by direct HTML grep during this audit. |

---

## 4. User Stories (derived from observed SERP + on-page signals)

1. **As an NZ small-business owner**, I want to know whether a remote/offshore developer is actually
   trustworthy for my project, because most agencies I see ranking for "web development New Zealand" are
   local NZ companies with visible teams and portfolios, but I'm blocked by a **trust gap** — the
   WebDevStudio geo pages show zero client photos, zero testimonials, and case-study links that don't
   actually show outcomes.
   *(Source: SERP dominance of `.co.nz` agency domains with visible local presence; on-page absence of
   images/testimonials confirmed by parse.)*

2. **As a technical founder** evaluating a MERN specialist for a custom build, I want a clear, defensible
   breakdown of what drives cost (permission model, data model, integrations), because every top result
   for "custom web app development cost 2026" is a detailed cost-driver guide, and I'm blocked by
   **comparison fatigue** if the breakdown isn't scannable.
   *(Source: SERP consensus = Blog Post with cost-driver breakdowns; target page has the right content
   but no `<table>` to make the "three price bands" comparison scannable.)*

3. **As a budget-conscious Cyprus SME owner**, I want a clear EUR price range for my type of site, because
   every Cyprus cost guide in the SERP quotes concrete bands, but I'm blocked by **price-sensitivity +
   confusion** when the geo landing page headlines "$900 USD" while the linked cost blog post quotes
   "€800–€3,500" — two different currencies and framings for what should be one consistent price story.
   *(Source: direct comparison of `/web-development-cyprus` meta description "$900" vs.
   `/blogs/website-cost-cyprus-2026` meta description "€800–€3,500".)*

4. **As a risk-averse decision maker** hiring someone I've never met, based outside my country, I want
   third-party proof (reviews, ratings, a directory listing) before I commit, because the SERP for
   "web developer Cyprus" and "web development New Zealand" surfaces Clutch/DesignRush/TechBehemoths
   directories as trusted intermediaries, but I'm blocked because WebDevStudio has **no listed profile**
   on any of those directories and no verifiable third-party rating anywhere in the funnel.
   *(Source: directory domains appearing in both NZ and Cyprus SERPs; absence of any directory/review
   presence for webdevstudio.me.)*

5. **As a comparison shopper** already narrowing between 2–3 vendors, I want a direct, honest "remote vs
   local agency" comparison so I can decide with confidence, because "vs"-style comparison content is
   exactly what decision-stage searchers look for, and WebDevStudio **does** have this
   (`/blogs/remote-developer-vs-local-agency`) — but it isn't linked from the two geo landing pages where
   this persona would actually be standing.
   *(Source: user-story-framework "comparison fatigue" pattern; on-page link audit found no cross-link
   from `/web-development-new-zealand` or `/web-development-cyprus` to the comparison post.)*

Journey stages covered: awareness (#3), consideration (#1, #2, #4), decision (#5).

---

## 5. Gap Analysis (7 dimensions, 100 pts)

### `/web-development-new-zealand` & `/web-development-cyprus` (near-identical structure, scored together)

| Dimension | Score | Evidence |
|---|---:|---|
| Page Type | 11/15 | Correct Service Page structure (process via FAQ, 3-tier pricing, area-served cities, contact CTA) but missing the case-study/portfolio block the taxonomy requires as a "Required Element." |
| Content Depth | 12/15 | 1,103–1,162 words, 8 H2 / 21 H3, 6-question `FAQPage` — comparable to competitor agency pages; no cited local market data/benchmarks. |
| UX Signals | 9/15 | 3 differently-worded CTAs repeated through the page, 1 pricing comparison `<table>`; zero visual hierarchy aids (no images/icons rendered as `<img>`). |
| Schema | 14/15 | `Organization`, `Person`, `WebSite`, `WebPage`, `BreadcrumbList`, `FAQPage`, `Service` (with per-city `areaServed`), `OfferCatalog`/`Offer` — near best-practice; no `Review`/`AggregateRating` (none exist to mark up). |
| Media | 2/15 | **0 images, 0 video** on either page — confirmed via `parse_html.py` (`"images": []`). |
| Authority | 3/15 | No testimonials, no verifiable client names/logos, linked case studies render with empty proof fields, generic `.me` TLD + Pakistan address vs. local ccTLD competitors, no directory presence. |
| Freshness | 9/10 | `dateModified: 2026-07-30`, recent. |
| **Total** | **60/100** | **SXO Gap Score: Needs Work** |

### `/services`

| Dimension | Score | Evidence |
|---|---:|---|
| Page Type | 13/15 | Textbook Service Page: "How I Work" process (4 steps), 3-tier `OfferCatalog` pricing, 5-question FAQ, `Service` schema. Correctly does *not* try to compete for the Blog-Post-dominated cost-guide SERP itself. |
| Content Depth | 11/15 | 898 words, 7 H2 / 19 H3 — thinner than the geo pages; no embedded mini case studies. |
| UX Signals | 10/15 | 1 pricing `<table>`, 7 CTA instances across the page; zero images. |
| Schema | 14/15 | Same strong `Organization`/`Service`/`OfferCatalog`/`FAQPage` stack. |
| Media | 2/15 | 0 images. |
| Authority | 4/15 | Same testimonial/case-study gap. Additional risk: this page publishes `Offer` schema with hard prices ($900/$2,500/$1,200) that are internally flagged as **assumed figures pending real confirmation** — if these change, the schema and page copy will silently drift out of sync with reality. |
| Freshness | 9/10 | `dateModified: 2026-07-30`. |
| **Total** | **63/100** | **SXO Gap Score: Needs Work** |

### Cost/comparison blog cluster (`website-cost-new-zealand-2026`, `website-cost-cyprus-2026`, `custom-web-app-cost-2026`, `remote-developer-vs-local-agency`)

| Dimension | Score | Evidence |
|---|---:|---|
| Page Type | 14/15 | Correct Blog Post / Comparison Page types, matching SERP consensus almost exactly. |
| Content Depth | 14/15 | 1,307–1,926 words, 12–20 H2s, nested `FAQPage` — deeper than most competitor guides found in SERP. |
| UX Signals | 10/15 | 1 `<table>` in 3 of 4 posts (missing on `custom-web-app-cost-2026` despite a "three price bands" structure that needs one); good heading scannability; "Where to start"/"Related" sections aid navigation. |
| Schema | 15/15 | Full `BlogPosting` + `Person` (author, with `knowsAbout`/`alumniOf`) + `FAQPage` + `BreadcrumbList` + `WebPage`, `datePublished`/`dateModified` present — best-practice, better than most of the ranking competitors appear to implement. |
| Media | 5/15 | Only 1 generic stock/Unsplash image per post; no price-band charts, comparison infographics, or diagrams — the exact visual format that would most help a cost-comparison query. |
| Authority | 6/15 | Author entity is a genuine E-E-A-T asset (named founder, 5+ years, `alumniOf` a university, tech `knowsAbout` list) — better than the geo/service pages — but no external sourcing/citations for the NZ/Cyprus market figures quoted, and the pricing claims aren't yet backed by linked, populated case studies. |
| Freshness | 10/10 | `datePublished`/`dateModified` 2026-08-06/07, genuinely fresh. |
| **Total** | **74/100** | **SXO Gap Score: Good** — the strongest cluster on the site, consistent with its ALIGNED page-type finding. |

---

## 6. Persona Scoring

Personas derived from SERP signals above (directory dominance, ccTLD-local competitor dominance, cost-guide
format dominance, and the "vs" comparison query pattern). Scored primarily against the geo/service page
cluster (the highest commercial-intent pages named in scope), with the blog cluster noted as a mitigating
asset where relevant.

| Persona | Journey Stage | Relevance | Clarity | Trust | Action | Total | Rating |
|---|---|---:|---:|---:|---:|---:|---|
| NZ small-business owner comparing local vs. remote | Awareness/Consideration | 20/25 | 16/25 | 6/25 | 18/25 | 60/100 | Needs Work |
| Technical founder evaluating a MERN specialist | Consideration/Decision | 22/25 | 18/25 | 10/25 | 17/25 | 67/100 | Good |
| Budget-conscious Cyprus SME owner | Awareness | 21/25 | 17/25 | 6/25 | 18/25 | 62/100 | Needs Work |
| Risk-averse decision maker (unfamiliar offshore hire) | Consideration | 18/25 | 16/25 | 5/25 | 15/25 | 54/100 | Needs Work |
| Comparison shopper (Clutch/DesignRush-style) | Decision | 14/25 | 14/25 | 5/25 | 12/25 | 45/100 | **Critical Mismatch** |

### Weakest Persona: Comparison Shopper (45/100)
**Top issue:** This persona's entire journey runs through directories (Clutch, DesignRush, TechBehemoths)
where WebDevStudio has no listed profile — the persona never reaches the site through its normal path, and
once there, finds no comparison table or "why us vs. an agency" asset positioned for decision stage.
**Recommended fix:** Create free/verified profiles on Clutch and DesignRush citing the same case-study
data (once populated — see below), and add a compact comparison table (fixed-price freelancer vs. agency
retainer vs. platform builder) directly on `/services` and both geo pages, linking to the existing
`remote-developer-vs-local-agency` post.

### Systemic Issue
**Trust (avg. 6.4/25 across all 5 personas)** is the single lowest-scoring dimension for every persona,
regardless of journey stage. This traces to one root cause repeated across pages: `/projects/*` case
studies render with empty `outcome`/`hardPart`/`screenshots` fields, so every page that points to them as
proof (home, both geo pages, `/services`) inherits the same trust deficit.

### Priority Actions
1. **Fix the root-cause proof gap first**: populate `outcome`, `hardPart`, and `screenshots` on the six
   `/projects/*` case studies. This single fix raises the Authority dimension for every downstream page
   that links to them (home, `/services`, both geo pages) and is a prerequisite for every other trust fix
   below being credible.
2. **Add real client testimonials + at least one identifiable client name/logo per geo page** to
   `/web-development-new-zealand` and `/web-development-cyprus`, plus a single team/founder photo — closes
   the Media dimension's biggest single gap (currently 0 images on both pages).
3. **Resolve the NZ/CY price-framing inconsistency**: `/web-development-cyprus` headlines "$900 USD" while
   `/blogs/website-cost-cyprus-2026` quotes "€800–€3,500" — align currency and framing between the landing
   page and its own linked cost guide before a Cyprus buyer notices the mismatch mid-funnel.

---

## 7. Cross-Skill Recommendations

- **`/seo content`** — recommended for a deeper E-E-A-T pass on the geo/service pages given the confirmed
  authority gap (no testimonials, unpopulated case studies, unconfirmed pricing figures publishing live in
  `Offer` schema).
- **`/seo page`** — recommended for `/projects/*` specifically: the empty `outcome`/`hardPart`/`screenshots`
  fields are a page-level content-completeness defect, not an SXO structural issue, and are the single
  highest-leverage fix identified in this audit.
- **`/seo schema`** — not urgently needed; schema implementation across the site is already strong
  (`Organization`, `Person`, `Service`, `OfferCatalog`, `BlogPosting`, `FAQPage`, `BreadcrumbList` all
  present and well-formed). Only gap: no `Review`/`AggregateRating` schema, which cannot be added
  legitimately until real reviews exist.
- **`/seo local`** — worth considering for the geo pages, though with caveats: WebDevStudio is a remote-only
  business with no physical NZ/Cyprus presence, so classic `LocalBusiness`/GBP tactics don't directly apply.
  A GBP-adjacent analysis could still help decide whether directory listings (Clutch, DesignRush) are a
  better local-authority substitute than a Google Business Profile.

---

## 8. Limitations

- SERP analysis used `WebSearch` result listings (titles, URLs, AI-summarized snippets), not a rendered
  Google SERP screenshot/scrape. **PAA boxes, ad copy, featured-snippet format, related searches, and AI
  Overview citations could not be directly observed** — user stories above are grounded in organic-result
  domain/title patterns and the taxonomy's SERP-indicator heuristics, not confirmed PAA/AI Overview content.
  Treat SERP-feature-based claims (e.g., "no AI Overview citation") as not assessed rather than absent.
- Competitor page-type classification relied on titles, URLs, and domain signals from search results, not
  full rendering of each competitor page — depth/media/schema estimates for competitors are directional,
  not measured.
- This audit covered the explicitly in-scope high-commercial-intent pages
  (`/web-development-new-zealand`, `/web-development-cyprus`, `/services`, and the cost/comparison blog
  cluster) plus `/` and one `/projects/*` case study for corroboration. `/about` and `/contact` were not
  independently fetched/parsed in this pass.
- Ranking feasibility for broad head-terms ("web development New Zealand") is also gated by off-page/domain
  authority (backlinks, directory citations, ccTLD vs. generic TLD) that no on-page SXO fix can fully close
  — flagged above as a durable ceiling, out of scope for this audit's remediation but material to expectation-
  setting.

---

## Files referenced
- `C:\Users\mmuba\Downloads\frontend\frontend\webdevstudio.me-audit\findings\sxo.md` (this file)
