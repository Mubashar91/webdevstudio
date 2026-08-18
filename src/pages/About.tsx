import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { About as AboutSection } from "@/components/About";
import { Stats } from "@/components/Stats";
import { Skills } from "@/components/Skills";
import { TechStack } from "@/components/TechStack";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbNodeFor, canonicalPath, pageGraph, routeMeta } from "@/lib/seo";

const meta = routeMeta("/about")!;

const About = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
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

        {/* This page carries the strongest E-E-A-T signal on the site and had
            no outbound path in its body — every internal link on it came from
            the nav and the footer, so it accumulated authority and passed none
            of it on. The two links below go where someone who has just decided
            they trust the person actually wants to go next. */}
        <section className="py-16 border-t border-border/40">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <p className="text-muted-foreground leading-relaxed">
              Want to see the work rather than read about it? Start with the{" "}
              <Link
                to="/projects"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                case studies
              </Link>
              , or look at{" "}
              <Link
                to="/services"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                what I build and what it costs
              </Link>
              .
            </p>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default About;
