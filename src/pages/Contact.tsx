import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { Contact as ContactSection } from "@/components/Contact";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbSchema, canonicalPath } from "@/lib/seo";

const Contact = () => {
  useSEO({
    title: "Contact WebDevStudio | Hire a Frontend Developer",
    description:
      "Get in touch with WebDevStudio for web development projects. Available for React.js, MERN stack, and full-stack development for clients in New Zealand, Cyprus, and worldwide. Fast response within 24 hours.",
    keywords:
      "contact WebDevStudio, hire frontend developer, hire React developer, hire web developer New Zealand, hire web developer Cyprus, freelance web developer, MERN stack freelancer, web development inquiry",
    canonical: canonicalPath("/contact"),
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "ContactPage",
        name: "Contact WebDevStudio",
        description:
          "Contact page for hiring WebDevStudio for web development projects.",
        url: canonicalPath("/contact"),
        mainEntity: {
          "@type": "Organization",
          name: "WebDevStudio",
          email: "mmubasharshahzad40@gmail.com",
          telephone: "+923096403160",
        },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Contact", path: "/contact" },
      ]),
    ],
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
