import { Button } from "@/components/ui/button";
import { BarChart3, Code, Database, FileText, Globe, Zap, ArrowRight, Wrench, CheckCircle2, ShieldCheck } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { MAINTENANCE_PLANS } from "@/lib/site.config.mjs";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Link } from "react-router-dom";
import { STATIC_PROJECTS } from "@/data/projects";

/**
 * Resolves a card's proof link against the real case-study data.
 *
 * Hardcoding "/projects/hospital-management-system" here would work until
 * someone renamed a slug, at which point the services page would quietly link
 * into a 404 — the one page where a broken proof link costs an enquiry.
 * Throwing at module load makes that a failed build instead, and the
 * prerenderer executes this module, so a bad slug can't reach production.
 */
const proofOf = (slug: string) => {
  const project = STATIC_PROJECTS.find((p) => p.slug === slug);
  if (!project) {
    throw new Error(`Services: no case study with slug "${slug}"`);
  }
  return { href: `/projects/${slug}`, title: project.title };
};

/**
 * Named by outcome, not by technology.
 *
 * These read "React Development", "Backend Solutions", "Responsive Design" —
 * which is what the work IS, not what anyone buys. Nobody with a budget
 * searches for "responsive design"; they search for the thing they need built.
 * The stack still appears, one line down, where it reassures a technical
 * reader without being the headline for a non-technical one.
 *
 * Every card carries a case study. That's the harder half of the change: a
 * service claim next to a link proving the claim answers "can he actually
 * build this?" in the same eyeful, and it wires /services into /projects
 * instead of dead-ending at the contact form.
 */
interface ServiceCard {
  icon: LucideIcon;
  title: string;
  description: string;
  stack: string[];
  /** Where the card's proof link points, and what it's called. */
  proof: { href: string; title: string };
  /**
   * Overrides the "Case study:" prefix on the proof link.
   *
   * Every card here is a build service backed by a delivered project. The
   * maintenance card is the exception — it's an ongoing service with no case
   * study to point at, so it links to its own page instead. Labelling that
   * "Case study:" would promise proof the link doesn't deliver.
   */
  proofLabel?: string;
  /** Path to the service detail page. When set, the card becomes clickable to that page. */
  servicePath?: string;
  iconBg: string;
  iconColor: string;
  accentBar: string;
}

const services: ServiceCard[] = [
  {
    icon: Globe,
    title: "Business & Marketing Websites",
    description:
      "Fast, credible sites for service businesses — built to load in under two seconds on a phone and to rank for the services they sell.",
    stack: ["React", "TypeScript", "Tailwind CSS", "SEO & schema markup"],
    proof: proofOf("software-house-website"),
    servicePath: "/services/business-marketing-websites",
    iconBg: "bg-primary/10", iconColor: "text-primary", accentBar: "bg-primary",
  },
  {
    icon: Code,
    title: "Custom Web Applications",
    description:
      "Data-driven applications with real user roles and real workflows — most recently a hospital platform where reception, doctors and administrators share one patient record.",
    stack: ["React", "TypeScript", "Node.js", "MongoDB"],
    proof: proofOf("hospital-management-system"),
    servicePath: "/services/custom-web-applications",
    iconBg: "bg-accent/10", iconColor: "text-accent", accentBar: "bg-accent",
  },
  {
    icon: BarChart3,
    title: "Dashboards & Internal Tools",
    description:
      "Admin panels and reporting screens for the people who run the business — order, inventory and payment views that stay readable as the numbers move.",
    stack: ["React", "Node.js", "Socket.io", "MongoDB"],
    proof: proofOf("ecommerce-dashboard"),
    servicePath: "/services/dashboards-internal-tools",
    iconBg: "bg-primary/10", iconColor: "text-primary", accentBar: "bg-primary",
  },
  {
    icon: Database,
    title: "APIs & Backend Development",
    description:
      "REST APIs, authentication and database schema design — the half of a product nobody notices until it's slow or it leaks something it shouldn't.",
    stack: ["Node.js", "Express", "MongoDB", "REST"],
    proof: proofOf("restful-api-service"),
    iconBg: "bg-accent/10", iconColor: "text-accent", accentBar: "bg-accent",
  },
  {
    icon: Zap,
    title: "Performance & Core Web Vitals",
    description:
      "Fixing LCP, INP and CLS on a site you already have, measured on real mobile connections rather than a desktop lab score.",
    stack: ["Core Web Vitals", "Lighthouse", "Bundle analysis", "Caching"],
    proof: proofOf("software-house-website"),
    servicePath: "/services/performance-core-web-vitals",
    iconBg: "bg-primary/10", iconColor: "text-primary", accentBar: "bg-primary",
  },
  {
    icon: FileText,
    title: "Content & Publishing Platforms",
    description:
      "Blogs, portfolios and content sites where publishing a post means writing a file — not editing components or holding a deploy pipeline in your head.",
    stack: ["Next.js", "MDX", "React", "TypeScript"],
    proof: proofOf("portfolio-blog-platform"),
    iconBg: "bg-accent/10", iconColor: "text-accent", accentBar: "bg-accent",
  },
  {
    // The one card that sells an ongoing service rather than a build. It was
    // reachable only from a line in the page header, which is not where anyone
    // looks for a service — the grid is the list of what this business does,
    // and maintenance being absent from it read as not offered.
    icon: ShieldCheck,
    title: "Website Maintenance & Support",
    description:
      "Updates, backups, security and uptime monitoring on a site you already have — handled monthly for a fixed price, with no lock-in contract.",
    stack: ["Staged updates", "Off-site backups", "Uptime monitoring", "Monthly report"],
    proof: {
      href: "/services/website-maintenance",
      title: `plans from $${MAINTENANCE_PLANS[0].price}/month NZD`,
    },
    proofLabel: "See",
    iconBg: "bg-primary/10", iconColor: "text-primary", accentBar: "bg-primary",
  },
];

interface ServicesProps {
  compactHeader?: boolean;
  /**
   * Set on /services, where this section sits directly under the page header
   * and its first card row is the LCP element. See `initialVisible` in
   * use-intersection-observer.tsx for why the reveal has to be skipped there.
   */
  aboveFold?: boolean;
  /**
   * Whether to show the maintenance card. On by default, off for Cyprus —
   * that service is priced in NZD and its Service node declares areaServed
   * New Zealand, so it belongs on the NZ path only. See the matching prop on
   * Pricing for the currency rule this follows.
   */
  showMaintenance?: boolean;
}

export const Services = ({
  compactHeader = false,
  aboveFold = false,
  showMaintenance = true,
}: ServicesProps) => {
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.05,
    initialVisible: aboveFold,
  });

  const visibleServices = showMaintenance
    ? services
    : services.filter((s) => s.proof.href !== "/services/website-maintenance");

  return (
    <section id="services" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/6 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/6 rounded-full blur-[140px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">

        {/* Header */}
        {compactHeader && (
          /* Keeps the heading outline intact when the visible section
             heading is hidden — the card <h3>s would otherwise follow
             the page <h1> directly and skip a level. */
          <h2 className="sr-only">Web development services</h2>
        )}

        {!compactHeader && (
          <div className={`text-center mb-20 max-w-3xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="section-label mb-8">
              <Wrench className="h-5 w-5" />
              What I Do
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
              Services{" "}
              <span className="gradient-text">I Provide</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed max-w-2xl mx-auto">
              Professional web development services tailored to your needs. Let's build something amazing together.
            </p>
          </div>
        )}

        {/* Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
          {visibleServices.map((svc, i) => (
            <div
              key={svc.title}
              className={`tilt-card group relative flex flex-col rounded-2xl border border-border/50 bg-card
                p-8 overflow-hidden shadow-card
                hover:border-primary/35 hover:shadow-card-hover
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}
              style={{ transitionDelay: `${i * 80}ms` }}
            >
              {/* Top accent line */}
              <div className={`absolute top-0 left-0 right-0 h-[3px] ${svc.accentBar}
                scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />

              <div className="relative z-10 flex flex-col flex-1">
                {/* Icon */}
                <div className={`inline-flex p-5 rounded-2xl ${svc.iconBg} ${svc.iconColor} mb-6 w-fit
                  group-hover:scale-115 transition-transform duration-400`}>
                  <svc.icon className="h-7 w-7" />
                </div>

                {svc.servicePath ? (
                  <Link to={svc.servicePath} className="group/link hover:no-underline">
                    <h3 className="text-xl font-bold mb-4 group-hover/link:text-primary transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1 group-hover/link:text-foreground transition-colors">
                      {svc.description}
                    </p>
                  </Link>
                ) : (
                  <>
                    <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                      {svc.description}
                    </p>
                  </>
                )}

                {/* Stack — reassurance for a technical reader, one level down
                    from the outcome the card leads with. */}
                <ul className="space-y-3 pt-5 border-t border-border/40">
                  {svc.stack.map(item => (
                    <li key={item} className="flex items-center gap-3 text-xs text-muted-foreground">
                      <CheckCircle2 className={`h-4 w-4 ${svc.iconColor} opacity-70 flex-shrink-0`} />
                      {item}
                    </li>
                  ))}
                </ul>

                {/* Proof. The whole point of the card: a claim and the thing
                    that backs it, without a second click to find out. */}
                <Link
                  to={svc.proof.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold
                    text-primary hover:underline underline-offset-4 group/proof"
                >
                  <span>
                    {svc.proofLabel ?? "Case study:"}{" "}
                    <span className="font-bold">{svc.proof.title}</span>
                  </span>
                  <ArrowRight className="h-3.5 w-3.5 flex-shrink-0 group-hover/proof:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Banner */}
        <div className={`relative overflow-hidden rounded-3xl transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-blue-600 to-violet-600" />
          <div className="absolute inset-0 dot-grid opacity-8" />
          <div className="absolute -top-24 -left-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-white/5 rounded-full blur-3xl" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 p-10 md:p-14">
            <div>
              <p className="text-white/60 text-sm font-semibold uppercase tracking-[0.12em] mb-2">Custom Work</p>
              <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3">
                Need a Custom Solution?
              </h3>
              <p className="text-white/70 max-w-lg text-sm md:text-base leading-relaxed">
                Have a unique project in mind? Let's discuss your requirements and create something exceptional together.
              </p>
            </div>
            <Link to="/contact" className="flex-shrink-0">
              <Button size="lg"
                className="bg-white text-primary hover:bg-white/95 shadow-2xl shadow-black/25
                  px-8 h-13 font-bold group gap-2.5 whitespace-nowrap rounded-2xl
                  hover:scale-105 transition-all duration-200">
                Start a Project
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-200" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
