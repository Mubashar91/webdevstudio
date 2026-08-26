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
    <section className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-primary/2 to-transparent pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <p className="text-xs md:text-xs font-bold uppercase tracking-[0.25em] text-muted-foreground/80 mb-3">
            Tech Stack
          </p>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
            Technologies I{" "}
            <span className="gradient-text">Work With</span>
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 md:gap-5 max-w-5xl mx-auto">
          {techs.map((t, i) => (
            <div
              key={t.name}
              className={`tilt-card group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
                border border-border/50 bg-gradient-to-br from-card/90 to-card/70 cursor-default
                hover:border-primary/40 hover:bg-primary/5 hover:shadow-card-hover
                ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
              style={{ transitionDelay: `${i * 30}ms` }}
            >
              <div className="w-10 h-10 flex items-center justify-center group-hover:scale-125 transition-transform duration-300 text-2xl leading-none">
                {t.icon}
              </div>
              <span className="font-bold text-sm md:text-base text-center group-hover:text-primary transition-colors leading-tight">
                {t.name}
              </span>
              <span className="text-[11px] text-muted-foreground/75 text-center leading-tight hidden sm:block">
                {t.cat}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
