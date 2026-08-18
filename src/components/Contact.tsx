import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Mail, MapPin, Phone, Send, MessageSquare, Clock, CheckCircle2 } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";
import { buildEnquiryMailto, submitRequirement } from "@/lib/api";
import { trackEvent } from "@/lib/boot";
import { CONTACT_EMAIL, TELEPHONE } from "@/lib/site.config.mjs";

const contactInfo = [
  { icon: Mail,   label: "Email",    value: CONTACT_EMAIL,     href: `mailto:${CONTACT_EMAIL}`, iconBg: "bg-blue-500/12",    iconColor: "text-blue-500",    hoverBorder: "hover:border-blue-500/40" },
  { icon: Phone,  label: "Phone",    value: "+92 309 6403160", href: `tel:${TELEPHONE}`,        iconBg: "bg-violet-500/12",  iconColor: "text-violet-500",  hoverBorder: "hover:border-violet-500/40" },
  { icon: MapPin, label: "Location", value: "Mian Channu, Pakistan",        href: null,                                 iconBg: "bg-emerald-500/12", iconColor: "text-emerald-500", hoverBorder: "hover:border-emerald-500/40" },
  { icon: Clock,  label: "Response", value: "Within 24 hours",              href: null,                                 iconBg: "bg-amber-500/12",   iconColor: "text-amber-500",   hoverBorder: "hover:border-amber-500/40" },
];

interface ContactProps {
  compactHeader?: boolean;
  /** Set on /contact, where this section opens the page. See `initialVisible`. */
  aboveFold?: boolean;
}

export const Contact = ({ compactHeader = false, aboveFold = false }: ContactProps) => {
  const { toast } = useToast();
  const [ref, isVisible] = useIntersectionObserver({
    threshold: 0.05,
    initialVisible: aboveFold,
  });
  const [form, setForm] = useState({ name: "", email: "", projectType: "New website", description: "", budget: "", timeline: "" });
  /** Honeypot value — always empty for real users. See the hidden field below. */
  const [honeypot, setHoneypot] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSubmitting(true);
      setResult("");

      // Posts to the same-origin /api/contact function, which holds the
      // Web3Forms key server-side.
      //
      // Calling api.web3forms.com straight from the browser also works, but it
      // compiles the access key into the JS bundle where anyone can lift it and
      // spam this inbox, and it leaves the honeypot and field validation on the
      // client where a bot POSTing directly never runs them.
      await submitRequirement({
        name: form.name,
        email: form.email,
        projectType: form.projectType,
        description: form.description,
        budget: form.budget || undefined,
        timeline: form.timeline || undefined,
        company: honeypot,
      });

      // The conversion. GA4 was reporting 0 key events, so there was no way to
      // tell whether the form had ever been used — only that pages were viewed.
      // Mark `generate_lead` as a key event in GA4 → Admin → Events.
      trackEvent("generate_lead", {
        method: "form",
        project_type: form.projectType,
        has_budget: Boolean(form.budget),
        has_timeline: Boolean(form.timeline),
      });

      setResult("Thanks! Your message was sent successfully.");
      toast({ title: "Message sent!", description: "Thank you! I'll get back to you within 24 hours." });
      setForm({ name: "", email: "", projectType: "New website", description: "", budget: "", timeline: "" });
    } catch {
      // Tracked with a different `method` so a spike in mailto fallbacks shows
      // up as an endpoint problem rather than blending into healthy conversions.
      trackEvent("generate_lead", { method: "mailto_fallback", project_type: form.projectType });
      setResult("Something went wrong. I’ve opened your email app so you can send it directly.");
      // Never drop a lead: hand the enquiry to the visitor's mail client
      // prefilled, rather than showing a dead-end error.
      window.location.href = buildEnquiryMailto({
        name: form.name,
        email: form.email,
        projectType: form.projectType,
        description: form.description,
        budget: form.budget || undefined,
        timeline: form.timeline || undefined,
      });
      toast({
        title: "Opening your email app",
        description:
          "The contact form couldn't reach the server, so I've prefilled an email for you instead. Just hit send.",
      });
    } finally { setSubmitting(false); }
  };

  // text-base on mobile: iOS Safari zooms the viewport when a focused
  // field is under 16px and never zooms back out.
  const inputCls = "text-base md:text-sm bg-background/50 border-border/50 focus:border-primary focus-visible:ring-1 focus-visible:ring-primary h-11 rounded-xl transition-all duration-200 placeholder:text-muted-foreground/70";

  // scroll-mt-20 matches the fixed nav's height (pt-20 on <main>), so the
  // "Send a message" anchor in the page header lands the form below the
  // navbar instead of behind it.
  return (
    <section id="contact" className="py-28 relative overflow-hidden scroll-mt-20">
      <div className="absolute inset-0 bg-surface-alt pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.12] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/4 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-500/4 rounded-full blur-[120px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 relative z-10">

        {/* Header */}
        {compactHeader && (
          /* Keeps the heading outline intact when the visible section
             heading is hidden — the card <h3>s would otherwise follow
             the page <h1> directly and skip a level. */
          <h2 className="sr-only">Contact form</h2>
        )}

        {!compactHeader && (
          <div className={`text-center mb-16 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="section-label mb-6">
              <MessageSquare className="h-4 w-4" />
              Get In Touch
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight">
              Let's{" "}
              <span className="gradient-text">Work Together</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Have a project in mind? I'd love to hear about it. Send me a message and let's make it happen.
            </p>
          </div>
        )}

        <div className="grid lg:grid-cols-5 gap-8 max-w-6xl mx-auto">

          {/* Form */}
          <div className={`lg:col-span-3 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <div className="rounded-2xl border border-border/40 bg-card shadow-card p-8">
              <h3 className="text-xl font-bold mb-1">Send a Message</h3>
              <p className="text-muted-foreground text-sm mb-7">Fill out the form and I'll respond within 24 hours.</p>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Honeypot. Hidden from people, irresistible to bots — they
                    fill every input they find. api/contact.js silently accepts
                    and discards any submission where this has a value.
                    aria-hidden + tabIndex keep it out of the keyboard and
                    screen-reader path so it costs real users nothing. */}
                <div className="absolute left-[-9999px]" aria-hidden="true">
                  <label htmlFor="company">Company (leave blank)</label>
                  <input
                    id="company"
                    name="company"
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={honeypot}
                    onChange={(e) => setHoneypot(e.target.value)}
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="name" className="text-sm font-bold text-foreground/75">Your Name</label>
                    <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="John Doe" required className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className="text-sm font-bold text-foreground/75">Email Address</label>
                    <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="john@example.com" required className={inputCls} />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="projectType" className="text-sm font-bold text-foreground/75">Project Type</label>
                  <select
                    id="projectType"
                    value={form.projectType}
                    onChange={e => setForm({ ...form, projectType: e.target.value })}
                    className="w-full h-11 rounded-xl border border-border/50 bg-background/50 px-3 text-base md:text-sm
                      focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all duration-200"
                  >
                    {/* Named by what the buyer wants, not by the stack that
                        delivers it. "MERN Application / Node.js Backend /
                        React Frontend" asks a non-technical business owner to
                        self-diagnose in a vocabulary they don't have, and the
                        honest answer for most of them was none of the four.
                        The value is free-form and goes straight into the
                        enquiry email subject, so plain language reads better
                        on both ends. "Not sure yet" is deliberate: it's the
                        true answer for a first enquiry and removes the reason
                        to abandon the form. */}
                    {[
                      "New website",
                      "Web app or custom system",
                      "Fix or improve an existing site",
                      "Ongoing maintenance",
                      "Not sure yet",
                    ].map((label) => (
                      <option key={label} value={label}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="description" className="text-sm font-bold text-foreground/75">Project Details</label>
                  <Textarea
                    id="description"
                    value={form.description}
                    onChange={e => setForm({ ...form, description: e.target.value })}
                    placeholder="Tell me about your project, goals, and requirements..."
                    rows={5}
                    required
                    className="bg-background/50 border-border/50 focus:border-primary focus-visible:ring-1 focus-visible:ring-primary rounded-xl resize-none transition-all duration-200 placeholder:text-muted-foreground/70 text-base md:text-sm"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label htmlFor="budget" className="text-sm font-bold text-foreground/75">
                      Budget <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <Input id="budget" value={form.budget} onChange={e => setForm({ ...form, budget: e.target.value })} placeholder="e.g. $1,000 – $3,000" className={inputCls} />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="timeline" className="text-sm font-bold text-foreground/75">
                      Timeline <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <Input id="timeline" value={form.timeline} onChange={e => setForm({ ...form, timeline: e.target.value })} placeholder="e.g. 4–6 weeks" className={inputCls} />
                  </div>
                </div>

                <Button type="submit" size="lg" disabled={submitting}
                  className="w-full h-12 font-bold shadow-glow-sm group gap-2.5 rounded-2xl">
                  {submitting ? (
                    <><span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Sending...</>
                  ) : (
                    <><Send className="h-4 w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" /> Send Message</>
                  )}
                </Button>

                {result ? (
                  <p className={`text-sm ${result.includes("success") || result.includes("received") ? "text-emerald-600" : "text-amber-600"}`}>
                    {result}
                  </p>
                ) : null}
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className={`lg:col-span-2 flex flex-col gap-4 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            {contactInfo.map(({ icon: Icon, label, value, href, iconBg, iconColor, hoverBorder }) => (
              <div key={label}
                className={`group flex items-center gap-4 p-5 rounded-2xl border border-border/40 bg-card
                  shadow-card ${hoverBorder} hover:shadow-card-hover transition-all duration-300`}>
                <div className={`p-3 rounded-xl ${iconBg} ${iconColor} flex-shrink-0
                  group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs md:text-[11px] font-bold text-muted-foreground uppercase tracking-[0.12em] mb-0.5">{label}</p>
                  {href
                    ? <a href={href} className="text-sm font-semibold hover:text-primary transition-colors truncate block underline-anim">{value}</a>
                    : <p className="text-sm font-semibold truncate">{value}</p>}
                </div>
              </div>
            ))}

            {/* Availability */}
            <div className="relative overflow-hidden rounded-2xl p-7 mt-1
              bg-gradient-to-br from-primary via-blue-600 to-violet-600
              shadow-[0_8px_40px_hsl(224_78%_52%/0.35)]">
              <div className="absolute inset-0 dot-grid opacity-8" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/8 rounded-full blur-2xl" />
              <div className="relative z-10">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500" />
                  </span>
                  <span className="text-white font-bold text-sm">Available Now</span>
                </div>
                <h3 className="text-xl font-extrabold text-white mb-2">Open for Freelance</h3>
                <p className="text-white/70 text-sm leading-relaxed mb-5">
                  Currently accepting new projects. Let's build something great together.
                </p>
                <div className="space-y-2.5">
                  {["Quick onboarding", "Flexible hours", "Regular updates", "Quality guaranteed"].map(item => (
                    <div key={item} className="flex items-center gap-2.5 text-white/80 text-xs font-medium">
                      <CheckCircle2 className="h-3.5 w-3.5 text-green-400 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
