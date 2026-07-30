import { Button } from "@/components/ui/button";
import { Code, Database, Globe, Smartphone, Zap, Paintbrush, ArrowRight, Wrench, CheckCircle2 } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { Link } from "react-router-dom";

// Two-tone accent system — alternates the site's primary and accent colors
// instead of a different hue per card, to keep the palette disciplined.
const services = [
  { icon: Globe,      title: "Full-Stack Development",    description: "End-to-end web application development using the MERN stack — from database design to polished, responsive frontends.", features: ["Custom Web Apps", "RESTful APIs", "Database Design", "Cloud Deployment"],       iconBg: "bg-primary/10", iconColor: "text-primary", accentBar: "bg-primary" },
  { icon: Code,       title: "React Development",         description: "Modern, performant React applications with hooks, context, and state management. TypeScript expertise included.",         features: ["SPA Development", "Component Libraries", "State Management", "Performance"],    iconBg: "bg-accent/10",  iconColor: "text-accent",  accentBar: "bg-accent" },
  { icon: Database,   title: "Backend Solutions",         description: "Scalable Node.js backends with Express, authentication, and database integration. Secure and maintainable code.",         features: ["API Development", "Authentication", "Database Integration", "Architecture"],    iconBg: "bg-primary/10", iconColor: "text-primary", accentBar: "bg-primary" },
  { icon: Smartphone, title: "Responsive Design",         description: "Mobile-first, pixel-perfect interfaces that work seamlessly across all devices with modern CSS and animations.",          features: ["Mobile-First Design", "CSS/Tailwind", "Animations", "Cross-Browser Testing"],  iconBg: "bg-accent/10",  iconColor: "text-accent",  accentBar: "bg-accent" },
  { icon: Zap,        title: "Performance Optimization",  description: "Speed up your applications with code splitting, lazy loading, and best practices for optimal user experience.",           features: ["Code Optimization", "Bundle Reduction", "Caching Strategies", "SEO"],          iconBg: "bg-primary/10", iconColor: "text-primary", accentBar: "bg-primary" },
  { icon: Paintbrush, title: "UI/UX Implementation",      description: "Transform designs into pixel-perfect, interactive interfaces with attention to detail and user experience.",              features: ["Design Implementation", "Interactive Elements", "Accessibility", "Systems"],    iconBg: "bg-accent/10",  iconColor: "text-accent",  accentBar: "bg-accent" },
];

interface ServicesProps {
  compactHeader?: boolean;
}

export const Services = ({ compactHeader = false }: ServicesProps) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 });

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
          {services.map((svc, i) => (
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

                <h3 className="text-xl font-bold mb-4 group-hover:text-primary transition-colors">
                  {svc.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {svc.description}
                </p>

                {/* Features */}
                <ul className="space-y-3 pt-5 border-t border-border/40">
                  {svc.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-xs text-muted-foreground">
                      <CheckCircle2 className={`h-4 w-4 ${svc.iconColor} opacity-70 flex-shrink-0`} />
                      {f}
                    </li>
                  ))}
                </ul>
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
