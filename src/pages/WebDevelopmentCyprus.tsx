import { Clock, Coins, MessagesSquare, ShieldCheck } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { LocationHighlights } from "@/components/LocationHighlights";
import { Services as ServicesSection } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/Pricing";
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
import { CYPRUS_FAQS as faqs } from "@/lib/site.config.mjs";


const valueProps = [
  {
    icon: Clock,
    title: "Real Working-Hours Overlap",
    description:
      "A 2–3 hour time zone gap means genuine live collaboration each day — not just async hand-offs.",
  },
  {
    icon: Coins,
    title: "Transparent EUR/USD Pricing",
    description:
      "Fixed-price or hourly quotes without the overhead of a local EU agency — senior-level React/MERN craftsmanship at a fair rate.",
  },
  {
    icon: MessagesSquare,
    title: "Clear English Communication",
    description:
      "Daily written updates and scheduled calls in the shared afternoon window, so nothing gets lost in translation.",
  },
  {
    icon: ShieldCheck,
    title: "GDPR-Conscious Development",
    description:
      "Security and data-protection best practices built in from the start, aligned to EU compliance expectations.",
  },
];

const industries = ["Fintech & Forex", "iGaming & Betting Platforms", "Shipping & Logistics", "E-commerce", "Professional Services"];

const meta = routeMeta("/web-development-cyprus")!;

const WebDevelopmentCyprus = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords,
    canonical: canonicalPath("/web-development-cyprus"),
    structuredData: pageGraph("/web-development-cyprus", [
      // A Service node scoped to this country, linked to the site-wide
      // Organization by @id rather than repeating a detached copy of it.
      {
        "@type": "Service",
        "@id": `${canonicalPath("/web-development-cyprus")}#service`,
        name: "Web Development Services for Cyprus Businesses",
        description:
          "Remote React.js, MERN stack, and full-stack web development for businesses in Cyprus, delivered by WebDevStudio.",
        url: canonicalPath("/web-development-cyprus"),
        serviceType: "Web Development",
        provider: { "@id": `${canonicalPath("/")}#organization` },
        areaServed: [
          { "@type": "Country", name: "Cyprus" },
          { "@type": "City", name: "Limassol" },
          { "@type": "City", name: "Nicosia" },
          { "@type": "City", name: "Larnaca" },
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
        { name: "Web Development Cyprus", path: "/web-development-cyprus" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Web Development for"
          highlight="Cyprus"
          description="Remote React.js & MERN stack development for Cyprus businesses — senior-level execution, real-time working overlap, and EUR/USD pricing."
          breadcrumbs={[{ label: "Web Development Cyprus" }]}
        />
        <LocationHighlights
          countryName="Cyprus"
          valueProps={valueProps}
          industries={industries}
          faqs={faqs}
        />
        <ServicesSection compactHeader />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default WebDevelopmentCyprus;
