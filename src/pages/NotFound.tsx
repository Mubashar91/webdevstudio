import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { useSEO } from "@/hooks/use-seo";
import { trackEvent } from "@/lib/boot";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useSEO({
    title: "Page Not Found | WebDevStudio",
    description: "The page you requested could not be found. Return to the portfolio homepage.",
    noindex: true,
  });

  // GA4 reports "Page Not Found" views but not which URL was missed, so a
  // broken inbound link looks identical to someone mistyping. Recording the
  // attempted path and the referrer makes it diagnosable.
  useEffect(() => {
    trackEvent("page_not_found", {
      attempted_path: location.pathname,
      referrer: document.referrer || "(none)",
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navigation />
      <main
        id="main-content"
        className="flex-1 flex items-center justify-center px-6 pt-24 pb-16 relative overflow-hidden"
      >
        <div className="absolute inset-0 dot-grid opacity-[0.08] pointer-events-none" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-primary/6 rounded-full blur-[120px] pointer-events-none" />

        <div className="relative z-10 text-center max-w-lg">
          <p className="text-8xl md:text-9xl font-extrabold gradient-text leading-none mb-4">404</p>
          <h1 className="text-2xl md:text-3xl font-bold mb-3 tracking-tight">Page not found</h1>
          <p className="text-muted-foreground mb-8 leading-relaxed">
            <span className="font-mono text-sm bg-muted px-2 py-0.5 rounded-md">{location.pathname}</span>
            {" "}does not exist. It may have been moved or removed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button asChild size="lg" className="rounded-2xl font-bold gap-2">
              <Link to="/">
                <Home className="h-4 w-4" />
                Back to Home
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="rounded-2xl font-bold gap-2">
              <Link to="/projects">
                <ArrowLeft className="h-4 w-4" />
                View Projects
              </Link>
            </Button>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFound;
