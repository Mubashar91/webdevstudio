import { Card } from "@/components/ui/card";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useState, useEffect } from "react";
import { Cpu } from "lucide-react";

// Two-tone accent system — alternates the site's primary and accent colors
// instead of a different hue per category, to keep the palette disciplined.
const skillCategories = [
  {
    category: "Frontend Development",
    color: "from-primary/8 to-primary/3 border-primary/20",
    dot: "bg-primary",
    bar: "from-primary to-primary/70",
    skills: [
      { name: "React & Next.js", level: 95 },
      { name: "TypeScript", level: 90 },
      { name: "HTML5 & CSS3", level: 95 },
      { name: "Tailwind CSS", level: 92 },
      { name: "Redux & State Management", level: 88 },
    ],
  },
  {
    category: "Backend Development",
    color: "from-accent/8 to-accent/3 border-accent/20",
    dot: "bg-accent",
    bar: "from-accent to-accent/70",
    skills: [
      { name: "Node.js & Express", level: 93 },
      { name: "RESTful APIs", level: 95 },
      { name: "GraphQL", level: 85 },
      { name: "WebSocket & Real-time", level: 87 },
      { name: "Microservices", level: 82 },
    ],
  },
  {
    category: "Database & Storage",
    color: "from-primary/8 to-primary/3 border-primary/20",
    dot: "bg-primary",
    bar: "from-primary to-primary/70",
    skills: [
      { name: "MongoDB", level: 92 },
      { name: "PostgreSQL", level: 88 },
      { name: "Redis", level: 85 },
      { name: "Firebase", level: 87 },
      { name: "AWS S3", level: 90 },
    ],
  },
  {
    category: "DevOps & Tools",
    color: "from-accent/8 to-accent/3 border-accent/20",
    dot: "bg-accent",
    bar: "from-accent to-accent/70",
    skills: [
      { name: "Git & GitHub", level: 95 },
      { name: "Docker", level: 85 },
      { name: "AWS Services", level: 82 },
      { name: "CI/CD Pipelines", level: 80 },
      { name: "Testing (Jest, Cypress)", level: 87 },
    ],
  },
];

const SkillBar = ({
  skill,
  delay,
  barGradient,
}: {
  skill: { name: string; level: number };
  delay: number;
  barGradient: string;
}) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.4 });
  // Starts at the FINAL value, not 0.
  //
  // The count-up runs in an effect, which never executes during prerendering,
  // so the static HTML shipped a literal "0" for every skill bar and trust
  // stat — on the pages whose entire job is credibility. Seeding the real
  // number means crawlers read the truth; the client resets to 0 and animates
  // up only once it's confirmed it can actually run the animation.
  const [value, setValue] = useState(skill.level);

  useEffect(() => {
    if (!isVisible) return;
    // Reduced-motion users keep the static value rather than seeing it
    // reset and re-count.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setValue(0);
    const t = setTimeout(() => {
      const steps = 50;
      const duration = 900;
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = 1 - Math.pow(1 - step / steps, 3);
        setValue(Math.round(skill.level * progress));
        if (step >= steps) { setValue(skill.level); clearInterval(timer); }
      }, duration / steps);
      return () => clearInterval(timer);
    }, delay);
    return () => clearTimeout(t);
  }, [isVisible, skill.level, delay]);

  return (
    <div ref={ref} className="group">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-sm font-medium">{skill.name}</span>
        <span className="text-xs font-semibold text-muted-foreground tabular-nums">{value}%</span>
      </div>
      <div className="h-2 rounded-full bg-muted/60 overflow-hidden">
        <div
          className={`h-full rounded-full bg-gradient-to-r ${barGradient} transition-all duration-700 ease-out`}
          style={{ width: `${value}%` }}
        />
      </div>
    </div>
  );
};

export const Skills = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  return (
    <section id="skills" className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-surface-alt pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-20 pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        {/* Header */}
        <div className={`text-center mb-14 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="section-label mb-5">
            <Cpu className="h-4 w-4" />
            Technical Skills
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-4 tracking-tight">
            Technical{" "}
            <span className="gradient-text">Expertise</span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Proficient in modern web technologies with hands-on experience building production-grade applications
          </p>
        </div>

        {/* Grid */}
        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {skillCategories.map((cat, ci) => (
            <Card
              key={cat.category}
              className={`tilt-card relative overflow-hidden border bg-gradient-to-br ${cat.color}
                hover:shadow-card-hover p-7
                ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
              style={{ transitionDelay: `${ci * 100}ms` }}
            >
              {/* Category header */}
              <h3 className="text-base font-bold mb-6 flex items-center gap-2.5">
                <span className={`w-2.5 h-2.5 rounded-full ${cat.dot} shadow-sm`} />
                {cat.category}
              </h3>

              <div className="space-y-5">
                {cat.skills.map((skill, si) => (
                  <SkillBar
                    key={skill.name}
                    skill={skill}
                    delay={ci * 100 + si * 80}
                    barGradient={cat.bar}
                  />
                ))}
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};
