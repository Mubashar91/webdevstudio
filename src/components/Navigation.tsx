import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Code2, Menu, X } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { SkipLink } from "./SkipLink";
import { Button } from "./ui/button";

const navLinks = [
  { to: "/",         label: "Home" },
  { to: "/about",    label: "About" },
  { to: "/projects", label: "Projects" },
  { to: "/blogs",    label: "Blog" },
  { to: "/services", label: "Services" },
  { to: "/contact",  label: "Contact" },
];

export const Navigation = () => {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // Detect if we're on the homepage (hero has dark bg)
  const isHome = location.pathname === "/";

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40);
    // Sync immediately, not only on the next scroll event. Browsers restore
    // scroll position on refresh and back-navigation, so the page can load
    // already scrolled — leaving the nav in its transparent state (white text)
    // over light content, where the "WebDev" half of the wordmark and the
    // desktop links become invisible until the user happens to scroll.
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => { setOpen(false); }, [location.pathname]);

  const active = (p: string) => location.pathname === p;

  // On home page before scroll: white text on dark hero
  // After scroll or on other pages: normal themed nav
  const isTransparent = isHome && !scrolled;

  return (
    <>
    <SkipLink />
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
        scrolled
          ? "bg-background/92 backdrop-blur-2xl border-b border-border/40 shadow-[0_1px_24px_hsl(0_0%_0%/0.08)]"
          : isHome
          ? "bg-gradient-to-b from-black/45 via-black/15 to-transparent border-b border-white/[0.06]"
          : "bg-background/80 backdrop-blur-xl border-b border-border/30"
      }`}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary to-violet-600
              flex items-center justify-center
              shadow-[0_0_0_1px_hsl(224_78%_52%/0.3),0_4px_16px_hsl(224_78%_52%/0.35)]
              group-hover:scale-105 group-hover:shadow-[0_0_0_1px_hsl(224_78%_52%/0.5),0_8px_24px_hsl(224_78%_52%/0.5)]
              transition-all duration-300">
              <Code2 className="h-5 w-5 text-white" />
            </div>
            <span className={`text-[15px] font-bold tracking-tight transition-colors duration-300 ${
              isTransparent ? "text-white" : "text-foreground"
            }`}>
              WebDev<span className="text-primary">Studio</span>
            </span>
          </Link>

          {/* Desktop nav */}
          <div className={`hidden md:flex items-center gap-0.5 p-1.5 rounded-full
            backdrop-blur-md transition-all duration-300 ${
              isTransparent
                ? "bg-white/[0.09] border border-white/[0.14] shadow-[0_4px_24px_rgba(0,0,0,0.25)]"
                : "bg-card/75 border border-border/50 shadow-sm"
            }`}>
            {navLinks.map(({ to, label }) => (
              <Link
                key={to}
                to={to}
                aria-current={active(to) ? "page" : undefined}
                className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
                  active(to)
                    ? "bg-primary text-white shadow-sm shadow-primary/40"
                    : isTransparent
                    ? "text-white/75 hover:text-white hover:bg-white/15"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/70"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            <ThemeToggle className={isTransparent ? "text-white hover:bg-white/15" : ""} />
            {/* 44x44 is the minimum comfortable touch target (WCAG 2.5.5 /
                Apple HIG). This was 36x36 — hard to hit accurately, and it's
                the first control every mobile visitor has to use. */}
            <Button
              variant="ghost"
              size="icon"
              className={`md:hidden h-11 w-11 rounded-xl transition-colors ${
                isTransparent ? "text-white hover:bg-white/15" : ""
              }`}
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
              aria-expanded={open}
            >
              {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <div className={`md:hidden mt-3 pt-3 pb-2 border-t animate-fade-in ${
            isTransparent ? "border-white/20" : "border-border/40"
          }`}>
            {/* min-h-11 gives each row a 44px touch target — py-2.5 alone
                produced ~38px rows stacked directly against each other, and
                tapping the intended link was fiddly. Closing the menu on
                navigation also stops it staying open over the new page. */}
            <div className="flex flex-col gap-0.5">
              {navLinks.map(({ to, label }) => (
                <Link
                  key={to}
                  to={to}
                  aria-current={active(to) ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`flex items-center min-h-11 px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                    active(to)
                      ? "bg-primary/15 text-primary"
                      : isTransparent
                      ? "text-white/75 hover:text-white hover:bg-white/10"
                      : "text-foreground/75 hover:text-primary hover:bg-muted/60"
                  }`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </nav>
    </>
  );
};
