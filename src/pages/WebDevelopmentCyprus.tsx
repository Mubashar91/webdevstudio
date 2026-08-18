import { Clock, Coins, MessagesSquare, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { LocationHighlights } from "@/components/LocationHighlights";
import { CitiesServed } from "@/components/CitiesServed";
import { GeoGuides } from "@/components/GeoGuides";
import { buildAreaServed, cyGeo } from "@/data/geoPageData";
import { Services as ServicesSection } from "@/components/Services";
import { Testimonials } from "@/components/Testimonials";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { Pricing } from "@/components/Pricing";
import { CYPRUS_EUR_FROM } from "@/lib/site.config.mjs";
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
        // Same builder the prerenderer uses — see the note on the NZ page.
        areaServed: buildAreaServed(cyGeo),
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
        // below — Google reads a breadcrumb that disagrees with its markup as
        // a mismatch, and hydration replaces the prerendered graph with this
        // one, so a difference here would silently overwrite the correct label.
        { name: "Cyprus", path: "/web-development-cyprus" },
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
          breadcrumbs={[{ label: "Cyprus" }]}
        />
        <LocationHighlights
          aboveFold
          countryName="Cyprus"
          valueProps={valueProps}
          industries={industries}
          faqs={faqs}
        >
          <CitiesServed
            heading={cyGeo.heading}
            intro={cyGeo.intro}
            cities={cyGeo.cities}
            note={cyGeo.note}
          />
        </LocationHighlights>
        {/* Maintenance is NZD-priced and NZ-scoped; this page quotes EUR with
            USD in parentheses and must not carry a third currency. */}
        <ServicesSection compactHeader showMaintenance={false} />
        <Pricing
          showMaintenance={false}
          marketContext={
            <>
              <h3 className="text-lg font-bold mb-2">How this compares in the Cyprus market</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Cyprus studios typically quote{" "}
                <strong className="text-foreground">€1,500–€3,000</strong> for a business
                site, with eCommerce from €3,500. A marketing site here starts at
                roughly €{CYPRUS_EUR_FROM} (invoiced as USD $900) — quoted in EUR if you
                prefer, fixed before work starts.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Two Cyprus-specific things these numbers don't cover. <strong className="text-foreground">Multilingual</strong> is
                the real multiplier: EN / GR / RU is three versions of every page, each
                needing its own structure and <code className="text-xs">hreflang</code>, not a
                translation widget. And as an EU member state, <strong className="text-foreground">GDPR</strong> thinking
                is cheaper built in at the start than retrofitted.
              </p>
              <Link
                to="/blogs/website-cost-cyprus-2026"
                className="text-primary hover:underline font-medium text-sm"
              >
                Full Cyprus pricing breakdown, including multilingual →
              </Link>
            </>
          }
        />
        <GeoGuides
          heading="Pricing and hiring guides for Cyprus businesses"
          intro="Written with EUR figures sourced from published Cyprus price guides, including what a second language adds to a build."
          // Cyprus-specific posts first — the geo page is the hub for that
          // cluster, so the four EUR posts lead and the general guides follow.
          slugs={[
            "website-cost-cyprus-2026",
            "web-developer-cyprus-what-to-look-for",
            "cyprus-multilingual-website",
            "website-cost-limassol-nicosia",
            "hiring-remote-developer-cyprus",
            "how-to-compare-web-developer-quotes",
            "what-should-be-in-web-development-quote",
            "cost-to-hire-web-developer-2026",
          ]}
        />

        {/* Case study: proof that this works for Cyprus businesses */}
        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Built for a Cyprus business
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              MK Nails &amp; Beauty is a nails and beauty salon with branches in Larnaca and Nicosia. The site is live and public, so this is a Cyprus build you can open and check rather than take on trust.
            </p>
            <Link
              to="/projects/mk-nails-beauty"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4"
            >
              See the case study →
            </Link>
            <p className="text-sm text-muted-foreground mt-6">
              This is the first case study on the portfolio where the proof is one click away — anyone can open the live site and verify the work.
            </p>
          </div>
        </section>

        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default WebDevelopmentCyprus;
