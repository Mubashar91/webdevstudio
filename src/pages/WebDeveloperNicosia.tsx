import { Link } from "react-router-dom";
import { Clock, Coins, MessagesSquare } from "lucide-react";
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
import { CYPRUS_EUR_FROM, NICOSIA_FAQS as faqs } from "@/lib/site.config.mjs";

const meta = routeMeta("/web-developer-nicosia")!;

/**
 * The three claims the honest-remote pitch rests on here.
 *
 * Deliberately not "local" anything — the page never asserts a Nicosia
 * presence, because a lead who asks to meet and finds there's no office is a
 * lead and a reputation lost at once. The timezone claim is the one that is
 * genuinely stronger for Cyprus than for New Zealand, so it leads.
 */
const whyRemote = [
  {
    icon: Clock,
    title: "Real afternoon overlap",
    description:
      "Cyprus runs about 2–3 hours behind me, so demos and planning calls happen live rather than overnight. That is a materially different arrangement from hiring across ten time zones.",
  },
  {
    icon: MessagesSquare,
    title: "You brief the person who builds it",
    description:
      "No junior behind a salesperson. The developer you talk to is the developer writing the code, so nothing is lost being relayed through a middle layer.",
  },
  {
    icon: Coins,
    title: "Fixed price, and you own everything",
    description:
      "The full cost is agreed before any work starts — no hourly meter, no surprise invoice — and the code, domain and hosting are in your name from day one.",
  },
];

const WebDeveloperNicosia = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    canonical: canonicalPath("/web-developer-nicosia"),
    structuredData: pageGraph("/web-developer-nicosia", [
      // ProfessionalService scoped to one city, NOT LocalBusiness: there is no
      // Nicosia address and claiming one would be false. areaServed carries
      // the geography honestly, which is what Google expects from a
      // service-area business. areaServed comes from cityArea() — the same
      // builder entry-server.tsx uses — so the prerendered node and the node
      // hydration emits can't drift apart.
      {
        "@type": "Service",
        "@id": `${canonicalPath("/web-developer-nicosia")}#service`,
        name: "Web Developer for Nicosia Businesses",
        description:
          "Remote React and MERN web development for businesses in Nicosia, Cyprus — fixed-price, delivered by WebDevStudio.",
        url: canonicalPath("/web-developer-nicosia"),
        serviceType: "Web Development",
        provider: { "@id": `${canonicalPath("/")}#organization` },
        areaServed: cityArea("Nicosia", "Cyprus"),
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: canonicalPath("/contact"),
          availableLanguage: { "@type": "Language", name: "English" },
        },
      },
      faqNodeFor(faqs),
      // Nested under Cyprus rather than flat off Home — this page is one level
      // more specific than the country page and the trail should say so.
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Cyprus", path: "/web-development-cyprus" },
        { name: "Nicosia", path: "/web-developer-nicosia" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Web Developer for"
          highlight="Nicosia"
          description="Custom websites and web apps for Nicosia businesses — React and TypeScript, fixed price agreed before work starts, and a real working overlap most afternoons."
          breadcrumbs={[
            { label: "Cyprus", href: "/web-development-cyprus" },
            { label: "Nicosia" },
          ]}
          cta={{
            label: "Get a free quote",
            to: "/contact",
            note: "Fixed price agreed before any work starts",
          }}
          footnote={
            <>
              Prefer the country-wide picture? See{" "}
              <Link
                to="/web-development-cyprus"
                className="text-primary hover:underline font-medium"
              >
                web development for Cyprus
              </Link>
              .
            </>
          }
        />

        {/* Proof first, and it is the reason this page can win where Auckland
            can't: a Nicosia client site anyone can open. No performance or
            ranking figures here — the ones in the original draft of this page
            were invented, and the case study itself now carries nulls until
            the real numbers are measured. A live URL is the claim. */}
        <section className="py-16 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary mb-3">
              Built for a Nicosia business
            </p>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              A Nicosia site you can open right now
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              MK Nails &amp; Beauty runs branches in Nicosia and Larnaca. They
              needed to move past Instagram-only discovery — someone comparing
              three salons on a phone at night wants to see the work, understand
              the services, and get in touch inside about a minute.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The hard part wasn&apos;t technical. A salon has one booking
              system and a long service list, and if every service lives on one
              page, none of them can be found on its own terms. Each service got
              its own page, linked from a clear two-location structure.
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
                Read the full case study →
              </Link>
            </div>

            <p className="mt-8 text-sm text-muted-foreground">
              Most portfolios show mockups. This is a real business you can look
              up, with a site you can open and judge for yourself.
            </p>
          </div>
        </section>

        {/* The objection, answered before it's asked. */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              Why hire someone who isn&apos;t in Nicosia
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              It&apos;s the fair question, so here are the real answers. You
              aren&apos;t paying for an office and a management layer sitting on
              top of the person who builds the thing, and you brief the
              developer directly — nothing gets relayed through an account
              manager and lost on the way.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-10">
              The trade-off, stated plainly: I&apos;m not in Nicosia for a
              coffee. What softens that here more than anywhere else I work is
              the clock — a 2–3 hour gap means genuine live overlap most
              afternoons, so demos and planning happen in real time rather than
              overnight.
            </p>

            <div className="grid sm:grid-cols-3 gap-6">
              {whyRemote.map((item) => (
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

        {/* The Cyprus-specific decision that moves a quote more than the city
            does, and that most quotes leave until it's too late to plan for. */}
        <section className="py-16 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              The language decision, before you get a quote
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              English alone is usually right if you sell to expats,
              international clients, or the professional and financial services
              market. Greek earns its cost when your customers are Cypriot
              consumers. Russian is worth considering depending on who you
              actually serve.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              What a second language is <em>not</em> is a translate widget
              bolted on afterwards. It is a second version of every page, with
              its own structure and its own hreflang, plus an ongoing cost every
              time you change anything. Decide before the build and it&apos;s a
              design constraint. Decide after and it&apos;s a rebuild.
            </p>
            <Link
              to="/blogs/cyprus-multilingual-website"
              className="font-medium text-primary hover:underline underline-offset-4"
            >
              How to decide whether you need two languages →
            </Link>
          </div>
        </section>

        <ServicesSection compactHeader showMaintenance={false} />

        <Pricing
          showMaintenance={false}
          marketContext={
            <>
              <h3 className="text-lg font-bold mb-2">
                How this compares in Nicosia
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Cyprus studios typically quote{" "}
                <strong className="text-foreground">€1,500–€3,000</strong> for a
                business site, with eCommerce from €3,500. A marketing site here
                starts at roughly{" "}
                <strong className="text-foreground">€{CYPRUS_EUR_FROM}</strong>{" "}
                (invoiced as USD $900, or in EUR if you prefer), fixed before
                work starts.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                The city itself barely moves the number — languages, who writes
                the copy, and who you hire move it far more. The honest exchange
                for my price is that you supply your own copy and photos. If you
                need someone to write your Greek service pages and run your ads,
                a local studio is a different and better-fitting purchase.
              </p>
              <Link
                to="/blogs/website-cost-limassol-nicosia"
                className="text-primary hover:underline font-medium text-sm"
              >
                Does the city change a Cyprus website quote? →
              </Link>
            </>
          }
        />

        <FAQ items={faqs} title="Nicosia web developer — common questions" />

        {/* The honesty section. It is the main reason the other geo pages read
            as credible, and it costs nothing to keep saying. */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl font-bold mb-4">
              When a Nicosia studio is the better buy
            </h2>
            <p className="text-muted-foreground leading-relaxed">
              If you need someone to write your Greek copy, shoot your
              photography, run your ads, and sit across a table while you do it,
              that is a different purchase and a local studio does it properly.
              I&apos;d tell you that on the call rather than after the invoice.
              What I do is build the thing, for a price agreed in writing, with
              you owning all of it at the end.
            </p>
          </div>
        </section>

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default WebDeveloperNicosia;
