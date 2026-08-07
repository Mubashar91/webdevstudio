import { Clock, Coins, MessagesSquare, ShieldCheck } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { LocationHighlights } from "@/components/LocationHighlights";
import { CitiesServed } from "@/components/CitiesServed";
import { nzGeo } from "@/data/geoPageData";
import { Services as ServicesSection } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { useSEO } from "@/hooks/use-seo";
import {
  breadcrumbNodeFor,
  canonicalPath,
  faqNodeFor,
  pageGraph,
  routeMeta,
} from "@/lib/seo";
// FAQs live in site.config.mjs so the prerenderer can emit FAQPage schema
// into the static HTML; importing them here keeps the visible Q&A identical
// to the markup, which Google requires.
import { NZ_FAQS as faqs } from "@/lib/site.config.mjs";


const valueProps = [
  {
    icon: Clock,
    title: "Overnight Delivery Workflow",
    description:
      "The time zone gap becomes an advantage — hand off tasks before you log off, review progress the next NZ morning.",
  },
  {
    icon: Coins,
    title: "Transparent, Competitive Rates",
    description:
      "Fixed-price or hourly quotes in USD/NZD, without the overhead of a local NZ agency — same senior-level React/MERN craftsmanship.",
  },
  {
    icon: MessagesSquare,
    title: "Clear English Communication",
    description:
      "Daily written updates, async-friendly reporting, and scheduled calls in your morning so nothing gets lost in translation.",
  },
  {
    icon: ShieldCheck,
    title: "Reliable, Contract-Based Delivery",
    description:
      "NDAs, fixed milestones, and unlimited revisions within scope — built for teams who need dependable remote execution.",
  },
];

const industries = ["SaaS & Startups", "E-commerce", "Tourism & Hospitality", "Agritech", "Professional Services"];

const meta = routeMeta("/web-development-new-zealand")!;

const WebDevelopmentNewZealand = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    canonical: canonicalPath("/web-development-new-zealand"),
    structuredData: pageGraph("/web-development-new-zealand", [
      // Country-scoped Service linked to the site-wide Organization by @id,
      // rather than a detached duplicate of it.
      {
        "@type": "Service",
        "@id": `${canonicalPath("/web-development-new-zealand")}#service`,
        name: "Web Development Services for New Zealand Businesses",
        description:
          "Remote React.js, MERN stack, and full-stack web development for businesses in New Zealand, delivered by WebDevStudio.",
        url: canonicalPath("/web-development-new-zealand"),
        serviceType: "Web Development",
        provider: { "@id": `${canonicalPath("/")}#organization` },
        areaServed: [
          { "@type": "Country", name: "New Zealand" },
          { "@type": "City", name: "Auckland" },
          { "@type": "City", name: "Wellington" },
          { "@type": "City", name: "Christchurch" },
        ],
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: canonicalPath("/contact"),
          availableLanguage: { "@type": "Language", name: "English" },
        },
      },
      faqNodeFor(faqs),
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Web Development New Zealand", path: "/web-development-new-zealand" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Web Development for"
          highlight="New Zealand"
          description="Remote React.js & MERN stack development for New Zealand businesses — senior-level execution, transparent pricing, and a workflow built around your time zone."
          breadcrumbs={[{ label: "Web Development New Zealand" }]}
        />
        <LocationHighlights
          countryName="New Zealand"
          valueProps={valueProps}
          industries={industries}
          faqs={faqs}
        >
          <CitiesServed
            heading={nzGeo.heading}
            intro={nzGeo.intro}
            cities={nzGeo.cities}
            note={nzGeo.note}
          />
        </LocationHighlights>
        <ServicesSection compactHeader />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default WebDevelopmentNewZealand;
