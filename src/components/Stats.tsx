import { Award, GitBranch, Star, Users2 } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useState, useEffect } from "react";

const items = [
  { icon: Users2,    value: "30",  suffix: "+", label: "Happy Clients",   sub: "Worldwide" },
  { icon: GitBranch, value: "50",  suffix: "+", label: "Projects Done",   sub: "Delivered" },
  { icon: Star,      value: "5.0", suffix: "",  label: "Average Rating",  sub: "Client Satisfaction" },
  { icon: Award,     value: "8",   suffix: "+", label: "Certifications",  sub: "Professional" },
];

// Two-tone accent system — alternates the site's primary and accent colors
// instead of a different hue per card, to keep the palette disciplined.
const tones = [
  { iconBg: "bg-primary/10", iconColor: "text-primary", bar: "bg-primary" },
  { iconBg: "bg-accent/10", iconColor: "text-accent", bar: "bg-accent" },
];

const Counter = ({ target, suffix }: { target: string; suffix: string }) => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.5 });
  // Seeded with the real figure, not "0".
  //
  // The count-up lives in an effect, which does not run during prerendering,
  // so the static HTML read "0+ Happy Clients" and "0+ Projects Done" — the
  // exact opposite of the credibility these counters exist to convey. The
  // client resets to zero and animates only when it can actually animate.
  const [display, setDisplay] = useState(target);

  useEffect(() => {
    if (!isVisible) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const num = parseFloat(target);
    if (isNaN(num)) { setDisplay(target); return; }
    const dec = target.includes(".");
    const steps = 60, dur = 1800;
    let s = 0;
    setDisplay(dec ? "0.0" : "0");
    const t = setInterval(() => {
      s++;
      const e = 1 - Math.pow(1 - s / steps, 3);
      setDisplay(dec ? (num * e).toFixed(1) : Math.floor(num * e).toString());
      if (s >= steps) { setDisplay(target); clearInterval(t); }
    }, dur / steps);
    return () => clearInterval(t);
  }, [isVisible, target]);

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-extrabold tabular-nums leading-none text-foreground">
      {display}{suffix}
    </div>
  );
};

export const Stats = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.15 });

  return (
    <section className="py-24 relative overflow-hidden" aria-label="Professional statistics">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/4 via-transparent to-violet-500/4 pointer-events-none animate-gradient" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6 max-w-5xl mx-auto">
          {items.map((item, i) => {
            const tone = tones[i % tones.length];
            return (
              <div
                key={item.label}
                className={`tilt-card group relative flex flex-col items-center text-center p-7 md:p-9
                  rounded-2xl border border-border/50 bg-card overflow-hidden shadow-card
                  hover:border-primary/30 hover:shadow-card-hover
                  cursor-default
                  ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Icon */}
                <div className={`relative z-10 inline-flex p-4 rounded-2xl ${tone.iconBg} ${tone.iconColor}
                  mb-5 group-hover:scale-110 transition-transform duration-400`}>
                  <item.icon className="h-7 w-7" />
                </div>

                <div className="relative z-10">
                  <Counter target={item.value} suffix={item.suffix} />
                  <p className="font-bold text-sm mt-3 mb-0.5">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sub}</p>
                </div>

                {/* Bottom accent bar */}
                <div className={`absolute bottom-0 left-0 right-0 h-[3px] ${tone.bar}
                  scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left`} />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
