import { useEffect, useState } from "react";
import { useParams, useNavigate, Link, Navigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import {
  breadcrumbNodeFor,
  canonicalPath,
  FOUNDER_NAME,
  pageGraphFor,
  SITE_NAME,
  withBrand,
} from "@/lib/seo";
import {
  API_BASE_URL,
  findStaticProject,
  normalizeProjectId,
  projectDemoUrl,
  projectImageUrl,
  projectPath,
  projectRepoUrl,
  projectSchemaNode,
  projectSlug,
  teamLabel,
  timelineLabel,
  type Project,
} from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CARD_IMAGE, optimizedImage, schemaImage } from "@/lib/images";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Target,
  Code2,
  Wrench,
  ImageIcon,
  RotateCcw,
  TrendingUp,
} from "lucide-react";

/**
 * One row of the "At a glance" table.
 *
 * Rows with no value are dropped rather than rendered empty: the page used to
 * print "N/A" into a stat card, which is a worse answer than not asking the
 * question. The gaps are surfaced at build time instead — see
 * pendingCaseStudyFields() in src/data/projects.ts.
 */
const GlanceRow = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <tr className="border-b border-border/50 last:border-0">
    <th
      scope="row"
      className="py-3 pr-6 text-left align-top font-semibold text-sm text-muted-foreground whitespace-nowrap"
    >
      {label}
    </th>
    <td className="py-3 text-sm text-foreground">{children}</td>
  </tr>
);

/** A body section that renders only when it has something true to say. */
const Prose = ({
  id,
  icon: Icon,
  heading,
  children,
}: {
  id: string;
  icon: typeof Target;
  heading: string;
  children: string | null | undefined;
}) => {
  if (!children) return null;
  return (
    <section id={id} className="space-y-3">
      <h2 className="text-2xl font-bold flex items-center gap-3">
        <Icon className="h-6 w-6 text-primary" />
        {heading}
      </h2>
      <p className="text-muted-foreground leading-relaxed text-base whitespace-pre-line">
        {children}
      </p>
    </section>
  );
};

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  // Seed from static data on the FIRST render, not in an effect.
  //
  // Effects never run during server rendering, so starting at
  // {project: null, loading: true} meant the prerenderer captured the
  // "Loading project…" skeleton — all six case-study pages shipped zero
  // portfolio content to crawlers. Resolving the static project during render
  // means the HTML contains the real case study, and the fetch below only
  // upgrades it for API-backed projects.
  const seeded = id ? findStaticProject(id) : undefined;
  const [project, setProject] = useState<Project | null>(seeded ?? null);
  const [loading, setLoading] = useState(!seeded);

  useEffect(() => {
    if (!id) return;

    // Already resolved from static data during render — nothing to fetch, and
    // flipping `loading` back on here would replace the prerendered case study
    // with a skeleton for a frame on hydration.
    if (findStaticProject(id)) return;

    const fetchProject = async () => {
      setLoading(true);

      try {
        const res = await fetch(`${API_BASE_URL}/api/projects/${id}`);
        if (res.status === 404) {
          setProject(null);
          return;
        }
        if (!res.ok) throw new Error("Failed to load project");

        const data = await res.json();
        setProject({
          ...data,
          _id: normalizeProjectId(data._id),
        });
      } catch {
        setProject(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProject();
  }, [id]);

  // withBrand + seoTitle, so the hydrated <head> matches what the prerenderer
  // wrote for this route rather than quietly rebuilding a different title.
  const seoTitle = project
    ? withBrand(project.seoTitle ?? project.title)
    : loading
      ? "Loading Project…"
      : "Project Not Found";

  useSEO({
    title: seoTitle,
    // `description` first, not `subtitle`: subtitle is a hero line written to
    // be read at 60-odd characters, and preferring it here meant hydration
    // replaced the build's full meta description with a third of one. The
    // prerenderer uses project.description — these two have to agree.
    description:
      project?.description ??
      project?.subtitle ??
      "Project case study from WebDevStudio's web development portfolio.",
    // Canonical follows the project's slug, never the param it was reached
    // by. Landing on the legacy /projects/s1 must still declare
    // /projects/expense-sharing-app as the one indexable URL.
    canonical: project
      ? canonicalPath(projectPath(project))
      : id
        ? canonicalPath(`/projects/${id}`)
        : undefined,
    // schemaImage(), matching BlogDetail and the prerendered head. This was
    // passing the raw card URL, so hydration quietly swapped the 1200px social
    // card the build wrote for the 800px one — under Google's threshold for
    // large-image treatment, and a different image than the crawler was told.
    ogImage: project?.image ? schemaImage(projectImageUrl(project.image)) : undefined,
    ogType: "article",
    noindex: !loading && !project,
    // pageGraph() carries the Organization and Person nodes, so the
    // CreativeWork's `creator` reference to #founder actually resolves to a
    // named human. Emitting the CreativeWork on its own left it attributed to
    // an @id that existed nowhere on the page after hydration.
    structuredData: project
      ? pageGraphFor(
          {
            // pageGraph() looked this path up in ROUTES, which has no entry
            // for a case study — so findRoute() returned undefined and the
            // hydrated graph shipped with no WebPage node at all, leaving the
            // BreadcrumbList orphaned. pageGraphFor() builds it from the
            // project's own fields, mirroring DYNAMIC_ROUTES.
            path: projectPath(project),
            title: withBrand(project.seoTitle ?? project.title),
            description: project.description,
            image: schemaImage(projectImageUrl(project.image)),
            lastmod: project.updatedAt,
          },
          [
            projectSchemaNode(project, {
              url: canonicalPath,
              creator: { "@id": `${canonicalPath("/")}#founder` },
            }),
            breadcrumbNodeFor([
              { name: "Home", path: "/" },
              { name: "Projects", path: "/projects" },
              { name: project.title, path: projectPath(project) },
            ]),
          ]
        )
      : undefined,
  });

  // Reached by the pre-slug URL (/projects/s1) with JS running: swap the
  // address bar for the slug so in-app navigation, sharing and analytics all
  // settle on one URL. Vercel 301s the same paths for crawlers and non-JS
  // clients — this is the belt to that pair of braces, not a replacement.
  if (project && id && projectSlug(project) !== id) {
    return <Navigate to={projectPath(project)} replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-3xl font-bold mb-4">Loading project...</h1>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        <Navigation />
        <div className="container mx-auto px-6 py-32 text-center">
          <h1 className="text-4xl font-bold mb-4">Project Not Found</h1>
          <Button onClick={() => navigate("/projects")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </div>
        <Footer />
      </div>
    );
  }

  const repoUrl = projectRepoUrl(project);
  const demoUrl = projectDemoUrl(project);
  const timeline = timelineLabel(project);
  const team = teamLabel(project);
  const screenshots = project.screenshots ?? [];

  // The hero renders in a half-width column on desktop and full width on a
  // phone, so on any 2x display the 800px card is upscaled. schemaImage() is
  // the same crop re-requested at 1200 — offered as a second candidate rather
  // than swapped in, so small screens still download the small file.
  const cover = projectImageUrl(project.image);
  const coverLarge = schemaImage(cover);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />

      <main id="main-content" className="pt-20">
        <section className="relative py-12 bg-black/5 dark:bg-black/40 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-black/10 via-black/5 to-black/15 dark:from-black/60 dark:via-black/50 dark:to-black/60 pointer-events-none" />
          <div className="absolute inset-0 opacity-30 pointer-events-none">
            <div className="absolute -top-40 left-1/3 w-96 h-96 bg-primary/15 dark:bg-primary/10 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 right-1/4 w-80 h-80 bg-accent/15 dark:bg-accent/10 rounded-full blur-3xl" />
          </div>

          <div className="container mx-auto px-6 relative z-10">
            {/* These pages emit BreadcrumbList JSON-LD, but "Back to Projects"
                is a control, not a trail — it tells you nothing about where
                this page sits. Google wants the visible navigation to match
                the markup. */}
            <Breadcrumbs
              items={[
                { label: "Projects", href: "/projects" },
                { label: project.title },
              ]}
              className="mb-6"
            />

            <Button
              variant="ghost"
              onClick={() => navigate("/projects")}
              className="mb-6 hover:bg-accent/80 transition-all duration-300 dark:hover:bg-accent/60"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Projects
            </Button>

            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6 animate-in fade-in slide-in-from-left duration-700">
                <Badge className="mb-4 bg-primary/90 hover:bg-primary transition-all dark:bg-primary/80 text-white shadow-lg">
                  {project.type}
                </Badge>
                <h1 className="text-4xl md:text-5xl font-bold mb-4 leading-tight text-foreground dark:text-white drop-shadow-lg">
                  {project.title}
                </h1>
                {/* The subtitle says what it does in the user's words. The old
                    hero led with fullDescription, which led with the stack. */}
                <p className="text-lg font-medium text-foreground/90 dark:text-gray-100 drop-shadow">
                  {project.subtitle ?? project.fullDescription ?? project.description}
                </p>

                {/* Proof links only. A button that lands on a profile listing
                    instead of this project's code reads as though the repo
                    doesn't exist — see projectRepoUrl(). */}
                {(repoUrl || demoUrl) && (
                  <div className="flex flex-wrap gap-4">
                    {repoUrl && (
                      <Button asChild className="hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 dark:hover:shadow-primary/40 shadow-md">
                        <a href={repoUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          View the code
                        </a>
                      </Button>
                    )}
                    {demoUrl && (
                      <Button variant="outline" asChild className="hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 dark:hover:shadow-accent/40 dark:border-gray-500 dark:text-white shadow-md">
                        <a href={demoUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live demo
                        </a>
                      </Button>
                    )}
                  </div>
                )}
              </div>

              <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
                {project.image && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-black/20 dark:from-black/60 dark:via-black/30 dark:to-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <img
                      src={optimizedImage(cover)}
                      {...(coverLarge && coverLarge !== cover
                        ? {
                            srcSet: `${optimizedImage(cover)} 800w, ${optimizedImage(coverLarge)} 1200w`,
                            sizes: "(min-width: 1024px) 50vw, 100vw",
                          }
                        : {})}
                      /* Empty alt, deliberately, for the stock covers: a
                         photograph that says nothing about the project is
                         decorative, and the old text ("— illustrative cover
                         image") announced exactly that to anyone using a
                         screen reader. Case studies whose cover is a real
                         screenshot set `imageAlt` and get a real description
                         instead — see the field note in case-studies/types.ts. */
                      alt={project.imageAlt ?? ""}
                      width={CARD_IMAGE.width}
                      height={CARD_IMAGE.height}
                      loading="eager"
                      fetchPriority="high"
                      decoding="async"
                      className="rounded-lg shadow-2xl w-full aspect-video object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500 group-hover:shadow-2xl dark:shadow-black/50"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* At a glance.
            Replaces two blocks that said the same thing a few hundred pixels
            apart: the Duration / Team Size / My Role cards in the hero, and the
            "Project Overview" row that repeated the timeline, the team and a
            "6+ Technologies" count. Counting your own technologies is not a
            credential. */}
        <section className="py-10 bg-surface-alt">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-xl font-bold mb-4">At a glance</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <tbody>
                  {project.context && (
                    <GlanceRow label="Context">{project.context}</GlanceRow>
                  )}
                  {timeline && <GlanceRow label="Timeline">{timeline}</GlanceRow>}
                  {team && <GlanceRow label="Team">{team}</GlanceRow>}
                  {project.roleDetail && (
                    <GlanceRow label="My role">{project.roleDetail}</GlanceRow>
                  )}
                  <GlanceRow label="Stack">
                    {project.technologies.join(" · ")}
                  </GlanceRow>
                  {repoUrl && (
                    <GlanceRow label="Code">
                      <a
                        href={repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary underline underline-offset-4"
                      >
                        {repoUrl.replace(/^https?:\/\//, "")}
                      </a>
                    </GlanceRow>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6 max-w-4xl space-y-10">
            <Prose id="problem" icon={Target} heading="The problem">
              {project.problem}
            </Prose>
            <Prose id="approach" icon={Code2} heading="The approach">
              {project.approach}
            </Prose>
            {/* The one section that separates a case study from a portfolio
                tile: a single decision and what it cost. */}
            <Prose id="hard-part" icon={Wrench} heading="The hard part">
              {project.hardPart}
            </Prose>

            {project.outcome && (
              <section id="outcome" className="rounded-2xl border border-primary/25 bg-primary/5 p-6">
                <h2 className="text-2xl font-bold mb-3 flex items-center gap-3">
                  <TrendingUp className="h-6 w-6 text-primary" />
                  What shipped
                </h2>
                <p className="text-foreground/90 leading-relaxed text-base whitespace-pre-line">
                  {project.outcome}
                </p>
              </section>
            )}

            <Prose
              id="retrospective"
              icon={RotateCcw}
              heading="What I'd do differently"
            >
              {project.retrospective}
            </Prose>
          </div>
        </section>

        {screenshots.length > 0 && (
          <>
            <Separator />
            <section className="py-12 bg-surface-alt">
              <div className="container mx-auto px-6 max-w-5xl">
                <h2 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <ImageIcon className="h-6 w-6 text-primary" />
                  Screenshots
                </h2>
                <div className="grid sm:grid-cols-2 gap-8">
                  {screenshots.map((shot) => (
                    <figure key={shot.src} className="space-y-3">
                      <img
                        src={shot.src}
                        alt={shot.alt}
                        loading="lazy"
                        decoding="async"
                        className="rounded-xl border border-border/60 w-full object-cover shadow-card"
                      />
                      <figcaption className="text-sm text-muted-foreground">
                        {shot.caption}
                      </figcaption>
                    </figure>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        <Separator />

        {/* Stack, with no commentary.
            The paragraph that used to sit here — "cutting-edge technologies and
            modern development practices to deliver a robust, scalable and
            maintainable solution" — is true of every project ever built, and
            promotional filler measurably suppresses AI citation. */}
        <section className="py-12">
          <div className="container mx-auto px-6 max-w-4xl">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-3">
              <Code2 className="h-6 w-6 text-primary" />
              Stack
            </h2>
            <div className="flex flex-wrap gap-3">
              {project.technologies?.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm px-4 py-2">
                  {tech}
                </Badge>
              ))}
            </div>

            {/* The return path. /services links out to these case studies as
                proof; without a link back, a reader who arrives here from
                search has no route to the thing that's actually for sale, and
                the page dead-ends at "interesting". */}
            <p className="mt-6 text-sm text-muted-foreground">
              Work like this is quoted under{" "}
              <Link
                to="/services"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                web development services
              </Link>
              , with fixed prices agreed before anything starts.
            </p>

            {/* Related reading. A visitor who has just read a case study is
                usually mid-decision on cost or on who to hire — these are the
                two questions that follow, and answering them here keeps the
                reader on the site instead of back on Google. */}
            <p className="mt-2 text-sm text-muted-foreground">
              Related:{" "}
              {project.slug === "mk-nails-beauty" ? (
                <>
                  <Link
                    to="/web-developer-nicosia"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    web developer in Nicosia
                  </Link>{" "}
                  ·{" "}
                  <Link
                    to="/web-development-cyprus"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    web development for Cyprus businesses
                  </Link>{" "}
                  ·{" "}
                  <Link
                    to="/blogs/website-cost-cyprus-2026"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    Cyprus website pricing
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    to="/blogs/custom-web-application-cost"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    what a custom web application costs
                  </Link>{" "}
                  ·{" "}
                  <Link
                    to="/blogs/how-to-choose-a-web-development-company"
                    className="text-primary hover:underline underline-offset-4"
                  >
                    how to choose a web development company
                  </Link>
                </>
              )}
            </p>
          </div>
        </section>

        <section className="py-12 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10">
          <div className="container mx-auto px-6 max-w-4xl text-center">
            <p className="text-lg mb-6">
              <strong>Built by {FOUNDER_NAME}</strong> — React &amp; MERN
              developer, {SITE_NAME}.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Book a free 30-min call</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/projects">See all projects</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProjectDetail;
