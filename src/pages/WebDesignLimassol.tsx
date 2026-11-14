import { Link } from "react-router-dom";
import { Coins, Smartphone, Zap } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { Services as ServicesSection } from "@/components/Services";
import { Pricing } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";
import { CTA } from "@/components/CTA";
import { Footer } from "@/components/Footer";
import { cityArea } from "@/data/geoPageData";
import { useSEO } from "@/hooks/use-seo";
import {
  breadcrumbNodeFor,
  canonicalPath,
  faqNodeFor,
  pageGraph,
  routeMeta,
} from "@/lib/seo";
// FAQs live in site.config.mjs so the prerenderer emits FAQPage schema into the
// static HTML; importing them here keeps the visible accordion identical to the
// markup, which Google requires.
import { CYPRUS_EUR_FROM, LIMASSOL_FAQS as faqs } from "@/lib/site.config.mjs";

const meta = routeMeta("/web-design-limassol")!;

/**
 * What a Limassol buyer is actually comparing on.
 *
 * Same template as /web-developer-nicosia, different substance: that page leads
 * with a Nicosia client, which this one cannot honestly do. So the three claims
 * here are about the product — phone-first, fast, fixed price — rather than
 * about being nearby.
 */
const whatYouGet = [
  {
    icon: Smartphone,
    title: "Designed for the phone first",
    description:
      "Someone choosing a restaurant on the seafront or a clinic near the marina is on a phone. The layout starts there and widens for desktop, so the call, WhatsApp and booking buttons sit where a thumb reaches.",
  },
  {
    icon: Zap,
    title: "Fast on mobile data",
    description:
      "No page builder and no stack of plugins. Pages are built to load quickly on an ordinary mobile connection, because a visitor who waits is a visitor who goes back to the search results.",
  },
  {
    icon: Coins,
    title: "One fixed price, in writing",
    description:
      "The full cost is agreed before any work starts — no hourly meter, no surprise invoice — and the domain, hosting and code are in your name from day one.",
  },
];

const WebDesignLimassol = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    canonical: canonicalPath("/web-design-limassol"),
    structuredData: pageGraph("/web-design-limassol", [
      // Service scoped to one city, NOT LocalBusiness: there is no Limassol
      // address and claiming one would be false. name, description and
      // areaServed mirror the node pageSchema() builds in entry-server.tsx, so
      // the prerendered graph and the one hydration emits can't drift apart.
      {
        "@type": "Service",
        "@id": `${canonicalPath("/web-design-limassol")}#service`,
        name: "Web Design for Limassol Businesses",
        description:
          "Remote web design and development for businesses in Limassol, Cyprus — fixed-price, delivered by WebDevStudio.",
        url: canonicalPath("/web-design-limassol"),
        serviceType: "Web Development",
        provider: { "@id": `${canonicalPath("/")}#organization` },
        areaServed: cityArea("Limassol", "Cyprus"),
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: canonicalPath("/contact"),
          availableLanguage: { "@type": "Language", name: "English" },
        },
      },
      faqNodeFor(faqs),
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Cyprus", path: "/web-development-cyprus" },
        { name: "Limassol", path: "/web-design-limassol" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Web Design in Limassol —"
          highlight="Fixed-Price Websites"
          description={`Mobile-first websites for Limassol businesses, from €${CYPRUS_EUR_FROM} at a price fixed in writing before work starts, and live in 2–3 weeks.`}
          breadcrumbs={[
            { label: "Cyprus", href: "/web-development-cyprus" },
            { label: "Limassol" },
          ]}
          cta={{
            label: "Book a free 30-min call",
            to: "/contact",
            note: "Fixed price agreed before any work starts",
          }}
          footnote={
            <>
              Looking for the whole island? See{" "}
              <Link
                to="/web-development-cyprus"
                className="text-primary hover:underline font-medium"
              >
                web design and development for Cyprus
              </Link>
              , or{" "}
              <Link
                to="/web-developer-nicosia"
                className="text-primary hover:underline font-medium"
              >
                web design in Nicosia
              </Link>
              .
            </>
          }
        />

        {/* Proof, framed as what it is. MK Nails & Beauty is in Larnaca and
            Nicosia, not Limassol — so this section says "Cyprus", and says
            plainly that there is no Limassol client yet. */}
        <section className="py-16 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary mb-3">
              Cyprus proof
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              A Cyprus website you can check on your phone
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              I haven&apos;t built for a Limassol business yet, so I won&apos;t
              show you a mockup and call it one. What I can show is MK Nails
              &amp; Beauty, a salon with branches in Larnaca and Nicosia, whose
              site is live and public.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              It was built mobile-first for the same kind of customer most
              Limassol businesses have: someone on a phone, comparing two or
              three options, who decides in about a minute. Open it on yours
              and see how quickly you can find a service and get in touch.
            </p>

            <div className="flex flex-wrap gap-x-6 gap-y-3 text-sm">
              <a
                href="https://mknailsnbeauty.com"
                target="_blank"
                rel="noopener"
                className="font-semibold text-primary hover:underline underline-offset-4"
              >
                Open the live site →
              </a>
              <Link
                to="/projects/mk-nails-beauty"
                className="font-semibold text-primary hover:underline underline-offset-4"
              >
                Read the MK Nails &amp; Beauty case study →
              </Link>
            </div>
          </div>
        </section>

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              What Limassol web design needs to get right
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Limassol is the most international city on the island. A single
              street can hold a shipping office, a forex firm, a dental clinic
              and a beach bar, and their customers arrive by different routes:
              a referral checking you are real, a tourist searching from a
              hotel, a resident comparing reviews.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-10">
              What they share is the device. The site has to make sense on a
              phone in the first few seconds, say what you do and where you
              are, and offer one obvious way to contact you. That is the brief
              I build to, and it is most of what separates a website that
              brings enquiries from one that only exists.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {whatYouGet.map((item) => (
                <div
                  key={item.title}
                  className="rounded-2xl border border-border/50 bg-card p-6 shadow-card"
                >
                  <div className="inline-flex p-3 rounded-xl bg-primary/10 text-primary mb-4">
                    <item.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The Limassol version of the language question: here it is usually
            English first, with Russian a live option — a different default
            from Nicosia, where the choice is mostly English or Greek. */}
        <section className="py-16 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              English, Greek or Russian: pick before you ask for a quote
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              In Limassol the usual starting point is English, because so many
              customers are foreign residents, international companies or
              visitors. Add Greek when Cypriot households are a real part of
              your trade. Add Russian when enquiries already reach you in it,
              not because a competitor&apos;s site has a flag in the corner.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              The reason to settle it early is cost. Every extra language is a
              full second set of pages, each with its own address so Google can
              index it, and every later change has to be made in each one. Two
              languages you maintain beat three you let go stale.
            </p>
            <Link
              to="/blogs/cyprus-multilingual-website"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              Do Cyprus businesses need two languages? →
            </Link>
          </div>
        </section>

        <ServicesSection compactHeader showMaintenance={false} />

        <Pricing
          showMaintenance={false}
          marketContext={
            <>
              <h3 className="text-lg font-bold mb-2">
                How this compares with Limassol studios
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Published Cyprus prices put a business website at{" "}
                <strong className="text-foreground">€1,500–€3,000</strong>, and
                eCommerce from €3,500. A marketing site here starts at roughly{" "}
                <strong className="text-foreground">€{CYPRUS_EUR_FROM}</strong>{" "}
                (invoiced in EUR, or as USD $900), and the figure in the quote
                is the figure you pay.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                The price is lower because there is no office or account
                manager to fund, and because you bring the text and photos. If
                you want branding, a photo shoot and Greek copywriting in one
                package, that is studio work and worth paying a studio for.
              </p>
              <Link
                to="/blogs/website-cost-limassol-nicosia"
                className="text-primary hover:underline font-medium text-sm"
              >
                Website cost in Cyprus: real prices by city →
              </Link>
            </>
          }
        />

        <FAQ items={faqs} title="Web design in Limassol — common questions" />

        <section className="py-16">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">
              When to hire a Limassol studio instead
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              Hire locally if you want to meet in person, need a brand identity
              designed from nothing, or need marketing copy written in Greek or
              Russian by a native speaker. I work remotely and in English, and
              I build the website itself: fast, clear on a phone, at a fixed
              price, and owned by you. If that is the part you need, a 30-minute
              call is enough to scope it.
            </p>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default WebDesignLimassol;
