import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";

// ── Public routes: imported eagerly ──
// These are the routes scripts/prerender.mjs renders to static HTML with
// renderToString, which cannot resolve React.lazy boundaries — a lazy public
// route would prerender its Suspense fallback instead of its content, which is
// exactly the blank-body problem prerendering exists to solve.
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import About from "./pages/About";
import Services from "./pages/Services";
import WebsiteMaintenance from "./pages/WebsiteMaintenance";
import Contact from "./pages/Contact";
import WebDevelopmentNewZealand from "./pages/WebDevelopmentNewZealand";
import WebDevelopmentCyprus from "./pages/WebDevelopmentCyprus";
import WebDeveloperAuckland from "./pages/WebDeveloperAuckland";
import NotFound from "./pages/NotFound";
    
// ── Admin routes: code-split ──
// Never prerendered, never indexed, and only ever loaded by one person. Keeping
// them out of the main chunk removes their forms, tables and query/validation
// dependencies from the bundle every public visitor downloads.
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout"));
const AdminLogin = lazy(() => import("./pages/admin/AdminLogin"));
const AdminSignup = lazy(() => import("./pages/admin/AdminSignup"));
const AdminDashboard = lazy(() => import("./pages/admin/AdminDashboard"));
const AdminProjects = lazy(() => import("./pages/admin/AdminProjects"));
const AdminCreateProject = lazy(() => import("./pages/admin/AdminCreateProject"));
const AdminEditProject = lazy(() => import("./pages/admin/AdminEditProject"));
const AdminRequirements = lazy(() => import("./pages/admin/AdminRequirements"));
const AdminRequirementDetail = lazy(() => import("./pages/admin/AdminRequirementDetail"));

const AdminFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-background text-muted-foreground">
    Loading…
  </div>
);

/**
 * Route table without a Router, so the client can wrap it in BrowserRouter and
 * the prerenderer in StaticRouter.
 */
export const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/projects/:id" element={<ProjectDetail />} />
    <Route path="/blogs" element={<Blogs />} />
    <Route path="/blogs/:slug" element={<BlogDetail />} />
    <Route path="/about" element={<About />} />
    <Route path="/services" element={<Services />} />
    <Route
      path="/services/website-maintenance"
      element={<WebsiteMaintenance />}
    />
    <Route path="/contact" element={<Contact />} />
    <Route path="/web-development-new-zealand" element={<WebDevelopmentNewZealand />} />
    <Route path="/web-development-cyprus" element={<WebDevelopmentCyprus />} />
    <Route path="/web-developer-auckland" element={<WebDeveloperAuckland />} />

    {/* Admin auth (no layout) */}
    <Route
      path="/admin/login"
      element={<Suspense fallback={<AdminFallback />}><AdminLogin /></Suspense>}
    />
    <Route
      path="/admin/signup"
      element={<Suspense fallback={<AdminFallback />}><AdminSignup /></Suspense>}
    />

    {/* Admin layout with nested routes */}
    <Route
      path="/admin"
      element={<Suspense fallback={<AdminFallback />}><AdminLayout /></Suspense>}
    >
      <Route index element={<AdminDashboard />} />
      <Route path="projects" element={<AdminProjects />} />
      <Route path="projects/new" element={<AdminCreateProject />} />
      <Route path="projects/:id/edit" element={<AdminEditProject />} />
      <Route path="requirements" element={<AdminRequirements />} />
      <Route path="requirements/:id" element={<AdminRequirementDetail />} />
    </Route>

    {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
    <Route path="*" element={<NotFound />} />
  </Routes>
);

/**
 * Providers shared by the client and the prerenderer. `withToasters` is off
 * during prerendering: the toast portals render no crawlable content and only
 * add markup to every static page.
 */
export const AppProviders = ({
  children,
  withToasters = true,
}: {
  children: React.ReactNode;
  withToasters?: boolean;
}) => {
  const queryClient = new QueryClient();
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {withToasters && (
          <>
            <Toaster />
            <Sonner />
          </>
        )}
        {children}
      </TooltipProvider>
    </QueryClientProvider>
  );
};

const App = () => (
  <AppProviders>
    <BrowserRouter>
      <ScrollToTop />
      <AppRoutes />
    </BrowserRouter>
  </AppProviders>
);

export default App;
