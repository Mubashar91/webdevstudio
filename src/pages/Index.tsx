import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Projects } from "@/components/Projects";
import { Blogs } from "@/components/Blogs";
import { TechStack } from "@/components/TechStack";
import { CTA } from "@/components/CTA";
import { Pricing } from "@/components/Pricing";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { canonicalPath, pageGraph, routeMeta } from "@/lib/seo";

const meta = routeMeta("/")!;

const Index = () => {
  useSEO({
    title: meta.title,
    description: meta.description
    canonical: canonicalPath("/"),
    // One connected @graph (Organization + Person + WebSite + WebPage),
    // identical to what scripts/prerender.mjs bakes into the static HTML.
    // The previous ProfilePage node was the wrong type for a business
    // homepage and was not linked to any other entity.
    structuredData: pageGraph("/"),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content">
        <Hero />
        <Stats />
        <Projects />
        <Pricing />
        <Blogs />
        <TechStack />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
