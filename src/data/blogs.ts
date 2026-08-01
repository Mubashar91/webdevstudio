export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string[];
  coverImage: string;
  category: string;
  /**
   * DERIVED — do not hand-write. Use `readTimeOf(post)`.
   *
   * These were hardcoded at "5–8 min read" on posts of 81–96 words (roughly
   * 25–40 seconds of actual reading). An SEO audit flagged it as fabricated
   * metadata, and a prospective client who clicks a "6 min read" badge and
   * hits four sentences draws the obvious conclusion about everything else
   * on the site.
   */
  readTime?: string;
  publishedAt: string;
  /** ISO date. Set when you revise a post — feeds BlogPosting.dateModified,
   *  which Google uses to judge freshness. Falls back to publishedAt. */
  updatedAt?: string;
  tags: string[];
}

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "react-performance-tips-2025",
    title: "5 React Performance Tips That Actually Move the Needle",
    excerpt:
      "Practical React optimizations for real apps — memoization, lazy loading, and bundle splitting without over-engineering.",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    category: "React",
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

/** Average adult reading speed for technical prose, words per minute. */
const WORDS_PER_MINUTE = 220;

export function wordCountOf(post: BlogPost): number {
  return post.content.join(" ").trim().split(/\s+/).filter(Boolean).length;
}

/**
 * Read time derived from the actual body, never hand-written.
 *
 * Short posts report seconds rather than rounding up to "1 min read", so the
 * badge stays honest about genuinely short pieces instead of inflating them.
 */
export function readTimeOf(post: BlogPost): string {
  if (post.readTime) return post.readTime; // explicit override, if ever needed
  const words = wordCountOf(post);
  const minutes = words / WORDS_PER_MINUTE;
  if (minutes < 0.9) return `${Math.max(15, Math.round((minutes * 60) / 15) * 15)} sec read`;
  return `${Math.round(minutes)} min read`;
}
