import type { CaseStudy } from "./types";

/** /projects/software-house-website — legacy /projects/s3 301s here. */
export const softwareHouseWebsite: CaseStudy = {
  _id: "s3",
  slug: "software-house-website",
  // "Software House Website" named a category, not a result — and on a
  // software house's own site it read as though this might be the site the
  // reader was already standing on.
  title: "Fast Marketing Site for a Software House",
  subtitle:
    "A marketing site fast enough to rank for the services it sells",
  // Was a feature list — service showcase, contact forms, responsive design.
  // Every item on it is table stakes in 2026, and "responsive design" as a
  // headline capability signals a low bar. Decisions, not features.
  description:
    "React and TypeScript marketing site built so an animation-heavy design brief could survive Core Web Vitals — GPU-composited motion, build-time metadata.",
  fullDescription:
    "A marketing site for a software development company: service and portfolio pages, a contact pipeline running on the client's own infrastructure, and per-page metadata generated at build time rather than after hydration.",
  image:
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
  technologies: [
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Node.js",
    "Express",
    "Framer Motion",
  ],
  repoUrl: null,
  demoUrl: null,
  type: "React",
  context: null,
  timelineMonths: 3,
  completedAt: null,
  teamSize: 2,
  roleDetail: null,
  problem:
    "A marketing site for a services business has one job: get found for the work it sells, then load fast enough that the visitor stays. Heavy hero animation and unoptimised imagery are the usual reason it fails at both — the visuals arrive late, Core Web Vitals drop, and the pages that should rank never do. The design brief here was animation-heavy and fixed, so cutting the motion was not an available answer.",
  approach:
    "Four decisions carried the build. Motion stayed, but every animation was restricted to transform and opacity — the two properties a browser can composite on the GPU without triggering layout or paint — and scroll-linked effects check the OS reduced-motion setting rather than assuming everyone wants them. Per-page title, description, canonical, Open Graph tags and JSON-LD are emitted at build time instead of injected after hydration, so crawlers and AI answer engines read the real content in the initial HTML. Images ship in modern formats with explicit width and height so nothing shifts as they load, with the hero preloaded and everything below the fold lazy. Contact submissions post to a small Express endpoint rather than a third-party form service, which keeps enquiry data on infrastructure the client controls.",
  hardPart:
    "Keeping the motion was the expensive choice, and it was the right one. Framer Motion is a runtime animation library shipped to every visitor, and on a marketing site the whole argument is about bytes and main-thread time. Hand-rolling the equivalent spring physics in CSS would have shipped less JavaScript — but the spec had staggered reveals, scroll-linked parallax and transitions between routes, and reproducing those by hand would have cost more in subtle bugs than it saved in kilobytes.\n\nThe compromise was to constrain what the library is allowed to touch. Every animated property is transform or opacity, so the browser composites on the GPU and never runs layout or paint for a frame of motion. Anything that would have animated width, height, top or box-shadow was rebuilt as a transform, and the few effects that could not be expressed that way were cut rather than special-cased.\n\nWhat it costs: the library still sits in the bundle on pages that barely animate, and the honest fix is route-level code splitting so a text-heavy page does not pay for the homepage's hero. Motion also has to be tested twice — once normally and once with reduced motion enabled — because a scroll-linked reveal that silently no-ops leaves the content invisible, which is a broken page rather than an accessible one.",
  outcome: null,
  retrospective:
    "The Express endpoint behind the contact form is one more service for someone to keep alive, for what amounts to a handful of requests a day. I would move it to a serverless function now — the same control over where enquiry data goes, with nothing to restart at 2am. I would also split the animation library out of the routes that barely use it, rather than treating the bundle as one decision made once at the start.",
  screenshots: [],
  updatedAt: "2026-08-09",
};
