/**
 * Single source of truth for site identity, per-route SEO copy, and the
 * Schema.org graph.
 *
 * Deliberately plain ESM (not TypeScript) so it can be imported both by the
 * React app (via src/lib/seo.ts) and by the Node build scripts that generate
 * sitemap.xml and the prerendered per-route HTML. Keeping one copy means the
 * runtime <head>, the static <head>, and the sitemap can never drift apart.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * EDIT THESE when business details change — everything else derives from them.
 * ─────────────────────────────────────────────────────────────────────────
 */

/**
 * Canonical origin for the whole site — canonical tags, OG URLs, sitemap
 * <loc> entries and every JSON-LD @id derive from this.
 *
 * MUST include "www". Verified 2026-07-30:
 *   https://www.webdevstudio.me/  → 200 (serves the site)
 *   https://webdevstudio.me/      → 308 redirect to the www host
 *
 * Pointing canonicals at the apex would aim every canonical, sitemap entry and
 * @id at a URL that only redirects. Google generally follows that, but it
 * wastes crawl budget and delays indexing — the canonical should be the URL
 * that actually returns 200.
 *
 * If you ever flip Vercel's primary domain to the apex, change this to match
 * whichever host serves 200, or set VITE_SITE_URL in the Vercel environment.
 */
export const DEFAULT_SITE_URL = "https://www.webdevstudio.me";
export const SITE_NAME = "WebDevStudio";
export const FOUNDER_NAME = "Muhammad Mubashar Shahzad";
/**
 * GA4 measurement ID. Injected by the seoHead plugin in vite.config.ts, and
 * only in production builds — a static tag in index.html would also fire from
 * `npm run dev`, mixing local development traffic into real reports.
 * Set to "" to disable analytics entirely.
 */
export const GA_MEASUREMENT_ID = "G-1EB05GJDW9";

/**
 * IndexNow key. The build writes `<key>.txt` containing this value to the site
 * root, which is how Bing/Yandex verify ownership before accepting submissions.
 *
 * IndexNow pushes changed URLs instead of waiting to be crawled. Google does
 * not participate, but Bing does — and Bing's index is what feeds Microsoft
 * Copilot, so this is cheap AI-surface coverage.
 *
 * Run `npm run indexnow` after a deploy to submit the current sitemap URLs.
 */
export const INDEXNOW_KEY = "fc23cebf24ceec280444e93d80202093";

export const CONTACT_EMAIL = "mmubasharshahzad40@gmail.com";
/**
 * Displayed on the contact page and footer for humans, but deliberately NOT
 * emitted in structured data — a personal mobile in machine-readable markup on
 * every page is an easy scraping target for spam.
 */
export const TELEPHONE = "+923096403160";
export const FOUNDING_YEAR = "2020";

/** Verify each of these resolves before shipping — dead sameAs links weaken entity matching. */
export const SOCIAL_PROFILES = [
  "https://github.com/mubasharshahzad",
  "https://linkedin.com/in/mubasharshahzad",
];

/**
 * Country only — deliberately not a street/locality address.
 *
 * This previously published the founder's home town in LocalBusiness-style
 * schema on every page. That exposed a personal address sitewide and
 * misrepresented a remote-only practice as having a physical premises.
 * Country-level is enough for entity disambiguation and honest about the
 * service model.
 */
export const POSTAL_ADDRESS = {
  country: "PK",
};

/**
 * NOTE: confirm these reflect your actual rates before going live —
 * schema prices that contradict the page are a structured-data violation.
 *
 * There is deliberately no entity-level `priceRange` any more: that property
 * belongs to LocalBusiness types, and the real numbers are already expressed
 * precisely in the Offer/PriceSpecification nodes.
 */
export const PRICE_CURRENCY = "USD";

/**
 * EUR equivalents of the USD prices, for the Cyprus pages.
 *
 * Everything is priced and invoiced in USD, but a Cyprus buyer compares against
 * local studios quoting EUR. An SEO audit flagged the mismatch: the landing
 * page headlined "$900 USD" while its own linked cost guide talked in
 * "€800–€3,500", so the two pages read as two different price stories to a
 * buyer moving between them mid-funnel.
 *
 * The fix is to state both currencies everywhere on that path, derived from one
 * rate here — hardcoding the converted figures in the route title, the pricing
 * copy and the blog post gives three numbers that drift apart on the next FX
 * move, which is the same failure in a new place.
 *
 * Rounded to the nearest 10 so it reads as an indication, not a quote: the
 * invoice is USD. Re-check when EUR/USD moves more than a few percent.
 */
export const USD_TO_EUR = 0.92;

export function eurFromUsd(usd) {
  return Math.round((usd * USD_TO_EUR) / 10) * 10;
}

export const SERVICE_PACKAGES = [
  {
    id: "landing",
    name: "Marketing Site",
    tagline: "For businesses that need a fast, credible web presence.",
    priceFrom: 900,
    unit: "project",
    timeline: "2–3 weeks",
    featured: false,
    // Case study demonstrating this package. A price with a worked example
    // beside it answers "what do I actually get for $900" better than any
    // extra bullet; a price on its own asks the reader to take it on faith.
    // Omitted rather than forced where no honest example exists — see the
    // retainer below.
    proofSlug: "software-house-website",
    includes: [
      "Up to 6 responsive pages",
      "React + TypeScript build",
      "SEO foundations & schema markup",
      "Contact form with lead routing",
      "Core Web Vitals tuned for green scores",
      "2 rounds of revisions",
    ],
  },
  {
    id: "webapp",
    name: "Web Application",
    tagline: "For product teams shipping a real, data-driven application.",
    priceFrom: 2500,
    unit: "project",
    timeline: "6–10 weeks",
    featured: true,
    proofSlug: "hospital-management-system",
    includes: [
      "Full MERN stack build",
      "Authentication & role-based access",
      "REST API design & MongoDB schema",
      "Admin dashboard",
      "Automated deployment pipeline",
      "30 days post-launch support",
    ],
  },
  {
    id: "retainer",
    name: "Ongoing Partner",
    tagline: "For teams that need senior frontend capacity every month.",
    priceFrom: 1200,
    unit: "month",
    timeline: "Rolling monthly",
    featured: false,
    includes: [
      "Dedicated hours each month",
      "Feature development & code review",
      "Performance & accessibility audits",
      "Priority response within 24 hours",
      "Direct Slack access",
      "Cancel any time",
    ],
  },
];

/**
 * The two Cyprus-facing prices in EUR, derived from SERVICE_PACKAGES so they
 * can never contradict the USD figures on /services. Declared here, after the
 * packages, because they read from them. See USD_TO_EUR above for why the
 * Cyprus pages quote both currencies.
 */
export const CYPRUS_EUR_FROM = eurFromUsd(SERVICE_PACKAGES[0].priceFrom);
export const CYPRUS_EUR_APP_FROM = eurFromUsd(SERVICE_PACKAGES[1].priceFrom);

/**
 * REMOVED 2026-08-11 — `SERVICE_TYPES` was dead.
 *
 * Its comment claimed it fed "the OfferCatalog and the services page". Neither
 * was true: the OfferCatalog is built from SERVICE_PACKAGES below, and the
 * services page renders its own list. Nothing in the repo imported it, so the
 * six technology-named strings here were an unmaintained third opinion about
 * what this business sells — and the kind of thing someone later "fixes" the
 * page from.
 *
 * The live service list now lives in components/Services.tsx, named by
 * outcome rather than technology, with each card carrying the case study that
 * proves it. If those names ever need to reach structured data, lift them from
 * there rather than re-typing them here.
 */

/**
 * Location-page FAQs.
 *
 * These live here rather than inside the page components so the prerenderer
 * can bake FAQPage schema into the static HTML. Crawlers that don't run JS —
 * which includes every AI answer engine — would otherwise never see them, and
 * FAQ content is exactly what those engines quote when someone asks "who can
 * build a React app for my business in Cyprus".
 *
 * The page components import these too, so the visible Q&A and the markup
 * always match. Google requires that: FAQ schema whose text isn't on the page
 * is a structured-data violation.
 */
export const NZ_FAQS = [
  {
    question: "Do you work with businesses based in New Zealand?",
    answer:
      "Yes. I'm a remote frontend/MERN stack developer based in Pakistan, currently working with clients across New Zealand, Australia, the UK and beyond. All collaboration happens online — video calls, Slack/email, and shared project boards — so location is never a blocker.",
  },
  {
    question: "How do we handle the time zone difference?",
    answer:
      "Pakistan Standard Time is roughly 7–8 hours behind New Zealand. In practice this works in your favour: I typically work while it's evening/overnight in NZ, so tasks logged today are often progressed or completed by the time your team starts the next business day. We agree on a short overlap window (early NZ morning) for calls when needed.",
  },
  {
    question: "What currency and payment methods do you accept?",
    answer:
      "I invoice in USD or NZD via bank transfer, Wise, or PayPal — whichever is easiest on your end. Rates are quoted upfront with a clear scope, so there are no surprises.",
  },
  {
    question: "Can you match New Zealand business hours for calls?",
    answer:
      "Yes — I keep flexible hours specifically to overlap with NZ mornings (NZST/NZDT) for stand-ups, demos, or planning sessions when live discussion is useful.",
  },
  {
    question: "Do you sign contracts and NDAs?",
    answer:
      "Absolutely. I'm happy to work under your standard contract, NDA, or IP assignment terms before any project details are shared.",
  },
  // Added after Search Console showed "react developers hamilton" pulling
  // impressions while Hamilton was named nowhere on the site. The cities here
  // must stay in step with nzGeo.cities in src/data/geoPageData.ts.
  {
    question: "Do you work with businesses outside Auckland and Wellington?",
    answer:
      "Yes — I work with businesses anywhere in New Zealand, including Hamilton, Tauranga, Dunedin and smaller centres. Because the work is fully remote, your location doesn't change the price, the timeline, or how we communicate. Everything runs through video calls, shared project boards and daily written updates.",
  },
];

export const CYPRUS_FAQS = [
  {
    question: "Do you work with businesses based in Cyprus?",
    answer:
      "Yes. I'm a remote frontend/MERN stack developer based in Pakistan, working with clients across Cyprus, the wider EU, and the UK. All collaboration happens online — video calls, Slack/email, and shared project boards — so location is never a blocker.",
  },
  {
    question: "How much time zone overlap do we get for live calls?",
    answer:
      "Cyprus (EET/EEST) is roughly 2–3 hours behind Pakistan Standard Time, giving us a comfortable working overlap most afternoons for stand-ups, demos, and planning calls — closer real-time collaboration than most offshore arrangements.",
  },
  {
    question: "Can you support EU/GDPR-conscious projects?",
    answer:
      "Yes. I build with data-protection best practices in mind — minimal data collection, secure auth, and clear separation of personal data — and I'm happy to follow your organisation's specific GDPR and compliance requirements as part of the project brief.",
  },
  {
    question: "What currency and payment methods do you accept?",
    answer:
      "I invoice in EUR or USD via bank transfer, Wise, or PayPal. Rates and scope are agreed upfront so there are no surprises mid-project.",
  },
  {
    question: "Do you sign contracts and NDAs?",
    answer:
      "Absolutely. I'm happy to work under your standard contract, NDA, or IP assignment terms before any project details are shared.",
  },
  // Mirrors the NZ entry above; cities must match cyGeo.cities in
  // src/data/geoPageData.ts.
  {
    question: "Do you work with businesses outside Limassol?",
    answer:
      "Yes — I work with businesses across Cyprus, including Nicosia, Larnaca, Paphos and Famagusta. The work is fully remote, so your location doesn't change the price or the timeline. We agree a fixed scope and a written quote before anything starts.",
  },
];

/**
 * FAQs for the Auckland city landing page (/web-developer-auckland).
 *
 * Written honest-remote on purpose. The page targets "web developer auckland"
 * — a business looking for someone to build their site — WITHOUT claiming to
 * be Auckland-based, because a fake local presence is the one claim that ends
 * a lead the moment someone asks to meet or checks an address. Every answer is
 * about availability and how remote delivery works, never about completed
 * local projects the site can't yet point to.
 *
 * The timezone answer names the gap plainly rather than papering over it, for
 * the same reason: an Auckland buyer already knows the offshore objection, and
 * naming it first is more persuasive than pretending it isn't there.
 */
export const AUCKLAND_FAQS = [
  {
    question: "Do I need an Auckland-based developer?",
    answer:
      "Usually not. In-person matters for some projects, but most website and web-app work is done remotely now. What matters more is a fixed price agreed up front, direct communication with the person actually building it, clear ownership of the result, and being able to watch the work as it happens — all of which you get remotely. If face-to-face really is essential for you, hire local, and I'll tell you the same.",
  },
  {
    question: "How much does a website cost in Auckland?",
    answer:
      "It depends on scope — a brochure site and a web app with logins and payments are different projects. Auckland agencies typically quote NZ$15,000–$30,000+ for work a lower-overhead provider delivers for NZ$4,000–$8,000, because agency rates carry office and account-management costs a freelance developer doesn't. My quotes are fixed-price and agreed before any work starts; the full band-by-band breakdown is in my guide to what a website costs in New Zealand.",
  },
  {
    question: "Will you be available in my Auckland timezone?",
    answer:
      "I won't pretend the gap isn't there — Auckland is about seven hours ahead of me, so you won't get a same-minute reply at 2pm your time. What you get instead is a set call time in your morning for demos and planning, everything else documented in writing so progress never depends on us being online together, and work handed back overnight ready for your next NZ morning. For most projects that async rhythm is faster than it sounds; if constant live back-and-forth is essential to you, a local developer fits better.",
  },
  {
    question: "Who owns the website when it's done?",
    answer:
      "You do — the code, the domain and the hosting account, all in your name from the start. You're never locked in, and you can move to another developer whenever you want without rebuilding. Ownership is written into the quote, not left to be sorted out later.",
  },
  {
    question: "Can you take over a website another developer built?",
    answer:
      "Yes. Takeovers and redesigns are a common request. I'll audit what's there, tell you honestly what's worth keeping and what isn't, and give you a fixed price to move forward — including when the honest answer is that a rebuild costs less than untangling the old one.",
  },
];

/** General pre-sales FAQs shown on the services page. */
export const SERVICES_FAQS = [
  {
    question: "How much does a website or web application cost?",
    answer:
      "Marketing sites start at $900 and typically ship in 2–3 weeks. Full web applications start at $2,500 and usually take 6–10 weeks. Every project gets a fixed written quote after a free 30-minute call, so you approve the scope and the number before any work begins.",
  },
  {
    question: "How long does a project take?",
    answer:
      "A marketing site is usually 2–3 weeks end to end. A full MERN application is typically 6–10 weeks depending on scope. You get a milestone schedule with the quote, and written progress updates as work proceeds.",
  },
  {
    question: "What technologies do you build with?",
    answer:
      "React and TypeScript on the frontend, Node.js and Express with MongoDB on the backend, and Tailwind CSS for styling. For content-heavy or SEO-critical sites I also build with Next.js. Everything ships with automated deployment.",
  },
  {
    question: "Do you work with clients in other time zones?",
    answer:
      "Yes — most of my clients are in New Zealand, Cyprus, the EU, the UK and Australia. I keep flexible hours to overlap with your working day for calls, and everything else runs asynchronously with written daily updates.",
  },
  {
    question: "What happens after the project launches?",
    answer:
      "Web application projects include 30 days of post-launch support for bug fixes. Beyond that, you can either engage ad hoc or move onto a monthly retainer starting at $1,200 for ongoing development and maintenance.",
  },
];

/**
 * Per-route SEO. `lastmod` feeds sitemap.xml and WebPage.dateModified —
 * bump it when you meaningfully change a page's content.
 *
 * `faqs` is optional; when present the prerenderer emits FAQPage schema.
 */
export const ROUTES = [
  {
    path: "/",
    priority: "1.0",
    changefreq: "weekly",
    lastmod: "2026-07-30",
    title: "React & MERN Web Development | WebDevStudio",
    description:
      "Fast, conversion-focused React, TypeScript and MERN web apps. 5+ years, fixed scope and fixed price. Remote development for NZ, Cyprus and worldwide.",
    keywords:
      "React development agency, MERN stack development, hire React developer, TypeScript web development, Node.js development, remote web developer, WebDevStudio",
  },
  {
    path: "/services",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: "2026-07-30",
    title: "Web Development Services & Pricing | WebDevStudio",
    description:
      "Transparent pricing for React, MERN and Node.js development. Sites from $900, web apps from $2,500, retainers from $1,200/mo. Fixed scope, fixed price.",
    keywords:
      "web development services, React development pricing, MERN stack development cost, hire freelance web developer, Node.js backend development",
    faqs: SERVICES_FAQS,
  },
  {
    path: "/projects",
    priority: "0.9",
    changefreq: "weekly",
    lastmod: "2026-07-30",
    title: "Web Development Portfolio & Case Studies | WebDevStudio",
    description:
      "Selected React, MERN and Node.js projects — the problem, the build and the result. See how WebDevStudio delivers production web applications.",
    keywords:
      "React portfolio, MERN stack projects, web development case studies, Node.js projects, developer portfolio",
  },
  {
    path: "/about",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2026-07-30",
    title: "About WebDevStudio | Led by Muhammad Mubashar Shahzad",
    description:
      "WebDevStudio is the practice of Muhammad Mubashar Shahzad — 5+ years building React, TypeScript and MERN stack apps for clients worldwide.",
    keywords:
      "Muhammad Mubashar Shahzad, about WebDevStudio, React developer background, MERN stack expert",
  },
  {
    path: "/blogs",
    priority: "0.8",
    changefreq: "weekly",
    lastmod: "2026-07-30",
    title: "React, TypeScript & MERN Stack Articles | WebDevStudio",
    description:
      "Practical writing on React performance, TypeScript patterns and MERN stack architecture — lessons from real production builds, not theory.",
    keywords:
      "React blog, TypeScript articles, MERN stack guide, web performance tips, React best practices",
  },
  {
    path: "/contact",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: "2026-07-30",
    title: "Start a Project | Free Consultation — WebDevStudio",
    description:
      "Tell WebDevStudio about your project and get a scoped quote within 24 hours. Free 30-minute consultation, transparent pricing, no obligation.",
    keywords:
      "hire React developer, get web development quote, free web development consultation, contact web developer",
  },
  {
    path: "/web-development-new-zealand",
    priority: "0.85",
    changefreq: "monthly",
    lastmod: "2026-07-30",
    // No "|" in this title, so the breadcrumb fallback would use all of it.
    crumbLabel: "New Zealand",
    title: "Web Developer for New Zealand — Fixed Prices from $900",
    // Names the main centres, because Search Console showed geo queries
    // ("web developer nicosia", "react developers hamilton") are what this
    // site actually surfaces for. Price stays $900 to match SERVICE_PACKAGES
    // and every other page — the numbers must never disagree again.
    description:
      "Websites and web apps for businesses in Auckland, Wellington, Hamilton, Christchurch and across NZ — fixed price from $900, live in 2–3 weeks.",
    keywords:
      "web developer New Zealand, hire React developer NZ, MERN stack developer Auckland, web development Wellington, React developer Hamilton, freelance developer New Zealand",
    faqs: NZ_FAQS,
  },
  {
    path: "/web-development-cyprus",
    priority: "0.85",
    changefreq: "monthly",
    lastmod: "2026-07-30",
    // Leads with EUR because a Cyprus buyer compares against EUR quotes, and
    // carries the USD figure alongside it because that is what gets invoiced —
    // and because /blogs/website-cost-cyprus-2026, which this page links to,
    // talks entirely in euros. A visitor moving between the two must not meet
    // two different-looking prices. See CYPRUS_EUR_FROM above.
    crumbLabel: "Cyprus",
    title: `Web Developer in Cyprus — Fixed Prices from €${CYPRUS_EUR_FROM}`,
    description: `Websites and web apps for businesses in Limassol, Nicosia, Larnaca and across Cyprus — fixed price from €${CYPRUS_EUR_FROM} (USD $900), live in 2–3 weeks.`,
    keywords:
      "web developer Cyprus, hire React developer Cyprus, MERN stack developer Limassol, web development Nicosia, web developer Paphos, fintech web development Cyprus",
    faqs: CYPRUS_FAQS,
  },
  {
    // City landing page, one level more specific than /web-development-new-
    // zealand. Targets "web developer auckland" (an open query) rather than
    // "web design auckland" (agency-owned). It does NOT claim Auckland
    // presence — see AUCKLAND_FAQS and the page's honest-remote framing. Only
    // add sibling city pages (Wellington, Christchurch) when each has genuine
    // per-city content; near-identical city pages are a doorway-page risk and
    // would dilute this one and the country page above.
    path: "/web-developer-auckland",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2026-08-13",
    crumbLabel: "Auckland",
    title: "Web Developer for Auckland Businesses | WebDevStudio",
    description:
      "Freelance web developer building fast custom websites and web apps for Auckland businesses. Fixed-price, remote, React and MERN. Get a free quote.",
    keywords:
      "web developer auckland, freelance web developer auckland, website developer auckland, web app developer auckland, custom website auckland",
    faqs: AUCKLAND_FAQS,
  },
];

/* ── URL helpers ───────────────────────────────────────────────────────── */

export function normalizeSiteUrl(url) {
  return (url || DEFAULT_SITE_URL).replace(/\/$/, "");
}

export function absoluteUrl(siteUrl, path) {
  const base = normalizeSiteUrl(siteUrl);
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return normalized === "/" ? `${base}/` : `${base}${normalized}`;
}

export function ogImageUrl(siteUrl) {
  return `${normalizeSiteUrl(siteUrl)}/og-image.png`;
}

/** Real pixel size of the generated og-image.png — see scripts/generate-og-image.mjs. */
export const DEFAULT_OG_IMAGE_SIZE = { width: 1200, height: 630 };

/**
 * Dimensions to declare for an og:image, or `null` when they can't be known.
 *
 * index.html hardcodes 1200×630, which is right for the generated site card
 * and wrong for every detail page: the prerenderer swaps og:image for the
 * route's own cover (schemaImage() → w=1200&h=675) but left the declared
 * height at 630. Facebook, LinkedIn and Slack all pre-allocate the card from
 * the declared numbers, so a 675px image announced as 630px is cropped or
 * letterboxed by the consumer before anyone sees it.
 *
 * Unsplash carries its size in the query string, so the real numbers are
 * readable from the URL. Anything else — a local screenshot, another CDN —
 * returns null, and the caller drops the tags rather than declaring a size it
 * is guessing at. No dimensions is a supported case; wrong dimensions is not.
 */
export function ogImageSize(url, siteUrl) {
  if (!url) return null;
  const w = /[?&]w=(\d+)/.exec(url);
  const h = /[?&]h=(\d+)/.exec(url);
  if (w && h) return { width: Number(w[1]), height: Number(h[1]) };
  return url === ogImageUrl(siteUrl) ? DEFAULT_OG_IMAGE_SIZE : null;
}

/* ── Schema.org graph ──────────────────────────────────────────────────── */

/**
 * Stable @id values. Every node references the others by @id so search
 * engines resolve one connected entity instead of several orphaned blobs —
 * this is what the previous four standalone JSON-LD scripts were missing.
 */
export const schemaIds = (siteUrl) => {
  const base = normalizeSiteUrl(siteUrl);
  return {
    organization: `${base}/#organization`,
    founder: `${base}/#founder`,
    website: `${base}/#website`,
    logo: `${base}/#logo`,
  };
};

/**
 * The site-wide entity graph. Emitted on every page so any single URL is
 * enough for a crawler to understand the whole business.
 */
export function organizationGraph(siteUrl) {
  const base = normalizeSiteUrl(siteUrl);
  const id = schemaIds(base);

  return [
    {
      "@type": "ImageObject",
      "@id": id.logo,
      url: `${base}/logo-512.png`,
      contentUrl: `${base}/logo-512.png`,
      width: 512,
      height: 512,
      caption: SITE_NAME,
    },
    {
      // Plain Organization — NOT ProfessionalService.
      //
      // ProfessionalService is a LocalBusiness subtype: it asserts a physical
      // place of business, which is false for a remote-only practice serving
      // NZ/Cyprus/UK/AU/US. Claiming it alongside a personal home address was
      // both a misrepresentation and a privacy leak on every page.
      // priceRange also lived here; the real prices belong in the
      // Offer/PriceSpecification nodes below, where they already are.
      "@type": "Organization",
      "@id": id.organization,
      name: SITE_NAME,
      alternateName: "WebDev Studio",
      url: `${base}/`,
      logo: { "@id": id.logo },
      image: { "@id": id.logo },
      description:
        "WebDevStudio builds fast, conversion-focused React, TypeScript and MERN stack web applications for businesses worldwide.",
      email: CONTACT_EMAIL,
      foundingDate: FOUNDING_YEAR,
      founder: { "@id": id.founder },
      employee: { "@id": id.founder },
      knowsLanguage: ["en", "ur"],
      address: {
        "@type": "PostalAddress",
        addressCountry: POSTAL_ADDRESS.country,
      },
      areaServed: [
        { "@type": "Country", name: "New Zealand" },
        { "@type": "Country", name: "Cyprus" },
        { "@type": "Country", name: "United Kingdom" },
        { "@type": "Country", name: "Australia" },
        { "@type": "Country", name: "United States" },
      ],
      contactPoint: {
        "@type": "ContactPoint",
        contactType: "sales",
        email: CONTACT_EMAIL,
        availableLanguage: ["English"],
        areaServed: "Worldwide",
      },
      sameAs: SOCIAL_PROFILES,
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Web Development Services",
        itemListElement: SERVICE_PACKAGES.map((pkg) => ({
          "@type": "Offer",
          name: pkg.name,
          description: pkg.tagline,
          price: String(pkg.priceFrom),
          priceCurrency: PRICE_CURRENCY,
          priceSpecification: {
            "@type": "PriceSpecification",
            minPrice: pkg.priceFrom,
            priceCurrency: PRICE_CURRENCY,
            valueAddedTaxIncluded: false,
          },
          availability: "https://schema.org/InStock",
          url: `${base}/services`,
          itemOffered: {
            "@type": "Service",
            name: pkg.name,
            serviceType: "Web Development",
            provider: { "@id": id.organization },
          },
        })),
      },
    },
    {
      "@type": "Person",
      "@id": id.founder,
      name: FOUNDER_NAME,
      alternateName: "Mubashar Shahzad",
      givenName: "Muhammad Mubashar",
      familyName: "Shahzad",
      jobTitle: "Founder & Lead Developer",
      description:
        "Founder of WebDevStudio — full-stack developer specialising in React.js, TypeScript, Node.js and the MERN stack, with 5+ years building production web applications.",
      url: `${base}/about`,
      email: CONTACT_EMAIL,
      worksFor: { "@id": id.organization },
      // Country only, for the same privacy reason as the Organization node.
      address: {
        "@type": "PostalAddress",
        addressCountry: POSTAL_ADDRESS.country,
      },
      // Education history lives here rather than in a second bare #founder
      // node on /about: JSON-LD does NOT merge two nodes sharing an @id within
      // one document, so that produced a split, half-typed entity.
      alumniOf: {
        "@type": "CollegeOrUniversity",
        name: "University of Education, Lahore",
      },
      sameAs: SOCIAL_PROFILES,
      knowsAbout: [
        "React.js",
        "TypeScript",
        "Node.js",
        "MongoDB",
        "Express.js",
        "Next.js",
        "Tailwind CSS",
        "MERN Stack",
        "REST API design",
        "Web performance optimization",
      ],
    },
    {
      "@type": "WebSite",
      "@id": id.website,
      url: `${base}/`,
      name: SITE_NAME,
      description:
        "React, TypeScript and MERN stack web development by WebDevStudio.",
      publisher: { "@id": id.organization },
      inLanguage: "en",
    },
  ];
}

/** Per-page WebPage node, linked into the site graph. */
export function webPageNode(siteUrl, route) {
  const base = normalizeSiteUrl(siteUrl);
  const id = schemaIds(base);
  const url = absoluteUrl(base, route.path);

  return {
    "@type": "WebPage",
    "@id": `${url}#webpage`,
    url,
    name: route.title,
    description: route.description,
    isPartOf: { "@id": id.website },
    about: { "@id": id.organization },
    // /services defines its own Service node but never declared it as the
    // page's primary entity, so the node existed without anything saying the
    // page is *about* it. Flagged by the 2026-08-13 schema audit as the one
    // remaining gap after the Service node itself was added.
    ...(route.path === "/services"
      ? { mainEntity: { "@id": `${absoluteUrl(base, "/services")}#service` } }
      : {}),
    // A page with its own hero image declares that, not the sitewide logo.
    // Project and article pages were all claiming the WebDevStudio logo as
    // their primary image, which is useless for image search and for any
    // surface that previews the page.
    primaryImageOfPage: route.image
      ? { "@type": "ImageObject", url: route.image, contentUrl: route.image }
      : { "@id": id.logo },
    inLanguage: "en",
    // Completes the edge the other way. Every non-home route emits a
    // BreadcrumbList — both here in routeGraph() and from the page components
    // at runtime — but nothing declared which WebPage it belonged to, leaving
    // one orphaned node in an otherwise fully cross-referenced graph. Home has
    // no breadcrumb, which is why this is conditional and not unconditional.
    ...(route.path === "/"
      ? {}
      : { breadcrumb: { "@id": breadcrumbId(base, route.path) } }),
    ...(route.lastmod ? { dateModified: route.lastmod } : {}),
  };
}

/**
 * Page-scoped Service node for /services.
 *
 * /services previously carried no Service node of its own and leaned entirely
 * on Organization.hasOfferCatalog — which is emitted byte-identically on all
 * 20 pages, so it ties the three offers to no page in particular. The two
 * location pages already declare a proper Service; this is the same pattern
 * for the page the offers actually live on.
 *
 * Lives here, in the shared config, because both the prerenderer and the React
 * runtime need to emit it. Built separately they would drift, and since
 * hydration replaces the prerendered JSON-LD, a runtime copy that omitted this
 * node would silently delete it the moment the page became interactive.
 */
export function servicesServiceNode(siteUrl) {
  const base = normalizeSiteUrl(siteUrl);
  const id = schemaIds(base);
  const servicesUrl = absoluteUrl(base, "/services");

  return {
    "@type": "Service",
    "@id": `${servicesUrl}#service`,
    name: "Web Development Services",
    description:
      "Fixed-price React, TypeScript and MERN stack web development: marketing sites, web applications, and ongoing frontend and backend support.",
    url: servicesUrl,
    serviceType: "Web Development",
    provider: { "@id": id.organization },
    areaServed: "Worldwide",
    // Derived from SERVICE_PACKAGES, so this can never contradict the pricing
    // table rendered on the page or the sitewide OfferCatalog.
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Web Development Services",
      itemListElement: SERVICE_PACKAGES.map((pkg) => ({
        "@type": "Offer",
        name: pkg.name,
        description: pkg.tagline,
        price: String(pkg.priceFrom),
        priceCurrency: PRICE_CURRENCY,
        priceSpecification: {
          "@type": "PriceSpecification",
          minPrice: pkg.priceFrom,
          priceCurrency: PRICE_CURRENCY,
          valueAddedTaxIncluded: false,
        },
        availability: "https://schema.org/InStock",
        url: servicesUrl,
      })),
    },
    availableChannel: {
      "@type": "ServiceChannel",
      serviceUrl: absoluteUrl(base, "/contact"),
      availableLanguage: { "@type": "Language", name: "English" },
    },
  };
}

/**
 * Stable @id for a page's BreadcrumbList, so WebPage.breadcrumb can point at
 * it. The last crumb is always the page itself.
 */
function breadcrumbId(siteUrl, path) {
  return `${absoluteUrl(siteUrl, path)}#breadcrumb`;
}

export function breadcrumbNode(siteUrl, items) {
  const self = items[items.length - 1];

  return {
    "@type": "BreadcrumbList",
    // Without an @id this node floated free of the graph: every other node here
    // is cross-referenced by @id, and the WebPage that owns the breadcrumb had
    // no way to say so. See webPageNode() for the other half of the edge.
    "@id": breadcrumbId(siteUrl, self.path),
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(siteUrl, item.path),
    })),
  };
}

export function faqNode(items) {
  return {
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

/** Wraps nodes in a single @graph document — one script tag per page. */
export function buildGraph(nodes) {
  return {
    "@context": "https://schema.org",
    "@graph": nodes.filter(Boolean),
  };
}

/**
 * Full graph for a static route: site entities, WebPage, breadcrumb, and
 * FAQPage where the route defines FAQs.
 *
 * Used by both the Vite plugin (homepage) and the prerenderer (every route),
 * so the static HTML carries the same graph the React app emits at runtime.
 */
export function routeGraph(siteUrl, route, extraNodes = []) {
  const nodes = [...organizationGraph(siteUrl), webPageNode(siteUrl, route)];

  if (route.path !== "/") {
    nodes.push(
      breadcrumbNode(siteUrl, [
        { name: "Home", path: "/" },
        // crumbLabel first, falling back to the pre-brand half of the title.
        // That fallback is fine for titles shaped "Services | WebDevStudio",
        // but the two geo pages have no "|" — so the split returned the whole
        // marketing title and the breadcrumb read "Web Developer in Cyprus —
        // Fixed Prices from €830" instead of "Cyprus". Routes whose title
        // isn't already a usable crumb set crumbLabel explicitly.
        { name: crumbLabelFor(route), path: route.path },
      ])
    );
  }

  if (route.faqs?.length) {
    nodes.push(faqNode(route.faqs));
  }

  // Page-specific nodes (BlogPosting, CollectionPage, Service…) supplied by
  // the prerenderer, so the static HTML carries the same graph the React app
  // emits at runtime rather than only the site-wide entities.
  if (extraNodes?.length) {
    nodes.push(...extraNodes);
  }

  return buildGraph(nodes);
}

export function findRoute(path) {
  return ROUTES.find((r) => r.path === path);
}

/**
 * The short name a route should appear under in a breadcrumb.
 *
 * Exported so the page components can label their visible breadcrumb from the
 * same value the BreadcrumbList schema uses — Google treats a visible trail
 * that disagrees with the markup as a mismatch.
 */
export function crumbLabelFor(route) {
  return route.crumbLabel ?? route.title.split("|")[0].trim();
}
