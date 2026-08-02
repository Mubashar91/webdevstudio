/**
 * Blog content.
 *
 * Bodies are structured blocks rather than a flat string[] so posts can carry
 * headings, lists and real code samples. Three consecutive SEO audits flagged
 * these posts as ~120-word stubs with "no code snippets or benchmarks — a weak
 * signal for a developer-audience technical topic"; a flat paragraph array made
 * that hard to fix without hacks.
 */

export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "list"; items: string[] }
  | { type: "code"; lang: string; code: string };

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: ContentBlock[];
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
    title: "10 React Performance Tips That Actually Move the Needle",
    excerpt:
      "Ten React optimisations ordered by real-world impact — measure first, split routes, virtualise lists, and stop reaching for memo before you know what's slow.",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    category: "React",
    publishedAt: "2025-11-12",
    updatedAt: "2026-08-02",
    tags: ["React", "Performance", "TypeScript"],
    content: [
      {
        type: "p",
        text: "Most React performance advice starts with useMemo and useCallback. That is roughly the tenth most useful thing you can do, and doing it blindly makes code harder to read while changing nothing measurable. These ten are ordered by the impact I actually see on client projects, starting with the ones that matter most.",
      },
      { type: "h2", text: "1. Measure before you change anything" },
      {
        type: "p",
        text: "Open React DevTools, switch to the Profiler tab, record an interaction, and look at the flame graph. You are looking for two things: components that render far more often than they should, and single renders that take a long time. Those are different problems with different fixes, and guessing which one you have wastes hours.",
      },
      {
        type: "p",
        text: "For load performance rather than interaction performance, run Lighthouse in an incognito window. Extensions distort the numbers badly — a profile with a few extensions installed can add a second of scripting time that has nothing to do with your app.",
      },
      { type: "h2", text: "2. Code-split at the route level" },
      {
        type: "p",
        text: "This is almost always the single biggest win. Without it, someone landing on your contact page downloads the code for your dashboard, your charts library and every modal in the app. React.lazy plus Suspense fixes it in a few lines.",
      },
      {
        type: "code",
        lang: "tsx",
        code: `import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

const Dashboard = lazy(() => import("./pages/Dashboard"));
const Settings = lazy(() => import("./pages/Settings"));

export function App() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}`,
      },
      {
        type: "p",
        text: "One caveat worth knowing: if you prerender or server-render your pages, renderToString cannot resolve lazy boundaries. A lazy route will render its fallback into the static HTML instead of its content — which is exactly the opposite of what you wanted. Keep prerendered routes eagerly imported and split the rest.",
      },
      { type: "h2", text: "3. Virtualise long lists" },
      {
        type: "p",
        text: "Rendering 500 rows means 500 sets of DOM nodes, event listeners and style recalculations. Virtualisation renders only what fits on screen plus a small buffer. TanStack Virtual is the current standard and works with plain divs or tables.",
      },
      {
        type: "code",
        lang: "tsx",
        code: `import { useVirtualizer } from "@tanstack/react-virtual";

function Rows({ items }) {
  const parentRef = useRef(null);
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 56,
    overscan: 8,
  });

  return (
    <div ref={parentRef} style={{ height: 600, overflow: "auto" }}>
      <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
        {virtualizer.getVirtualItems().map((row) => (
          <div
            key={row.key}
            style={{
              position: "absolute",
              top: 0,
              transform: "translateY(" + row.start + "px)",
              height: row.size,
              width: "100%",
            }}
          >
            {items[row.index].name}
          </div>
        ))}
      </div>
    </div>
  );
}`,
      },
      { type: "h2", text: "4. Fix images before you fix JavaScript" },
      {
        type: "p",
        text: "On most marketing sites the Largest Contentful Paint element is an image, not a script. Three changes usually take LCP from amber to green: serve a modern format, give every image explicit width and height so the browser can reserve space, and never lazy-load the hero.",
      },
      {
        type: "code",
        lang: "html",
        code: `<!-- Above the fold: load eagerly, high priority -->
<img src="/hero.avif" width="1200" height="630" alt="..."
     loading="eager" fetchpriority="high" decoding="async">

<!-- Below the fold: lazy is correct here -->
<img src="/card.avif" width="800" height="450" alt="..."
     loading="lazy" decoding="async">`,
      },
      {
        type: "p",
        text: "The width and height attributes are the fix for image-driven layout shift. Without them the browser cannot compute an aspect ratio until bytes arrive, so everything below jumps when they do.",
      },
      { type: "h2", text: "5. Keep state close to where it is used" },
      {
        type: "p",
        text: "State lifted higher than it needs to be re-renders every component beneath it. If a text input at the bottom of a form updates state held at the page root, the entire page re-renders on every keystroke. Move that state into the smallest component that needs it, or split the component so the frequently-changing part is isolated.",
      },
      { type: "h2", text: "6. Memoise deliberately, not defensively" },
      {
        type: "p",
        text: "memo, useMemo and useCallback all cost something: a comparison on every render plus the memory to hold the previous value. They pay off when the wrapped work is genuinely expensive or when a stable reference prevents a large subtree from re-rendering. They do nothing useful around a cheap component that re-renders rarely.",
      },
      {
        type: "p",
        text: "One rule that catches most real cases: if you pass an object, array or function as a prop to a memoised child, it needs a stable identity or the memo is pointless.",
      },
      {
        type: "code",
        lang: "tsx",
        code: `// Pointless: a new object every render defeats the memo on Chart
<Chart options={{ smooth: true }} data={data} />

// Works: stable identity across renders
const options = useMemo(() => ({ smooth: true }), []);
<Chart options={options} data={data} />`,
      },
      { type: "h2", text: "7. Move data fetching into a query layer" },
      {
        type: "p",
        text: "Scattering fetch calls through components produces duplicate requests, waterfalls, and no caching. TanStack Query gives you request deduplication, background refetching and cache invalidation for roughly the same amount of code you were already writing.",
      },
      { type: "h2", text: "8. Debounce the expensive work, not the input" },
      {
        type: "p",
        text: "Keep the input itself controlled and instant — users notice input lag immediately. Debounce the thing that is actually costly: the network request, the filter over 10,000 rows, the re-layout.",
      },
      {
        type: "code",
        lang: "tsx",
        code: `const [query, setQuery] = useState("");
const deferred = useDeferredValue(query);

// Input stays responsive; filtering runs against the deferred value
const results = useMemo(
  () => items.filter((i) => i.name.includes(deferred)),
  [items, deferred]
);`,
      },
      { type: "h2", text: "9. Watch what third-party scripts cost you" },
      {
        type: "p",
        text: "Analytics, chat widgets and tag managers routinely outweigh the application bundle. Google's gtag.js alone is around 165KB. Load them on requestIdleCallback or first interaction rather than during initial page load, and the pageview still registers because the queue replays once the script arrives.",
      },
      { type: "h2", text: "10. Animate only transform and opacity" },
      {
        type: "p",
        text: "Those two properties are handled by the compositor and never trigger layout or paint. Animating width, height, top or box-shadow forces the browser to recalculate layout on every frame, and on a mid-range phone that is the difference between smooth and visibly janky. Also respect prefers-reduced-motion — it is one media query and it matters to real people.",
      },
      {
        type: "code",
        lang: "css",
        code: `@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}`,
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "If you only do three of these: profile first so you know what is actually slow, split your routes, and fix your images. On the projects I take over, those three account for most of the improvement — and the memo work everyone reaches for first usually accounts for almost none of it.",
      },
    ],
  },
  {
    slug: "mern-stack-architecture-guide",
    title: "MERN Stack Architecture: Patterns That Scale",
    excerpt:
      "How I structure Express routes, Mongoose schemas and the React data layer so a MERN project is still maintainable at month six — with the code I actually use.",
    coverImage:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=450&fit=crop",
    category: "MERN",
    publishedAt: "2025-10-03",
    updatedAt: "2026-08-02",
    tags: ["MERN", "Node.js", "MongoDB", "Architecture"],
    content: [
      {
        type: "p",
        text: "MERN projects rarely fail because of the stack. They fail because everything ends up in the route handler — validation, business logic, database queries and response shaping — and six months later nobody can change anything without breaking something else. These are the patterns I use to keep that from happening.",
      },
      { type: "h2", text: "Separate routes, controllers and services" },
      {
        type: "p",
        text: "Three layers, each with one job. The route declares the URL and its middleware. The controller translates between HTTP and your domain. The service holds the actual logic and knows nothing about requests or responses — which is what makes it testable without spinning up a server.",
      },
      {
        type: "code",
        lang: "js",
        code: `// routes/orders.js — URLs and middleware only
router.post("/orders", requireAuth, validate(createOrderSchema), createOrder);

// controllers/orders.js — HTTP in, HTTP out
export async function createOrder(req, res, next) {
  try {
    const order = await orderService.create(req.user.id, req.body);
    res.status(201).json(order);
  } catch (err) {
    next(err);
  }
}

// services/orders.js — pure logic, no req/res anywhere
export async function create(userId, input) {
  const total = calculateTotal(input.items);
  if (total <= 0) throw new ValidationError("Order total must be positive");
  return Order.create({ userId, ...input, total });
}`,
      },
      {
        type: "p",
        text: "The test for whether you have this right: can you call the service from a script, a cron job or a queue worker without faking a request object? If not, the logic is still in the wrong layer.",
      },
      { type: "h2", text: "Design schemas around your queries" },
      {
        type: "p",
        text: "This is the biggest mental shift coming from SQL. In MongoDB you model for how data is read, not for normalised purity. If you always load an order together with its line items, embed them. If line items are queried independently or grow without bound, reference them.",
      },
      {
        type: "list",
        items: [
          "Embed when the child is always read with the parent and the array stays bounded",
          "Reference when the child is queried on its own, shared between parents, or unbounded",
          "Index every field you filter, sort or join on — a compound index must match your query's field order",
          "Never let an embedded array grow without a limit; documents cap at 16MB",
        ],
      },
      {
        type: "code",
        lang: "js",
        code: `const orderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "paid", "shipped"], default: "pending" },
    items: [{ sku: String, qty: Number, price: Number }], // bounded, always read together
    total: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

// Matches: find({ userId, status }).sort({ createdAt: -1 })
orderSchema.index({ userId: 1, status: 1, createdAt: -1 });`,
      },
      { type: "h2", text: "Validate at the boundary, once" },
      {
        type: "p",
        text: "Every request body is untrusted. Validate it the moment it arrives, with a schema, and let everything downstream assume the shape is correct. Zod works well here because the same schema can be reused on the React side, so the client and server cannot drift apart.",
      },
      {
        type: "code",
        lang: "js",
        code: `import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.array(
    z.object({ sku: z.string().min(1), qty: z.number().int().positive() })
  ).min(1),
  note: z.string().max(500).optional(),
});

export const validate = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ error: "Invalid request", issues: parsed.error.issues });
  }
  req.body = parsed.data; // now guaranteed to match the schema
  next();
};`,
      },
      { type: "h2", text: "Plan the auth refresh flow before you ship" },
      {
        type: "p",
        text: "Retrofitting refresh tokens onto a live app is painful, because every client already holds credentials in the old format. Decide up front: a short-lived access token, a longer-lived refresh token in an httpOnly cookie, and a single endpoint that exchanges one for the other. Storing access tokens in localStorage is convenient and leaves them readable by any injected script.",
      },
      { type: "h2", text: "One error shape, one handler" },
      {
        type: "p",
        text: "Define your error classes once and let a single Express error middleware turn them into responses. Without this you end up with four different error formats and a frontend full of special cases.",
      },
      {
        type: "code",
        lang: "js",
        code: `export class AppError extends Error {
  constructor(message, status = 500, code = "internal_error") {
    super(message);
    this.status = status;
    this.code = code;
  }
}

// Last middleware registered — everything funnels through here
app.use((err, req, res, _next) => {
  const status = err.status ?? 500;
  if (status >= 500) console.error(err);
  res.status(status).json({
    error: err.code ?? "internal_error",
    message: status >= 500 ? "Something went wrong" : err.message,
  });
});`,
      },
      { type: "h2", text: "Keep fetch logic out of components" },
      {
        type: "p",
        text: "On the React side, put every call behind a query hook. Components then describe what they need rather than how to get it, and you get caching, deduplication and background refresh without writing any of it yourself.",
      },
      {
        type: "code",
        lang: "tsx",
        code: `export function useOrders(status: OrderStatus) {
  return useQuery({
    queryKey: ["orders", status],
    queryFn: () => api.get("/orders", { params: { status } }),
    staleTime: 30_000,
  });
}

// In the component
const { data: orders, isPending, error } = useOrders("pending");`,
      },
      { type: "h2", text: "Deploy the two halves independently" },
      {
        type: "p",
        text: "A frontend on a CDN and an API on its own host can be released and rolled back separately. Coupling them means a CSS fix requires redeploying your database connections. Keep configuration in environment variables on both sides, and never commit a secret — a client-side variable is inlined into the bundle and is public by definition.",
      },
      {
        type: "p",
        text: "None of this is exotic. It is mostly about deciding where things live before the deadline pressure arrives, because that is the moment everything ends up in the route handler.",
      },
    ],
  },
  {
    slug: "typescript-patterns-for-react",
    title: "TypeScript Patterns I Use in Every React Project",
    excerpt:
      "Discriminated unions for UI state, schema-inferred API types, and typed hooks — the handful of TypeScript patterns that catch real bugs before runtime.",
    coverImage:
      "https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=800&h=450&fit=crop",
    category: "TypeScript",
    publishedAt: "2025-09-18",
    updatedAt: "2026-08-02",
    tags: ["TypeScript", "React", "DX"],
    content: [
      {
        type: "p",
        text: "TypeScript pays for itself when it makes invalid states impossible to write, not when it decorates your code with annotations the compiler could have inferred. These are the patterns that have actually caught bugs on projects I have shipped.",
      },
      { type: "h2", text: "Model UI state as a discriminated union" },
      {
        type: "p",
        text: "Separate booleans for loading, error and data allow states that make no sense — loading and error true at once, or data present while still loading. A union makes those unrepresentable, and the compiler forces you to handle every case.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// Allows isLoading && error && data — three impossible states
type Bad = { isLoading: boolean; error?: Error; data?: User[] };

// Exactly four valid shapes, and TypeScript narrows on \`status\`
type RequestState<T> =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "error"; error: Error }
  | { status: "success"; data: T };`,
      },
      {
        type: "code",
        lang: "tsx",
        code: `function UserList({ state }: { state: RequestState<User[]> }) {
  switch (state.status) {
    case "idle":
      return null;
    case "loading":
      return <Skeleton />;
    case "error":
      return <ErrorBox message={state.error.message} />;
    case "success":
      // state.data is User[] here — no optional chaining needed
      return <ul>{state.data.map((u) => <li key={u.id}>{u.name}</li>)}</ul>;
  }
}`,
      },
      { type: "h2", text: "Infer API types from a schema, do not hand-write them" },
      {
        type: "p",
        text: "A hand-written interface for an API response is a guess that goes stale the moment the backend changes. Parse the response with a schema instead and infer the type from it — then the type is guaranteed to match what you actually validated.",
      },
      {
        type: "code",
        lang: "ts",
        code: `import { z } from "zod";

const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email(),
  role: z.enum(["admin", "member"]),
});

export type User = z.infer<typeof userSchema>; // stays in sync automatically

export async function fetchUser(id: string): Promise<User> {
  const res = await fetch("/api/users/" + id);
  if (!res.ok) throw new Error("Failed to load user");
  return userSchema.parse(await res.json()); // throws loudly on drift
}`,
      },
      {
        type: "p",
        text: "The real benefit shows up when the backend renames a field. Without parsing you get undefined somewhere deep in a component and a blank screen. With it you get an explicit error naming the field, at the boundary.",
      },
      { type: "h2", text: "Make impossible prop combinations un-typeable" },
      {
        type: "p",
        text: "If a component takes either an icon or an avatar but never both, encode that in the type rather than documenting it in a comment nobody reads.",
      },
      {
        type: "code",
        lang: "ts",
        code: `type BadgeProps = { label: string } & (
  | { icon: ReactNode; avatarUrl?: never }
  | { avatarUrl: string; icon?: never }
);

<Badge label="Pro" icon={<Star />} />              // ok
<Badge label="Ann" avatarUrl="/a.png" />           // ok
<Badge label="X" icon={<Star />} avatarUrl="/a" /> // compile error`,
      },
      { type: "h2", text: "Type your hooks at the boundary, not everywhere" },
      {
        type: "p",
        text: "Annotate what a hook returns and let inference handle the rest. Over-annotating internals adds noise without adding safety — TypeScript already knows the types of your local variables.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// The return type is the contract worth stating explicitly
export function useDisclosure(initial = false): {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  toggle: () => void;
} {
  const [isOpen, setIsOpen] = useState(initial);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  const toggle = useCallback(() => setIsOpen((v) => !v), []);
  return { isOpen, open, close, toggle };
}`,
      },
      { type: "h2", text: "Avoid any in event handlers and forms" },
      {
        type: "p",
        text: "Form and event code is where runtime errors concentrate, so it is exactly where any hurts most. React ships precise event types, and react-hook-form with a resolver gives you a form whose field names are checked against your schema.",
      },
      {
        type: "code",
        lang: "tsx",
        code: `const form = useForm<z.infer<typeof contactSchema>>({
  resolver: zodResolver(contactSchema),
});

// Typo in a field name is a compile error, not a silent no-op
<input {...form.register("email")} />

function onChange(e: React.ChangeEvent<HTMLInputElement>) {
  setValue(e.target.value); // e.target is typed, not any
}`,
      },
      { type: "h2", text: "Export types from the feature that owns them" },
      {
        type: "p",
        text: "Keep types beside the code they describe rather than in one growing types.ts. A single shared file becomes a dependency magnet that everything imports and nothing can safely change. Feature-local types keep pages thin and make it obvious which module owns a shape.",
      },
      {
        type: "p",
        text: "The pattern behind all of these is the same: push type information to the edges of the system — the API boundary, the form, the component contract — and let inference do the work in between. That is where the bugs are, and it is where the annotations earn their keep.",
      },
    ],
  },
];

export function findBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/** Average adult reading speed for technical prose, words per minute. */
const WORDS_PER_MINUTE = 220;

/** Prose only — code blocks are scanned, not read, so counting them inflates read time. */
export function wordCountOf(post: BlogPost): number {
  return post.content
    .flatMap((b) => {
      if (b.type === "p" || b.type === "h2") return b.text;
      if (b.type === "list") return b.items;
      return []; // code excluded
    })
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
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
