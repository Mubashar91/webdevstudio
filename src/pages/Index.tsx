import { Navigation } from "@/components/Navigation";
import { Hero } from "@/components/Hero";
import { Stats } from "@/components/Stats";
import { Projects } from "@/components/Projects";
import { Blogs } from "@/components/Blogs";
import { TechStack } from "@/components/TechStack";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { canonicalPath, SITE_URL } from "@/lib/seo";

const Index = () => {
  useSEO({
    title: "WebDevStudio | Frontend Developer & MERN Stack Expert",
    description:
      "WebDevStudio — 5+ years experience building high-performance React.js, TypeScript & MERN stack applications. 50+ projects delivered. Remote web development for New Zealand, Cyprus & clients worldwide.",
    keywords:
      "WebDevStudio, frontend developer, React developer, MERN stack, TypeScript, Node.js, web developer Pakistan, web developer New Zealand, web developer Cyprus, freelance developer",
    canonical: canonicalPath("/"),
    structuredData: {
      "@context": "https://schema.org",
      "@type": "ProfilePage",
      "mainEntity": {
        "@type": "Organization",
        "name": "WebDevStudio",
        "url": SITE_URL,
        "founder": {
          "@type": "Person",
          "name": "Muhammad Mubashar Shahzad",
        },
        "sameAs": [
          "https://github.com/mubasharshahzad",
          "https://linkedin.com/in/mubasharshahzad",
        ],
      },
    },
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content">
        <Hero />
        <Stats />
        <Projects />
        <Blogs />
        <TechStack />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
