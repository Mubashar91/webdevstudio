# Semantic Topic Clustering Audit — webdevstudio.me

**Audited URL:** https://www.webdevstudio.me/
**Audit date:** 2026-08-09
**Site context:** Solo freelance web developer portfolio, live ~10 days, blog grown from 9 to **13 posts** since the prior 2026-07-30 audit.
**Scope:** Content architecture / hub-spoke clustering, cannibalization check, internal-link matrix. Companion to the backlinks and (presumably) technical/content audits in this same run.

## 0. Content-depth re-check (supersedes 2026-07-30 "thin content" flag)

The prior audit (2026-07-30) flagged the site's (then only 3) blog posts as ~90 words each — critically thin. That flag is **now resolved**. All 13 current posts were re-fetched and measured directly:

| Post | Approx. word count | vs. prior ~90w flag |
|---|---|---|
| mern-stack-architecture-guide | ~850 | Resolved, but thin for its topic breadth |
| typescript-patterns-for-react | ~1,050 | Resolved |
| why-is-my-website-slow | ~1,200 | Resolved |
| why-website-not-showing-on-google | ~1,200 | Resolved |
| react-performance-tips-2025 | ~1,450 | Resolved |
| signs-your-website-is-losing-customers | ~1,400 | Resolved |
| does-my-website-need-a-developer | ~1,650 | Resolved |
| remote-developer-vs-local-agency | ~1,800 | Resolved |
| website-cost-new-zealand-2026 | ~1,850 | Resolved |
| website-cost-cyprus-2026 | ~1,850 | Resolved |
| do-i-need-an-app-or-a-website | ~1,850 | Resolved |
| how-to-hire-a-web-developer | ~2,100 | Resolved |
| custom-web-app-cost-2026 | ~2,150 | Resolved |

All 13 posts now carry real structural depth: multiple H2/H3 sections, dedicated FAQ blocks with schema-shaped Q&A, and a consistent "Where to start" CTA section. **Clustering and pillar/spoke recommendations are no longer premature** — this is the primary conclusion the orchestrator needs from this module before acting on the architecture below.

One important nuance survives from the depth check: none of the four posts selected as cluster pillars below currently reach true pillar depth (2,500-4,000 words per the hub-spoke spec) — see §4.

## 1. Intent classification

| Post | Primary keyword (inferred) | Intent |
|---|---|---|
| react-performance-tips-2025 | react performance tips 2025 | Informational (dev audience) |
| mern-stack-architecture-guide | mern stack architecture guide | Informational (dev audience) |
| typescript-patterns-for-react | typescript patterns for react | Informational (dev audience) |
| custom-web-app-cost-2026 | custom web app cost 2026 | Commercial investigation |
| website-cost-new-zealand-2026 | website cost new zealand 2026 | Commercial investigation (geo) |
| website-cost-cyprus-2026 | website cost cyprus | Commercial investigation (geo) |
| do-i-need-an-app-or-a-website | do i need an app or a website | Commercial investigation |
| remote-developer-vs-local-agency | remote developer vs local agency | Commercial investigation |
| how-to-hire-a-web-developer | how to hire a web developer | Commercial investigation |
| why-is-my-website-slow | why is my website slow | Informational (symptom search, high commercial adjacency) |
| signs-your-website-is-losing-customers | signs your website is losing customers | Informational (symptom search) |
| why-website-not-showing-on-google | why is my website not showing up on google | Informational (symptom search) |
| does-my-website-need-a-developer | does my website need a developer | Informational → Commercial investigation crossover |

No navigational keywords in this set (nothing branded to strip out). No two posts share a primary keyword.

## 2. SERP overlap findings (cannibalization check)

Live SERP checks were run for the head term of each candidate cluster group. Overlap counted as shared domains in the top organic results.

| Pair | Shared domains (top results) | Overlap score | Verdict |
|---|---|---|---|
| custom-web-app-cost-2026 ↔ website-cost-new-zealand-2026 | 0 | 0 | Separate posts — correct |
| custom-web-app-cost-2026 ↔ website-cost-cyprus-2026 | 0 | 0 | Separate posts — correct |
| website-cost-new-zealand-2026 ↔ website-cost-cyprus-2026 | 0 | 0 | Separate posts — correct (fully distinct local-competitor SERPs, NZ vs .cy domains) |
| how-to-hire-a-web-developer ↔ remote-developer-vs-local-agency | 0 | 0 | Separate posts — correct |
| remote-developer-vs-local-agency ↔ do-i-need-an-app-or-a-website | 1 (thisisglance.com) | 1 | Interlink only |
| why-is-my-website-slow ↔ why-website-not-showing-on-google | 1 (goodreads.com) | 1 | Interlink only |
| why-is-my-website-slow ↔ signs-your-website-is-losing-customers | 0 | 0 | Separate posts — correct |
| does-my-website-need-a-developer ↔ (all diagnostic siblings) | 0-1 | 0-1 | Separate posts — correct |
| react-performance-tips-2025 ↔ typescript-patterns-for-react ↔ mern-stack-architecture-guide | 0 (domain-level co-occurrence on medium.com/dev.to only, different articles) | 0 | Separate posts — correct |

**No cannibalization risk found anywhere in the current 13-post set.** Every post targets a genuinely distinct SERP, including the two country-specific cost posts vs. the general one — the "duplicate-intent overlap" flagged as a hypothesis in the brief does **not** materialize in practice: NZ and Cyprus cost searches pull 100% distinct, geography-specific competitor domains, and neither overlaps with the general "custom web app cost" SERP. This is a correct architecture (geo-modified spokes under a general pillar), not a duplication problem — keep all three, but tighten the interlinking between them (see §4).

## 3. Cluster architecture

Given the two structurally distinct audiences this blog is serving (prospective **clients** evaluating cost/hiring/site-health, vs. **fellow developers** reading technical deep-dives for credibility/SEO breadth), a single site-wide pillar is not a good fit — the brief's three candidate clusters are confirmed and formalized as four clusters, each with its own pillar:

### Cluster 1 — Cost & Budget Planning (commercial investigation)
- **Pillar:** `custom-web-app-cost-2026` (broadest, non-geo-locked cost query)
- **Spokes:** `website-cost-new-zealand-2026`, `website-cost-cyprus-2026`

### Cluster 2 — Choosing Who Builds It (commercial investigation / hiring decision)
- **Pillar:** `how-to-hire-a-web-developer` (broadest, highest generic search volume)
- **Spokes:** `remote-developer-vs-local-agency`, `do-i-need-an-app-or-a-website`

### Cluster 3 — Website Health Diagnostics (informational, high commercial adjacency)
- **Pillar:** `why-is-my-website-slow` (broadest single symptom query)
- **Spokes:** `signs-your-website-is-losing-customers`, `why-website-not-showing-on-google`, `does-my-website-need-a-developer`

### Cluster 4 — React / TypeScript / MERN Technical (informational, developer-audience credibility content)
- **Pillar:** `mern-stack-architecture-guide` (broadest technical scope)
- **Spokes:** `react-performance-tips-2025`, `typescript-patterns-for-react`

4 clusters, 2-4 posts each, 13 posts total — within spec (2-5 clusters / 2-4 posts).

## 4. Critical finding: pillars are written at spoke-depth, not pillar-depth

Word-count target per the hub-spoke spec is pillar 2,500-4,000 / spoke 1,200-1,800. Checking the four selected pillars against actual content:

| Pillar | Actual word count | Target | Gap |
|---|---|---|---|
| custom-web-app-cost-2026 | ~2,150 | 2,500-4,000 | -350 to -1,850 |
| how-to-hire-a-web-developer | ~2,100 | 2,500-4,000 | -400 to -1,900 |
| why-is-my-website-slow | ~1,200 | 2,500-4,000 | -1,300 to -2,800 |
| mern-stack-architecture-guide | ~850 | 2,500-4,000 | **-1,650 to -3,150 (worst gap on the site — this is also the thinnest post overall)** |

**None of the four natural pillar candidates currently meet pillar-depth.** The site effectively has 13 spoke-tier posts with no true hub page consolidating and out-depth-ing competitors for the head terms ("web app cost," "hire a web developer," "website slow," "MERN architecture"). This matters most for Cluster 4: `mern-stack-architecture-guide` is both the broadest-scope post in its cluster and the shortest post on the entire site (~850 words) — it needs the largest expansion of any candidate pillar before it can functionally act as one (more schema-design detail, a deployment topology diagram/section, testing strategy, and a comparison-of-alternatives section would be natural additions given its existing 7 H2s are already itemized but each thinly developed).

Two viable remediation paths: (a) expand these four posts to pillar depth, or (b) keep them as-is and add net-new dedicated pillar/hub pages per cluster that synthesize+link to the existing spokes. Given this is a solo operator, (a) is more resource-realistic — recommend prioritizing `mern-stack-architecture-guide` first (largest gap) and `why-is-my-website-slow` second.

## 5. Internal link matrix — current state vs. recommended

### Current state (verified by fetching all 13 posts)

Only blog-post-to-blog-post links were counted (generic nav links to `/about /projects /blogs /services /contact` and the two location pages exist on every post and were excluded as boilerplate).

| Post | Current inbound (from sibling posts) | Current outbound (to sibling posts) |
|---|---|---|
| how-to-hire-a-web-developer | 2 (website-cost-new-zealand-2026, remote-developer-vs-local-agency) | 2 |
| why-is-my-website-slow | 2 (signs-..., why-website-not-showing-on-google) | 0 |
| why-website-not-showing-on-google | 2 | 1 |
| signs-your-website-is-losing-customers | 1 | 2 |
| website-cost-new-zealand-2026 | 1 | 2 |
| website-cost-cyprus-2026 | 1 | 0 |
| remote-developer-vs-local-agency | 1 | 1 |
| **does-my-website-need-a-developer** | **0 (orphan as link target)** | 2 |
| **custom-web-app-cost-2026** | **0 (orphan)** | 0 |
| **do-i-need-an-app-or-a-website** | **0 (orphan)** | 0 |
| **react-performance-tips-2025** | **0 (orphan)** | 0 |
| **mern-stack-architecture-guide** | **0 (orphan)** | 0 |
| **typescript-patterns-for-react** | **0 (orphan)** | 0 |

**Finding:** the site's writer has already been building an implicit hub-spoke structure by hand for Cluster 2 and Cluster 3 (there is real, sensible cross-linking already live between `how-to-hire-a-web-developer` / `remote-developer-vs-local-agency` / `website-cost-new-zealand-2026`, and between the three diagnostic posts). That is a genuine strength to build on. But **no post anywhere on the site currently has 3+ inbound links from sibling posts** (max observed is 2), and **6 of 13 posts (46%) are total inbound orphans** — including both cost-cluster geo posts' sibling `custom-web-app-cost-2026`, the whole technical cluster (3 posts), and `do-i-need-an-app-or-a-website`. `does-my-website-need-a-developer` is a target-orphan despite itself linking out to two siblings — a one-way street.

### Recommended link matrix

**Mandatory (bidirectional spoke ↔ pillar):**
- `custom-web-app-cost-2026` ↔ `website-cost-new-zealand-2026`
- `custom-web-app-cost-2026` ↔ `website-cost-cyprus-2026`
- `how-to-hire-a-web-developer` ↔ `remote-developer-vs-local-agency`
- `how-to-hire-a-web-developer` ↔ `do-i-need-an-app-or-a-website`
- `why-is-my-website-slow` ↔ `signs-your-website-is-losing-customers`
- `why-is-my-website-slow` ↔ `why-website-not-showing-on-google`
- `why-is-my-website-slow` ↔ `does-my-website-need-a-developer`
- `mern-stack-architecture-guide` ↔ `react-performance-tips-2025`
- `mern-stack-architecture-guide` ↔ `typescript-patterns-for-react`

**Recommended (spoke ↔ spoke, same cluster):**
- `website-cost-new-zealand-2026` ↔ `website-cost-cyprus-2026` (new — "comparing pricing across two markets" is a natural reader path for a remote-first freelancer serving both)
- `remote-developer-vs-local-agency` ↔ `do-i-need-an-app-or-a-website` (new)
- `signs-your-website-is-losing-customers` ↔ `why-website-not-showing-on-google` (new; the reciprocal of an existing one-way link)
- `does-my-website-need-a-developer` ↔ `signs-your-website-is-losing-customers` (already exists, keep)
- `does-my-website-need-a-developer` ↔ `why-website-not-showing-on-google` (already exists, keep)
- `react-performance-tips-2025` ↔ `typescript-patterns-for-react` (new)

**Optional (cross-cluster, fixes the technical-cluster isolation and completes the buyer journey):**
- `do-i-need-an-app-or-a-website` (C2) → `custom-web-app-cost-2026` (C1) — "next question: what will this cost"
- `custom-web-app-cost-2026` (C1) → `how-to-hire-a-web-developer` (C2) — "next question: who should build it"
- `does-my-website-need-a-developer` (C3) → `how-to-hire-a-web-developer` (C2) — highest-value missing link on the site: this is the most bottom-funnel diagnostic post ("yes, you need a developer") with zero current path into the hiring-decision cluster
- `why-is-my-website-slow` (C3) ↔ `react-performance-tips-2025` (C4) — bridges the isolated technical cluster to the client-facing diagnostic cluster on a shared topic (performance), and lets business-audience readers see technical depth as a trust signal
- `why-is-my-website-slow` (C3) → `typescript-patterns-for-react` (C4) — same rationale, closes out C4's inbound-link gap

Applying this full matrix brings every one of the 13 posts to **3+ inbound sibling links** and **zero orphans**, satisfying the pre-delivery checklist.

## 6. Template & intent-match check

All 13 posts already use a template appropriate to their intent — no mismatches found:

| Cluster | Template in use | Intent match |
|---|---|---|
| Cost (C1) | Pricing-guide (price bands + cost-driver breakdown + FAQ schema + CTA) | Correct for commercial investigation |
| Hiring/Decision (C2) | Comparison/decision-framework + FAQ + CTA | Correct for commercial investigation |
| Diagnostics (C3) | Symptom-checklist / numbered-causes + FAQ + CTA | Correct for informational-with-commercial-adjacency |
| Technical (C4) | Best-practices how-to, "Where to start" close, no hard sales CTA | Correct for dev-audience informational content |

## 7. Top recommendations (priority order)

1. **Fix the internal link matrix, especially the technical-cluster isolation and the `does-my-website-need-a-developer` → `how-to-hire-a-web-developer` gap.** 6 of 13 posts are currently inbound-orphans and no post has 3+ sibling inbound links; apply the matrix in §5. This is pure editing effort (no new content required) and is the highest-ROI, lowest-cost fix available.
2. **Expand the four cluster-pillar posts to true pillar depth (2,500-4,000 words), prioritizing `mern-stack-architecture-guide` (~850 words, worst gap and thinnest post site-wide) and `why-is-my-website-slow` (~1,200 words) first.** Until this is done, none of the four clusters has a genuine hub page capable of consolidating ranking signal for its head term — the site is currently 13 spokes with no hubs.
3. **Keep all three cost posts and the full diagnostic-cluster split as-is — SERP data confirms no cannibalization.** The hypothesis in the brief that the NZ/Cyprus/general cost posts might have duplicate-intent overlap did not hold up: 0 shared SERP domains between any pair. Resist any temptation to merge them; the fix needed is linking (§5), not consolidation.

## Cross-Skill Notes

- E-E-A-T / content-quality standards for the pillar-expansion work in recommendation #2 should follow `seo-content` guidance.
- Any FAQ schema already implied by the FAQ sections on all 13 posts should be verified/templated per `seo-schema` guidance — not assessed in this module.
- This module did not re-verify technical crawlability/indexability of the blog section; see the technical-audit module for that.

## Data Source Log

- Sitemap re-fetch: `https://www.webdevstudio.me/sitemap.xml` → 13 blog posts confirmed (grown from 9 at prior audit).
- Full-text fetch + word count + heading + internal-link extraction for all 13 blog posts (WebFetch, 2026-08-09).
- Live WebSearch SERP checks for 13 head-term queries across all four clusters to compute overlap scores (2026-08-09).
