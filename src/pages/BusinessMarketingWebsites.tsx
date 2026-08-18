import { Link } from "react-router-dom";
import { Check } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { PageHeader } from "@/components/PageHeader";
import { FAQ } from "@/components/FAQ";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import {
  breadcrumbNodeFor,
  canonicalPath,
  faqNodeFor,
  pageGraph,
  routeMeta,
} from "@/lib/seo";

const meta = routeMeta("/services/business-marketing-websites")!;

const FAQS = [
  {
    question: "How much does a business website cost?",
    answer:
      "From USD $900 (about NZ$1,500) for up to six pages, fixed price, typically delivered in 2–3 weeks. Most New Zealand providers quote NZ$1,500–$8,000 for equivalent work; the difference is agency overhead and whether copywriting is included.",
  },
  {
    question: "How long does it take?",
    answer:
      "2–3 weeks from kickoff, assuming your content arrives on time. Content is the usual delay, not development.",
  },
  {
    question: "Can I update the site myself afterwards?",
    answer:
      "Text and image changes, yes — I'll show you how at handover. Structural changes and new pages come back to me. If constant self-editing is a priority, say so early; it changes what I'd recommend building.",
  },
  {
    question: "Do I own the website?",
    answer:
      "Yes — code, domain and hosting in your name from day one. You can move to another developer whenever you want, and I'll help with the handover.",
  },
  {
    question: "What if I need more than six pages?",
    answer:
      "Quoted as an add-on at the same rate per page. Tell me the page list on the call and the quote reflects it.",
  },
  {
    question: "Will it rank on Google?",
    answer:
      "The structural work is included — clean URLs, titles, headings, schema, sitemap, fast load. Ranking also depends on content, competition, and time, and anyone promising positions on a timeline is guessing. What I can commit to is that nothing in the build is holding you back.",
  },
  {
    question: "Do you write the content?",
    answer:
      "No. You supply words and images. That's part of why the price is what it is, and it's the honest tradeoff against a full-service studio.",
  },
];

const BusinessMarketingWebsites = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    canonical: canonicalPath("/services/business-marketing-websites"),
    structuredData: pageGraph("/services/business-marketing-websites", [
      faqNodeFor(FAQS),
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Business Websites", path: "/services/business-marketing-websites" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Business & Marketing"
          highlight="Websites"
          description="Fast, credible sites for service businesses — React and TypeScript, under two seconds on mobile, fixed price from USD $900. No CMS bloat, no lock-in."
          breadcrumbs={[
            { label: "Services", href: "/services" },
            { label: "Business Websites" },
          ]}
          cta={{
            label: "Get a fixed quote",
            to: "/contact",
            note: "Free 30-min call · scope agreed upfront",
          }}
        />

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Fast, credible sites for service businesses — built to load in under two seconds on a phone, and to rank for the services you actually sell.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most small business sites lose customers in two places: they're slow on mobile, and they don't say clearly enough what the business does for someone to act. Everything here aims at those two things.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              Who this is for
            </h2>
            <ul className="space-y-4 mb-12">
              {[
                "Service businesses that need to be found and trusted — trades, clinics, consultants, studios",
                "Businesses replacing a site that's slow, dated, or that you can't edit",
                "Anyone who's been quoted for a 'custom build' and wants to know what they're actually buying",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              Who this isn't for
            </h2>
            <ul className="space-y-4">
              {[
                "You need an online store — different structure, different price",
                "Users need to log in and do things — that's an application",
                "You want to edit every page daily — these are fast because they're not carrying a heavy CMS",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-1 flex items-center justify-center">−</div>
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              What you get
            </h2>
            <ul className="space-y-4">
              {[
                "Up to 6 responsive pages, structured around what customers are actually trying to do",
                "React and TypeScript — no page builder, no plugin stack, nothing loading that isn't needed",
                "Core Web Vitals green, measured on a real mobile connection — under two seconds to load",
                "SEO foundations and schema — clean URLs, titles, descriptions, heading structure, sitemap",
                "Contact form with lead routing that actually delivers, tested before launch",
                "Two rounds of revisions — one batch of consolidated feedback each",
                "You own everything — code, domain, hosting, in your name from day one",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
              What it costs
            </h2>
            <p className="text-lg font-bold mb-4">
              From <span className="text-primary">USD $900</span> — about <span className="text-primary">NZ$1,500</span> / <span className="text-primary">€800</span>
            </p>
            <p className="text-muted-foreground mb-6">
              Fixed price, agreed in writing before anything starts. Typical delivery <strong>2–3 weeks</strong> once content is ready.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Most New Zealand providers quote <strong>NZ$1,500–$8,000</strong> for a small business site. Mine sits at the bottom of that band, and the reason is structural: no agency overhead, no project manager, no account manager. You're paying for the build, not the layer above it.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The exchange: you supply your own copy and photos. I don't write your service pages or run your ads. If you need that, a local studio at NZ$5,000 is genuinely different and better-fitting.
            </p>
            <p className="text-sm text-muted-foreground italic">
              Not included: copywriting · photography · logo and brand design · ongoing SEO or content · paid ads. Hosting and domain are yours directly, at cost, in your name.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              How it works
            </h2>
            <ol className="space-y-6">
              {[
                { step: "1", title: "Free 30-minute call", desc: "What the business does, who you need to reach, what the site must achieve." },
                { step: "2", title: "Fixed written quote", desc: "Scope, timeline, price, and exclusions." },
                { step: "3", title: "You send content", desc: "Words and images. This step decides the timeline; everything else is on me." },
                { step: "4", title: "Build", desc: "With a link to follow progress." },
                { step: "5", title: "Launch and handover", desc: "Everything in your name, plus 30 days of post-launch fixes." },
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                    {step}
                  </span>
                  <div>
                    <h3 className="font-bold mb-1">{title}</h3>
                    <p className="text-muted-foreground">{desc}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              Why work with me
            </h2>
            <ul className="space-y-3 mb-8">
              {[
                "You talk to the developer — the person you brief is the person who builds it",
                "Fixed price, agreed upfront — no hourly meter, no surprise invoice",
                "Fast by construction, not by optimisation afterwards — built without the weight that makes sites slow",
                "Almost nothing to maintain — no plugin stack means no monthly patching treadmill",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-6 rounded-xl bg-muted/40 border border-border/50">
              <p className="font-semibold mb-2">The tradeoff, plainly:</p>
              <p className="text-muted-foreground leading-relaxed">
                I work remotely from Pakistan with clients in New Zealand and Cyprus. That's why the price is what it is. It also means I'm not down the road for a coffee and there's a timezone gap — I keep a fixed overlap window each working day and everything's documented in writing. If in-person matters more to you than price and direct access, hire locally. That's a real answer.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
              When you don't need me
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Fewer than five pages, no bookings or payments, comfortable editing text yourself? A well-configured site builder will serve you for a fraction of this, and I'd tell you that on the call rather than after the invoice.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Custom earns its cost when you need speed, want to own the code outright, are being outranked by faster competitors, or have outgrown a template that's now fighting you.
            </p>
          </div>
        </section>

        <FAQ items={FAQS} title="Questions before we start" />

        {/* Proof: a real business website anyone can open and check */}
        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">
              Proof: a real small business site you can verify
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-6">
              MK Nails & Beauty is a two-branch salon in Larnaca and Nicosia that needed to move beyond Instagram-only discovery. The site is live, public, and live at{" "}
              <a href="https://mknailsnbeauty.com" className="text-primary font-semibold hover:underline">
                mknailsnbeauty.com
              </a>{" "}
              — you can open it right now and check the work. Fast on mobile, easy to book from, and getting found for local searches like "laser hair removal Nicosia."
            </p>
            <Link
              to="/projects/mk-nails-beauty"
              className="inline-flex items-center gap-2 text-primary font-semibold hover:underline underline-offset-4"
            >
              Read the full case study →
            </Link>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              Improve performance after launch
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Once the site is live, you may want to optimize speed or keep it updated over time.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/services/performance-core-web-vitals" className="p-4 rounded-lg border border-border/50 hover:border-primary/35 transition-colors group">
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">Speed & Core Web Vitals</h3>
                <p className="text-sm text-muted-foreground">Optimize LCP, INP and CLS on a live site</p>
              </Link>
              <Link to="/services/website-maintenance" className="p-4 rounded-lg border border-border/50 hover:border-primary/35 transition-colors group">
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">Maintenance & Support</h3>
                <p className="text-sm text-muted-foreground">Monthly updates, backups and monitoring</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-surface-alt border-t border-border/40">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-5 tracking-tight">
              Get a fixed quote
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Tell me what your business does and what the site needs to achieve. You'll get a fixed price and timeline before anything starts.
            </p>
            <Button asChild size="lg" className="h-12 px-10 rounded-2xl font-bold">
              <Link to="/contact">Get a fixed quote</Link>
            </Button>
            <div className="mt-8 pt-8 border-t border-border/40">
              <p className="text-sm text-muted-foreground">
                <Link to="/projects" className="text-primary hover:underline font-medium">See recent work</Link> · <Link to="/services/website-maintenance" className="text-primary hover:underline font-medium">Maintenance plans</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default BusinessMarketingWebsites;
