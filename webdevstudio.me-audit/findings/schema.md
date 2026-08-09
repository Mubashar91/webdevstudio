# Schema.org Structured Data Audit — webdevstudio.me

Audited live (raw HTML, `--mode never`, JS not required — all JSON-LD is baked in at prerender time). Source of truth for every node is `src/lib/site.config.mjs`, consumed by `src/lib/seo.ts` (client runtime) and `src/entry-server.tsx` (prerender). Fixes below point at those files — never hand-edit generated `<script type="application/ld+json">` tags in `dist/`.

**Score: 90 / 100**

---

## 1. Detection results

One connected `@graph` (`@context: https://schema.org`) is injected per route, built by `routeGraph()` in `site.config.mjs`. Confirmed identical between the repo source and the deployed site (fetched live, no drift).

| Route | @types present | Extra nodes |
|---|---|---|
| `/` | ImageObject, Organization, Person, WebSite, WebPage, PostalAddress×2, ContactPoint, OfferCatalog, Offer×3, PriceSpecification×3, Service×3(nested), Country×5, CollegeOrUniversity | — (no breadcrumb on homepage, no FAQ) |
| `/services` | + BreadcrumbList, **FAQPage**, page-scoped Service (with its own OfferCatalog/Offer×3 + ServiceChannel) | |
| `/projects` | + BreadcrumbList, CollectionPage, ItemList → 6× CreativeWork (ListItem) | |
| `/about` | + BreadcrumbList, AboutPage | |
| `/blogs` | + BreadcrumbList, Blog → 13× BlogPosting stubs (`blogPost` array) | |
| `/contact` | + BreadcrumbList, ContactPage | |
| `/web-development-new-zealand` | + BreadcrumbList, **FAQPage**, Service scoped to NZ with `areaServed` City×6 (Auckland, Wellington, Christchurch, Hamilton, Tauranga, Dunedin) + ServiceChannel | |
| `/web-development-cyprus` | + BreadcrumbList, **FAQPage**, Service scoped to Cyprus with `areaServed` City×5 (Limassol, Nicosia, Larnaca, Paphos, Famagusta) + ServiceChannel | |
| `/blogs/:slug` (e.g. `custom-web-app-cost-2026`) | + BreadcrumbList, full BlogPosting (headline, image, datePublished/dateModified, articleSection, wordCount, author→Person, publisher→Organization), **FAQPage** on 3 buyer-intent posts | |
| `/projects/:id` (e.g. `hospital-management-system`) | + BreadcrumbList, CreativeWork (name, description, image, keywords, creator→Person, dateModified, codeRepository when available) | |

No Microdata or RDFa found anywhere — JSON-LD only, as intended. No deprecated types found (no HowTo, no SpecialAnnouncement, no CourseInfo/EstimatedSalary/LearningVideo).

## 2. Validation results

| Check | Result |
|---|---|
| `@context` is `https://schema.org` (not http) | ✅ Pass, every route |
| No deprecated types (HowTo, SpecialAnnouncement, CourseInfo, EstimatedSalary, LearningVideo) | ✅ Pass |
| `@type` valid per schema.org vocabulary | ✅ Pass |
| Organization required/recommended props (name, url, logo) | ✅ Pass — logo is a real `ImageObject` node (512×512), referenced by `@id`, satisfies Google's publisher-logo requirement for Article rich results |
| Person required props (name) + recommended (jobTitle, url, sameAs) | ✅ Pass |
| WebSite/WebPage linkage (`isPartOf`, `about`) | ✅ Pass |
| BreadcrumbList required props (`position`, `name`, `item` as absolute URL) | ✅ Pass, all non-home routes |
| FAQPage structure (`Question` → `acceptedAnswer`/`Answer`) | ✅ Structurally valid; **no SERP benefit — see §3** |
| BlogPosting required/recommended props (headline, image, datePublished, author, publisher) | ✅ Pass on individual article pages |
| Offer/PriceSpecification required props (`price`, `priceCurrency`) | ✅ Pass — but not rich-result-eligible (see §3, no Product node) |
| No placeholder text (`[Business Name]` etc.) | ✅ Pass |
| All URLs absolute | ✅ Pass |
| Dates ISO 8601 | ✅ Pass |
| Schema prices vs on-page copy | ✅ Consistent — $900 / $2,500 / $1,200-mo appears identically in `SERVICE_PACKAGES`, the homepage/services copy, `SERVICES_FAQS`, `NZ_FAQS`/`CYPRUS_FAQS`, the geo-page titles, and the `custom-web-app-cost-2026` blog post FAQ. These are still explicitly flagged in the config as **assumed, pending owner confirmation** — that's a business-accuracy item, not a schema defect. |

## 3. Issues found

### Info — FAQPage has no Google SERP benefit (not Critical, per current policy)
`FAQPage` is emitted on `/services`, `/web-development-new-zealand`, `/web-development-cyprus`, and 3 blog posts (confirmed: `custom-web-app-cost-2026`; two more per the "three buyer-intent posts" comment in `entry-server.tsx`). Google retired FAQ rich results for all sites on 2026-05-07 (today is 2026-08-09), so none of these will produce a SERP rich result any more. The markup is structurally valid and the visible Q&A text matches the schema text (Google's "must be on-page" requirement is satisfied), so **no removal is recommended** — any AI/GEO-engine benefit from this markup is real but unconfirmed. Leave as-is; don't add FAQPage to new pages expecting a Google SERP feature.

### Medium — Breadcrumb label is the full marketing title, not a short crumb name
`breadcrumbNode()` in `site.config.mjs` derives the crumb `name` from `route.title.split("|")[0].trim()`. For pages whose SEO `<title>` has no `|` separator — the two geo pages — the entire title becomes the breadcrumb label:
- `/web-development-new-zealand` → breadcrumb name: **"Web Developer for New Zealand — Fixed Prices from $900"**
- `/web-development-cyprus` → breadcrumb name: **"Web Developer in Cyprus — Fixed Prices from $900"**

That's marketing copy in a navigational element, and it also means the same string ends up published twice in the graph (once as `WebPage.name`, once as the breadcrumb crumb) with no shorter alternative. Recommend adding an explicit short `crumbLabel` field per route (e.g. `"New Zealand"` / `"Cyprus"`) and using it in `breadcrumbNode()` instead of deriving from the SEO title, with a fallback to the title-split for routes that don't set one.

### Medium — WebPage node never references its own BreadcrumbList
Every non-home route emits a `BreadcrumbList` node into the graph, but `webPageNode()` never sets `WebPage.breadcrumb: { "@id": ... }` to point at it. Google reads `BreadcrumbList` as a sibling node regardless, so this isn't a rich-result blocker, but it's a missed connective edge in an otherwise carefully cross-referenced graph (every other relationship — `isPartOf`, `about`, `founder`, `publisher` — uses `@id` linking). Recommend giving the `BreadcrumbList` node a stable `@id` (`${url}#breadcrumb`) and adding `breadcrumb: { "@id": ... }` to the matching `WebPage` node.

### Medium — `/blogs` listing page `dateModified` doesn't reflect its own freshest content
`WebPage.dateModified` for `/blogs` is `2026-07-30` (from `ROUTES[].lastmod`, bumped manually), but the `Blog.blogPost` array on that same page lists posts dated as recently as `2026-08-09`. The page that most needs an accurate freshness signal (a blog index, which both Google and AI crawlers use to gauge how current a site is) is currently understating its own recency by 10 days. Recommend deriving `/blogs`' `lastmod` automatically from `Math.max(...BLOG_POSTS.map(p => p.updatedAt ?? p.publishedAt))` in `entry-server.tsx`/the sitemap builder rather than hand-maintaining it in `ROUTES`, so it can't drift again.

### Low — Article/case-study cover images are below Google's recommended width
`BlogPosting.image` and the project `CreativeWork.image` both point at Unsplash URLs sized `?w=800&h=450&fit=crop` (800px wide). Google's guidance for Article/BlogPosting images is ≥1200px wide for the best large-image treatment (696px is the stated minimum). 800px clears the minimum but not the recommendation. Low priority since these are hotlinked third-party stock photos, not owned assets — worth bumping the Unsplash `w=` param to 1200 the next time these are touched.

### Low — `/blogs` index re-declares partial `BlogPosting` stubs
The `Blog.blogPost` array on `/blogs` repeats each post as a `BlogPosting` node with the same `@id` as the full node on that post's own page, but omits `articleSection`, `wordCount`, `mainEntityOfPage`, and `inLanguage` that the full node has. Within a single JSON-LD document this would be a problem (JSON-LD doesn't merge two nodes sharing an `@id`); across two different page documents it's harmless, since each page's graph is self-contained — but it's an easy thing to let drift further. Not required to fix, but if touched, keep the stub's property set a strict subset rather than allowing new fields to diverge.

### Not an issue — Offer/PriceSpecification/OfferCatalog are not rich-result-eligible today
These nodes are correctly structured (`price`, `priceCurrency` present, no placeholders) but they hang off `Organization.hasOfferCatalog` and `Service.hasOfferCatalog`, not a `Product`. Google's Product rich results require `Product` + `Offer`; `Service`-scoped offers currently get no SERP treatment. This is fine as machine-readable pricing for AI answer engines and entity comprehension — just don't expect a price rich snippet from it, and don't "fix" it by mislabeling the packages as `Product` (they're services, not physical/purchasable products — that would be inaccurate).

### Not an issue — privacy-conscious design choices
No `telephone` in schema (deliberate — avoids exposing a personal mobile number sitewide), `PostalAddress` is country-only (deliberate — avoids exposing a home address and avoids misrepresenting a remote practice as `ProfessionalService`/`LocalBusiness` with a physical premises), and no `Review`/`AggregateRating` anywhere (correct — real testimonials are still a pending owner input per project notes, and fabricating review schema would be a structured-data violation). All three are documented, intentional trade-offs in `site.config.mjs` and should stay as-is.

## 4. Missing opportunities

- **`BreadcrumbList` → `WebPage.breadcrumb` link** (see Medium finding above).
- **Short breadcrumb labels for geo pages** (see Medium finding above).
- **`WebSite.potentialAction` (SearchAction)** — not recommended here: the site has no on-site search feature, so a sitelinks-searchbox action would be fabricated functionality. Skip unless search is added.
- **QAPage** — not applicable. All FAQ content here is owner-authored pre-sales copy, not a genuine user-generated Q&A feature, so `FAQPage` (not `QAPage`) remains the structurally correct type even though it carries no current SERP benefit.

## 5. Generated JSON-LD for the two recommended fixes

### Breadcrumb `@id` + `WebPage.breadcrumb` link (`breadcrumbNode()` / `webPageNode()` in `site.config.mjs`)

```json
{
  "@type": "BreadcrumbList",
  "@id": "https://www.webdevstudio.me/web-development-new-zealand#breadcrumb",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://www.webdevstudio.me/" },
    { "@type": "ListItem", "position": 2, "name": "New Zealand", "item": "https://www.webdevstudio.me/web-development-new-zealand" }
  ]
}
```

```json
{
  "@type": "WebPage",
  "@id": "https://www.webdevstudio.me/web-development-new-zealand#webpage",
  "breadcrumb": { "@id": "https://www.webdevstudio.me/web-development-new-zealand#breadcrumb" }
}
```

Implementation notes for `site.config.mjs`:
- Give `breadcrumbNode()` an `@id` parameter (`${url}#breadcrumb`) and return it.
- Add an optional `crumbLabel` field to the two geo route entries in `ROUTES` (`"New Zealand"`, `"Cyprus"`); have `routeGraph()` pass `route.crumbLabel ?? route.title.split("|")[0].trim()` as the second breadcrumb item's `name`.
- Add `breadcrumb: { "@id": \`${url}#breadcrumb\` }` to `webPageNode()`'s return object whenever the route isn't `/`.

No other new nodes are recommended — the existing graph already covers Organization, Person, WebSite, WebPage, Service, BreadcrumbList, BlogPosting, CollectionPage/ItemList and CreativeWork correctly for a solo-developer portfolio site with no e-commerce, no genuine review data yet, and no on-site search.
