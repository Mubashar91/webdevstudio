import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blogs from "./pages/Blogs";
import BlogDetail from "./pages/BlogDetail";
import About from "./pages/About";
import Services from "./pages/Services";
import Contact from "./pages/Contact";
import WebDevelopmentNewZealand from "./pages/WebDevelopmentNewZealand";
import WebDevelopmentCyprus from "./pages/WebDevelopmentCyprus";
import NotFound from "./pages/NotFound";
import AdminCreateProject from "./pages/admin/AdminCreateProject";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminSignup from "./pages/admin/AdminSignup";
import AdminProjects from "./pages/admin/AdminProjects";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminEditProject from "./pages/admin/AdminEditProject";
import AdminRequirements from "./pages/admin/AdminRequirements";
import AdminRequirementDetail from "./pages/admin/AdminRequirementDetail";
import AdminDashboard from "./pages/admin/AdminDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/blogs" element={<Blogs />} />
          <Route path="/blogs/:slug" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/web-development-new-zealand" element={<WebDevelopmentNewZealand />} />
          <Route path="/web-development-cyprus" element={<WebDevelopmentCyprus />} />
          {/* Admin auth (no layout) */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin/signup" element={<AdminSignup />} />
          {/* Admin layout with nested routes */}
          <Route path="/admin" element={<AdminLayout />}>
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
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
