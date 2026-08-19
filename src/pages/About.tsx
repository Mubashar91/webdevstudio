import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Breadcrumbs } from "@/components/Breadcrumbs";
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
        {/* This page emits BreadcrumbList JSON-LD but had no visible trail to
            match it — it's the only main page not built on PageHeader. */}
        <div className="container mx-auto px-6 pt-8">
          <Breadcrumbs items={[{ label: "About" }]} />
        </div>

        <AboutSection aboveFold />
        <Stats />
        <Skills />
        <TechStack />

        {/* This page carries the strongest E-E-A-T signal on the site and had
            no outbound path in its body — every internal link on it came from
            the nav and the footer, so it accumulated authority and passed none
            of it on. The two links below go where someone who has just decided
            they trust the person actually wants to go next. */}
        <section className="py-16 border-t border-border/40 bg-surface-alt">
          <div className="container mx-auto px-6 max-w-3xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">See what I can build for you</h2>
            <p className="text-muted-foreground leading-relaxed mb-7">
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
            <Link
              to="/contact"
              className="inline-flex items-center rounded-2xl bg-primary px-7 py-3 font-bold text-primary-foreground shadow-glow-sm hover:opacity-90 transition-opacity"
            >
              Tell me about your project
            </Link>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default About;
