export type ProjectType = "MERN" | "React" | "Node" | "Other";

/**
 * What kind of engagement this was.
 *
 * "Four months, three people, React Native" reads like a capstone or a startup
 * MVP and the page never said which — and a client project with no client and
 * no outcome raises more questions than "University capstone" ever would.
 */
export type ProjectContext =
  | "Client project"
  | "Client project (name withheld)"
  | "University capstone"
  | "Personal project"
  | "Startup MVP"
  | "Open source";

export interface Screenshot {
  /** Descriptive filename — expense-app-group-balance.png, not screenshot-1.png. */
  src: string;
  alt: string;
  caption: string;
}

/**
 * Runtime shape for anything rendered as a project, including the records the
 * admin API returns. Everything here is optional because an API-created
 * project has only the handful of fields the create form collects.
 *
 * The six hand-written case studies use `CaseStudy` below, which makes the
 * proof-bearing fields required — see the note there.
 */
export interface Project {
  _id: string;
  /**
   * Keyword-rich URL segment: /projects/<slug>.
   *
   * /projects/s1 looks like unseeded demo data — because that is exactly what
   * s1 means to anyone who has built a CMS — and it spends the strongest
   * keyword slot in a URL on a database key.
   *
   * Optional because API-backed projects have Mongo ObjectIds and no slug;
   * those keep resolving by _id (see projectPath).
   *
   * NEVER change a published slug. The pre-slug URLs are 301'd in vercel.json;
   * editing a live slug orphans whatever already links to it.
   */
  slug?: string;
  title: string;
  /** One line: what it does, in the user's words rather than the stack's. */
  subtitle?: string;
  description: string;
  fullDescription?: string;
  image?: string;
  technologies: string[];
  /**
   * Direct link to THIS project's repository — never a profile link.
   *
   * All six case studies previously pointed at github.com/mubasharshahzad, so
   * a reader clicking "proof" landed on a profile listing and reasonably
   * concluded the repo did not exist. A missing link is neutral; a link that
   * doesn't deliver what it promises is worse than neutral.
   */
  repoUrl?: string | null;
  /**
   * Public, reachable demo URL. OMIT IT unless you have just loaded the page
   * yourself and seen the real project.
   *
   * Every case study once carried an invented domain (expense-sharing-app.com,
   * hospital-mgmt-system.com, …). Verified 2026-08-06: four failed DNS outright
   * and ecommerce-dashboard.com returned a parked-domain lander. A dead demo
   * button on the one page a prospective client visits specifically to check
   * the work is real is the most expensive broken link on the site.
   */
  demoUrl?: string | null;
  /** Set by the admin create form; static case studies use repoUrl/demoUrl. */
  githubLink?: string;
  demoLink?: string;
  type: ProjectType;

  context?: ProjectContext | null;
  timelineMonths?: number | null;
  /** ISO date of delivery. Feeds `dateCreated` in the JSON-LD. */
  completedAt?: string | null;
  teamSize?: number | null;
  /**
   * What YOU owned, specifically.
   *
   * On a solo build "Full Stack Developer" is fine. On a team of three it tells
   * a reader nothing about which third was yours, and readers assume the least
   * flattering reading of a vague claim. Name the subsystems, and keep it to
   * something a teammate could confirm.
   */
  roleDetail?: string | null;

  /** Problem → Approach → Hard part → Outcome → Retrospective. */
  problem?: string;
  approach?: string;
  /**
   * ONE decision, 150–250 words, including what it cost.
   *
   * This is the section that separates a case study from a portfolio tile.
   * "It never got big enough to matter — at the scale we tested it stayed
   * under Xms, and at real scale I'd add a checkpoint" is a stronger answer
   * than an invented optimisation story, because it shows you know the limit.
   */
  hardPart?: string | null;
  /**
   * What actually happened: users, a performance number, coverage, whether it
   * shipped at all. `null` is allowed and honest — the section simply doesn't
   * render — but it is the biggest remaining gap on every one of these pages.
   */
  outcome?: string | null;
  /** 2–3 sentences. Rare on portfolios, which is exactly why it lands. */
  retrospective?: string | null;
  /**
   * Real app screenshots only. Faking the DATA (names, amounts) is fine and
   * normal; faking the UI is not, and stock "illustrative" imagery was flagged
   * as a trust failure in the July 2026 audit.
   */
  screenshots?: Screenshot[];

  /**
   * ISO date of the last real content change to this case study.
   *
   * Feeds both WebPage.dateModified and the sitemap <lastmod>. Set it only
   * when you actually revise the write-up — stamping every entry with the
   * build date makes lastmod worthless and Google stops trusting it.
   */
  updatedAt?: string;
}

/**
 * The six hand-written case studies.
 *
 * Every field carrying proof is a required key whose type includes `null`. You
 * cannot silently omit an outcome — you have to type `outcome: null` and look
 * at it. That is the whole difference between a case study and a portfolio
 * tile, and it is why these are not just `Partial<Project>`.
 *
 * `pendingCaseStudyFields()` turns the remaining nulls into a build-time
 * report so they stay visible instead of settling in.
 */
export interface CaseStudy extends Project {
  slug: string;
  subtitle: string;
  context: ProjectContext | null;
  timelineMonths: number;
  completedAt: string | null;
  teamSize: number;
  roleDetail: string | null;
  repoUrl: string | null;
  demoUrl: string | null;
  hardPart: string | null;
  outcome: string | null;
  retrospective: string | null;
  screenshots: Screenshot[];
}

// Re-exported for the existing call sites in Projects.tsx / ProjectDetail.tsx.
// Resolution lives in one place so the localhost fallback can't leak into
// production builds again.
import { API_BASE_URL } from "@/lib/api";
export { API_BASE_URL };

export const STATIC_PROJECTS: CaseStudy[] = [
  {
    _id: "s1",
    slug: "expense-sharing-app",
    title: "Expense-Sharing Mobile App",
    subtitle:
      "Split bills across a group without balances drifting out of sync",
    description:
      "Cross-platform React Native app for group expense tracking with JWT auth, real-time balance calculations, dynamic dashboards, and settlement workflows.",
    fullDescription:
      "A comprehensive expense tracking application that enables users to split bills and track shared expenses with real-time calculations and instant settlement tracking.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop",
    technologies: [
      "React Native",
      "Node.js",
      "Express",
      "MongoDB",
      "JWT",
      "Firebase Cloud Messaging",
    ],
    repoUrl: null,
    demoUrl: null,
    type: "MERN",
    context: null,
    timelineMonths: 4,
    completedAt: null,
    teamSize: 3,
    roleDetail: null,
    problem:
      "Splitting shared costs across a group is deceptively hard. Balances have to stay correct while several people add expenses at once, and everyone needs to see the same number at the same time. Doing that on top of a plain CRUD API produces stale balances and arguments about who owes what.",
    approach:
      "Balances are derived from the transaction log rather than stored as a mutable field, so they can never drift out of sync with the expenses behind them. Settlement is modelled as its own transaction type, which keeps history auditable. JWT auth with refresh tokens covers the mobile session, and Firebase handles push so users hear about a new expense without opening the app.",
    hardPart: null,
    outcome: null,
    retrospective: null,
    screenshots: [],
    updatedAt: "2026-07-31",
  },
  {
    _id: "s2",
    slug: "hospital-management-system",
    title: "Hospital Management System",
    subtitle:
      "One patient record, three staff roles, and no double-booked appointments",
    description:
      "Full-featured hospital platform with patient registration, appointment scheduling, role-based access control, and centralized workflow management.",
    fullDescription:
      "An integrated hospital management system designed to streamline patient care, appointments, and administrative tasks with secure role-based access.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=450&fit=crop",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "PostgreSQL"],
    repoUrl: null,
    demoUrl: null,
    type: "MERN",
    context: null,
    timelineMonths: 5,
    completedAt: null,
    teamSize: 4,
    roleDetail: null,
    problem:
      "Hospital software fails on permissions before it fails on features. Reception, doctors and administrators need the same patient record to show different things, and appointment scheduling has to hold up when two people book the same slot.",
    approach:
      "Role-based access control was designed first and enforced server-side, so the UI only ever hides what the API already refuses. Appointments are validated against the practitioner's calendar at write time rather than in the client, and patient records are indexed on the fields staff actually search by.",
    hardPart: null,
    outcome: null,
    retrospective: null,
    screenshots: [],
    updatedAt: "2026-07-31",
  },
  {
    _id: "s3",
    slug: "software-house-website",
    title: "Software House Website",
    subtitle:
      "A marketing site fast enough to rank for the services it sells",
    description:
      "Responsive company website with service showcase, portfolio, integrated contact forms, SEO optimization, and optimized load performance.",
    fullDescription:
      "A modern, responsive website showcasing software development services with integrated portfolio, client testimonials, and contact management.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "Framer Motion"],
    repoUrl: null,
    demoUrl: null,
    type: "React",
    context: null,
    timelineMonths: 3,
    completedAt: null,
    teamSize: 2,
    roleDetail: null,
    problem:
      "A software house site lives or dies on being found and being fast. The usual failure is a visually heavy marketing site that scores badly on Core Web Vitals and never ranks for the services it sells.",
    approach:
      "Built as a React and TypeScript site with performance treated as a requirement rather than a cleanup task: images sized and served in modern formats, animations restricted to compositor-friendly properties, and structured data plus per-page metadata handled at build time so crawlers get the real content.",
    hardPart: null,
    outcome: null,
    retrospective: null,
    screenshots: [],
    updatedAt: "2026-07-31",
  },
  {
    _id: "s4",
    slug: "ecommerce-dashboard",
    title: "E-Commerce Dashboard",
    subtitle:
      "Live inventory, orders and payments in one view that stays readable",
    description:
      "Admin dashboard with real-time analytics, inventory tracking, order management, and Stripe payment integration for e-commerce operations.",
    fullDescription:
      "A comprehensive e-commerce admin dashboard providing real-time insights, inventory management, and order processing with payment integration.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    technologies: ["React", "Redux", "Node.js", "MongoDB", "Stripe", "Chart.js", "Socket.io"],
    repoUrl: null,
    demoUrl: null,
    type: "MERN",
    context: null,
    timelineMonths: 6,
    completedAt: null,
    teamSize: 5,
    roleDetail: null,
    problem:
      "An e-commerce dashboard has to stay readable while numbers change underneath it. Inventory, orders and payments all update independently, and a naive implementation either polls constantly or shows figures that are quietly out of date.",
    approach:
      "Socket.io pushes updates for the values that genuinely change in real time, while everything else is fetched through a cached query layer to avoid hammering the API. Stripe handles payments so no card data touches the application, and the analytics views are computed server-side to keep the browser responsive with large order volumes.",
    hardPart: null,
    outcome: null,
    retrospective: null,
    screenshots: [],
    updatedAt: "2026-07-31",
  },
  {
    _id: "s5",
    slug: "restful-api-service",
    title: "RESTful API Service",
    subtitle:
      "A Node.js API that holds up under traffic, not just in development",
    description:
      "Scalable Node.js REST API with authentication, rate limiting, Redis caching, and Swagger documentation for high-traffic production environments.",
    fullDescription:
      "A production-ready REST API built with Node.js, featuring advanced authentication, caching strategies, and comprehensive API documentation.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
    technologies: ["Node.js", "Express", "MongoDB", "Redis", "JWT", "Swagger", "Docker"],
    repoUrl: null,
    demoUrl: null,
    type: "Node",
    context: null,
    timelineMonths: 2,
    completedAt: null,
    teamSize: 2,
    roleDetail: null,
    problem:
      "APIs that work fine in development fall over under real traffic, usually because every request hits the database and nothing limits how fast a client can ask.",
    approach:
      "Redis caches the read-heavy endpoints and JWT handles stateless auth so the service scales horizontally. Rate limiting sits in front of the routes that cost the most, errors follow one consistent shape, and Swagger documents the contract so consumers are not reverse-engineering responses. Docker keeps local and production environments identical.",
    hardPart: null,
    outcome: null,
    retrospective: null,
    screenshots: [],
    updatedAt: "2026-07-31",
  },
  {
    _id: "s6",
    slug: "portfolio-blog-platform",
    title: "Portfolio & Blog Platform",
    subtitle:
      "Publish a post without holding a deploy pipeline in your head",
    description:
      "Modern developer portfolio with integrated blog, dark/light mode, markdown support, and a custom CMS for managing content without code.",
    fullDescription:
      "A beautiful portfolio and blogging platform for developers, featuring MDX support, theme customization, and an intuitive content management system.",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX", "Vercel", "Prisma"],
    repoUrl: null,
    demoUrl: null,
    type: "React",
    context: null,
    timelineMonths: 4,
    completedAt: null,
    teamSize: 1,
    roleDetail: null,
    problem:
      "Most developer portfolios force a choice between a fast static site and being able to publish without touching code.",
    approach:
      "Next.js with MDX keeps posts as content rather than markup, so writing does not require a deploy pipeline in your head. Prisma backs a small CMS layer for editing, theme state persists without a flash of the wrong colours, and the whole thing is built so search engines get real HTML rather than an empty shell.",
    hardPart: null,
    outcome: null,
    retrospective: null,
    screenshots: [],
    updatedAt: "2026-07-31",
  },
];

export function normalizeProjectId(id: unknown): string {
  if (typeof id === "string") return id;
  if (id && typeof id === "object" && "$oid" in id) {
    return String((id as { $oid: string }).$oid);
  }
  return String(id ?? "");
}

export function mergeProjects(apiProjects: Project[]): Project[] {
  const normalized = apiProjects.map((p) => ({
    ...p,
    _id: normalizeProjectId(p._id),
  }));
  if (!normalized.length) return STATIC_PROJECTS;
  const ids = new Set(normalized.map((p) => p._id));
  return [...normalized, ...STATIC_PROJECTS.filter((p) => !ids.has(p._id))];
}

/** The URL segment a project is canonically served at. */
export function projectSlug(project: Project): string {
  return project.slug || project._id;
}

/** Canonical detail path for a project — the ONLY way to build one. */
export function projectPath(project: Project): string {
  return `/projects/${projectSlug(project)}`;
}

/**
 * Resolves a route param that may be a slug (current URLs) or an _id (the
 * pre-slug URLs, plus every API-backed project, which has no slug).
 *
 * Slug wins on a tie so a future project can never be shadowed by an id.
 */
export function findStaticProject(idOrSlug: string): CaseStudy | undefined {
  return (
    STATIC_PROJECTS.find((p) => p.slug === idOrSlug) ??
    STATIC_PROJECTS.find((p) => p._id === idOrSlug)
  );
}

/**
 * Legacy /projects/<id> → /projects/<slug> pairs.
 *
 * scripts/prerender.mjs asserts vercel.json carries a 301 for every entry, so
 * adding a slug without adding its redirect fails the build instead of quietly
 * 404ing a URL that is already indexed and linked.
 */
export const LEGACY_PROJECT_REDIRECTS: { from: string; to: string }[] =
  STATIC_PROJECTS.filter((p) => p.slug !== p._id).map((p) => ({
    from: `/projects/${p._id}`,
    to: projectPath(p),
  }));

export function projectImageUrl(image?: string): string | undefined {
  if (!image) return undefined;
  return image.startsWith("http") ? image : `${API_BASE_URL}${image}`;
}

/** Repo link, preferring the per-project field over the admin form's. */
export function projectRepoUrl(project: Project): string | null {
  return project.repoUrl ?? project.githubLink ?? null;
}

/** Demo link — only ever rendered when it is known to resolve. */
export function projectDemoUrl(project: Project): string | null {
  return project.demoUrl ?? project.demoLink ?? null;
}

/**
 * Whether the page can show a reader anything they could check for themselves.
 * A case study with no repo, no demo and no screenshots is an assertion.
 */
export function hasVerifiableProof(project: Project): boolean {
  return Boolean(
    projectRepoUrl(project) ||
      projectDemoUrl(project) ||
      project.screenshots?.length
  );
}

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/** "4 months, completed March 2025" — the tail only when the date is known. */
export function timelineLabel(project: Project): string | null {
  const months = project.timelineMonths;
  if (!months) return null;
  const base = `${months} month${months === 1 ? "" : "s"}`;
  if (!project.completedAt) return base;
  const [year, month] = project.completedAt.split("-");
  const name = MONTHS[Number(month) - 1];
  return name ? `${base}, completed ${name} ${year}` : base;
}

/** "Solo build" reads better than "1 developer" and says the same thing. */
export function teamLabel(project: Project): string | null {
  const size = project.teamSize;
  if (!size) return null;
  return size === 1 ? "Solo build" : `${size} developers`;
}

/**
 * Case-study fields still waiting on the owner, in the order they cost most.
 *
 * Reported at build time by scripts/prerender.mjs. These are all facts only
 * the person who built the thing can supply, so the alternative to reporting
 * them is inventing them — which is the one failure mode these pages exist to
 * avoid.
 */
export function pendingCaseStudyFields(project: CaseStudy): string[] {
  const missing: string[] = [];
  if (!project.outcome) missing.push("outcome (what shipped — needs a number)");
  if (!project.hardPart) missing.push("hardPart (one decision, 150–250 words)");
  if (!project.screenshots.length) missing.push("screenshots (real app captures)");
  if (!project.roleDetail) missing.push("roleDetail (which part was yours)");
  if (!project.context) missing.push("context (client / capstone / personal)");
  if (!project.completedAt) missing.push("completedAt (feeds dateCreated)");
  if (!project.retrospective) missing.push("retrospective (2–3 sentences)");
  if (!project.repoUrl) missing.push("repoUrl (this repo, not the profile)");
  return missing;
}

/**
 * The CreativeWork node for a case study, as a bare graph node.
 *
 * Shared by the prerenderer and the React runtime so the two can't drift —
 * useSEO() strips the prerendered JSON-LD on hydration and re-emits this, so
 * anything only one of them knows about disappears the moment React boots.
 *
 * `dateCreated` is the delivery date, omitted rather than faked: an undated
 * portfolio gives an AI crawler no way to tell a current build from a
 * five-year-old one. `dateModified` is the last revision to the write-up,
 * which is a different claim and tracked separately.
 */
export function projectSchemaNode(
  project: Project,
  opts: { url: (path: string) => string; creator: object }
): object {
  const pageUrl = opts.url(projectPath(project));
  const repo = projectRepoUrl(project);
  return {
    "@type": "CreativeWork",
    "@id": `${pageUrl}#project`,
    name: project.title,
    description: project.subtitle ?? project.fullDescription ?? project.description,
    url: pageUrl,
    mainEntityOfPage: pageUrl,
    ...(project.image ? { image: project.image } : {}),
    keywords: project.technologies.join(", "),
    creator: opts.creator,
    ...(project.completedAt ? { dateCreated: project.completedAt } : {}),
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
    ...(repo ? { codeRepository: repo } : {}),
    inLanguage: "en",
  };
}
