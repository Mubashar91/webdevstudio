import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { Services as ServicesSection } from "@/components/Services";
import { Process } from "@/components/Process";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";
import { breadcrumbSchema, canonicalPath } from "@/lib/seo";

const Services = () => {
  useSEO({
    title: "Services | WebDevStudio — Web Development Services",
    description:
      "Professional web development services by WebDevStudio: Full-stack MERN development, React.js apps, Node.js backends, responsive design, performance optimization & UI/UX implementation. Serving clients worldwide, including New Zealand and Cyprus.",
    keywords:
      "web development services, React.js development, MERN stack development, Node.js backend, responsive design, performance optimization, freelance web developer Pakistan, web developer New Zealand, web developer Cyprus",
    canonical: canonicalPath("/services"),
    structuredData: [
      {
        "@context": "https://schema.org",
        "@type": "Service",
        name: "Web Development Services by WebDevStudio",
        description:
          "Full-stack web development services including React.js, MERN stack, Node.js, and responsive design.",
        url: canonicalPath("/services"),
        provider: {
          "@type": "Organization",
          name: "WebDevStudio",
        },
        areaServed: [
          { "@type": "Country", name: "New Zealand" },
          { "@type": "Country", name: "Cyprus" },
          "Worldwide",
        ],
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Web Development Services",
          itemListElement: [
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Full-Stack MERN Development" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "React.js Development" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Node.js Backend Development" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Responsive Web Design" } },
            { "@type": "Offer", itemOffered: { "@type": "Service", name: "Performance Optimization" } },
          ],
        },
      },
      breadcrumbSchema([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
    ],
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Web Development"
          highlight="Services"
          description="End-to-end development from React frontends to scalable Node.js backends — built for performance, accessibility, and growth."
          breadcrumbs={[{ label: "Services" }]}
        />
        <p className="text-center text-sm text-muted-foreground -mt-2 mb-2 px-6">
          Serving clients worldwide, including{" "}
          <Link to="/web-development-new-zealand" className="text-primary hover:underline font-medium">
            New Zealand
          </Link>{" "}
          and{" "}
          <Link to="/web-development-cyprus" className="text-primary hover:underline font-medium">
            Cyprus
          </Link>
          .
        </p>
        <ServicesSection compactHeader />
        <Process />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
