import { Link } from "react-router-dom";
import { Check, AlertCircle } from "lucide-react";
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

const meta = routeMeta("/services/custom-web-applications")!;

const FAQS = [
  {
    question: "How much does a custom web application cost?",
    answer:
      "From USD $2,500 (about NZ$4,200) for a focused first version built by one developer, typically 6–10 weeks. Agency quotes for comparable apps commonly start around $10,000 and rise sharply with team size and scope — that's a different purchase. Roles, integrations and unusual logic move the number.",
  },
  {
    question: "How long does it take?",
    answer:
      "6–10 weeks for a first version, assuming decisions arrive promptly. The usual delay isn't development — it's waiting on answers about how the business actually works.",
  },
  {
    question: "Do I need a web app or just a website?",
    answer:
      "If users log in and do things, it's an app. If people read and then contact you, it's a website — and it costs a fraction as much.",
  },
  {
    question: "Can you add features later?",
    answer:
      "Yes, and most projects do. Each is scoped and quoted separately, which is why the first version should be deliberately small.",
  },
  {
    question: "Who owns the code and the data?",
    answer:
      "You do — code, database and hosting in your name from day one. You can take it to another developer whenever you want.",
  },
  {
    question: "What technologies do you use?",
    answer:
      "React and TypeScript on the front end, Node.js and Express on the back, MongoDB for data. Real-time features use Socket.io; payments use Stripe. I'll tell you if your project genuinely suits something else.",
  },
  {
    question: "Can it integrate with systems we already use?",
    answer:
      "Usually, if they have an API — accounting, CRM, payments, inventory. Each integration is real work with its own error states and testing, so they're quoted individually rather than waved through.",
  },
];

const CustomWebApplications = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    canonical: canonicalPath("/services/custom-web-applications"),
    structuredData: pageGraph("/services/custom-web-applications", [
      faqNodeFor(FAQS),
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Custom Web Applications", path: "/services/custom-web-applications" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Custom Web"
          highlight="Applications"
          description="Data-driven web apps with real user roles and workflows — React, TypeScript, Node and MongoDB. Fixed price from USD $2,500, scope agreed before work starts."
          breadcrumbs={[
            { label: "Services", href: "/services" },
            { label: "Custom Applications" },
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
              Data-driven applications with real user roles and real workflows — most recently a hospital platform where reception, doctors and administrators share one patient record and each sees only what their role permits.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
              Website or web application?
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Worth settling first, because it decides the price bracket and half the arguments that follow.
            </p>
            <div className="space-y-6">
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <p className="font-bold text-foreground mb-2">A website informs.</p>
                <p className="text-muted-foreground">People read it, decide whether to trust you, and get in touch. If the value is in the reading, it's a website.</p>
              </div>
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <p className="font-bold text-foreground mb-2">A web application does something.</p>
                <p className="text-muted-foreground">Users log in, enter data, change state, and trigger work. If the value is in the doing, it's software and it's priced like software.</p>
              </div>
              <div className="p-4 rounded-lg border border-primary/20 bg-primary/5">
                <p className="font-bold text-foreground mb-2">The clearest test:</p>
                <p className="text-muted-foreground">Can two different people log in and see different things? If yes, you're building an application.</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              What I build
            </h2>
            <ul className="space-y-3 mb-12">
              {[
                "Internal tools and admin systems — the thing your team currently runs on five spreadsheets",
                "Customer and client portals — logins, roles, permissions, data each user sees only their slice of",
                "Booking and scheduling systems — where the hard part is what happens when two people book the same slot",
                "Dashboards and reporting — order, inventory and payment views that stay readable as numbers move",
                "Workflow apps — approvals, statuses, handoffs that currently live in email",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              What I don't build
            </h2>
            <ul className="space-y-3">
              {[
                "Enterprise platforms with a team of ten and a six-figure budget — agency job",
                "Native mobile apps — a separate build for iOS and Android",
                "Anything an off-the-shelf tool already does well — if Shopify or a $40/month SaaS solves it, I'll say so",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              The two problems that actually make applications hard
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3">Permissions, enforced at the server</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Roles are the single biggest cost driver in any application with more than one kind of user. One person seeing their own data is simple. Three roles seeing different views of the same record is real engineering.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  On the hospital platform, role-based access control was designed first and enforced server-side. The UI only ever hides what the API already refuses — so removing a hidden button by hand gets you a 403, not a patient record.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Concurrency, wherever two users want the same thing</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Two receptionists opening the same appointment slot is not an edge case, it's Monday morning. A read-then-write check has a gap between the two operations where both requests pass.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  Appointments are validated against the calendar at write time, not in the client. Client-side availability is a display optimisation; it can't arbitrate between requests arriving in the same second.
                </p>
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-border/40">
              <Button asChild variant="outline">
                <Link to="/projects/hospital-management-system">Read the case study →</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
              What it costs
            </h2>
            <p className="text-lg font-bold mb-4">
              From <span className="text-primary">USD $2,500</span> — about <span className="text-primary">NZ$4,200</span> / <span className="text-primary">€2,300</span>
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Fixed price, agreed in writing before anything starts. Typical delivery <strong>6–10 weeks</strong>.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Included: full MERN build · authentication and role-based access · REST API and MongoDB schema design · admin dashboard · automated deployment · 30 days post-launch support.
            </p>

            <div className="p-6 rounded-xl bg-muted/40 border border-border/50 mb-6">
              <p className="font-semibold mb-3">Why that's below agency quotes</p>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                Agencies quote $10,000–$25,000 for a simple tool and $50,000–$150,000 for a medium app. That's for an agency team — project manager, designer, two developers, QA.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                What you get here is one senior developer building a focused first version. That works well when scope is clear. It works badly when you need parallel workstreams, a designer, or someone in your timezone at 2pm.
              </p>
            </div>

            <p className="text-sm text-muted-foreground italic">
              Not included: copywriting · brand design · ongoing feature development · paid third-party fees (billed to you at cost).
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
              Start smaller than you think
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              The most expensive mistake isn't hiring the wrong developer. It's building version three before anyone uses version one.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Write down every feature you want. Find the smallest subset a real user could do their job with. Build that, put it in front of people, let what they do decide what comes next. Half the "must-haves" turn out not to matter, and you'll discover two things nobody thought of.
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
                { step: "1", title: "Free 30-minute call", desc: "What the app has to do, who uses it, what happens today instead." },
                { step: "2", title: "Scope and fixed quote", desc: "Features, timeline, price, and what's excluded." },
                { step: "3", title: "Schema and API design first", desc: "Data model and permissions before interface — both are expensive to change later." },
                { step: "4", title: "Build", desc: "With regular updates and a link to follow progress." },
                { step: "5", title: "Launch and handover", desc: "Code, hosting and accounts in your name, plus 30 days of fixes." },
              ].map(({ step, title, desc }) => (
                <li key={step} className="flex gap-4">
                  <span className="flex-shrink-0 w-9 h-9 rounded-xl bg-primary/10 text-primary font-bold flex items-center justify-center">
                    {step}
                  </span>
                  <div>
                    <h3 className="font-bold mb-1">{title}</h3>
                    <p className="text-muted-foreground text-sm">{desc}</p>
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
                "You talk to the developer — the person you brief writes the code",
                "Fixed price agreed upfront — no hourly meter, no scope-creep invoice",
                "You own everything — code, database, hosting, in your name from day one",
                "Permissions designed first, not retrofitted",
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
                I work remotely from Pakistan with clients in New Zealand and Cyprus. That's most of why the price is what it is. It also means no in-person meetings and a timezone gap. If your project needs a team or someone in your building, hire an agency. That's a real answer.
              </p>
            </div>
          </div>
        </section>

        <FAQ items={FAQS} title="Questions before we start" />

        <section className="py-20 md:py-28 bg-surface-alt border-t border-border/40">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-5 tracking-tight">
              Get a fixed quote
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Tell me what the app has to do and who uses it. You'll get a realistic scope, timeline and fixed price before anything starts.
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

export default CustomWebApplications;
