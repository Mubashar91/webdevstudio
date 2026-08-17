import { Link } from "react-router-dom";
import { Coins, MessagesSquare, ShieldCheck, Code2 } from "lucide-react";
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
import { AUCKLAND_FAQS as faqs } from "@/lib/site.config.mjs";

const meta = routeMeta("/web-developer-auckland")!;

// The three claims the honest-remote pitch actually rests on. Deliberately not
// "local" anything — the page never asserts Auckland presence, because a lead
// who asks to meet and finds there's no office is a lead and a reputation lost
// at once.
const whyRemote = [
  {
    icon: Coins,
    title: "No Auckland agency overhead",
    description:
      "Auckland agencies quote NZ$15,000–$30,000+ for work a lower-overhead developer delivers for a fraction of it. You're not paying for a Ponsonby office and a layer of account managers between you and the person building the thing.",
  },
  {
    icon: MessagesSquare,
    title: "You brief the person who builds it",
    description:
      "No junior behind a salesperson. The developer you talk to is the developer writing the code, so nothing gets lost being relayed through a middle layer.",
  },
  {
    icon: ShieldCheck,
    title: "Fixed price, and you own everything",
    description:
      "The full cost is agreed before any work starts — no hourly meter, no surprise invoice — and the code, domain and hosting are in your name from day one.",
  },
];

const WebDeveloperAuckland = () => {
  useSEO({
    title: meta.title,
    description: meta.description
    canonical: canonicalPath("/web-developer-auckland"),
    structuredData: pageGraph("/web-developer-auckland", [
      // City-scoped Service, linked to the site-wide Organization by @id.
      // areaServed comes from cityArea() — the same builder the prerenderer
      // uses in entry-server.tsx — so the node crawlers read and the node
      // hydration emits are identical.
      {
        "@type": "Service",
        "@id": `${canonicalPath("/web-developer-auckland")}#service`,
        name: "Web Developer for Auckland Businesses",
        description:
          "Remote React and MERN web development for businesses in Auckland, New Zealand — fixed-price, delivered by WebDevStudio.",
        url: canonicalPath("/web-developer-auckland"),
        serviceType: "Web Development",
        provider: { "@id": `${canonicalPath("/")}#organization` },
        areaServed: cityArea("Auckland", "New Zealand"),
        availableChannel: {
          "@type": "ServiceChannel",
          serviceUrl: canonicalPath("/contact"),
          availableLanguage: { "@type": "Language", name: "English" },
        },
      },
      faqNodeFor(faqs),
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Auckland", path: "/web-developer-auckland" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Web Developer for"
          highlight="Auckland"
          description="Custom websites and web apps for Auckland businesses — built fast, priced up front, and delivered remotely without agency overhead."
          breadcrumbs={[{ label: "Auckland" }]}
          cta={{
            label: "Get a free quote",
            to: "/contact",
            note: "Fixed price agreed before any work starts",
          }}
          footnote={
            <>
              Prefer the country-wide picture? See{" "}
              <Link
                to="/web-development-new-zealand"
                className="text-primary hover:underline font-medium"
              >
                web development for New Zealand
              </Link>
              .
            </>
          }
        />

        {/* The honest-remote section. This is the content the country page
            doesn't have, and the reason this page isn't a near-duplicate: it
            answers the objection an Auckland buyer is actually holding, by
            name, instead of pretending to be local. */}
        <section className="py-16 bg-surface-alt">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Working with a remote developer — the fair question first
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The honest question every Auckland business asks is why hire
              someone who isn&apos;t in Auckland. Two real answers: you&apos;re
              not paying for a city-centre office and a management layer on top
              of the person who builds the thing, and you work directly with the
              developer, so nothing gets lost in relay.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-8">
              The trade-off I won&apos;t hide: I&apos;m not down the road for a
              coffee, and Auckland is about seven hours ahead of me. Here&apos;s
              how that actually works — a set call time in your morning for demos
              and planning, everything else documented in writing so progress
              never depends on catching me live, and work handed back overnight
              ready for your next NZ morning. If in-person meetings matter more
              to you than price and direct access, a local developer is the
              right call, and I&apos;ll tell you so.
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

        {/* Proof before pitch: a real build an Auckland reader can open and
            check, rather than a claimed local client the site can't show. */}
        <section className="py-16">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 flex items-center gap-3">
              <Code2 className="h-6 w-6 text-primary" />
              Recent work you can actually check
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The strongest thing a remote developer can offer instead of a
              local address is work you can open and verify. The{" "}
              <Link
                to="/projects/hospital-management-system"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                hospital management system
              </Link>{" "}
              is a role-based platform where reception, doctors and
              administrators work from one patient record, with permissions
              enforced at the API rather than hidden in the interface — the kind
              of build where getting the hard part right is the whole job.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              You can read how it was built, and see the rest, on the{" "}
              <Link
                to="/projects"
                className="text-primary font-semibold hover:underline underline-offset-4"
              >
                projects page
              </Link>
              .
            </p>
          </div>
        </section>

        <ServicesSection compactHeader />

        <Pricing
          marketContext={
            <>
              <h3 className="text-lg font-bold mb-2">
                What this costs against Auckland rates
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                Auckland agencies typically quote{" "}
                <strong className="text-foreground">
                  NZ$15,000–$30,000+
                </strong>{" "}
                for work a lower-overhead provider delivers for{" "}
                <strong className="text-foreground">NZ$4,000–$8,000</strong> —
                the gap is office and account-management overhead, not the
                quality of the build. My quotes are fixed-price and agreed
                before anything starts.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-3">
                The honest trade-off: you supply the copy and photos. If you
                need someone to write your service pages and run your ads too, a
                local studio is a different and better-fitting purchase.
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

        <FAQ items={faqs} title="Auckland web developer — common questions" />

        <CTA />
      </main>
      <Footer />
    </div>
  );
};

export default WebDeveloperAuckland;
