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

/**
 * The one nav item that is a conversion action rather than a destination.
 *
 * Audits on 2026-08-08, 08-13 and 08-15 all filed the same High finding: the
 * nav is `position: fixed` and therefore visible at every scroll depth, but
 * "Contact" carried byte-identical styling to "Home"/"About"/"Projects", so
 * the only visually distinct CTA lived inside each page's hero. A visitor who
 * scrolled past the hero had no obvious next step anywhere on screen. SXO
 * scored Action 15-19/25 sitewide and attributed the gap to exactly this.
 */
const CTA_LINK = "/contact";

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
  //
  // `!open` matters. The transparent state pairs white text with a gradient
  // that fades to nothing by the bottom of the bar. That's fine for a
  // single-row header, but the mobile menu expands INTO the transparent part,
  // so its links were rendering straight over the hero headline with no
  // background behind either — both illegible where they overlapped. Dropping
  // out of the transparent state while the menu is open flips the text colour
  // and the background together, which is the only combination that stays
  // readable in both themes.
  const isTransparent = isHome && !scrolled && !open;

  return (
    <>
    <SkipLink />
    <nav
      aria-label="Main navigation"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-400 ${
        // The open mobile menu gets a FULLY OPAQUE surface, not bg-background/92.
        //
        // Three consecutive audits (2026-08-08, 08-13, 08-15) filed this as
        // Critical, each diagnosing it as the panel background being too SHORT
        // to cover the six links. It isn't: the menu is a child of this <nav>,
        // and the audits' own DOM capture measured the nav at 384px, which
        // contains the full list. The defect is transparency, not height —
        // at 92% opacity over the dark homepage hero, the hero paragraph
        // ghosts through and collides with the last two links, which is
        // exactly what the screenshots show. 8% of a dark image is plenty to
        // wreck contrast against foreground-coloured text.
        //
        // Scrolled (menu closed) keeps /92: there's page content under it,
        // not a dark hero, and the translucency is the intended effect there.
        open
          ? "bg-background backdrop-blur-2xl border-b border-border/40 shadow-[0_1px_24px_hsl(0_0%_0%/0.08)]"
          : scrolled
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
                    : to === CTA_LINK
                    // Filled, not just tinted — a tint reads as "hovered" next
                    // to five muted siblings, which is the state this finding
                    // is about. See CTA_LINK.
                    ? "bg-primary/90 text-white shadow-sm shadow-primary/30 hover:bg-primary"
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
          // No isTransparent branches in here: isTransparent is
          // `isHome && !scrolled && !open`, so it is always false while this
          // block renders. The white-text variants that used to sit here were
          // unreachable, and they made the contrast bug harder to spot.
          <div className="md:hidden mt-3 pt-3 pb-2 border-t border-border/40 animate-fade-in">
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
                  // Full-opacity text, not text-foreground/75. Combined with
                  // the opaque panel above, this is what actually restores
                  // legible contrast on the last two rows.
                  className={`flex items-center min-h-11 px-4 py-2.5 rounded-xl text-base font-semibold transition-all duration-200 ${
                    active(to)
                      ? "bg-primary/15 text-primary"
                      : to === CTA_LINK
                      ? "bg-primary text-white hover:bg-primary/90"
                      : "text-foreground hover:text-primary hover:bg-muted/60"
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
