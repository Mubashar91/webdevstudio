export type ProjectType = "MERN" | "React" | "Node" | "Other";

export interface Project {
  _id: string;
  title: string;
  description: string;
  fullDescription?: string;
  image?: string;
  technologies: string[];
  githubLink?: string;
  demoLink?: string;
  type: ProjectType;
  duration?: string;
  teamSize?: string;
  role?: string;
  features?: string[];
}

// Re-exported for the existing call sites in Projects.tsx / ProjectDetail.tsx.
// Resolution lives in one place so the localhost fallback can't leak into
// production builds again.
import { API_BASE_URL } from "@/lib/api";
export { API_BASE_URL };

export const STATIC_PROJECTS: Project[] = [
  {
    _id: "s1",
    title: "Expense-Sharing Mobile App",
    description:
      "Cross-platform React Native app for group expense tracking with JWT auth, real-time balance calculations, dynamic dashboards, and settlement workflows.",
    fullDescription:
      "A comprehensive expense tracking application that enables users to split bills and track shared expenses with real-time calculations and instant settlement tracking.",
    image:
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop",
    technologies: ["React Native", "Node.js", "MongoDB", "Express", "JWT", "Firebase"],
    demoLink: "https://expense-sharing-app.com",
    githubLink: "https://github.com/mubasharshahzad",
    type: "MERN",
    duration: "4 months",
    teamSize: "3 members",
    role: "Full Stack Developer",
    features: [
      "Group expense tracking",
      "Real-time balance calculations",
      "Payment settlements",
      "Transaction history",
      "User authentication",
      "Push notifications",
      "Expense categorization",
    ],
  },
  {
    _id: "s2",
    title: "Hospital Management System",
    description:
      "Full-featured hospital platform with patient registration, appointment scheduling, role-based access control, and centralized workflow management.",
    fullDescription:
      "An integrated hospital management system designed to streamline patient care, appointments, and administrative tasks with secure role-based access.",
    image:
      "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=450&fit=crop",
    technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS", "PostgreSQL"],
    demoLink: "https://hospital-mgmt-system.com",
    githubLink: "https://github.com/mubasharshahzad",
    type: "MERN",
    duration: "5 months",
    teamSize: "4 members",
    role: "Lead Frontend Developer",
    features: [
      "Patient registration",
      "Appointment scheduling",
      "Doctor management",
      "Medical records",
      "Billing system",
      "Role-based access",
      "Real-time notifications",
    ],
  },
  {
    _id: "s3",
    title: "Software House Website",
    description:
      "Responsive company website with service showcase, portfolio, integrated contact forms, SEO optimization, and optimized load performance.",
    fullDescription:
      "A modern, responsive website showcasing software development services with integrated portfolio, client testimonials, and contact management.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "Framer Motion"],
    demoLink: "https://software-house-website.com",
    githubLink: "https://github.com/mubasharshahzad",
    type: "React",
    duration: "3 months",
    teamSize: "2 members",
    role: "Full Stack Developer",
    features: [
      "Service showcase",
      "Project portfolio",
      "Contact forms",
      "SEO optimization",
      "Performance optimization",
      "Smooth animations",
      "Responsive design",
    ],
  },
  {
    _id: "s4",
    title: "E-Commerce Dashboard",
    description:
      "Admin dashboard with real-time analytics, inventory tracking, order management, and Stripe payment integration for e-commerce operations.",
    fullDescription:
      "A comprehensive e-commerce admin dashboard providing real-time insights, inventory management, and order processing with payment integration.",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    technologies: ["React", "Redux", "Node.js", "MongoDB", "Stripe", "Chart.js", "Socket.io"],
    demoLink: "https://ecommerce-dashboard.com",
    githubLink: "https://github.com/mubasharshahzad",
    type: "MERN",
    duration: "6 months",
    teamSize: "5 members",
    role: "Senior Frontend Developer",
    features: [
      "Real-time analytics",
      "Inventory management",
      "Order tracking",
      "Payment processing",
      "User management",
      "Report generation",
      "Stripe integration",
    ],
  },
  {
    _id: "s5",
    title: "RESTful API Service",
    description:
      "Scalable Node.js REST API with authentication, rate limiting, Redis caching, and Swagger documentation for high-traffic production environments.",
    fullDescription:
      "A production-ready REST API built with Node.js, featuring advanced authentication, caching strategies, and comprehensive API documentation.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
    technologies: ["Node.js", "Express", "MongoDB", "Redis", "JWT", "Swagger", "Docker"],
    githubLink: "https://github.com/mubasharshahzad",
    type: "Node",
    duration: "2 months",
    teamSize: "2 members",
    role: "Backend Developer",
    features: [
      "JWT authentication",
      "Rate limiting",
      "Redis caching",
      "Swagger documentation",
      "Error handling",
      "API versioning",
      "Database optimization",
    ],
  },
  {
    _id: "s6",
    title: "Portfolio & Blog Platform",
    description:
      "Modern developer portfolio with integrated blog, dark/light mode, markdown support, and a custom CMS for managing content without code.",
    fullDescription:
      "A beautiful portfolio and blogging platform for developers, featuring MDX support, theme customization, and an intuitive content management system.",
    image:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop",
    technologies: ["Next.js", "TypeScript", "Tailwind CSS", "MDX", "Vercel", "Prisma"],
    demoLink: "https://portfolio-blog-platform.com",
    githubLink: "https://github.com/mubasharshahzad",
    type: "React",
    duration: "4 months",
    teamSize: "1 member",
    role: "Solo Developer",
    features: [
      "MDX blog support",
      "Dark/light mode",
      "Project showcase",
      "Search functionality",
      "Analytics",
      "SEO optimization",
      "Performance optimized",
    ],
  },
];

export function normalizeProjectId(id: unknown): string {
  if (typeof id === "string") return id;
  if (id && typeof id === "object" && "$oid" in id) {
    return String((id as { $oid: string }).$oid);
  }
  return String(id ?? "");
}

export function mergeProjects(apiProjects: Project[]): Project[] {
  const normalized = apiProjects.map((p) => ({
    ...p,
    _id: normalizeProjectId(p._id),
  }));
  if (!normalized.length) return STATIC_PROJECTS;
  const ids = new Set(normalized.map((p) => p._id));
  return [...normalized, ...STATIC_PROJECTS.filter((p) => !ids.has(p._id))];
}

export function findStaticProject(id: string): Project | undefined {
  return STATIC_PROJECTS.find((p) => p._id === id);
}

export function projectImageUrl(image?: string): string | undefined {
  if (!image) return undefined;
  return image.startsWith("http") ? image : `${API_BASE_URL}${image}`;
}
