import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { Contact as ContactSection } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbNodeFor, canonicalPath, pageGraph, routeMeta } from "@/lib/seo";

const meta = routeMeta("/contact")!;

const Contact = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    canonical: canonicalPath("/contact"),
    structuredData: pageGraph("/contact", [
      {
        "@type": "ContactPage",
        "@id": `${canonicalPath("/contact")}#contactpage`,
        name: "Contact WebDevStudio",
        description:
          "Contact page for hiring WebDevStudio for web development projects.",
        url: canonicalPath("/contact"),
        // References the site-wide Organization rather than declaring a
        // second, thinner copy of it with a different set of properties.
        mainEntity: { "@id": `${canonicalPath("/")}#organization` },
      },
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Get in"
          highlight="Touch"
          description="Have a project in mind? Send a message — I typically respond within 24 hours."
          breadcrumbs={[{ label: "Contact" }]}
        />
        <ContactSection compactHeader />
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
