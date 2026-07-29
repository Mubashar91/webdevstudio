import { Link } from "react-router-dom";
import {
  ArrowRight, Github, Linkedin, Mail,
  Code2, Award, Briefcase, Sparkles, ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScenePointer } from "@/hooks/use-scene-pointer";

const socials = [
  { href: "https://github.com/mubasharshahzad",      icon: Github,   label: "GitHub" },
  { href: "https://linkedin.com/in/mubasharshahzad", icon: Linkedin, label: "LinkedIn" },
  { href: "mailto:mmubasharshahzad40@gmail.com",     icon: Mail,     label: "Email" },
];

const stats = [
  { icon: Code2,     value: "5+",  label: "Years" },
  { icon: Briefcase, value: "50+", label: "Projects" },
  { icon: Award,     value: "30+", label: "Clients" },
];

export const Hero = () => {
  const scroll = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const scene = useScenePointer();

  return (
    <section
      id="hero"
      ref={scene.ref as React.RefObject<HTMLElement>}
      onMouseMove={scene.onMouseMove}
      onMouseLeave={scene.onMouseLeave}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-[hsl(224,45%,7%)]"
      style={{ perspective: "1400px" }}
    >
      {/* ── Background — aurora mesh, no stock imagery ── */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(224,45%,7%)] via-[hsl(226,42%,9%)] to-[hsl(224,45%,6%)]" />

      {/* Aurora blobs — each has an outer wrapper for mouse parallax and an
          inner element for ambient drift, since a CSS animation's transform
          always overrides an inline-style transform on the same element. */}
      <div
        className="absolute -top-20 -left-32 w-[640px] h-[640px] pointer-events-none transition-transform duration-500 ease-out"
        style={{ transform: `translate(${-scene.point.x * 26}px, ${-scene.point.y * 26}px)` }}
      >
        <div className="w-full h-full rounded-full bg-primary/30 blur-[120px] animate-aurora-1" />
      </div>
      <div
        className="absolute top-1/3 -right-24 w-[560px] h-[560px] pointer-events-none transition-transform duration-500 ease-out"
        style={{ transform: `translate(${-scene.point.x * 34}px, ${-scene.point.y * 34}px)` }}
      >
        <div className="w-full h-full rounded-full bg-violet-500/26 blur-[120px] animate-aurora-2" />
      </div>
      <div
        className="absolute -bottom-24 left-1/4 w-[520px] h-[520px] pointer-events-none transition-transform duration-500 ease-out"
        style={{ transform: `translate(${-scene.point.x * 18}px, ${-scene.point.y * 18}px)` }}
      >
        <div className="w-full h-full rounded-full bg-cyan-500/18 blur-[130px] animate-aurora-3" />
      </div>
      <div
        className="absolute top-10 left-1/2 w-[420px] h-[420px] pointer-events-none transition-transform duration-500 ease-out"
        style={{ transform: `translate(${-scene.point.x * 12}px, ${-scene.point.y * 12}px)` }}
      >
        <div className="w-full h-full rounded-full bg-primary/12 blur-[110px] animate-aurora-4" />
      </div>

      <div className="absolute inset-0 noise opacity-30" />
      <div className="absolute inset-0 bg-gradient-to-t from-[hsl(224,45%,7%)] via-transparent to-[hsl(224,45%,7%)]/45" />

      {/* ── Content ── */}
      <div className="container mx-auto px-6 relative z-10 pt-28 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* ── Left column ── */}
            <div className="flex-1 text-center lg:text-left">

              {/* Status badge */}
              <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full
                bg-white/8 border border-white/15 text-white text-sm font-bold
                mb-10 animate-fade-in backdrop-blur-md">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
                </span>
                Available for Freelance Work
              </div>

              {/* Headline */}
              <h1 className="font-extrabold mb-8 animate-fade-in tracking-tight">
                <span className="block text-base md:text-lg text-white/55 font-bold mb-4 tracking-[0.2em] uppercase">
                  Hi, I'm
                </span>

                <span className="block text-6xl md:text-7xl lg:text-8xl leading-[0.9] mb-4">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-violet-300 bg-clip-text text-transparent">
                    Mubashar
                  </span>
                </span>

                <span className="block text-2xl md:text-3xl lg:text-4xl text-white/85 font-bold leading-tight">
                  Frontend Developer
                </span>
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg text-white/60 leading-relaxed mb-12
                max-w-lg mx-auto lg:mx-0 animate-fade-in">
                Crafting high-performance, responsive web applications with{" "}
                <span className="text-white font-bold">React</span>,{" "}
                <span className="text-white font-bold">TypeScript</span> &amp; the{" "}
                <span className="text-white font-bold">MERN stack</span>.
                Turning complex problems into elegant, user-friendly solutions.
              </p>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start
                gap-4 mb-14 animate-fade-in">
                <Button
                  size="lg"
                  className="group w-full sm:w-auto h-13 px-9 font-bold gap-2.5 rounded-2xl
                    bg-primary hover:bg-primary/95 text-white
                    shadow-[0_0_0_1px_hsl(224_82%_55%/0.35),0_10px_40px_hsl(224_82%_55%/0.4)]
                    hover:shadow-[0_0_0_1px_hsl(224_82%_55%/0.5),0_14px_48px_hsl(224_82%_55%/0.55)]
                    transition-all duration-300 hover:-translate-y-1"
                  onClick={() => scroll("projects")}
                >
                  <Sparkles className="h-4 w-4" />
                  View My Work
                  <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="w-full sm:w-auto h-13 px-9 font-bold gap-2.5 rounded-2xl
                    border-white/25 bg-white/8 text-white
                    hover:bg-white/14 hover:border-white/40
                    backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
                >
                  <Link to="/contact">
                    <Mail className="h-4 w-4" />
                    Hire Me
                  </Link>
                </Button>
              </div>

              {/* Social links */}
              <div className="flex items-center justify-center lg:justify-start gap-3.5 animate-fade-in">
                <span className="text-[11px] text-white/40 font-bold uppercase tracking-[0.2em]">
                  Find me on
                </span>
                <div className="h-px w-7 bg-white/20" />
                {socials.map(({ href, icon: Icon, label }) => (
                  <a
                    key={label}
                    href={href}
                    target={href.startsWith("http") ? "_blank" : undefined}
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="p-3 rounded-xl bg-white/8 border border-white/15 text-white/60
                      hover:text-white hover:border-white/35 hover:bg-white/14
                      hover:scale-110 transition-all duration-300 backdrop-blur-sm"
                  >
                    <Icon className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* ── Right — Code editor visual, tilts with the whole hero scene ── */}
            <div
              className="w-full lg:w-[380px] xl:w-[420px] animate-fade-in-up"
              style={{ perspective: "1200px" }}
            >
              <div
                style={{
                  transform: `rotateY(${scene.point.x * 9}deg) rotateX(${-scene.point.y * 9}deg)`,
                  transition: "transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
                className="relative"
              >
                {/* Stacked ghost layers behind the card — gives it physical depth */}
                <div className="absolute inset-0 translate-x-4 translate-y-6 rounded-2xl
                  bg-[hsl(224,30%,12%)]/50 border border-white/[0.04]" />
                <div className="absolute inset-0 translate-x-2 translate-y-3 rounded-2xl
                  bg-[hsl(224,30%,11%)]/70 border border-white/[0.06]" />

                {/* Soft glow behind card */}
                <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br
                  from-primary/25 via-violet-500/15 to-transparent blur-2xl" />

                {/* Editor card */}
                <div className="relative rounded-2xl bg-[hsl(224,32%,10%)]/95 border border-white/10
                  backdrop-blur-2xl shadow-[0_40px_96px_rgba(0,0,0,0.5)] overflow-hidden">

                  {/* Title bar */}
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-white/10 bg-white/[0.03]">
                    <span className="w-3 h-3 rounded-full bg-red-500/70" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/70" />
                    <span className="w-3 h-3 rounded-full bg-green-500/70" />
                    <span className="ml-3 text-xs text-white/35 font-mono">developer.ts</span>
                  </div>

                  {/* Code body — every character is explicitly colored (never inherited)
                      because this card always sits on a hardcoded-dark surface regardless
                      of the site's light/dark theme; inherited text-foreground would be
                      near-black in light mode and disappear against this dark card. */}
                  <div className="px-6 py-6 font-mono text-[12.5px] leading-[1.9] overflow-x-auto text-white/70">
                    <p><span className="text-violet-400">const</span> <span className="text-sky-300">developer</span> <span className="text-white/50">=</span> <span className="text-white/70">{"{"}</span></p>
                    <p className="pl-4"><span className="text-blue-300">name</span><span className="text-white/50">:</span> <span className="text-emerald-300">"Mubashar Shahzad"</span><span className="text-white/70">,</span></p>
                    <p className="pl-4"><span className="text-blue-300">role</span><span className="text-white/50">:</span> <span className="text-emerald-300">"Frontend Engineer"</span><span className="text-white/70">,</span></p>
                    <p className="pl-4"><span className="text-blue-300">stack</span><span className="text-white/50">:</span> <span className="text-white/50">[</span><span className="text-emerald-300">"React"</span><span className="text-white/50">,</span> <span className="text-emerald-300">"TypeScript"</span><span className="text-white/50">,</span> <span className="text-emerald-300">"Node"</span><span className="text-white/50">],</span></p>
                    <p className="pl-4"><span className="text-blue-300">location</span><span className="text-white/50">:</span> <span className="text-emerald-300">"Remote · Worldwide"</span><span className="text-white/70">,</span></p>
                    <p className="pl-4"><span className="text-blue-300">available</span><span className="text-white/50">:</span> <span className="text-amber-300">true</span><span className="text-white/70">,</span></p>
                    <p><span className="text-white/70">{"};"}</span></p>
                  </div>

                  <div className="h-px bg-white/10" />

                  {/* Stat strip */}
                  <div className="grid grid-cols-3 divide-x divide-white/10">
                    {stats.map(({ icon: Icon, value, label }) => (
                      <div
                        key={label}
                        className="flex flex-col items-center gap-1.5 py-5 group hover:bg-white/[0.03] transition-colors duration-300"
                      >
                        <Icon className="h-4 w-4 text-primary" />
                        <span className="text-lg font-extrabold text-white leading-none">{value}</span>
                        <span className="text-[10px] text-white/45 font-bold uppercase tracking-wide">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2.5 opacity-50">
        <ChevronDown className="h-6 w-6 text-white animate-bounce" />
        <span className="text-[11px] text-white/65 tracking-[0.25em] uppercase font-bold">Scroll</span>
      </div>
    </section>
  );
};
