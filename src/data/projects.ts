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
  /**
   * Problem → Approach → Result narrative.
   *
   * Three consecutive audits flagged these case studies as identical
   * Duration/Team/Stack/Features spec sheets with no story and no outcome —
   * "the strongest possible Experience signal for a dev portfolio remains
   * structurally absent". A feature list says what was built; only these say
   * why it mattered and what changed.
   *
   * Fill these in per project. `result` should carry a real number — load
   * time, conversion, bookings, users — even if the client stays anonymous
   * ("a Limassol salon"). Leave a field out and its section simply doesn't
   * render, so half-finished narratives never ship.
   */
  problem?: string;
  approach?: string;
  result?: string;
  /**
   * ISO date of the last real content change to this case study.
   *
   * Feeds both WebPage.dateModified and the sitemap <lastmod>. Set it only
   * when you actually revise the write-up — stamping every entry with the
   * build date makes lastmod worthless and Google stops trusting it.
   */
  updatedAt?: string;
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
    problem:
      "Splitting shared costs across a group is deceptively hard: balances have to stay correct while several people add expenses at once, and everyone needs to see the same number at the same time. Doing that on top of a plain CRUD API produces stale balances and arguments about who owes what.",
    approach:
      "Balances are derived from the transaction log rather than stored as a mutable field, so they can never drift out of sync with the expenses behind them. Settlement is modelled as its own transaction type, which keeps history auditable. JWT auth with refresh tokens covers the mobile session, and Firebase handles push so users hear about a new expense without opening the app.",
    updatedAt: "2026-07-31",
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
    problem:
      "Hospital software fails on permissions before it fails on features. Reception, doctors and administrators need the same patient record to show different things, and appointment scheduling has to hold up when two people book the same slot.",
    approach:
      "Role-based access control was designed first and enforced server-side, so the UI only ever hides what the API already refuses. Appointments are validated against the practitioner's calendar at write time rather than in the client, and patient records are indexed on the fields staff actually search by.",
    updatedAt: "2026-07-31",
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
    problem:
      "A software house site lives or dies on being found and being fast. The usual failure is a visually heavy marketing site that scores badly on Core Web Vitals and never ranks for the services it sells.",
    approach:
      "Built as a React and TypeScript site with performance treated as a requirement rather than a cleanup task: images sized and served in modern formats, animations restricted to compositor-friendly properties, and structured data plus per-page metadata handled at build time so crawlers get the real content.",
    updatedAt: "2026-07-31",
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
    problem:
      "An e-commerce dashboard has to stay readable while numbers change underneath it. Inventory, orders and payments all update independently, and a naive implementation either polls constantly or shows figures that are quietly out of date.",
    approach:
      "Socket.io pushes updates for the values that genuinely change in real time, while everything else is fetched through a cached query layer to avoid hammering the API. Stripe handles payments so no card data touches the application, and the analytics views are computed server-side to keep the browser responsive with large order volumes.",
    updatedAt: "2026-07-31",
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
    problem:
      "APIs that work fine in development fall over under real traffic, usually because every request hits the database and nothing limits how fast a client can ask.",
    approach:
      "Redis caches the read-heavy endpoints and JWT handles stateless auth so the service scales horizontally. Rate limiting sits in front of the routes that cost the most, errors follow one consistent shape, and Swagger documents the contract so consumers are not reverse-engineering responses. Docker keeps local and production environments identical.",
    updatedAt: "2026-07-31",
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
    problem:
      "Most developer portfolios force a choice between a fast static site and being able to publish without touching code.",
    approach:
      "Next.js with MDX keeps posts as content rather than markup, so writing does not require a deploy pipeline in your head. Prisma backs a small CMS layer for editing, theme state persists without a flash of the wrong colours, and the whole thing is built so search engines get real HTML rather than an empty shell.",
    updatedAt: "2026-07-31",
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
