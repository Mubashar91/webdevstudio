import { Award, BookOpen, CalendarClock, GitBranch } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { useState, useEffect } from "react";
import { BLOG_POSTS } from "@/data/blogs";
import { STATIC_PROJECTS } from "@/data/projects";

/**
 * "5.0 Average Rating" was removed here.
 *
 * There are no published reviews, no testimonials and no third-party rating
 * source anywhere on the site, so a precise 5.0 was a claim nothing could
 * back — flagged in two consecutive audits. A visitor who scrolls looking for
 * the reviews behind it finds none, which costs more trust than the number
 * buys. Replaced with response time, which is a real, verifiable commitment
 * already promised on the contact page.
 *
 * If a verifiable rating ever exists (Google Business Profile, Clutch,
 * Trustpilot), bring it back WITH an AggregateRating node pointing at that
 * source — self-reported ratings are ineligible for rich results anyway.
 *
 * "8+ Certifications" was removed for the same reason, and it was worse: the
 * About page's own Certifications section names exactly one credential (PMP),
 * so the site contradicted itself two clicks apart. An inflated round number
 * sitting beside real figures invites a visitor to discount those too.
 * Replaced with years of practice, which the dated work-history timeline on
 * /about actually substantiates.
 *
 * To put a certification tile back: name every credential on /about with its
 * issuing body, then make the number here match that list exactly.
 */
/**
 * Every number here resolves to something a visitor can check in one click.
 *
 * "30+ Happy Clients" and "50+ Projects Done" were removed for the same reason
 * as the certifications tile: nothing on the site substantiates them. A round,
 * unverifiable figure is worth less than no figure, because a visitor who
 * doubts one number starts discounting the ones that are true — and the honest
 * assets here (published fixed pricing, a dated work history) are unusual
 * enough for a freelance site that they're worth protecting.
 *
 * The two counts are derived from the actual arrays, so they can't drift as
 * work is added and they can't overstate: the portfolio and blog pages hold
 * exactly what these claim.
 *
 * To put client or project totals back, they need evidence on the site first —
 * named testimonials, or case studies covering the count being claimed.
 */
const items = [
  { icon: GitBranch,     value: String(STATIC_PROJECTS.length), suffix: "",  label: "Case Studies",  sub: "Written up in full" },
  { icon: Award,         value: "5",                            suffix: "+", label: "Years Building", sub: "Since 2020" },
  { icon: CalendarClock, value: "24",                           suffix: "h", label: "Response Time",  sub: "Every enquiry" },
  // "React, TS & MERN" is left over from the blog's old identity. It was
  // repositioned to business guides — the /blogs title, description and
  // subhead all say so — and this label was the last place still describing
  // it as a developer blog to the buyers it's now written for.
  { icon: BookOpen,      value: String(BLOG_POSTS.length),      suffix: "",  label: "Guides",         sub: "Costs, hiring & web" },
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
