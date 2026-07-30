export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  category: string;
  readTime: string;
  publishedAt: string;
  /** ISO date. Set when you revise a post — feeds BlogPosting.dateModified,
   *  which Google uses to judge freshness. Falls back to publishedAt. */
  updatedAt?: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "react-performance-tips-2025",
    title: "10 React Performance Tips That Actually Move the Needle",
    excerpt:
      "Practical React optimizations for real apps — memoization, lazy loading, and bundle splitting without over-engineering.",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    category: "React",
    readTime: "6 min read",
    publishedAt: "2025-11-12",
    tags: ["React", "Performance", "TypeScript"],
    content: [
      "Performance work starts with measurement. Before reaching for memo or useCallback everywhere, profile with React DevTools and Lighthouse to find the actual bottlenecks.",
      "Code-splitting routes and heavy components is usually the highest-impact change. Users only download what they need for the page they visit.",
      "Virtualize long lists instead of rendering hundreds of DOM nodes. Libraries like TanStack Virtual keep scroll smooth on mobile.",
      "Optimize images and fonts early — they often dominate LCP more than JavaScript execution time.",
      "Keep state close to where it is used. Lifting state too high causes unnecessary re-renders across unrelated UI.",
    ],
  },
  {
    slug: "mern-stack-architecture-guide",
    title: "MERN Stack Architecture: Patterns That Scale",
    excerpt:
      "How I structure Express APIs, MongoDB schemas, and React frontends for maintainable MERN projects.",
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop",
    category: "MERN",
    readTime: "8 min read",
    publishedAt: "2025-10-03",
    tags: ["MERN", "Node.js", "MongoDB", "Architecture"],
    content: [
      "Separate routes, controllers, and services in Express. Controllers stay thin; business logic lives in services that are easy to test.",
      "Design MongoDB schemas around query patterns, not just data shape. Index fields you filter and sort on frequently.",
      "Use environment-based config and never hardcode secrets. JWT refresh flows should be planned before shipping auth.",
      "On the frontend, colocate API calls in hooks or query layers (React Query works well) instead of scattering fetch logic in components.",
      "Deploy backend and frontend independently when possible — it keeps releases safer and rollbacks simpler.",
    ],
  },
  {
    slug: "typescript-patterns-for-react",
    title: "TypeScript Patterns I Use in Every React Project",
    excerpt:
      "Discriminated unions, typed hooks, and component props that catch bugs before runtime.",
    coverImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop",
    category: "TypeScript",
    readTime: "5 min read",
    publishedAt: "2025-09-18",
    tags: ["TypeScript", "React", "DX"],
    content: [
      "Prefer explicit prop interfaces over inline types for shared components — it makes refactors safer.",
      "Use discriminated unions for UI state machines (idle | loading | success | error) instead of multiple booleans.",
      "Type API responses at the boundary with Zod or similar, then infer TypeScript types from the schema.",
      "Avoid any in event handlers and form data — small upfront typing saves hours of debugging.",
      "Export types from feature modules so pages stay thin and reusable logic stays typed end-to-end.",
    ],
  },
];

export function findBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}
