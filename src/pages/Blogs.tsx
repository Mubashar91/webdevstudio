import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { Blogs as BlogsSection } from "@/components/Blogs";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbSchema, canonicalPath } from "@/lib/seo";

const Blogs = () => {
  useSEO({
    title: "Blog | WebDevStudio — React & MERN Development",
    description:
      "Articles on React performance, TypeScript patterns, and MERN stack architecture from WebDevStudio's development work.",
    keywords:
      "React blog, MERN stack tutorials, TypeScript tips, frontend developer blog, web development articles",
    canonical: canonicalPath("/blogs"),
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Blog",
        name: "WebDevStudio — Developer Blog",
        description: "Articles on React, TypeScript, and MERN stack development.",
        url: canonicalPath("/blogs"),
        author: {
          "@type": "Organization",
          name: "WebDevStudio",
        },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Blog", path: "/blogs" },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Developer"
          highlight="Blog"
          description="Practical notes on React, TypeScript, and building scalable MERN applications."
          breadcrumbs={[{ label: "Blog" }]}
        />
        <BlogsSection compactHeader />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Blogs;
