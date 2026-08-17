import { Clock, Coins, MessagesSquare, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { LocationHighlights } from "@/components/LocationHighlights";
import { CitiesServed } from "@/components/CitiesServed";
import { GeoGuides } from "@/components/GeoGuides";
import { buildAreaServed, nzGeo } from "@/data/geoPageData";
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
      // "unlimited revisions within scope" removed — see the note in CTA.tsx.
      // Three different revision promises across two pages is worse than one
      // modest promise everywhere.
      "NDAs, fixed milestones, and a revision allowance written into the quote — built for teams who need dependable remote execution.",
  },
];

const industries = ["SaaS & Startups", "E-commerce", "Tourism & Hospitality", "Agritech", "Professional Services"];

const meta = routeMeta("/web-development-new-zealand")!;

const WebDevelopmentNewZealand = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
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
        // Same builder the prerenderer uses. Hydration replaces the
        // prerendered JSON-LD wholesale, so a hardcoded list here would have
        // silently dropped Hamilton, Tauranga and Dunedin — the cities added
        // precisely because Search Console showed impressions for them.
        areaServed: buildAreaServed(nzGeo),
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: canonicalPath("/contact"),
          availableLanguage: { "@type": "Language", name: "English" },
        },
      },
      faqNodeFor(faqs),
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        // Must match the crumbLabel in site.config.mjs and the visible trail
        // below — see the note on the Cyprus page.
        { name: "New Zealand", path: "/web-development-new-zealand" },
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
          breadcrumbs={[{ label: "New Zealand" }]}
        />
        <LocationHighlights
          aboveFold
          countryName="New Zealand"
          valueProps={valueProps}
          industries={industries}
          faqs={faqs}
        >
          <CitiesServed
            heading={nzGeo.heading}
            intro={nzGeo.intro}
            cities={nzGeo.cities}
            // Auckland has its own landing page and was the site's only
            // orphan — in the sitemap, linked from nowhere. See cityLinks.
            cityLinks={{ Auckland: "/web-developer-auckland" }}
            note={nzGeo.note}
          />
        </LocationHighlights>
        <ServicesSection compactHeader />
        <Pricing
          marketContext={
            <>
              <h3 className="text-lg font-bold mb-2">How this compares in the NZ market</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                New Zealand studios typically quote{" "}
                <strong className="text-foreground">NZ$2,500–$6,000 + GST</strong> for a
                lead-generating small business site, and under NZ$1,000 usually means a
                template with no copywriting. A marketing site here starts at USD $900 —
                roughly NZ$1,500, the bottom of that band rather than below it.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                As an overseas provider I don't charge NZ GST, and I invoice in NZD if you
                prefer. The trade-off is honest: you supply the copy and photos. If you need
                someone to write your service pages and run your ads, a local studio is a
                different and better-fitting purchase.
              </p>
              <Link
                to="/blogs/website-cost-new-zealand-2026"
                className="text-primary hover:underline font-medium text-sm"
              >
                Full NZ pricing breakdown, band by band →
              </Link>
            </>
          }
        />
        <GeoGuides
          heading="Pricing and hiring guides for NZ businesses"
          intro="Written for the New Zealand market, with NZD figures sourced from published price guides rather than estimates."
          slugs={[
            "website-cost-new-zealand-2026",
            "how-to-compare-web-developer-quotes",
            "cost-to-hire-web-developer-2026",
            "website-redesign-cost-new-zealand",
            "annual-website-maintenance-costs-nz",
            "fix-or-rebuild-website",
            "take-over-existing-website-developer",
            "booking-website-cost",
          ]}
        />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default WebDevelopmentNewZealand;
