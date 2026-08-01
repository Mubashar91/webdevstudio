import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbSchema, canonicalPath, SITE_NAME } from "@/lib/seo";
import {
  API_BASE_URL,
  findStaticProject,
  normalizeProjectId,
  projectImageUrl,
  type Project,
} from "@/data/projects";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CARD_IMAGE, optimizedImage } from "@/lib/images";
import {
  ArrowLeft,
  Github,
  ExternalLink,
  Calendar,
  Users,
  Target,
  Code2,
  Rocket,
  CheckCircle2,
  Lightbulb,
  TrendingUp,
} from "lucide-react";

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

  const seoTitle = project
    ? `${project.title} | ${SITE_NAME}`
    : loading
      ? "Loading Project…"
      : "Project Not Found";

  useSEO({
    title: seoTitle,
    description:
      project?.description ??
      "Project case study from WebDevStudio's web development portfolio.",
    canonical: id ? canonicalPath(`/projects/${id}`) : undefined,
    ogImage: project?.image ? projectImageUrl(project.image) : undefined,
    ogType: "article",
    noindex: !loading && !project,
    structuredData: project
      ? [
          {
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            name: project.title,
            description: project.description,
            image: projectImageUrl(project.image),
            url: canonicalPath(`/projects/${project._id}`),
            author: { "@type": "Organization", name: SITE_NAME },
            keywords: project.technologies.join(", "),
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Projects", path: "/projects" },
            { name: project.title, path: `/projects/${project._id}` },
          ]),
        ]
      : undefined,
  });

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
                <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight text-foreground dark:text-white drop-shadow-lg">
                  {project.title}
                </h1>
                {project.fullDescription && (
                  <p className="text-lg text-foreground/80 dark:text-gray-200 mb-8 leading-relaxed drop-shadow">
                    {project.fullDescription}
                  </p>
                )}

                <div className="flex flex-wrap gap-4 mb-8">
                  {project.githubLink && (
                    <Button asChild className="hover:shadow-lg hover:shadow-primary/50 transition-all duration-300 dark:hover:shadow-primary/40 shadow-md">
                      <a href={project.githubLink} target="_blank" rel="noopener noreferrer">
                        <Github className="mr-2 h-4 w-4" />
                        View Code
                      </a>
                    </Button>
                  )}
                  {project.demoLink && (
                    <Button variant="outline" asChild className="hover:shadow-lg hover:shadow-accent/50 transition-all duration-300 dark:hover:shadow-accent/40 dark:border-gray-500 dark:text-white shadow-md">
                      <a href={project.demoLink} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-2 h-4 w-4" />
                        Live Demo
                      </a>
                    </Button>
                  )}
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <Card className="p-4 text-center bg-card/70 hover:bg-card/95 border border-border/50 hover:border-primary/60 transition-all duration-300 backdrop-blur-sm dark:bg-black/40 dark:hover:bg-black/60 dark:border-gray-600 dark:hover:border-primary/50 shadow-lg">
                    <Calendar className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-foreground/70 dark:text-gray-300 mb-1 font-medium">Duration</p>
                    <p className="font-semibold text-foreground dark:text-white">{project.duration || "N/A"}</p>
                  </Card>
                  <Card className="p-4 text-center bg-card/70 hover:bg-card/95 border border-border/50 hover:border-primary/60 transition-all duration-300 backdrop-blur-sm dark:bg-black/40 dark:hover:bg-black/60 dark:border-gray-600 dark:hover:border-primary/50 shadow-lg">
                    <Users className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-foreground/70 dark:text-gray-300 mb-1 font-medium">Team Size</p>
                    <p className="font-semibold text-foreground dark:text-white">{project.teamSize || "N/A"}</p>
                  </Card>
                  <Card className="p-4 text-center bg-card/70 hover:bg-card/95 border border-border/50 hover:border-primary/60 transition-all duration-300 backdrop-blur-sm dark:bg-black/40 dark:hover:bg-black/60 dark:border-gray-600 dark:hover:border-primary/50 shadow-lg">
                    <Target className="h-6 w-6 mx-auto mb-2 text-primary" />
                    <p className="text-sm text-foreground/70 dark:text-gray-300 mb-1 font-medium">My Role</p>
                    <p className="font-semibold text-xs text-foreground dark:text-white">{project.role || "N/A"}</p>
                  </Card>
                </div>
              </div>

              <div className="relative animate-in fade-in slide-in-from-right duration-700 delay-200">
                {project.image && (
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-black/10 to-black/20 dark:from-black/60 dark:via-black/30 dark:to-black/50 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" />
                    <img
                      src={optimizedImage(projectImageUrl(project.image))}
                      alt={`${project.title} — project screenshot`}
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

        <section className="py-12 bg-surface-alt">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              Project Overview
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="p-6 hover:shadow-glow transition-shadow">
                <Code2 className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Tech Stack</h3>
                <p className="text-muted-foreground">{project.technologies.length}+ Technologies</p>
              </Card>
              <Card className="p-6 hover:shadow-glow transition-shadow">
                <Rocket className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Development</h3>
                <p className="text-muted-foreground">{project.duration || "N/A"} Timeline</p>
              </Card>
              <Card className="p-6 hover:shadow-glow transition-shadow">
                <Users className="h-10 w-10 text-primary mb-4" />
                <h3 className="font-semibold text-lg mb-2">Team</h3>
                <p className="text-muted-foreground">{project.teamSize || "N/A"}</p>
              </Card>
              <Card className="p-6 hover:shadow-glow transition-shadow">
                <CheckCircle2 className="h-10 w-10 text-accent mb-4" />
                <h3 className="font-semibold text-lg mb-2">Status</h3>
                <p className="text-muted-foreground">Completed</p>
              </Card>
            </div>
          </div>
        </section>

        <section className="py-12">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
              <Code2 className="h-8 w-8 text-primary" />
              Technologies Used
            </h2>
            <p className="text-muted-foreground mb-8 max-w-3xl">
              This project leverages cutting-edge technologies and modern development practices to deliver a robust, scalable, and maintainable solution.
            </p>
            <div className="flex flex-wrap gap-3">
              {project.technologies?.map((tech) => (
                <Badge key={tech} variant="secondary" className="text-sm px-4 py-2">
                  {tech}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <Separator />

        <section className="py-12 bg-surface-alt">
          <div className="container mx-auto px-6">
            <h2 className="text-3xl font-bold mb-8 flex items-center gap-3">
              <Lightbulb className="h-8 w-8 text-accent" />
              Key Features & Capabilities
            </h2>
            {project.features && project.features.length > 0 && (
              <div className="grid md:grid-cols-2 gap-6">
                {project.features.map((feature) => (
                  <Card key={feature} className="p-6 hover:shadow-glow transition-all duration-300 group">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center flex-shrink-0 mt-1 group-hover:scale-110 transition-transform">
                        <CheckCircle2 className="h-5 w-5 text-white" />
                      </div>
                      <p className="text-foreground group-hover:text-primary transition-colors">{feature}</p>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="py-16 bg-gradient-to-r from-primary/10 via-accent/10 to-primary/10 relative overflow-hidden">
          <div className="container mx-auto px-6 text-center relative z-10">
            <h2 className="text-4xl font-bold mb-4">Interested in Similar Projects?</h2>
            <p className="text-muted-foreground mb-8 max-w-2xl mx-auto text-lg">
              I'm available for freelance work and always excited to collaborate on innovative projects.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button asChild size="lg">
                <Link to="/contact">Get in Touch</Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link to="/projects">View More Projects</Link>
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
