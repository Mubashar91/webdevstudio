import { Navigation } from "@/components/Navigation";
import { About as AboutSection } from "@/components/About";
import { Stats } from "@/components/Stats";
import { Skills } from "@/components/Skills";
import { TechStack } from "@/components/TechStack";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbSchema, canonicalPath } from "@/lib/seo";

const About = () => {
  useSEO({
    title: "About WebDevStudio | Muhammad Mubashar Shahzad, Frontend Developer",
    description:
      "WebDevStudio is led by Muhammad Mubashar Shahzad — Frontend Developer from Pakistan with 5+ years experience in React.js, TypeScript, Node.js & MERN stack. BIT graduate, worked at Codewire Solution & Solvefy.",
    keywords:
      "about WebDevStudio, Muhammad Mubashar Shahzad, frontend developer Pakistan, React developer experience, MERN stack developer, Codewire Solution, Solvefy developer",
    canonical: canonicalPath("/about"),
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "AboutPage",
        name: "About Muhammad Mubashar Shahzad",
        description:
          "Professional background, work experience, education and skills of Muhammad Mubashar Shahzad, Frontend Developer.",
        url: canonicalPath("/about"),
        mainEntity: {
          "@type": "Person",
          name: "Muhammad Mubashar Shahzad",
          jobTitle: "Frontend Developer",
          alumniOf: {
            "@type": "CollegeOrUniversity",
            name: "University of Education, Lahore",
          },
          worksFor: {
            "@type": "Organization",
            name: "Codewire Solution",
          },
        },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "About", path: "/about" },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <AboutSection />
        <Stats />
        <Skills />
        <TechStack />
      </main>
      <Footer />
    </div>
  );
};

export default About;
