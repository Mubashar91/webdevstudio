import { Badge } from "@/components/ui/badge";
import { Briefcase, GraduationCap, Mail, Phone, MapPin, CheckCircle2, User, Calendar } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { CONTACT_EMAIL, TELEPHONE } from "@/lib/site.config.mjs";

/**
 * Work history. `current: true` marks the present role.
 *
 * The WebDevStudio entry leads because the rest of the site — the hero, the
 * meta description and the Person schema's jobTitle — all describe Mubashar as
 * its founder. Previously this list opened with an employed role at another
 * company still tagged "Current" (13 months after it ended), so the page read
 * as an unedited CV and directly contradicted the site's own entity narrative.
 * An SEO audit rated that the single highest-risk accuracy issue on the site.
 */
const experiences = [
  {
    role: "Founder & Lead Developer",
    company: "WebDevStudio",
    location: "Remote — worldwide",
    period: "2020 – Present",
    current: true,
    color: "from-primary to-violet-600",
    points: [
      "Run an independent React, TypeScript and MERN stack practice serving clients in New Zealand, Cyprus, the UK and beyond",
      "Scope and deliver fixed-price projects end to end — discovery, build, deployment and post-launch support",
      "Specialise in performance, accessibility and SEO-ready builds that clients can actually be found through",
      "Work directly with founders and small teams, with no agency layer in between",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Codewire Solution",
    location: "Vehari",
    period: "Mar 2025 – Jul 2025",
    current: false,
    color: "from-primary to-blue-500",
    points: [
      "Designed and developed responsive web & mobile apps using React.js",
      "Built secure authentication systems with access and refresh tokens",
      "Created and integrated RESTful APIs for frontend-backend communication",
      "Implemented role-based access control for user permissions",
      "Optimized applications for performance, SEO, and cross-device compatibility",
    ],
  },
  {
    role: "Trainee MERN Developer",
    company: "Solvefy",
    location: "Lahore",
    period: "Jul 2021 – Jul 2024",
    current: false,
    color: "from-violet-500 to-purple-500",
    points: [
      "Collaborated with teams to develop responsive, user-centric web applications",
      "Designed intuitive UIs with HTML, CSS, Bootstrap, Tailwind, and Vue.js",
      "Ensured cross-browser and cross-device compatibility",
      "Integrated APIs for seamless data flow between frontend and backend",
      "Worked closely with clients to gather requirements and deliver solutions",
    ],
  },
];

export const About = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.05 });

  return (
    <section id="about" className="py-32 relative overflow-hidden">
      <div className="absolute inset-0 dot-grid opacity-[0.15] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[700px] h-[700px] bg-primary/6 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-violet-500/6 rounded-full blur-[140px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">

        {/* Header */}
        <div className={`text-center mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="section-label mb-8">
            <User className="h-5 w-5" />
            About Me
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 tracking-tight">
            Muhammad Mubashar{" "}
            <span className="gradient-text">Shahzad</span>
          </h1>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground">
            {[
              { icon: MapPin, text: "Mian Channu, Pakistan" },
              { icon: Mail,   text: CONTACT_EMAIL,     href: `mailto:${CONTACT_EMAIL}` },
              { icon: Phone,  text: "+92 309 6403160", href: `tel:${TELEPHONE}` },
            ].map(({ icon: Icon, text, href }) => (
              <div key={text} className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary/60" />
                {href
                  ? <a href={href} className="hover:text-primary transition-colors underline-anim">{text}</a>
                  : <span>{text}</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Summary */}
        <div className={`max-w-4xl mx-auto mb-20 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="relative overflow-hidden rounded-2xl border border-border/50 bg-card shadow-card p-9 pl-12">
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-b from-primary to-violet-500 rounded-l-2xl" />
            <h2 className="text-xl font-bold mb-5 flex items-center gap-3">
              <span className="w-2.5 h-2.5 rounded-full bg-primary" />
              Professional Summary
            </h2>
            {/* First person, founder-first. The previous copy was third-person
                CV boilerplate that never named WebDevStudio, contradicting the
                hero, the meta description and the Person schema. It also left
                the "5+ years" claim unexplained against a work history showing
                ~3.4 employed years — the freelance start date bridges that. */}
            <p className="text-muted-foreground leading-relaxed text-base">
              I'm Muhammad Mubashar Shahzad, and I run WebDevStudio — an independent React,
              TypeScript and MERN stack practice I started in 2020. I've been building for the
              web for over five years: first freelancing alongside agency and in-house roles,
              and now full time for clients in New Zealand, Cyprus, the UK and beyond.
            </p>
            <p className="text-muted-foreground leading-relaxed text-base mt-4">
              I work the way I'd want to be worked with. You get a fixed price and a written
              scope before anything starts, you talk to the person actually writing the code,
              and there's no agency margin on top. Most of what I build is a marketing site or
              a full web application — always fast, accessible, and set up so search engines
              and customers can actually find it.
            </p>
          </div>
        </div>

        {/* Experience */}
        <div className={`mb-20 max-w-5xl mx-auto transition-all duration-700 delay-150 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-4 text-center">
            Work <span className="gradient-text">Experience</span>
          </h2>
          {/* The WebDevStudio, Solvefy and BIT-degree periods below overlap on
              the calendar — that's freelance work running alongside study and
              employment, not three conflicting timelines. Said once here so it
              doesn't have to be inferred from the dates. */}
          <p className="text-center text-sm text-muted-foreground max-w-2xl mx-auto mb-10">
            WebDevStudio ran part-time from the start — alongside the degree below and the
            employed roles here — before becoming my full-time focus.
          </p>

          <div className="relative">
            {/* Timeline line */}
            <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-primary/60 via-violet-500/40 to-transparent hidden md:block" />

            <div className="space-y-10">
              {experiences.map((exp, i) => (
                <div
                  key={exp.company}
                  className={`relative flex gap-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-10"}`}
                  style={{ transitionDelay: `${200 + i * 150}ms` }}
                >
                  {/* Timeline node */}
                  <div className="hidden md:flex flex-col items-center flex-shrink-0">
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center z-10 shadow-card
                      ${exp.current
                        ? `bg-gradient-to-br ${exp.color} text-white shadow-glow-sm`
                        : "bg-card border-2 border-primary/40 text-primary"}`}>
                      <Briefcase className="h-6 w-6" />
                    </div>
                  </div>

                  {/* Card */}
                  <div className="flex-1 rounded-2xl border border-border/50 bg-card shadow-card
                    hover:border-primary/40 hover:shadow-card-hover transition-all duration-400 overflow-hidden">
                    {/* Top gradient bar */}
                    <div className={`h-1.5 bg-gradient-to-r ${exp.color}`} />
                    <div className="p-8">
                      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
                        <div>
                          <h3 className="text-xl font-bold mb-1">{exp.role}</h3>
                          <p className="text-primary font-semibold text-sm">{exp.company}, {exp.location}</p>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/70 px-4 py-2 rounded-full border border-border/45">
                            <Calendar className="h-3.5 w-3.5" />
                            {exp.period}
                          </div>
                          {exp.current && (
                            <span className="flex items-center gap-2 text-xs text-green-600 dark:text-green-400 font-bold bg-green-500/12 px-3 py-1.5 rounded-full border border-green-500/25">
                              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                              Current
                            </span>
                          )}
                        </div>
                      </div>
                      <ul className="space-y-3">
                        {exp.points.map(point => (
                          <li key={point} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="h-4.5 w-4.5 text-primary/60 mt-0.5 flex-shrink-0" />
                            <span>{point}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Education */}
        <div className={`mb-16 max-w-5xl mx-auto transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="flex gap-8">
            <div className="hidden md:flex flex-col items-center flex-shrink-0">
              <div className="w-14 h-14 rounded-2xl bg-violet-500/12 border-2 border-violet-500/30 text-violet-500 flex items-center justify-center shadow-card">
                <GraduationCap className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1 rounded-2xl border border-border/50 bg-card shadow-card
              hover:border-violet-500/40 hover:shadow-card-hover transition-all duration-400 overflow-hidden">
              <div className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-500" />
              <div className="p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-bold mb-1">Bachelor of Information Technology (BIT)</h3>
                    <p className="text-violet-500 font-semibold text-sm">University of Education, Lahore</p>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/70 px-4 py-2 rounded-full border border-border/45">
                    <Calendar className="h-3.5 w-3.5" />
                    Jul 2021 – Jul 2024
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional info */}
        <div className={`max-w-5xl mx-auto transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
          <div className="grid md:grid-cols-2 gap-6">
            {[
              { label: "Languages",      value: "English, Urdu",                    grad: "from-primary/10 to-blue-500/10",    border: "border-primary/22",    dot: "bg-primary" },
              { label: "Certifications", value: "Project Management Professional",  grad: "from-violet-500/10 to-purple-500/10", border: "border-violet-500/22", dot: "bg-violet-500" },
            ].map(({ label, value, grad, border, dot }) => (
              <div key={label}
                className={`p-7 rounded-2xl border ${border} bg-gradient-to-br ${grad}
                  hover:shadow-card-hover transition-all duration-400`}>
                <div className="flex items-center gap-3 mb-3">
                  <span className={`w-2.5 h-2.5 rounded-full ${dot}`} />
                  <h4 className="text-xs font-bold text-primary uppercase tracking-[0.14em]">{label}</h4>
                </div>
                <p className="text-foreground font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};
