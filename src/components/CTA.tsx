import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, MessageSquare, Sparkles, CheckCircle2, Clock, RefreshCw, Zap, DollarSign } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

/**
 * "Unlimited revisions" was removed from both lists on 2026-08-11.
 *
 * This component renders on /services, directly beneath a Marketing Site
 * package whose own includes list says "2 rounds of revisions" — so the page
 * contradicted itself within one scroll. /web-development-new-zealand carried
 * a third version ("unlimited revisions within scope").
 *
 * The site also argues against the claim in its own words: the hiring post
 * says unlimited revisions "often mean the scope is vague". Promising it here
 * while calling it a red flag there is the kind of detail a careful buyer
 * notices, and careful buyers are the ones worth winning.
 *
 * If the real policy is a fixed number, put that number in SERVICE_PACKAGES
 * and reference it — a specific promise outsells an unlimited one.
 */
const perks = [
  { icon: CheckCircle2, text: "Free consultation" },
  { icon: DollarSign,   text: "Transparent pricing" },
  { icon: Zap,          text: "Quick response" },
  { icon: RefreshCw,    text: "Revisions agreed upfront" },
];

const details = [
  { label: "Response Time",  value: "< 24 hours" },
  { label: "Project Start",  value: "Within 1 week" },
  { label: "Communication",  value: "Daily updates" },
  { label: "Revisions",      value: "Written into scope" },
];

export const CTA = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.15 });

  return (
    <section className="py-32 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[hsl(224,78%,38%)] via-[hsl(238,72%,44%)] to-[hsl(262,76%,50%)]" />
      <div className="absolute inset-0 dot-grid opacity-10" />
      <div className="absolute inset-0 noise opacity-40" />

      {/* Orbs */}
      <div className="absolute top-0 left-0 w-[700px] h-[700px] bg-white/9 rounded-full blur-[140px] -translate-x-1/3 -translate-y-1/3" />
      <div className="absolute bottom-0 right-0 w-[700px] h-[700px] bg-white/9 rounded-full blur-[140px] translate-x-1/3 translate-y-1/3" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[600px] bg-white/5 rounded-full blur-[120px]" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">
        <div className={`max-w-6xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-12"}`}>
          <div className="flex flex-col lg:flex-row items-center gap-16 lg:gap-24">

            {/* Left */}
            <div className="flex-1 text-center lg:text-left">
              <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full
                bg-white/18 border border-white/28 text-white text-sm font-bold mb-10 backdrop-blur-sm">
                <Sparkles className="h-5 w-5" />
                Let's Work Together
              </div>

              <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-8 text-white leading-[1.06] tracking-tight">
                Ready to Build <span className="text-white/85">Something Great?</span>
              </h2>

              <p className="text-white/75 text-lg leading-relaxed mb-12 max-w-lg mx-auto lg:mx-0">
                Let's discuss your ideas and turn them into reality. Schedule a free consultation — no obligation, just great conversation.
              </p>

              {/* Perks grid */}
              <div className="grid grid-cols-2 gap-4 mb-12 max-w-sm mx-auto lg:mx-0">
                {perks.map(({ icon: Icon, text }) => (
                  <div key={text} className="flex items-center gap-3 text-white/85 text-sm font-bold">
                    <Icon className="h-5 w-5 text-green-400 flex-shrink-0" />
                    {text}
                  </div>
                ))}
              </div>

              {/* Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
                <Link to="/contact">
                  <Button size="lg"
                    className="bg-white text-primary hover:bg-white/96 h-14 px-10 font-bold
                      shadow-2xl shadow-black/35 group gap-2.5 rounded-2xl
                      hover:scale-105 transition-all duration-300">
                    <Calendar className="h-5 w-5" />
                    Schedule a Call
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline"
                    className="border-2 border-white/40 text-white bg-transparent
                      hover:bg-white/15 hover:border-white/70 h-14 px-10 font-bold
                      group gap-2.5 rounded-2xl hover:scale-105 transition-all duration-300">
                    <MessageSquare className="h-5 w-5" />
                    Send a Message
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                  </Button>
                </Link>
              </div>
            </div>

            {/* Right — glass card */}
            <div className={`w-full lg:w-[340px] xl:w-[380px] transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"}`}>
              <div className="relative rounded-3xl bg-white/12 border border-white/22
                backdrop-blur-2xl p-9 shadow-[0_32px_96px_hsl(0_0%_0%/0.3)]">
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/16 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  {/* Header */}
                  <div className="flex items-center gap-4 pb-6 mb-6 border-b border-white/16">
                    <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-white font-bold text-sm">Free Consultation</p>
                      <p className="text-white/60 text-xs">30-minute discovery call</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-5 mb-6">
                    {details.map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className="text-white/60 text-sm">{label}</span>
                        <span className="text-white font-bold text-sm">{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Status */}
                  <div className="pt-6 border-t border-white/16">
                    <div className="flex items-center gap-3">
                      <span className="relative flex h-3.5 w-3.5">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500" />
                      </span>
                      <span className="text-white/85 text-sm font-bold">Available for new projects</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
