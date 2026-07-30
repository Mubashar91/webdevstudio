import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { Services as ServicesSection } from "@/components/Services";
import { Process } from "@/components/Process";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Link } from "react-router-dom";
import { useSEO } from "@/hooks/use-seo";
import {
  breadcrumbNodeFor,
  canonicalPath,
  faqNodeFor,
  pageGraph,
  routeMeta,
} from "@/lib/seo";
import { SERVICES_FAQS } from "@/lib/site.config.mjs";

const meta = routeMeta("/services")!;

const Services = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    canonical: canonicalPath("/services"),
    // The Organization node already carries the full OfferCatalog with real
    // prices, so this page adds only its breadcrumb rather than restating a
    // second, price-less Service node that competed with it.
    structuredData: pageGraph("/services", [
      faqNodeFor(SERVICES_FAQS),
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
      ]),
    ]),
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
          footnote={
            <>
              Serving clients worldwide, including{" "}
              <Link
                to="/web-development-new-zealand"
                className="text-primary hover:underline font-medium"
              >
                New Zealand
              </Link>{" "}
              and{" "}
              <Link
                to="/web-development-cyprus"
                className="text-primary hover:underline font-medium"
              >
                Cyprus
              </Link>
              .
            </>
          }
        />
        <ServicesSection compactHeader />
        <Pricing />
        <Process />
        <Testimonials />
        <FAQ
          items={SERVICES_FAQS}
          title="Questions before we start"
        />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default Services;
