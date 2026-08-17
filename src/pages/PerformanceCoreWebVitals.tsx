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

const meta = routeMeta("/services/performance-core-web-vitals")!;

const FAQS = [
  {
    question: "Why is my website slow?",
    answer:
      "Usually images, too much JavaScript, render-blocking resources, or no caching. Sometimes server response time. PageSpeed Insights will name the top issues for free.",
  },
  {
    question: "Will fixing speed improve my Google ranking?",
    answer:
      "It removes a handicap rather than granting an advantage. Core Web Vitals are a ranking input, but content and competition matter more. What speed reliably improves is how many visitors stay.",
  },
  {
    question: "What are good Core Web Vitals scores?",
    answer:
      "LCP under 2.5 seconds, INP under 200ms, CLS under 0.1 — measured on mobile.",
  },
  {
    question: "Can you make a WordPress site fast?",
    answer:
      "Usually faster, sometimes not fast. Plugin-heavy WordPress carries weight you can't fully remove without changing what the site does. I'll tell you the realistic ceiling before you commit.",
  },
  {
    question: "How long does it take?",
    answer:
      "Most optimisation work is 1–2 weeks. An audit alone is a few days.",
  },
  {
    question: "Do I need this if my site seems fine to me?",
    answer:
      "Test it on a phone, on mobile data, away from your wi-fi. That's what your visitors experience, and it's often a different site from the one you know.",
  },
];

const PerformanceCoreWebVitals = () => {
  useSEO({
    title: meta.title,
    description: meta.description,
    canonical: canonicalPath("/services/performance-core-web-vitals"),
    structuredData: pageGraph("/services/performance-core-web-vitals", [
      faqNodeFor(FAQS),
      breadcrumbNodeFor([
        { name: "Home", path: "/" },
        { name: "Services", path: "/services" },
        { name: "Performance", path: "/services/performance-core-web-vitals" },
      ]),
    ]),
  });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navigation />
      <main id="main-content" className="pt-20">
        <PageHeader
          title="Website Speed &"
          highlight="Core Web Vitals"
          description="Fixing a slow site you already have — LCP, INP and CLS measured on real mobile connections, not a desktop lab score. Fixed price, report before any work."
          breadcrumbs={[
            { label: "Services", href: "/services" },
            { label: "Performance" },
          ]}
          cta={{
            label: "Get a free speed check",
            to: "/contact",
            note: "No charge · No obligation to buy",
          }}
        />

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Fixing a slow site you already have — LCP, INP and CLS measured on a real mobile connection rather than a desktop lab score.
            </p>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Your visitors are on phones, on mobile data, often outside a city. That number is usually two to four times worse than the score you get testing on your laptop, and it's the one that decides whether they stay.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              The honest bit about rankings
            </h2>
            <p className="text-muted-foreground mb-8 leading-relaxed">
              Most agency pages sell speed as an SEO silver bullet. It isn't, and it's worth saying so before you spend money.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Google does use Core Web Vitals as a ranking input, and it's part of the page experience signal. But the direct ranking effect isn't large, and plenty of SEOs report seeing little movement from Core Web Vitals improvements alone. Content and competition matter more.
            </p>
            <div className="p-6 rounded-xl bg-primary/[0.06] border border-primary/25">
              <p className="font-semibold text-foreground mb-3">What speed reliably changes:</p>
              <p className="text-muted-foreground leading-relaxed">
                Whether people stay and buy. Google's own research found the chance of a bounce rises sharply as load time goes from one second to three. Sites loading in one second convert around three times better than sites loading in five.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              What this is for
            </h2>
            <ul className="space-y-3 mb-12">
              {[
                "A site that 'feels slow' and you don't know why",
                "Failing Core Web Vitals in Search Console",
                "Mobile visitors leaving before the page finishes",
                "A site that got slower over time as things were added",
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
                "A rebuild — if the foundation is the problem, optimisation is patching",
                "An SEO campaign — speed is one ranking input among many",
                "A guarantee of a green score — on some platforms, some scores aren't reachable",
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
              The three metrics
            </h2>

            <div className="space-y-6">
              <div className="p-4 rounded-lg border border-border/50 bg-muted/40">
                <h3 className="font-bold text-foreground mb-2">Largest Contentful Paint (LCP)</h3>
                <p className="text-muted-foreground text-sm mb-2">How long until the biggest visible element above the fold finishes rendering.</p>
                <p className="font-semibold text-foreground text-sm">Target: under 2.5 seconds</p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-muted/40">
                <h3 className="font-bold text-foreground mb-2">Interaction to Next Paint (INP)</h3>
                <p className="text-muted-foreground text-sm mb-2">How quickly the page responds when someone clicks, taps or types, measured across all interactions.</p>
                <p className="font-semibold text-foreground text-sm">Target: under 200ms</p>
                <p className="text-muted-foreground text-sm mt-2 italic">INP replaced First Input Delay in March 2024 — it's the more reliable metric.</p>
              </div>

              <div className="p-4 rounded-lg border border-border/50 bg-muted/40">
                <h3 className="font-bold text-foreground mb-2">Cumulative Layout Shift (CLS)</h3>
                <p className="text-muted-foreground text-sm mb-2">How much the page moves while it's loading. Ads, images without dimensions, fonts swapping in.</p>
                <p className="font-semibold text-foreground text-sm">Target: under 0.1</p>
              </div>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              What actually makes sites slow
            </h2>

            <div className="space-y-6">
              {[
                { title: "Images", desc: "Almost always first, and usually the cheapest win. Uncompressed, wrong format, sized for desktop and shrunk in the browser, no lazy loading below the fold." },
                { title: "Too much JavaScript", desc: "Plugins and third-party scripts each add weight. On a mid-range phone, parsing that JavaScript costs more than downloading it." },
                { title: "Render-blocking resources", desc: "CSS and JS that must download and parse before anything appears. Fixable by inlining what's needed above the fold and deferring the rest." },
                { title: "No caching or CDN", desc: "Repeat visitors re-downloading what they already have; NZ visitors pulling every asset from a US server." },
                { title: "Layout shift", desc: "Images and ads without declared dimensions, so content jumps as things load. That's your CLS score, and it's usually a fifteen-minute fix." },
                { title: "Server response time", desc: "Sometimes the host, sometimes a slow database query behind the page. This is the one that needs actual investigation rather than a checklist." },
              ].map(({ title, desc }) => (
                <div key={title}>
                  <h3 className="font-bold text-foreground mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
              How I measure
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              On a throttled mobile connection, on a real device profile — not a desktop Lighthouse run. Before and after, same conditions, so the numbers mean something.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Tools used: PageSpeed Insights for lab and field, Search Console's Core Web Vitals report for what Google sees, WebPageTest for waterfall charts, and CrUX history for up to 12 months of field data.
            </p>
            <p className="text-muted-foreground">
              You get the before and after numbers either way, including when they're less impressive than either of us hoped.
            </p>
          </div>
        </section>

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
              What it costs
            </h2>
            <div className="space-y-4 mb-8">
              <div className="p-4 rounded-lg bg-muted/40 border border-border/50">
                <p className="font-semibold text-foreground">Speed audit and written report</p>
                <p className="text-muted-foreground text-sm">From specified price. What's slow, why, what each fix would buy you, in priority order. Yours to hand to anyone.</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/40 border border-border/50">
                <p className="font-semibold text-foreground">Audit plus implementation</p>
                <p className="text-muted-foreground text-sm">From specified price, depending on what the audit finds.</p>
              </div>
              <div className="p-4 rounded-lg bg-muted/40 border border-border/50">
                <p className="font-semibold text-foreground">Ongoing monitoring</p>
                <p className="text-muted-foreground text-sm">Part of a maintenance plan.</p>
              </div>
            </div>

            <p className="text-muted-foreground mb-6 leading-relaxed">
              For context, NZ providers commonly bill ad-hoc developer work at NZ$80–150/hour.
            </p>

            <div className="p-6 rounded-xl bg-primary/[0.06] border border-primary/25">
              <p className="font-semibold text-foreground mb-2">Honest note:</p>
              <p className="text-muted-foreground leading-relaxed">
                On plenty of sites, the audit finds the main problem is images, and the fix is an afternoon you could do yourself. That happens often enough to be worth saying.
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-20 bg-surface-alt border-y border-border/40">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-6 tracking-tight">
              When you don't need me
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Run PageSpeed Insights on your own site — it's free and it names the top issues. If it says "serve images in next-gen formats" and you can re-export your images, do that first and re-test. A lot of sites go from red to amber on images alone.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Come to me when the report is telling you things you can't act on, when the fixes need code, or when you've done the obvious and it's still slow.
            </p>
          </div>
        </section>

        <FAQ items={FAQS} title="Questions before we start" />

        <section className="py-16 md:py-20">
          <div className="container mx-auto px-6 max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-extrabold mb-8 tracking-tight">
              Related services
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Speed optimization works best as part of broader development. You might also need a new site or app built.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <Link to="/services/business-marketing-websites" className="p-4 rounded-lg border border-border/50 hover:border-primary/35 transition-colors group">
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">Business & Marketing Websites</h3>
                <p className="text-sm text-muted-foreground">Fast sites built for speed from the ground up</p>
              </Link>
              <Link to="/services/custom-web-applications" className="p-4 rounded-lg border border-border/50 hover:border-primary/35 transition-colors group">
                <h3 className="font-bold mb-1 group-hover:text-primary transition-colors">Custom Web Applications</h3>
                <p className="text-sm text-muted-foreground">Apps built with performance in mind</p>
              </Link>
            </div>
          </div>
        </section>

        <section className="py-20 md:py-28 bg-surface-alt border-t border-border/40">
          <div className="container mx-auto px-6 max-w-2xl text-center">
            <h2 className="text-2xl md:text-4xl font-extrabold mb-5 tracking-tight">
              Get a free speed check
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Send me your URL and I'll tell you what's actually slow and roughly what it'd take to fix. No charge.
            </p>
            <Button asChild size="lg" className="h-12 px-10 rounded-2xl font-bold">
              <Link to="/contact">Get a free speed check</Link>
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

export default PerformanceCoreWebVitals;
