import { Navigation } from "@/components/Navigation";
import { About as AboutSection } from "@/components/About";
import { Stats } from "@/components/Stats";
import { Skills } from "@/components/Skills";
import { TechStack } from "@/components/TechStack";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbNodeFor, canonicalPath, pageGraph, routeMeta } from "@/lib/seo";

const meta = routeMeta("/about")!;

const About = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    canonical: canonicalPath("/about"),
    structuredData: pageGraph("/about", [
      {
        "@type": "AboutPage",
        "@id": `${canonicalPath("/about")}#aboutpage`,
        name: "About Muhammad Mubashar Shahzad",
        description:
          "Professional background, work experience, education and skills of Muhammad Mubashar Shahzad, Frontend Developer.",
        url: canonicalPath("/about"),
        mainEntity: { "@id": `${canonicalPath("/")}#founder` },
      },
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <AboutSection aboveFold />
        <Stats />
        <Skills />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
};

export default About;
