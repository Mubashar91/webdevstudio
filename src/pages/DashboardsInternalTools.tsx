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

const meta = routeMeta("/services/dashboards-internal-tools")!;

const FAQS = [
  {
    question: "How much does a custom dashboard cost?",
    answer:
      "From specified price for a single reporting screen; multi-screen admin panels with roles start at USD $2,500 (about NZ$4,200). What moves it: number of roles, how many systems the data comes from, and whether your existing data model can answer the questions you're asking.",
  },
  {
    question: "Can you build a dashboard for data we already have?",
    answer:
      "Usually — if it's in a database or reachable through an API. The work is often less about the screens than about reshaping data stored for one purpose into something that answers a different question.",
  },
  {
    question: "Should we use Metabase or Retool instead?",
    answer:
      "Quite possibly. Off-the-shelf tools are excellent when permissions are simple and logic is standard, and far cheaper than a build. Custom wins when the rules are specific, the tool must live inside an existing product, or it's used daily by people whose time is expensive.",
  },
  {
    question: "Do you build real-time dashboards?",
    answer:
      "Yes, using Socket.io where it's warranted — an order queue, an operations screen someone actually watches. On a monthly report it adds complexity for no decision that changes, and I'll say so.",
  },
  {
    question: "Can different staff see different things?",
    answer:
      "Yes, and it should be enforced at the server, not by hiding menu items. Role-based access is the part of an internal tool most worth getting right early.",
  },
  {
    question: "Can you add a dashboard to our existing application?",
    answer:
      "Often. I'd look at the codebase first and quote after — inherited code takes longer to work in than a clean start, and anyone quoting fixed without looking is guessing.",
  },
];

const DashboardsInternalTools = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    canonical: canonicalPath("/services/dashboards-internal-tools"),
    structuredData: pageGraph("/services/dashboards-internal-tools", [
      faqNodeFor(FAQS),
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Dashboards & Internal Tools", path: "/services/dashboards-internal-tools" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Dashboards &"
          highlight="Internal Tools"
          description="Admin panels and reporting screens built for daily use — order, inventory and payment views that stay readable as the numbers move. Fixed price, React and Node."
          breadcrumbs={[
            { label: "Services", href: "/services" },
            { label: "Dashboards & Tools" },
          ]}
          cta={{
            label: "Get a fixed quote",
            to: "/contact",
            note: "Free 30-min call · scope agreed upfront",
          }}
        />

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed">
              Admin panels and reporting screens for the people who run the business — order, inventory and payment views that stay readable as the numbers move.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed mt-6">
              Most internal tools are judged on the demo, when there are twelve rows of data. They're used on a Tuesday morning with four thousand. Those are different design problems, and only one of them matters.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              What this is for
            </h2>
            <ul className="space-y-3 mb-12">
              {[
                "The spreadsheet that runs your business and now has six tabs, three people editing it, and a formula nobody understands",
                "Order, inventory and payment views your team currently assembles by hand from two systems",
                "Reporting screens so the people making decisions stop asking someone to export a CSV",
                "Admin panels for a product you already have, where staff need to see and change things customers can't",
                "Operations dashboards where something needs watching in close to real time",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>

            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              What this isn't
            </h2>
            <ul className="space-y-3">
              {[
                "A BI platform — if you need self-serve analytics across the whole business, Metabase or Power BI will beat a custom build on price and features",
                "A pretty chart page — if nobody makes a decision from it, it's a screensaver",
                "An enterprise data warehouse — different discipline, different budget, different specialist",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <AlertCircle className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              What actually makes an internal tool good
            </h2>

            <div className="space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-3">It has to answer a question someone asks daily</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  The failure mode isn't ugly — it's irrelevant. A dashboard showing eleven metrics nobody acts on gets checked twice and forgotten. Design starts with a sentence: every morning, [person] needs to know [thing] so they can [do something]. If you can't finish that sentence, the screen shouldn't exist yet.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  So the first question isn't what data you have. It's what decision gets made, by whom, and how often.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">It has to stay readable when the data grows</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Twelve rows and four thousand rows are different products. Real volume needs pagination or virtualisation, indexes on the fields people filter by, and aggregation done at the database rather than shipped to the browser and summed in JavaScript.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  That last one is the most common reason a tool that felt fast in month one takes eleven seconds by month eight.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Permissions decide who sees what</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Internal doesn't mean unrestricted. A warehouse lead and a finance manager need different views of the same order, and the rule has to be enforced at the server rather than by hiding a menu item.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-bold mb-3">Real-time, only where it earns its keep</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Live-updating numbers are the most requested feature and the least often needed. Worth it when someone is watching — an order queue during a sale, an operations screen. Not worth it on a monthly revenue report, where it adds complexity for no decision that changes.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
              What it costs
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Internal tools vary more than any other work — a single reporting screen and a full operations panel are different projects.
            </p>

            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-lg bg-muted/40 border border-border/50">
                <p className="font-semibold text-foreground mb-1">Single dashboard or reporting screen</p>
                <p className="text-muted-foreground text-sm">From specified price</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/40 border border-border/50">
                <p className="font-semibold text-foreground mb-1">Multi-screen admin panel with roles</p>
                <p className="text-muted-foreground text-sm">From USD $2,500 (about NZ$4,200)</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/40 border border-border/50">
                <p className="font-semibold text-foreground mb-1">Added to an existing app</p>
                <p className="text-muted-foreground text-sm">Quoted after I've looked at the codebase</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              Fixed price, agreed in writing before anything starts. What moves the number: number of user roles · how many systems the data comes from · real-time requirements · whether your data model already supports the questions you're asking (often it doesn't, and reshaping it is the real work).
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              Before you commission anything
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-bold mb-2">Write the sentence</h3>
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  Every [day/week], [role] needs to know [X] so they can [Y]. One per screen. If a screen doesn't have one, cut it from the scope.
                </p>
              </div>

              <div>
                <h3 className="font-bold mb-2">Check whether an off-the-shelf tool does it</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Metabase, Retool and similar connect to a database and produce usable internal tools with no build. They fit badly when your logic is unusual, your permissions are specific, or the tool must live inside a product you already own. When they fit, they fit for a fraction of this, and I'd rather point you there than take the work.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              How it works
            </h2>
            <ol className="space-y-6">
              {[
                { step: "1", title: "Free 30-minute call", desc: "What decisions get made, by whom, from what data." },
                { step: "2", title: "Fixed quote", desc: "Screens, roles, data sources, timeline, and exclusions." },
                { step: "3", title: "Data and permissions first", desc: "The questions decide the schema; both are expensive to change later." },
                { step: "4", title: "Build", desc: "With a link to follow progress." },
                { step: "5", title: "Launch and handover", desc: "Code and accounts in your name, plus 30 days of fixes." },
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

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              Why work with me
            </h2>
            <ul className="space-y-3 mb-8">
              {[
                "You talk to the developer who builds it, not an account manager",
                "Fixed price agreed upfront — changes are quoted before they're built",
                "You own everything — code, database, hosting, in your name from day one",
                "Built for real data volume, not demo volume",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                  <span className="text-foreground/90">{item}</span>
                </li>
              ))}
            </ul>

            <div className="p-6 rounded-xl bg-muted/40 border border-border/50">
              <p className="font-semibold mb-2">The tradeoff:</p>
              <p className="text-muted-foreground leading-relaxed">
                I work remotely from Pakistan with clients in New Zealand and Cyprus. Lower cost and direct access — and no in-person meetings, plus a timezone gap. Internal tools often need close contact with staff who'll use them; if that has to happen in a room, hire locally.
              </p>
            </div>
          </div>
        </section>

        <FAQ items={FAQS} title="Questions before we start" />

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              Related services
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Dashboards often work best alongside custom applications. Some benefit from performance optimization.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/services/custom-web-applications" className="p-4 rounded-lg border border-border/50 hover:border-primary/35 transition-colors group">
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">Custom Web Applications</h3>
                <p className="text-sm text-muted-foreground">Data-driven apps with real roles and workflows</p>
              </Link>
              <Link to="/services/performance-core-web-vitals" className="p-4 rounded-lg border border-border/50 hover:border-primary/35 transition-colors group">
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">Speed & Core Web Vitals</h3>
                <p className="text-sm text-muted-foreground">Optimize if the dashboard feels slow with large data</p>
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
              Tell me what your team needs to see and what they do with it. You'll get a realistic scope and fixed price before anything starts.
            </p>
            <Button asChild size="lg" className="h-12 px-10 rounded-2xl font-bold">
              <Link to="/contact">Get a fixed quote</Link>
            </Button>
            <div className="mt-8 pt-8 border-t border-border/40">
              <p className="text-sm text-muted-foreground">
                <Link to="/projects" className="text-primary hover:underline font-medium">See recent work</Link> · <Link to="/services/custom-web-applications" className="text-primary hover:underline font-medium">Custom applications</Link>
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DashboardsInternalTools;
