import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { Projects as ProjectsSection } from "@/components/Projects";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbSchema, canonicalPath } from "@/lib/seo";

const Projects = () => {
  useSEO({
    title: "Projects | WebDevStudio — React & MERN Stack Portfolio",
    description:
      "Explore WebDevStudio's portfolio of 50+ web applications built with React.js, TypeScript, Node.js & MERN stack — including hospital management systems, e-commerce dashboards, and mobile apps.",
    keywords:
      "WebDevStudio projects, React portfolio, MERN stack projects, Node.js projects, web development portfolio, hospital management system, e-commerce dashboard",
    canonical: canonicalPath("/projects"),
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        name: "Projects by WebDevStudio",
        description:
          "Portfolio of web applications built with React.js, TypeScript, Node.js and MERN stack.",
        url: canonicalPath("/projects"),
        author: {
          "@type": "Organization",
          name: "WebDevStudio",
        },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Projects", path: "/projects" },
      ]),
    ],
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
        />
        <ProjectsSection compactHeader />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Projects;
