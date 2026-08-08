import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ExternalLink, Github, ArrowRight, Layers, FolderOpen } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { CARD_IMAGE, optimizedImage } from "@/lib/images";
import {
  API_BASE_URL,
  mergeProjects,
  projectImageUrl,
  projectPath,
  projectRepoUrl,
  STATIC_PROJECTS,
  type Project,
  type ProjectType,
} from "@/data/projects";

const TYPE: Record<string, { label: string; bg: string; text: string; border: string; dot: string }> = {
  MERN:  { label: "MERN",  bg: "bg-emerald-500/12", text: "text-emerald-600 dark:text-emerald-400", border: "border-emerald-500/25", dot: "bg-emerald-500" },
  React: { label: "React", bg: "bg-sky-500/12",     text: "text-sky-600 dark:text-sky-400",         border: "border-sky-500/25",     dot: "bg-sky-500" },
  Node:  { label: "Node",  bg: "bg-green-500/12",   text: "text-green-700 dark:text-green-400",     border: "border-green-500/25",   dot: "bg-green-500" },
  Other: { label: "Other", bg: "bg-violet-500/12",  text: "text-violet-600 dark:text-violet-400",   border: "border-violet-500/25",  dot: "bg-violet-500" },
};

const FILTERS: { value: ProjectType | "all"; label: string }[] = [
  { value: "all",   label: "All Projects" },
  { value: "MERN",  label: "MERN" },
  { value: "React", label: "React" },
  { value: "Node",  label: "Node.js" },
  { value: "Other", label: "Other" },
];

interface ProjectsProps {
  compactHeader?: boolean;
}

export const Projects = ({ compactHeader = false }: ProjectsProps) => {
  const [filter, setFilter] = useState<ProjectType | "all">("all");
  const [projects, setProjects] = useState<Project[]>(STATIC_PROJECTS);
  // false, not true: STATIC_PROJECTS is already populated on the first render,
  // so starting in a loading state made the prerenderer capture six empty
  // skeleton cards instead of the portfolio. The API fetch below merges in
  // any additional projects without ever showing a skeleton over real content.
  const [loading, setLoading] = useState(false);
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  const filtered = filter === "all" ? projects : projects.filter((p) => p.type === filter);

  useEffect(() => {
    // No backend configured — skip the request entirely. Firing it anyway
    // guaranteed a failed round trip and a console error on every visit, for
    // a result identical to the static data already rendered.
    if (!API_BASE_URL) return;

    let cancelled = false;
    (async () => {
      try {
        const r = await fetch(`${API_BASE_URL}/api/projects`);
        if (!r.ok) throw new Error();
        const merged = mergeProjects(await r.json());
        if (!cancelled) setProjects(merged);
      } catch {
        // Keep the static list already on screen rather than clearing it.
      }
    })();
    return () => { cancelled = true; };
  }, []);

  return (
    <section id="projects" className={`relative overflow-hidden ${compactHeader ? "py-24" : "py-32"}`}>
      <div className="absolute inset-0 bg-surface-alt pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
      <div className="absolute -top-64 left-1/3 w-[800px] h-[800px] bg-primary/8 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute -bottom-64 right-1/4 w-[700px] h-[700px] bg-violet-500/8 rounded-full blur-[160px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        {compactHeader && (
          /* Keeps the heading outline intact when the visible section
             heading is hidden — the card <h3>s would otherwise follow
             the page <h1> directly and skip a level. */
          <h2 className="sr-only">Selected projects</h2>
        )}

        {!compactHeader && (
          <div className={`text-center mb-12 md:mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="section-label mb-5 md:mb-8">
              <FolderOpen className="h-5 w-5" />
              Portfolio
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 md:mb-6 tracking-tight">
              Featured{" "}
              <span className="gradient-text">Projects</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              A curated selection of web applications showcasing expertise in modern technologies and real-world problem solving.
            </p>
          </div>
        )}

        {/* flex-wrap, not inline-flex: five px-6 pills measure ~550px, so on a
            375px screen the row overflowed its centred container on both sides
            and the section's overflow-hidden clipped the outer filters off the
            screen entirely — they were unreachable, not just cut off. */}
        <div className={`flex justify-center mb-10 md:mb-16 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex flex-wrap justify-center items-center gap-1.5 p-2 max-w-full
            rounded-2xl bg-card border border-border/50 shadow-card">
            {FILTERS.map(({ value, label }) => (
              <button
                key={value}
                onClick={() => setFilter(value)}
                className={`inline-flex items-center min-h-11 px-4 sm:px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${
                  filter === value
                    ? "bg-primary text-white shadow-sm shadow-primary/40 scale-[1.03]"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-border/40 bg-card">
                <div className="aspect-video shimmer" />
                <div className="p-6 space-y-4">
                  <div className="h-6 shimmer rounded-lg w-3/4" />
                  <div className="h-4 shimmer rounded-lg" />
                  <div className="h-4 shimmer rounded-lg w-5/6" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filtered.map((project, i) => {
              const tc = TYPE[project.type] ?? TYPE.Other;
              const detailPath = projectPath(project);
              const repoUrl = projectRepoUrl(project);
              // The first row is above the fold, and on /projects the first
              // card's cover IS the LCP element. Lazy-loading it deferred
              // discovery until layout resolved — a measured ~317ms of pure
              // delay added to that page's own LCP. Cards further down keep
              // lazy loading, which is what the attribute is actually for.
              const isAboveFold = i < 2;

              return (
                <article
                  key={project._id}
                  className={`tilt-card group relative flex flex-col rounded-2xl overflow-hidden
                    border border-border/50 bg-card shadow-card
                    hover:border-primary/40 hover:shadow-card-hover
                    ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <Link to={detailPath} className="block relative overflow-hidden aspect-[16/9] bg-muted/30 flex-shrink-0">
                    {project.image ? (
                      <img
                        src={optimizedImage(projectImageUrl(project.image))}
                        alt={`${project.title} — illustrative cover image`}
                        width={CARD_IMAGE.width}
                        height={CARD_IMAGE.height}
                        loading={isAboveFold ? "eager" : "lazy"}
                        fetchPriority={isAboveFold ? "high" : undefined}
                        decoding="async"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.08]"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-primary/8 to-violet-500/8">
                        <Layers className="h-14 w-14 text-primary/20" />
                      </div>
                    )}

                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/15 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="absolute top-3 left-3 z-10">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold border backdrop-blur-md ${tc.bg} ${tc.text} ${tc.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${tc.dot}`} />
                        {tc.label}
                      </span>
                    </div>

                    <div className="absolute inset-0 z-10 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-400 pointer-events-none">
                      <span className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-white text-xs font-bold shadow-xl">
                        <ExternalLink className="h-3.5 w-3.5" /> View case study
                      </span>
                    </div>
                  </Link>

                  <div className="flex flex-col flex-1 p-6">
                    <h3 className="text-[15px] font-bold mb-2 group-hover:text-primary transition-colors leading-snug">
                      <Link to={detailPath}>{project.title}</Link>
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed flex-1">
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {project.technologies.slice(0, 4).map((tech) => (
                        <span
                          key={tech}
                          className="px-2.5 py-0.5 rounded-full text-xs md:text-[11px] font-semibold bg-muted/70 text-muted-foreground border border-border/40"
                        >
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 4 && (
                        <span className="px-2.5 py-0.5 rounded-full text-xs md:text-[11px] font-semibold bg-muted/70 text-muted-foreground border border-border/40">
                          +{project.technologies.length - 4}
                        </span>
                      )}
                    </div>

                    <div className="flex gap-2 pt-4 border-t border-border/35">
                      {/* Only a link to THIS project's repo. The six static
                          case studies all pointed at the GitHub profile, so
                          the button promised code and delivered a listing. */}
                      {repoUrl && (
                        <Button size="sm" variant="ghost" className="flex-1 h-11 md:h-9 text-xs font-bold hover:bg-muted/70 gap-1.5 rounded-xl" asChild>
                          <a href={repoUrl} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()}>
                            <Github className="h-3.5 w-3.5" /> GitHub
                          </a>
                        </Button>
                      )}
                      <Button
                        size="sm"
                        className={`${repoUrl ? "flex-1" : "w-full"} h-11 md:h-9 text-xs font-bold shadow-sm shadow-primary/20 gap-1.5 rounded-xl`}
                        asChild
                      >
                        <Link to={detailPath}>
                          <ArrowRight className="h-3.5 w-3.5" /> Case study
                        </Link>
                      </Button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

        {!loading && filtered.length > 0 && (
          <div className={`text-center mt-16 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <Link to="/projects">
              <Button variant="outline" size="lg" className="px-10 h-12 border-border/55 hover:border-primary/45 hover:bg-primary/5 font-bold group gap-2.5 rounded-2xl shadow-card">
                Browse All Projects
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};
