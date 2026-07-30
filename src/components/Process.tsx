import { MessageSquare, Pencil, Code, Rocket, ArrowRight } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

// Two-tone accent system — alternates the site's primary and accent colors
// instead of a different hue per step, to keep the palette disciplined.
const steps = [
  {
    number: "01",
    icon: MessageSquare,
    title: "Discovery & Planning",
    description: "We discuss your project goals, requirements, and technical needs. I'll provide a detailed proposal with timeline and deliverables.",
    duration: "1–3 days",
    iconBg: "bg-primary/10 text-primary",
    numBg: "bg-primary",
  },
  {
    number: "02",
    icon: Pencil,
    title: "Design & Architecture",
    description: "Creating wireframes, defining database schemas, and planning the technical architecture for optimal performance and scalability.",
    duration: "3–5 days",
    iconBg: "bg-accent/10 text-accent",
    numBg: "bg-accent",
  },
  {
    number: "03",
    icon: Code,
    title: "Development & Testing",
    description: "Agile development with regular updates. Writing clean, tested code following best practices. You'll see progress in real-time.",
    duration: "2–6 weeks",
    iconBg: "bg-primary/10 text-primary",
    numBg: "bg-primary",
  },
  {
    number: "04",
    icon: Rocket,
    title: "Deployment & Support",
    description: "Launching your application with proper CI/CD setup. Post-launch support included to ensure smooth operations and quick fixes.",
    duration: "1–2 days + ongoing",
    iconBg: "bg-accent/10 text-accent",
    numBg: "bg-accent",
  },
];

export const Process = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-surface-alt pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-primary/4 rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold mb-5">
            <Rocket className="h-4 w-4" />
            My Process
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            How I{" "}
            <span className="bg-gradient-to-r from-primary via-blue-400 to-violet-500 bg-clip-text text-transparent">
              Work
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            A transparent, efficient process designed to deliver exceptional results on time and within budget.
          </p>
        </div>

        {/* Steps */}
        <div className="relative max-w-5xl mx-auto">
          {/* Connector line (desktop) */}
          <div className="hidden lg:block absolute top-16 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30" />

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, i) => (
              <div
                key={step.number}
                className={`group relative flex flex-col transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Number circle */}
                <div className="flex justify-center mb-6 relative z-10">
                  <div className={`w-14 h-14 rounded-2xl ${step.numBg} flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.number}
                  </div>
                  {/* Arrow between steps (desktop) */}
                  {i < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-1/2 -translate-y-1/2 -right-3 z-20">
                      <ArrowRight className="h-4 w-4 text-muted-foreground/40" />
                    </div>
                  )}
                </div>

                {/* Card */}
                <div className="tilt-card flex-1 rounded-2xl border border-border/50 bg-card p-6 hover:border-primary/30 hover:shadow-[0_8px_30px_hsl(var(--primary)/0.1)]">
                  {/* Icon */}
                  <div className={`inline-flex p-3 rounded-xl ${step.iconBg} mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <step.icon className="h-5 w-5" />
                  </div>

                  <h3 className="font-bold text-base mb-2 group-hover:text-primary transition-colors">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                    {step.description}
                  </p>

                  {/* Duration badge */}
                  <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full ${step.iconBg} text-xs font-semibold`}>
                    <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
                    {step.duration}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
