import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const techs = [
  { name: "React",      icon: "⚛️",  cat: "Frontend" },
  { name: "Next.js",    icon: "▲",   cat: "Frontend" },
  { name: "TypeScript", icon: "TS",  cat: "Language" },
  { name: "Node.js",    icon: "🟢",  cat: "Backend" },
  { name: "Express",    icon: "⚡",  cat: "Backend" },
  { name: "MongoDB",    icon: "🍃",  cat: "Database" },
  { name: "PostgreSQL", icon: "🐘",  cat: "Database" },
  { name: "Redis",      icon: "🔴",  cat: "Cache" },
  { name: "Docker",     icon: "🐳",  cat: "DevOps" },
  { name: "AWS",        icon: "☁️",  cat: "Cloud" },
  { name: "GraphQL",    icon: "◈",   cat: "API" },
  { name: "Tailwind",   icon: "🎨",  cat: "Styling" },
];

export const TechStack = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/2 to-transparent pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-muted-foreground/50 mb-3">
            Tech Stack
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Technologies I{" "}
            <span className="gradient-text">Work With</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-w-3xl mx-auto">
          {techs.map((t, i) => (
            <div
              key={t.name}
              className={`tilt-card group flex flex-col items-center gap-2 p-4 rounded-2xl
                border border-border/40 bg-card/80 cursor-default
                hover:border-primary/40 hover:bg-primary/5 hover:shadow-card-hover
                ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <span className="text-2xl leading-none group-hover:scale-125 transition-transform duration-300">
                {t.icon}
              </span>
              <span className="font-bold text-[11px] text-center group-hover:text-primary transition-colors leading-tight">
                {t.name}
              </span>
              <span className="text-[9px] text-muted-foreground/50 text-center leading-tight hidden sm:block">
                {t.cat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
