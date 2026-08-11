/**
 * Project types, the case-study set, and every helper that turns one into a
 * URL, a link or a JSON-LD node.
 *
 * The six case studies themselves moved to ./case-studies/ — one file each —
 * on 2026-08-09. Everything this module used to export it still exports, so
 * `import { STATIC_PROJECTS, projectPath } from "@/data/projects"` is
 * unchanged at all eleven call sites; this file is now the seam rather than
 * the content.
 */
export type {
  CaseStudy,
  Project,
  ProjectContext,
  ProjectType,
  Screenshot,
} from "./case-studies/types";

import type { CaseStudy, Project } from "./case-studies/types";

export { STATIC_PROJECTS } from "./case-studies";
import { STATIC_PROJECTS } from "./case-studies";

// Re-exported for the existing call sites in Projects.tsx / ProjectDetail.tsx.
// Resolution lives in one place so the localhost fallback can't leak into
// production builds again.
import { API_BASE_URL } from "@/lib/api";
export { API_BASE_URL };

import { schemaImage } from "@/lib/images";

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
 *
 * The order below is the August 2026 portfolio audit's ranking, and the first
 * entry is why it exists: read as a set, six case studies with no repo, no
 * live URL and no screenshot read as fabricated to a technical evaluator —
 * whatever the prose says. Nothing else on a page matters until a reader can
 * click one thing and confirm it exists.
 */
export function pendingCaseStudyFields(project: CaseStudy): string[] {
  const missing: string[] = [];

  // Ranked first because it is the whole-portfolio problem, not a per-page
  // one. Any ONE of these clears it: the repo, a live URL, or a screenshot.
  if (!hasVerifiableProof(project)) {
    missing.push(
      "PROOF — nothing on this page is checkable. Needs a repo link, a live URL, or one screenshot."
    );
  }

  if (!project.outcome) {
    missing.push("outcome (what shipped — needs a number)");
  } else if (!/\d/.test(project.outcome)) {
    // "Significantly faster" is the same claim as no claim, and it is the
    // exact register a reader discounts on sight.
    missing.push("outcome has no digit in it — one measured number, not an adjective");
  }

  if (!project.context) {
    missing.push(
      "context (client work vs personal build — an unlabelled learning build is the expensive kind of silence)"
    );
  }
  if (project.teamSize > 1 && !project.roleDetail) {
    // A team size with no split named is worse than no team size: it invites
    // the reader to reconcile "5 developers" against a solo-founder footer
    // themselves, and they will not do it generously.
    missing.push(
      `roleDetail — page claims ${project.teamSize} developers with no split stated`
    );
  }
  if (!project.completedAt) missing.push("completedAt (a month and year; feeds dateCreated)");
  if (!project.hardPart) missing.push("hardPart (one decision, 150–250 words, including what it cost)");
  if (!project.screenshots.length) missing.push("screenshots (real app captures, 1200×675+)");
  if (!project.retrospective) missing.push("retrospective (2–3 sentences)");
  if (!project.repoUrl) missing.push("repoUrl (this project's repo, never the profile)");
  if (!project.demoUrl) missing.push("demoUrl (live URL — or label the page a demo and move on)");

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
    // schemaImage, not the raw card URL: the card is served at 800px wide and
    // Google wants >=1200px before it will consider an image for large-image
    // treatment. Same photo, same crop, larger request.
    ...(project.image ? { image: schemaImage(project.image) } : {}),
    keywords: project.technologies.join(", "),
    creator: opts.creator,
    ...(project.completedAt ? { dateCreated: project.completedAt } : {}),
    ...(project.updatedAt ? { dateModified: project.updatedAt } : {}),
    ...(repo ? { codeRepository: repo } : {}),
    // A CreativeWork says "something was made"; the SoftwareApplication says
    // what kind of software it is, which is the part an answer engine matches
    // on for "hospital management system" style queries. Only emitted where
    // appCategory is set — see the note on the field.
    ...(project.appCategory
      ? {
          about: {
            "@type": "SoftwareApplication",
            name: project.title,
            applicationCategory: project.appCategory,
            operatingSystem: "Web",
            ...(schemaLanguages(project).length
              ? { programmingLanguage: schemaLanguages(project) }
              : {}),
          },
        }
      : {}),
    inLanguage: "en",
  };
}

/**
 * The entries in `technologies` that are actually programming languages.
 *
 * Filtered rather than hand-listed so the schema can't claim a language the
 * page's own stack line doesn't show — React and Tailwind are not languages,
 * and listing them as such is the kind of detail a technical reader notices.
 */
function schemaLanguages(project: Project): string[] {
  const languages = ["TypeScript", "JavaScript", "Python", "Go", "Java", "PHP"];
  return project.technologies.filter((tech) => languages.includes(tech));
}
