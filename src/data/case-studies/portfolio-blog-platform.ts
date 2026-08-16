import type { CaseStudy } from "./types";

/**
 * /projects/portfolio-blog-platform — legacy /projects/s6 301s here.
 *
 * Worth settling before this page ships again: it is NOT this site. Verified
 * against the repo — webdevstudio.me is Vite + React Router with a prerender
 * step; this is Next.js on Vercel with Prisma. Two different codebases.
 *
 * That is fine, but it leaves a question a reader will ask silently and you
 * would rather answer out loud: you built a portfolio-and-blog platform and
 * then built your own portfolio on something else. Either say why in one line
 * (different client, different constraints, built before this site existed) or
 * expect the reader to fill the gap themselves, badly.
 */
export const portfolioBlogPlatform: CaseStudy = {
  _id: "s6",
  slug: "portfolio-blog-platform",
  title: "Portfolio & Blog Platform",
  subtitle:
    "Publish a post without holding a deploy pipeline in your head",
  description:
    "Next.js portfolio and blog where posts are MDX content rather than markup, so publishing doesn't mean editing components. Small CMS layer for quick edits.",
  fullDescription:
    "A portfolio and blog for developers: MDX posts rendered to real HTML for crawlers, theme state that persists without a flash of the wrong colours, and an editing layer for content changes that shouldn't require a commit.",
  image:
    "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop",
  // Prisma is an ORM, not a datastore, and it is the only persistence-shaped
  // name in this list. To anyone who has used it, a stack listing Prisma and
  // no database is a missing line rather than a short one. Add whichever it
  // was — Postgres, SQLite, PlanetScale — next to it.
  technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX", "Vercel", "Prisma"],
  repoUrl: null,
  demoUrl: null,
  type: "React",
  context: null,
  // 4 months solo for a portfolio-and-blog platform is a long time to claim
  // without saying what filled it. Either name the scope that justifies it in
  // `approach`, or drop timelineMonths — an unexplained duration invites the
  // least generous reading.
  timelineMonths: 4,
  completedAt: null,
  teamSize: 1,
  roleDetail: null,
  problem:
    "Most developer portfolios force a choice between a fast static site and being able to publish without touching code.",
  // The gap here: build-time MDX files and a runtime Prisma-backed CMS are two
  // different content systems, and the page never says which content lives in
  // which, or why both exist. As written it reads as two half-solutions rather
  // than one decision — most likely posts in MDX and everything editable
  // (projects, bio, site copy) in the database, but only you can confirm it.
  // One sentence naming the split turns a smell into an architecture.
  approach:
    "Next.js with MDX keeps posts as content rather than markup, so writing does not require a deploy pipeline in your head. Prisma backs a small CMS layer for editing, theme state persists without a flash of the wrong colours, and the whole thing is built so search engines get real HTML rather than an empty shell.",
  hardPart: null,
  outcome: null,
  retrospective: null,
  screenshots: [],
  updatedAt: "2026-08-09",
};
