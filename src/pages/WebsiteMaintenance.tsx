import { Link } from "react-router-dom";
import { AlertTriangle, Check, ShieldCheck, X } from "lucide-react";
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
  maintenanceServiceNodeFor,
  pageGraph,
  routeMeta,
} from "@/lib/seo";
import {
  MAINTENANCE_CLIENT_CAP,
  MAINTENANCE_FAQS,
  MAINTENANCE_HOURLY,
  MAINTENANCE_PLANS,
} from "@/lib/site.config.mjs";

const meta = routeMeta("/services/website-maintenance")!;

/** Shared by every tier — stated once rather than repeated in three lists. */
const CORE_INCLUSIONS = [
  "Platform, theme and plugin updates — applied to a staging copy first, never straight to your live site",
  "Off-site backups, daily, retained 30 days, stored somewhere other than your server",
  "A tested restore — I restore one before it's ever needed, not on the day you need it",
  "Uptime monitoring that alerts a person, not a dashboard nobody reads",
  "Security scanning and malware monitoring",
  "SSL renewal and expiry monitoring",
  "A monthly report of what was actually done",
];

/**
 * Stated as plainly as the inclusions.
 *
 * Every competitor page lists what you get and goes quiet on the rest, which
 * is why "I thought that was included" is the usual first argument in a
 * maintenance relationship. Naming the boundary is worth more than another
 * feature bullet.
 */
const EXCLUSIONS = [
  "New features or pages beyond the included hours — quoted separately as small projects",
  "Redesigns",
  "SEO and content writing — that's growth spend, not maintenance",
  "Paid plugin and theme licences — billed to you at cost",
  "Recovery of a site that's already compromised — quoted separately once I've seen the damage",
];

const WebsiteMaintenance = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    canonical: canonicalPath("/services/website-maintenance"),
    structuredData: pageGraph("/services/website-maintenance", [
      maintenanceServiceNodeFor(),
      faqNodeFor(MAINTENANCE_FAQS),
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Website Maintenance", path: "/services/website-maintenance" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Website Maintenance for"
          highlight="NZ Businesses"
          description="Updates, backups, security and monitoring — handled monthly, for a fixed price, with no lock-in."
          breadcrumbs={[
            { label: "Services", href: "/services" },
            { label: "Website Maintenance" },
          ]}
          cta={{
            label: "Get a free health check",
            to: "/contact",
            note: "No charge · No obligation to buy a plan",
          }}
        />

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Most small business websites aren't attacked deliberately. They're
              found by automated scans looking for known, unpatched weaknesses.
              Maintenance is just not being one of the sites that got left
              behind.
            </p>
          </div>
        </section>

        {/* Emergency block, deliberately high on the page.
            Someone searching "my website is sending spam" is not comparing
            plans — they need it to stop. Burying that behind three pricing
            tiers loses the one visitor who isn't price-shopping. */}
        <section className="pb-16 md:pb-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <div className="rounded-2xl border border-amber-500/30 bg-amber-500/[0.07] p-6 md:p-8">
              <div className="flex items-start gap-4">
                <AlertTriangle
                  aria-hidden="true"
                  className="h-6 w-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5"
                />
                <div>
                  <h2 className="text-xl md:text-2xl font-bold mb-3">
                    Is something wrong right now?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-4">
                    Site down? Chrome warning visitors it's not secure? Sending
                    spam? Redirecting somewhere it shouldn't? Send me the URL
                    and what you're seeing. I'll tell you what's happened and
                    what it takes to fix it — usually within a few hours.
                  </p>
                  <Button asChild className="h-11 rounded-xl font-bold">
                    <Link to="/contact">Get help now</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">
              What's included
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Every plan covers the same core work. The difference between tiers
              is how much of your time I'm on the hook for.
            </p>
            <ul className="space-y-3">
              {CORE_INCLUSIONS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check
                    aria-hidden="true"
                    className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                  />
                  <span className="text-foreground/90 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 md:py-24">
          <div className="container mx-auto px-6">
            <div className="max-w-3xl mb-12">
              <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">
                Plans
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                All prices NZD, excluding GST. Month to month — no contract,
                cancel anytime.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {MAINTENANCE_PLANS.map((plan) => (
                <div
                  key={plan.id}
                  className={`relative flex flex-col rounded-2xl border bg-card p-6 lg:p-8 shadow-card ${
                    plan.featured
                      ? "border-primary/50 shadow-card-hover"
                      : "border-border/50"
                  }`}
                >
                  {plan.featured && (
                    <span className="absolute -top-3 left-6 px-3 py-1 rounded-lg bg-primary text-white text-xs font-bold">
                      Most chosen
                    </span>
                  )}
                  <h3 className="text-lg font-bold mb-1">{plan.name}</h3>
                  <p className="text-sm text-muted-foreground mb-5 leading-relaxed">
                    {plan.tagline}
                  </p>
                  <p className="mb-6">
                    <span className="text-4xl font-extrabold tracking-tight">
                      ${plan.price}
                    </span>
                    <span className="text-muted-foreground font-medium">
                      /month
                    </span>
                  </p>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.includes.map((item) => (
                      <li key={item} className="flex items-start gap-2.5">
                        <Check
                          aria-hidden="true"
                          className="h-4 w-4 text-primary flex-shrink-0 mt-1"
                        />
                        <span className="text-sm text-foreground/90 leading-relaxed">
                          {item}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={plan.featured ? "default" : "outline"}
                    className="w-full h-11 rounded-xl font-bold"
                  >
                    <Link to="/contact">Start with {plan.name}</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-4 tracking-tight">
              What's not included
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Saying this plainly is worth more than another feature bullet.
            </p>
            <ul className="space-y-3">
              {EXCLUSIONS.map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <X
                    aria-hidden="true"
                    className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5"
                  />
                  <span className="text-foreground/90 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-muted-foreground leading-relaxed">
              What the market charges, and what maintenance actually costs over
              a year, is broken down in{" "}
              <Link
                to="/blogs/annual-website-maintenance-costs-nz"
                className="text-primary hover:underline font-medium"
              >
                annual website maintenance costs in NZ
              </Link>
              . If you're not sure you need a plan at all,{" "}
              <Link
                to="/blogs/do-i-need-a-maintenance-plan"
                className="text-primary hover:underline font-medium"
              >
                that question has its own answer
              </Link>
              .
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
                {
                  title: "Free health check",
                  body: "Send me your URL. I'll tell you what's outdated, what's exposed, and whether you need a plan at all.",
                },
                {
                  title: "Pick a tier, or don't",
                  body: "If you don't need one, I'll say so.",
                },
                {
                  title: "Access setup",
                  body: "Hosting, CMS and domain stay in your name. I get access; you keep ownership.",
                },
                {
                  title: "Monthly work and a report",
                  body: "You see what was done, not just an invoice.",
                },
              ].map((step, i) => (
                <li key={step.title} className="flex gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-bold mb-1">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {step.body}
                    </p>
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
                "You deal with the developer, not an account manager relaying messages",
                "Fixed monthly price agreed up front — no hourly meter, no surprise invoices",
                "You own everything — code, domain, hosting, in your name from day one",
                "No lock-in. If you leave, you take everything with you and I'll help with the handover",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <ShieldCheck
                    aria-hidden="true"
                    className="h-5 w-5 text-primary flex-shrink-0 mt-0.5"
                  />
                  <span className="text-foreground/90 leading-relaxed">
                    {item}
                  </span>
                </li>
              ))}
            </ul>

            {/* The plans undercut every published NZ plan. An unexplained low
                price reads as risk, so the reason sits next to the number
                rather than in a FAQ nobody scrolls to. */}
            <p className="text-muted-foreground leading-relaxed mb-4">
              These plans cost less than most New Zealand agencies charge, and
              it's worth saying why rather than leaving you to guess. There's no
              agency overhead and no account manager — I work remotely from
              Pakistan with clients in New Zealand and Cyprus, so you're paying
              for the work rather than the layer above it. Ad-hoc changes
              outside a plan are ${MAINTENANCE_HOURLY}/hour, against the
              $80–$150 NZ providers commonly publish.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-4">
              The trade-off is real and I'd rather name it: I'm not down the
              road for a coffee, and there's a timezone gap. I keep a fixed
              overlap window each working day and everything is documented in
              writing, so nothing waits on catching me live.
            </p>
            <p className="text-foreground/90 leading-relaxed font-medium">
              I take a maximum of {MAINTENANCE_CLIENT_CAP} maintenance clients,
              so each one gets actual attention rather than a scheduled script.
              When those are full, the honest answer is that you're on a
              waiting list.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
              When you don't need a maintenance plan
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              If your site is a small static or simply-built brochure site with
              no logins, no payments and no plugin sprawl, sitting on managed
              hosting that patches itself — you probably don't need to pay
              anyone monthly. Keep a backup, let the SSL auto-renew, and check
              it loads occasionally.
            </p>
            <p className="text-muted-foreground leading-relaxed mb-6">
              I'd rather tell you that than take ${MAINTENANCE_PLANS[0].price} a
              month for watching a site that doesn't need watching.
            </p>
            <p className="text-foreground/90 leading-relaxed">
              <span className="font-bold">The plan earns its money when:</span>{" "}
              you're on WordPress or anything plugin-based · the site takes
              bookings or payments · you'd lose money from a day of downtime ·
              or nobody currently knows whether backups exist.
            </p>
          </div>
        </section>

        <FAQ items={MAINTENANCE_FAQS} title="Questions before you commit" />

        <section className="py-20 md:py-28 bg-surface-alt border-t border-border/40">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-5 tracking-tight">
              Get a free health check
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Send me your URL and I'll tell you what state your site is in —
              what's outdated, what's exposed, and what it'd take to make it
              safe. No charge, and no obligation to buy a plan.
            </p>
            <Button asChild size="lg" className="h-12 px-10 rounded-2xl font-bold">
              <Link to="/contact">Get a free health check</Link>
            </Button>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default WebsiteMaintenance;
