import { Check, Clock, Coins, MessagesSquare, ShieldCheck } from "lucide-react";
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
import { CYPRUS_EUR_FROM, SERVICE_PACKAGES } from "@/lib/site.config.mjs";
import { mkNailsBeauty } from "@/data/case-studies/mk-nails-beauty";
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
const marketingPackage = SERVICE_PACKAGES.find((service) => service.id === "landing")!;

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
        name: "Web Design & Development Services for Cyprus Businesses",
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
          title="Web Design & Development for"
          highlight="Cyprus Businesses"
          description="Fixed-price web design and custom web applications for Cyprus businesses, with EUR or USD invoicing, real-time working overlap, and a live Cyprus project you can verify."
          breadcrumbs={[{ label: "Cyprus" }]}
          cta={{
            label: "Request a fixed-price quote",
            to: "/contact",
            note: "Work directly with your developer. Scope agreed before work starts.",
          }}
          footnote="Working remotely from Pakistan, with a 2–3 hour time difference from Cyprus."
        />
        <section aria-labelledby="cyprus-offer" className="py-12 md:py-16 border-b border-border/40">
          <div className="container mx-auto px-6 grid lg:grid-cols-2 gap-10 lg:gap-14 items-start">
            <div>
              <p className="text-sm font-semibold text-primary mb-3">A website for your Cyprus business</p>
              <h2 id="cyprus-offer" className="text-2xl md:text-3xl font-bold mb-4">
                What your starting price includes
              </h2>
              <p className="text-foreground font-semibold mb-2">
                Marketing websites from approximately €{CYPRUS_EUR_FROM}{" "}
                <span className="text-muted-foreground font-normal">(USD ${marketingPackage.priceFrom.toLocaleString("en-US")})</span>
              </p>
              <p className="text-sm text-muted-foreground leading-relaxed mb-6">
                Typical build: {marketingPackage.timeline}, once your content and scope are ready.
                The EUR figure is indicative; your written quote confirms the currency and total.
              </p>
              <ul className="space-y-3 mb-6">
                {marketingPackage.includes.map((item) => (
                  <li key={item} className="flex items-start gap-3 text-sm">
                    <Check aria-hidden="true" className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                You supply the copy and images. Translation, extra languages, online payments,
                booking-system integrations and ongoing maintenance are scoped separately.
                SEO foundations cover the build; ongoing SEO is a separate service.
              </p>
              <Link to="/blogs/website-cost-cyprus-2026" className="text-primary font-semibold hover:underline underline-offset-4">
                See the full Cyprus website cost guide →
              </Link>
            </div>
            <figure className="rounded-2xl border border-border/50 bg-card overflow-hidden shadow-card">
              <Link to="/projects/mk-nails-beauty" className="block">
                <img
                  src={mkNailsBeauty.image}
                  alt={mkNailsBeauty.imageAlt}
                  width={1559}
                  height={864}
                  loading="eager"
                  decoding="async"
                  className="w-full h-auto"
                />
              </Link>
              <figcaption className="p-6">
                <h2 className="text-xl font-bold mb-3">Salon website design: MK Nails &amp; Beauty</h2>
                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                  A live website for a salon with branches in Larnaca and Nicosia.
                  Visitors can explore treatments and choose the booking link for their branch.
                </p>
                <Link to="/projects/mk-nails-beauty" className="text-primary font-semibold hover:underline underline-offset-4">
                  See the project and screenshots →
                </Link>
              </figcaption>
            </figure>
          </div>
        </section>
        <LocationHighlights
          countryName="Cyprus"
          valueProps={valueProps}
          industries={industries}
          faqs={faqs}
        >
          <CitiesServed
            heading={cyGeo.heading}
            intro={cyGeo.intro}
            cities={cyGeo.cities}
            // Nicosia and Limassol have their own pages, so they link rather
            // than sitting as plain text. Larnaca and the rest stay plain
            // until each has genuine per-city content — near identical city
            // pages are a doorway-page risk.
            cityLinks={{
              Nicosia: "/web-developer-nicosia",
              Limassol: "/web-design-limassol",
            }}
            note={cyGeo.note}
          />
        </LocationHighlights>
        {/* Keep the full service set visible here; the maintenance card carries
            its own clearly labelled NZD pricing so it cannot be mistaken for
            the EUR/USD project pricing below. */}
        <ServicesSection compactHeader />
        <Pricing
          showMaintenance={false}
          marketContext={
            <>
              <h3 className="text-lg font-bold mb-2">How this compares in the Cyprus market</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Cyprus web design studios typically quote{" "}
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

        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default WebDevelopmentCyprus;
