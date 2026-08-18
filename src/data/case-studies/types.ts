/**
 * Shapes for anything rendered as a project.
 *
 * Lives here rather than in ../projects.ts so the six case-study files can be
 * typed without importing the module that assembles them — an import cycle
 * that TypeScript would erase but Vite would not.
 */

export type ProjectType = "MERN" | "React" | "Node" | "Other";

/**
 * What kind of engagement this was.
 *
 * "Four months, three people, React Native" reads like a capstone or a startup
 * MVP and the page never said which — and a client project with no client and
 * no outcome raises more questions than "University capstone" ever would.
 *
 * The August 2026 portfolio audit sharpened this: a learning build labelled as
 * one is a credibility GAIN, because it shows you distinguish between a demo
 * and paid client work. What costs you is an unlabelled solo build carrying a
 * five-person team and a "Senior" title.
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
  /**
   * Alt text for the cover, set ONLY when `image` is a real screenshot.
   *
   * Most covers here are stock photographs that say nothing about the project,
   * and a decorative image takes an empty alt — describing it just announces
   * "illustrative cover image" to a screen reader. Leave this unset for those.
   * Set it when the cover is an actual capture of the thing, and describe what
   * the capture shows.
   */
  imageAlt?: string;
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
   *
   * Read across all six pages this is not a per-page problem but a positioning
   * one: teams of 1, 2, 2, 3, 4 and 5 sit under a footer that says the studio
   * is led by one founder available for freelance. Whatever these say, they
   * have to agree with that.
   */
  roleDetail?: string | null;

  /**
   * Overrides `title` in <head> only — the H1 keeps the plain project name.
   *
   * "Hospital Management System" is what the thing is called; "Hospital
   * Management System — MERN case study" is what someone types when they are
   * looking for evidence a developer has built one. withBrand() still applies,
   * so keep it short enough to leave room for the brand.
   */
  seoTitle?: string;

  /**
   * schema.org `applicationCategory` for the SoftwareApplication node hung off
   * this project's CreativeWork — "HealthApplication", "BusinessApplication",
   * "DeveloperApplication" and so on.
   *
   * Optional because it is a claim about what the software IS, and a wrong
   * category is worse than none. Set it only where the project genuinely fits
   * one of schema.org's values.
   */
  appCategory?: string | null;

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
   *
   * Wants a DIGIT in it. pendingCaseStudyFields() checks for one, because
   * "significantly faster" is the same claim as no claim.
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
