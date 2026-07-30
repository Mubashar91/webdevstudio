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

export const DEFAULT_SITE_URL = "https://webdevstudio.me";
export const SITE_NAME = "WebDevStudio";
export const FOUNDER_NAME = "Muhammad Mubashar Shahzad";
export const CONTACT_EMAIL = "mmubasharshahzad40@gmail.com";
export const TELEPHONE = "+923096403160";
export const FOUNDING_YEAR = "2020";

/** Verify each of these resolves before shipping — dead sameAs links weaken entity matching. */
export const SOCIAL_PROFILES = [
  "https://github.com/mubasharshahzad",
  "https://linkedin.com/in/mubasharshahzad",
];

export const POSTAL_ADDRESS = {
  locality: "Mian Channu",
  region: "Punjab",
  country: "PK",
};

/**
 * Price band advertised in schema and on the pricing section.
 * NOTE: confirm these reflect your actual rates before going live —
 * schema prices that contradict the page are a structured-data violation.
 */
export const PRICE_RANGE = "$$";
export const PRICE_CURRENCY = "USD";

export const SERVICE_PACKAGES = [
  {
    id: "landing",
    name: "Marketing Site",
    tagline: "For businesses that need a fast, credible web presence.",
    priceFrom: 900,
    unit: "project",
    timeline: "2–3 weeks",
    featured: false,
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

/** Services listed in the OfferCatalog and on the services page. */
export const SERVICE_TYPES = [
  "React.js Development",
  "MERN Stack Development",
  "Node.js Backend Development",
  "TypeScript Development",
  "Responsive Web Design",
  "Web Performance Optimization",
];

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
    lastmod: "2026-07-29",
    title: "React & MERN Web Development for Growing Businesses | WebDevStudio",
    description:
      "WebDevStudio builds fast, conversion-focused React, TypeScript and MERN stack web applications. 5+ years experience, 50+ projects delivered. Remote development for New Zealand, Cyprus and clients worldwide.",
    keywords:
      "React development agency, MERN stack development, hire React developer, TypeScript web development, Node.js development, remote web developer, WebDevStudio",
  },
  {
    path: "/services",
    priority: "0.9",
    changefreq: "monthly",
    lastmod: "2026-07-29",
    title: "Web Development Services & Pricing | WebDevStudio",
    description:
      "Transparent pricing for React, MERN and Node.js development. Marketing sites from $900, full web applications from $2,500, monthly retainers from $1,200. Fixed scope, fixed price, no agency overhead.",
    keywords:
      "web development services, React development pricing, MERN stack development cost, hire freelance web developer, Node.js backend development",
    faqs: SERVICES_FAQS,
  },
  {
    path: "/projects",
    priority: "0.9",
    changefreq: "weekly",
    lastmod: "2026-07-29",
    title: "Web Development Portfolio & Case Studies | WebDevStudio",
    description:
      "Selected React, MERN and Node.js projects — the problem, the build, and the result. See how WebDevStudio delivers production web applications for clients worldwide.",
    keywords:
      "React portfolio, MERN stack projects, web development case studies, Node.js projects, developer portfolio",
  },
  {
    path: "/about",
    priority: "0.8",
    changefreq: "monthly",
    lastmod: "2026-07-29",
    title: "About WebDevStudio | Led by Muhammad Mubashar Shahzad",
    description:
      "WebDevStudio is the web development practice of Muhammad Mubashar Shahzad — 5+ years building React, TypeScript and MERN stack applications for clients across New Zealand, Cyprus, the EU and beyond.",
    keywords:
      "Muhammad Mubashar Shahzad, about WebDevStudio, React developer background, MERN stack expert",
  },
  {
    path: "/blogs",
    priority: "0.8",
    changefreq: "weekly",
    lastmod: "2026-07-29",
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
    lastmod: "2026-07-29",
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
    lastmod: "2026-07-29",
    title: "Web Developer for New Zealand Businesses | React & MERN — WebDevStudio",
    description:
      "Remote React and MERN stack developer for New Zealand businesses — Auckland, Wellington, Christchurch and nationwide. NZD-friendly pricing, senior-level delivery, no local agency markup.",
    keywords:
      "web developer New Zealand, hire React developer NZ, MERN stack developer Auckland, web development Wellington, freelance developer New Zealand",
    faqs: NZ_FAQS,
  },
  {
    path: "/web-development-cyprus",
    priority: "0.85",
    changefreq: "monthly",
    lastmod: "2026-07-29",
    title: "Web Developer for Cyprus Businesses | React & MERN — WebDevStudio",
    description:
      "Remote React and MERN stack developer serving Cyprus — Limassol, Nicosia and Larnaca. EUR/USD pricing, real working-hours overlap, GDPR-conscious builds.",
    keywords:
      "web developer Cyprus, hire React developer Cyprus, MERN stack developer Limassol, web development Nicosia, fintech web development Cyprus",
    faqs: CYPRUS_FAQS,
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
      // Dual-typed: an Organization for entity resolution, and a
      // ProfessionalService so service-business rich results apply.
      "@type": ["Organization", "ProfessionalService"],
      "@id": id.organization,
      name: SITE_NAME,
      alternateName: "WebDev Studio",
      url: `${base}/`,
      logo: { "@id": id.logo },
      image: { "@id": id.logo },
      description:
        "WebDevStudio builds fast, conversion-focused React, TypeScript and MERN stack web applications for businesses worldwide.",
      email: CONTACT_EMAIL,
      telephone: TELEPHONE,
      foundingDate: FOUNDING_YEAR,
      founder: { "@id": id.founder },
      employee: { "@id": id.founder },
      priceRange: PRICE_RANGE,
      currenciesAccepted: "USD, EUR, NZD",
      paymentAccepted: "Bank transfer, Wise, PayPal",
      knowsLanguage: ["en", "ur"],
      address: {
        "@type": "PostalAddress",
        addressLocality: POSTAL_ADDRESS.locality,
        addressRegion: POSTAL_ADDRESS.region,
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
        telephone: TELEPHONE,
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
      address: {
        "@type": "PostalAddress",
        addressLocality: POSTAL_ADDRESS.locality,
        addressRegion: POSTAL_ADDRESS.region,
        addressCountry: POSTAL_ADDRESS.country,
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
    primaryImageOfPage: { "@id": id.logo },
    inLanguage: "en",
    ...(route.lastmod ? { dateModified: route.lastmod } : {}),
  };
}

export function breadcrumbNode(siteUrl, items) {
  return {
    "@type": "BreadcrumbList",
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
export function routeGraph(siteUrl, route) {
  const nodes = [...organizationGraph(siteUrl), webPageNode(siteUrl, route)];

  if (route.path !== "/") {
    nodes.push(
      breadcrumbNode(siteUrl, [
        { name: "Home", path: "/" },
        { name: route.title.split("|")[0].trim(), path: route.path },
      ])
    );
  }

  if (route.faqs?.length) {
    nodes.push(faqNode(route.faqs));
  }

  return buildGraph(nodes);
}

export function findRoute(path) {
  return ROUTES.find((r) => r.path === path);
}
