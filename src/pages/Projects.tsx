import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { Projects as ProjectsSection } from "@/components/Projects";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbNodeFor, canonicalPath, pageGraph, routeMeta } from "@/lib/seo";
import { projectPath, STATIC_PROJECTS } from "@/data/projects";

const meta = routeMeta("/projects")!;

const Projects = () => {
  useSEO({
    title: meta.title,
    description: meta.description
    canonical: canonicalPath("/projects"),
    structuredData: pageGraph("/projects", [
      {
        "@type": "CollectionPage",
        "@id": `${canonicalPath("/projects")}#collection`,
        name: "Projects by WebDevStudio",
        description:
          "Portfolio of web applications built with React.js, TypeScript, Node.js and MERN stack.",
        url: canonicalPath("/projects"),
        author: { "@id": `${canonicalPath("/")}#organization` },
        // Enumerating the portfolio as an ItemList gives crawlers and AI
        // answer engines the actual project names and stacks, instead of a
        // page they can only describe as "a portfolio".
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: STATIC_PROJECTS.length,
          itemListElement: STATIC_PROJECTS.map((project, index) => ({
            "@type": "ListItem",
            position: index + 1,
            item: {
              "@type": "CreativeWork",
              name: project.title,
              description: project.description,
              url: canonicalPath(projectPath(project))
              creator: { "@id": `${canonicalPath("/")}#organization` },
            },
          })),
        },
      },
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Portfolio"
          highlight="Projects"
          description="A curated selection of web applications showcasing expertise in React, TypeScript, Node.js, and the MERN stack."
          breadcrumbs={[{ label: "Projects" }]}
          cta={{
            label: "Start a project",
            to: "/contact",
            note: "Free 30-min call · Fixed quote before work starts",
          }}
        />
        <ProjectsSection compactHeader aboveFold />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
