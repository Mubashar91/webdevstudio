import { Link } from "react-router-dom";
import { Code2, Github, Linkedin, Mail, Heart, ArrowUpRight, MapPin, Phone, ExternalLink } from "lucide-react";
import { useIntersectionObserver } from "@/hooks/use-intersection-observer";

const navLinks = [
  { to: "/",         label: "Home" },
  { to: "/about",    label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blogs",    label: "Blog" },
  { to: "/services", label: "Services" },
  { to: "/contact",  label: "Contact" },
];

const socials = [
  { href: "https://github.com/mubasharshahzad",      icon: Github,   label: "GitHub",   ext: true,  color: "hover:bg-gray-800 hover:border-gray-700 hover:text-white" },
  { href: "https://linkedin.com/in/mubasharshahzad", icon: Linkedin, label: "LinkedIn", ext: true,  color: "hover:bg-blue-600 hover:border-blue-500 hover:text-white" },
  { href: "mailto:mmubasharshahzad40@gmail.com",     icon: Mail,     label: "Email",    ext: false, color: "hover:bg-primary hover:border-primary hover:text-white" },
];

export const Footer = () => {
  const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });

  return (
    <footer className="relative overflow-hidden border-t border-border/35">
      <div className="absolute inset-0 bg-card/55 pointer-events-none" />
      <div className="absolute inset-0 dot-grid opacity-[0.06] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[200px]
        bg-primary/3 rounded-full blur-[100px] pointer-events-none" />

      <div ref={ref} className="container mx-auto px-6 pt-16 pb-8 relative z-10">

        {/* Top section */}
        <div className="grid md:grid-cols-12 gap-10 mb-14">

          {/* Brand — wider */}
          <div className={`md:col-span-5 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <Link to="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary to-violet-600
                flex items-center justify-center shadow-glow-sm
                group-hover:shadow-glow group-hover:scale-105 transition-all duration-300">
                <Code2 className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="text-lg font-extrabold block leading-tight">
                  WebDev<span className="text-primary">Studio</span>
                </span>
                <span className="text-xs text-muted-foreground font-medium">Web Development Studio</span>
              </div>
            </Link>

            <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-xs">
              WebDevStudio builds modern, responsive web experiences — led by Muhammad Mubashar Shahzad. Available for projects worldwide.
            </p>

            {/* Contact */}
            <div className="space-y-2.5 mb-6">
              {[
                { icon: Mail,   text: "mmubasharshahzad40@gmail.com", href: "mailto:mmubasharshahzad40@gmail.com" },
                { icon: Phone,  text: "+92 309 6403160",              href: "tel:+923096403160" },
                { icon: MapPin, text: "Mian Channu, Pakistan",        href: null },
              ].map(({ icon: Icon, text, href }) => (
                <div key={text} className="flex items-center gap-2.5 text-xs text-muted-foreground">
                  <Icon className="h-3.5 w-3.5 text-primary/45 flex-shrink-0" />
                  {href
                    ? <a href={href} className="hover:text-primary transition-colors underline-anim">{text}</a>
                    : <span>{text}</span>}
                </div>
              ))}
            </div>

            {/* Status */}
            <div className="inline-flex items-center gap-2 px-3.5 py-2 rounded-full
              bg-green-500/10 border border-green-500/18 mb-5">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-xs text-green-600 dark:text-green-400 font-bold">
                Available for freelance
              </span>
            </div>

            {/* Regions served */}
            <p className="text-xs text-muted-foreground/70">
              Also serving clients in{" "}
              <Link to="/web-development-new-zealand" className="text-primary hover:underline font-medium">
                New Zealand
              </Link>{" "}
              and{" "}
              <Link to="/web-development-cyprus" className="text-primary hover:underline font-medium">
                Cyprus
              </Link>
              .
            </p>
          </div>

          {/* Navigation */}
          <div className={`md:col-span-3 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h4 className="text-xs md:text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/45 mb-6">
              Navigation
            </h4>
            <ul className="space-y-3.5">
              {navLinks.map(({ to, label }) => (
                <li key={to}>
                  <Link to={to}
                    className="group inline-flex items-center gap-1.5 text-sm text-muted-foreground
                      hover:text-primary transition-colors font-medium">
                    <ArrowUpRight className="h-3 w-3 opacity-0 -translate-x-1.5
                      group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200" />
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Connect */}
          <div className={`md:col-span-4 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
            <h4 className="text-xs md:text-[11px] font-extrabold uppercase tracking-[0.2em] text-muted-foreground/45 mb-6">
              Connect
            </h4>
            <div className="flex flex-col gap-3">
              {socials.map(({ href, label, icon: Icon, ext, color }) => (
                <a key={label} href={href}
                  target={ext ? "_blank" : undefined}
                  rel={ext ? "noopener noreferrer" : undefined}
                  aria-label={label}
                  className={`group inline-flex items-center gap-3 text-sm text-muted-foreground
                    hover:text-foreground transition-all duration-200 font-medium`}>
                  <div className={`w-11 h-11 md:w-9 md:h-9 rounded-xl bg-muted/50 border border-border/40
                    flex items-center justify-center ${color}
                    transition-all duration-200 shadow-sm group-hover:shadow-md`}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <span className="group-hover:text-primary transition-colors">{label}</span>
                  {ext && <ExternalLink className="h-3 w-3 opacity-0 group-hover:opacity-40 transition-opacity" />}
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={`pt-6 border-t border-border/35 flex flex-col sm:flex-row
          items-center justify-between gap-3 transition-all duration-700 delay-300
          ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <p className="text-xs text-muted-foreground flex items-center gap-1.5">
            &copy; {new Date().getFullYear()} WebDevStudio. Made with
            <Heart className="h-3 w-3 text-red-500 fill-red-500 animate-pulse" />
            All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground/35 font-semibold tracking-wide">
            React · TypeScript · Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
