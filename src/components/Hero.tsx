import { Link } from "react-router-dom";
import {
  ArrowRight, Github, Linkedin, Mail,
  Code2, Award, Briefcase, Calendar, ChevronDown, Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useScenePointer } from "@/hooks/use-scene-pointer";
import { CONTACT_EMAIL } from "@/lib/site.config.mjs";
import { STATIC_PROJECTS } from "@/data/projects";

const socials = [
  { href: "https://github.com/mubasharshahzad",      icon: Github,   label: "GitHub" },
  { href: "https://linkedin.com/in/mubasharshahzad", icon: Linkedin, label: "LinkedIn" },
  { href: `mailto:${CONTACT_EMAIL}`,                 icon: Mail,     label: "Email" },
];

/**
 * Hero stat chips.
 *
 * "50+ Projects" and "30+ Clients" were removed: nothing on the site
 * substantiates either, and they sat in the first viewport where they set the
 * credibility frame for everything below. See the note in Stats.tsx — the same
 * reasoning applies, and these were the more prominent copy of the claim.
 *
 * What's left is checkable: the timeline on /about dates the practice to 2020,
 * /projects holds exactly the case studies counted, and the response time is a
 * commitment repeated on the contact page rather than a statistic.
 */
const stats = [
  { icon: Code2,     value: "5+", label: "Years" },
  { icon: Briefcase, value: String(STATIC_PROJECTS.length), label: "Case studies" },
  { icon: Award,     value: "24h", label: "Reply time" },
];

/** Objection-handling reassurances placed directly under the primary CTA. */
const ctaAssurances = ["No obligation", "Fixed-price quotes", "Reply within 24h"];

/** Regions with dedicated landing pages — doubles as internal linking to them. */
const regions = [
  { to: "/web-development-new-zealand", label: "New Zealand" },
  { to: "/web-development-cyprus", label: "Cyprus" },
];

/**
 * "Booking <next month>" — derived rather than hardcoded so the badge can
 * never go stale and quietly advertise a month that has already passed.
 */
function nextBookingWindow(): string {
  const d = new Date();
  d.setDate(1);
  d.setMonth(d.getMonth() + 1);
  return d.toLocaleDateString("en-US", { month: "long" });
}

export const Hero = () => {
  const scroll = (id: string) =>
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const scene = useScenePointer();
  const bookingWindow = nextBookingWindow();

  return (
    /* min-h-svh, not min-h-screen: 100vh on mobile browsers includes the
       collapsing URL bar, so the hero measured taller than the visible area
       and its lower content sat under the chrome on first paint. */
    <section
      id="hero"
      ref={scene.ref as React.RefObject<HTMLElement>}
      onMouseMove={scene.onMouseMove}
      onMouseLeave={scene.onMouseLeave}
      className="relative min-h-svh flex items-center justify-center overflow-hidden bg-surface-deep"
      style={{ perspective: "1400px" }}
    >
      {/* ── Background — aurora mesh, no stock imagery ──
           Base tone comes from --surface-deep so the hero and the CTA band
           share one value instead of each hardcoding a slightly different hsl. */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-deep via-[hsl(226,42%,9%)] to-[hsl(224,45%,6%)] dark:via-[hsl(226,30%,7%)] dark:to-[hsl(224,32%,4%)]" />

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
      <div className="absolute inset-0 bg-gradient-to-t from-surface-deep via-transparent to-surface-deep/45" />

      {/* Blends the hero into the page below in dark mode, where the hero base
          and --background are only a few percent apart and the hard edge read
          as a banding artefact. In light mode the dark hero is meant to meet
          the light page with a crisp edge, so this is dark-only. */}
      <div className="hidden dark:block absolute inset-x-0 bottom-0 h-40 pointer-events-none
        bg-gradient-to-b from-transparent to-background" />

      {/* ── Content ── */}
      <div className="container mx-auto px-6 relative z-10 pt-24 pb-16 md:pt-28 md:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-10 md:gap-14 lg:gap-24">

            {/* ── Left column ── */}
            <div className="flex-1 text-center lg:text-left">

              {/* Status badge. Wording matches the CTA and the OG card —
                  "freelance work" framed this as a job hunt rather than a
                  studio taking briefs. The capacity line gives the badge a
                  reason to exist beyond decoration. */}
              <div className="inline-flex items-center gap-2.5 pl-3 pr-4 py-2 rounded-full
                bg-white/[0.07] border border-white/12 text-white text-[13px] font-semibold
                mb-6 md:mb-8 animate-fade-in backdrop-blur-md">
                <span className="relative flex h-2 w-2 ml-1">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400" />
                </span>
                Available for new projects
                {/* Secondary half hidden on phones, where it forced the badge
                    to wrap onto two cramped lines. */}
                <span className="hidden sm:inline text-white/25" aria-hidden="true">|</span>
                {/* suppressHydrationWarning because this text is deliberately
                    time-dependent: the prerenderer bakes the month at BUILD
                    time, the browser computes it at VISIT time, and the two
                    stop agreeing the moment the calendar rolls over. Without
                    this, the first visitor of a new month triggers a text
                    mismatch (React #418), and because the badge sits outside
                    any Suspense boundary React escalates to #423 and re-renders
                    the entire root on the client — discarding the prerendered
                    HTML this site's LCP and AI-crawler story depends on.
                    The badge is decorative, so tolerating the difference is
                    correct; the client value wins after hydration. */}
                <span
                  className="hidden sm:inline text-white/50 font-medium"
                  suppressHydrationWarning
                >
                  Booking {bookingWindow}
                </span>
              </div>

              {/* Headline — leads with the offer and its keywords rather than
                  an introduction. The founder's name moves to the byline below:
                  visitors deciding whether to hire still see it, but the H1 now
                  carries the terms people actually search for. */}
              <h1 className="font-extrabold mb-5 md:mb-7 animate-fade-in tracking-tight">
                <span className="block text-4xl md:text-6xl lg:text-[4.2rem] leading-[1.02] mb-3">
                  <span className="bg-gradient-to-r from-white via-blue-200 to-violet-300 bg-clip-text text-transparent">
                    React &amp; MERN
                  </span>
                  <span className="text-white"> development</span>
                </span>

                <span className="block text-2xl md:text-3xl lg:text-4xl text-white/70 font-bold leading-tight">
                  for growing businesses
                </span>
              </h1>

              {/* Description */}
              <p className="text-base md:text-lg text-white/60 leading-relaxed mb-6 md:mb-8
                max-w-lg mx-auto lg:mx-0 animate-fade-in">
                I design and ship fast, accessible web applications in{" "}
                <span className="text-white font-bold">React</span>,{" "}
                <span className="text-white font-bold">TypeScript</span> and the{" "}
                <span className="text-white font-bold">MERN stack</span> — from
                first wireframe to production deploy. Fixed scope, fixed price,
                no agency overhead.
              </p>

              {/* Founder byline — keeps the personal trust signal the old H1
                  carried, without spending the H1 on it. */}
              <p className="text-sm text-white/45 mb-7 md:mb-10 animate-fade-in">
                Led by{" "}
                <span className="text-white/80 font-semibold">
                  Muhammad Mubashar Shahzad
                </span>{" "}
                {/* "50+ projects delivered" removed: nothing on the site
                    backs it, and it sat directly beside two claims that are
                    documented (the dated timeline on /about, the published
                    fixed prices). Fixed pricing is the stronger differentiator
                    anyway — it's the thing competitors won't copy. */}
                · 5+ years · fixed-price projects
              </p>

              {/* CTA buttons — the primary action is now booking a call rather
                  than browsing work. "Hire Me" asked for a commitment before
                  the visitor had any reason to make one. */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start
                gap-3 md:gap-4 mb-5 animate-fade-in">
                <Button
                  size="lg"
                  asChild
                  className="group w-full sm:w-auto h-13 px-9 font-bold gap-2.5 rounded-2xl
                    bg-primary hover:bg-primary/95 text-white
                    shadow-[0_0_0_1px_hsl(224_82%_55%/0.35),0_10px_40px_hsl(224_82%_55%/0.4)]
                    hover:shadow-[0_0_0_1px_hsl(224_82%_55%/0.5),0_14px_48px_hsl(224_82%_55%/0.55)]
                    transition-all duration-300 hover:-translate-y-1"
                >
                  <Link to="/contact">
                    <Calendar className="h-4 w-4" />
                    Book a free 30-min call
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1.5 transition-transform duration-300" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-13 px-9 font-bold gap-2.5 rounded-2xl
                    border-white/25 bg-white/8 text-white
                    hover:bg-white/14 hover:border-white/40
                    backdrop-blur-md transition-all duration-300 hover:-translate-y-1"
                  onClick={() => scroll("projects")}
                >
                  See recent work
                </Button>
              </div>

              {/* Risk-reversal strip directly under the CTA */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start
                gap-x-5 gap-y-2 mb-8 md:mb-12 animate-fade-in">
                {ctaAssurances.map((item) => (
                  <span key={item} className="inline-flex items-center gap-1.5 text-xs text-white/45 font-medium">
                    <Check className="h-3.5 w-3.5 text-green-400/80" />
                    {item}
                  </span>
                ))}
              </div>

              {/* Divider — replaces the stack of unrelated rows that all sat
                  at the same visual weight with one clear break. */}
              <div className="h-px w-full max-w-sm mx-auto lg:mx-0 bg-gradient-to-r
                from-white/15 via-white/8 to-transparent mb-7" />

              {/* Regions + socials share one row. The region links also give
                  the two location landing pages a link from the homepage,
                  which they previously only had from the footer. */}
              <div className="flex flex-wrap items-center justify-center lg:justify-start
                gap-x-6 gap-y-4 animate-fade-in">
                <p className="text-xs text-white/40 font-medium">
                  Working with clients in{" "}
                  {regions.map((r, i) => (
                    <span key={r.to}>
                      <Link
                        to={r.to}
                        className="text-white/70 font-semibold underline decoration-white/20
                          underline-offset-4 hover:text-white hover:decoration-white/50
                          transition-colors"
                      >
                        {r.label}
                      </Link>
                      {i < regions.length - 1 ? ", " : " "}
                    </span>
                  ))}
                  &amp; worldwide
                </p>

                <div className="flex items-center gap-2.5">
                  {socials.map(({ href, icon: Icon, label }) => (
                    <a
                      key={label}
                      href={href}
                      target={href.startsWith("http") ? "_blank" : undefined}
                      rel="noopener noreferrer"
                      aria-label={label}
                      className="p-3 md:p-2.5 rounded-xl bg-white/[0.06] border border-white/12 text-white/55
                        hover:text-white hover:border-white/30 hover:bg-white/12
                        transition-all duration-300 backdrop-blur-sm"
                    >
                      <Icon className="h-[18px] w-[18px]" />
                    </a>
                  ))}
                </div>
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
                        <span className="text-xs md:text-[10px] text-white/45 font-bold uppercase tracking-wide">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Scroll indicator ──
           Hidden below 780px of viewport height, where the hero content
           already fills the screen and this collided with the CTA row. */}
      <div className="hidden tall:flex absolute bottom-8 left-1/2 -translate-x-1/2
        flex-col items-center gap-2 opacity-40 pointer-events-none">
        <ChevronDown className="h-5 w-5 text-white animate-bounce" />
        <span className="text-xs md:text-[10px] text-white/65 tracking-[0.25em] uppercase font-bold">Scroll</span>
      </div>
    </section>
  );
};
