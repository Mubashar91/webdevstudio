/**
 * Blog content.
 *
 * Bodies are structured blocks rather than a flat string[] so posts can carry
 * headings, lists and real code samples. Three consecutive SEO audits flagged
 * these posts as ~120-word stubs with "no code snippets or benchmarks — a weak
 * signal for a developer-audience technical topic"; a flat paragraph array made
 * that hard to fix without hacks.
 */

// The Cyprus cost guide quotes prices in EUR while the rest of the site quotes
// USD. Both come from one rate in site.config.mjs so this post and
// /web-development-cyprus can't drift into two different price stories — the
// exact inconsistency an SEO audit found between them.
import { CYPRUS_EUR_APP_FROM, CYPRUS_EUR_FROM } from "@/lib/site.config.mjs";

/**
 * `text` and list `items` support two inline markers, rendered by
 * `renderInline()` in BlogDetail: `**bold**` and `[label](/path)`. Everything
 * else is literal — this is deliberately not a Markdown parser, just the two
 * things long-form buyer-intent copy actually needs.
 *
 * `h3` exists because an SEO audit flagged every post as H2-only, which
 * flattens the outline crawlers use to work out which sections are
 * subordinate to which. Numbered sub-points belong at h3 under their parent.
 *
 * `table` exists because the same audit found price bands and comparisons
 * written as prose, and comparison tables are one of the formats AI answer
 * engines lift most readily.
 */
export type ContentBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "h3"; text: string }
  | { type: "list"; items: string[] }
  | { type: "table"; headers: string[]; rows: string[][]; caption?: string }
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
      {
        type: "p",
        text: "Two things sit either side of this list. When the slowness is in the data layer rather than the browser, it's an architecture problem — [how I structure a MERN app](/blogs/mern-stack-architecture-guide) covers where that work belongs. And if you're touching the component layer anyway, [the TypeScript patterns I use in React](/blogs/typescript-patterns-for-react) rule out a whole class of re-render bug before it's written. If you're not a developer and landed here trying to work out why a site feels slow, [the plain-English version](/blogs/why-is-my-website-slow) is the better starting point.",
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
      {
        type: "p",
        text: "Two companion pieces: [the TypeScript patterns](/blogs/typescript-patterns-for-react) that keep the boundaries above actually enforced rather than merely documented, and [the React performance work](/blogs/react-performance-tips-2025) that starts to matter once the data layer is doing its job and the remaining cost is in the browser.",
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
      {
        type: "p",
        text: "Where these land in a real project is [the MERN architecture guide](/blogs/mern-stack-architecture-guide) — the API boundary in particular is the same seam viewed from the server side. Once the types are holding, [the React performance list](/blogs/react-performance-tips-2025) is the next place worth spending time.",
      },
    ],
  },
  {
    slug: "custom-web-app-cost-2026",
    // Was "... in 2026? A Developer's Honest Breakdown" — 76 characters, so
    // Google truncated it mid-subtitle and the brand never appeared. At 44 the
    // question survives intact and withBrand() can still append
    // " | WebDevStudio" inside the ~62 character budget. The subtitle it drops
    // is already the first thing on the page, as the excerpt.
    title: "How Much Does a Custom Web App Cost in 2026?",
    excerpt:
      "What a custom web app really costs, what drives the number up, and four levers that cut the price without cutting quality — from a fixed-price developer.",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-06",
    tags: ["Web App Cost", "Hiring", "React", "MERN"],
    content: [
      {
        type: "p",
        text: "Nobody wants to be the client who asks “how much does a custom web app cost” and gets back “it depends.” It does depend — but the things it depends on are knowable, and you're entitled to see them before you sign anything. This is how I price work, what pushes a quote from $900 to $10,000, and where you can genuinely save money without ending up with something you'll pay someone else to rebuild in eighteen months.",
      },
      { type: "h2", text: "How much does a custom web app cost? The three price bands" },
      {
        type: "p",
        text: "Most custom web projects fall into one of three shapes. These are my own fixed-price bands, and they're the same numbers on my services page.",
      },
      {
        // A table, matching the NZ and Cyprus cost posts. This was a bulleted
        // list, which the paragraph immediately below already called "that
        // table" — and price bands in a table are one of the formats AI answer
        // engines and featured snippets lift most readily.
        type: "table",
        headers: ["Band", "From", "Timeline", "What it includes"],
        rows: [
          [
            "Marketing site",
            "$900",
            "2–3 weeks",
            "Up to about six pages, React and TypeScript, SEO foundations, a contact form, Core Web Vitals tuned",
          ],
          [
            "Web application",
            "$2,500",
            "6–10 weeks",
            "A full MERN build, auth and roles, a REST API, a MongoDB schema, an admin dashboard, a deploy pipeline",
          ],
          [
            "Ongoing partner",
            "$1,200/month",
            "Rolling",
            "Dedicated hours, features, code review, performance and accessibility audits",
          ],
        ],
        caption:
          "Fixed-price bands, quoted in USD. Every project is scoped in writing before work starts.",
      },
      {
        type: "p",
        text: "The word doing the work in that table is from. A web application with two user roles, one payment provider and a straightforward data model sits near the bottom of its band. The same app with four roles, a booking engine, an approvals workflow and two third-party integrations is a different project with a different number — usually two to four times the starting figure.",
      },
      {
        type: "p",
        text: "The reason I quote a fixed price after a call rather than publishing one number is that the call is where those multipliers get discovered. Anyone who quotes a web application before understanding your data model is guessing, and you'll pay for the guess later as change requests.",
      },
      { type: "h2", text: "What actually drives the price" },
      {
        type: "p",
        text: "Five things move a quote more than anything else. Every one of them is something you can describe in a sentence before you talk to a developer.",
      },
      { type: "h2", text: "1. Your permission model" },
      {
        type: "p",
        text: "“Users can log in” is cheap. “Admins approve what managers submit, contractors see only their own jobs, and clients see a read-only view” is not. Every distinct role multiplies the number of screens, API guards and test cases.",
      },
      {
        type: "p",
        text: "The cost isn't the login form — that's a few hours. It's that every endpoint and every route now needs to know who's asking:",
      },
      {
        type: "code",
        lang: "ts",
        code: `// One role: this is the whole authorisation story
router.get("/jobs", requireAuth, listJobs);

// Four roles: every endpoint carries policy, and every policy needs testing
router.get(
  "/jobs",
  requireAuth,
  requireRole("admin", "manager", "contractor", "client"),
  scopeToOrg,                      // multi-tenant boundary
  scopeToOwnRecords("contractor"), // contractors see only their own
  listJobs
);`,
      },
      {
        type: "p",
        text: "Each of those middlewares is small. What costs money is that they compose across forty endpoints, and getting one wrong is a data leak rather than a bug.",
      },
      {
        type: "p",
        text: "Rule of thumb: each additional role beyond the second adds meaningfully to both build and test time. If two of your roles differ only by one button, make them one role with a flag.",
      },
      { type: "h2", text: "2. Your data model" },
      {
        type: "p",
        text: "The number of screens is a poor predictor of cost. The number of relationships is a good one. A flat list of records is quick. Records that belong to organisations, reference each other, and have to stay consistent when one is deleted are where the real engineering sits.",
      },
      {
        type: "code",
        lang: "ts",
        code: `// Cheap: standalone documents
const Enquiry = new Schema({ name: String, email: String, message: String });

// Expensive: this schema implies tenancy rules, cascade behaviour,
// aggregation queries for reporting, and index design for all of it
const Job = new Schema({
  org:        { type: ObjectId, ref: "Org", required: true, index: true },
  site:       { type: ObjectId, ref: "Site", required: true },
  assignedTo: { type: ObjectId, ref: "User" },
  status:     { type: String, enum: ["draft", "scheduled", "in_progress", "complete"] },
  checklist:  [{ label: String, done: Boolean, completedBy: ObjectId }],
});`,
      },
      {
        type: "p",
        text: "The second schema is maybe fifteen more lines. It's also several weeks more work, because it brings tenancy isolation, cascade rules on deletion, reporting aggregations and index design along with it.",
      },
      { type: "h2", text: "3. Integrations" },
      {
        type: "p",
        text: "Every external system you connect to is a small project of its own: authentication, sandbox testing, error handling, and a plan for what your app does when that system is down. Payments, accounting software, email platforms, calendars, CRMs, SMS providers — each one is real scoped work, not a checkbox.",
      },
      {
        type: "p",
        text: "Stripe Checkout is the cheap end because it hands off the hard parts. A custom subscription billing flow with proration and dunning is at the other end and can rival the cost of the rest of the app.",
      },
      { type: "h2", text: "4. Whether a design already exists" },
      {
        type: "p",
        text: "If you arrive with a Figma file, I build it. If you don't, someone has to make hundreds of decisions about type scale, spacing, colour, states and responsive behaviour — and that's design work, priced separately from development in most honest quotes.",
      },
      {
        type: "p",
        text: "Middle path that most of my clients take: start from a well-built component base and customise it. You get a coherent interface without paying for a bespoke design system you don't need yet.",
      },
      { type: "h2", text: "5. What “done” means to you" },
      {
        type: "p",
        text: "Done can mean “it works on my laptop.” It can also mean tested, monitored, documented, accessible, and deployed through a pipeline that lets the next developer ship safely. The gap between those two definitions is often 30 to 40 percent of a project's cost, and it's the gap most cheap quotes are hiding in.",
      },
      { type: "h2", text: "Why “how many pages?” is the wrong question" },
      {
        type: "p",
        text: "A developer asking how many pages you need is scoping a brochure site. For an application, one screen can be ten times another screen.",
      },
      { type: "p", text: "Consider a jobs list. Version one:" },
      {
        type: "code",
        lang: "tsx",
        code: `export function JobsList({ jobs }: { jobs: Job[] }) {
  return <ul>{jobs.map((j) => <li key={j.id}>{j.title}</li>)}</ul>;
}`,
      },
      {
        type: "p",
        text: "Version two is the same screen your users actually asked for — server-side pagination, filters that survive a refresh, sorting, role-aware actions, an empty state, an error state and a loading skeleton:",
      },
      {
        type: "code",
        lang: "tsx",
        code: `export function JobsList() {
  const [params, setParams] = useSearchParams(); // filters live in the URL
  const { data, isLoading, error } = useQuery({
    queryKey: ["jobs", params.toString()],
    queryFn: () => api.jobs.list(params),
    placeholderData: keepPreviousData, // no flash between pages
  });

  if (isLoading) return <TableSkeleton rows={10} />;
  if (error) return <ErrorState onRetry={() => refetch()} />;
  if (!data.items.length) return <EmptyState onCreate={openCreateDialog} />;

  return (
    <>
      <JobFilters value={params} onChange={setParams} />
      <JobTable items={data.items} canEdit={usePermission("jobs:update")} />
      <Pagination page={data.page} total={data.total} onChange={setPage} />
    </>
  );
}`,
      },
      {
        type: "p",
        text: "Same page on your sitemap. Roughly ten times the work — and version two is the one that doesn't generate support emails. When you compare two quotes, this is usually where the difference lives. Ask both developers what their version of a list screen includes.",
      },
      { type: "h2", text: "Fixed price or hourly?" },
      {
        type: "p",
        text: "I quote fixed price for defined scope, and hourly or monthly for open-ended work. Both are legitimate; they just move the risk to different places.",
      },
      {
        type: "p",
        text: "Fixed price puts the estimation risk on me. You know the number before work starts, which makes it easy to get approved internally. The trade-off is that scope has to be pinned down first, and genuinely new requirements become a change order rather than a conversation.",
      },
      {
        type: "p",
        text: "Hourly or retainer puts the risk on you but keeps you fast. It's the right shape when the destination is still moving — early product work, ongoing iteration, or a backlog that reprioritises every fortnight.",
      },
      {
        type: "p",
        text: "The failure mode to avoid is fixed price with vague scope. That contract makes your developer's interests point the wrong way: every clarification becomes something to argue about instead of something to solve.",
      },
      { type: "h2", text: "What a fair quote includes" },
      {
        type: "p",
        text: "Whoever you hire, the deliverable should include all of this. If any line is missing, ask why — the answer tells you a lot:",
      },
      {
        type: "list",
        items: [
          "Your repository, in your account, from day one — not handed over at the end",
          "A deployment pipeline so the app can be updated after the developer leaves",
          "Environment separation — at minimum a staging URL you can click through before anything reaches production",
          "A README that lets another developer run the project locally without a phone call",
          "Performance and accessibility baselines — green Core Web Vitals and keyboard-navigable interfaces, not as an upsell",
          "A defined support window after launch. Mine is 30 days on application projects.",
        ],
      },
      { type: "h2", text: "Four ways to cut cost that don't cost you later" },
      {
        type: "p",
        text: "Cheap quotes usually save money by removing things from that list. These are the levers that don't:",
      },
      {
        type: "list",
        items: [
          "Phase it — ship the one workflow that earns or saves money, then fund phase two from what it returns. Most of the features in an initial spec turn out not to be phase-one features once someone is paying per week for them.",
          "Don't build auth from scratch — rolling your own session handling, password reset, MFA and account recovery is weeks of work in a domain where mistakes are expensive. A hosted provider is close to free at your user count.",
          "Bring your content — waiting on copy and images is one of the most common causes of a project timeline slipping, and slipped timelines cost money on every pricing model.",
          "Consolidate roles and states — every extra role, status and edge case is permanently more code to build, test and maintain. Cutting one role early is usually the cheapest scope reduction available.",
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "p", text: "A few things clients ask before we start:" },
      { type: "h2", text: "Is a freelance developer cheaper than an agency?" },
      {
        type: "p",
        text: "Usually, because you're paying for one person's time rather than an account manager, a project manager and a margin on both. The trade-off is capacity: a solo developer has a queue and no bench. For projects at the scale above, that's a fair trade — for a twelve-person, multi-year build, it isn't.",
      },
      { type: "h2", text: "Why do quotes for the same brief vary so much?" },
      {
        type: "p",
        text: "Because “the same brief” almost never describes the same finished product. One quote assumes the simple list screen, the other assumes the production one. Compare deliverables, not totals.",
      },
      { type: "h2", text: "What does ongoing maintenance cost?" },
      {
        type: "p",
        text: "Budget for it as a real line item — dependency updates, security patches and small fixes don't stop after launch. My retainers start at $1,200 a month; ad hoc work is also fine if your needs are occasional.",
      },
      { type: "h2", text: "Do you work across time zones?" },
      {
        type: "p",
        text: "Yes. Most of my clients are in New Zealand, Cyprus, the EU, the UK and Australia. Calls happen in an overlapping window; everything else runs asynchronously with written daily updates.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "If you have a project in mind, the most useful thing you can do before talking to anyone is write down three things: who the different types of user are, what the main thing each of them does, and what has to be true on launch day. That single page is enough for me to give you a real number instead of a range.",
      },
      {
        type: "p",
        text: "If you're not yet certain a custom app is the right shape at all, [app or website](/blogs/do-i-need-an-app-or-a-website) settles that first — a much cheaper question to answer than this one. Once you know what you're building, [how to hire a web developer](/blogs/how-to-hire-a-web-developer) covers judging the quotes that come back. For local figures rather than these general bands: [New Zealand](/blogs/website-cost-new-zealand-2026) and [Cyprus](/blogs/website-cost-cyprus-2026).",
      },
      {
        type: "p",
        text: "Book a free 30-minute call and you'll get a fixed written quote — scope and price agreed before any work begins.",
      },
    ],
  },
  {
    slug: "do-i-need-an-app-or-a-website",
    title: "Do I Need an App, or Just a Better Website?",
    excerpt:
      "Most people who ask me for an app don't need one. Here's how to tell the difference — and why picking wrong is the most expensive mistake in the whole project.",
    coverImage:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-06",
    tags: ["Web App", "Mobile App", "Small Business"],
    content: [
      {
        type: "p",
        text: "When someone tells me they need an app, they're usually describing one of three quite different things. Sorting out which one is the most valuable half-hour in the whole project, because the three options differ in cost by roughly an order of magnitude — and picking the expensive one when the cheap one would have worked is the most costly mistake available to you.",
      },
      { type: "h2", text: "The short answer" },
      {
        type: "p",
        text: "You need a website if your goal is for strangers to find you, trust you, and get in touch.",
      },
      {
        type: "p",
        text: "You need a web app — a site people log into to do something — if your goal is for customers or staff to book, order, track, submit or manage something.",
      },
      {
        type: "p",
        text: "You need a mobile app — the kind installed from the App Store — only if you need something a browser genuinely can't do: push notifications people must not miss, working offline, camera or GPS as a core function, or customers who will open it several times a week for years.",
      },
      {
        type: "p",
        text: "Most businesses that ask me for a mobile app need the middle one. It costs a fraction as much, ships far sooner, works on every device including desktop, and doesn't need anyone to install anything or approve a store listing.",
      },
      { type: "h2", text: "The three things people mean by “app”" },
      {
        type: "p",
        text: "A website is pages you read. Home, services, about, contact. Nobody logs in. Its job is to be found in search, explain what you do, and make it easy to contact you. That's not a small job — for most small businesses it's the one that actually generates revenue.",
      },
      {
        type: "p",
        text: "A web app is a website you log into and use. Your customers book a slot, place an order, upload a document, check the status of their job. Your staff see today's schedule, mark things complete, manage records. It runs in a browser, so it works on a phone, a tablet and the front desk computer without three separate builds.",
      },
      {
        type: "p",
        text: "A mobile app is downloaded from the App Store or Play Store and lives on the home screen. It can do things a browser can't, but it's two builds — iOS and Android — it needs Apple's and Google's approval to publish, every update goes through review, and users have to be persuaded to install it, which is a much higher bar than clicking a link.",
      },
      { type: "h2", text: "Five questions that decide whether you need an app or a website" },
      {
        type: "list",
        items: [
          "Does someone need to log in? No — website. Yes — at least a web app.",
          "Will people use it more than once a week, for a long time? Occasional use — booking a table, checking an order — belongs in a browser. Nobody installs an app they'll open three times a year. Daily use by committed users is the main thing that justifies installation.",
          "Does it need to work with no internet? This is one of the clearest cases for a native mobile app. Field staff in areas with no signal, delivery drivers, site inspections — if the thing must work offline and sync later, a browser is the wrong tool.",
          "Do you need notifications people will definitely see? A phone notification that arrives on a locked screen is meaningfully different from an email. If your business depends on someone responding within minutes, that's a real argument for a mobile app.",
          "Is the camera, GPS or a device sensor central to what it does? Not “nice to have” — central. Scanning, photographing evidence on site, live location tracking. Browsers can do simplified versions of some of this; a native app does all of it properly.",
        ],
      },
      {
        type: "p",
        text: "If you answered no to questions three, four and five, you don't need a mobile app. You need a good web app, and you'll have it sooner and for less.",
      },
      { type: "h2", text: "What each option costs and how long it takes" },
      {
        type: "p",
        text: "Using my own fixed-price bands as a reference point:",
      },
      {
        type: "list",
        items: [
          "Starting price — website from $900, web app from $2,500, mobile app significantly more since it's two platforms",
          "Typical timeline — website 2–3 weeks, web app 6–10 weeks, mobile app longer, plus store review",
          "Works on — website and web app run on everything with a browser; a mobile app only runs on the platforms you build for",
          "Updates — website and web app updates are instant; a mobile app update waits for store review each time",
          "Users must install — no, for a website or web app; yes for a mobile app, which is a real barrier",
          "Ongoing costs — domain and hosting for a website; domain, hosting and a database for a web app; the same plus developer account fees each year for a mobile app",
        ],
      },
      {
        type: "p",
        text: "The row people underestimate is users must install. Getting someone to download an app is a genuine marketing problem on top of your existing marketing problem. A web link works on the first click, from a text message, a search result or a QR code on your counter.",
      },
      {
        type: "p",
        text: "The other row that surprises people is updates. A web app change is live the moment I deploy it. A mobile app fix waits for review before it reaches your users — which stops being an abstract inconvenience the first time you have a bug in production.",
      },
      { type: "h2", text: "The strongest argument for starting with a web app" },
      {
        type: "p",
        text: "Even if you eventually need a mobile app, building the web version first is usually the right sequence — and it's rarely wasted work.",
      },
      {
        type: "p",
        text: "A mobile app needs a backend: the database, the accounts, the business rules, the admin screens. That backend is the majority of the engineering, and it's exactly what a web app is. Build the web app, get real users on it, learn what they actually do rather than what you assumed, and then — if the case for installation is still there — the mobile app plugs into a backend that already works and has already been corrected by real usage.",
      },
      {
        type: "p",
        text: "Doing it the other way round means committing to your assumptions at the most expensive possible moment.",
      },
      { type: "h2", text: "When you genuinely do need a mobile app" },
      {
        type: "p",
        text: "I'm not arguing nobody needs one. Build one when:",
      },
      {
        type: "list",
        items: [
          "Your users are staff or committed customers who'll open it most days",
          "It must work offline and sync when signal returns",
          "Push notifications are core to the product, not a marketing extra",
          "The camera, GPS or sensors do the actual work",
          "You're building a consumer product where being on the home screen is the business model",
        ],
      },
      {
        type: "p",
        text: "If two or more of those describe you, a mobile app is the right call and the extra cost is justified.",
      },
      { type: "h2", text: "The mistake that costs the most" },
      {
        type: "p",
        text: "The expensive version of this decision isn't picking the wrong option — it's picking the most expensive option first, before anyone has used anything.",
      },
      {
        type: "p",
        text: "A mobile app built on assumptions takes months and a large budget to reach the point where you find out which assumptions were wrong. A web app reaches that point in weeks, for a fraction of the money, and every correction is cheaper because it deploys instantly.",
      },
      {
        type: "p",
        text: "Whichever direction you're leaning, the first version should be the smallest thing that solves the single most important problem. Everything else is a phase two you can fund with what phase one earns you.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "p", text: "A few things people ask before we start:" },
      { type: "h2", text: "Can a web app work on a phone?" },
      {
        type: "p",
        text: "Yes — a well-built one is designed for phones first and looks and behaves like an app on a small screen. It can also be saved to the home screen with its own icon, opening full-screen without a browser bar. For most business use cases that's close enough to an app that users don't notice the difference.",
      },
      { type: "h2", text: "Can I turn my website into an app later?" },
      {
        type: "p",
        text: "Partly. The backend — accounts, data, business rules — carries over almost entirely, which is the bulk of the work. The interface has to be rebuilt for each mobile platform. That's why building the web version first is rarely wasted money.",
      },
      { type: "h2", text: "Which is cheaper to maintain?" },
      {
        type: "p",
        text: "Web, by a clear margin. One codebase instead of two, no annual developer account fees, no store review for updates, and no risk of an operating system update breaking your app for half your users.",
      },
      { type: "h2", text: "How do I decide if I'm still unsure?" },
      {
        type: "p",
        text: "Describe what you want to happen, not what you want built. If you can say “a customer should be able to X, and my staff should see Y,” any competent developer can tell you which option fits — and a good one will tell you if the cheaper option is enough.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Write down the one thing this needs to do, and who does it. That single sentence is usually enough to settle the app-versus-website question in a few minutes.",
      },
      {
        type: "p",
        text: "If the answer turns out to be a web app, [what one costs](/blogs/custom-web-app-cost-2026) is the next question, and [what one is actually built from](/blogs/mern-stack-architecture-guide) is the technical version of the same answer. If it's who builds it you're weighing up, [remote developer or local agency](/blogs/remote-developer-vs-local-agency) and [how to hire a web developer](/blogs/how-to-hire-a-web-developer) cover that side of it.",
      },
      {
        type: "p",
        text: "If you'd like a straight answer on which one your situation calls for, book a free 30-minute call. I'll tell you if a website is enough, and I'll tell you if you don't need to build anything at all — that answer has saved more than one person a five-figure mistake.",
      },
    ],
  },
  {
    slug: "website-cost-new-zealand-2026",
    title: "How Much Does a Website Cost in New Zealand in 2026?",
    excerpt:
      "Real 2026 NZ website prices: $1,500–$8,000 + GST for most small business sites. What each band buys, and how to compare quotes properly.",
    coverImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-07",
    tags: ["Website Cost", "New Zealand", "Small Business"],
    content: [
      {
        type: "p",
        text: "Most NZ small business websites land between **$1,500 and $8,000 + GST**, and the number is driven by scope and who writes the words — not by page count. Under $1,000 usually means a template with no copywriting and no tracking. Above $15,000 means an agency team, which is worth it for complex functionality and overkill for a six-page service site. Hosting and maintenance run $39–$99/month on top and almost never appear in the headline quote.",
      },
      { type: "h2", text: "How much does a website cost in New Zealand?" },
      {
        type: "p",
        text: "A professional small business website in New Zealand costs between **$1,500 and $8,000 + GST** in 2026, with most service businesses landing in the $2,500–$6,000 range. eCommerce starts around $5,000 and rises quickly with catalogue size and integrations.",
      },
      {
        type: "p",
        text: "That's a wide range because \"a website\" describes both a four-page site for a plumber and a 200-product store. The rest of this guide explains what moves you between the bands, so you can read a quote properly.",
      },
      { type: "h2", text: "What you actually get at each price band" },
      {
        type: "table",
        headers: ["Band", "What it usually is", "Sensible for"],
        rows: [
          ["Under $1,000", "Template, no copywriting, no analytics, often offshore", "Testing an idea; a placeholder"],
          ["$1,500–$3,000", "4–6 pages, responsive, contact form, basic SEO setup", "Sole traders, new service businesses"],
          ["$3,000–$8,000", "Custom design, written copy, CMS, tracking, proper service-page structure", "Most established NZ small businesses"],
          ["$8,000–$15,000", "Larger builds, integrations, eCommerce, multiple stakeholders", "Retail, multi-location, booking systems"],
          ["$15,000+", "Agency team, design system, ongoing strategy", "Complex products, real brand work"],
        ],
        caption: "Prices exclude GST, which NZ-based providers add at 15%.",
      },
      {
        type: "p",
        text: "New Zealand market guides mostly converge on the middle: an experienced local freelancer or small studio for a lead-generating site sits around $2,500–$9,000, which is where most trade and service businesses should be.",
      },
      { type: "h2", text: "Why is NZ web design more expensive than what I see online?" },
      {
        type: "p",
        text: "Because NZ pricing reflects NZ wages and a small market. An offshore quote and an Auckland quote of $5,000 are usually not the same product — and the difference is rarely the design.",
      },
      {
        type: "p",
        text: "What the higher number typically buys that the lower one doesn't:",
      },
      {
        type: "list",
        items: [
          "**Copywriting.** Somebody sits down and writes your service pages. This is the single largest hidden cost, and it's what determines whether the site generates enquiries.",
          "**Strategy and structure.** One page per service, named the way customers search, rather than a single \"Services\" page listing eight things.",
          "**Tracking.** Analytics, conversion goals, and a way to tell whether the site works.",
          "**A person who answers.** When something breaks in month seven, someone picks up.",
        ],
      },
      {
        type: "p",
        text: "If you take a cheaper quote, take it with eyes open about which of those four you're buying yourself.",
      },
      { type: "h2", text: "What actually drives the price up?" },
      {
        type: "p",
        text: "Ranked by how much they move the number:",
      },
      { type: "h3", text: "1. Content" },
      {
        type: "p",
        text: "Do you supply the words and photos, or does someone write them? This can swing a quote by thousands on its own, and it's the line item buyers most often forget to ask about.",
      },
      { type: "h3", text: "2. Number of distinct page templates" },
      {
        type: "p",
        text: "Templates, not pages. Twenty blog posts share one template. A home page, a service page and a case study page are three separate design and build jobs.",
      },
      { type: "h3", text: "3. Integrations" },
      {
        type: "p",
        text: "Booking systems, Xero, CRMs, payment gateways. Each one is real engineering with its own error states and testing, not a plugin toggle.",
      },
      { type: "h3", text: "4. eCommerce" },
      {
        type: "p",
        text: "Product management, shipping rules, tax handling and checkout testing. The checkout alone carries more edge cases than most brochure sites have pages.",
      },
      { type: "h3", text: "5. Design custom-ness" },
      {
        type: "p",
        text: "A genuinely bespoke design costs more than a well-executed system. Both can look good; only one requires every screen to be drawn from scratch.",
      },
      { type: "h2", text: "What are the ongoing costs nobody quotes?" },
      {
        type: "p",
        text: "Budget **$39–$99/month** for professional hosting in NZ, which should include cloud hosting, daily backups, an SSL certificate and reliable uptime. On top of that:",
      },
      {
        type: "list",
        items: [
          "**Domain:** roughly $30–$60/year.",
          "**Maintenance or care plan:** varies enormously; some studios bundle it, others bill hourly at $50–$150/hour for small changes.",
          "**DIY platforms** (Wix, Squarespace, Shopify) run $20–$60/month — and some bill NZ merchants in US dollars, so there's an exchange-rate cost on top.",
        ],
      },
      {
        type: "p",
        text: "Ask for the twelve-month total, not the build price. Two quotes that look $1,000 apart can be identical once a year of hosting and support is included.",
      },
      { type: "h2", text: "Should I get the cheapest quote?" },
      {
        type: "p",
        text: "Usually not — but not because cheap is always bad. Because cheap and expensive quotes are often for genuinely different jobs, and comparing the bottom-line numbers compares nothing.",
      },
      {
        type: "p",
        text: "Get three quotes and compare these, in this order:",
      },
      {
        type: "list",
        items: [
          "Who writes the copy?",
          "Do I own the domain, the hosting account, and the code?",
          "What happens in month seven when I need a change?",
          "Is the price fixed, or an estimate that moves?",
        ],
      },
      {
        type: "p",
        text: "A $2,500 quote where you own everything and the copy is written for you is better value than a $900 quote where you own a login to somebody else's platform. There's a longer version of this in [how to hire a web developer when you don't know how to code](/blogs/how-to-hire-a-web-developer).",
      },
      { type: "h2", text: "How long does a website take in New Zealand?" },
      {
        type: "p",
        text: "A small business website takes **4–6 weeks** from kickoff to launch, assuming content arrives on time. eCommerce and integration-heavy builds run 8–12 weeks.",
      },
      {
        type: "p",
        text: "The most common cause of overrun isn't development. It's content — the photos, the service descriptions, the team bios. If you want the timeline to hold, have the words ready before the build starts.",
      },
      { type: "h2", text: "Where does WebDevStudio sit?" },
      {
        type: "p",
        text: "I build in React and TypeScript rather than WordPress, and I work remotely from Pakistan with NZ clients. Fixed price from **USD $900** for a marketing site and **USD $2,500** for a web application, invoiced in NZD if you prefer. At current rates that puts a marketing site at roughly NZ$1,500 — the bottom of the local band rather than below it.",
      },
      {
        type: "p",
        text: "I'd rather be straight about the trade-off than pretend there isn't one. At that price you are buying **build quality, not a full-service agency**: you supply the copy and photos, and you get a fast, accessible, well-structured site with a fixed number agreed before anything starts. If you need someone to write your service pages, interview your customers and run your Google Ads, a local studio at $5,000 is a genuinely different and better-fitting purchase.",
      },
      {
        type: "p",
        text: "If you're weighing that choice specifically, I've written it up properly in [remote developer or local agency](/blogs/remote-developer-vs-local-agency).",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How much does a website cost for a small business in NZ?" },
      {
        type: "p",
        text: "Most small business websites in New Zealand cost $1,500–$8,000 + GST in 2026, with the majority of service businesses landing between $2,500 and $6,000. The main variables are who writes the content and how many distinct page templates the site needs.",
      },
      { type: "h3", text: "Is a $1,000 website worth it?" },
      {
        type: "p",
        text: "It can be, if you know what you're getting: usually a template with no copywriting, no analytics and limited support. That's fine as a placeholder or a test. It's a poor long-term business website, because a site that doesn't generate enquiries is expensive at any price.",
      },
      { type: "h3", text: "Do I have to pay GST on a website?" },
      {
        type: "p",
        text: "NZ-based providers charge 15% GST on top of quoted prices, and most guides quote ex-GST. Overseas providers generally don't charge NZ GST. Always confirm whether a quote includes it — it's a 15% difference on the same number.",
      },
      { type: "h3", text: "Who owns the website when it's finished?" },
      {
        type: "p",
        text: "You should own the domain, the hosting account and the site itself. Ask this before you pay a deposit. If the answer is that you're licensing a platform, that's a valid arrangement — just make sure you know that's what you bought.",
      },
      { type: "h3", text: "How much does it cost to maintain a website in NZ?" },
      {
        type: "p",
        text: "Hosting is $39–$99/month for a professional setup with backups and SSL. Content changes are commonly billed at $50–$150/hour, or bundled into a monthly care plan. Budget for both from year one, not just for the build.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Write down your page list and decide who is writing the copy. Those two answers determine most of the number, and having them ready is what turns a range into a fixed quote.",
      },
      {
        type: "p",
        text: "If what you're pricing is closer to a web application than a website, the numbers work differently — [what a custom web app costs](/blogs/custom-web-app-cost-2026) breaks that down. And if you're trying to work out how much of a quote is local market rate rather than scope, the same exercise for [Cyprus](/blogs/website-cost-cyprus-2026) makes a useful comparison: near-identical briefs, very different numbers.",
      },
      {
        type: "p",
        text: "Book a free 30-minute call and you'll get a fixed written quote — scope and price agreed before any work begins.",
      },
    ],
  },
  {
    slug: "website-cost-cyprus-2026",
    title: "How Much Does a Website Cost in Cyprus in 2026?",
    excerpt:
      "Real 2026 Cyprus web design prices: €800–€3,500 for most business sites. What each band buys in Limassol and Nicosia, plus the multilingual cost nobody quotes.",
    coverImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-07",
    tags: ["Website Cost", "Cyprus", "Small Business"],
    content: [
      {
        type: "p",
        text: "Most Cyprus business websites cost **€800–€3,500**, with basic brochure sites commonly €1,500–€3,000 and template packages starting around €350–€800. eCommerce and custom platforms run €3,500–€6,000+. The Cyprus-specific multiplier is **multilingual** — EN / GR / RU versions are three sites' worth of content, not one. Hosting and domain run roughly €80–€180/year, and maintenance is billed separately.",
      },
      { type: "h2", text: "How much does a website cost in Cyprus?" },
      {
        type: "p",
        text: "A professional business website in Cyprus costs between **€800 and €3,500** in 2026 depending on complexity, page count and how many languages it needs. Basic brochure sites for small businesses typically sit at €1,500–€3,000, while eCommerce and custom platforms can exceed €6,000.",
      },
      {
        type: "p",
        text: "You will also see offers starting from €199. Those are real, and they're template-based. The difference between €199 and €2,500 is rarely the visual design — it's structure, content, and whether anyone thought about how customers find you.",
      },
      { type: "h2", text: "What the price bands buy in Limassol and Nicosia" },
      {
        type: "table",
        headers: ["Band", "What it usually is", "Sensible for"],
        rows: [
          ["€199–€450", "Template, 3–5 pages, minimal setup", "A placeholder; testing an idea"],
          ["€450–€800", "Semi-custom layout, 5–10 pages, on-page SEO, business email", "Small local services, freelancers"],
          ["€900–€3,500", "Custom design, proper service-page structure, SEO architecture", "Most established Cyprus businesses"],
          ["€3,500–€6,000", "eCommerce, booking systems, integrations", "Retail, hospitality, clinics"],
          ["€6,000+", "Marketplaces, complex platforms, multi-stakeholder builds", "Fintech, iGaming, shipping"],
        ],
      },
      {
        type: "p",
        text: "The market in Limassol, Nicosia and Paphos has become noticeably more competitive, which is good news as a buyer — but it also means the same brief gets quoted at wildly different numbers by providers doing genuinely different work.",
      },
      { type: "h2", text: "What makes Cyprus pricing different from the rest of the EU?" },
      {
        type: "p",
        text: "Three things push a Cyprus quote away from a generic European one.",
      },
      { type: "h3", text: "Language" },
      {
        type: "p",
        text: "Many Cyprus businesses need English, Greek and often Russian. Each language needs its own properly structured content — not a translation widget. This is the single most underestimated line item on a Cyprus quote, and it can double a project.",
      },
      { type: "h3", text: "International audiences" },
      {
        type: "p",
        text: "Limassol businesses in particular often serve customers who aren't on the island. That changes the copy, the currency handling and sometimes the compliance work.",
      },
      { type: "h3", text: "GDPR" },
      {
        type: "p",
        text: "As an EU member state, Cyprus sites need data-protection thinking built in from the start — minimal data collection, secure auth, clear separation of personal data. Retrofitting this is more expensive than doing it at the beginning.",
      },
      { type: "h2", text: "Why is multilingual so much more expensive?" },
      {
        type: "p",
        text: "Because a second language isn't a translation of the first — it's a second version of every page that has to be structured for search independently.",
      },
      {
        type: "p",
        text: "What actually needs doing per language:",
      },
      {
        type: "list",
        items: [
          "Translated and **localised** copy — a literal translation of English marketing copy reads badly in Greek",
          "Its own URL structure and `hreflang` tags so search engines serve the right version",
          "Its own meta titles and descriptions",
          "Ongoing maintenance — every content change now happens two or three times",
        ],
      },
      {
        type: "p",
        text: "A practical middle path: launch in one language, structure the site so additional languages can be added cleanly, and add the second when you know which one your enquiries actually come in.",
      },
      { type: "h2", text: "What are the ongoing costs?" },
      {
        type: "list",
        items: [
          "**Hosting and domain:** roughly €80–€180/year for a decent server.",
          "**Maintenance:** €50–€500/month depending on what's included. Usually charged separately from the build.",
          "**SEO:** commonly €300–€2,000+/month if you engage an agency, and almost never included in a web design quote.",
        ],
      },
      {
        type: "p",
        text: "Ask for the first-year total. A €900 build with €200/month maintenance costs more in year one than a €2,500 build with €50/month.",
      },
      { type: "h2", text: "How do I compare two very different quotes?" },
      {
        type: "p",
        text: "Compare what's included, not the bottom line. Four questions separate a good €2,500 quote from a bad one:",
      },
      {
        type: "list",
        items: [
          "Who writes the content, and in which languages?",
          "Do I own the domain, the hosting account, and the site files?",
          "Is SEO structure included, or is that a separate engagement?",
          "Is this a fixed price or an estimate?",
        ],
      },
      {
        type: "p",
        text: "If a price seems dramatically low, the usual explanation is a cheap template — which will look fine on launch day and become a constraint within a year.",
      },
      { type: "h2", text: "How long does a website take?" },
      {
        type: "p",
        text: "A simple Cyprus site takes about **three weeks**. An online store or an integration-heavy build should be given at least two months. Add time for each additional language — realistically a week or more per language once content is being written rather than translated.",
      },
      { type: "h2", text: "Where does WebDevStudio sit?" },
      {
        type: "p",
        text: "I'm a remote React and MERN developer working with Cyprus clients from Pakistan, with a 2–3 hour time zone gap that gives genuine live overlap most afternoons rather than pure async hand-offs.",
      },
      {
        type: "p",
        text: `Pricing starts at roughly **€${CYPRUS_EUR_FROM}** for a marketing site and **€${CYPRUS_EUR_APP_FROM.toLocaleString("en-US")}** for a web application — invoiced as USD $900 and USD $2,500, or in EUR if you prefer, fixed before work starts. That puts the entry price at the bottom of the local band above. The honest framing: that's build capacity, not a full-service agency. You supply the copy; I build something fast, accessible and structured properly for search. If you need Greek and Russian copywriting, brand work and ongoing SEO, a local Limassol or Nicosia studio at €2,500+ is a different and more complete purchase.`,
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How much does a small business website cost in Cyprus?" },
      {
        type: "p",
        text: "A basic business website in Cyprus typically costs €1,500–€3,000, with budget template packages available from €350–€800 and custom or eCommerce builds running €3,500–€6,000+. The biggest variables are the number of languages and whether content is written for you.",
      },
      { type: "h3", text: "Is website maintenance included in the price?" },
      {
        type: "p",
        text: "Usually not. Maintenance in Cyprus is generally billed separately at €50–€500 per month covering updates, backups, security checks and support. Confirm what's included before you sign — \"support\" means very different things to different providers.",
      },
      { type: "h3", text: "Do I need my website in Greek and Russian?" },
      {
        type: "p",
        text: "It depends entirely on who your customers are. Many Limassol businesses serve international and Russian-speaking markets and genuinely need all three; a Nicosia service business selling locally may only need Greek and English. Adding a language later is straightforward if the site is built with it in mind, so start with the one your enquiries come in.",
      },
      { type: "h3", text: "Can I build the website myself with Wix or WordPress?" },
      {
        type: "p",
        text: "Yes, and for a very simple presence it's a reasonable choice at €10–€50/month. The trade-offs are SEO limitations, less customisation, and a ceiling you'll hit if the business grows. It's a good way to test whether a website brings you enquiries before committing to a build.",
      },
      { type: "h3", text: "How much does an eCommerce site cost in Cyprus?" },
      {
        type: "p",
        text: "Online stores generally start around €3,500 and rise with catalogue size, payment integrations and shipping rules. Complex platforms with booking systems, CRM integration or marketplace logic exceed €6,000. The technical infrastructure, not the design, is what drives that number.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Decide which languages you actually need on day one, and who is writing them. That single answer moves a Cyprus quote more than any other.",
      },
      {
        type: "p",
        text: "If you're pricing a web application rather than a website, [that's a different cost model](/blogs/custom-web-app-cost-2026) with different drivers. And for a sense of how much of any quote is local market rate rather than scope, the same breakdown for [New Zealand](/blogs/website-cost-new-zealand-2026) is worth a look — comparable briefs, noticeably different numbers.",
      },
      {
        type: "p",
        text: "Book a free 30-minute call and you'll get a fixed written quote — scope and price agreed before any work begins.",
      },
    ],
  },
  {
    slug: "remote-developer-vs-local-agency",
    title: "Remote Developer or Local Agency? An Honest Comparison",
    excerpt:
      "When an offshore developer is the right call and when a local agency is worth the premium — by a remote dev who'll tell you to hire locally sometimes.",
    coverImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-07",
    tags: ["Hiring a Developer", "Remote Work", "Small Business"],
    content: [
      {
        type: "p",
        text: "I'm a remote developer, so read this knowing which side I'm on. **Hire locally** if you need copywriting, brand work, ongoing marketing, or you're in a regulated industry. **Hire remotely** if you know what you want built, you can supply the content, and the budget is the constraint. The price gap is real and mostly reflects wages and overheads, not quality. The genuine risks of remote are time zones, content and accountability — all manageable, none imaginary.",
      },
      { type: "h2", text: "Should I hire a remote developer or a local agency?" },
      {
        type: "p",
        text: "Hire a local agency when you need someone to figure out **what** to build — strategy, copywriting, brand and ongoing marketing. Hire a remote developer when you already know what you want built and need it built well for less.",
      },
      {
        type: "p",
        text: "That's the honest dividing line, and it isn't about quality. It's about how much of the thinking you're buying versus how much of the building.",
      },
      { type: "h2", text: "Why is the price gap so large?" },
      {
        type: "p",
        text: "A New Zealand agency quoting NZ$5,000 and a remote developer quoting US$900 are usually not doing the same job — but the gap is also not primarily about skill.",
      },
      {
        type: "p",
        text: "What the local price includes that the remote one doesn't:",
      },
      {
        type: "list",
        items: [
          "**Wages in a high-cost economy.** An Auckland developer's salary reflects Auckland rents.",
          "**Overheads.** Office, project managers, sales, account management.",
          "**Services beyond development.** Copywriting, photography, SEO strategy, ad management.",
          "**Local presence.** Someone you can meet, and who understands your market from the inside.",
        ],
      },
      {
        type: "p",
        text: "What it doesn't include: better code, necessarily. React is React in Auckland and in Lahore.",
      },
      {
        type: "p",
        text: "**One caution on the very bottom of the market.** In markets where the going rate for a professional site is NZ$2,500–$8,000, quotes of a couple of hundred dollars sit in a band local buyers have been repeatedly warned about: usually a template, usually no copywriting, usually no tracking. Some of that warning is agency positioning; a good part of it is earned by genuinely bad operators. My own fixed price starts at US$900 — roughly NZ$1,500 — which is deliberately not in that band, because the four things below cost real time and I'd rather charge for them than skip them.",
      },
      { type: "h2", text: "What a local agency is genuinely better at" },
      {
        type: "p",
        text: "Not marketing — actual advantages:",
      },
      { type: "h3", text: "Figuring out what to build" },
      {
        type: "p",
        text: "If you can't yet articulate your services as pages, a good agency does discovery work that a developer taking a brief simply doesn't do.",
      },
      { type: "h3", text: "Writing your words" },
      {
        type: "p",
        text: "This is the one people underestimate most. Service page copy that converts is a specialist skill, and it's usually the difference between a site that generates enquiries and one that just exists.",
      },
      { type: "h3", text: "Knowing your market" },
      {
        type: "p",
        text: "Local idiom, local competitors, local search behaviour, and what a customer in your industry expects to see.",
      },
      { type: "h3", text: "Being accountable in your jurisdiction" },
      {
        type: "p",
        text: "If a contract goes badly, a company registered in your country is easier to pursue than one that isn't. This is a real asset, and I say so as someone it doesn't apply to.",
      },
      { type: "h3", text: "Regulated work" },
      {
        type: "p",
        text: "Health, legal and financial services with compliance requirements — the local knowledge is worth paying for.",
      },
      { type: "h2", text: "What remote is genuinely better at" },
      {
        type: "list",
        items: [
          "**Price** — but that's the least interesting advantage.",
          "**Time zone as an asset.** With NZ specifically, a 7–8 hour gap means work handed off at end of day is often progressed by the next morning. It only works if there's a defined overlap window for calls, so agree one.",
          "**No layers.** You talk to the person writing the code. Nothing is relayed through an account manager, so less gets lost and decisions are faster.",
          "**Availability.** A solo developer can usually start next week. Agencies book out.",
          "**Specific technical depth.** For a React or MERN application, a specialist beats a generalist agency that mostly builds WordPress sites and takes on the occasional app.",
        ],
      },
      { type: "h2", text: "Which should I choose?" },
      {
        type: "p",
        text: "Use this. Be honest on the first two rows — they decide it.",
      },
      {
        type: "table",
        headers: ["If this is true", "Choose"],
        rows: [
          ["I can't describe what I need as a page list yet", "Local agency"],
          ["I need someone to write my content", "Local agency"],
          ["I need ongoing marketing, ads, SEO", "Local agency"],
          ["I'm in a regulated industry", "Local agency"],
          ["I have the copy and photos ready", "Remote"],
          ["I know exactly what should be built", "Remote"],
          ["Budget is the binding constraint", "Remote"],
          ["I need a React/Node app specifically", "Remote"],
          ["I want one person, not a team", "Remote"],
        ],
      },
      {
        type: "p",
        text: "Rows one and two carry most of the weight. **If nobody has agreed to write your service pages, hiring cheaply doesn't save money — it stalls the project.**",
      },
      { type: "h2", text: "What are the real risks of hiring remotely?" },
      {
        type: "p",
        text: "Naming these properly, because the reassuring version is useless:",
      },
      {
        type: "list",
        items: [
          "**Time zones.** Async can work well or badly. Badly is a question sent Monday answered Wednesday. Agree a fixed weekly call and a response-time expectation before starting.",
          "**Content, again.** A remote developer almost certainly won't write your copy. If you can't or won't, this is the wrong choice regardless of price.",
          "**Accountability.** Cross-border legal recourse is limited in practice. Manage this with milestone payments rather than contracts you'd never enforce.",
          "**Communication quality.** Not language — precision. Judge it from the first conversation: did they ask clarifying questions, or agree to everything immediately?",
          "**Continuity.** One person can get ill or take other work. Ask what happens then, and insist the code lives in a repository you own.",
        ],
      },
      { type: "h2", text: "How do I de-risk hiring remotely?" },
      {
        type: "p",
        text: "Four things, in order of usefulness:",
      },
      {
        type: "list",
        items: [
          "**Start with a small paid job.** One landing page, or a fix to your existing site. You learn how someone communicates for a fraction of the budget. This single step catches most bad fits.",
          "**Pay in milestones.** A deposit, then payments tied to delivered work. Never the full amount up front.",
          "**Own everything from day one.** Domain in your name, hosting in your account, code in a repository you can access. Ask for repo access at the start, not the end.",
          "**Get one contactable reference.** Not a testimonial on a website — someone you can email.",
        ],
      },
      {
        type: "p",
        text: "The full version of that checklist is in [how to hire a web developer when you don't know how to code](/blogs/how-to-hire-a-web-developer).",
      },
      { type: "h2", text: "So what would I actually tell you?" },
      {
        type: "p",
        text: "If you're a clinic, a trades business or a consultancy in Auckland or Limassol who can't yet describe your services as a page list, and you have the budget — **hire locally.** You'll get a better outcome and you'll spend less of your own time getting there. Losing that enquiry costs me nothing compared to taking on a project that was never going to work.",
      },
      {
        type: "p",
        text: "If you know what you need, you have the words ready, and the budget is what's stopping you — remote is a legitimate way to get a genuinely good site built for a fraction of the local price. Just do the four things above rather than trusting anyone's charm, including mine.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Is it safe to hire a web developer from another country?" },
      {
        type: "p",
        text: "Yes, with the same precautions you'd take locally, plus a few extra. Pay in milestones rather than up front, keep the domain and hosting in your own name, get repository access at the start, and run a small paid job before committing to the full project.",
      },
      { type: "h3", text: "Why are offshore developers so much cheaper?" },
      {
        type: "p",
        text: "Mostly wages and overheads, not skill. A developer in a lower-cost economy without an office, sales team or account managers can charge a fraction of an agency rate for the same code. What you're usually not buying at that price is copywriting, strategy and local market knowledge.",
      },
      { type: "h3", text: "What's the biggest risk of hiring remotely?" },
      {
        type: "p",
        text: "Content. Most remote developers build what you give them and won't write your service pages. If nobody has agreed to write the words, the project stalls after the design is done — and that's a scheduling failure, not a technical one.",
      },
      { type: "h3", text: "How do time zones actually work with a remote developer?" },
      {
        type: "p",
        text: "Well, if you plan for them. A large gap (like Pakistan and New Zealand) means overnight progress on handed-off work, but you need a defined overlap window for live calls. A small gap (like Pakistan and Cyprus) gives genuine same-afternoon collaboration. Ask which you'll get before you start.",
      },
      { type: "h3", text: "Should I use a freelancer marketplace or hire directly?" },
      {
        type: "p",
        text: "Marketplaces add escrow and dispute resolution, which is real protection, in exchange for fees and a bidding dynamic that rewards the lowest price. Hiring directly gives you a better working relationship and no fees, but you carry the risk yourself — which is why milestone payments and a small trial job matter more.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Answer the first two rows of that table honestly. If both point local, hire local — you'll save money by not starting the wrong project.",
      },
      {
        type: "p",
        text: "Worth settling before either: [whether what you need is an app or a website](/blogs/do-i-need-an-app-or-a-website). A good share of the wildly different quotes people show me are answering that question differently, not pricing the same thing differently.",
      },
      {
        type: "p",
        text: "If they point remote, book a free 30-minute call and I'll tell you straight whether what you need is something I should be building.",
      },
    ],
  },
  {
    slug: "why-is-my-website-slow",
    title: "Why Is My Website So Slow? A Non-Technical Guide",
    excerpt:
      "Your site is slow for one of seven reasons — and images are usually the first. How to find the cause yourself in ten minutes, free, without technical knowledge.",
    coverImage:
      "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&h=450&fit=crop",
    category: "React",
    publishedAt: "2026-08-07",
    tags: ["Performance", "Core Web Vitals", "Small Business"],
    content: [
      {
        type: "p",
        text: "**Images are the cause about half the time** — usually a photo uploaded straight from a phone. Too many plugins, third-party scripts and cheap shared hosting cover most of the rest. You can diagnose it yourself in ten minutes with PageSpeed Insights, free, no account. Test on **mobile**, not desktop. Most slow sites are fixable in hours, not weeks — don't let anyone sell you a rebuild before they've shown you the diagnosis.",
      },
      { type: "h2", text: "Why is my website so slow?" },
      {
        type: "p",
        text: "Most slow websites are slow for one of seven reasons: oversized images, too many plugins, third-party scripts, cheap hosting, no caching, a bloated theme, or unoptimised code. Images are the most common single cause, and also the cheapest to fix.",
      },
      {
        type: "p",
        text: "The important thing to know before you spend money: **slowness is diagnosable.** You do not have to take anyone's word for why your site is slow, and you should be suspicious of a quote that arrives before a diagnosis.",
      },
      { type: "h2", text: "How do I find out what's actually wrong?" },
      {
        type: "p",
        text: "Go to **PageSpeed Insights** (Google's free tool, no account needed), paste your URL, and read the **Mobile** tab.",
      },
      {
        type: "p",
        text: "Three numbers matter, and Google calls them Core Web Vitals:",
      },
      {
        type: "table",
        headers: ["Metric", "What it measures", "Good"],
        rows: [
          ["LCP", "How long until the main thing on screen appears — usually your hero image", "Under 2.5s"],
          ["INP", "How long until the page responds when someone taps something", "Under 200ms"],
          ["CLS", "How much the page jumps around while loading", "Under 0.1"],
        ],
        caption: "CLS is what causes people to tap the wrong button.",
      },
      {
        type: "p",
        text: "Underneath the scores, PageSpeed lists specific opportunities in plain-ish English. You don't need to action them yourself — but you now have a list, and anyone quoting you can be asked to address it directly.",
      },
      { type: "h2", text: "The seven causes, in the order they're usually to blame" },
      { type: "h3", text: "1. Images uploaded at full size" },
      {
        type: "p",
        text: "A photo from a modern phone is often 4–6 MB and several thousand pixels wide. Displayed in a 600-pixel-wide slot on a website, the browser still downloads the whole thing.",
      },
      {
        type: "p",
        text: "Ten images like that is 50 MB. On a phone on mobile data, that's a page that takes fifteen seconds. The fix is resizing images to the size they're actually displayed at and serving them in a modern format. It's the highest-impact, lowest-cost change on most sites, and frequently the only thing that needs doing.",
      },
      { type: "h3", text: "2. Too many plugins" },
      {
        type: "p",
        text: "Every plugin adds code that loads on every page — often on pages where it does nothing. A contact form plugin loading its scripts on your blog is pure waste. Sites accumulate these: a plugin gets installed to try something, the idea gets abandoned, the plugin stays.",
      },
      { type: "h3", text: "3. Third-party scripts" },
      {
        type: "p",
        text: "Chat widgets, analytics, ad pixels, review embeds, cookie banners, font loaders. Each one is a request to someone else's server, and **you're at the mercy of their speed.** One slow tracking script can hold up your entire page. Worth auditing honestly: is the live chat widget you added two years ago producing enquiries? If not, it's costing you speed for nothing.",
      },
      { type: "h3", text: "4. Cheap shared hosting" },
      {
        type: "p",
        text: "On budget shared hosting your site sits on a server with hundreds of others. When one of them has a traffic spike, everyone slows down. If your site is fast at 3am and slow at 2pm, this is a strong suspect. Hosting is one of the few places where spending a little more produces an immediate, measurable difference.",
      },
      { type: "h3", text: "5. No caching" },
      {
        type: "p",
        text: "Without caching, your server rebuilds the same page from scratch for every single visitor. Caching stores the finished version and hands it out. It's usually a configuration change rather than a build.",
      },
      { type: "h3", text: "6. A bloated theme or page builder" },
      {
        type: "p",
        text: "Multipurpose themes ship with features for every possible use case and load code for all of them whether you use them or not. Drag-and-drop page builders often generate deeply nested markup that browsers work hard to render. This one is genuinely expensive to fix, because the fix is usually a rebuild — be sure it's actually the cause before accepting that diagnosis.",
      },
      { type: "h3", text: "7. Unoptimised code" },
      {
        type: "p",
        text: "Everything shipping in one large bundle, no lazy loading, blocking scripts in the page head. Relevant for custom-built sites; less commonly the cause on template sites, where causes 1–6 usually get there first. If you want the developer-level version, I've written up [ten React performance fixes ordered by real-world impact](/blogs/react-performance-tips-2025).",
      },
      { type: "h2", text: "Does website speed actually affect my business?" },
      {
        type: "p",
        text: "Yes, in two ways, and the first matters more.",
      },
      {
        type: "p",
        text: "**People leave.** Slow pages lose visitors before they ever see what you sell — and a visitor who leaves at three seconds costs you the same as one who never arrived.",
      },
      {
        type: "p",
        text: "**Google notices.** Core Web Vitals are part of Google's page experience signals. Speed alone won't outrank better content, but between two comparable pages it's a tiebreaker.",
      },
      {
        type: "p",
        text: "For a business site, the first reason is the one to act on. Someone who found you, tapped your link and gave up while it loaded was your warmest possible lead.",
      },
      { type: "h2", text: "Test on mobile, not desktop" },
      {
        type: "p",
        text: "Your site probably feels fine to you — you're on a laptop, on wifi, with the site already cached in your browser. Your customer is on a phone, on mobile data, visiting for the first time. That's the experience that counts. PageSpeed Insights shows you both; read the mobile tab.",
      },
      { type: "h2", text: "What should I do about it?" },
      {
        type: "list",
        items: [
          "**Run PageSpeed Insights** on your three most important pages, mobile tab. Free, ten minutes.",
          "**Fix the images first.** Resize and compress them. This is often the entire problem.",
          "**Remove what you don't use.** Plugins, chat widgets, tracking scripts you no longer read.",
          "**Check your hosting** if the site is slow at busy times and fine at quiet ones.",
          "**Get a quote for the rest** — and make sure the quote references your actual PageSpeed results.",
        ],
      },
      {
        type: "p",
        text: "**One caution:** if someone tells you the site needs rebuilding without first showing you a diagnosis, get a second opinion. A rebuild is sometimes the right answer. It shouldn't be the first answer.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How fast should my website load?" },
      {
        type: "p",
        text: "Aim for a Largest Contentful Paint under 2.5 seconds on mobile — that's Google's threshold for \"good\". In practice, anything under three seconds feels fine to a visitor and anything over five loses a meaningful share of them before the page appears.",
      },
      { type: "h3", text: "Will making my website faster improve my Google ranking?" },
      {
        type: "p",
        text: "It can help, but it's a tiebreaker rather than a main lever. Core Web Vitals are part of Google's page experience signals, so between two similar pages the faster one has an edge. Speed won't lift a page above better, more relevant content.",
      },
      { type: "h3", text: "Why is my website fast on my computer but slow on my phone?" },
      {
        type: "p",
        text: "Two reasons: your computer has more processing power and usually a better connection, and your browser has already cached the site from previous visits. Your first-time mobile visitor has neither advantage. Always judge performance from the mobile test.",
      },
      { type: "h3", text: "Do I need to rebuild my website to make it faster?" },
      {
        type: "p",
        text: "Usually not. Most slow sites are fixed by resizing images, removing unused plugins and scripts, and enabling caching — hours of work, not a rebuild. A rebuild is genuinely warranted when a bloated theme or page builder is the root cause, but that should be demonstrated with a diagnosis first.",
      },
      { type: "h3", text: "How much does it cost to speed up a website?" },
      {
        type: "p",
        text: "Image and plugin cleanup is typically a few hours' work. Hosting upgrades are an ongoing monthly cost. A full performance rebuild is a project-sized number. Get the diagnosis before the quote — it's the only way to know which of those three you're actually looking at.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Run PageSpeed Insights on your homepage, mobile tab, right now. Whatever it says at the top of the opportunities list is almost certainly your answer.",
      },
      {
        type: "p",
        text: "Speed is one symptom of a site quietly underperforming, and [nine others worth checking](/blogs/signs-your-website-is-losing-customers) are usually cheaper to fix than this one. If the real complaint is that nobody is finding the site at all, that's a different diagnosis — [start here instead](/blogs/why-website-not-showing-on-google). And if you're weighing up whether any of it needs paying for, [that line is drawn here](/blogs/does-my-website-need-a-developer).",
      },
      {
        type: "p",
        text: "For developers: the browser-side detail behind causes 6 and 7 goes further in the React performance list linked above, and the type-level habits that stop a lot of it being written in the first place are in [TypeScript patterns for React](/blogs/typescript-patterns-for-react).",
      },
      {
        type: "p",
        text: "If you'd like someone to read the results with you, book a free 30-minute call — and if the fix is an afternoon of image work, I'll tell you that rather than quote you a rebuild.",
      },
    ],
  },
  {
    slug: "how-to-hire-a-web-developer",
    title: "How to Hire a Web Developer When You Don't Know How to Code",
    excerpt:
      "You can't evaluate someone's code — and you don't need to. Here's what to judge instead, what to ask, and what a fair quote actually includes.",
    coverImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-06",
    tags: ["Hiring a Developer", "Small Business", "Web Development"],
    content: [
      {
        type: "p",
        text: "Hiring a web developer is uncomfortable because you're buying something you can't inspect. If you hire a bad accountant, you'll eventually see it in your books. If you hire a bad developer, everything looks fine right up until you need a change and discover it'll cost more to fix than it did to build.",
      },
      {
        type: "p",
        text: "Here's the good news: you don't need to read code to hire well. Developers who evaluate other developers barely look at code either in a first conversation. They look at how someone thinks, what they ask, and what they promise. You can do all three.",
      },
      { type: "h2", text: "Start with your problem, not the technology" },
      {
        type: "p",
        text: "The most common way a non-technical buyer gets a bad outcome is by opening with a solution: “I need a React website” or “I want an app.” You've just handed the developer a specification without telling them what it's for, and now nobody in the conversation is thinking about whether it's the right thing to build.",
      },
      {
        type: "p",
        text: "Open with the problem instead. Three sentences is enough:",
      },
      {
        type: "p",
        text: "“People phone to book appointments and we miss half the calls when we're busy. I want them to book online. I need to see the day's bookings on my phone and I need to stop double-booking the same slot.”",
      },
      {
        type: "p",
        text: "That paragraph tells a developer far more than “I need a booking app” does — and it lets them tell you if there's a cheaper way to solve it. Which brings us to the first thing you should be judging.",
      },
      { type: "h2", text: "Judge these five things instead of code" },
      {
        type: "p",
        text: "None of these require you to read a line of code.",
      },
      { type: "h2", text: "1. Do they ask about your business before they quote?" },
      {
        type: "p",
        text: "This is the single strongest signal, and it costs you nothing to observe. A developer who gives you a price in the first five minutes hasn't understood what they're pricing. They're quoting a guess, and you'll pay for the guess later when everything you assumed was included turns out to be an extra.",
      },
      {
        type: "p",
        text: "A good first call spends most of its time on questions: who uses this, what do they do with it, what happens today without it, what has to be true on launch day. If nobody asks you those, the quote isn't worth much.",
      },
      { type: "h2", text: "2. Can they explain something technical without jargon?" },
      {
        type: "p",
        text: "Ask them to explain a decision in plain English — why they'd build it one way rather than another. Someone who genuinely understands a thing can explain it to you. Someone hiding behind vocabulary usually can't.",
      },
      {
        type: "p",
        text: "This matters beyond the first call. You'll be working with this person for weeks and making decisions based on what they tell you. If you can't follow their explanations now, you won't be able to follow them when something goes wrong.",
      },
      { type: "h2", text: "3. Have they solved a problem shaped like yours?" },
      {
        type: "p",
        text: "Not “have they used the same technology” — that's the developer's problem, not yours. Look for a similar shape: a booking flow, a customer database, a payment step, an admin screen where staff manage things.",
      },
      {
        type: "p",
        text: "When you look at their previous work, ask what the client's problem was and what changed after launch. The answer tells you whether they think in terms of outcomes or just features.",
      },
      { type: "h2", text: "4. Do you own everything at the end?" },
      {
        type: "p",
        text: "You should own the code, the domain, the hosting accounts and the design files. All of it, in accounts registered to you, from the start of the project rather than handed over at the end.",
      },
      {
        type: "p",
        text: "This is where the worst outcomes happen. If everything sits in the developer's accounts, you can't leave — and once you can't leave, the relationship changes. Ask directly: whose name are the accounts in, and can another developer take this over without you? A confident yes is what you want. Hesitation is your answer.",
      },
      { type: "h2", text: "5. Is the price fixed and in writing before work starts?" },
      {
        type: "p",
        text: "For a defined project, you should get a written quote with a number, a scope and a timeline before anyone starts building. Not an estimate that drifts. Not an hourly rate with a vague ceiling.",
      },
      {
        type: "p",
        text: "I quote fixed prices after a free 30-minute call for exactly this reason: it moves the risk of a bad estimate onto me, where it belongs. You approve the scope and the number, then work begins.",
      },
      { type: "h2", text: "What is the total cost in the first twelve months?" },
      {
        type: "p",
        text: "Ask: **\"What will I have paid you, and anyone else, twelve months from today?\"**",
      },
      {
        type: "p",
        text: "The build price is one line. The real number includes hosting, domain registration, any paid plugins or third-party services, maintenance or a care plan, and the hourly rate for changes outside that plan.",
      },
      {
        type: "p",
        text: "Two quotes that look $1,000 apart routinely land within $100 of each other over a year — one had hosting bundled and the other didn't. Also ask whether the price is **fixed or an estimate**. Hourly is legitimate for small ongoing changes and a bad way to buy a whole website, because nobody can tell you what it will end up costing. Country-specific numbers are in the [New Zealand](/blogs/website-cost-new-zealand-2026) and [Cyprus](/blogs/website-cost-cyprus-2026) cost guides.",
      },
      { type: "h2", text: "What happens if this doesn't work out?" },
      {
        type: "p",
        text: "Ask: **\"If we part ways halfway through, what have I paid for and what do I get to keep?\"**",
      },
      {
        type: "p",
        text: "This is the question people avoid because it feels like opening a relationship by discussing divorce. Ask it anyway. A professional will have an answer ready, and the answer itself matters less than the fact that one exists.",
      },
      {
        type: "p",
        text: "Reasonable arrangements look like: work is paid in milestones, you keep whatever is complete at the point you stop, and files and access are handed over within a set number of days.",
      },
      { type: "h2", text: "Four questions to ask on the first call" },
      {
        type: "p",
        text: "Copy these. You don't need to understand the technical content of the answers — you're listening for confidence, specifics and honesty.",
      },
      {
        type: "list",
        items: [
          "“What could go wrong with this project, and what would you do about it?” — everyone who has finished real projects has a list. A developer who says “nothing, it's straightforward” has either not thought about it or isn't telling you.",
          "“What's the cheapest version of this that would still be useful to me?” — this tests whether they're on your side. Someone who immediately sees a smaller first version is thinking about your money. Someone who only describes the full build is thinking about theirs.",
          "“What do I need to give you, and what happens if I'm late?” — client-side delays such as copy, photos, logins and feedback are one of the most common reasons projects slip. A developer who has been burned by this will have a clear answer.",
          "“What happens after launch if something breaks?” — you want a defined support window and a clear statement of what happens after it. Any specific answer beats a friendly “just message me.”",
        ],
      },
      { type: "h2", text: "What a fair quote includes" },
      {
        type: "p",
        text: "You can check every item on this list without technical knowledge. If one is missing, ask why — the answer is informative either way.",
      },
      {
        type: "list",
        items: [
          "A fixed number and a timeline, in writing, before work starts",
          "A clear scope — a list of what's included, and ideally what's explicitly not",
          "Accounts in your name — code repository, domain, hosting, database",
          "A link you can click before launch to see work in progress on a test version",
          "A defined support period after launch, with what's covered",
          "A number of revision rounds, so “one more change” doesn't become an argument",
          "What it costs to keep running — hosting, domain renewal, any paid services",
        ],
      },
      {
        type: "p",
        text: "That last one catches people out constantly. A website isn't a one-off purchase; it has small ongoing costs. A developer who tells you that upfront is being straight with you.",
      },
      { type: "h2", text: "Red flags when hiring a web developer" },
      {
        type: "list",
        items: [
          "A price with no questions — the most reliable warning sign there is.",
          "A quote dramatically below every other quote — the gap is almost never efficiency. It's scope, and you'll pay for the missing pieces individually later or live without them.",
          "No written contract for a project of any real size — this protects you more than it protects the developer.",
          "Pressure to decide quickly — any developer worth hiring has enough work to let you think for a few days.",
          "They can't show you anything — a personal project is a fine answer when starting out. “It's all under NDA” for an entire career is not.",
          "They won't put you in touch with a past client — one reference conversation tells you more than an hour of portfolio browsing.",
        ],
      },
      { type: "h2", text: "Test someone cheaply before you commit" },
      {
        type: "p",
        text: "The best way to reduce risk isn't a longer interview — it's a smaller first job. Pay someone for a few hours of real work before you hand them a twelve-week project: a small fix, a page, or a written review of what you already have.",
      },
      {
        type: "p",
        text: "In that small job you'll learn everything the interview couldn't tell you. Do they reply within a day? Do they explain what they did? Do they finish when they said they would? Do they tell you when they hit a problem, or go quiet? That's the actual working relationship, and a few hundred dollars is a cheap way to find out.",
      },
      { type: "h2", text: "What to prepare before you talk to anyone" },
      {
        type: "p",
        text: "Write one page. It doesn't need to be formal and it saves you real money, because it lets developers quote a number instead of a range:",
      },
      {
        type: "list",
        items: [
          "The problem — what's not working today, in your own words",
          "Who uses it — customers, staff, admin; and what each of them does with it",
          "The one thing it must do on launch day for the project to have been worth it",
          "Your budget range and deadline — both real, not anchoring numbers",
        ],
      },
      {
        type: "p",
        text: "Some buyers hide the budget, thinking they'll get a lower price. It usually costs them time instead: without a number, developers quote the full build, and you spend two rounds discovering what you could have had for what you were willing to spend.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "p", text: "A few things people ask before their first call:" },
      { type: "h2", text: "Do I need to understand the technology they use?" },
      {
        type: "p",
        text: "No. You need to understand what it will do, what it costs, how long it takes, and what happens if you want to change developers. The stack is the developer's concern — it only becomes yours if they choose something so unusual that nobody else can maintain it, which is a fair question to ask directly.",
      },
      { type: "h2", text: "Is a freelancer or an agency safer?" },
      {
        type: "p",
        text: "A freelancer is usually cheaper because there's no account manager or project manager layered on top. An agency gives you continuity if one person leaves. For a small business project, a freelancer who communicates clearly and gives you ownership of everything is a good trade.",
      },
      { type: "h2", text: "How do I know if the price is fair?" },
      {
        type: "p",
        text: "Get two or three quotes and compare what's included, not the totals. Two very different numbers for “the same” project usually means two very different scopes.",
      },
      { type: "h2", text: "Should I pay a deposit up front?" },
      {
        type: "p",
        text: "A deposit is normal and reasonable — commonly a third to a half. What matters is that payments are tied to milestones rather than dates, so you're paying for delivered work. Avoid paying the full amount before anything is built.",
      },
      { type: "h2", text: "What's a reasonable number of revisions to expect?" },
      {
        type: "p",
        text: "Two to three rounds is standard for a fixed-price build. Unlimited revisions sound generous but often mean the scope is vague. What matters more is that revisions are defined — a revision is a change within the agreed design, not a redesign.",
      },
      { type: "h2", text: "What if I don't know exactly what I want yet?" },
      {
        type: "p",
        text: "That's normal and it's fine. Bring the problem and let the developer help shape the solution — that's part of what you're paying for. What you shouldn't do is sign a fixed-price contract while the scope is still vague; agree the discovery first, then price the build.",
      },
      { type: "h2", text: "The short version" },
      {
        type: "p",
        text: "You're not evaluating code. You're evaluating whether someone asks good questions, explains things clearly, gives you ownership, and puts a number in writing. Those four things are all visible to a non-technical buyer in a single conversation — and they predict outcomes better than any technical test you could run.",
      },
      {
        type: "p",
        text: "Two decisions sit either side of this one. Before you hire: [is it an app or a website you need](/blogs/do-i-need-an-app-or-a-website) — getting that wrong costs more than any hiring mistake. And while you're choosing: [remote developer or local agency](/blogs/remote-developer-vs-local-agency) is the trade-off most of the five criteria above come down to in practice.",
      },
      {
        type: "p",
        text: "If you'd like to try that conversation with no strings attached: book a free 30-minute call. You'll get honest answers about scope and a fixed written quote, and if your problem doesn't need a developer at all, I'll tell you that too. Already holding quotes you can't reconcile? [How to compare web developer quotes](/blogs/how-to-compare-web-developer-quotes) is the checklist for reading them side by side.",
      },
    ],
  },
  {
    slug: "signs-your-website-is-losing-customers",
    // Shorter than the source H1 ("10 Signs Your Business Website Is Losing
    // You Customers", 53 chars) so withBrand() can still append the brand
    // inside the 62-character display limit.
    title: "10 Signs Your Website Is Losing You Customers",
    excerpt:
      "Ten specific, checkable signs that your website is costing you business — each with the test to run and the threshold that counts as a real problem.",
    coverImage:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-09",
    tags: ["Small Business", "Core Web Vitals", "Conversion"],
    content: [
      {
        type: "p",
        text: "Most failing business websites don't look broken. They look fine on the owner's laptop, load instantly because the browser cached everything weeks ago, and quietly lose customers on other people's phones.",
      },
      {
        type: "p",
        text: "Below are ten signs, each with a specific test and a threshold. Run them in order. Any one of these can cost you real work.",
      },
      { type: "h2", text: "1. It takes more than 2.5 seconds to show anything useful on a phone" },
      {
        type: "p",
        text: "The single most expensive fault, and the one owners are least likely to notice, because your own device has the site cached.",
      },
      {
        type: "p",
        text: "Google measures loading with Largest Contentful Paint, and the \"good\" threshold is under 2.5 seconds. That's assessed at the 75th percentile of real visitor data — meaning three quarters of your visitors need to be under it, not you on office wifi.",
      },
      {
        type: "p",
        text: "**Test:** run your homepage through PageSpeed Insights. Read the mobile score, not desktop.",
      },
      {
        type: "p",
        text: "**Threshold:** over 2.5 seconds is a problem. Over 4 is an emergency. If you want the causes in order of how often they're to blame, that's a separate walkthrough: [why your website is slow](/blogs/why-is-my-website-slow).",
      },
      { type: "h2", text: "2. The page jumps around while it loads" },
      {
        type: "p",
        text: "You go to tap a link, an image finishes loading above it, the page shifts, and you tap something else. Every visitor has experienced this and every visitor hates it.",
      },
      {
        type: "p",
        text: "Google scores this as Cumulative Layout Shift, with a good threshold of under 0.1. The fix is unexciting and reliable: every image, video, iframe and ad slot needs explicit width and height so the browser reserves the space before the content arrives.",
      },
      {
        type: "p",
        text: "**Test:** PageSpeed Insights reports CLS alongside the loading score.",
      },
      {
        type: "p",
        text: "**Threshold:** above 0.1 and you're annoying a quarter of your visitors.",
      },
      { type: "h2", text: "3. Buttons and taps feel laggy" },
      {
        type: "p",
        text: "The third metric in the same family, and the one sites fail most often. Interaction to Next Paint replaced First Input Delay in March 2024, so any advice still mentioning FID is out of date.",
      },
      {
        type: "p",
        text: "It shows up as a menu that takes a beat to open, or a form that freezes when you submit. Usually the cause is too much JavaScript competing for the phone's attention.",
      },
      {
        type: "p",
        text: "**Threshold:** over 200ms at the 75th percentile.",
      },
      { type: "h2", text: "4. A stranger can't tell what you do in five seconds" },
      {
        type: "p",
        text: "Open your homepage on a phone. Don't scroll. Hand it to someone who doesn't know your business and ask what the company does.",
      },
      {
        type: "p",
        text: "If they hesitate, you're losing everyone who arrives from a search result and doesn't already know you. Hero photographs and slogans feel like branding to the person who commissioned them and read as noise to a first-time visitor.",
      },
      {
        type: "p",
        text: "**Fix:** one plain sentence naming the service, the customer, and the location.",
      },
      { type: "h2", text: "5. Your phone number isn't tappable" },
      {
        type: "p",
        text: "Astonishingly common. On mobile, a phone number written as ordinary text means the visitor has to memorise it, leave your site, and open their dialler. A meaningful share simply don't.",
      },
      {
        type: "p",
        text: "**Test:** open the site on your phone and tap the number. Does it offer to call?",
      },
      { type: "p", text: "**Fix:** one line." },
      {
        type: "code",
        lang: "html",
        code: `<a href="tel:+6491234567">09 123 4567</a>`,
      },
      { type: "h2", text: "6. Your contact form fails silently" },
      {
        type: "p",
        text: "Fill in your own form, from a phone, on mobile data, using an address you control. Confirm three things: it arrives, it isn't in spam, and the visitor gets a visible confirmation.",
      },
      {
        type: "p",
        text: "Broken forms tend to break quietly — an expired plugin, a changed mail setting, a filter that started eating your own notifications. Nothing alerts you. Enquiries just stop, and the natural conclusion is that business is slow.",
      },
      {
        type: "p",
        text: "**Do this quarterly.** It takes ninety seconds and it's the highest-value ninety seconds on this list.",
      },
      { type: "h2", text: "7. Nothing on the site mentions money" },
      {
        type: "p",
        text: "No price list, no range, no starting figure, no typical project size.",
      },
      {
        type: "p",
        text: "Owners leave pricing off because they fear scaring people away. What actually happens is that visitors assume expensive, and someone who has decided you're out of their budget doesn't enquire to check. You never see the loss, which is exactly why it persists.",
      },
      {
        type: "p",
        text: "You don't need a full price list. A starting figure or a typical project range filters out the people who were never going to buy and reassures everyone else — the way the bands on my own [services page](/services) are meant to.",
      },
      { type: "h2", text: "8. The site looks abandoned" },
      {
        type: "p",
        text: "Visitors look for evidence you're still trading, and they find it in small places:",
      },
      {
        type: "list",
        items: [
          "A copyright line showing a year that isn't this one",
          "A blog whose most recent post is from 2022",
          "\"Coming soon\" on a page that has said so for two years",
          "Social links to accounts that stopped posting",
          "Team photographs of people who left",
        ],
      },
      {
        type: "p",
        text: "Any one of these plants the thought *are these people still operating?* — and that thought is enough to send someone to a competitor.",
      },
      { type: "h2", text: "9. There's no proof anyone has hired you" },
      {
        type: "p",
        text: "Claims about quality are worth very little. Evidence is worth a lot.",
      },
      {
        type: "p",
        text: "Missing proof looks like: no reviews, or reviews with no names attached; stock photography instead of your actual work; no case studies; no client names; nothing to indicate anyone has ever paid you.",
      },
      {
        type: "p",
        text: "**Strongest to weakest:** named recent reviews → photographs of real work → named clients → case studies with an outcome → generic testimonials → adjectives about yourself.",
      },
      { type: "h2", text: "10. Visitors can't find the specific thing they came for" },
      {
        type: "p",
        text: "A restaurant site where the menu is a PDF. A trades site where every service lives on one page called \"Services\". A shop with no search box and forty products.",
      },
      {
        type: "p",
        text: "Every extra step between arrival and the thing they wanted loses a share of visitors. It's also the same structural fault that keeps you out of search results — see [why your website doesn't show up on Google](/blogs/why-website-not-showing-on-google).",
      },
      {
        type: "p",
        text: "**Test:** pick your three most common customer requests. Time how long it takes to reach each from the homepage on a phone. More than two taps means it's buried.",
      },
      { type: "h2", text: "What to do with the list" },
      {
        type: "p",
        text: "You won't fix ten things this month, and you don't need to. They're not equally expensive.",
      },
      {
        type: "table",
        headers: ["Effort", "Signs", "What it costs"],
        rows: [
          ["Free, this week", "6 (test your form), 5 (tap your number), 8 (update anything stale), 4 (the five-second test)", "An hour, no developer"],
          ["Cheap, this month", "7 (add a price signal), 9 (gather three named reviews), 10 (shorten the path to your top services)", "Your own time"],
          ["Needs a developer", "1, 2 and 3 — the speed and stability problems", "Real engineering work"],
        ],
        caption: "Signs 1–3 have the clearest effect on both rankings and enquiries.",
      },
      {
        type: "p",
        text: "The order matters. Fixing your site's speed while the contact form is silently swallowing enquiries just means faster delivery of visitors to a dead end.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How do I know if my website is losing customers?" },
      {
        type: "p",
        text: "Run the four free tests first: submit your own contact form from a phone on mobile data, tap your own phone number, check the site for stale content, and hand your homepage to someone who doesn't know your business. Those four catch the majority of silent losses, and none of them needs a developer.",
      },
      { type: "h3", text: "How fast should a business website load on mobile?" },
      {
        type: "p",
        text: "Largest Contentful Paint under 2.5 seconds is Google's \"good\" threshold, measured at the 75th percentile of real visitors. Over 4 seconds you are losing a meaningful share of people before the page appears at all. Test on the mobile tab of PageSpeed Insights, not desktop.",
      },
      { type: "h3", text: "Should I put prices on my website?" },
      {
        type: "p",
        text: "A starting figure or a range, yes. Without one, visitors assume you are expensive and don't enquire to check — a loss you never see, which is why it goes uncorrected for years. You don't need a full price list to fix it.",
      },
      { type: "h3", text: "Why does my website look fine to me but slow to customers?" },
      {
        type: "p",
        text: "Your browser cached the site weeks ago, you're on a laptop, and you're probably on good wifi. A first-time visitor on a mid-range phone on mobile data has none of those advantages. Always judge from field data on the mobile test rather than your own experience of the site.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Test your own contact form today. It takes ninety seconds, it's free, and of everything on this list it is the one most likely to be quietly costing you work right now.",
      },
      {
        type: "p",
        text: "If you work through the ten and can't tell which you could handle yourself, [this walks through exactly that line](/blogs/does-my-website-need-a-developer) — which symptoms are a free afternoon and which are a real project.",
      },
      {
        type: "p",
        text: "If you'd like a second opinion on which of the ten apply to your site, [book a free 30-minute call](/contact). If the answer is four free fixes and no developer, that's what I'll tell you.",
      },
    ],
  },
  {
    slug: "why-website-not-showing-on-google",
    title: "Why Your Website Doesn't Show Up on Google",
    excerpt:
      "Work through this in order: is your site indexed, blocked, ranking too low, or targeting the wrong words? Each step has a test that takes under a minute.",
    coverImage:
      "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&h=450&fit=crop",
    category: "SEO",
    publishedAt: "2026-08-09",
    tags: ["SEO", "Small Business", "Google Search"],
    content: [
      {
        type: "p",
        text: "\"My website doesn't show up on Google\" describes at least four completely different problems with completely different fixes. Before spending money on SEO, find out which one you have. The whole diagnosis takes about fifteen minutes.",
      },
      {
        type: "p",
        text: "Work through these in order. Stop at the first one that's true.",
      },
      { type: "h2", text: "Step 1: Is your site on Google at all?" },
      {
        type: "p",
        text: "Type this into Google, using your own domain:",
      },
      { type: "code", lang: "text", code: `site:yourbusiness.co.nz` },
      {
        type: "p",
        text: "That asks Google to list every page it knows about on your site.",
      },
      {
        type: "list",
        items: [
          "**Results appear** → you're indexed. Skip to Step 3.",
          "**Nothing at all** → Google doesn't have your site. Continue to Step 2.",
          "**Some pages, but not the important ones** → partial indexing. Step 2 still applies to the missing pages.",
        ],
      },
      {
        type: "p",
        text: "This one search separates \"invisible\" from \"ranking badly\", and those are not remotely the same problem. Most people who think they have an SEO problem are actually at Step 3.",
      },
      { type: "h2", text: "Step 2: Are you accidentally blocking Google?" },
      {
        type: "p",
        text: "If nothing came back, something is usually telling search engines to stay away — and more often than not it was switched on deliberately during the build and never switched off.",
      },
      { type: "p", text: "**Check the robots file.** Visit:" },
      { type: "code", lang: "text", code: `yourbusiness.co.nz/robots.txt` },
      { type: "p", text: "If you see this, you are blocking everything:" },
      {
        type: "code",
        lang: "text",
        code: `User-agent: *
Disallow: /`,
      },
      {
        type: "p",
        text: "**Check for a noindex tag.** Open your homepage, view source, and search for `noindex`. This tag removes a page from search results even when everything else is correct:",
      },
      {
        type: "code",
        lang: "html",
        code: `<meta name="robots" content="noindex">`,
      },
      {
        type: "p",
        text: "**On WordPress**, look in Settings → Reading for a checkbox about discouraging search engines. It gets ticked on staging sites and forgotten at launch. It is responsible for a genuinely embarrassing number of invisible business websites.",
      },
      {
        type: "p",
        text: "**If the site is brand new**, none of the above may apply — Google may simply not have got to you yet. Set up Google Search Console, submit your sitemap, and expect days to weeks rather than hours.",
      },
      { type: "h2", text: "Step 3: You're indexed, but ranking too low to see" },
      {
        type: "p",
        text: "This is where most businesses actually are, and it's a different problem entirely — not invisibility, but position.",
      },
      {
        type: "p",
        text: "**Test:** search for your exact business name. If you appear, you rank. You just don't rank for the things people search when they don't already know you exist.",
      },
      {
        type: "p",
        text: "That distinction is everything. Nobody who needs a plumber searches your company name. They search \"emergency plumber [suburb]\". Ranking first for your own name and nowhere for your service is the default state of a new website, not a fault.",
      },
      {
        type: "p",
        text: "**Confirm it in Search Console** (Performance → Search results, add the \"Position\" column). You'll typically find you're on page three or beyond for the queries that matter — visible in principle, invisible in practice.",
      },
      { type: "h2", text: "Step 4: Nothing on your site targets what people search" },
      { type: "p", text: "Now the diagnosis gets useful." },
      {
        type: "p",
        text: "Most small business sites have a homepage, an About page, a Services page listing eight services in a paragraph each, and a Contact page. Then the owner wonders why they don't rank for any of those eight services.",
      },
      {
        type: "p",
        text: "Google ranks pages, not businesses. A service mentioned in one sentence on a shared page is competing against sites with a full, dedicated page for that exact service. It loses, reliably.",
      },
      {
        type: "p",
        text: "**The fix:** one page per service you actually want customers for, each written around the phrase a customer would type. Not \"Commercial Solutions\" but \"Commercial Electrical Wiring in Auckland\".",
      },
      {
        type: "p",
        text: "**Find the phrases for free:** type your service into Google and read the autocomplete suggestions, the \"People also ask\" box, and the related searches at the bottom of the page. That's Google showing you its own query data at no cost.",
      },
      { type: "h2", text: "Step 5: You're competing with the wrong sites" },
      {
        type: "p",
        text: "Search the phrase you want to rank for and look honestly at who holds page one.",
      },
      {
        type: "p",
        text: "If it's national directories, franchises, and businesses ten times your size, that phrase isn't available to you yet — not because your site is bad, but because ranking there requires years of accumulated authority.",
      },
      {
        type: "p",
        text: "**What works instead:** go longer and more specific. \"Electrician\" is unwinnable. \"Emergency electrician Papakura\" might be sitting there with nobody competing for it properly. Fewer people search it — but the ones who do are ready to call, and you can actually rank.",
      },
      {
        type: "p",
        text: "This is the single most useful adjustment a small business can make, and it's counterintuitive enough that most never make it.",
      },
      { type: "h2", text: "Step 6: For local businesses, the map results are a separate system" },
      {
        type: "p",
        text: "If customers come to your premises or you serve a local area, the map pack at the top of local searches is a different ranking system from the ordinary blue links.",
      },
      {
        type: "p",
        text: "It's driven mostly by your Google Business Profile: complete information, correct category, consistent name/address/phone everywhere online, real photographs, and a steady flow of reviews.",
      },
      {
        type: "p",
        text: "A local business can be invisible in the map pack while ranking respectably in normal results, and vice versa. If your customers are local, this is often worth more than everything above — and it's free.",
      },
      { type: "h2", text: "Step 7: Slow sites rank worse" },
      {
        type: "p",
        text: "Once the fundamentals are right, speed becomes a genuine differentiator. Google's page experience signals measure loading, responsiveness and visual stability from real visitor data — LCP under 2.5 seconds, INP under 200 milliseconds, and CLS under 0.1.",
      },
      {
        type: "p",
        text: "It isn't the strongest factor — content and authority still matter more — but between two comparable pages it can decide which one wins.",
      },
      {
        type: "p",
        text: "Two practical points people get wrong: the scoring uses field data from real Chrome users at the 75th percentile, so a perfect score in your own browser tools proves nothing if a quarter of real visitors on mid-range phones are slow. And that data updates on a rolling 28-day window, so allow several weeks after a fix before judging whether it worked. If speed turns out to be your problem, [start here](/blogs/why-is-my-website-slow).",
      },
      { type: "h2", text: "Step 8: Patience, and what's normal" },
      {
        type: "p",
        text: "SEO does not work on the timescale anyone wants.",
      },
      {
        type: "p",
        text: "For a new site, expect roughly three months before meaningful movement and around six before it compounds. That isn't a dodge — it's how long it takes to accumulate enough signals. Judging results after four weeks is the most common reason businesses abandon an approach that was working.",
      },
      { type: "h2", text: "Quick reference" },
      {
        type: "table",
        headers: ["Symptom", "Diagnosis", "Fix"],
        rows: [
          ["`site:` search returns nothing", "Not indexed", "Check robots.txt and noindex, submit sitemap"],
          ["Only your business name ranks", "Indexed, ranking low", "Dedicated service pages"],
          ["Page one is national brands", "Query too competitive", "Target longer, more specific phrases"],
          ["Local customers can't find you", "Map pack, not web results", "Google Business Profile and reviews"],
          ["Everything is right, still nothing", "Probably too early", "Give it three to six months"],
        ],
      },
      {
        type: "p",
        text: "Run this before hiring anyone for SEO. If your problem is a leftover noindex tag, that's a five-minute fix, and it's worth knowing that before you sign up for a monthly retainer.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Why is my website not showing on Google?" },
      {
        type: "p",
        text: "There are four distinct causes and they need different fixes: the site isn't indexed at all, it's actively blocked by a robots.txt rule or a noindex tag, it's indexed but ranking too low to see, or nothing on it targets the phrases people actually search. Run a `site:yourdomain.com` search first — that single test tells you which of the four you have.",
      },
      { type: "h3", text: "How do I check if my website is indexed by Google?" },
      {
        type: "p",
        text: "Search `site:yourdomain.com` in Google. If pages come back, you're indexed and your problem is ranking position rather than visibility. If nothing comes back, Google either doesn't know about the site yet or is being told to stay away — check robots.txt and your homepage source for a noindex tag.",
      },
      { type: "h3", text: "How long does it take for a new website to appear on Google?" },
      {
        type: "p",
        text: "Indexing can happen within days of submitting a sitemap in Search Console. Ranking is slower: expect around three months before meaningful movement and six before it compounds. Judging results after four weeks is the most common reason people abandon an approach that was working.",
      },
      { type: "h3", text: "Why does my business name rank but not my services?" },
      {
        type: "p",
        text: "Because Google ranks pages, not businesses. Your homepage is the obvious answer for your own name, but a service that gets one sentence on a shared services page is competing against sites with a full dedicated page for that exact service — and it loses reliably. One page per service you want customers for is the fix.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Run the `site:` search on your own domain right now. Whichever of the four problems it points to, you'll know within a minute which one you're solving — and that's the difference between fixing it and paying a retainer to find out.",
      },
      {
        type: "p",
        text: "Two related reads. If the site is being found but nothing comes of it, [ten signs it's losing customers](/blogs/signs-your-website-is-losing-customers) covers what happens after the click. And if you've got the diagnosis but aren't sure it warrants paying anyone, [that line is drawn here](/blogs/does-my-website-need-a-developer).",
      },
      {
        type: "p",
        text: "If you'd like help reading the results, [book a free 30-minute call](/contact), or see how I build sites that get found in the first place on the [services page](/services).",
      },
    ],
  },
  {
    slug: "does-my-website-need-a-developer",
    title: "Does Your Website Need a Developer or Just a Few Fixes?",
    excerpt:
      "Not every website problem needs a rebuild. Here's how to tell the difference — what you can fix yourself, what needs a developer, and what needs neither.",
    coverImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-09",
    tags: ["Small Business", "Hiring", "Performance"],
    content: [
      {
        type: "p",
        text: "Someone is going to tell you that you need a new website. That someone usually sells new websites.",
      },
      {
        type: "p",
        text: "Sometimes they're right. Often the actual problem is four small things, none of which requires a rebuild, and a full redesign would carry every one of them across to the new site.",
      },
      {
        type: "p",
        text: "Here's how to tell the difference before you spend anything.",
      },
      { type: "h2", text: "Start with the symptom, not the solution" },
      {
        type: "p",
        text: "\"My website needs work\" isn't diagnosable. These are:",
      },
      {
        type: "list",
        items: [
          "Nobody can find it in search",
          "People find it but don't get in touch",
          "It looks dated next to competitors",
          "It's slow",
          "You can't update it yourself",
          "It breaks on phones",
          "It can't do something your business now needs",
        ],
      },
      {
        type: "p",
        text: "Each of those has a different answer, and two of them frequently need no developer at all.",
      },
      { type: "h2", text: "Things you can fix yourself, today, for nothing" },
      {
        type: "p",
        text: "Before anything else, rule these out. All are common, all are free, and none needs technical skill.",
      },
      {
        type: "p",
        text: "**Your contact form is broken.** Submit it from a phone, on mobile data, using an address you control. Confirm it arrives and isn't in spam. Broken forms fail silently — nothing tells you, enquiries just stop.",
      },
      {
        type: "p",
        text: "**Your phone number isn't tappable on mobile.** Tap it. If it doesn't dial, that's one line of code your host's editor can usually handle.",
      },
      {
        type: "p",
        text: "**Your content is stale.** Old copyright year, a blog that stopped in 2022, \"coming soon\" pages, staff who left. Visitors read these as *possibly closed*.",
      },
      {
        type: "p",
        text: "**You're accidentally blocked from Google.** Search `site:yourdomain.com`. If nothing comes back, something is telling search engines to stay away — often a checkbox left on from the build. That's a five-minute fix, not a rebuild, and there's a full walkthrough in [why your website doesn't show up on Google](/blogs/why-website-not-showing-on-google).",
      },
      {
        type: "p",
        text: "**Nothing on the site mentions price.** Adding a starting figure or a range costs nothing and stops people silently assuming you're unaffordable.",
      },
      {
        type: "p",
        text: "If your symptom disappeared, stop here. You've saved yourself a project. The longer version of this list is [ten signs your website is losing you customers](/blogs/signs-your-website-is-losing-customers).",
      },
      { type: "h2", text: "Things a developer fixes without rebuilding" },
      {
        type: "p",
        text: "The middle category, and the one most under-used — because it's easier to sell a redesign than a repair.",
      },
      {
        type: "p",
        text: "**Speed problems.** Oversized images, too much JavaScript, render-blocking scripts, missing image dimensions. Real engineering work, but it's surgery on an existing site rather than replacement. A site failing Google's thresholds — LCP under 2.5 seconds, INP under 200 milliseconds, CLS under 0.1 — can usually be brought inside them without touching the design.",
      },
      {
        type: "p",
        text: "**Mobile layout breakage.** Text overflowing, buttons too small, horizontal scrolling. Usually CSS fixes, not architecture.",
      },
      {
        type: "p",
        text: "**Missing service pages.** If you rank for nothing because eight services share one page, the answer is more pages — not a new site.",
      },
      {
        type: "p",
        text: "**Adding one capability.** A booking form, online payments, a quote calculator. These bolt onto most existing sites.",
      },
      {
        type: "p",
        text: "**Accessibility problems.** Contrast, keyboard navigation, missing labels. Almost always fixable in place, and increasingly a legal consideration as well as a decency one.",
      },
      {
        type: "p",
        text: "**The rule of thumb:** if the site's structure is sound and specific things are wrong with it, repair. Repair is cheaper, faster, and preserves the search history the site has already built — which a rebuild can easily throw away.",
      },
      { type: "h2", text: "Things that genuinely need a rebuild" },
      {
        type: "p",
        text: "Now the honest other side. Some sites shouldn't be repaired.",
      },
      {
        type: "p",
        text: "**You can't change anything without paying someone.** If updating a phone number needs a developer, the cost isn't the website — it's every small change for the next five years.",
      },
      {
        type: "p",
        text: "**It's built on something no longer maintained.** An abandoned page builder, an unsupported framework, a platform whose owner vanished. Patching this is money spent on a foundation that will fail anyway.",
      },
      {
        type: "p",
        text: "**It has security problems that can't be patched.** Outdated software with known vulnerabilities. This is urgent, not aesthetic.",
      },
      {
        type: "p",
        text: "**Fixing the speed means rewriting it.** Some sites are slow because of one heavy image. Others are slow because they load a twelve-megabyte page builder to display three paragraphs. The second isn't fixable in place.",
      },
      {
        type: "p",
        text: "**Your business changed.** You sell different things to different people in different places than when the site was built. Restructuring past that is often more work than starting again.",
      },
      {
        type: "p",
        text: "**Every fix breaks something else.** The clearest signal there is. If repairs keep producing new bugs, the foundation is gone.",
      },
      { type: "h2", text: "The test that settles it" },
      {
        type: "p",
        text: "When you're still unsure, one question decides: **is the structure sound, with specific things wrong with it? Or is the structure itself the problem?**",
      },
      {
        type: "p",
        text: "Specific things wrong → fix them. Structure is the problem → rebuild.",
      },
      {
        type: "p",
        text: "A useful proxy: **write down every problem, then get a quote for fixing them all.** If that's a meaningful fraction of a new site, rebuild. If it's a small fraction, fix. Any developer worth hiring will tell you which side you're on, including when the answer costs them the larger job.",
      },
      { type: "h2", text: "What to ask a developer — and what should worry you" },
      {
        type: "p",
        text: "When you get an assessment, these answers tell you a lot.",
      },
      { type: "h3", text: "Good signs" },
      {
        type: "list",
        items: [
          "They ask what problem you're trying to solve before proposing anything",
          "They tell you which items you could fix yourself for free",
          "They can explain why a rebuild is necessary in terms of your business, not the technology",
          "They ask about your traffic and current rankings before suggesting anything that changes URLs",
        ],
      },
      { type: "h3", text: "Worrying signs" },
      {
        type: "list",
        items: [
          "\"Rebuild\" arrives before any diagnosis",
          "The reasoning is that the technology is old, with no explanation of what that costs you",
          "No mention of preserving your existing search rankings",
          "A quote before anyone has looked at what's actually wrong",
        ],
      },
      {
        type: "p",
        text: "That last one matters more than it sounds. A rebuild that changes your page addresses without redirects can erase years of accumulated search visibility overnight. It's recoverable, but only if someone plans for it — and the plan needs to exist before the build, not after the traffic drops.",
      },
      { type: "h2", text: "The short version" },
      {
        type: "table",
        headers: ["Your situation", "What you need"],
        rows: [
          ["Form broken, content stale, number not tappable", "Fix it yourself, free"],
          ["Blocked from Google, no price on the site", "Fix it yourself, free"],
          ["Slow, mobile layout broken, missing service pages", "Developer, targeted fixes"],
          ["Need booking or payments added", "Developer, an addition"],
          ["Can't update anything without paying", "Rebuild"],
          ["Unmaintained platform, security holes", "Rebuild, and soon"],
          ["Every fix breaks something else", "Rebuild"],
        ],
      },
      {
        type: "p",
        text: "Most websites people describe as \"needing to be redone\" need three of the free items and one afternoon of developer time. Find out which you are before anyone quotes you for a project.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Do I need a new website or just fixes?" },
      {
        type: "p",
        text: "Ask whether the structure is sound with specific things wrong with it, or whether the structure itself is the problem. Specific faults — slow images, broken mobile layout, missing service pages — are repairs. A platform you can't update, can't secure, or that breaks every time it's touched is a rebuild. Get a quote for fixing everything on your list; if it's a small fraction of a new site, repair.",
      },
      { type: "h3", text: "How do I know if my website needs to be rebuilt?" },
      {
        type: "p",
        text: "Four signals make a rebuild the honest answer: you can't change anything without paying someone, the platform is no longer maintained, there are security holes that can't be patched, or every fix breaks something else. Age alone is not one of them — \"the technology is old\" is only a reason if someone can say what it costs you.",
      },
      { type: "h3", text: "Will a new website hurt my Google rankings?" },
      {
        type: "p",
        text: "It can, badly, if page addresses change without redirects — years of accumulated visibility can go overnight. It's recoverable, but only if the redirect plan exists before the build rather than after the traffic drops. Ask any developer quoting a rebuild how they'll preserve your existing URLs; a good answer is specific, and no answer at all is a warning.",
      },
      { type: "h3", text: "What website problems can I fix myself for free?" },
      {
        type: "p",
        text: "Five of them: test your contact form actually delivers, make your phone number tappable on mobile, update stale content and copyright years, check you aren't blocking search engines with a leftover noindex, and put a starting price somewhere on the site. None needs technical skill and together they resolve a surprising share of \"my website needs redoing\".",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Work down the free list first. If your symptom survives all five, you have a real diagnosis to hand a developer — and a much better conversation than \"my website needs work\".",
      },
      {
        type: "p",
        text: "If the symptom you arrived with was speed, [the seven usual causes](/blogs/why-is-my-website-slow) will narrow it further before you talk to anyone. And if the answer here turns out to be yes, you do need someone, [how to hire a web developer](/blogs/how-to-hire-a-web-developer) is the next step — mostly a matter of judging the conversation rather than the code.",
      },
      {
        type: "p",
        text: "If you'd like that assessment for nothing, [book a free 30-minute call](/contact). If your site needs four small fixes rather than a project, I'd rather tell you that than sell you a rebuild — and you can see what I do build on the [services page](/services).",
      },
    ],
  },
  {
    slug: "website-not-getting-leads",
    // Kept to 44 characters, leading with the query as it is typed, so
    // withBrand() can still append " | WebDevStudio" inside Google's ~62
    // character display limit — same reasoning as the "10 Signs" post above.
    title: "Why Is My Website Not Getting Leads? 9 Fixes",
    excerpt:
      "Traffic but no enquiries? The nine real reasons websites fail to convert, the fix for each one, and the arithmetic that tells you which is costing you money.",
    coverImage:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&h=450&fit=crop",
    category: "Business",
    // Written on this date. If the post ships later, move it — datePublished
    // is read on first crawl, and a date that disagrees with when the URL
    // actually appeared is a freshness signal working against you.
    publishedAt: "2026-08-11",
    tags: ["Small Business", "Conversion", "Core Web Vitals"],
    content: [
      {
        type: "p",
        text: "If your website isn't getting leads, it's one of two problems: not enough of the right people arrive, or the right people arrive and leave without doing anything. Those need opposite fixes.",
      },
      {
        type: "p",
        text: "Buying more traffic for a page that converts nobody is the most expensive mistake on this list, and it's the one I see most often. So the first section is arithmetic, not advice.",
      },
      { type: "h2", text: "First: traffic problem or conversion problem?" },
      {
        type: "p",
        text: "Open your analytics and pull last month's two numbers.",
      },
      {
        type: "code",
        lang: "text",
        code: `monthly enquiries ÷ monthly unique visitors × 100 = conversion rate`,
      },
      {
        type: "p",
        text: "A service business with genuine buying-intent traffic should land somewhere around **1–3%**. So 500 visitors ought to produce roughly 5–15 enquiries.",
      },
      {
        type: "list",
        items: [
          "**Below about 1%** — conversion problem. Fixing the page is faster and cheaper than buying traffic.",
          "**At 2% or better, but still too few leads** — traffic problem. The page works; not enough people reach it. That's a content and search spend, not a redesign.",
          "**Under a couple of hundred visitors a month** — you have both, and not enough data to tell them apart. Start with reason 4 below, because until tracking is right, everything after it is guesswork.",
        ],
      },
      {
        type: "p",
        text: "That last case is the honest starting position for most small business sites, and it's why the fixes below are ordered the way they are rather than by how visible they look.",
      },
      { type: "h2", text: "1. There's no single obvious next action" },
      {
        type: "p",
        text: "A low-converting homepage usually offers six equally weighted things to do: read about us, view services, download a brochure, follow us on Facebook, call, email. Six choices lands the same way as none.",
      },
      {
        type: "p",
        text: "Every page needs **one primary action, repeated**. Everything else should look secondary — a text link, not another button competing for the same attention.",
      },
      {
        type: "p",
        text: "On a long page that primary action should appear at least three times: above the fold, mid-page immediately after your proof, and at the end. Not three different actions. The same one, three times.",
      },
      {
        type: "p",
        text: "Then make the words specific. \"Submit\" and \"Learn more\" say nothing. \"Get a fixed-price quote\" tells the visitor exactly what happens next and what it commits them to.",
      },
      { type: "h2", text: "2. It's slow, and mobile visitors leave before it renders" },
      {
        type: "p",
        text: "Google's Core Web Vitals guidance treats a Largest Contentful Paint under 2.5 seconds as the threshold for a good experience, measured on real mobile connections rather than your desktop fibre ([web.dev on LCP](https://web.dev/articles/lcp)).",
      },
      {
        type: "p",
        text: "Check it honestly rather than by feel:",
      },
      {
        type: "list",
        items: [
          "Run the page through [PageSpeed Insights](https://pagespeed.web.dev/)",
          "Read the **field data** section, not the lab score — that's real visitors on real phones",
          "If mobile LCP is above 4 seconds, fix that before you touch copy or design",
        ],
      },
      {
        type: "p",
        text: "Three causes account for most of it: hero images shipped at full camera resolution, a page builder loading fifteen plugin stylesheets, and a slideshow nobody asked for.",
      },
      {
        type: "p",
        text: "The free win is responsive, correctly sized images:",
      },
      {
        type: "code",
        lang: "html",
        code: `<img
  src="/images/hero-1200.webp"
  srcset="/images/hero-600.webp 600w, /images/hero-1200.webp 1200w"
  sizes="(max-width: 768px) 100vw, 1200px"
  width="1200"
  height="675"
  loading="eager"
  decoding="async"
  alt="Team fitting a commercial kitchen extraction unit"
/>`,
      },
      {
        type: "p",
        text: "The explicit width and height matter as much as the srcset. Without them the browser can't reserve space, so the page jumps as each image lands — a separate Core Web Vital, and a separate reason people leave. The full list of causes is in [why your website is slow](/blogs/why-is-my-website-slow).",
      },
      { type: "h2", text: "3. The form asks for too much, too early" },
      {
        type: "p",
        text: "Every field costs you submissions. A first-contact form does not need company size, budget range, industry, referral source and a 500-character project description.",
      },
      {
        type: "p",
        text: "Ask for the minimum that lets you reply: **a name, an email or phone number, and one free-text box.** Qualify on the call — that is what the call is for.",
      },
      {
        type: "p",
        text: "**A required phone number** is the quietest killer of the lot. Plenty of people won't hand a number to a business they haven't spoken to yet. Make it optional and you keep those enquiries.",
      },
      {
        type: "p",
        text: "**A CAPTCHA on a low-traffic site** is the second. You're adding friction for every real visitor to stop a bot problem you may not have. A honeypot field does the same job invisibly:",
      },
      {
        type: "code",
        lang: "html",
        code: `<div style="position:absolute;left:-9999px" aria-hidden="true">
  <label for="website_url">Leave this field blank</label>
  <input type="text" id="website_url" name="website_url" tabindex="-1" autocomplete="off" />
</div>`,
      },
      {
        type: "code",
        lang: "js",
        code: `// Server-side: a real person never sees this field, so a value means a bot.
if (req.body.website_url) {
  return res.status(200).json({ ok: true }); // look successful, don't tip it off
}`,
      },
      { type: "h2", text: "4. Nobody is tracking submissions, so nobody knows the form works" },
      {
        type: "p",
        text: "This one costs the most and gets noticed the least. I have opened client sites where the contact form had been failing silently for months — success message showing on screen, email never sending, nobody aware because nobody was measuring.",
      },
      {
        type: "p",
        text: "Track the submission as an event, and fire it on the server's answer rather than the button click:",
      },
      {
        type: "code",
        lang: "js",
        code: `const form = document.querySelector("#contact-form");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const data = Object.fromEntries(new FormData(form));

  try {
    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error(\`Request failed: \${res.status}\`);

    // Only after the server confirmed it. A click event would have counted
    // every failed submission as a lead.
    window.gtag?.("event", "generate_lead", {
      form_id: "contact-form",
      page_path: window.location.pathname,
    });

    form.reset();
    showSuccess();
  } catch (err) {
    console.error("[contact] submit failed", err);
    showError("Something went wrong — please email us directly.");
  }
});`,
      },
      {
        type: "p",
        text: "Tracking clicks tells you people tried. It does not tell you they succeeded, and the gap between those two numbers is exactly where lost leads hide.",
      },
      {
        type: "p",
        text: "Then test the whole path monthly: submit your own form from your phone, on mobile data, and confirm the email lands in the inbox you actually read.",
      },
      { type: "h2", text: "5. The leads arrive, but they land in spam" },
      {
        type: "p",
        text: "If your form emails claim to come from your domain but are sent by your host's server, mail providers may treat them as forged. Enquiries then sit in a junk folder nobody opens.",
      },
      {
        type: "p",
        text: "The fix is three DNS records, and it's a one-off job:",
      },
      {
        type: "list",
        items: [
          "**SPF** — which servers are allowed to send mail as you",
          "**DKIM** — cryptographically signs your outgoing mail",
          "**DMARC** — tells providers what to do when the first two fail",
        ],
      },
      {
        type: "code",
        lang: "text",
        code: `; SPF — one record only, listing every service that sends as you
example.com.  TXT  "v=spf1 include:_spf.google.com include:sendgrid.net ~all"

; DMARC — start in monitor mode, read the reports, then tighten to quarantine
_dmarc.example.com.  TXT  "v=DMARC1; p=none; rua=mailto:dmarc@example.com; pct=100"`,
      },
      {
        type: "p",
        text: "Better still, don't rely on email alone. Write every submission to a database or a sheet as well, so a mail failure costs you a notification rather than a lead.",
      },
      { type: "h2", text: "6. The copy talks about you instead of the visitor's problem" },
      {
        type: "p",
        text: "Read the first sentence on your homepage. If it opens with your company name, how long you've been trading, or the word \"welcome\", you've spent your most valuable line on something nobody was searching for.",
      },
      {
        type: "list",
        items: [
          "**Weak:** \"Established in 2011, Acme Ltd is a family-owned provider of quality plumbing solutions.\"",
          "**Strong:** \"Burst pipe or blocked drain in Hamilton? We'll be there today, and you'll know the price before we start.\"",
        ],
      },
      {
        type: "p",
        text: "Same business, same facts. The second one answers where, when and how much — the three things every buyer checks silently before they get in touch.",
      },
      { type: "h2", text: "7. There's no proof, so there's no reason to believe you" },
      {
        type: "p",
        text: "Claims convert nobody. Evidence converts. Roughly in order of power:",
      },
      {
        type: "list",
        items: [
          "A named case study with a before-and-after number",
          "Reviews carrying the reviewer's full name and business",
          "Logos of clients you have genuinely worked with",
          "Photographs of real work, not stock images",
          "Certifications, insurance, trade memberships",
        ],
      },
      {
        type: "p",
        text: "Three specific named reviews beat thirty anonymous five-star ratings. And put the proof next to the call to action, not on a testimonials page nobody visits — it has to be in front of the person at the moment they decide.",
      },
      { type: "h2", text: "8. You're ranking for the wrong searches" },
      {
        type: "p",
        text: "Sometimes the traffic is real and the page is fine — the visitors are simply the wrong ones. Someone searching \"how to unblock a drain yourself\" will not hire you, however good the page is.",
      },
      {
        type: "p",
        text: "Check Google Search Console: **Performance → Queries**, sorted by impressions. If your top queries are informational — \"how to\", \"what is\", \"DIY\" — you're attracting readers rather than buyers.",
      },
      {
        type: "p",
        text: "The fix is a service page written for commercial-intent phrasing: the words people use once they've decided to pay someone. One page per service per location, each genuinely different from the others. If you're not appearing at all rather than appearing for the wrong things, that's a different problem — [why your website doesn't show up on Google](/blogs/why-website-not-showing-on-google) covers it.",
      },
      { type: "h2", text: "9. Local buyers can't tell whether you're local" },
      {
        type: "p",
        text: "For any business serving an area, visitors are scanning for two things: are you near me, and can I call you now. Bury the phone number in the footer and you've lost them before they find it.",
      },
      {
        type: "p",
        text: "Put your service area, phone number and hours in visible text, then mark them up so search engines and AI assistants can read the same facts:",
      },
      {
        type: "code",
        lang: "js",
        code: `{
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": "Acme Plumbing",
  "url": "https://example.com",
  "telephone": "+64-7-555-0100",
  "areaServed": ["Hamilton", "Cambridge", "Te Awamutu"],
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "12 Example Street",
    "addressLocality": "Hamilton",
    "addressRegion": "Waikato",
    "postalCode": "3204",
    "addressCountry": "NZ"
  },
  "openingHoursSpecification": [{
    "@type": "OpeningHoursSpecification",
    "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    "opens": "07:30",
    "closes": "17:00"
  }]
}`,
      },
      {
        type: "p",
        text: "Validate it with Google's [Rich Results Test](https://search.google.com/test/rich-results), and keep every detail identical to your Google Business Profile. Details that disagree undermine both.",
      },
      { type: "h2", text: "What each fix actually takes" },
      {
        type: "table",
        headers: ["Fix", "Effort", "Who can do it"],
        rows: [
          ["Tracking and email deliverability (4, 5)", "About a day", "Needs someone technical"],
          ["Speed (2)", "1–3 days", "Needs someone technical"],
          ["Form and call to action (1, 3)", "About a day", "Doable in-house on most platforms"],
          ["Copy and proof (6, 7)", "1–2 weeks", "Mostly your time gathering material"],
          ["Search intent and local signals (8, 9)", "Ongoing", "Either"],
        ],
      },
      {
        type: "p",
        text: "Most of this list is hours rather than budget, and more than half of it is work you can do yourself.",
      },
      { type: "h2", text: "The order to fix these in" },
      {
        type: "p",
        text: "Each step tells you whether the next one is necessary, which is why the order matters more than the list:",
      },
      {
        type: "list",
        items: [
          "**Tracking and deliverability** (4, 5) — without these, everything after is guesswork",
          "**Speed** (2) — the single biggest lever on mobile",
          "**Form and call to action** (1, 3) — the cheapest wins on the list",
          "**Copy and proof** (6, 7) — mostly your time",
          "**Search intent and local signals** (8, 9) — ongoing, slowest to show",
        ],
      },
      {
        type: "p",
        text: "Then give it a full month after the first three before you judge the result. Lead volume is noisy; one week tells you nothing at all.",
      },
      { type: "h2", text: "When you don't need to hire anyone" },
      {
        type: "p",
        text: "Worth saying plainly, because a good share of this list is genuinely DIY.",
      },
      {
        type: "p",
        text: "**Reasons 1, 3, 6 and 7 are copy and form changes.** On Squarespace, Shopify or a reasonable WordPress theme you can do all four yourself this week. Don't pay someone for that.",
      },
      {
        type: "p",
        text: "**Reasons 2, 4 and 5 are where it gets technical** — event tracking that fires on real success, DNS records, and performance work that survives your next theme update. Guessing here is how a site ends up reporting successful submissions while the enquiries quietly vanish.",
      },
      {
        type: "p",
        text: "**A rebuild is only justified when the platform itself blocks the fixes** — usually a page builder you cannot get under four seconds, or a host whose mail you cannot configure. If someone quotes you a new site before they've run your numbers, get a second opinion. [Does your website need a developer or just a few fixes?](/blogs/does-my-website-need-a-developer) is the longer version of that judgement call, and [how to hire a web developer](/blogs/how-to-hire-a-web-developer) covers what to ask if the answer is yes.",
      },
      {
        type: "p",
        text: "If it does turn out to be structural, the two decisions that follow are which platform and what it should cost: [WordPress vs Wix vs Custom](/blogs/wordpress-vs-wix-vs-custom-website) and [website redesign cost in New Zealand](/blogs/website-redesign-cost-new-zealand).",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How many leads should a small business website get per month?" },
      {
        type: "p",
        text: "It depends on traffic, not on the site alone. At a healthy 1–3% conversion rate, 500 monthly visitors should produce roughly 5–15 enquiries. Below 1%, fix the page before you buy traffic — more visitors to a page that converts nobody just costs more.",
      },
      { type: "h3", text: "My website gets visitors but no enquiries — what should I check first?" },
      {
        type: "p",
        text: "Check the form actually works, and that submissions are tracked. Submit it yourself from a phone on mobile data and confirm the email arrives in your inbox rather than in spam. Silent form failures are far more common than most owners expect, and nothing announces them.",
      },
      { type: "h3", text: "Is a slow website really costing me leads?" },
      {
        type: "p",
        text: "Yes, particularly on mobile. Google's Core Web Vitals guidance puts a good Largest Contentful Paint under 2.5 seconds. Well above that, a share of visitors leave before the page renders, so your copy and your call to action are never read at all.",
      },
      { type: "h3", text: "Do I need a new website to get more leads?" },
      {
        type: "p",
        text: "Usually not. Tracking, speed, a simpler form and clearer copy fix most lead problems on an existing site for a fraction of what a rebuild costs. A rebuild is justified when the platform itself blocks those fixes — not because the site looks dated.",
      },
      { type: "h3", text: "How long before I see more leads after fixing this?" },
      {
        type: "p",
        text: "Allow a month of data after the quick wins. Conversion changes show up within weeks, because they affect people already arriving. Changes driven by search intent take months, because they depend on rankings moving first.",
      },
      { type: "h3", text: "Can I fix this myself or should I hire someone?" },
      {
        type: "p",
        text: "The copy, proof and form work is genuinely DIY on any mainstream platform. Tracking, email deliverability and performance are where self-diagnosis usually goes wrong — those three are worth a second pair of eyes.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Do the arithmetic at the top first. It takes five minutes and it decides whether you're fixing a page or buying traffic — and getting that one call wrong is what makes the rest expensive.",
      },
      {
        type: "p",
        text: "If you'd rather not diagnose it alone, [send me your URL](/contact) with last month's visitor and enquiry counts and I'll tell you which of the nine are actually costing you leads. No charge for the diagnosis, and you can see the kind of work it leads to on the [projects page](/projects).",
      },
    ],
  },
  {
    slug: "website-redesign-cost-new-zealand",
    // 43 chars, so withBrand() still fits the brand inside 62.
    title: "Website Redesign Cost in New Zealand (2026)",
    excerpt:
      "What a redesign really costs in NZ, tier by tier and excluding GST — the seven things that move the number, and when a redesign is the wrong spend entirely.",
    coverImage:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-11",
    tags: ["Website Cost", "New Zealand", "Small Business"],
    content: [
      {
        type: "p",
        text: "A website redesign in New Zealand runs from about **$2,000 for a light refresh** to **$30,000–$50,000+** for a large custom rebuild. Most SMEs land somewhere in **$5,000–$15,000**. Freelancers and small studios quote the low-to-mid end; city agencies quote the top end for comparable scope.",
      },
      {
        type: "p",
        text: "All figures below are NZD and **exclude GST**, because that is how most New Zealand providers quote. Add 15% when you're forecasting the actual cash cost.",
      },
      { type: "h2", text: "What NZ providers actually charge in 2026" },
      {
        type: "table",
        headers: ["Tier", "Typical price (NZD, ex GST)", "What it is", "Who it suits"],
        rows: [
          ["Refresh", "$2,000 – $5,000", "New theme restyled, existing content and structure carried over", "Sole traders, 3–8 page brochure sites"],
          ["Standard redesign", "$5,000 – $15,000", "Custom design, new page structure, some new copy, CMS, on-page SEO, integrations", "Most SMEs — the volume band"],
          ["Full rebuild", "$15,000 – $30,000", "New information architecture, new copy, platform migration, custom functionality", "Established, lead-critical sites"],
          ["Complex or eCommerce", "$30,000 – $50,000+", "Large catalogues, portals, memberships, ERP integrations", "Multi-product retail, enterprise"],
        ],
        caption: "NZD, excluding GST. Ranges cross-checked against NZ providers publishing 2026 figures.",
      },
      {
        type: "p",
        text: "Those bands are not invented. One Auckland studio puts the most common bracket for a quality marketing website at [$4,000–$15,000](https://kingtide.nz/blog/website-design-auckland-cost); another quotes redesigns at [$12,000–$50,000](https://www.skyrocket.co.nz/learn/website-redesign-cost-nz) depending on how much structure is rethought; a third prices a 5–8 page small business site at [$3,990–$8,000 + GST](https://www.fueldesign.co.nz/blog/how-much-does-a-website-cost-in-new-zealand-2026-pricing-guide/); a fourth puts the sweet spot for most Auckland small businesses at [$5,000–$12,000](https://horntech.co.nz/blog/web-design-cost-nz-2026/).",
      },
      {
        type: "p",
        text: "Read those side by side and the spread stops looking like a quality gap. The same Auckland studio is explicit about it: CBD agencies typically quote **$15,000–$30,000+** for projects lower-overhead providers deliver for **$4,000–$8,000**, and the difference is overhead rather than capability — offices, account managers, and the layers between you and whoever writes the code.",
      },
      {
        type: "p",
        text: "One reconciliation, since this site publishes both numbers: [what a website costs in New Zealand](/blogs/website-cost-new-zealand-2026) puts most new small business builds at $1,500–$8,000. That's the same market seen from the other end — small brochure builds, where a refresh here at $2,000–$5,000 lines up exactly. The higher redesign bands describe projects that change structure, copy or platform, which is a different job from putting up five pages.",
      },
      {
        type: "p",
        text: "Comparing quotes right now? [The questions worth asking](/blogs/how-to-choose-a-website-developer) will tell you more than the totals will.",
      },
      { type: "h2", text: "Is a redesign cheaper than a new website?" },
      {
        type: "p",
        text: "Usually — but by **20–40%**, not half.",
      },
      {
        type: "p",
        text: "The saving comes from work you aren't repeating: brand, existing content, product photography, and a live site whose analytics already tell you what works. What doesn't disappear is the build. Rewriting a front end takes roughly the same hours whether the design is brand new or refined.",
      },
      {
        type: "p",
        text: "And the saving evaporates entirely if you **change platform at the same time**. WordPress to Webflow, or Wix to custom, means full content migration, URL mapping and a redirect plan stacked on top of the design work — new-build prices, with the added constraint of preserving rankings you already have.",
      },
      { type: "h2", text: "The seven things that actually move the number" },
      { type: "h3", text: "1. Unique templates, not total pages" },
      {
        type: "p",
        text: "Ten pages using three layouts is a small job. Six pages using six layouts is a bigger one. Ask any provider how many **unique templates** they're building — that number drives the hours far more than the page count does.",
      },
      { type: "h3", text: "2. Who writes the copy" },
      {
        type: "p",
        text: "The most underestimated line item on every quote. Supply final, signed-off copy and you save real money; provider-written copy adds roughly **$150–$400 per page**. Be honest with yourself about which you'll actually do — redesigns run late waiting on client content far more often than on developer capacity.",
      },
      { type: "h3", text: "3. Template versus custom design" },
      {
        type: "p",
        text: "A restyled premium theme is fast, cheap, and looks like several thousand other sites. A custom design is drawn around your actual services and buyers. The difference in build cost is **$3,000–$8,000**; the difference in conversion is the entire reason to redesign at all.",
      },
      { type: "h3", text: "4. Integrations" },
      {
        type: "p",
        text: "Each system — Xero, a booking engine, a CRM, a payment gateway, an inventory feed — is discrete work with its own testing and its own failure modes. Budget **$500–$2,500 each**. \"It has an API\" is not the same sentence as \"it's a two-hour job\".",
      },
      { type: "h3", text: "5. Content migration and redirects" },
      {
        type: "p",
        text: "Forty blog posts with existing rankings means mapping every old URL to a new one with 301 redirects. Skip it and you lose visibility you spent years earning. Budget **$500–$2,000** of unglamorous, essential work — and check for it explicitly, because it's the line most commonly missing from a cheap quote.",
      },
      {
        type: "p",
        text: "It isn't complicated work, which is exactly why its absence is hard to forgive. On most modern hosts it's a config file:",
      },
      {
        type: "code",
        lang: "js",
        code: `// vercel.json — one entry per old URL, permanent, no chains
{
  "redirects": [
    { "source": "/services.html", "destination": "/services", "permanent": true },
    { "source": "/about-us", "destination": "/about", "permanent": true },
    { "source": "/blog/:slug", "destination": "/blogs/:slug", "permanent": true }
  ]
}`,
      },
      {
        type: "p",
        text: "Two rules make it work: every redirect points at the closest equivalent page rather than dumping everyone on the homepage, and no redirect points at another redirect. Ask to see the map before launch, not after the traffic drops.",
      },
      { type: "h3", text: "6. Accessibility and performance targets" },
      {
        type: "p",
        text: "\"Fast and accessible\" is not free. WCAG 2.1 AA and good Core Web Vitals on real devices add testing and remediation time. Worth paying for — but ask for it explicitly rather than assuming it's included, because \"fast\" is not a target and Core Web Vitals thresholds are.",
      },
      { type: "h3", text: "7. Scope creep after design sign-off" },
      {
        type: "p",
        text: "The most common cause of overrun on both sides. Some providers absorb changes and quietly resent them; others issue variations. Neither is wrong — ask which, before you sign, so nobody is surprised in week six.",
      },
      { type: "h2", text: "What you get at each price point" },
      {
        type: "p",
        text: "**$2,000–$5,000** — a themed site carrying your branding, responsive, 5–8 pages, contact form, basic on-page SEO. Content largely yours to write. Good value when your content is strong and the site simply looks dated.",
      },
      {
        type: "p",
        text: "**$5,000–$15,000** — custom design across several templates, navigation restructured around how people actually buy from you, an editable CMS, integrations, proper redirect mapping, performance work, and copy support. This is where a redesign stops being a facelift and starts being an investment.",
      },
      {
        type: "p",
        text: "**$15,000+** — all of the above plus research, new information architecture, full copywriting, custom functionality and a longer discovery phase. Justified when the site is a primary revenue channel and a single percentage point of conversion is worth thousands a month.",
      },
      { type: "h2", text: "When a redesign is the wrong spend" },
      {
        type: "p",
        text: "Bluntly, because this one costs people real money: **most sites that \"aren't working\" don't need a redesign.** Three checks before you spend anything.",
      },
      {
        type: "list",
        items: [
          "**Is anyone arriving?** At 60 visitors a month, a beautiful new site gets the same 60 visitors. That's a search visibility problem, and $3,000 of content work will outperform $12,000 of design every time.",
          "**Does it convert what it already gets?** Run the arithmetic in [why your website isn't getting leads](/blogs/website-not-getting-leads). If you're already at 2% or better, design is not your bottleneck.",
          "**Is the content the actual problem?** A structurally sound site with vague copy improves more from a rewrite than a redesign. Copy is cheaper, faster, and testable within a week.",
        ],
      },
      {
        type: "p",
        text: "A redesign is the right call when the platform blocks you from fixing things, when the site can't be made fast, when nobody can edit it without a developer, when the structure no longer matches the services you sell, or when it is visibly a decade behind your competitors.",
      },
      { type: "h2", text: "The costs that aren't in the quote" },
      {
        type: "list",
        items: [
          "**Hosting** — $20–$100/month",
          "**Domain renewal** — $25–$50/year for a .co.nz",
          "**Maintenance and support** — $50–$300/month",
          "**Premium plugin licences** — $200–$800/year on a typical WordPress build, rarely mentioned at the point of sale",
          "**Stock photography** — $0 on free tiers, $50–$500+ licensed",
          "**GST** — 15%, on top of every quoted price above",
        ],
      },
      {
        type: "p",
        text: "The full recurring picture is in [annual website maintenance costs in NZ](/blogs/annual-website-maintenance-costs-nz), including what a maintenance plan should contain before it's worth paying for.",
      },
      { type: "h2", text: "How to get a quote you can actually compare" },
      {
        type: "p",
        text: "Send every provider the identical brief:",
      },
      {
        type: "list",
        items: [
          "Your current site URL, and the specific problems with it",
          "Approximate page count and how many unique layouts you expect",
          "Who is writing the copy — you or them",
          "Every integration required, named",
          "Your launch deadline, and what is driving it",
          "Your budget range — withholding it doesn't get you a better price, it gets you a quote for the wrong scope",
        ],
      },
      {
        type: "p",
        text: "Then ask for each quote itemised into design, build, content, migration and testing. Two quotes with the same total can hide completely different amounts of work, and the only place you'll see it is line by line.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How much does a website redesign cost in NZ in 2026?" },
      {
        type: "p",
        text: "Most New Zealand businesses pay $5,000–$15,000 + GST. Light refreshes start near $2,000, and full rebuilds with new architecture, new copy and a platform migration run $15,000–$50,000+. Published NZ provider guides put the common bracket at $4,000–$15,000, which is the same band read from the other end.",
      },
      { type: "h3", text: "Is a redesign cheaper than building a new website?" },
      {
        type: "p",
        text: "Typically 20–40% cheaper, because branding, content and analytics already exist and don't need recreating. That saving disappears if you change platform at the same time, since content migration, URL mapping and redirects then have to be done as well.",
      },
      { type: "h3", text: "Do I need a redesign or just better content?" },
      {
        type: "p",
        text: "If your site already converts at around 2% and simply gets too few visitors, the problem is traffic and content rather than design. Check your conversion rate before you commit to a redesign — the arithmetic takes five minutes and can save you five figures.",
      },
      { type: "h3", text: "Why do NZ website quotes vary so much for the same brief?" },
      {
        type: "p",
        text: "Mostly overhead and hidden scope. Larger agencies carry more salaried staff between you and the build, and NZ providers themselves put the same work at $15,000–$30,000+ agency-side against $4,000–$8,000 from lower-overhead providers. The rest of the variation hides in who writes the copy, how many unique templates are built, and whether redirect mapping is included at all.",
      },
      { type: "h3", text: "Does a NZ website quote include GST?" },
      {
        type: "p",
        text: "Usually not. Most New Zealand providers quote excluding GST, so add 15% when you're forecasting actual cash cost. If a quote doesn't say either way, ask — on a $12,000 project that ambiguity is $1,800.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Work out which of the three checks above applies to you before you request a single quote. If it turns out you do need the work, write the brief in this post's last section and send the same one to everybody — it's the only way the numbers you get back mean anything.",
      },
      {
        type: "p",
        text: "If you're mid-comparison right now, send me the brief you're sending everyone else and I'll tell you whether the scope makes sense and what a fair number looks like for it — including when I think you'd be better served elsewhere. Still deciding whether a redesign is the right move at all? [Should you fix your website or build a new one](/blogs/fix-or-rebuild-website) works through that question first. [Get in touch](/contact), or [see recent work](/projects).",
      },
    ],
  },
  {
    slug: "wordpress-vs-wix-vs-custom-website",
    title: "WordPress vs Wix vs Custom: How to Choose",
    excerpt:
      "An honest comparison of WordPress, Wix and custom builds — three-year cost of ownership, speed, SEO control, lock-in, and what changing your mind later costs.",
    coverImage:
      "https://images.unsplash.com/photo-1499951360447-b19be8fe80f5?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-11",
    tags: ["Website Platform", "WordPress", "Small Business"],
    content: [
      {
        type: "p",
        text: "Choose **Wix** if you need something online this month, you'll maintain it yourself, and the site isn't your main sales channel. Choose **WordPress** if you publish content regularly and want a large plugin ecosystem. Choose **custom** when the site has to do something specific — speed, an application, an integration — that platforms make you fight for.",
      },
      {
        type: "p",
        text: "The comparison that actually decides this isn't features. It's what you'll have paid by year three, and how hard it is to leave.",
      },
      { type: "h2", text: "The three-year cost of ownership" },
      {
        type: "p",
        text: "Sticker price hides the real number. A typical small business site over three years, using published 2026 NZ market ranges:",
      },
      {
        type: "table",
        headers: ["", "Wix (DIY)", "WordPress (built for you)", "Custom build"],
        rows: [
          ["Build", "$0–$1,000 (your time)", "$3,000–$15,000", "$5,000–$25,000+"],
          ["Platform / hosting per year", "$300–$700", "$250–$1,200", "$100–$600"],
          ["Plugin / licence renewals", "Included", "$200–$800/yr", "Usually $0"],
          ["Maintenance and updates", "You", "$600–$3,600/yr", "$0–$2,400/yr"],
          ["Rough 3-year total", "$900–$3,100", "$6,150–$31,800", "$5,300–$34,000"],
        ],
        caption: "Indicative NZD, excluding GST. Build ranges vary widely by scope — see the NZ cost guides linked below.",
      },
      {
        type: "p",
        text: "Two things stand out. Wix is the cheapest and it isn't close — if budget is the binding constraint, that's your answer and the rest of this post is optional reading. And the WordPress and custom bands overlap almost entirely, which means that choice is about fit rather than money.",
      },
      {
        type: "p",
        text: "Where the table misleads: it prices the site, not the outcome. A $900 site producing two enquiries a month is more expensive than a $15,000 site producing twenty. Run that arithmetic for your own business before you optimise for the cheapest row — [what a website costs in New Zealand](/blogs/website-cost-new-zealand-2026) has the build-side detail.",
      },
      { type: "h2", text: "Speed: what each platform lets you control" },
      {
        type: "p",
        text: "**Wix** ships a substantial JavaScript runtime with every page. It has improved a great deal and a well-built Wix site can pass Core Web Vitals — but you're working inside their rendering pipeline. You can compress images and remove apps. You cannot change how the platform builds the page.",
      },
      {
        type: "p",
        text: "**WordPress** can be very fast or catastrophically slow, and it comes down entirely to what's installed. A lean theme with caching performs well. The same site with a visual builder, a slider, five analytics scripts and thirty plugins commonly ships 2–4MB per page, because every plugin adds its CSS and JS to every page whether or not that page uses it.",
      },
      {
        type: "p",
        text: "**Custom** is the only option where you decide exactly what ships to each page:",
      },
      {
        type: "code",
        lang: "tsx",
        code: `// The pricing calculator's bundle downloads only for people who visit /pricing
import { lazy, Suspense } from "react";

const PricingCalculator = lazy(() => import("./PricingCalculator"));

export default function PricingPage() {
  return (
    <Suspense fallback={<CalculatorSkeleton />}>
      <PricingCalculator />
    </Suspense>
  );
}`,
      },
      {
        type: "p",
        text: "On a platform site, that calculator's code loads on your homepage too. On a custom build it loads for the people who asked for it.",
      },
      {
        type: "p",
        text: "Being fair about this: **most small business sites do not need that control.** Eight pages of text and images will hit good Core Web Vitals on a tidy Wix site or a well-configured WordPress install. Performance decides the platform when you have heavy interactive features, large catalogues, or a mobile-first audience on poor connections. Measure before you assume — run your current site through [PageSpeed Insights](https://pagespeed.web.dev/) and read the field data, not the lab score.",
      },
      { type: "h2", text: "SEO: smaller differences than the marketing suggests" },
      {
        type: "p",
        text: "All three can rank. Google awards no points for platform.",
      },
      {
        type: "p",
        text: "**All three give you** custom titles and meta descriptions, custom URLs, alt text, sitemaps, robots.txt, canonicals and structured data. That's the majority of on-page technical SEO, and it's table stakes everywhere now.",
      },
      {
        type: "p",
        text: "**WordPress pulls ahead** on the technical SEO plugin ecosystem, bulk metadata editing across hundreds of pages, and the plain fact that any consultant you hire already knows it.",
      },
      {
        type: "p",
        text: "**Wix limits you** on fine-grained redirect logic at scale, response headers, and some markup control. Irrelevant on a twelve-page brochure site. A daily annoyance on a 400-page content site.",
      },
      {
        type: "p",
        text: "**Custom wins** on rendering strategy, response headers, and generating schema from the same data the page renders — so the markup can't drift away from what's visible:",
      },
      {
        type: "code",
        lang: "ts",
        code: `// One source of truth: the page copy and the structured data read the same object
export function generateMetadata({ params }) {
  const service = getService(params.slug);
  return {
    title: \`\${service.name} | WebDevStudio\`,
    description: service.summary,
    alternates: { canonical: \`https://example.com/services/\${params.slug}\` },
  };
}

const schema = {
  "@context": "https://schema.org",
  "@type": "Service",
  name: service.name,
  description: service.summary,
  provider: { "@type": "Organization", name: "WebDevStudio" },
  areaServed: ["NZ", "CY"],
};`,
      },
      {
        type: "p",
        text: "The honest summary: platform is maybe 10% of SEO outcomes. Content quality, intent match and internal linking are the other 90%, and they're identical on all three.",
      },
      { type: "h2", text: "Ownership and lock-in, the part nobody asks about until it matters" },
      {
        type: "p",
        text: "**Wix — you're renting.** The site cannot be exported and re-hosted in any usable form. Content can be copied out page by page; the site itself cannot come with you. Outgrow Wix and you rebuild from scratch. Check who registered your domain too: if it was created inside a Wix plan, confirm it's transferable and in your name.",
      },
      {
        type: "p",
        text: "**Self-hosted WordPress — you own the files and the database.** You can move hosts in an afternoon. This is the platform's strongest argument and it is entirely real.",
      },
      {
        type: "p",
        text: "**Custom — you own the source and the repository.** Any competent developer can pick it up, provided it's mainstream tooling and documented. A custom site on an obscure framework with no README is its own form of lock-in, and a worse one than Wix — at least Wix will still be running next year.",
      },
      {
        type: "p",
        text: "Before signing with anyone, on any platform, get it in writing that **you own the domain, the hosting account, the repository and the content**. More on that in [how to choose a website developer](/blogs/how-to-choose-a-website-developer).",
      },
      { type: "h2", text: "Maintenance burden" },
      {
        type: "p",
        text: "**Wix** — near zero. The platform updates itself. Genuinely excellent, and the reason it suits time-poor owners better than any amount of feature comparison suggests.",
      },
      {
        type: "p",
        text: "**WordPress** — ongoing and non-optional. Outdated plugins are the most common route into a hacked WordPress site. Either you do this monthly or you pay someone to:",
      },
      {
        type: "code",
        lang: "text",
        code: `# A minimal monthly WordPress routine — export a backup first, always
wp db export backup-$(date +%F).sql
wp plugin update --all
wp theme update --all
wp core update
wp core verify-checksums   # flags modified core files, a common malware signal`,
      },
      {
        type: "p",
        text: "**Custom** — low, but not zero. Dependencies need updating and frameworks ship major versions, but there is far less installed to patch. A well-built custom site can sit a year untouched without becoming insecure. A WordPress site cannot.",
      },
      {
        type: "p",
        text: "Real annual figures for all three are in [annual website maintenance costs in NZ](/blogs/annual-website-maintenance-costs-nz).",
      },
      { type: "h2", text: "Migration: what changing your mind costs" },
      {
        type: "list",
        items: [
          "**Wix to WordPress or custom** — effectively a rebuild. Content copied manually, design recreated, and a complete redirect map needed to protect your rankings. Budget close to new-build cost.",
          "**WordPress to custom** — much easier. The database is accessible, and WordPress can run headless, serving content to a custom front end via its REST API. A common, low-risk middle path.",
          "**Custom to anything** — depends entirely on how it was built. Standard framework and a clean data model, straightforward. Bespoke everything with no documentation, expensive.",
        ],
      },
      {
        type: "p",
        text: "Whichever direction you go, the redirect map is what protects the search equity you've already built. Never let it be the line item cut to win a quote.",
      },
      { type: "h2", text: "The decision, in one table" },
      {
        type: "table",
        headers: ["If this is true of you", "Build it on"],
        rows: [
          ["Budget under ~$1,500 total, and the site isn't your main sales channel", "Wix"],
          ["Live in days, maintained by you", "Wix"],
          ["You publish blog or resource content weekly", "WordPress"],
          ["You want a large plugin ecosystem and easy access to developers who know it", "WordPress"],
          ["An online store with a standard catalogue", "WordPress + WooCommerce, or Shopify"],
          ["App-like features, dashboards, or user accounts", "Custom"],
          ["Mobile speed is a competitive advantage in your market", "Custom"],
          ["Integrations with systems that have no plugin", "Custom"],
          ["You've been burned by plugin conflicts or a hack", "Custom"],
        ],
      },
      {
        type: "p",
        text: "One honest disqualifier: if nobody in your business will ever update the site and you don't want a maintenance retainer, **don't choose WordPress**. The unmaintained WordPress site is the single most common broken website anyone gets asked to rescue.",
      },
      { type: "h2", text: "What I'd tell you if you called me" },
      {
        type: "p",
        text: "Most people asking this question have already decided they want better than what they've got, and are looking for permission. So, plainly: if your current site is a Wix page that's been fine for three years and your leads come from word of mouth, keep it and spend the money on content instead.",
      },
      {
        type: "p",
        text: "If the site is your main sales channel and it's slow, unmaintained, or you can't edit it without calling someone — that's a real problem worth real money, and the platform choice above is the first decision rather than the last.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Should I use Wix or hire a developer?" },
      {
        type: "p",
        text: "Use Wix if your budget is under about $1,500, you'll maintain the site yourself, and it isn't your main sales channel. Hire a developer when the site needs custom functionality, real speed, integrations, or when the enquiries you're losing cost more than the build would.",
      },
      { type: "h3", text: "Is WordPress better than Wix for SEO?" },
      {
        type: "p",
        text: "Marginally, and only at scale. Both support custom metadata, URLs, sitemaps and structured data. WordPress gives more control over bulk editing and redirect logic, which matters on large content sites and rarely on a ten-page brochure site. Platform is roughly 10% of SEO outcomes; content and intent match are the rest.",
      },
      { type: "h3", text: "Do I own my website if I build it on Wix?" },
      {
        type: "p",
        text: "You own your content and your domain, but not the site in any portable form. Wix sites can't be exported and re-hosted, so moving off means rebuilding. Self-hosted WordPress and custom builds are both fully portable — you can take the files, the database or the repository with you.",
      },
      { type: "h3", text: "Is a custom website worth it for a small business?" },
      {
        type: "p",
        text: "When the site does something a platform makes difficult: app-like features, unusual integrations, or performance as a genuine competitive edge. For a straightforward brochure site, well-built WordPress or Wix delivers the same commercial result for less money.",
      },
      { type: "h3", text: "Can I move my website from Wix to WordPress?" },
      {
        type: "p",
        text: "Yes, but treat it as a rebuild rather than a migration. Content transfers manually, the design is recreated, and you'll need a complete 301 redirect map so you don't lose the rankings the old URLs earned.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Answer two questions before you look at any platform: what does the site have to do that your current one can't, and who is going to maintain it? Those two answers eliminate at least one of the three options every time, usually more.",
      },
      {
        type: "p",
        text: "Not sure which of the three you need? Tell me what the site has to do and who it's for, and I'll tell you straight — including when the answer is \"stay on Wix and spend it on content\". [Get in touch](/contact), or [see recent work](/projects).",
      },
    ],
  },
  {
    slug: "how-to-choose-a-website-developer",
    // 47 chars — withBrand() lands on exactly 62, the limit it allows.
    title: "How to Choose a Website Developer: 12 Questions",
    excerpt:
      "How to audit a web developer's live work in ten minutes, the 12 questions to send in writing, and the ownership clause most contracts leave out.",
    coverImage:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-11",
    tags: ["Hiring a Developer", "Small Business", "New Zealand"],
    content: [
      {
        type: "p",
        text: "Judge a developer on three things: evidence they've shipped comparable work that's still live, a written fixed scope you can hold them to, and clear ownership terms giving you the domain, the code and the hosting. Portfolio screenshots, team size and a polished sales deck predict very little.",
      },
      {
        type: "p",
        text: "This post is the checklist — the specific things to open, run and ask, in order. If what you want instead is how to read the conversation when you don't know how to code, [how to hire a web developer](/blogs/how-to-hire-a-web-developer) covers the judgement side and pairs with this one.",
      },
      { type: "h2", text: "Step 1 — Write down what the site has to do, in business terms" },
      {
        type: "p",
        text: "Not \"modern and professional\". Specifics somebody could measure:",
      },
      {
        type: "list",
        items: [
          "\"Generate at least 10 qualified enquiries a month from Auckland and Waikato\"",
          "\"Let customers book a service slot without phoning us\"",
          "\"Let our office manager add a service page without calling a developer\"",
        ],
      },
      {
        type: "p",
        text: "This one page is the most valuable thing you'll produce in the whole process. It's how you compare quotes, how you spot someone selling you a bigger project than you need, and what a good developer will push back on before quoting. **If nobody asks to see it, that tells you something.**",
      },
      { type: "h2", text: "Step 2 — Freelancer, small studio, or agency" },
      {
        type: "table",
        headers: ["", "Best for", "Watch out for"],
        rows: [
          ["Freelancer / solo developer", "Sites and apps up to mid-complexity, direct access to whoever builds it, lower cost", "Single point of failure — illness, holidays, other clients. Ask about capacity and handover."],
          ["Small studio (2–8 people)", "Projects needing design, development and strategy together", "Whether the person who sold you the project is the person doing the work"],
          ["Agency (10+ people)", "Large multi-channel programmes, brand work, ongoing paid media", "Overhead you may not need for a business website"],
        ],
      },
      {
        type: "p",
        text: "The price gap is mostly structural rather than a quality difference. One Auckland studio publishing its own numbers is direct about it: CBD agencies typically quote [$15,000–$30,000+ for projects lower-overhead providers deliver for $4,000–$8,000](https://kingtide.nz/blog/website-design-auckland-cost), and the difference is offices and account layers rather than capability. Pay agency rates when you genuinely need agency breadth.",
      },
      { type: "h2", text: "Step 3 — Audit their live work, not their portfolio images" },
      {
        type: "p",
        text: "Ten minutes of this eliminates most of the field, and none of it requires technical knowledge.",
      },
      { type: "h3", text: "1. Ask for three live URLs" },
      {
        type: "p",
        text: "From the last two years, in a category like yours. Mockups only, or links that 404? That's your answer, and it arrived cheaply.",
      },
      { type: "h3", text: "2. Open each one on your phone, on mobile data" },
      {
        type: "p",
        text: "Not on wifi. Mobile data is how a real customer arrives, and it's where a heavy site stops being an abstract complaint.",
      },
      { type: "h3", text: "3. Run each through PageSpeed Insights" },
      {
        type: "p",
        text: "Use [PageSpeed Insights](https://pagespeed.web.dev/) and read the mobile field data. You aren't looking for perfect scores — you're checking they don't ship 4MB homepages to people on a phone.",
      },
      { type: "h3", text: "4. View source and look for three things" },
      {
        type: "p",
        text: "You don't need to read code. Look for alt text on images, and a title and meta description that aren't the theme's defaults. A well-built page's head is short and specific:",
      },
      {
        type: "code",
        lang: "html",
        code: `<!-- Specific to this page. If every page shares one title, nobody set them. -->
<title>Emergency Plumber in Hamilton — On Site Today</title>
<meta name="description" content="24/7 emergency plumbing across Hamilton and Waikato. Fixed prices quoted before we start." />
<link rel="canonical" href="https://example.co.nz/services/emergency-plumbing" />

<!-- Real alt text describes the image. "image1.jpg" is a tell. -->
<img src="/img/team-van.webp" width="1200" height="675"
     alt="Two plumbers unloading equipment from a branded van" />`,
      },
      { type: "h3", text: "5. Tab through with your keyboard" },
      {
        type: "p",
        text: "Press Tab repeatedly from the top of the page. If you can't reach the navigation and the contact form with the keyboard alone, they don't build accessibly — whatever the proposal claims.",
      },
      { type: "h3", text: "6. Ask for one client reference you can phone" },
      {
        type: "p",
        text: "Then ask that client exactly one question: what went wrong, and how was it handled? Every project has a problem. The handling is the signal, and a reference who can answer it specifically is worth more than five written testimonials.",
      },
      {
        type: "p",
        text: "If they build applications rather than brochure sites, ask for a public repository or a code sample as well. A developer who can't show code in any form is a strange thing to hire for a coding job.",
      },
      { type: "h2", text: "Step 4 — Send these 12 questions in writing" },
      {
        type: "p",
        text: "In writing, so you can compare answers side by side. The wording of a bad answer is usually more revealing than its content.",
      },
      { type: "h3", text: "On scope and money" },
      {
        type: "list",
        items: [
          "**What exactly is included, itemised** — design, build, content, migration, testing? A single-line total can't be compared with anything.",
          "**What is explicitly not included?** Good providers answer this fast and specifically. Vagueness here is where variation invoices are born.",
          "**What happens when I ask for something outside scope mid-project?** Absorbed, quoted as a variation, or billed hourly — there's no wrong answer, only knowing in advance.",
          "**What's the payment schedule?** Halves or thirds against milestones is normal. Payment in full up front, to someone you've never worked with, is not.",
        ],
      },
      { type: "h3", text: "On ownership — the ones people forget" },
      {
        type: "list",
        items: [
          "**Who owns the domain, and whose name is on the registration?** It must be yours. Domains registered in a provider's name are the most common hostage situation in this industry.",
          "**Who owns the code and the repository when we're finished?** Full access to source control, not a zip file emailed at handover.",
          "**If we part ways, what do I walk away with?** Get the specific list: domain, hosting credentials, repository, CMS admin, analytics property, design files.",
        ],
      },
      { type: "h3", text: "On what happens after launch" },
      {
        type: "list",
        items: [
          "**Who fixes it if something breaks in week three?** Is there a warranty period? Most reasonable providers include 30 days of bug fixes on their own work.",
          "**What are the ongoing costs, all of them?** NZ ranges run roughly $20–$100/month for hosting and $50–$300/month for maintenance — the full picture is in [annual website maintenance costs in NZ](/blogs/annual-website-maintenance-costs-nz).",
          "**Can my team edit content without you?** Ask for a demo of the actual editing interface before you sign. \"Yes, it's easy\" is not a demo.",
        ],
      },
      { type: "h3", text: "On process" },
      {
        type: "list",
        items: [
          "**What do you need from me, and by when?** The right answer names content, images, brand assets and feedback deadlines. Projects run late waiting on client content far more often than on developer capacity.",
          "**What's your communication rhythm?** A weekly update, a named channel, an expected response time. Three weeks of silence mid-project is the most common complaint about web work, and the most preventable.",
        ],
      },
      { type: "h2", text: "Step 5 — Read the proposal for what's missing" },
      {
        type: "p",
        text: "Cheap quotes usually aren't cheap because someone is being generous with you. Scan specifically for:",
      },
      {
        type: "list",
        items: [
          "**Redirect mapping** — 301s from old URLs to new ones. Omitting this can cost years of accumulated search visibility on launch day.",
          "**Testing** — which browsers and which devices, stated explicitly?",
          "**Accessibility** — is WCAG 2.1 AA named, or is it assumed you won't ask?",
          "**Performance targets** — \"fast\" is not a target. Core Web Vitals thresholds are.",
          "**Content responsibility** — who writes it, page by page.",
          "**Training and handover** — a recorded walkthrough of your CMS is worth more than a PDF nobody opens.",
        ],
      },
      {
        type: "p",
        text: "Two quotes with identical totals can differ by weeks of work in those six lines alone. For what the totals themselves should look like, [website redesign cost in New Zealand](/blogs/website-redesign-cost-new-zealand) has the current bands.",
      },
      { type: "h2", text: "Step 6 — The red flags" },
      {
        type: "p",
        text: "Any one of these is a conversation. Two or more, walk away.",
      },
      {
        type: "list",
        items: [
          "**Guarantees a #1 Google ranking.** Nobody can promise this. It signals either dishonesty or inexperience, and both are expensive.",
          "**Won't put scope in writing.** \"We'll figure it out as we go\" means you'll pay for it as you go.",
          "**Registers the domain in their own name.** Non-negotiable. It's yours.",
          "**Their own site is slow, broken, or three years stale.** It's the one piece of work they controlled completely.",
          "**Quotes five figures without asking about your business.** They're quoting a template, and you're the one who'll discover what it doesn't cover.",
          "**Can't name the platform they'd use, or why.** \"Whatever you prefer\" is an absence of opinion, not flexibility.",
          "**Pressure tactics** — a price expiring Friday on a three-month project.",
          "**No contract.** Even a single page covering scope, price, timeline, ownership and payment protects you both.",
        ],
      },
      { type: "h2", text: "What good actually looks like" },
      {
        type: "p",
        text: "The developer worth hiring does things that feel slightly uncomfortable at the sales stage. They ask what the site should achieve commercially before they'll quote. They tell you when a cheaper option serves you better, and mean it. They name what they're not good at. They write a scope that constrains them as much as it constrains you. And they ask about content deadlines early, because they've been burned by that before.",
      },
      {
        type: "p",
        text: "Someone who agrees with everything in a sales call will agree with everything during the project too — including the changes that quietly double the scope.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "What questions should I ask a web developer before hiring?" },
      {
        type: "p",
        text: "Ask for an itemised scope, what's explicitly excluded, how out-of-scope requests are handled, who owns the domain and the code, what happens if something breaks after launch, what all the ongoing costs are, and whether your team can edit content without them. Send them in writing so the answers can be compared side by side.",
      },
      { type: "h3", text: "Should I hire a freelancer or an agency for my website?" },
      {
        type: "p",
        text: "Hire a freelancer or small studio for straightforward business sites and mid-complexity applications. NZ providers themselves put the same work at $15,000–$30,000+ agency-side against $4,000–$8,000 from lower-overhead providers, and describe the gap as overhead rather than quality. Choose an agency when you need brand strategy, multi-channel campaigns, or genuine team depth.",
      },
      { type: "h3", text: "Who owns the code when you hire a web developer?" },
      {
        type: "p",
        text: "You should, and it has to be stated in writing before work starts. Confirm you'll receive the domain registered in your name, full repository access, hosting credentials, CMS admin and the analytics property. A zip file emailed at handover is not repository access.",
      },
      { type: "h3", text: "How do I know if a web developer is any good?" },
      {
        type: "p",
        text: "Check three sites they built recently: load them on mobile data, run them through PageSpeed Insights, and try navigating with only the keyboard. Then phone one past client and ask what went wrong and how it was handled. That's ten minutes and it outperforms any portfolio page.",
      },
      { type: "h3", text: "What are the biggest red flags when hiring a web developer?" },
      {
        type: "p",
        text: "A guaranteed #1 Google ranking, no written scope, registering your domain in their name, a slow or outdated site of their own, and quoting a large project without asking anything about your business. Any one warrants a question; two or more warrants walking away.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Write the one-page brief from Step 1 first. Everything else in this post gets easier once it exists, and the people worth hiring will ask for it unprompted.",
      },
      {
        type: "p",
        text: "If you're at the quoting stage, bring me that brief and I'll tell you honestly whether the scope makes sense — including if I think you'd be better served elsewhere. When the quotes come back, [what should be in a web development quote](/blogs/what-should-be-in-web-development-quote) is the line-by-line checklist to hold them against. [Get in touch](/contact), or [see recent work](/projects).",
      },
    ],
  },
  {
    slug: "annual-website-maintenance-costs-nz",
    title: "Annual Website Maintenance Costs in NZ (2026)",
    excerpt:
      "What a NZ website costs to keep running each year — hosting, domain, SSL, plugins, updates and support — with three annual budgets and what a plan must include.",
    coverImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-11",
    tags: ["Maintenance", "Website Cost", "New Zealand"],
    content: [
      {
        type: "p",
        text: "Annual website maintenance in New Zealand costs roughly **$400–$1,500 a year** for a small brochure site you look after yourself, **$2,000–$4,000** for a typical business site on a maintenance plan, and **$6,000–$12,000+** for eCommerce or content-heavy sites with active support.",
      },
      {
        type: "p",
        text: "All figures NZD, excluding GST. A website is closer to a vehicle than a painting — the ongoing number is not optional, and leaving it out of the original decision is how people end up surprised. If you'd rather skip the arithmetic, [my own maintenance plans](/services/website-maintenance) are fixed monthly and priced against the ranges below.",
      },
      { type: "h2", text: "The line items, with real 2026 NZ ranges" },
      {
        type: "table",
        headers: ["Cost", "Typical NZ range", "Notes"],
        rows: [
          ["Domain (.co.nz or .nz)", "$25–$50/year", "Check what your registrar actually bills — some charge well above this"],
          ["Hosting", "$20–$100/month ($240–$1,200/yr)", "Shared at the low end, managed or cloud at the top"],
          ["SSL certificate", "$0", "Free via Let's Encrypt, included in essentially all modern hosting"],
          ["Premium plugin licences", "$200–$800/year", "WordPress mainly, and rarely mentioned at the point of sale"],
          ["Maintenance and updates", "$50–$300/month ($600–$3,600/yr)", "Updates, backups, security monitoring, minor edits"],
          ["Ad-hoc developer work", "$80–$150/hour", "Anything outside a retainer"],
          ["Content and SEO", "$500–$2,000/month", "Not maintenance — growth spend, budget it separately"],
        ],
        caption: "NZD, excluding GST.",
      },
      {
        type: "p",
        text: "These aren't estimates pulled from the air. NZ providers publishing 2026 pricing put hosting at [$20–$100 per month and maintenance at $50–$300 per month](https://www.lucidmedia.co.nz/blog/website-cost-new-zealand-2026-pricing-guide), domains at [around $25 a year](https://www.kiwiwebdesign.co.nz/affordable-web-design-auckland/website-cost-new-zealand-small-business/), and premium plugin licences at [$200–$800 a year](https://alpinestudio.co.nz/blog/website-cost-nz-2026/). Managed NZ hosting specifically tends to sit around $39–$99/month, which is the band quoted in [what a website costs in New Zealand](/blogs/website-cost-new-zealand-2026).",
      },
      {
        type: "p",
        text: "**One red line worth naming:** if a provider charges you separately for an SSL certificate in 2026, question it. Free certificates are standard and included nearly everywhere, and NZ studios say the same thing in their own pricing guides.",
      },
      { type: "h2", text: "Three realistic annual budgets" },
      {
        type: "p",
        text: "These are illustrative budgets assembled from the published ranges above — not invoices from named clients.",
      },
      { type: "h3", text: "A — Sole trader, 5-page brochure site, DIY upkeep" },
      {
        type: "table",
        headers: ["Item", "Annual"],
        rows: [
          ["Domain", "$35"],
          ["Hosting (shared, $25/mo)", "$300"],
          ["SSL", "$0"],
          ["Plugins", "$150"],
          ["Your own time (~1 hr/month)", "—"],
          ["Total", "~$485/year"],
        ],
      },
      {
        type: "p",
        text: "Viable if you are genuinely disciplined about updates and backups. Most people aren't, and the failure mode is silent — you find out when the site goes down or a browser starts flagging it as insecure.",
      },
      { type: "h3", text: "B — Established SME, 15-page site, provider on a plan" },
      {
        type: "table",
        headers: ["Item", "Annual"],
        rows: [
          ["Domain", "$40"],
          ["Managed hosting ($60/mo)", "$720"],
          ["Plugin licences", "$450"],
          ["Maintenance plan ($120/mo)", "$1,440"],
          ["Occasional developer work (~6 hrs)", "$700"],
          ["Total", "~$3,350/year"],
        ],
      },
      {
        type: "p",
        text: "This is the common band, and it matches the widely quoted NZ guidance of [$2,000–$4,000 per year](https://horntech.co.nz/blog/web-design-cost-nz-2026/) for hosting and maintenance on a standard business site.",
      },
      { type: "h3", text: "C — eCommerce or content-heavy" },
      {
        type: "table",
        headers: ["Item", "Annual"],
        rows: [
          ["Domain", "$40"],
          ["Cloud hosting ($150/mo)", "$1,800"],
          ["Platform and app fees", "$1,200–$4,800"],
          ["Plugin and app licences", "$800"],
          ["Support retainer ($400/mo)", "$4,800"],
          ["Total", "~$8,600–$12,200/year"],
        ],
      },
      {
        type: "p",
        text: "At this level maintenance stops being overhead and becomes operational cost, because every hour of downtime has a revenue number attached to it.",
      },
      { type: "h2", text: "What a maintenance plan should actually include" },
      {
        type: "p",
        text: "\"Maintenance\" means wildly different things to different providers. Get the inclusions in writing:",
      },
      {
        type: "list",
        items: [
          "**Core, theme and plugin updates** — monthly at minimum, applied to staging first",
          "**Off-site backups** — daily, retained 30+ days, stored somewhere other than the same server",
          "**A tested restore** — backups nobody has ever restored aren't backups. Ask when they last tested one.",
          "**Uptime monitoring** that alerts a human",
          "**Security scanning** and malware monitoring",
          "**SSL renewal** and expiry monitoring",
          "**Performance checks** — Core Web Vitals reviewed quarterly, not once at launch",
          "**A defined allowance of content changes** — stated in hours, not as \"minor updates\"",
          "**A response-time commitment**",
        ],
      },
      {
        type: "p",
        text: "A plan without a stated backup retention period and a stated response time is a hosting invoice wearing a maintenance label. Those two lines are the ones providers leave vague, and they're the two that matter at 9am on the day something breaks.",
      },
      { type: "h2", text: "Why WordPress costs more to maintain" },
      {
        type: "p",
        text: "Platform choice sets your maintenance bill more than any other decision you make — more than page count, more than design, more than who built it.",
      },
      {
        type: "p",
        text: "**WordPress** carries the highest burden. Every plugin is third-party code running on your site and a potential way in, and outdated plugins are the leading cause of compromised sites. The minimum monthly routine looks like this:",
      },
      {
        type: "code",
        lang: "text",
        code: `# Never update without a backup and a staging pass first
wp db export backups/pre-update-$(date +%F).sql
wp plugin list --update=available --format=table   # see what's changing before it changes
wp plugin update --all
wp core update
wp core verify-checksums                           # flags modified core files
wp cache flush`,
      },
      {
        type: "p",
        text: "Run it on staging, confirm the site still loads and the contact form still sends, then repeat on production. Skipping the staging pass is how a plugin update takes down a checkout on a Friday afternoon.",
      },
      {
        type: "p",
        text: "**Wix and hosted builders** carry near-zero maintenance. That's a genuine advantage and it's worth real money — you pay for it in the subscription and in the lack of portability.",
      },
      {
        type: "p",
        text: "**Custom builds** sit in between. Fewer moving parts, because you only install what you actually use, but dependencies still need updating. Automate the checking so upkeep becomes reviewing a pull request rather than remembering to look:",
      },
      {
        type: "code",
        lang: "text",
        code: `# .github/dependabot.yml — opens PRs for outdated dependencies, weekly
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 5`,
      },
      {
        type: "p",
        text: "The full platform comparison, including three-year cost of ownership, is in [WordPress vs Wix vs Custom](/blogs/wordpress-vs-wix-vs-custom-website).",
      },
      { type: "h2", text: "What actually happens when you skip maintenance" },
      {
        type: "p",
        text: "This isn't theoretical. It's a standard sequence, and it runs about eighteen months.",
      },
      {
        type: "list",
        items: [
          "**Months 1–6:** nothing visible. Updates queue up. Confidence grows that maintenance was a sales pitch after all.",
          "**Months 6–12:** small breakages. A form stops emailing. A gallery renders oddly on a new iOS version. Nobody notices, because nobody is monitoring, and enquiries quietly drop.",
          "**Months 12–18:** a plugin with a published vulnerability gets exploited, or a PHP upgrade breaks an outdated theme. The site goes down, starts serving spam links, or gets flagged as unsafe.",
          "**Recovery:** emergency work at hourly rates, restoration from whatever backup exists, and weeks of rebuilding search visibility if the site was blacklisted.",
        ],
      },
      {
        type: "p",
        text: "An emergency recovery routinely costs more than several years of a plan. That's the entire economic argument, and it's why every provider pushes retainers — they have all cleaned up the alternative.",
      },
      { type: "h2", text: "How to reduce the bill without creating risk" },
      {
        type: "list",
        items: [
          "**Cut the plugin count.** Every plugin removed is a licence saved and an entry point closed. Most WordPress sites can drop a third of theirs with no functional loss.",
          "**Match the platform to actual needs.** Running WordPress for a five-page brochure site means paying WordPress maintenance for functionality you never use.",
          "**Learn your own content edits.** Ask for a recorded CMS walkthrough at handover. Paying an hourly rate to change a phone number is entirely avoidable.",
          "**Pay annually where it's discounted.** Hosting is often 10–20% cheaper billed yearly.",
          "**Consolidate providers.** Three places means three renewal dates and three people to chase when something breaks.",
        ],
      },
      {
        type: "p",
        text: "What not to cut: backups, updates, and SSL. Those three are what turn a $300 problem into a $3,000 one.",
      },
      { type: "h2", text: "The budgeting rule of thumb" },
      {
        type: "p",
        text: "Set aside **15–20% of your original build cost per year**. An $8,000 site should have roughly $1,200–$1,600 behind it annually. It's the same principle as a maintenance reserve on any other business asset, and it's the number most people leave out when they're comparing build quotes.",
      },
      {
        type: "p",
        text: "Still at the build or rebuild stage? [Website redesign cost in New Zealand](/blogs/website-redesign-cost-new-zealand) covers the upfront side, including which line items cheap quotes leave out.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How much does website maintenance cost per year in NZ?" },
      {
        type: "p",
        text: "Around $400–$1,500 a year for a small self-managed brochure site, $2,000–$4,000 for a typical business site on a plan, and $6,000–$12,000+ for eCommerce or content-heavy sites. Hosting runs $20–$100 a month and maintenance plans $50–$300 a month, both excluding GST.",
      },
      { type: "h3", text: "What is included in a website maintenance plan?" },
      {
        type: "p",
        text: "A proper plan includes monthly updates applied via staging, daily off-site backups with tested restores, uptime monitoring, security scanning, SSL renewal, quarterly performance checks, a defined allowance of content edits stated in hours, and a committed response time. If the backup retention period and response time aren't written down, it isn't a maintenance plan.",
      },
      { type: "h3", text: "Do I really need a website maintenance plan?" },
      {
        type: "p",
        text: "On WordPress or any plugin-based platform, effectively yes — outdated plugins are the leading cause of compromised sites, and an emergency recovery typically costs more than several years of a plan. Hosted builders like Wix need far less, because the platform patches itself.",
      },
      { type: "h3", text: "How much does a .co.nz domain cost per year?" },
      {
        type: "p",
        text: "Usually $25–$50, though some providers charge considerably more. Check who the domain is registered to while you're looking — it should be in your business name, not your developer's.",
      },
      { type: "h3", text: "Should I pay for an SSL certificate separately?" },
      {
        type: "p",
        text: "No. Free certificates via Let's Encrypt are standard and included in essentially all modern hosting. A separate SSL line on a 2026 invoice is worth questioning, and NZ studios say so in their own published pricing.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Add up what you currently pay across hosting, domain, plugins and support, then compare it against the three budgets above. If you're paying band B money for band A service — no backups you've tested, no monitoring, no response time — that's the conversation to have with your provider this week.",
      },
      {
        type: "p",
        text: "Inherited a site nobody has touched in two years? Send me the URL and I'll tell you what state it's actually in: what's outdated, what's exposed, and what it would take to make it safe — and if you can't reach whoever built it, [taking over a website from another developer](/blogs/take-over-existing-website-developer) is the place to start. No charge for the look. [Get in touch](/contact), or see [my own maintenance plans](/services/website-maintenance) if you'd rather compare against a fixed monthly number.",
      },
    ],
  },
  {
    slug: "website-vs-social-media",
    title: "Website vs Social Media: Why You Need Both",
    excerpt:
      "Why a business website still beats relying on social alone — what you don't own on a platform, and what each channel is actually good at.",
    coverImage:
      "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-11",
    tags: ["Small Business", "Marketing", "Conversion"],
    content: [
      {
        type: "p",
        text: "\"I already have Instagram and a Facebook page — why do I need a website?\" It's a fair question. Social is free, everyone is already there, and a website costs money.",
      },
      {
        type: "p",
        text: "But the framing is a trap. It isn't either/or, and treating your social profiles as a replacement for a website is one of the riskier bets a small business can make — for one reason that has nothing to do with design or features.",
      },
      { type: "h2", text: "The core problem: you don't own your social media" },
      {
        type: "p",
        text: "On social media you are a tenant, not an owner. The platform owns the audience, the reach, and — in every practical sense — the content. That means three things:",
      },
      {
        type: "list",
        items: [
          "**The rules change overnight.** Reach algorithms shift constantly, and the audience you spent years building can be throttled to a fraction of your followers without warning and without recourse.",
          "**Accounts get suspended.** Sometimes by mistake, sometimes with no meaningful appeal, and every follower and post can go with it.",
          "**Platforms decline.** Audiences migrate and networks fade. If your entire presence lives on one, its decline is your decline.",
        ],
      },
      {
        type: "p",
        text: "Your website is the opposite: a domain, content and audience data you own outright. No algorithm decides who sees it and nobody can suspend it on a whim. Rented versus owned is the whole argument, and everything below is a consequence of it.",
      },
      { type: "h2", text: "What a website does that social can't" },
      { type: "h3", text: "It's your credibility check" },
      {
        type: "p",
        text: "People who find you on social routinely search for your website before they buy, specifically to confirm you're a real business. In 2026, no website reads the way no phone number would have read thirty years ago — not a deliberate choice, just a gap someone else's competitor doesn't have.",
      },
      { type: "h3", text: "It's built to convert, not to hold attention" },
      {
        type: "p",
        text: "Social feeds are designed to keep people on the platform, scrolling. That is the product. Your website is designed around your goals instead: one clear action per page, service pages, a booking flow, a checkout. It's the only sales tool in your stack that isn't optimised for somebody else's ad revenue.",
      },
      { type: "h3", text: "It's what shows up in a search" },
      {
        type: "p",
        text: "When somebody searches for your service and your town, a website can rank for it. Social profiles rarely surface for those searches, and when they do they don't present the offer the way a purpose-built page does. Search traffic is people actively looking to buy — the highest-intent audience you'll ever get, and social alone leaves you invisible to it.",
      },
      { type: "h3", text: "It's structured, and it keeps" },
      {
        type: "p",
        text: "A website holds service pages, prices, case studies, FAQs and a blog, organised so somebody researching you finds what they need. Social posts are ephemeral by design: a good post is buried within days, and there's no structure at all for a buyer doing homework before they call you.",
      },
      { type: "h2", text: "What social does that a website can't" },
      {
        type: "p",
        text: "This isn't an argument against social. It's an argument against relying on it alone, and the distinction matters because social is genuinely better than a website at several things:",
      },
      {
        type: "list",
        items: [
          "**Discovery** — it puts you in front of people who were never searching for you",
          "**Reach** — one post can travel further than a year of your website traffic",
          "**Real-time contact** — comments and DMs happen where people already are",
          "**Personality** — behind-the-scenes content builds trust that a services page can't",
          "**No build required** — you can start today, for nothing",
        ],
      },
      {
        type: "p",
        text: "Social is an excellent top-of-funnel engine. Its weakness is everything after the discovery, which is exactly where a website takes over.",
      },
      { type: "h2", text: "The setup that works: both, doing different jobs" },
      {
        type: "list",
        items: [
          "**Social attracts.** It's where people first come across you, through content, ads and shares.",
          "**The website converts.** You send that attention somewhere structured, credible and built around one action.",
          "**The website owns the relationship.** Email addresses and enquiries land somewhere a platform can't take away.",
        ],
      },
      {
        type: "p",
        text: "Social is the window on a busy street; the website is the shop. The window pulls people in, the shop is where business actually happens — and where you hold the keys. If the shop isn't converting the people the window sends, that's a separate and very fixable problem: [why your website isn't getting leads](/blogs/website-not-getting-leads) works through the nine usual causes.",
      },
      { type: "h2", text: "The test that settles it" },
      {
        type: "p",
        text: "Imagine your main platform banned your account tomorrow, or shut down entirely.",
      },
      {
        type: "list",
        items: [
          "**If your business survives** — because customers can still find you on Google, reach your site and contact you directly — you've built on ground you own.",
          "**If your business effectively disappears** with the account, you built on rented land, and the landlord just changed the locks.",
        ],
      },
      {
        type: "p",
        text: "Every business should be able to answer that the first way. A website is what makes the first answer possible, and it's the only thing that does.",
      },
      { type: "h2", text: "\"But I'm just a small local business\"" },
      {
        type: "p",
        text: "Small and local is where a website earns its keep fastest. Local customers search constantly — a service and a suburb, \"open now\", \"near me\" — and those searches go to websites, not profiles.",
      },
      {
        type: "p",
        text: "It doesn't need to be expensive. It needs to exist, load fast on a phone, and say what you do, where you work and how to reach you. A focused five-page site does that, and it keeps doing it while you sleep. What that costs is set out on the [services page](/services) — and if you're weighing it against a rebuild, [does your website need a developer or just a few fixes](/blogs/does-my-website-need-a-developer) is the honest version of that question.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Do I need a website if I have social media?" },
      {
        type: "p",
        text: "Yes, because they do different jobs. Social is where people discover you; a website is where they check you're real, find what they need, and get in touch. It's also the only part of your online presence you own — a suspended account or an algorithm change can't take it away.",
      },
      { type: "h3", text: "Can a Facebook page replace a business website?" },
      {
        type: "p",
        text: "Not safely. A Facebook page can't rank properly for the searches that produce buyers, can't be structured around your services, and can be restricted or removed by a platform whose decisions you have no say in. It's a good front door and a poor foundation.",
      },
      { type: "h3", text: "Is social media better than a website for getting customers?" },
      {
        type: "p",
        text: "Better at discovery, worse at conversion. Social puts you in front of people who weren't looking for you; a website converts people who were. Businesses that do well run both and send the traffic one way — social to site, not the reverse.",
      },
      { type: "h3", text: "What happens to my customers if my social account is banned?" },
      {
        type: "p",
        text: "If your only presence is that account, they lose the ability to find you and you lose the ability to contact them. If you've been sending people to a website and collecting enquiries or emails there, you still have both. That's the practical reason the ownership argument matters.",
      },
      { type: "h3", text: "How much of my marketing should be website versus social?" },
      {
        type: "p",
        text: "Treat them as sequential rather than competing. Social does the reaching, the website does the converting, and the split of your effort follows whichever is currently the weaker link. Plenty of traffic and no enquiries is a website problem; a good website nobody visits is a social and search problem.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "If you're running on social alone, the first version doesn't have to be ambitious. A handful of pages that load fast, say what you do, and give people a way to contact you will outperform a profile for every buyer who was actually ready to spend.",
      },
      {
        type: "p",
        text: "If you'd like to know what that would take for your business — or whether you need one at all yet — [get in touch](/contact), and you can see what I build on the [projects page](/projects).",
      },
    ],
  },
  {
    slug: "business-website-cost-2026",
    title: "How Much Does a Business Website Cost in 2026?",
    excerpt:
      "A 2026 breakdown of business website costs in USD — templates, custom builds and web apps — with real price bands and what actually drives the number.",
    coverImage:
      "https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-11",
    tags: ["Website Cost", "Small Business", "Hiring"],
    content: [
      {
        type: "p",
        text: "The honest answer is anywhere from $0 to $150,000+. That range is useless to you, so this breaks the cost into tiers you can map to your own situation — with real numbers, what sits behind each price, and where people quietly overpay.",
      },
      {
        type: "p",
        text: "Figures here are USD and describe the international market. If you're buying in New Zealand, [what a website costs in New Zealand](/blogs/website-cost-new-zealand-2026) has the local numbers in NZD excluding GST, and my own fixed prices are on the [services page](/services) — they sit below the market bands below, because a solo developer carries none of the overhead those bands are averaging.",
      },
      { type: "h2", text: "The short answer: five price tiers" },
      {
        type: "table",
        headers: ["Tier", "Typical 2026 cost", "Who it's for"],
        rows: [
          ["DIY builder (Wix, Squarespace)", "$0–$500/yr", "Solo founders testing an idea"],
          ["Template + customisation", "$500–$3,000", "Small businesses that need to look credible fast"],
          ["Semi-custom (freelancer)", "$3,000–$12,000", "Established SMBs wanting a distinct, fast site"],
          ["Fully custom (freelancer or studio)", "$12,000–$40,000", "Brands with specific UX, integrations or content needs"],
          ["Custom web application", "$30,000–$150,000+", "Businesses where the site is the product"],
        ],
        caption: "USD, international market rates.",
      },
      {
        type: "p",
        text: "Most small-to-mid businesses land in the **$3,000–$12,000** band, and that's the tier worth the most attention, because it's where the \"cheap versus worth it\" decision actually gets made.",
      },
      { type: "h2", text: "What you're actually paying for" },
      {
        type: "p",
        text: "Price isn't driven by page count. It's driven by four things:",
      },
      {
        type: "list",
        items: [
          "**Design originality** — a template costs a tenth of a bespoke design, because somebody already did the hard part.",
          "**Custom functionality** — booking systems, member logins, dashboards and integrations are where the hours pile up.",
          "**Content** — copywriting, photography and structured data are often the hidden half of a budget.",
          "**Who does the work** — a solo senior developer, a small studio and a forty-person agency price the same site very differently.",
        ],
      },
      {
        type: "p",
        text: "Keep those four in mind and every quote you receive suddenly makes sense.",
      },
      { type: "h2", text: "Tier 1: DIY website builders — $0 to $500 a year" },
      {
        type: "p",
        text: "Wix, Squarespace, Framer and Shopify let you ship a site with no developer. In 2026 a polished Squarespace business site runs roughly **$16–$49 a month**, plus a domain at $12–$20 a year.",
      },
      {
        type: "p",
        text: "**When it's the right call:** you're validating an idea, you have more time than money, and the site is a brochure rather than a machine.",
      },
      {
        type: "p",
        text: "**The catch:** you own the content, not the platform. Performance, SEO control and custom behaviour are capped by what the builder allows. Businesses routinely outgrow this tier within 12–24 months and pay again to migrate off it — so if you already know you'll need custom features, skipping this tier saves you a rebuild. The trade-offs in full are in [WordPress vs Wix vs Custom](/blogs/wordpress-vs-wix-vs-custom-website).",
      },
      { type: "h2", text: "Tier 2: Template plus customisation — $500 to $3,000" },
      {
        type: "p",
        text: "Here a developer or designer takes a premium theme — WordPress, Webflow, Shopify — and adapts it to your brand: your colours, your copy, your logo, a few layout changes. You get something that looks intentional without paying for original design.",
      },
      {
        type: "p",
        text: "What drives the price up inside this tier is custom copy, professional photos, and any plugin that touches payments or bookings. A five-page WordPress site on a customised theme with your own content is a solid **$1,500–$3,000** job in 2026.",
      },
      {
        type: "p",
        text: "**The honest trade-off:** template sites can look seen-before, and heavy plugin stacks get slow and fragile over time. Budget for maintenance from the start — [annual website maintenance costs](/blogs/annual-website-maintenance-costs-nz) covers what that actually runs to.",
      },
      { type: "h2", text: "Tier 3: Semi-custom sites — $3,000 to $12,000" },
      {
        type: "p",
        text: "This is the band most established small and mid-sized businesses should be in. You get a custom design built to your brand, hand-coded or built on a modern stack, fast load times, real SEO structure, and one or two genuinely custom features — a booking flow, a filterable portfolio, a lightweight CRM hook.",
      },
      {
        type: "p",
        text: "What the money buys that Tier 2 doesn't:",
      },
      {
        type: "list",
        items: [
          "A design nobody else has",
          "Performance that passes Core Web Vitals, which affects both conversion and ranking",
          "Clean, accessible, maintainable code you actually own",
          "Direct access to the person building it, with no account manager in the middle",
        ],
      },
      {
        type: "p",
        text: "A realistic 2026 range: a **7–12 page semi-custom marketing site with one or two custom features lands around $4,000–$9,000**. Add e-commerce or a login area and you move toward the top of the band.",
      },
      { type: "h2", text: "Tier 4: Fully custom sites — $12,000 to $40,000" },
      {
        type: "p",
        text: "At this tier everything is bespoke: a custom design system, custom animation, complex content architecture, multiple integrations across CRM, email, analytics and payments, and often a headless CMS so your team edits content without touching code.",
      },
      {
        type: "p",
        text: "**Who needs it:** brands where the website is a primary sales and credibility engine, businesses with large or frequently changing content, and companies with specific compliance or accessibility requirements.",
      },
      {
        type: "p",
        text: "This is where agency and freelancer pricing diverge most. A mid-size agency might quote **$35,000–$60,000** for the same scope a senior solo developer or small studio delivers for **$15,000–$30,000** — largely because you're paying for overhead rather than extra quality. That isn't a knock on agencies; it's just what you're buying.",
      },
      { type: "h2", text: "Tier 5: Custom web applications — $30,000 to $150,000+" },
      {
        type: "p",
        text: "When your \"website\" is really software — a customer portal, a booking-and-payments platform, a dashboard, a SaaS product — you've crossed from website into application, and pricing changes entirely. There's a full breakdown in [custom web application cost](/blogs/custom-web-application-cost).",
      },
      {
        type: "p",
        text: "Ballpark: a focused MVP runs **$30,000–$70,000**, and a production-grade multi-user platform with auth, roles, billing and integrations runs **$80,000–$150,000+**. The variable isn't design — it's the number of user flows, the data complexity, and how much has to be genuinely custom rather than assembled from existing services.",
      },
      { type: "h2", text: "The costs nobody quotes you upfront" },
      {
        type: "p",
        text: "The build is a one-time number. The site is an ongoing one. Budget for:",
      },
      {
        type: "list",
        items: [
          "**Domain** — around $12–$20 a year",
          "**Hosting** — $0–$20 a month for a marketing site on Vercel, Netlify or managed WordPress; more for applications",
          "**SSL certificate** — usually free via Let's Encrypt, and normally bundled",
          "**Maintenance** — $50–$500 a month depending on complexity: updates, security patches, backups, small changes",
          "**Content updates** — either your time or a retainer",
        ],
      },
      {
        type: "p",
        text: "The common mistake is spending $8,000 on a good site and then letting it rot because nobody budgeted the $100 a month to keep it healthy. Plan for the second year on day one.",
      },
      { type: "h2", text: "Freelancer vs agency vs DIY" },
      {
        type: "list",
        items: [
          "**DIY builder** — cheapest upfront, most expensive in your time, hardest to scale",
          "**Agency** — most process and hand-holding, highest price, slowest, and you rarely talk to whoever is actually building",
          "**Solo senior developer or small studio** — direct communication, comparable output, roughly half the price, with the trade-off that you're working with one person's bandwidth",
        ],
      },
      {
        type: "p",
        text: "For most SMBs the solo route hits the best value-to-quality ratio, provided the developer is genuinely senior and communicates well. Verifying that is its own job — [how to choose a web development company](/blogs/how-to-choose-a-web-development-company) is the checklist.",
      },
      { type: "h2", text: "How to set your budget" },
      {
        type: "list",
        items: [
          "**Decide what the site must do** — brochure, lead generation, e-commerce or application. That picks your tier.",
          "**Count the custom features.** Each real feature — booking, login, payments, dashboard — adds cost. Static pages barely do.",
          "**Add 15–20% for content and photography** if you don't already have it.",
          "**Add year-one running costs** — hosting plus maintenance.",
          "**Get two or three quotes** and compare scope, not price. A $4,000 quote and a $9,000 quote are usually building two different things.",
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How much does a small business website cost in 2026?" },
      {
        type: "p",
        text: "Most small businesses pay $3,000–$12,000 for a well-built semi-custom site, plus a few hundred dollars a year to run it. Template work sits at $500–$3,000, and DIY builders run $0–$500 a year. Below $500 you're buying a template with no copywriting and no tracking.",
      },
      { type: "h3", text: "Why do website quotes vary so much for the same brief?" },
      {
        type: "p",
        text: "Four things move the number: how original the design is, how much custom functionality is involved, who writes the content, and who does the work. A forty-person agency and a solo senior developer price identical scope very differently, and most of that gap is overhead rather than quality.",
      },
      { type: "h3", text: "Is a cheap website worth it?" },
      {
        type: "p",
        text: "It is if your site is genuinely a brochure and you know that's all you need. It isn't if you'll need custom features within a year, because you'll pay twice — once for the cheap build and again for the migration off it. Buy the tier your goals need, not the one a salesperson talks you into.",
      },
      { type: "h3", text: "What ongoing costs should I expect after launch?" },
      {
        type: "p",
        text: "A domain at $12–$20 a year, hosting from nothing to $20 a month for a marketing site, and maintenance at $50–$500 a month depending on complexity. SSL should be free. Budget roughly 15–20% of the build cost annually and you won't be caught out.",
      },
      { type: "h3", text: "Should I hire a freelancer or an agency?" },
      {
        type: "p",
        text: "A senior freelancer or small studio for most business sites and focused applications; an agency when you genuinely need brand strategy, multi-channel campaigns or team depth. The freelancer route trades capacity for cost and directness, not quality.",
      },
      { type: "h2", text: "The bottom line" },
      {
        type: "p",
        text: "In 2026 a credible small business website costs most companies **$3,000–$12,000** to build well, plus a few hundred a year to run. Go cheaper only if the site is genuinely just a brochure; go more custom only when a real feature or brand requirement demands it.",
      },
      {
        type: "p",
        text: "If you want a straight answer on which tier fits your business and a fixed-scope, fixed-price quote, [get in touch](/contact) — and you can see what the work looks like on the [projects page](/projects).",
      },
    ],
  },
  {
    slug: "signs-your-business-needs-a-new-website",
    title: "10 Signs Your Business Needs a New Website",
    excerpt:
      "Ten signs your business needs a new website in 2026 — from slow load times to mobile failures — each with a test you can run yourself in ten minutes.",
    coverImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-11",
    tags: ["Small Business", "Core Web Vitals", "Website Redesign"],
    content: [
      {
        type: "p",
        text: "Most businesses keep a website years past its expiry date — not because it's working, but because replacing it feels like a hassle. Meanwhile a dated site quietly costs leads, ranking and credibility every day.",
      },
      {
        type: "p",
        text: "Here are ten signs, each with a plain test you can run yourself in the next ten minutes. Nearly every rebuild client hits three or more before they call. Four or more and it's time.",
      },
      { type: "h2", text: "1. It's slow to load" },
      {
        type: "p",
        text: "Speed is the single biggest silent conversion killer. Users expect a page to be usable in **under 2.5 seconds**, every extra second measurably increases bounce rate, and Google uses Core Web Vitals as a ranking signal.",
      },
      {
        type: "p",
        text: "**Test it yourself:** run your homepage through [PageSpeed Insights](https://pagespeed.web.dev/). A mobile score below 50, or a Largest Contentful Paint over 2.5 seconds, is a sign — and usually a symptom of a bloated theme or unoptimised images. [Why your website is slow](/blogs/why-is-my-website-slow) covers the usual causes.",
      },
      { type: "h2", text: "2. It doesn't work properly on mobile" },
      {
        type: "p",
        text: "More than half of web traffic is mobile, and Google indexes the mobile version of your site first. If yours was built before responsive design was standard — or was only ever checked on a desktop — it's failing the majority of your visitors.",
      },
      {
        type: "p",
        text: "**Test it yourself:** open the site on your phone. Do you have to pinch-zoom? Do buttons sit too close together? Does the menu break? Any yes means you're losing mobile customers before they read a word.",
      },
      { type: "h2", text: "3. It looks like it was built a decade ago" },
      {
        type: "p",
        text: "Design dates faster than content. Tiny text, cramped layouts, stock photos everyone has seen, gradients and bevels from a past era — these make visitors quietly question whether your business is current. Design is a proxy for trust.",
      },
      {
        type: "p",
        text: "**Test it yourself:** put your homepage next to your two best competitors. If yours looks like the oldest of the three, prospects are making the same comparison and drawing conclusions from it.",
      },
      { type: "h2", text: "4. It's not bringing in leads or sales" },
      {
        type: "p",
        text: "A website has a job. If yours gets traffic but no calls, form fills or purchases, it's a brochure that doesn't sell. The usual culprits are no clear call to action, buried contact details, weak landing pages, and no trust signals at all.",
      },
      {
        type: "p",
        text: "**Test it yourself:** can a first-time visitor tell what you do, why you're credible, and how to contact you — in under ten seconds, without scrolling? If not, no ad budget will fix it. [Why your website isn't getting leads](/blogs/website-not-getting-leads) works through the nine causes in order.",
      },
      { type: "h2", text: "5. You can't update it yourself" },
      {
        type: "p",
        text: "If changing a phone number or adding a post means emailing a developer and waiting three days, the site is a liability. Modern builds ship with a CMS your team can edit safely without touching code.",
      },
      {
        type: "p",
        text: "**Test it yourself:** try to update one piece of text right now. If you can't, or you're afraid you'll break something, you've outgrown the current build.",
      },
      { type: "h2", text: "6. It isn't secure" },
      {
        type: "p",
        text: "If the address bar says \"Not Secure\", you're actively repelling customers and being penalised by Google. HTTPS has been the baseline for years, and its absence signals neglect of everything else too.",
      },
      {
        type: "p",
        text: "**Test it yourself:** look at your URL. Does it start with https and show a padlock? No padlock is an immediate red flag, especially if you collect any form data at all.",
      },
      { type: "h2", text: "7. Bounce rate is high and time on site is low" },
      {
        type: "p",
        text: "If analytics show most visitors leaving within seconds, the site is making a bad first impression through speed, confusion or irrelevance. People arrive, don't find what they expected, and go.",
      },
      {
        type: "p",
        text: "**Test it yourself:** check your analytics. A bounce rate consistently above roughly 70% on key pages, paired with average sessions under 30 seconds, says the site isn't holding attention long enough to convert anyone.",
      },
      { type: "h2", text: "8. It doesn't reflect what your business does now" },
      {
        type: "p",
        text: "Businesses evolve and websites often don't. If yours still pushes a service you've dropped, omits your best new offering, or targets a market you've moved past, it's misdirecting the exact prospects you want.",
      },
      {
        type: "p",
        text: "**Test it yourself:** read your homepage as a stranger. Does it describe the business you run today, or the one you ran three years ago? A mismatch confuses visitors and search engines equally.",
      },
      { type: "h2", text: "9. It's a nightmare to maintain" },
      {
        type: "p",
        text: "Sites built on sprawling plugin stacks and abandoned themes decay. Plugins conflict, updates break layouts, and every fix risks a new bug. If your developer sighs whenever you request a change, the build is the problem — not the request.",
      },
      {
        type: "p",
        text: "**Test it yourself:** how often does something break on its own — a form stops sending, a layout shifts, a page 404s? Recurring breakage means the foundation is unstable, and patching costs more over time than rebuilding clean.",
      },
      { type: "h2", text: "10. It's invisible on Google" },
      {
        type: "p",
        text: "If you don't appear when people search your service and your city, the site isn't doing SEO's basic job. Older sites frequently lack the technical foundations search engines now expect: clean semantic structure, fast performance, structured data, proper meta tags and a logical internal link map.",
      },
      {
        type: "p",
        text: "**Test it yourself:** search your service plus your city in an incognito window. Nowhere on page one while competitors are? That's foundational, not a plugin you can bolt on — and [why your website doesn't show up on Google](/blogs/why-website-not-showing-on-google) explains what to check first.",
      },
      { type: "h2", text: "Redesign or rebuild? How to tell" },
      {
        type: "p",
        text: "Not every failing site needs to be torn down. The rule of thumb:",
      },
      {
        type: "list",
        items: [
          "**A redesign** — a new look on the same foundation — makes sense if the site is only dated visually but is fast, secure, mobile-friendly and editable.",
          "**A rebuild** — a new foundation — is right when the problems are structural: slow, insecure, unmaintainable, or built on a stack that can't support what you need next.",
        ],
      },
      {
        type: "p",
        text: "Most sites hitting four or more of the signs above need a rebuild, because the issues live in the foundation rather than the paint. Spending redesign money on a broken foundation just buys a prettier version of the same problems. [Does your website need a developer or just a few fixes](/blogs/does-my-website-need-a-developer) takes that decision apart properly, and [website redesign cost in New Zealand](/blogs/website-redesign-cost-new-zealand) has the numbers.",
      },
      { type: "h2", text: "What a modern rebuild fixes at once" },
      {
        type: "list",
        items: [
          "**Fast by default** — modern frameworks and optimised assets hit Core Web Vitals without heroics",
          "**Mobile-first** — designed for the phone, scaled up to desktop",
          "**Secure** — HTTPS, current dependencies, no abandoned plugins",
          "**Editable** — a CMS your team can actually use",
          "**Findable** — semantic HTML, structured data and SEO structure built in from the start",
        ],
      },
      {
        type: "p",
        text: "The point isn't chasing trends. It's building on a foundation that won't hit these same ten signs again in two years.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How do I know if my business needs a new website?" },
      {
        type: "p",
        text: "Run the ten tests above. One or two signs is a repair job; four or more usually means the problems are structural and a rebuild is cheaper than patching. Speed, mobile and security failures matter more than how dated the design looks.",
      },
      { type: "h3", text: "How often should a business website be redesigned?" },
      {
        type: "p",
        text: "There's no fixed interval, and age alone isn't a reason. A fast, secure, editable site that still describes your current business can run for years. Rebuild when the foundation stops supporting what you need, not on a schedule.",
      },
      { type: "h3", text: "Is a slow website really losing me customers?" },
      {
        type: "p",
        text: "Yes. Google treats a Largest Contentful Paint under 2.5 seconds as the good threshold, and every extra second measurably raises bounce rate on mobile. Visitors leaving before the page renders never read your copy or see your call to action.",
      },
      { type: "h3", text: "Should I redesign or rebuild my website?" },
      {
        type: "p",
        text: "Redesign if the site is only dated visually but is fast, secure, mobile-friendly and editable. Rebuild when the problems are structural — performance you can't fix, a platform you can't secure, or a stack that can't support what's next.",
      },
      { type: "h3", text: "What does it cost to replace a business website?" },
      {
        type: "p",
        text: "Most small businesses land between $3,000 and $12,000 for a well-built replacement, depending on how custom the design is and how much functionality is involved. A light refresh on a sound foundation costs considerably less.",
      },
      { type: "h2", text: "The bottom line" },
      {
        type: "p",
        text: "Your website is often the first and sometimes only impression a prospect gets. If it's slow, dated, insecure, invisible or not converting, it isn't a neutral asset — it's a leak. Four or more red flags means the site is costing you more than a rebuild would.",
      },
      {
        type: "p",
        text: "If you want an honest assessment of whether yours needs a redesign or a full rebuild, [send me the URL](/contact) and I'll tell you straight — including when the answer is neither.",
      },
    ],
  },
  {
    slug: "how-to-choose-a-web-development-company",
    title: "How to Choose a Web Development Company",
    excerpt:
      "How to choose a web development company that won't waste your budget — the questions that reveal quality, the red flags, and freelancer vs studio vs agency.",
    coverImage:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-11",
    tags: ["Hiring a Developer", "Small Business", "Web Development"],
    content: [
      {
        type: "p",
        text: "Choosing the wrong web development company costs you twice: once in wasted budget, and again in the rebuild you'll pay somebody else to do. Most businesses pick on price or a slick pitch, then find out too late that the code is a mess or the developer has vanished.",
      },
      {
        type: "p",
        text: "This is the practical process — the questions to ask, the red flags to spot, and how to decide between a freelancer, a studio and a large agency. I'm on the other side of these conversations constantly, so this includes the parts most vendors would rather you didn't ask about.",
      },
      { type: "h2", text: "First, get clear on what you actually need" },
      {
        type: "p",
        text: "Before you talk to anyone, write down three things. This alone filters out half your bad-fit vendors:",
      },
      {
        type: "list",
        items: [
          "**The goal.** A brochure site, a lead-generation machine, an e-commerce store or a web application — each needs a different kind of builder.",
          "**The budget range.** Even a rough band lets vendors self-select. Vagueness here invites padded quotes.",
          "**The timeline and your involvement.** Do you need it in six weeks? Will you supply content, or do you need that written too?",
        ],
      },
      {
        type: "p",
        text: "A vendor's first questions back to you are a signal in themselves. Good ones dig into your goals and your users before quoting. Bad ones quote a number before understanding the job.",
      },
      { type: "h2", text: "The questions that actually reveal quality" },
      {
        type: "p",
        text: "Anyone can say they're good. These surface whether they are:",
      },
      {
        type: "list",
        items: [
          "**\"Can I see three live sites you built, and speak to those clients?\"** Live sites, not mockups. One real reference call tells you more than any portfolio page.",
          "**\"Who specifically will write my code?\"** At agencies the person who sells is rarely the person who builds. Know who's doing the work and how senior they are.",
          "**\"What's your stack, and why?\"** You don't need to follow the answer fully, but a good developer can explain their choices in plain language. Evasiveness is a flag.",
          "**\"Will I own the code and all the accounts?\"** The correct answer is an immediate, unambiguous yes.",
          "**\"What happens after launch?\"** Maintenance, bug fixes and support should be defined before you sign, not improvised afterwards.",
          "**\"How do you handle changes to scope?\"** A clear change process protects both sides. \"We'll figure it out\" protects neither.",
        ],
      },
      {
        type: "p",
        text: "Take notes on how they answer, not only what they answer. Confidence backed by specifics is what you want; vague reassurance is what you're screening out.",
      },
      { type: "h2", text: "Red flags to walk away from" },
      {
        type: "list",
        items: [
          "**A price with no scope.** \"$2,000 for a website\" means nothing without page count, features and content. Cheap-and-vague becomes expensive-and-disappointing.",
          "**No portfolio of live, working sites.** If they can't show real work at real URLs, there's a reason.",
          "**They won't let you own your code, domain or hosting.** Some vendors lock clients in by keeping ownership hostage. This one is non-negotiable.",
          "**A guaranteed #1 Google ranking.** Nobody can promise this. Anyone who does is either lying or about to use tactics that get you penalised.",
          "**Poor communication before you've paid.** If they're slow or dismissive during the sales phase, when they should be at their most attentive, it only gets worse later.",
          "**No contract, or a vague one.** Scope, price, timeline, ownership and support all have to be in writing.",
        ],
      },
      { type: "h2", text: "The ownership question, in detail" },
      {
        type: "p",
        text: "This deserves its own section because it's where businesses get trapped. When the project ends, you should walk away owning:",
      },
      {
        type: "list",
        items: [
          "**Your domain name** — registered in your account, not the vendor's",
          "**Your hosting** — or at minimum full admin access and the ability to migrate",
          "**Your source code** — the actual files, handed over, with no licence that lets anyone revoke your site",
          "**Your content and assets** — copy, images, everything",
        ],
      },
      {
        type: "p",
        text: "A vendor who resists any of these is building a dependency rather than a website. A good developer wants you to own your work, because it means the relationship continues by choice instead of by lock-in.",
      },
      { type: "h2", text: "Freelancer vs studio vs agency" },
      {
        type: "p",
        text: "There's no universally best option — only the right fit for your project size and how much hand-holding you want.",
      },
      { type: "h3", text: "Solo freelancer or senior developer" },
      {
        type: "p",
        text: "**Best for** small-to-mid business sites, semi-custom to custom builds, and anyone who values talking directly to whoever is building. **Pros:** direct communication, roughly half an agency's price for the same output, fast decisions. **Cons:** one person's bandwidth — check they're genuinely senior and reliable rather than simply cheap.",
      },
      { type: "h3", text: "Small studio of two to eight people" },
      {
        type: "p",
        text: "**Best for** projects needing a mix of design, development and content with more capacity than a solo. **Pros:** broader skillset, some redundancy, still relatively direct. **Cons:** higher cost than a solo, and quality varies widely between studios.",
      },
      { type: "h3", text: "Large agency" },
      {
        type: "p",
        text: "**Best for** enterprise projects, complex applications, and companies that need heavy process and account management. **Pros:** deep bench, formal process, can absorb very large scope. **Cons:** most expensive by a wide margin, slowest, and you rarely deal with your developers directly.",
      },
      {
        type: "p",
        text: "For most small and mid-sized businesses a senior solo developer or small studio delivers comparable work at a fraction of the price, with capacity rather than quality as the trade-off. Verifying seniority is what the questions above are for.",
      },
      { type: "h2", text: "How to compare quotes fairly" },
      {
        type: "p",
        text: "When two quotes differ by thousands, they're almost never quoting the same thing. Compare on:",
      },
      {
        type: "list",
        items: [
          "**Scope** — exact pages, features and integrations included",
          "**Content** — is copywriting and imagery included, or yours to supply?",
          "**Revisions** — how many rounds before extra charges apply",
          "**Timeline** — a realistic date, with milestones",
          "**Post-launch** — what support is included and what costs extra",
          "**Ownership** — confirmed in writing",
        ],
      },
      {
        type: "p",
        text: "Line them up side by side and the expensive quote often turns out to be the complete one, while the cheap quote quietly excludes half the work. Judge total value, not the headline number — [what a business website costs](/blogs/business-website-cost-2026) sets out what each band should actually buy.",
      },
      { type: "h2", text: "Test them with a small first step" },
      {
        type: "p",
        text: "If you're unsure, reduce the risk: start with a paid discovery session, a small landing page or a single-page prototype before committing to the full build. It costs little and tells you everything about how they communicate, how they work, and whether the output matches the pitch.",
      },
      {
        type: "p",
        text: "A good developer will welcome that. A bad one will push to lock in the whole project immediately.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "What should I ask a web development company before hiring?" },
      {
        type: "p",
        text: "Ask for three live sites and a reference call, who specifically writes the code, what stack they use and why, whether you own the code and accounts, what happens after launch, and how scope changes are handled. How they answer matters as much as what they say.",
      },
      { type: "h3", text: "How do I know if a web developer is trustworthy?" },
      {
        type: "p",
        text: "Check live work rather than portfolio images, phone a past client and ask what went wrong and how it was handled, and confirm ownership terms in writing before signing. Trustworthy vendors put scope and ownership in a contract without being pushed.",
      },
      { type: "h3", text: "Is a freelancer or an agency better for a website?" },
      {
        type: "p",
        text: "A senior freelancer or small studio suits most business sites and focused applications, at roughly half agency pricing with direct access to the builder. An agency earns its premium on enterprise scope, heavy process needs, or when you need several specialists working in parallel.",
      },
      { type: "h3", text: "Who owns the website when a developer builds it?" },
      {
        type: "p",
        text: "You should — domain registered in your name, full hosting access, the source code handed over, and all content and assets. Any vendor who resists is building lock-in, and that's the single most common way businesses get trapped.",
      },
      { type: "h3", text: "Why do two website quotes for the same brief differ so much?" },
      {
        type: "p",
        text: "Because they're rarely quoting the same work. Differences hide in who writes the content, how many unique templates are built, how many revision rounds are included, and whether post-launch support and redirect mapping are in scope at all.",
      },
      { type: "h2", text: "The bottom line" },
      {
        type: "p",
        text: "It comes down to three things: **clarity** — do they understand your goal before quoting? **Proof** — can they show real, live work and references? And **ownership** — do you walk away owning everything? Price matters, but it's the last filter rather than the first.",
      },
      {
        type: "p",
        text: "If you'd like to see live work, ask the hard questions and get a fixed-scope quote with ownership in writing, [start with a call](/contact) and judge for yourself — or look through the [projects page](/projects) first.",
      },
    ],
  },
  {
    slug: "custom-web-application-cost",
    title: "How Much Does a Custom Web Application Cost?",
    excerpt:
      "What a custom web application costs in 2026 — MVP to production ranges, the six factors that drive the price, and how to avoid overbuilding your first version.",
    coverImage:
      "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-11",
    tags: ["Web App Cost", "MERN", "Hiring"],
    content: [
      {
        type: "p",
        text: "A custom web application in 2026 typically costs between **$30,000 and $150,000+** — but that range hides more than it reveals. A focused MVP and a full production platform can both be called \"a web app\" while costing wildly different amounts.",
      },
      {
        type: "p",
        text: "This breaks the number down by what actually drives it, so you can estimate your own project and avoid the two classic mistakes: underbudgeting, and overbuilding. Figures are USD international market rates; my own fixed prices are on the [services page](/services), and [how much a custom web app costs](/blogs/custom-web-app-cost-2026) covers how I quote smaller, tightly scoped builds.",
      },
      { type: "h2", text: "Website vs web application: why the price jumps" },
      {
        type: "p",
        text: "A **website** presents information — pages, images, a contact form. A **web application** does work: users log in, data changes, actions have consequences. Dashboards, booking-and-payment platforms, customer portals, internal tools, SaaS products.",
      },
      {
        type: "p",
        text: "That difference explains the jump. A marketing site might have a dozen static pages. An application has **user flows** — sequences of screens and logic where somebody does something, and where every edge case has to be handled. What if the payment fails? What if two users edit the same record? Each flow is a small piece of software, and cost tracks the number and complexity of those flows rather than the number of pages.",
      },
      { type: "h2", text: "The 2026 cost tiers" },
      {
        type: "table",
        headers: ["Tier", "Typical cost", "What it is"],
        rows: [
          ["Prototype / clickable MVP", "$8,000–$25,000", "Proves the concept; limited real functionality"],
          ["Functional MVP", "$30,000–$70,000", "A real, usable product with core features"],
          ["Production platform", "$80,000–$150,000", "Multi-user, roles, billing, integrations, at scale"],
          ["Enterprise or complex SaaS", "$150,000+", "Heavy compliance, high scale, deep integrations"],
        ],
        caption: "USD, international market rates.",
      },
      {
        type: "p",
        text: "Most first-time app builders should be aiming at the **functional MVP** tier — enough to launch, learn and earn, without paying to build features nobody has validated yet.",
      },
      { type: "h2", text: "What drives the price" },
      {
        type: "p",
        text: "Six factors account for nearly all the variation in a web app quote.",
      },
      { type: "h3", text: "1. Number and complexity of user flows" },
      {
        type: "p",
        text: "The single biggest driver. A tool with one main flow — submit, review, approve — is a fraction of the cost of one with ten interconnected flows. When you scope your app, count the distinct things a user can do. That's your complexity map.",
      },
      { type: "h3", text: "2. Accounts, roles and permissions" },
      {
        type: "p",
        text: "The moment you have logins you have authentication, password resets and security to handle. Add roles — admin, member, viewer — and permission logic, and you've added real engineering. A single-user tool is far cheaper than a multi-role platform, and the [hospital management system](/projects/hospital-management-system) case study is what that difference looks like in practice.",
      },
      { type: "h3", text: "3. Data complexity" },
      {
        type: "p",
        text: "How much data, how structured, and how interrelated? An app storing a few record types is straightforward. One modelling inventory tied to orders tied to customers tied to invoices needs careful database design — time-consuming to get right and expensive to fix later.",
      },
      { type: "h3", text: "4. Integrations" },
      {
        type: "p",
        text: "Every external service you connect — payment processors, email, CRMs, mapping, third-party APIs — is additional work. Not just wiring it up, but handling failures, syncing state and staying inside their limits. Three integrations add meaningfully to a build.",
      },
      { type: "h3", text: "5. Design and UX" },
      {
        type: "p",
        text: "An internal tool can look plain. A customer-facing SaaS needs a polished, intuitive interface, which means design work, custom components and iteration. The more your users expect a refined experience, the more design costs.",
      },
      { type: "h3", text: "6. Non-functional requirements" },
      {
        type: "p",
        text: "The invisible expensive part: security hardening, performance at scale, accessibility, automated testing, and compliance where it applies. None of it adds a visible feature, and all of it is what separates a demo from a product people will trust with real data and money.",
      },
      { type: "h2", text: "Where the budget actually goes" },
      {
        type: "table",
        headers: ["Phase", "Share of budget"],
        rows: [
          ["Discovery and planning", "~10%"],
          ["Design and UX", "15–20%"],
          ["Frontend development", "25–30%"],
          ["Backend development", "25–30%"],
          ["Testing and QA", "10–15%"],
          ["Deployment and setup", "~5%"],
        ],
      },
      {
        type: "p",
        text: "Notice that visible design is a minority of the cost. Most of the budget is logic and data — the parts users never see and entirely depend on. Skimping on the discovery 10% is the most expensive mistake available to you, because vague requirements cause rework and rework is where budgets die.",
      },
      { type: "h2", text: "Ongoing costs after launch" },
      {
        type: "p",
        text: "An app is never done. Budget for:",
      },
      {
        type: "list",
        items: [
          "**Hosting and infrastructure** — $20 to $500+ a month depending on scale",
          "**Third-party service fees** — payments, email, APIs, usually usage-based",
          "**Maintenance** — bug fixes, dependency updates and security patches, commonly **15–20% of the build cost per year**",
          "**New features** — the successful apps are the ones that keep evolving",
        ],
      },
      {
        type: "p",
        text: "Plan for this from the start. An app you can't afford to maintain becomes a security liability within a year — the same pattern set out in [annual website maintenance costs](/blogs/annual-website-maintenance-costs-nz).",
      },
      { type: "h2", text: "How to keep the cost down without cutting corners" },
      {
        type: "p",
        text: "The goal is a smaller first version, not a cheaper-per-hour build. The real levers:",
      },
      {
        type: "list",
        items: [
          "**Build an MVP, not the final vision.** Ship the smallest version that delivers core value, launch it, then expand based on what real users actually do. Most \"essential\" features on a first spec turn out to be assumptions.",
          "**Use existing services instead of building from scratch.** Auth, payments, email and search are solved problems, and mature services do them better and cheaper than a custom build ever will.",
          "**Prioritise ruthlessly.** For each feature ask whether the product fails without it at launch. If not, it's phase two.",
          "**Nail scope before building.** A solid discovery phase pays for itself several times over.",
          "**Choose the right builder.** Someone who has built this kind of app before moves faster and hits fewer dead ends than a cheaper generalist, which often makes the expensive option the cheaper one overall.",
        ],
      },
      { type: "h2", text: "Freelancer vs agency for web apps" },
      {
        type: "p",
        text: "The gap is even wider for applications than for websites.",
      },
      {
        type: "list",
        items: [
          "A **senior solo developer or small team** can build a well-architected MVP for **$30,000–$70,000**, with direct communication and fast decisions — ideal when the app has a focused, well-defined scope.",
          "A **larger agency** typically quotes **$80,000–$200,000+** for comparable MVP scope, which is justified when you need many specialists in parallel, formal process, or genuinely enterprise-scale complexity.",
        ],
      },
      {
        type: "p",
        text: "For a first product or a focused internal tool, the solo or small-team route usually delivers better value. For sprawling multi-team systems, an agency's capacity earns its premium. Match the builder to the actual complexity, not to the ambition of the pitch deck — [how to choose a web development company](/blogs/how-to-choose-a-web-development-company) covers how to tell them apart.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How much does it cost to build a web application?" },
      {
        type: "p",
        text: "A functional MVP runs $30,000–$70,000 and a production platform $80,000–$150,000+. A clickable prototype that proves the concept without real functionality sits at $8,000–$25,000. The driver is the number of user flows, not the number of screens.",
      },
      { type: "h3", text: "What's the difference between a website and a web application?" },
      {
        type: "p",
        text: "A website presents information; an application does work. Users log in, data changes, and actions have consequences that have to be handled — including the edge cases. That's why pricing is based on user flows rather than page count.",
      },
      { type: "h3", text: "How much does an MVP cost to build?" },
      {
        type: "p",
        text: "$30,000–$70,000 for a real, usable first version with core features, built by a senior solo developer or small team. The way to control that number is scope: ship the smallest version that delivers value, then expand based on what real users do.",
      },
      { type: "h3", text: "What are the ongoing costs of a web application?" },
      {
        type: "p",
        text: "Hosting and infrastructure from $20 to $500+ a month depending on scale, usage-based third-party service fees, and maintenance at roughly 15–20% of the build cost per year. An app nobody maintains becomes a security liability within about a year.",
      },
      { type: "h3", text: "Why are agency quotes for web apps so much higher?" },
      {
        type: "p",
        text: "Agencies typically quote $80,000–$200,000+ for MVP scope a senior solo developer or small team delivers for $30,000–$70,000. The difference is overhead and parallel specialists, which is worth paying for at genuine enterprise complexity and not much below it.",
      },
      { type: "h2", text: "The bottom line" },
      {
        type: "p",
        text: "A custom web application costs most businesses **$30,000–$70,000 for a real MVP** and **$80,000–$150,000+ for a production platform**, driven mostly by user flows, permission complexity, data design and integrations rather than by how it looks.",
      },
      {
        type: "p",
        text: "The smartest way to control that is to build the smallest version that delivers real value, use existing services for solved problems, and nail scope before development starts. If what you're describing is really a logged-in area for customers, [what a customer portal costs to build](/blogs/customer-portal-development-cost) breaks that down separately. If you want an honest scope-and-cost conversation — including whether you need a full application yet — [get in touch](/contact).",
      },
    ],
  },
  {
    slug: "take-over-existing-website-developer",
    // 44 chars — withBrand() lands on 59, inside the 62 limit.
    title: "Taking Over a Website From Another Developer",
    excerpt:
      "Your developer has gone quiet. The four pieces of access to secure first, how to recover them, and what a takeover actually costs in NZ and Cyprus.",
    coverImage:
      "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-12",
    tags: ["Hiring a Developer", "Website Handover", "Small Business"],
    content: [
      {
        type: "p",
        text: "Before you hire anyone to take over your website, secure four things: the **domain registrar account**, the **hosting account**, the **code**, and an **owner-level CMS login**. Without them no developer can help you, and any developer who says otherwise hasn't understood the problem yet. Everything else in a takeover is negotiable. These four are not.",
      },
      {
        type: "p",
        text: "This post is for the situation where the site exists, it's working or half-working, and the person who built it is unreachable, unresponsive, or simply someone you'd rather not work with again. If you're earlier than that — still choosing who to hire — [how to compare web developer quotes](/blogs/how-to-compare-web-developer-quotes) is the better starting point.",
      },
      { type: "h2", text: "The four things to secure before you hire anyone" },
      { type: "h3", text: "1. The domain registrar account" },
      {
        type: "p",
        text: "This is the one that matters most, because it's the one that's hardest to recover and easiest to lose. Your domain is registered with a registrar — GoDaddy, Namecheap, a NZ registrar like Freeparking or 1st Domains, a Cyprus provider, or a reseller account owned by your developer.",
      },
      {
        type: "p",
        text: "Run a [WHOIS lookup](https://who.is/) on your domain. It will show the registrar and, unless privacy protection is on, the registrant contact. **The registrant should be your business, not your developer.** If it isn't, that's the first thing to fix, and it's fixable — see the recovery section below.",
      },
      { type: "h3", text: "2. Hosting or server access" },
      {
        type: "p",
        text: "Either a control panel login (cPanel, Plesk, a managed WordPress host) or a cloud account (AWS, Vercel, Netlify, DigitalOcean). What you want is the **account owner** login, not a user account someone created for you — an account owner can add and remove people, and a user cannot.",
      },
      {
        type: "p",
        text: "The fastest way to find out who's paying for hosting is your own bank statement. If hosting doesn't appear on it, someone else is paying for it, and that someone controls whether your site stays online.",
      },
      { type: "h3", text: "3. The code" },
      {
        type: "p",
        text: "Repository access is what you want — GitHub, GitLab or Bitbucket, with your own account added as an owner or admin. A zip file emailed at handover is much weaker: it's a snapshot with no history, and version history is exactly what a new developer reads to understand why the code is the way it is.",
      },
      {
        type: "p",
        text: "If there's no repository at all, the files on the server are the code. That's recoverable, but it tells you something about how the site was built, and it belongs in the audit conversation below.",
      },
      { type: "h3", text: "4. An owner-level CMS or admin login" },
      {
        type: "p",
        text: "Administrator, not editor. On WordPress that's the Administrator role; on a custom build it's whatever role can manage other users. The test is simple: log in and try to create another admin account. If you can't, you don't have owner-level access.",
      },
      {
        type: "p",
        text: "Locked out of your own website, or not sure which of these you actually hold? Tell me what you can and can't log into and I'll tell you what's recoverable, what isn't, and roughly what each path costs — free, before you commit to anything. [Get in touch](/contact).",
      },
      { type: "h2", text: "Why developers go quiet (it's usually not malice)" },
      {
        type: "p",
        text: "Worth saying plainly, because the internet's version of this story is always a villain. Most disappearances are mundane: the developer took a full-time job and let the side work lapse, the studio closed, the person who built it left the company, or the project ended on bad terms years ago and nobody expected to speak again.",
      },
      {
        type: "p",
        text: "The site keeps running regardless — that's the trap. A website with nobody maintaining it works fine right up until a certificate expires, a host migrates, or a dependency breaks. Then it stops, and only at that point does anyone discover the access problem. **The best time to fix this is while everything still works.**",
      },
      { type: "h2", text: "What to do if you can't reach your current developer" },
      {
        type: "p",
        text: "In order, cheapest and most likely to work first:",
      },
      {
        type: "list",
        items: [
          "**WHOIS the domain** to identify the registrar. This tells you which company to talk to, which is more than most people in this situation start with.",
          "**Attempt registrar account recovery** directly with that registrar. If the domain is registered to your business, registrars have a documented process for proving ownership — typically company documents, an ID, and matching billing details. This works more often than people expect.",
          "**Check your card and bank statements** for hosting, domain and email charges. Whoever the payments go to is who holds that account, and a paying customer has leverage a third party doesn't.",
          "**Try CMS password recovery** to the email address on the admin account. If that email is your own domain and you control mail, you may already be able to get back in.",
          "**Check whether your email is separate from your hosting.** If your business email runs through the same provider, prioritise it — losing email is worse than losing the website.",
        ],
      },
      {
        type: "p",
        text: "What's genuinely unrecoverable: a domain registered in someone else's name at a registrar that won't transfer it, and code that only ever existed on a machine you can't access. Both have workarounds — a new domain, or a rebuild — but neither is a recovery, and a developer who implies otherwise is selling you something.",
      },
      { type: "h2", text: "What a new developer needs before quoting a takeover" },
      {
        type: "p",
        text: "A takeover quote is different from a build quote, and you should be suspicious of anyone who prices one without looking at the code first. A new build is a known quantity — the developer decides how it's made. An inherited codebase is somebody else's decisions, and nobody can price the cost of understanding decisions they haven't read yet.",
      },
      {
        type: "p",
        text: "This is why most honest takeovers start with **a paid audit** rather than a fixed project price. The audit is small, bounded, and it produces the information a real quote needs:",
      },
      {
        type: "list",
        items: [
          "What the site is actually built on — platform, framework, versions, and how far behind they are",
          "Where it's hosted and what that costs",
          "Whether there's version control, and how much history survives",
          "What's broken now, and what's about to break",
          "Which dependencies have known vulnerabilities",
          "Whether the thing you actually want next is feasible on this codebase, or whether it fights it",
        ],
      },
      {
        type: "p",
        text: "A developer who quotes a firm fixed price on an unseen codebase is doing one of two things: padding heavily to cover the unknown, or about to be unpleasantly surprised. Both end up costing you.",
      },
      { type: "h2", text: "What a takeover costs" },
      {
        type: "p",
        text: "These are market ranges from published price guides, not my quote — and takeover pricing varies more than new-build pricing precisely because the starting condition varies so much. **Inherited code is normally priced above equivalent greenfield work**, because someone has to read and understand another developer's decisions before safely changing any of them.",
      },
      { type: "h3", text: "New Zealand (NZD)" },
      {
        type: "table",
        headers: ["Stage", "Typical range", "What it covers"],
        rows: [
          ["Discovery / audit", "$5,000–$15,000 for application-scale work", "Reading the codebase, documenting it, and pricing what comes next. Small brochure sites sit well below this."],
          ["Ongoing maintenance", "$50–$200/month", "Hosting oversight, updates, backups, small content changes on a standard business site."],
          ["Application support retainer", "$1,500–$5,000/month", "Mid-complexity platforms with real users and uptime expectations."],
          ["Annual maintenance allowance", "15–20% of the original build cost", "The rule of thumb for budgeting a year of upkeep on custom software."],
        ],
        caption: "NZD ranges published by NZ providers — discovery, retainer and the 15–20% rule from Web Maniacs; the $50–$200/month band from Fuel Design and Lucid Media.",
      },
      {
        type: "p",
        text: "Sources: [Web Maniacs](https://webmaniacs.co.nz/custom-web-application-development-pricing-nz/), [Fuel Design](https://www.fueldesign.co.nz/blog/how-much-does-a-website-cost-in-new-zealand-2026-pricing-guide/) and [Lucid Media](https://www.lucidmedia.co.nz/guides/web-design-cost-nz/). Hourly work on an existing site is commonly billed at $50–$150/hr in NZ.",
      },
      { type: "h3", text: "Cyprus (EUR)" },
      {
        type: "table",
        headers: ["Stage", "Typical range", "What it covers"],
        rows: [
          ["Ongoing maintenance", "€100–€500/month", "Updates, security, backups and small changes."],
          ["Hosting and domain", "€60–€200/year hosting, €10–€20/year domain", "The bill that keeps the site online, wherever it's hosted."],
          ["Freelance ongoing engagement", "€500–€2,000/month", "A named individual handling the site rather than an agency retainer."],
        ],
        caption: "EUR ranges published by Cyprus providers.",
      },
      {
        type: "p",
        text: "Sources: [Uveler](https://uveler.com/blogs/marketing-agency-cost-cyprus/) and [Bandziuk](https://www.bandziuk.com/blog/website-development-cost-in-cyprus). For full build ranges rather than takeover costs, see [what a website costs in Cyprus](/blogs/website-cost-cyprus-2026).",
      },
      { type: "h2", text: "Red flags in the code you're inheriting" },
      {
        type: "p",
        text: "You don't need to read code to ask about these. Each one has a plain-English cost attached, and a new developer should be able to tell you which apply within a day of getting access.",
      },
      {
        type: "list",
        items: [
          "**No version control.** There's no history, so nobody can see why anything was done or safely undo a change. Every edit is riskier and therefore slower — this is the single biggest driver of \"why is this so expensive to change?\"",
          "**Outdated dependencies.** Old libraries with published vulnerabilities. The fix is usually mandatory and rarely quoted for, because upgrading one thing tends to break another.",
          "**No staging environment.** Changes get tested on the live site, in front of your customers. Setting up staging is cheap and it's the first thing worth paying for.",
          "**Hardcoded credentials.** Passwords and API keys written into the code itself. If the code has ever been shared, those credentials are effectively public and all of them need rotating.",
          "**No backups.** Nothing to restore from when something goes wrong. Verify that backups both exist and have been restored from at least once — an untested backup is a hope, not a backup.",
          "**No documentation.** Not fatal, but it converts directly into hours, because the new developer has to rediscover everything by reading.",
        ],
      },
      { type: "h2", text: "When rebuilding beats recovering" },
      {
        type: "p",
        text: "Sometimes the honest answer is that the existing site isn't worth saving, and you should want a developer who'll tell you that even though a rebuild is the bigger invoice. The rough test: **if the audit finds more than about half the red flags above, and you also want significant new functionality, a rebuild is usually cheaper within eighteen months.**",
      },
      {
        type: "p",
        text: "The reverse is also true and less often said. If the site works, ranks, and just needs someone to look after it, a rebuild is an expensive way to solve a maintenance problem — and you'd be giving up accumulated search visibility to do it. If what you actually want is one new capability rather than a new site, [what it costs to add features to an existing website](/blogs/cost-to-add-features-existing-website) covers that decision directly.",
      },
      { type: "h2", text: "What to do differently with the next developer" },
      {
        type: "p",
        text: "This is the part that stops you being here again in three years:",
      },
      {
        type: "list",
        items: [
          "**Register the domain yourself**, in your business name, on an account you control, and put the renewal in a calendar.",
          "**Get repository access on day one**, not at handover. An owner seat on the repo from the start costs nothing and changes everything if the relationship ends.",
          "**Pay for hosting on your own card**, with the developer added as a user. Access follows the bill.",
          // The contract post is now published, so this points at it again —
          // it covers the ownership clause directly rather than in passing.
          "**Get ownership in writing** before work starts — the code, the domain, the hosting, the design files, transferring on final payment. [What a web developer contract should include](/blogs/web-developer-contract-checklist) covers the specific clauses.",
          "**Ask for a documented handover**: where things live, how to deploy, what breaks, who to call. A recorded screen-share is worth more than a PDF nobody reads.",
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "My web developer isn't responding. Can I get my website back?" },
      {
        type: "p",
        text: "Usually yes, at least in part. Start with a WHOIS lookup to identify your domain registrar, then go through that registrar's ownership-recovery process — if the domain is registered to your business, this is a documented procedure requiring proof of identity and company details. Check bank statements to find who's paying for hosting, and try CMS password recovery to an email address you control. What's genuinely unrecoverable is a domain registered in someone else's name at an uncooperative registrar, and code that never existed anywhere but their machine.",
      },
      { type: "h3", text: "Who legally owns my website code?" },
      {
        type: "p",
        text: "It depends on your contract and on the law where each party is based, so treat this as background rather than a ruling — I'm a developer, not a lawyer, and anything significant is worth a proper legal opinion. In practice, ownership follows what the written agreement says. Where a contract is silent, many jurisdictions leave copyright in commissioned work with the person who created it, even though the client paid for it — which surprises people. That's precisely why an explicit assignment-on-final-payment clause matters more than assuming.",
      },
      // Narrowed to the takeover case. The general fix-vs-rebuild question is
      // owned by /blogs/fix-or-rebuild-website — the two FAQ entries were
      // near-identical strings competing for one query.
      { type: "h3", text: "Should I rebuild instead of recovering a site I'm locked out of?" },
      {
        type: "p",
        text: "Sometimes, and a developer worth hiring will tell you so even though the rebuild is the larger invoice. If the domain sits in someone else's name at a registrar that won't transfer it, or the code only ever existed on a machine nobody can reach, recovery can cost more than starting clean — and you may need a different domain either way. Recover rather than rebuild when the site still ranks and access is the only missing piece. The general version of this decision is in [should you fix your website or build a new one](/blogs/fix-or-rebuild-website).",
      },
      { type: "h3", text: "Can a developer work on a website someone else built?" },
      {
        type: "p",
        text: "Yes, and it's routine — but it should start with a paid audit rather than a fixed quote. An inherited codebase is another developer's decisions, and nobody can honestly price the work of understanding decisions they haven't read. Expect a small bounded audit first, then a real quote based on what it found.",
      },
      { type: "h3", text: "What access do I need to give a new web developer?" },
      {
        type: "p",
        text: "Domain registrar, hosting or server, the code repository, and an owner-level CMS or admin account. Add them as a user on accounts you own rather than handing over your own credentials, so you can remove access later without changing every password. If any of the four doesn't exist or you can't produce it, say so up front — it changes the scope, and it's better discovered before the quote than after.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Do the WHOIS lookup today. It takes a minute, it's free, and it tells you whether you have an inconvenience or a real problem — which determines everything else you do next.",
      },
      {
        type: "p",
        text: "If you'd like a second pair of eyes, send me what you have and what you're locked out of. I'll tell you honestly what's recoverable, whether the site is worth keeping, and what I'd do first — including if the answer is that you don't need to pay anyone yet. [Get in touch](/contact), or [see what I work on](/services).",
      },
    ],
  },
  {
    slug: "how-to-compare-web-developer-quotes",
    // 46 chars — withBrand() lands on 61, inside the 62 limit.
    title: "How to Compare Web Developer Quotes: 10 Checks",
    excerpt:
      "Three quotes, no way to compare them? The 10 checks to run before you sign — scope, ownership, revisions and change costs, with NZ and Cyprus ranges.",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-12",
    tags: ["Hiring a Developer", "Pricing", "New Zealand", "Cyprus"],
    content: [
      {
        type: "p",
        text: "Before comparing prices, compare five things: **what's being built** (pages, features and integrations named), **who owns the result** after final payment, **what happens after launch**, **what you have to supply**, and **what a change costs**. Two quotes are only comparable when both answer all five. Usually the expensive one does and the cheap one doesn't — and that gap is most of the price difference.",
      },
      {
        type: "p",
        text: "You asked three developers for a quote on the same project. One said $2,000, one said $9,000, one said $28,000, and nobody explained why. That isn't a pricing problem. It's a scope problem: the three of them were describing different projects and nobody noticed.",
      },
      {
        type: "p",
        text: "Not sure what your project should cost? Send me what you need it to do and I'll tell you the realistic scope, timeline and range before you spend anything — including if your project is simpler than you've been quoted for. [Get in touch](/contact).",
      },
      { type: "h2", text: "1. Is the scope written down, or implied?" },
      {
        type: "p",
        text: "The single biggest cause of quote variance. \"A 5-page business website\" can mean a bought theme with your logo dropped in, or a custom design with a booking system and a CMS behind it.",
      },
      {
        type: "p",
        text: "Check that the quote lists **pages by name, features by function, and integrations by product**. \"Contact form\" and \"contact form with spam filtering, an autoresponder and a push to HubSpot\" are two different builds in two different price brackets.",
      },
      {
        type: "p",
        text: "The red flag is a single-line quote — \"Website — $3,500.\" You can't compare that to anything, and neither can the developer when you later ask for something they never priced.",
      },
      { type: "h2", text: "2. Is design included, and whose design?" },
      {
        type: "table",
        headers: ["Level", "What it is", "When it's the right call"],
        rows: [
          ["Template", "A bought theme, lightly customised", "Straightforward businesses that need to look credible and be found. Fastest and cheapest."],
          ["Semi-custom", "A design system applied to your brand", "Most SMBs — distinct enough to own, without a designer's full engagement."],
          ["Fully custom", "Designed from scratch, usually with a designer involved", "When the brand is the product, or the interface is genuinely novel."],
        ],
      },
      {
        type: "p",
        text: "None of these is wrong. A local trades business genuinely may not need a custom design. But **paying custom prices for a template is the most common overcharge in this market**, and it's invisible unless you ask which one you're getting.",
      },
      { type: "h2", text: "3. How many revision rounds — and what counts as one?" },
      {
        type: "p",
        text: "\"Unlimited revisions\" is either untrue or already priced into the number, and either way it isn't a feature. Two named rounds at defined stages is a more honest offer than infinity.",
      },
      {
        type: "p",
        text: "Ask what a round means: one batch of consolidated feedback, or one individual change? If it's one change, then three rounds is three changes, and you'll discover that at the worst possible moment.",
      },
      { type: "h2", text: "4. Who owns the code, domain and hosting?" },
      {
        type: "p",
        text: "The one that costs people the most, years later. Ask directly and in writing: **after final payment, do I own the code, the domain, the hosting account and the design files — and can I move to another developer without rebuilding?**",
      },
      {
        type: "p",
        text: "If the answer is vague, or the developer registers the domain in their own name, you're renting your website. This is the situation behind almost every \"I can't reach my developer and my site is down\" story — and [taking over a website from another developer](/blogs/take-over-existing-website-developer) is what it costs to get out of it.",
      },
      { type: "h2", text: "5. What are the ongoing costs after launch?" },
      {
        type: "p",
        text: "A website isn't a one-time purchase. Hosting, domain renewal, SSL, updates and backups land whether or not the quote mentions them. Published NZ ranges put hosting at **$39–$99/month**, domains at **$25–$50/year** and maintenance at **$50–$200/month** ([Fuel Design](https://www.fueldesign.co.nz/blog/how-much-does-a-website-cost-in-new-zealand-2026-pricing-guide/), [Lucid Media](https://www.lucidmedia.co.nz/guides/web-design-cost-nz/)). In Cyprus, maintenance runs **€100–€500/month** with hosting and domain around **€60–€200/year** ([Uveler](https://uveler.com/blogs/marketing-agency-cost-cyprus/), [Bandziuk](https://www.bandziuk.com/blog/website-development-cost-in-cyprus)).",
      },
      {
        type: "p",
        text: "A quote that omits these isn't cheaper. It's incomplete. The full NZ picture is in [annual website maintenance costs](/blogs/annual-website-maintenance-costs-nz).",
      },
      { type: "h2", text: "6. Is the timeline realistic — and what makes it slip?" },
      {
        type: "p",
        text: "Anyone can promise four weeks. The useful question is what makes it late, and the honest answer is always the same: waiting on your content, your feedback and your approvals.",
      },
      {
        type: "p",
        text: "Check that the quote states **what you must provide and by when**. A timeline that doesn't name your obligations will be missed, and the conversation about whose fault that was is unpleasant for everyone.",
      },
      { type: "h2", text: "7. Is mobile, accessibility and speed included — or extra?" },
      {
        type: "p",
        text: "In 2026 most of your visitors arrive on a phone. If \"responsive design\" appears as a line item with a price beside it, you're being sold the baseline as an upgrade.",
      },
      {
        type: "p",
        text: "Performance, accessibility and mobile behaviour should be stated as standard. Ask what they target — a named [Core Web Vitals](https://web.dev/articles/lcp) threshold or WCAG 2.1 AA is a good sign. Silence isn't.",
      },
      { type: "h2", text: "8. What SEO is actually included?" },
      {
        type: "p",
        text: "\"SEO included\" ranges from technically-sound-and-nothing-else to a content and link programme costing more than the site.",
      },
      {
        type: "list",
        items: [
          "**Reasonable to expect in any build:** clean URLs, real page titles and meta descriptions, a sensible heading structure, a sitemap, schema markup, fast loading, and pages that are actually indexable.",
          "**Not standard, and priced separately:** keyword research, content writing, link building, ongoing optimisation and local listings.",
        ],
      },
      {
        type: "p",
        text: "Anyone promising rankings on a fixed timeline is guessing — nobody controls Google's results. If your current site isn't appearing at all, [why your website isn't showing on Google](/blogs/why-website-not-showing-on-google) covers the usual causes.",
      },
      { type: "h2", text: "9. Can you verify the work?" },
      {
        type: "p",
        text: "Ask for **live URLs you can open**, not screenshots, and case studies that describe decisions rather than just displaying logos. Then ask one question: what part of this project do you expect to be hardest? A developer who says \"none of it\" either hasn't read your brief or hasn't done this before.",
      },
      {
        type: "p",
        text: "For an application rather than a brochure site, ask what the hard part was on a comparable build. On a [hospital system with three staff roles sharing one patient record](/projects/hospital-management-system), the hard part wasn't the interface — it was that permissions had to be enforced server-side, so the UI only ever hides what the API already refuses. That's the shape of answer you're listening for.",
      },
      { type: "h2", text: "10. What does a change cost after you've signed?" },
      {
        type: "p",
        text: "Scope changes on nearly every project. It isn't a failure, it's what happens when a real business meets a real build. What matters is that the quote states an hourly rate or a written change-request process for out-of-scope work.",
      },
      {
        type: "p",
        text: "A quote with no change mechanism turns every new idea into an argument. NZ providers commonly bill this at **$50–$150/hr** for content and small changes.",
      },
      { type: "h2", text: "What these actually cost — NZ and Cyprus ranges" },
      {
        type: "p",
        text: "Market ranges published by providers in each country, not my quote. Yours will differ with scope and with who you hire. Full hourly, fixed-price and retainer breakdowns for both markets are in [what it costs to hire a web developer in 2026](/blogs/cost-to-hire-web-developer-2026).",
      },
      { type: "h3", text: "New Zealand (NZD)" },
      {
        type: "table",
        headers: ["Project type", "Published range", "Source"],
        rows: [
          ["Landing / single-page site", "$1,500–$3,000 + GST", "Fuel Design"],
          ["Template small-business site", "$2,000–$5,000", "Lucid Media"],
          ["Custom marketing site (8–15 pages)", "$5,990–$15,000 + GST", "Fuel Design"],
          ["Premium / fully custom build", "$15,000–$30,000+", "Lucid Media"],
          ["Simple web app or internal tool", "$15,000–$40,000", "Web Maniacs"],
          ["Mid-complexity platform or portal", "$40,000–$120,000", "Web Maniacs"],
        ],
      },
      { type: "h3", text: "Cyprus (EUR)" },
      {
        type: "table",
        headers: ["Project type", "Published range", "Source"],
        rows: [
          ["Starter site (3–5 pages)", "€500–€1,000", "Cyprus Digital Agency, Bandziuk"],
          ["Small business site", "€900–€2,500", "Bandziuk"],
          ["Business / corporate site (10+ pages)", "€1,200–€3,500", "Cyprus Digital Agency, Bandziuk"],
          ["Mid-range custom build", "€4,500–€12,000", "Uveler"],
          ["E-commerce", "€2,500–€10,000", "Bandziuk, Uveler"],
          ["Custom platform / premium build", "€12,000–€35,000", "Uveler"],
        ],
      },
      {
        type: "p",
        text: "Note the overlap between Cypriot sources at the low end and the gap at the middle — that spread is real, and it's mostly the template-versus-custom distinction from check 2 showing up in the numbers. Adding Greek and English versions typically adds around 20% to a Cyprus project.",
      },
      {
        type: "p",
        // Was /blogs/why-web-development-quotes-differ — unwritten, 404.
        text: "The pattern that matters more than any single number: **agencies price for overhead, freelancers price for time, and offshore teams price for volume.** The same brief genuinely costs different amounts depending on who's carrying what — [what a business website costs](/blogs/business-website-cost-2026) breaks that down band by band.",
      },
      { type: "h2", text: "When you don't need a developer at all" },
      {
        type: "p",
        text: "Worth saying plainly, because nobody selling you a website will say it.",
      },
      {
        type: "p",
        text: "**You probably don't need a custom build** if you need under about five pages, you're not selling online, there are no logins or bookings, and you're happy editing text yourself. A well-configured site builder will serve you for a fraction of the cost — [WordPress vs Wix vs a custom website](/blogs/wordpress-vs-wix-vs-custom-website) walks through that choice.",
      },
      {
        type: "p",
        text: "**You probably do need a developer** if users log in, you're taking bookings or payments, something has to talk to another system like a CRM or accounting package, your current site is slow or broken or uneditable, or you've been quoted for a custom build and want someone to check the quote.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Get three quotes, and send all three developers **the same written brief** — same pages, same features, same must-haves. Most quote variance disappears the moment everyone is pricing the same thing.",
      },
      {
        type: "p",
        text: "Then compare on the five checks at the top of this post rather than on the number at the bottom.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Why is one website quote $2,000 and another $15,000?" },
      {
        type: "p",
        text: "Usually scope, not skill. The cheap quote is often a template with no defined revisions, no ownership clause and no support after launch; the expensive one may include custom design, a CMS, integrations and a warranty period. Published NZ ranges run $2,000–$5,000 for a template site against $5,990–$15,000 for a custom 8–15 page build, so a gap that size is normal between different products. Ask both to itemise before assuming either is wrong.",
      },
      { type: "h3", text: "Should I always pick the cheapest quote?" },
      {
        type: "p",
        text: "No, but not automatically the most expensive either. Pick the quote whose scope matches what you actually need. The cheapest quote becomes the most expensive project when everything you assumed was included turns out to be a change request billed at $50–$150 an hour.",
      },
      { type: "h3", text: "Is it normal to pay a deposit to a web developer?" },
      {
        type: "p",
        text: "Yes. Roughly a third up front with the remainder tied to milestones or launch is standard for freelancers and small studios. Paying 100% up front to someone you've never worked with is not, and it removes the only leverage you have if the project stalls.",
      },
      { type: "h3", text: "How do I compare a local developer to an overseas one?" },
      {
        type: "p",
        // Was /blogs/hire-remote-web-developer — unwritten, 404.
        text: "On the same five checks, plus timezone overlap, written communication quality, and how ownership and handover are handled. The cost differences are real, but a developer who answers clearly in writing is worth more than one four hours closer who doesn't. [Remote developer or local agency](/blogs/remote-developer-vs-local-agency) works through that trade-off honestly.",
      },
      { type: "h3", text: "What if I already signed and the scope is wrong?" },
      {
        type: "p",
        text: "Ask for a written change request with a price attached before any further work happens. Most disputes in web projects come from changes agreed verbally in a call and invoiced later, when both sides remember the conversation differently.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Write the brief before you ask for a single price. One page describing what the site has to do, in business terms, is the most valuable document in this whole process — and the developers worth hiring will ask for it unprompted.",
      },
      {
        type: "p",
        text: "If you've already got quotes and can't reconcile them, send them to me with your brief. I'll tell you what's missing, what's fairly priced and what I'd question — free, with no expectation you hire me. If one of them is a good quote, I'll tell you that too. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "cost-to-add-features-existing-website",
    // 42 chars — withBrand() lands on 57.
    title: "What It Costs to Add Features to a Website",
    excerpt:
      "Adding a booking system, login or payments to an existing site? The price depends less on the feature than on the codebase it lands in. Here's why.",
    coverImage:
      "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?w=800&h=450&fit=crop",
    category: "Pricing",
    publishedAt: "2026-08-12",
    tags: ["Pricing", "Web Development", "Small Business"],
    content: [
      {
        type: "p",
        text: "The cost of adding a feature to an existing website is driven **more by the codebase it lands in than by the feature itself**. The same booking system is straightforward on a well-built site with version control and a staging environment, and expensive on a site with none of those. Before you can be quoted properly, someone has to look at what's already there.",
      },
      {
        type: "p",
        text: "That's an unsatisfying answer if you came here for a price, so this post explains exactly which conditions move the number and by roughly how much — enough that you can predict which bracket you're in before you ask anyone.",
      },
      {
        type: "p",
        text: "Want the short version for your specific site? Tell me what it's built on and what you want to add, and I'll tell you which bracket you're in and why — free. [Get in touch](/contact).",
      },
      { type: "h2", text: "Why the same feature costs double on an older site" },
      {
        type: "p",
        text: "This is the part that feels like developers being difficult, so it's worth explaining the actual mechanism. Four things make identical work take longer:",
      },
      { type: "h3", text: "No version control" },
      {
        type: "p",
        text: "Without Git or equivalent there's no history and no safe undo. Every change has to be made defensively, manually backed up, and verified by hand, because a mistake can't simply be reverted. This is the single largest multiplier on the list, and it applies to every hour of the job rather than a fixed portion of it.",
      },
      { type: "h3", text: "No staging environment" },
      {
        type: "p",
        text: "Changes get tested on the live site, in front of your customers. In practice this means work happens in cautious small increments, often outside business hours, with a rollback plan for each step. Setting up staging first is usually cheaper than working without it, even on a single project.",
      },
      { type: "h3", text: "Outdated dependencies" },
      {
        type: "p",
        text: "New features generally need current libraries. If the site is several major versions behind, the upgrade comes first — and upgrades cascade, because bringing one package forward often forces others. This work is real, mandatory and almost never in the original quote, which is why it turns up as a surprise.",
      },
      { type: "h3", text: "No documentation and no original developer" },
      {
        type: "p",
        text: "Someone has to read the code and work out what it does before changing it safely. On a small site that's an afternoon. On a large one with unusual decisions in it, it's a meaningful share of the total, and it's pure discovery cost — you get no visible feature for it.",
      },
      {
        type: "p",
        text: "If several of these describe your site, read [taking over a website from another developer](/blogs/take-over-existing-website-developer) first. Fixing the foundation is often a better first purchase than the feature you came for.",
      },
      { type: "h2", text: "What actually drives the price of each feature" },
      {
        type: "p",
        text: "Independently of the codebase, features differ enormously in how much genuinely new work they need. The useful question is **how much of this is a solved problem you can rent, and how much is specific to your business.**",
      },
      {
        type: "table",
        headers: ["Feature", "Where the cost sits", "What makes it expensive"],
        rows: [
          ["Payments", "Mostly rented — Stripe, Paddle and similar handle the hard parts", "Subscriptions, refunds, partial payments, multi-currency, and reconciling with your accounting system"],
          ["Login / user accounts", "Partly rented — hosted auth services do the credentials", "Roles and permissions. Two roles is a feature; six roles with overlapping rules is a project"],
          ["Booking / scheduling", "Mostly custom", "Availability rules, timezones, cancellations, reminders — and preventing two people booking the same slot"],
          ["CRM or accounting integration", "Depends entirely on the other system", "Their API quality, rate limits, and what happens when a sync fails halfway"],
          ["Multilingual", "Structural, not cosmetic", "Every page, email and error message doubles; URLs and SEO markup need per-language handling"],
          ["Dashboard / reporting", "Custom, and open-ended", "The queries behind the numbers, and the fact that every stakeholder wants one more metric"],
        ],
      },
      {
        type: "p",
        text: "One sourced datapoint on the multilingual row: Cyprus providers put **adding Greek and English versions at roughly 20% on top of a project's cost** ([Cyprus Digital Agency](https://cyprusdigitalagency.com/website-design-cost-in-cyprus-2026/)). That's a fair rule of thumb for a two-language content site, though it understates the case where prices, tax rules or legal text differ per market.",
      },
      { type: "h2", text: "The two features people most underestimate" },
      { type: "h3", text: "Booking, because of the double-booking problem" },
      {
        type: "p",
        text: "A booking form looks like a form. The expensive part is invisible: **two people can submit the same slot in the same second.** Checking availability in the browser doesn't solve it, because each browser rendered a calendar that was accurate when it loaded and stale by the time it was submitted.",
      },
      {
        type: "p",
        text: "The fix has to sit at the point the data is written — a uniqueness constraint, a transaction, or a version check on the slot — and it's the difference between a calendar staff trust and one they quietly abandon for a paper diary. On the [hospital system I built](/projects/hospital-management-system), that decision was made before any feature work started, because a calendar nobody trusts is worse than no calendar at all: it still has to be maintained. For price bands specific to this feature, see [what a booking website costs](/blogs/booking-website-cost).",
      },
      { type: "h3", text: "Logins, because of permissions" },
      {
        type: "p",
        text: "\"Let customers log in\" is cheap. \"Let customers, staff and managers log in and each see the right subset of the same records\" is a different project, and the cost scales with the number of distinct answers to \"who can see or change this?\" rather than with the number of screens.",
      },
      {
        type: "p",
        // Was /blogs/customer-portal-development-cost — an unwritten post that
        // shipped as a real 404. Repointed to the published cost guide, which
        // covers portals under the same roles-and-permissions cost driver.
        text: "The rule that keeps it safe is that permissions are enforced on the server, not in the interface — the UI should only ever hide what the API already refuses. A hidden button is a convenience, never a security boundary. If your feature is heading in this direction, [what a custom web application costs](/blogs/custom-web-application-cost) prices portals under the same roles-and-permissions driver, and the [hospital management system](/projects/hospital-management-system) case study is what it looks like built.",
      },
      { type: "h2", text: "How to estimate the cost yourself" },
      {
        type: "p",
        text: "Since feature prices aren't published the way website prices are, the honest way to sanity-check a quote is to work backwards from hours and published rates. NZ hourly bands, from a provider that publishes them:",
      },
      {
        type: "table",
        headers: ["Who", "Published NZD rate"],
        rows: [
          ["NZ freelancer, junior to mid", "$65–$110/hr"],
          ["NZ freelancer, senior or specialist", "$120–$175/hr"],
          ["Boutique NZ agency (5–20 staff)", "$140–$220/hr blended"],
          ["Large enterprise agency", "$220–$320+/hr blended"],
        ],
        caption: "Source: Web Maniacs, custom web application pricing in NZ.",
      },
      {
        type: "p",
        text: "Full bands and context at [Web Maniacs](https://webmaniacs.co.nz/custom-web-application-development-pricing-nz/). Content changes and small tweaks on an existing site are commonly billed lower, at **$50–$150/hr** ([Fuel Design](https://www.fueldesign.co.nz/blog/how-much-does-a-website-cost-in-new-zealand-2026-pricing-guide/)). In Cyprus, ongoing freelance engagements run **€500–€2,000/month** against agency retainers of **€3,500–€12,000+/month** ([Uveler](https://uveler.com/blogs/marketing-agency-cost-cyprus/)).",
      },
      {
        type: "p",
        text: "So when you get a quote, ask for the estimated hours as well as the total. Two quotes at the same price can mean very different things — twenty hours from a senior developer, or forty from a junior — and knowing which tells you what you're buying.",
      },
      { type: "h2", text: "When adding the feature is the wrong move" },
      {
        type: "p",
        text: "Three situations where I'd tell you to stop:",
      },
      {
        type: "list",
        items: [
          "**The feature already exists as a product.** Bookings, scheduling, help desks and newsletters all have mature hosted tools. A monthly subscription that solves it today usually beats a custom build you also have to maintain — and you can always build it properly later once you know it's load-bearing.",
          "**You're adding the third or fourth major feature to an aging site.** At that point you're funding a rebuild in instalments, at a worse price and with no coherent result. Published NZ ranges put a simple web app at $15,000–$40,000 and a mid-complexity platform at $40,000–$120,000 — worth comparing against the sum of what you're about to spend piecemeal.",
          "**Nobody has asked for it.** The most expensive feature is one built on an assumption. If you can't name the customers who'll use it, build the smallest version that tests the idea.",
        ],
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How much does it cost to add a booking system to a website?" },
      {
        type: "p",
        text: "It depends far more on your existing codebase than on the booking feature itself, which is why no honest developer quotes it sight-unseen. The cost drivers are your availability rules, timezone handling, cancellations and reminders — plus the concurrency problem of preventing two customers booking the same slot, which has to be solved where the data is written rather than in the browser. If an off-the-shelf booking product fits your rules, it will almost always be cheaper than a custom build.",
      },
      { type: "h3", text: "Why does adding a small feature cost so much?" },
      {
        type: "p",
        text: "Usually because of what surrounds it rather than the feature. If the site has no version control, no staging environment and outdated dependencies, every change has to be made defensively, tested on production, and often preceded by a library upgrade that cascades. That work is invisible in the finished result, which is why the price feels disconnected from what you can see.",
      },
      { type: "h3", text: "Is it cheaper to add features or rebuild the website?" },
      {
        type: "p",
        text: "Add features while the foundation is sound and you're making one or two changes. Rebuild when you're on your third or fourth significant addition to an aging codebase, because at that point you're paying for a rebuild in instalments without getting a coherent one. Compare the running total you're about to spend against published NZ ranges of $15,000–$40,000 for a simple web app and $40,000–$120,000 for a mid-complexity platform.",
      },
      { type: "h3", text: "How much does it cost to add a login to an existing website?" },
      {
        type: "p",
        text: "Simple customer accounts are relatively cheap because hosted authentication services handle passwords, resets and security. The cost scales with permissions, not screens: two roles is a feature, while six roles with overlapping rules about who can see and change each record is a project in its own right. Be specific about roles when you ask for a quote — it's the variable that moves the number most.",
      },
      { type: "h3", text: "Can any developer add features to a site someone else built?" },
      {
        type: "p",
        text: "Yes, but they should look at the code before quoting a fixed price. An inherited codebase is another developer's decisions, and the work of understanding them can't be priced blind. Expect a short paid audit, then a real quote — and treat a confident fixed price offered without access to the code as either padded or about to become a variation invoice.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Find out whether your site has version control, a staging environment and current dependencies. Those three answers put you in a bracket before anyone quotes anything, and any developer who has touched the site can tell you in an hour.",
      },
      {
        type: "p",
        text: "If you'd like that answered honestly — including whether an off-the-shelf product would serve you better than anything I'd build — send me the details. [Get in touch](/contact), or [see what I work on](/services).",
      },
    ],
  },
  // [YOUR ROLE + OUTCOME] — the draft wanted one true sentence here about
  // booking/scheduling work shipped for a client. Left unwritten rather than
  // invented. The hospital build's write-time booking validation is cited
  // instead, because that claim is already documented in its case study.
  {
    slug: "booking-website-cost",
    // 37 chars — withBrand() lands on 52.
    title: "How Much Does a Booking Website Cost?",
    excerpt:
      "Booking websites run $2,500–$12,000 + GST in NZ depending on plugin vs custom. What each band buys, what drives the price, and which you need.",
    coverImage:
      "https://images.unsplash.com/photo-1506784983877-45594efa4cbe?w=800&h=450&fit=crop",
    category: "Pricing",
    publishedAt: "2026-08-13",
    tags: ["Pricing", "Small Business", "New Zealand"],
    content: [
      {
        type: "p",
        text: "In New Zealand in 2026, a booking website lands in one of three bands: **$2,500–$5,000 + GST** for an off-the-shelf booking tool on a normal website, **$5,000–$12,000 + GST** for booking built into your site around your own services and rules, and **$12,000+ + GST** for a full platform with multiple staff, locations, payments and deposits. Most small service businesses need the middle band, not the top one.",
      },
      {
        type: "p",
        text: "The quotes you're getting range from a few hundred dollars to twenty thousand and nobody's explaining why. The gap is real, and it comes down to a single decision: a booking plugin on your existing site, or a custom booking system built around how your business actually works.",
      },
      {
        type: "p",
        text: "Not sure which band you need? Tell me what customers have to book and how your scheduling works, and I'll tell you whether a plugin will do — before you spend anything. If a $40/month tool solves it, that's what I'll say. [Get in touch](/contact).",
      },
      { type: "h2", text: "What actually drives the price" },
      { type: "h3", text: "1. Plugin vs custom — the biggest fork" },
      {
        type: "p",
        text: "A booking plugin is configuration: install it, set your hours, done. A custom booking system is engineering — it has to prevent double-bookings, handle cancellations, respect your real rules, and stay correct when two people book at once. That difference is most of the price gap, and it's a genuine difference rather than a markup.",
      },
      { type: "h3", text: "2. Conflict handling — harder than it looks" },
      {
        type: "p",
        text: "Two customers opening the same slot at the same moment isn't an edge case, it's Saturday morning. Preventing both from succeeding is real work done where the booking is written, not a setting you toggle. **A client-side availability check can't arbitrate between two requests that arrive in the same second** — each was rendered from a calendar that was accurate when it loaded and stale by the time it was submitted.",
      },
      {
        type: "p",
        text: "On the [hospital system I built](/projects/hospital-management-system), appointments are validated at write time rather than in the client for exactly this reason, and that decision was made before any feature work started. A calendar staff don't trust is worse than no calendar, because it still has to be maintained.",
      },
      { type: "h3", text: "3. Payments and deposits" },
      {
        type: "p",
        text: "Taking a card at booking time — a deposit to stop no-shows, or full prepayment — means integrating a payment gateway such as Stripe or Windcave, with its own error states and testing. Done properly, **no card data reaches your application at all**; the gateway handles it, which is how the [e-commerce dashboard](/projects/ecommerce-dashboard) build handles payments. It's worth it for businesses losing money to no-shows, and it's a real line item rather than a checkbox.",
      },
      { type: "h3", text: "4. Staff, locations and resources" },
      {
        type: "p",
        text: "One person's calendar is simple. Five staff with their own hours and services, across two locations, sharing rooms or equipment, is a scheduling engine. Each layer adds real complexity, and this is the factor that moves a project from the middle band to the top one.",
      },
      { type: "h3", text: "5. Reminders and automation" },
      {
        type: "p",
        text: "Automated confirmations and reminders cut no-shows sharply. Email is usually free to send; SMS carries a per-message cost that continues for as long as you use it. Small feature, real payoff, ongoing bill.",
      },
      { type: "h2", text: "What you get at each price band" },
      {
        type: "table",
        headers: ["Band", "What it buys", "Who it suits"],
        rows: [
          ["$2,500–$5,000 + GST", "A booking tool embedded in a clean site — one calendar, simple services, maybe a deposit. You manage it yourself.", "Solo operators with straightforward hours"],
          ["$5,000–$12,000 + GST", "Booking built into your site and branded, tied to your services and rules, with payments and reminders.", "Most established service businesses"],
          ["$12,000+ + GST", "Multi-staff, multi-location, custom logic, its own admin area. This is a platform, not a website.", "Businesses that genuinely have that complexity"],
        ],
      },
      {
        type: "p",
        text: "On top of the build: hosting plus any booking-tool subscription. Published NZ hosting runs **$39–$99/month** and maintenance **$50–$200/month** ([Fuel Design](https://www.fueldesign.co.nz/blog/how-much-does-a-website-cost-in-new-zealand-2026-pricing-guide/)), with booking tools themselves typically $30–$150/month depending on the tool and whether you send SMS.",
      },
      { type: "h2", text: "When you don't need a custom booking website" },
      {
        type: "p",
        text: "Worth saying plainly. If you're a solo operator with straightforward hours and services, a **$15–$40/month booking tool** — Calendly, Acuity, SavvyCal — embedded in your existing site will serve you well, and I'd tell you that before quoting a custom build.",
      },
      {
        type: "p",
        text: "Custom is worth it when the off-the-shelf tools fight your actual workflow: unusual rules, multiple shared resources, deposits tied to specific services, or a booking flow that's central to how customers experience your brand.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Write down exactly what a customer does from \"I want to book\" to \"it's confirmed\", and what has to happen behind the scenes when they do. **That flow, not the number of pages, decides the price.** Take it to any developer and you'll get comparable quotes instead of three numbers that mean nothing — the same principle as [comparing web developer quotes](/blogs/how-to-compare-web-developer-quotes) generally.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How much does an online booking system cost in New Zealand?" },
      {
        type: "p",
        text: "Between $2,500 and $12,000 + GST for most small businesses in 2026. A booking plugin on an existing site sits at the lower end; a custom system tied to your calendar, payments and rules sits higher. Multi-staff, multi-location platforms cost more again, and carry an ongoing subscription and hosting bill on top of the build.",
      },
      { type: "h3", text: "Is a booking plugin as good as a custom booking system?" },
      {
        type: "p",
        text: "For a solo operator with simple scheduling, often yes — and far cheaper, at roughly $15–$40 a month. A plugin becomes limiting when you have multiple staff or shared resources, unusual booking rules, or a booking flow central to your brand. The honest test is whether the off-the-shelf tool fits your workflow or fights it.",
      },
      { type: "h3", text: "Can I add online booking to my existing website?" },
      {
        type: "p",
        text: "Usually yes. A booking tool can be embedded into most existing sites, and a custom booking module can often be added without a rebuild. What it costs depends mostly on the state of the current site — [what it costs to add features to a website](/blogs/cost-to-add-features-existing-website) covers why the existing codebase matters more than the feature.",
      },
      { type: "h3", text: "How do you stop double-bookings on a website?" },
      {
        type: "p",
        text: "By making the booking record the single source of truth and enforcing the conflict check where the booking is written — a uniqueness constraint, a transaction, or a version check on the slot. Checking availability in the browser cannot solve it, because two people can both be looking at a calendar that was accurate when it loaded. This is real engineering, and part of why custom booking costs more than a static site.",
      },
      { type: "h3", text: "What are the ongoing costs of a booking website?" },
      {
        type: "p",
        text: "Hosting at roughly $39–$99/month in NZ, plus any booking-tool subscription, commonly $30–$150/month depending on the tool and whether you send SMS reminders. SMS is charged per message and keeps costing as you grow. Ask any developer for the twelve-month total rather than just the build price.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Map the booking flow before you ask for a price. It takes an afternoon, it's the document every quote should be based on, and it usually reveals whether you're a plugin business or a custom one before anyone quotes you.",
      },
      {
        type: "p",
        text: "Send me that flow and I'll come back with a realistic scope and range — free, no obligation, and if a simple tool solves it that's what I'll tell you. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  // [YOUR ROLE + OUTCOME] — the draft suggested citing auth/user accounts on
  // the E-Commerce Dashboard. Deliberately not done: that case study documents
  // Socket.io, Stripe and Chart.js, and claims no authentication work. Adding
  // it here would be the exact "feature without the technology that delivers
  // it" the case-study notes warn against. The hospital build's server-side
  // RBAC is cited instead, since that claim is already documented.
  {
    slug: "customer-login-website-cost",
    // 41 chars — withBrand() lands on 56.
    title: "Cost to Add a Customer Login to a Website",
    excerpt:
      "Adding a customer login costs $2,000–$10,000 + GST depending on what sits behind it. What drives the price, and when an off-the-shelf tool will do.",
    coverImage:
      "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=450&fit=crop",
    category: "Pricing",
    publishedAt: "2026-08-13",
    tags: ["Pricing", "Web Development", "New Zealand"],
    content: [
      {
        type: "p",
        text: "In New Zealand in 2026, adding a customer login runs **$2,000–$4,000 + GST** for sign-up, login, password reset and a basic profile; **$4,000–$10,000 + GST** once there's a real account area behind it — orders, downloads, bookings, personal data; and **$10,000+ + GST** for multiple user types with permissions and admin controls. The login itself is a small part. What lives behind the door is where the cost is.",
      },
      {
        type: "p",
        text: "\"I just want customers to log in\" sounds simple, and that's why quotes for it vary so widely. A login is a door. The price depends entirely on the size of the room behind it.",
      },
      {
        type: "p",
        text: "Not sure how much you actually need behind the login? Tell me what customers should be able to do once they're in and I'll tell you whether that's a $2,000 job or a $10,000 one — before you commit. [Get in touch](/contact).",
      },
      { type: "h2", text: "Why a login is never just a login" },
      { type: "h3", text: "Security is the real work" },
      {
        type: "p",
        text: "The moment users have accounts you're storing credentials and personal data. That means secure password hashing, session management, protection against the common attacks, and a password-reset flow that can't be abused to take over an account. It's done properly on the server or it isn't done at all — and it's most of what you're paying for, while being completely invisible in a demo.",
      },
      { type: "h3", text: "Permissions decide the price" },
      {
        type: "p",
        text: "The single biggest cost driver is **who can see what**. One user seeing their own data is straightforward. Customer, staff and admin each seeing a different view of the same records, with the rules enforced server-side, is real engineering — and the cost scales with the number of distinct answers to \"who is allowed to read or change this?\", not with the number of screens.",
      },
      {
        type: "p",
        text: "The rule that keeps it safe: **the interface should only ever hide what the server already refuses.** A hidden button is a convenience, never a security boundary — remove the client-side check by hand and you should get a refusal, not the data. That's how role-based access is built on the [hospital system](/projects/hospital-management-system), where reception, doctors and administrators share one patient record and getting it wrong isn't a UI bug but a records breach.",
      },
      { type: "h3", text: "What's behind the door is the actual build" },
      {
        type: "p",
        text: "Order history, downloads, a booking manager, saved data — these are priced like any other feature, and they're the bulk of the project. The authentication is the cheap part.",
      },
      { type: "h3", text: "Account flows add up" },
      {
        type: "p",
        text: "Sign-up confirmation, forgotten password, password reset, email change, account deletion. Each is a small flow that has to be built and tested so it can't be turned into an attack. Individually minor, collectively a real share of the estimate.",
      },
      { type: "h2", text: "What you get at each band" },
      {
        type: "table",
        headers: ["Band", "What it buys", "When it's right"],
        rows: [
          ["$2,000–$4,000 + GST", "Register, log in, reset password, manage a basic profile.", "You just need accounts to exist"],
          ["$4,000–$10,000 + GST", "Accounts plus a real logged-in area — orders, files, bookings, personal data.", "The common band for adding a customer account section"],
          ["$10,000+ + GST", "Multiple roles, server-enforced permissions, admin area, sensitive data.", "This is a portal. Price it as software."],
        ],
      },
      {
        type: "p",
        text: "If you're reading the third row and nodding, you're not costing a login — you're costing an application. [What a customer portal costs to build](/blogs/customer-portal-development-cost) is the more accurate guide.",
      },
      { type: "h2", text: "When you don't need a custom login" },
      {
        type: "p",
        text: "If all you want is gated content or a simple members' area, a membership plugin or a hosted authentication service on its lower tiers may do it for a fraction of a custom build — and I'd point you there first.",
      },
      {
        type: "p",
        text: "Custom login is worth it when the account area is core to your product, holds genuinely sensitive data, or needs permission logic the ready-made options can't express cleanly. That last one is the usual reason: off-the-shelf tools handle authentication well and complex authorisation badly.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Before getting quotes, write down what a logged-in customer can **do** — not \"they log in\", but every action available once inside, and who else can see the result. That list is the actual project, and it's what turns three wildly different quotes into comparable ones.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How much does it cost to add a login to a website?" },
      {
        type: "p",
        text: "$2,000–$10,000 + GST in New Zealand in 2026, depending on what sits behind it. A basic login and profile sits at the lower end, an account area with orders, files or bookings in the middle, and a full portal with multiple roles and permissions costs more again. Describe what customers do once logged in and the band becomes obvious.",
      },
      { type: "h3", text: "Why is a login expensive if it's just a username and password?" },
      {
        type: "p",
        text: "Because the username and password are the small part. Storing credentials securely, managing sessions, making password reset safe from account takeover, and building whatever customers actually do once logged in — that's the real work, and almost all of it is invisible in a demo. The security is the product, not an add-on.",
      },
      { type: "h3", text: "Can I use an off-the-shelf login instead of a custom one?" },
      {
        type: "p",
        text: "Often yes. Membership plugins and hosted authentication services handle simple gated areas cheaply and securely, and they're the right answer more often than developers admit. They start to struggle when your permission rules get specific — off-the-shelf tools handle authentication well and complex authorisation badly, and that's usually what pushes a project to custom.",
      },
      // The login-vs-portal definition question belongs to the portal post.
      // Keeping it here too put the same question text in two FAQPage blocks.
      { type: "h3", text: "Can I add a customer login to an existing website?" },
      {
        type: "p",
        text: "Usually yes, and it rarely needs a rebuild. What decides the price is the state of the existing site — whether it has version control, a staging environment and current dependencies — rather than the login itself. On a fragile codebase the safe route is to fix the foundation first, because adding accounts to a site nobody can change safely is how small jobs turn into large invoices. For where a login stops being a login, see [what a customer portal costs to build](/blogs/customer-portal-development-cost).",
      },
      { type: "h3", text: "Is customer data safe with a custom login?" },
      {
        type: "p",
        text: "It can be, if it's built properly: hashed passwords, protection against the common attacks, sensible session handling, and permission checks enforced on the server rather than hidden in the interface. Ask any developer directly where permissions are enforced. If the answer is about hiding buttons, keep asking.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "List every action a logged-in customer can take, and next to each one write who else is allowed to see it. That second column is the one that sets your price.",
      },
      {
        type: "p",
        text: "Send me that list and I'll give you a realistic scope and range — free. If an off-the-shelf tool solves it, I'll tell you that instead. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "fix-or-rebuild-website",
    // 43 chars — withBrand() lands on 58.
    title: "Should I Fix My Website or Build a New One?",
    excerpt:
      "Fixing is cheaper — until it isn't. How to tell whether your website is worth repairing, or whether a rebuild will cost you less over two years.",
    coverImage:
      "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=800&h=450&fit=crop",
    category: "Web Development",
    publishedAt: "2026-08-13",
    tags: ["Website Redesign", "Small Business", "New Zealand"],
    content: [
      {
        type: "p",
        text: "**Fix it** if the foundation is sound and the problems are on the surface — dated design, a few broken features, slow pages, stale content. **Rebuild it** if the problems are structural: you can't edit it, it runs on something unsupported, it breaks whenever it's touched, it isn't mobile-friendly at its core, or nobody can safely work on the code. The deciding question isn't how bad it looks. It's how sound the thing underneath is.",
      },
      {
        type: "p",
        text: "The instinct is always to fix, because fixing sounds cheaper. Sometimes it is. Sometimes patching an old site costs more than replacing it, and you find that out halfway through.",
      },
      {
        type: "p",
        text: "Not sure which side yours falls on? Send me your site and I'll tell you honestly whether it's worth fixing — free, and I'll say \"just fix it\" if that's the truth. [Get in touch](/contact).",
      },
      { type: "h2", text: "Fix it if these describe your site" },
      {
        type: "list",
        items: [
          "**The design is dated but the site works**, and you can still update it yourself.",
          "**A few specific features are broken** while the rest is fine.",
          "**It's slow for fixable reasons** — oversized images, cheap hosting, script bloat — rather than fundamental ones. [Why your website is slow](/blogs/why-is-my-website-slow) covers how to tell the difference.",
          "**It's built on something current** and still supported.",
          "**You basically like it** and just want it modernised.",
        ],
      },
      {
        type: "p",
        text: "These are surface problems. Fixing is genuinely cheaper here, and a rebuild would be waste — including the search visibility you'd be putting at risk for no reason.",
      },
      { type: "h2", text: "Rebuild it if these describe your site" },
      {
        type: "list",
        items: [
          "**You can't edit your own site.** Every change means paying someone, because there's no CMS or the CMS is unusable. On its own, this is a strong rebuild signal.",
          "**It's built on something outdated or unsupported** — an abandoned theme, an end-of-life platform, dependencies nobody maintains.",
          "**It breaks whenever it's touched.** Fixing one thing breaks another — the classic sign of a fragile foundation.",
          "**It isn't mobile-friendly at its core.** Bolting responsiveness onto a site that wasn't built for it routinely costs more than starting clean.",
          "**Nobody can safely work on the code** — no version control, no documentation, no staging environment. Every change is a gamble.",
          "**You're locked out, or your developer has gone.** Sometimes a clean rebuild genuinely beats recovering a tangle you don't control — [taking over a website from another developer](/blogs/take-over-existing-website-developer) walks through that call.",
        ],
      },
      { type: "h2", text: "The trap: when fixing costs more than rebuilding" },
      {
        type: "p",
        text: "Here's the part nobody warns you about. On a badly-built site, **every fix takes longer than it should** — the person doing it has to understand someone else's decisions first, then work around problems they can't remove without breaking something else.",
      },
      {
        type: "p",
        text: "Three \"small fixes\" on a fragile site can cost more than a clean rebuild that eliminates the entire class of problem. The cheap-sounding option turns out to be the expensive one; you just pay it in instalments and end up with the same fragile site at the end. [What it costs to add features to an existing website](/blogs/cost-to-add-features-existing-website) explains the specific mechanisms that make this happen.",
      },
      { type: "h2", text: "How to actually decide" },
      {
        type: "p",
        text: "Four questions, in order:",
      },
      {
        type: "list",
        items: [
          "**Can I edit my own site today?** If no, that alone leans rebuild.",
          "**What's it built on, and is that still supported?** An outdated foundation leans rebuild.",
          "**Are the problems on the surface or underneath?** Surface leans fix; structural leans rebuild.",
          "**What will fixing cost over the next two years, not just now?** Add up the patches you expect, then compare that total to a rebuild. The instalment plan is often the bigger number.",
        ],
      },
      {
        type: "p",
        text: "A developer worth hiring will tell you honestly which side you're on — including \"just fix it\", which is the cheaper answer for them to give and the more trustworthy one to hear.",
      },
      { type: "h2", text: "What a rebuild costs in New Zealand" },
      {
        type: "p",
        text: "The same as any new site, because that's what it is. Published NZ ranges put a template small-business site at **$2,000–$5,000** and a custom 8–15 page build at **$5,990–$15,000 + GST** ([Lucid Media](https://www.lucidmedia.co.nz/guides/web-design-cost-nz/), [Fuel Design](https://www.fueldesign.co.nz/blog/how-much-does-a-website-cost-in-new-zealand-2026-pricing-guide/)). Fuller detail sits in [what a website costs in New Zealand](/blogs/website-cost-new-zealand-2026) and [website redesign costs](/blogs/website-redesign-cost-new-zealand).",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Get someone to look at what your site is actually built on before you decide anything. The answer usually isn't a judgement call — it's visible in the foundation within an hour. A dated but soundly-built site should be fixed. A fragile or unsupported one should be rebuilt, and the sooner you accept that, the less you spend patching your way to the same conclusion.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Is it cheaper to fix or rebuild a website?" },
      {
        type: "p",
        text: "Fixing is cheaper when the foundation is sound and the problems are on the surface. When the site runs on something outdated, can't be edited, or breaks whenever it's touched, repeated fixes often overtake the cost of a clean rebuild — because every change on a fragile site takes longer than it should and leaves the fragility in place. Compare the two-year total, not today's invoice.",
      },
      { type: "h3", text: "How do I know if my website needs rebuilding?" },
      {
        type: "p",
        text: "The clearest signals are structural: you can't edit it yourself, it's built on something outdated or unsupported, it breaks whenever it's changed, or it isn't mobile-friendly at its core. Surface problems — a dated look, slow pages, a few broken features — usually just need fixing. If several structural signals apply at once, that's your answer.",
      },
      { type: "h3", text: "Can an old website be modernised without a full rebuild?" },
      {
        type: "p",
        text: "Often yes, if the underlying build is sound. A dated design on a solid foundation can be refreshed far more cheaply than a rebuild, and you keep the search visibility the site has accumulated. It's when the foundation itself is the problem that modernising piecemeal stops being worth it.",
      },
      { type: "h3", text: "Will rebuilding my website hurt my Google rankings?" },
      {
        type: "p",
        text: "It can if it's handled carelessly, but it doesn't have to. A proper rebuild maps every old URL to its new equivalent, sets up 301 redirects, and carries the content and structure across intact. Rankings are lost to bad rebuilds, not to rebuilds as such — and redirect mapping is a line item worth checking for explicitly in any quote.",
      },
      { type: "h3", text: "How much does a website rebuild cost in NZ?" },
      {
        type: "p",
        text: "It depends on scope, exactly like a new build — published NZ ranges run $2,000–$5,000 for a template small-business site and $5,990–$15,000 + GST for a custom 8–15 page site. A rebuild of a site with logins, bookings or integrations is priced as an application instead, which starts considerably higher.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Find out three things about your current site: what it's built on, whether that's still supported, and whether there's version control. Those three answers decide this for you more reliably than any opinion about how it looks.",
      },
      {
        type: "p",
        text: "Send me the URL and I'll give you a straight assessment — fix or rebuild, and roughly what each would cost. Free, and I'll tell you to just fix it if that's the honest answer. [Get in touch](/contact), or [see recent work](/projects).",
      },
    ],
  },
  {
    slug: "why-web-development-quotes-differ",
    // 44 chars — withBrand() lands on 59.
    title: "Why Are Web Development Quotes So Different?",
    excerpt:
      "Same brief, quotes from $2k to $28k. What drives the gap — scope, who you hired, design depth, exclusions — and when the expensive quote is right.",
    coverImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop",
    category: "Pricing",
    publishedAt: "2026-08-14",
    tags: ["Pricing", "Hiring a Developer", "Small Business"],
    content: [
      {
        type: "p",
        text: "Four things explain nearly all of it: **scope** (the cheap quote priced fewer things, usually without saying which), **who you hired** (agency overhead, freelancer time and offshore volume are three different cost bases), **design depth** (template, semi-custom or built from scratch), and **what happens after launch** (support and maintenance included or excluded). Only one of those four is about skill. Three are about what got counted.",
      },
      {
        type: "p",
        text: "Same brief, same meeting, wildly different numbers. Here's what's actually behind the gap — and which parts of it are legitimate.",
      },
      {
        type: "p",
        text: "Got three quotes and no way to compare them? Send them over and I'll show you which line items genuinely differ — free, no strings. [Get in touch](/contact).",
      },
      { type: "h2", text: "1. You didn't send the same brief" },
      {
        type: "p",
        text: "You described the project verbally, three times, slightly differently. One developer heard \"booking system\", one heard \"contact form\", one heard \"we'll figure that out later\" — and all three priced what they heard.",
      },
      {
        type: "p",
        text: "The fix is one written brief sent to everyone. Most of the variance disappears immediately, and the differences that remain are the ones worth examining. [How to compare web developer quotes](/blogs/how-to-compare-web-developer-quotes) has the checklist for reading them once they arrive.",
      },
      { type: "h2", text: "2. Different business models, genuinely different costs" },
      {
        type: "table",
        headers: ["Who", "What you're paying for", "Published NZ rate"],
        rows: [
          ["Freelancer / solo developer", "One person's time, low overhead, direct communication, faster decisions", "$65–$110/hr junior–mid, $120–$175/hr senior"],
          ["Boutique studio (5–20 staff)", "Design, development and strategy together, with cover if someone is away", "$140–$220/hr blended"],
          ["Large agency", "Project managers, account managers, QA, offices — process and continuity", "$220–$320+/hr blended"],
          ["Offshore team", "Lower rates and higher volume, more variable communication and code quality", "$60–$120/hr apparent rate"],
        ],
        caption: "NZD bands published by Web Maniacs.",
      },
      {
        type: "p",
        text: "None of these is a scam. They're different products, and the mistake is comparing their prices as though they aren't. Full bands at [Web Maniacs](https://webmaniacs.co.nz/custom-web-application-development-pricing-nz/). One Auckland studio publishing its own numbers is blunt about the gap: CBD agencies typically quote [$15,000–$30,000+ for projects lower-overhead providers deliver for $4,000–$8,000](https://kingtide.nz/blog/website-design-auckland-cost), and attributes the difference to offices and account layers rather than capability.",
      },
      {
        type: "p",
        text: "Pay agency rates when you genuinely need agency breadth — brand strategy, multi-channel campaigns, real team depth. Below that, you're buying overhead. [Remote developer vs local agency](/blogs/remote-developer-vs-local-agency) covers the trade-off in more detail.",
      },
      { type: "h2", text: "3. Design is the biggest invisible variable" },
      {
        type: "p",
        text: "Two quotes can both say \"custom website design\" and mean completely different amounts of work. The three levels:",
      },
      { type: "h3", text: "Template" },
      {
        type: "p",
        text: "A bought theme, lightly customised with your colours, fonts and logo. The layout decisions were made by someone else for a generic business, and you're adapting to them. Fast, cheap, and genuinely fine for a business that needs to look credible and be found. Published NZ range for a template small-business site: **$2,000–$5,000** ([Lucid Media](https://www.lucidmedia.co.nz/guides/web-design-cost-nz/)).",
      },
      { type: "h3", text: "Semi-custom" },
      {
        type: "p",
        text: "A design system — typography, spacing, components, colour — applied to your brand and arranged for your content. Nobody starts from a blank canvas, but the pages are laid out for what you actually sell rather than for a demo. This is where most SMB work lands, and it's the band published at **$5,990–$15,000 + GST** for 8–15 pages ([Fuel Design](https://www.fueldesign.co.nz/blog/how-much-does-a-website-cost-in-new-zealand-2026-pricing-guide/)).",
      },
      { type: "h3", text: "Fully custom" },
      {
        type: "p",
        text: "A designer works on your project specifically — research, wireframes, iterations, a design language that's yours. What this buys is **decisions**: every page considered against what you're trying to make happen, rather than fitted into a layout that already existed.",
      },
      {
        type: "p",
        text: "It's worth paying for when the brand is the product, when the interface is genuinely novel, or when you're competing on experience rather than price. It's not worth paying for on a five-page site for a trades business, and **paying custom prices for a template is the most common overcharge in this market.** Ask which one you're getting, in writing.",
      },
      { type: "h2", text: "4. The cheap quote excludes what you'll need anyway" },
      {
        type: "p",
        text: "Common exclusions that reappear later as invoices:",
      },
      {
        type: "list",
        items: [
          "**Content writing** — the single most common one. \"Client to supply copy\" is a real dependency, and projects stall on it more than on anything else.",
          "**Image licensing** — stock photography that's actually licensed for commercial use.",
          "**A CMS**, so you can edit the site without paying someone.",
          "**Migration** of an existing site's content, and the redirect map that preserves your search rankings.",
          "**Hosting and SSL setup**, and who pays for them afterwards.",
          "**Post-launch fixes** — whether there's a warranty period on their own work.",
          "**Training and handover** — a recorded walkthrough beats a PDF nobody opens.",
          "**Testing** — which browsers, which devices, stated explicitly.",
        ],
      },
      {
        type: "p",
        text: "Add the exclusions back and the cheap quote often lands mid-range. Sometimes above it — which is why the itemised comparison matters more than the totals.",
      },
      { type: "h2", text: "5. Sometimes the expensive quote is right" },
      {
        type: "p",
        text: "The expensive quote isn't automatically padding. It's the correct price when the brief hides real risk, and the honest version of that conversation sounds like this:",
      },
      {
        type: "list",
        items: [
          "**Integrations with systems that break.** Your quote depends on someone else's API — its rate limits, its downtime, and what happens when a sync fails halfway through. That risk has to be priced by whoever carries it.",
          "**Data migration.** Moving thousands of records from a system that stored them inconsistently is slow, unglamorous work that can't be skipped.",
          "**Permissions and sensitive data.** Multiple user types seeing different views of the same records is engineering, not configuration — see [what a customer portal costs](/blogs/customer-portal-development-cost).",
          "**Accessibility and compliance requirements**, when they're contractual rather than aspirational.",
          "**Real traffic.** A site that has to stay up under load is a different engineering problem from one that doesn't.",
        ],
      },
      {
        type: "p",
        text: "A developer who identifies these before quoting is showing you they've read the brief. One who doesn't mention them is either not seeing them yet, or planning to bill for them later.",
      },
      { type: "h2", text: "When to be suspicious of a low quote" },
      {
        type: "list",
        items: [
          "No written scope, or a single-line total",
          "No ownership clause covering code, domain and hosting",
          "100% payment up front",
          "A timeline that ignores your content and approvals",
          "Won't show live work you can open yourself",
          "Promises specific Google rankings",
        ],
      },
      {
        type: "p",
        text: "Any one of these is a question. Two or more is a pattern.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Write one brief. Send it to everyone. Ask each quote to itemise what's included **and what's excluded** — the exclusions list is more informative than the inclusions list, and good providers write it quickly because they've been burned before.",
      },
      {
        type: "p",
        text: "Then expect to pay somewhere in the middle. The cheapest quote is usually incomplete and the most expensive is usually carrying overhead you don't need.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Is a cheap web developer a red flag?" },
      {
        type: "p",
        text: "Not by itself — a solo developer with low overhead is genuinely cheaper than an agency for the same work, and NZ published rates bear that out at $65–$175/hr freelance against $220–$320+/hr for a large agency. The red flags are structural rather than numerical: no written scope, no ownership clause, full payment up front, or a price that only looks low because content, migration, training and post-launch support were quietly left out.",
      },
      { type: "h3", text: "How much should a small business website cost in New Zealand?" },
      {
        type: "p",
        text: "Published NZ ranges put a template small-business site at $2,000–$5,000, a custom 8–15 page build at $5,990–$15,000 + GST, and a fully custom or premium build at $15,000–$30,000+. Most established small businesses land in the middle band. Ongoing costs run about $39–$99/month hosting and $50–$200/month maintenance on top.",
      },
      { type: "h3", text: "Why do agencies charge so much more than freelancers?" },
      {
        type: "p",
        text: "Because you're paying for a different structure, not different code. An agency rate covers project managers, account managers, designers, QA and premises; a freelance rate covers one person's time. NZ providers put the blended agency rate at $140–$320+/hr against $65–$175/hr freelance. That's worth paying when you need brand strategy, multi-channel work or genuine team depth — and it's overhead when you don't.",
      },
      { type: "h3", text: "Can I negotiate a web development quote?" },
      {
        type: "p",
        text: "Negotiate the scope, not the price. Asking a developer to do the same work for less money usually means they take it out somewhere you won't see until later — testing, revisions, or post-launch support. Asking what you could cut to reach your budget is a better conversation, and a good developer will have suggestions ready, often starting with phasing the project.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Take the three quotes you already have and write out, side by side, what each one excludes. That single exercise usually explains the entire price gap without anyone needing to defend their number.",
      },
      {
        type: "p",
        text: "If you'd rather have a second opinion, send them to me with your brief and I'll tell you what's missing and what I'd question — including when one of them is a good quote. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "customer-portal-development-cost",
    // 42 chars — withBrand() lands on 57.
    title: "What Does a Customer Portal Cost to Build?",
    excerpt:
      "Logins, roles and permissions — what a customer portal really costs to build in NZ and Cyprus, what drives the price, and when you don't need one.",
    coverImage:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
    category: "Pricing",
    publishedAt: "2026-08-14",
    tags: ["Pricing", "Web Development", "New Zealand", "Cyprus"],
    content: [
      {
        type: "p",
        text: "In New Zealand, published ranges put a **simple portal or internal tool at $15,000–$40,000**, a **mid-complexity platform at $40,000–$120,000**, and enterprise builds well above that. The number is driven far more by **roles and permissions** than by screens — the cost scales with how many distinct answers there are to \"who is allowed to see or change this record?\", not with how many pages you draw.",
      },
      {
        type: "p",
        text: "That's the part most portal quotes get wrong, and it's why two quotes for \"a customer portal\" can differ by a factor of five.",
      },
      {
        type: "p",
        text: "Want to know which band you're in? Tell me who logs in and what each type of user is allowed to see, and I'll tell you honestly — including if an off-the-shelf tool would serve you better. [Get in touch](/contact).",
      },
      { type: "h2", text: "What a customer portal actually is" },
      {
        type: "p",
        text: "A portal is a logged-in area where **the same underlying records look different depending on who's looking at them.** A customer sees their own orders, invoices and documents; your staff see all customers; a manager sees staff activity as well.",
      },
      {
        type: "p",
        text: "That definition matters because it separates a portal from a login. A login proves who someone is. A portal decides what they're allowed to do — and the second problem is much harder than the first. If you only need the door rather than the building, [what it costs to add a customer login](/blogs/customer-login-website-cost) is the cheaper conversation.",
      },
      { type: "h2", text: "What drives the cost" },
      { type: "h3", text: "1. Roles and permissions — the dominant factor" },
      {
        type: "p",
        text: "One role is a feature. Two roles is a feature with a condition. Four roles with overlapping rules — where a manager can see a staff member's records but not another manager's, and a customer can see their own invoices but not their neighbour's — is an authorisation model, and it has to be designed before anything gets built.",
      },
      {
        type: "p",
        text: "The rule that keeps it safe is that permissions are enforced on the server, so **the UI only ever hides what the API already refuses.** On the [hospital system I built](/projects/hospital-management-system), role-based access was designed first for exactly that reason: reception, doctors and administrators all need the same patient record, each needing it to show something different, and getting that wrong isn't a UI bug — it's a records breach. Removing the client-side check by hand gets you a refusal, not a patient record. A hidden button is a convenience, never a security boundary.",
      },
      { type: "h3", text: "2. Integrations" },
      {
        type: "p",
        text: "A portal that shows data is cheap. A portal that shows data **from your accounting system, your CRM and your inventory** is priced by the quality of those systems' APIs — their rate limits, their downtime, and what your portal does when a sync fails halfway through. This is the line item most likely to be underestimated by whoever quotes it.",
      },
      { type: "h3", text: "3. Data volume and shape" },
      {
        type: "p",
        text: "Ten thousand records and five hundred thousand are different engineering problems. Beyond a certain size, screens have to be paginated, searches have to be indexed on the fields people actually search by, and reports have to be computed on the server rather than assembled in the browser.",
      },
      { type: "h3", text: "4. Security requirements" },
      {
        type: "p",
        text: "If the portal holds health, financial or personal data, the requirements stop being technical preferences and start being obligations — encryption at rest, audit logging of who accessed what, and a retention policy. NZ providers price **penetration testing at $3,000–$8,000** as a separate line ([Web Maniacs](https://webmaniacs.co.nz/custom-web-application-development-pricing-nz/)), and on a portal holding sensitive records that's money well spent.",
      },
      { type: "h2", text: "Published ranges" },
      { type: "h3", text: "New Zealand (NZD)" },
      {
        type: "table",
        headers: ["Tier", "Published range", "Typical timeline"],
        rows: [
          ["Simple internal tool or MVP portal", "$15,000–$40,000", "6–12 weeks"],
          ["Mid-complexity platform", "$40,000–$120,000", "3–6 months"],
          ["Enterprise / complex platform", "$120,000–$500,000+", "6–18 months"],
        ],
        caption: "Source: Web Maniacs. A second NZ provider, Kweb, puts a simple MVP at $10,000–$20,000 and a mid-range business application at $20,000–$50,000.",
      },
      {
        type: "p",
        text: "The overlap between those two sources is real and worth understanding: the low end assumes a tightly scoped MVP with one or two roles, and the high end assumes the permission model described above. Sources: [Web Maniacs](https://webmaniacs.co.nz/custom-web-application-development-pricing-nz/) and [Kweb](https://kweb.app/blog/how-much-does-a-custom-web-app-cost-in-new-zealand-2026).",
      },
      { type: "h3", text: "Cyprus (EUR)" },
      {
        type: "p",
        text: "Cyprus providers publish less detail on application work than on websites, but the relevant bands are **€6,000+ for a custom or advanced platform** ([Bandziuk](https://www.bandziuk.com/blog/website-development-cost-in-cyprus)) and **€12,000–€35,000 for a premium or headless build** ([Uveler](https://uveler.com/blogs/marketing-agency-cost-cyprus/)). Ongoing maintenance runs €100–€500/month.",
      },
      { type: "h3", text: "The costs quotes usually leave out" },
      {
        type: "table",
        headers: ["Item", "Published NZD range"],
        rows: [
          ["Discovery phase before the build is priced", "$5,000–$15,000"],
          ["Hosting and infrastructure", "$200–$2,000/month"],
          ["Support retainer, mid-complexity", "$1,500–$5,000/month"],
          ["Annual maintenance allowance", "15–20% of the original build cost per year"],
          ["Penetration testing", "$3,000–$8,000"],
        ],
        caption: "Source: Web Maniacs.",
      },
      {
        type: "p",
        text: "That maintenance figure is the one people budget for least and regret most. A portal nobody maintains becomes a security liability within about a year, because it holds user accounts and the dependencies underneath it keep aging whether or not anyone is watching.",
      },
      { type: "h2", text: "Build vs off-the-shelf" },
      {
        type: "p",
        text: "Before commissioning anything, check whether the portal you want already exists as a product. Client portals for accountants, law firms, agencies and trades are mature categories, and a subscription that works today usually beats a custom build you also have to maintain.",
      },
      {
        type: "p",
        text: "**Build custom when** your permission rules can't be expressed in the off-the-shelf tool, when the portal is genuinely part of your product rather than an admin convenience, or when integrating your existing systems is the whole point. **Buy off-the-shelf when** you mainly need to share documents and status with customers, which is most of the time.",
      },
      { type: "h2", text: "When a shared folder and an email would do" },
      {
        type: "p",
        text: "Worth saying plainly, because it's the answer more often than the industry admits. If you have **under about fifty customers**, each needs to see **only their own documents**, and the documents change **rarely**, then a well-organised shared drive with per-client folders plus an email when something changes will do the job for effectively nothing.",
      },
      {
        type: "p",
        text: "The point at which that stops working is when you're spending real time on the manual version, when customers ask \"where's my file?\" often enough to be a support cost, or when you need an audit trail of who saw what and when. Until then, a $40,000 portal is solving a problem you don't have yet.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Write a permissions table before you talk to anyone: every type of user down one side, every type of record across the top, and in each cell whether that user can see it, edit it, or neither. It takes an hour.",
      },
      {
        type: "p",
        text: "That table is the actual specification of your portal. It's what a developer needs to quote accurately, it's what turns incomparable quotes into comparable ones, and filling it in frequently reveals that you need three roles rather than the six you assumed — which is the cheapest scope reduction available to you.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How much does it cost to build a customer portal?" },
      {
        type: "p",
        text: "Published NZ ranges put a simple portal or internal tool at $15,000–$40,000, a mid-complexity platform at $40,000–$120,000, and enterprise builds at $120,000 and up. A second NZ provider quotes $10,000–$20,000 for a tightly scoped MVP. The variable that moves the number most is the number of distinct user roles and the rules governing what each can see.",
      },
      { type: "h3", text: "What's the difference between a customer portal and a login?" },
      {
        type: "p",
        text: "A login proves who someone is; a portal decides what they're allowed to do. In a portal the same underlying records look different depending on who is looking — a customer sees their own invoices, staff see all customers, a manager sees staff activity too. That authorisation model is the expensive part, and it's why portals are priced as software rather than as pages.",
      },
      { type: "h3", text: "Should I build a custom portal or buy one?" },
      {
        type: "p",
        text: "Buy off-the-shelf if you mainly need to share documents and status with customers — client portals are a mature product category and a subscription beats a build you also have to maintain. Build custom when your permission rules can't be expressed in the ready-made tool, when the portal is part of your product rather than an admin convenience, or when integrating your existing systems is the actual point of the project.",
      },
      { type: "h3", text: "What are the ongoing costs of a customer portal?" },
      {
        type: "p",
        text: "In NZ, published figures are $200–$2,000/month for hosting and infrastructure, $1,500–$5,000/month for a mid-complexity support retainer, and an annual maintenance allowance of 15–20% of the original build cost. Budget the maintenance explicitly — a portal holds user accounts, and one nobody maintains becomes a security liability within about a year.",
      },
      { type: "h3", text: "How do I keep portal permissions secure?" },
      {
        type: "p",
        text: "Enforce them on the server, so the interface only ever hides what the API already refuses. If someone removes a client-side check by hand they should get a refusal rather than the data. Ask any developer directly where permissions are enforced — if the answer is about hiding buttons or routes in the front end, that's not a security boundary, and on a portal holding customer data it's the difference between a UI bug and a breach.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Fill in the permissions table. If it has two roles and one record type, you may not need a portal at all. If it has six roles and eight record types, you now have the document that will save you the most money in this entire project.",
      },
      {
        type: "p",
        text: "Send it to me and I'll tell you what band you're in and where the risk sits — free, and including the cases where I'd point you at an existing product instead. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "cost-to-hire-web-developer-2026",
    // 45 chars — withBrand() lands on 60.
    title: "What It Costs to Hire a Web Developer in 2026",
    excerpt:
      "Published 2026 rates for hiring a web developer in New Zealand and Cyprus — hourly, fixed-price and retainer, in NZD and EUR, with sources.",
    coverImage:
      "https://images.unsplash.com/photo-1521791136064-7986c2920216?w=800&h=450&fit=crop",
    category: "Pricing",
    publishedAt: "2026-08-14",
    tags: ["Pricing", "Hiring a Developer", "New Zealand", "Cyprus"],
    content: [
      {
        type: "p",
        text: "In New Zealand, published 2026 rates run **$65–$110/hr** for a junior-to-mid freelancer, **$120–$175/hr** for a senior or specialist, **$140–$220/hr** blended at a boutique studio and **$220–$320+/hr** at a large agency. Fixed-price sites run **$2,000–$5,000** for a template build and **$5,990–$15,000 + GST** for a custom one. In Cyprus, sites run **€500–€3,500** for most business builds, with ongoing freelance engagements at **€500–€2,000/month**.",
      },
      {
        type: "p",
        text: "Every figure below comes from a provider that publishes its own numbers, cited so you can check it. NZ figures are in NZD and Cyprus figures in EUR — they're kept in separate sections deliberately, because mixing currencies in a cost guide is how people end up budgeting 60% wrong.",
      },
      {
        type: "p",
        text: "Want a number for your actual project rather than a range? Describe what you need it to do and I'll give you a realistic scope and price — free, before you commit to anything. [Get in touch](/contact).",
      },
      { type: "h2", text: "New Zealand — hourly rates (NZD)" },
      {
        type: "table",
        headers: ["Who you're hiring", "Published rate", "What you're paying for"],
        rows: [
          ["Freelancer, junior to mid", "$65–$110/hr", "One person's time, minimal overhead, direct contact"],
          ["Freelancer, senior or specialist", "$120–$175/hr", "Experience and judgement — fewer hours to the same result"],
          ["Boutique studio, 5–20 staff", "$140–$220/hr blended", "Design, build and strategy together, with cover when someone is away"],
          ["Large enterprise agency", "$220–$320+/hr blended", "Project and account management, QA, process, premises"],
          ["Offshore team managed from NZ", "$60–$120/hr apparent", "Lower rates, higher volume, more variable communication"],
        ],
        caption: "Source: Web Maniacs, custom web application pricing NZ.",
      },
      {
        type: "p",
        text: "Full bands at [Web Maniacs](https://webmaniacs.co.nz/custom-web-application-development-pricing-nz/). Content changes and small edits on an existing site are commonly billed lower, at **$50–$150/hr** ([Fuel Design](https://www.fueldesign.co.nz/blog/how-much-does-a-website-cost-in-new-zealand-2026-pricing-guide/)).",
      },
      {
        type: "p",
        text: "The senior-versus-junior gap is worth reading carefully. A senior at $175/hr who finishes in twelve hours costs less than a junior at $90/hr who takes thirty and needs review — which is why **you should always ask for estimated hours alongside the rate.** A rate on its own tells you nothing about the invoice.",
      },
      { type: "h2", text: "New Zealand — fixed project prices (NZD)" },
      {
        type: "table",
        headers: ["Project", "Published range", "Source"],
        rows: [
          ["Landing / single-page site", "$1,500–$3,000 + GST", "Fuel Design"],
          ["Template small-business site", "$2,000–$5,000", "Lucid Media"],
          ["Small business site, 5–8 pages", "$3,990–$8,000 + GST", "Fuel Design"],
          ["Custom business site, 8–15 pages", "$5,990–$15,000 + GST", "Fuel Design"],
          ["Premium / fully custom build", "$15,000–$30,000+", "Lucid Media"],
          ["E-commerce, standard", "$4,990–$15,000 + GST", "Fuel Design"],
          ["Simple web app or internal tool", "$15,000–$40,000", "Web Maniacs"],
          ["Mid-complexity platform or portal", "$40,000–$120,000", "Web Maniacs"],
        ],
      },
      {
        type: "p",
        text: "Sources: [Fuel Design](https://www.fueldesign.co.nz/blog/how-much-does-a-website-cost-in-new-zealand-2026-pricing-guide/), [Lucid Media](https://www.lucidmedia.co.nz/guides/web-design-cost-nz/), [Web Maniacs](https://webmaniacs.co.nz/custom-web-application-development-pricing-nz/). More depth in [what a website costs in New Zealand](/blogs/website-cost-new-zealand-2026).",
      },
      { type: "h2", text: "New Zealand — ongoing and retainer (NZD)" },
      {
        type: "table",
        headers: ["Item", "Published range"],
        rows: [
          ["Hosting, small business site", "$39–$99/month"],
          ["Domain renewal", "$25–$50/year"],
          ["Maintenance retainer, website", "$50–$200/month"],
          ["Support retainer, mid-complexity application", "$1,500–$5,000/month"],
          ["Hosting and infrastructure, application", "$200–$2,000/month"],
          ["Annual maintenance allowance, custom software", "15–20% of build cost per year"],
          ["Discovery phase before an application build", "$5,000–$15,000"],
        ],
      },
      {
        type: "p",
        text: "The full year-one picture is in [annual website maintenance costs in NZ](/blogs/annual-website-maintenance-costs-nz). The figure worth internalising is the last one: **budget 15–20% of the build cost per year** to keep custom software current. It's the line most often omitted and most often regretted.",
      },
      { type: "h2", text: "Cyprus — project prices (EUR)" },
      {
        type: "table",
        headers: ["Project", "Published range", "Source"],
        rows: [
          ["Starter site, 3–5 pages", "€500–€1,000", "Cyprus Digital Agency, Bandziuk"],
          ["Small business site", "€900–€2,500", "Bandziuk"],
          ["Business growth site, 10+ pages", "€1,200–€3,000", "Cyprus Digital Agency"],
          ["Corporate site", "€1,500–€3,500", "Bandziuk"],
          ["Mid-range custom build, 10–20 pages", "€4,500–€12,000", "Uveler"],
          ["E-commerce", "€2,500–€10,000", "Bandziuk, Uveler"],
          ["Premium or headless build", "€12,000–€35,000", "Uveler"],
        ],
      },
      {
        type: "p",
        text: "Sources: [Cyprus Digital Agency](https://cyprusdigitalagency.com/website-design-cost-in-cyprus-2026/), [Bandziuk](https://www.bandziuk.com/blog/website-development-cost-in-cyprus), [Uveler](https://uveler.com/blogs/marketing-agency-cost-cyprus/). Note the gap between the low sources and Uveler's bands — that's the template-versus-custom distinction showing up as a price difference rather than a described one, which is exactly why [quotes differ so much](/blogs/why-web-development-quotes-differ).",
      },
      {
        type: "p",
        text: "One Cyprus-specific cost: **adding Greek and English versions typically adds around 20%** to a project. Budget it from the start rather than as a phase two, because retrofitting a second language is more expensive than building for two.",
      },
      { type: "h2", text: "Cyprus — ongoing and retainer (EUR)" },
      {
        type: "table",
        headers: ["Item", "Published range"],
        rows: [
          ["Hosting", "€60–€200/year"],
          ["Domain", "€10–€20/year"],
          ["Hosting and domain bundled", "€80–€180/year"],
          ["Maintenance", "€100–€500/month"],
          ["Freelance ongoing engagement", "€500–€2,000/month"],
          ["Full-service agency retainer", "€3,500–€12,000+/month"],
        ],
      },
      {
        type: "p",
        text: "More detail in [what a website costs in Cyprus](/blogs/website-cost-cyprus-2026).",
      },
      { type: "h2", text: "What actually moves the number" },
      {
        type: "list",
        items: [
          "**Scope, above everything else.** Page count barely matters; features, integrations and user roles do. A five-page site with a booking system costs more than a twenty-page brochure site.",
          "**Design depth** — template, semi-custom or built from scratch. This alone can double a quote and is frequently not stated.",
          "**Who you hire.** The same brief genuinely costs different amounts from a freelancer, a studio and an agency, because you're buying different structures.",
          "**Content.** If you're supplying it, the project is cheaper and slower. If they're writing it, it's more expensive and faster. Decide deliberately.",
          "**Integrations.** Anything that has to talk to another system is priced by that system's API quality, not by your requirements.",
          "**Deadlines.** Compressed timelines cost more everywhere, because they mean overtime or additional people.",
        ],
      },
      { type: "h2", text: "How I price, and why" },
      {
        type: "p",
        text: "For transparency, since this post is full of other people's numbers: I work **fixed-scope and fixed-price**, as a solo developer without agency overhead. You get a written scope and a number that doesn't move unless the scope does.",
      },
      {
        type: "p",
        text: "The honest trade-off is that fixed-price only works when the scope is genuinely settled first, so there's more work up front before anyone starts building — and genuinely exploratory projects are a poor fit for it. [Hourly vs fixed price](/blogs/hourly-vs-fixed-price-web-developer) covers when each is the right choice, including the cases where hourly serves you better. Current scope and package details are on [my services page](/services).",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "What is the hourly rate for a web developer in New Zealand?" },
      {
        type: "p",
        text: "Published 2026 NZ rates run $65–$110/hr for a junior-to-mid freelancer, $120–$175/hr for a senior or specialist, $140–$220/hr blended at a boutique studio, and $220–$320+/hr at a large enterprise agency. Small content edits on an existing site are commonly billed at $50–$150/hr. Always ask for estimated hours alongside the rate — a senior at a higher rate can be cheaper in total.",
      },
      { type: "h3", text: "How much does it cost to hire a web developer in Cyprus?" },
      {
        type: "p",
        text: "Published Cyprus ranges put a starter site at €500–€1,000, a small business site at €900–€2,500, a corporate site at €1,500–€3,500, and a mid-range custom build at €4,500–€12,000. Ongoing work runs €500–€2,000/month with a freelancer against €3,500–€12,000+/month for a full-service agency retainer. Adding a second language typically adds around 20%.",
      },
      { type: "h3", text: "Is it cheaper to hire a freelancer than an agency?" },
      {
        type: "p",
        text: "Yes, substantially — NZ published rates put freelancers at $65–$175/hr against $220–$320+/hr blended for a large agency, and NZ providers themselves describe the difference as overhead rather than capability. The trade-off is single-point-of-failure risk: one person gets sick, takes holidays, or has other clients. Ask about capacity and handover before deciding.",
      },
      { type: "h3", text: "What are the hidden costs of hiring a web developer?" },
      {
        type: "p",
        text: "The ones most often left out of a quote are content writing, image licensing, migration of an existing site with its redirect map, training and handover, and post-launch support. Then the recurring ones: hosting at $39–$99/month in NZ, domain renewal, and maintenance at $50–$200/month for a site or 15–20% of build cost per year for custom software.",
      },
      // Deliberately NOT "should I pay hourly or fixed price" — that question
      // is owned by /blogs/hourly-vs-fixed-price-web-developer, and having the
      // identical string in two FAQPage blocks is a cannibalisation signal.
      { type: "h3", text: "How much should I budget for a web developer in year one?" },
      {
        type: "p",
        text: "Add the build price to twelve months of running costs, because the second number is the one people leave out. In NZ that means hosting at $39–$99/month, domain renewal at $25–$50/year, and maintenance at $50–$200/month on a website or 15–20% of the build cost per year on custom software. A $6,000 site is realistically $7,000–$9,000 across its first year. Whether you pay for the build [hourly or as a fixed price](/blogs/hourly-vs-fixed-price-web-developer) is a separate decision.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Decide which band your project is in before you ask anyone for a price. A brochure site, a custom marketing site and an application are three different purchases, and knowing which one you're making protects you from being sold the next one up.",
      },
      {
        type: "p",
        text: "If you're unsure which band you're in, describe what the site or app has to do and I'll tell you — including when the answer is that you need less than you were quoted for. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "what-should-be-in-web-development-quote",
    // 41 chars — withBrand() lands on 56.
    title: "What Should Be in a Web Development Quote?",
    excerpt:
      "A proper quote names scope, exclusions, ownership, revisions, payment and change costs. The full checklist — and what a missing line really means.",
    coverImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-14",
    tags: ["Hiring a Developer", "Pricing", "Small Business"],
    content: [
      {
        type: "p",
        text: "A web development quote should name **eleven things**: scope, deliverables, exclusions, ownership, revisions, timeline with your obligations, payment schedule, the change-request rate, post-launch support, ongoing costs, and what happens if either side walks away. A quote missing any of them isn't cheaper — it's incomplete, and the gap becomes an invoice later.",
      },
      {
        type: "p",
        text: "This is the checklist version. Print it, open your quote beside it, and tick line by line. If you want the reasoning behind each check rather than the list, [how to compare web developer quotes](/blogs/how-to-compare-web-developer-quotes) is the fuller version.",
      },
      {
        type: "p",
        text: "Want me to run this checklist over a quote you've received? Send it across — free, and I'll tell you if it's a good quote. [Get in touch](/contact).",
      },
      { type: "h2", text: "The checklist" },
      { type: "h3", text: "1. Scope — what's being built" },
      {
        type: "p",
        text: "Pages named individually. Features described by what they do. Integrations named by product. **If you can't tell from the quote what you're getting, neither can the developer** — and that ambiguity resolves in whichever direction is cheaper for them once work starts.",
      },
      {
        type: "p",
        text: "What a missing line means: every future disagreement becomes your word against theirs.",
      },
      { type: "h3", text: "2. Deliverables — what you actually receive" },
      {
        type: "p",
        text: "A live website is one deliverable. The others are frequently assumed and rarely listed: source code, design files, the CMS with your content in it, documentation, and any accounts created on your behalf.",
      },
      { type: "h3", text: "3. Exclusions — the most-skipped line, and the most useful" },
      {
        type: "p",
        text: "**Ask for this explicitly if it isn't there.** Good providers write an exclusions list quickly, because they've been burned before; vague answers here are where variation invoices are born. The usual suspects: content writing, image licensing, migration of an existing site, redirect mapping, third-party subscription fees, training, and anything described in a meeting but not in the document.",
      },
      { type: "h3", text: "4. Ownership — who owns what, and when" },
      {
        type: "p",
        text: "The clause should say that on final payment you own the code, the domain (registered in your name), the hosting account, and the design files. Get the specific list rather than a general assurance.",
      },
      {
        type: "p",
        text: "What a missing line means: you may be renting your website without knowing it. This is the single most expensive omission on the list, and it surfaces years later — see [taking over a website from another developer](/blogs/take-over-existing-website-developer) for what it costs to unwind.",
      },
      { type: "h3", text: "5. Revisions — how many, and what counts as one" },
      {
        type: "p",
        text: "A number, attached to a stage. \"Two rounds at design, one at build\" is a real term. \"Unlimited revisions\" is either untrue or already priced in. Check whether a round means one batch of consolidated feedback or one individual change — the difference is enormous.",
      },
      { type: "h3", text: "6. Timeline — including what you have to do" },
      {
        type: "p",
        text: "Dates for the developer's milestones, and dates for **your** content, feedback and approvals. A timeline that names only their obligations will slip, and the argument about whose fault it was is avoidable by writing both sides down now.",
      },
      { type: "h3", text: "7. Payment schedule" },
      {
        type: "p",
        text: "Roughly a third up front with the remainder tied to milestones or launch is standard for freelancers and small studios. **100% up front to someone you've never worked with is not**, and it removes your only leverage if the project stalls. Watch for a final payment due before you've seen the finished site.",
      },
      { type: "h3", text: "8. Change requests — the rate and the process" },
      {
        type: "p",
        text: "An hourly rate for out-of-scope work, and a stated process: request, written quote, approval, then work. NZ providers commonly bill changes at $50–$150/hr for content-level work and their standard rate above that.",
      },
      {
        type: "p",
        text: "What a missing line means: every new idea becomes a negotiation, and every verbal agreement becomes a dispute about what was agreed.",
      },
      { type: "h3", text: "9. Post-launch support" },
      {
        type: "p",
        text: "Is there a warranty period on their own work, and how long? Thirty days of bug fixes on defects they introduced is a common and reasonable term. Distinguish clearly between **fixing what's broken** (should be free within the warranty) and **changing what works** (a change request).",
      },
      { type: "h3", text: "10. Ongoing costs — all of them" },
      {
        type: "p",
        text: "Hosting, domain, SSL, maintenance, and any third-party subscriptions the build depends on. NZ published figures: hosting $39–$99/month, domain $25–$50/year, maintenance $50–$200/month. In Cyprus, maintenance runs €100–€500/month with hosting and domain around €80–€180/year.",
      },
      {
        type: "p",
        text: "Ask for the **twelve-month total**, not the build price. That's the number you're actually committing to.",
      },
      { type: "h3", text: "11. What happens if either party walks away" },
      {
        type: "p",
        text: "The clause nobody wants to discuss and everybody needs. What do you owe for work completed? What do you receive — does partial work transfer to you, and in what form? How much notice does either side give? This matters most when the relationship is going badly, which is exactly when nobody wants to negotiate it from scratch.",
      },
      { type: "h2", text: "Copy this into your reply" },
      {
        type: "p",
        text: "If a quote is missing several of the above, you don't need to write a careful email. Send this:",
      },
      {
        type: "code",
        lang: "text",
        code: `Thanks for this. Before I compare it properly, could you confirm in writing:

1. What's explicitly NOT included in this price?
2. On final payment, do I own the code, the domain (in my name),
   the hosting account and the design files?
3. How many revision rounds, at which stages, and does a round mean
   one batch of feedback or one change?
4. What do you need from me, and by when?
5. What's the payment schedule?
6. What's the rate for work outside this scope?
7. Is there a warranty period on defects after launch?
8. What are the total ongoing costs for the first 12 months?

Happy to jump on a call, but I'd like these in writing so I can
compare quotes side by side.`,
      },
      {
        type: "p",
        text: "The wording of the answers usually tells you more than their content. Fast, specific replies mean someone who has done this before. Defensiveness about question 1 or question 2 is the signal you came for.",
      },
      { type: "h2", text: "What a good quote looks like" },
      {
        type: "p",
        text: "It constrains the developer as much as it constrains you. It names what's excluded before you ask. It states what happens when things change, because things change. And it tells you what you have to do and when — which is the part that most often decides whether a project lands on time.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "What should a website quote include?" },
      {
        type: "p",
        text: "Scope with pages and features named, deliverables, an explicit exclusions list, an ownership clause covering code, domain, hosting and design files, the number of revision rounds and what counts as one, a timeline that names your obligations as well as theirs, a payment schedule, the rate for out-of-scope changes, any post-launch warranty, all ongoing costs, and what happens if either party terminates.",
      },
      { type: "h3", text: "What's usually left out of a web development quote?" },
      {
        type: "p",
        text: "Exclusions, most often — which is why asking for them directly is the highest-value question you can ask. After that: content writing, image licensing, migration and redirect mapping from an old site, training and handover, third-party subscription fees, and the twelve-month total of hosting and maintenance rather than just the build price.",
      },
      { type: "h3", text: "Is a one-page website quote a bad sign?" },
      {
        type: "p",
        text: "Length isn't the issue; specificity is. A one-page quote that names the pages, the exclusions, the ownership terms and the payment schedule is better than five pages of marketing copy around a single total. A quote reading \"Website — $3,500\" can't be compared with anything, and won't help either of you when you ask for something that was never priced.",
      },
      { type: "h3", text: "Should a web developer quote include ongoing costs?" },
      {
        type: "p",
        text: "Yes, and a quote that omits them isn't cheaper — it's incomplete. Hosting, domain renewal, SSL, maintenance and any third-party subscriptions the build depends on all continue after launch. Ask for the twelve-month total, since that's the figure you're actually committing to rather than the one-off build price.",
      },
      { type: "h3", text: "What if the developer won't put the scope in writing?" },
      {
        type: "p",
        text: "Treat that as your answer. \"We'll figure it out as we go\" reliably means you'll pay for it as you go, and without a written scope you have no basis for saying that something should have been included. Even a single page covering scope, price, timeline, ownership and payment protects both sides — and a developer who resists writing one is telling you how disputes will go.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Send the eight questions above to everyone who has quoted you. It takes two minutes, the replies arrive in writing so you can compare them side by side, and the quality of the answers will sort the field faster than the prices will.",
      },
      {
        type: "p",
        text: "If you'd like a second opinion on what comes back, send it to me. Free, no expectation you hire me, and I'll say so if the quote is a good one. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "hourly-vs-fixed-price-web-developer",
    // 45 chars — withBrand() lands on 60.
    title: "Hourly or Fixed Price? Paying a Web Developer",
    excerpt:
      "Fixed price protects your budget. Hourly protects your flexibility. Which fits your project, when each goes wrong, and why fixed price needs a scope.",
    coverImage:
      "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-14",
    tags: ["Hiring a Developer", "Pricing", "Small Business"],
    content: [
      {
        type: "p",
        text: "**Fixed price** when the scope can be written down before work starts — it protects your budget and moves the estimating risk to the developer. **Hourly** when the work is genuinely exploratory, ongoing, or likely to change direction — it protects your flexibility and stops you paying a padding premium for uncertainty. **Retainer** when the work never really ends. Neither of the first two is more honest than the other; they allocate the same risk to different people.",
      },
      {
        type: "p",
        text: "That last point is the one that gets lost. Every project carries the risk that it takes longer than anyone thought. Fixed price puts that risk on the developer, and they price it in. Hourly puts it on you, and you pay it only if it materialises.",
      },
      {
        type: "p",
        text: "Not sure which fits your project? Describe what you're trying to build and I'll tell you which model I'd use and why — including when I'd say hourly, which isn't how I usually work. [Get in touch](/contact).",
      },
      { type: "h2", text: "Fixed price" },
      { type: "h3", text: "What it protects" },
      {
        type: "p",
        text: "Your budget, absolutely. You know the number before you commit, you can get board or partner approval against it, and an overrun is the developer's problem rather than yours. For a business that needs to plan cash flow, this is worth a great deal.",
      },
      {
        type: "p",
        text: "It also forces a useful conversation. A developer can't quote a fixed price without understanding the project, so **the estimating work happens before you commit money** instead of being discovered afterwards.",
      },
      { type: "h3", text: "What it costs you" },
      {
        type: "p",
        text: "Two things, and both are real:",
      },
      {
        type: "list",
        items: [
          "**A risk premium.** The developer is carrying the overrun risk, so the price includes a buffer for it. On a well-understood project that buffer is small. On a vague one it's large, because it has to be.",
          "**Change friction.** Once the scope is fixed, every new idea is a variation with a price attached. That's the mechanism working as designed, but it can feel adversarial mid-project — especially when the new idea is obviously good.",
        ],
      },
      { type: "h3", text: "When it goes wrong" },
      {
        type: "p",
        text: "When the scope wasn't actually settled. A fixed price on an unclear brief is the worst of both worlds: you pay the uncertainty premium *and* you still end up in change-request conversations. **Fixed price only works with a written scope** — which is why [what should be in a web development quote](/blogs/what-should-be-in-web-development-quote) matters more here than anywhere else.",
      },
      { type: "h2", text: "Hourly" },
      { type: "h3", text: "What it protects" },
      {
        type: "p",
        text: "Your flexibility, and your money on well-run projects. You can change direction without renegotiating, you only pay for work actually done, and you're not funding someone else's risk buffer. On genuinely exploratory work — where the right answer emerges as you go — it's the more honest model.",
      },
      { type: "h3", text: "What it costs you" },
      {
        type: "p",
        text: "Certainty. You don't know the final number, and neither does anyone else. That's fine with a developer you trust and uncomfortable with one you don't — and it's why hourly tends to suit second projects rather than first ones.",
      },
      {
        type: "p",
        text: "It also puts a quiet tax on your own decisiveness. Every time you change your mind, the meter runs. Some clients manage this well; others find it makes them hesitant in ways that hurt the project.",
      },
      { type: "h3", text: "When it goes wrong" },
      {
        type: "p",
        text: "When there's no cap, no estimate and no reporting. Hourly without an agreed ceiling is an open-ended commitment, and \"it'll take as long as it takes\" isn't a plan. Ask for **an estimate in hours, a not-to-exceed figure, and a regular report of hours used against that estimate.** A developer who won't give you those three is asking for a lot of trust.",
      },
      { type: "h2", text: "Retainer" },
      {
        type: "p",
        text: "For work that doesn't have an end — maintenance, ongoing improvements, someone on call when something breaks. You buy a block of hours or an agreed scope of coverage each month.",
      },
      {
        type: "p",
        text: "Published NZ figures: **$50–$200/month** for website maintenance and **$1,500–$5,000/month** for support on a mid-complexity application. In Cyprus, **€100–€500/month** for maintenance, or **€500–€2,000/month** for an ongoing freelance engagement.",
      },
      {
        type: "p",
        text: "The thing to check in a retainer is what happens to unused hours, and what counts as covered. \"Maintenance\" that means monitoring is a different product from \"maintenance\" that means someone actually does work. Detail in [annual website maintenance costs](/blogs/annual-website-maintenance-costs-nz).",
      },
      { type: "h2", text: "Which one for which project" },
      {
        type: "table",
        headers: ["Your situation", "Best fit", "Why"],
        rows: [
          ["New marketing site, requirements clear", "Fixed price", "Scope can be settled up front; you get budget certainty cheaply"],
          ["First time working with this developer", "Fixed price", "Caps your downside while you find out how they work"],
          ["Adding a feature to an existing site", "Hourly, with an estimate and a cap", "The codebase is an unknown until someone reads it"],
          ["Exploratory product work, direction may change", "Hourly", "A fixed price on a moving target is padded, and the padding is yours"],
          ["Ongoing changes, no defined end", "Retainer", "Cheaper and faster than quoting each small job"],
          ["Emergency fix, site is down", "Hourly", "Nobody can scope it before diagnosing it"],
        ],
      },
      { type: "h2", text: "What I use, and the downside" },
      {
        type: "p",
        text: "I work **fixed-scope, fixed-price**. The reasoning is that most of my clients are small businesses making a considered purchase, and for them budget certainty is worth more than flexibility — they'd rather know the number than optimise it.",
      },
      {
        type: "p",
        text: "The honest downside: it means more work before we start. I can't give a fixed price without understanding the project properly, so there's a scoping conversation you have to invest in before you get a number. And it makes me a poor fit for genuinely exploratory work, where the requirements are meant to emerge — in that situation an hourly developer will serve you better, and I'd tell you so rather than pad a number to cover the unknown.",
      },
      {
        type: "p",
        text: "For inherited codebases I'd also start hourly or with a small paid audit, for the reason set out in [taking over a website from another developer](/blogs/take-over-existing-website-developer): nobody can honestly fix-price the work of understanding someone else's decisions before reading them.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Should I pay a web developer hourly or a fixed price?" },
      {
        type: "p",
        text: "Fixed price when the scope can be written down before work starts, which covers most marketing sites and defined builds — it gives you budget certainty and puts overrun risk on the developer. Hourly when the work is exploratory, ongoing, or lands in an existing codebase nobody has read yet, because a fixed price on an unknown gets padded and you pay for the padding whether or not the risk materialises.",
      },
      { type: "h3", text: "Is fixed-price web development more expensive?" },
      {
        type: "p",
        text: "On a well-defined project, only slightly — the risk premium is small when the risk is small. On a vague brief it's substantially more expensive, because the developer has to price the uncertainty. That's an argument for settling the scope before asking for a fixed price, not an argument against fixed price.",
      },
      { type: "h3", text: "What are the risks of hourly web development billing?" },
      {
        type: "p",
        text: "Open-ended cost, mainly. Protect yourself with three things in writing: an estimate in hours, a not-to-exceed cap, and a regular report of hours used against the estimate. Hourly billing with none of those is an unlimited commitment, and it's the arrangement most likely to end in a dispute about value rather than about work.",
      },
      { type: "h3", text: "Can I switch from hourly to fixed price mid-project?" },
      {
        type: "p",
        text: "Often yes, and it's a sensible pattern: hourly for discovery until the requirements are clear, then fixed price for the build once they are. Many application projects are structured this way deliberately, with a paid discovery phase priced at $5,000–$15,000 in NZ before a fixed build quote is given.",
      },
      { type: "h3", text: "What is a web development retainer?" },
      {
        type: "p",
        text: "A monthly agreement covering ongoing work — maintenance, updates, small changes and availability when something breaks. NZ published ranges are $50–$200/month for a website and $1,500–$5,000/month for a mid-complexity application; Cyprus runs €100–€500/month. Check what counts as covered, since monitoring-only and work-included retainers are very different products at similar prices.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Ask yourself one question: can I describe what I want in enough detail that two developers would build roughly the same thing? If yes, get a fixed price. If no, either do the work to get there, or accept hourly and put a cap on it.",
      },
      {
        type: "p",
        text: "If you're unsure which side of that line you're on, describe the project and I'll tell you honestly. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "hire-remote-web-developer",
    // 34 chars — withBrand() lands on 49.
    title: "How to Hire a Remote Web Developer",
    excerpt:
      "Hiring a developer overseas works if you set up scope, ownership, payment and communication first. The process — and the timezone limits, stated plainly.",
    coverImage:
      "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-14",
    tags: ["Hiring a Developer", "Remote Work", "New Zealand", "Cyprus"],
    content: [
      {
        type: "p",
        text: "Hiring a remote developer works when four things are set up properly: a **written scope** so nobody is relying on hallway conversations, **ownership in writing** covering code, domain and hosting, a **payment method and currency** you've both agreed, and a **communication cadence** that survives the timezone gap. Get those right and distance is a detail. Get them wrong and distance magnifies every other problem.",
      },
      {
        type: "p",
        text: "I should declare my position: I'm a solo developer based in Pakistan working with clients in New Zealand, Cyprus and elsewhere. So this post is partly about me, which is exactly why it names the limitations before the benefits. You're already thinking about them.",
      },
      {
        type: "p",
        text: "Considering a remote developer and want the honest version? Ask me the awkward questions directly — timezone, payment, what happens if you're unhappy. [Get in touch](/contact).",
      },
      { type: "h2", text: "The timezone question, answered honestly" },
      {
        type: "p",
        text: "This is the real objection, so it goes first, and the honest answer differs by market.",
      },
      { type: "h3", text: "New Zealand — the hard case" },
      {
        type: "p",
        text: "New Zealand is 7 hours ahead of Pakistan during NZ standard time and 8 hours ahead during daylight saving. That means **your morning is my night.** If you email at 9am in Auckland, I am asleep, and pretending otherwise would be the first dishonest thing in our relationship.",
      },
      {
        type: "p",
        text: "What actually works: NZ late afternoon. 4pm–6pm in Auckland is 9am–11am in Pakistan — a comfortable, reliable overlap on both sides, every working day, no heroics required. Scheduled calls land there. In practice you send work at the end of your day and it's done when you start the next one, which suits some businesses well and genuinely frustrates others.",
      },
      {
        type: "p",
        text: "**You will not get a same-hour reply at 10am NZ time.** What you get instead is a guaranteed daily overlap window, a response inside one business day always, and work progressing while you sleep. If your project needs someone reachable continuously during NZ business hours, hire locally — that's a real requirement and I'd rather you meet it.",
      },
      { type: "h3", text: "Cyprus — the easy case" },
      {
        type: "p",
        text: "Cyprus is 2–3 hours behind Pakistan depending on the season. A Cypriot 9am is my 11am or midday, so we share most of a working day. For practical purposes there's no timezone problem here at all.",
      },
      { type: "h2", text: "What to set up before work starts" },
      { type: "h3", text: "1. A written scope" },
      {
        type: "p",
        text: "This matters more remotely than locally, because you lose the corridor conversation that quietly corrects misunderstandings in a co-located project. Everything that isn't written down is being remembered differently by two people in two countries. [What should be in a web development quote](/blogs/what-should-be-in-web-development-quote) is the checklist.",
      },
      { type: "h3", text: "2. Ownership and IP, explicitly" },
      {
        type: "p",
        text: "Code, domain registered in your name, hosting account, design files — transferring on final payment. This is standard practice everywhere, and it's more important across borders because enforcing anything internationally is slow and expensive. **The protection is having it in writing up front, not having recourse afterwards.**",
      },
      { type: "h3", text: "3. Payment method and currency" },
      {
        type: "p",
        text: "Agree who bears the transfer fees and which currency the invoice is denominated in, before the first invoice rather than after. Exchange rates move; if the quote is in NZD and payment is in another currency, say explicitly which side carries that movement. It's a small clause that prevents a genuinely annoying conversation.",
      },
      { type: "h3", text: "4. Communication cadence" },
      {
        type: "p",
        text: "Name the channel, the overlap window and the expected response time. A weekly written update covering what was done, what's next and what's blocked is worth more than daily availability — it creates a record, and it surfaces problems while they're still small.",
      },
      { type: "h2", text: "How to evaluate a remote developer" },
      {
        type: "p",
        text: "Mostly the same checks as any developer — [twelve questions to ask](/blogs/how-to-choose-a-website-developer) covers the general case — plus three that matter specifically at distance:",
      },
      {
        type: "list",
        items: [
          "**Written communication quality.** You're going to be reading this person for months. If their emails are unclear now, during the sales conversation when they're trying hardest, that won't improve.",
          "**Do they ask questions before quoting?** A developer who quotes your brief without querying anything either didn't read it or intends to bill for the gaps. Remotely, that instinct matters more, because you won't catch the misunderstanding by walking past their desk.",
          "**Live URLs, not screenshots.** Open them on your phone, on mobile data. This is the check that travels across borders unchanged.",
        ],
      },
      { type: "h2", text: "What goes wrong, and how to catch it early" },
      {
        type: "table",
        headers: ["Failure", "Early warning sign", "Prevention"],
        rows: [
          ["Drifting apart on what's being built", "Updates describe activity rather than progress against scope", "Weekly written update mapped to the scope document"],
          ["Silence mid-project", "A missed update that isn't acknowledged", "Agreed cadence, and treating a missed one as a signal rather than an oversight"],
          ["Work that can't be handed over", "No repository access, or access promised \"at the end\"", "Repo access from day one, not at handover"],
          ["Payment disputes", "Invoices arriving without reference to milestones", "Payment schedule tied to named deliverables"],
        ],
      },
      { type: "h2", text: "What you actually gain" },
      {
        type: "p",
        text: "Cost, obviously — NZ published rates put local freelancers at $65–$175/hr and offshore teams at $60–$120/hr apparent, with agencies well above both. But cost alone is a weak reason, because a cheap developer who needs replacing is the most expensive option available.",
      },
      {
        type: "p",
        text: "The better reasons: access to a specific skill set that isn't available locally, and working with the person who actually writes the code rather than an account manager relaying to them. [Remote developer vs local agency](/blogs/remote-developer-vs-local-agency) weighs this in more detail.",
      },
      { type: "h2", text: "When to hire locally instead" },
      {
        type: "p",
        text: "Genuinely, hire locally if you need someone physically present, if your organisation requires suppliers in-country, if the project needs continuous same-hours availability, or if you know you communicate much better in person than in writing. That last one is not a weakness — it's a real constraint, and remote work punishes it.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Does hiring an overseas web developer actually work?" },
      {
        type: "p",
        text: "Yes, when four things are set up first: a written scope, an ownership clause covering code, domain and hosting, an agreed payment currency and method, and a named communication cadence with a defined overlap window. Distance doesn't cause project failures on its own — it removes the informal corrections that hide the underlying problems in a co-located project.",
      },
      { type: "h3", text: "How do you handle the New Zealand timezone difference?" },
      {
        type: "p",
        text: "Pakistan is 7–8 hours behind New Zealand, so NZ mornings are unavailable — that's a real limitation and worth stating plainly. The reliable overlap is NZ late afternoon: 4pm–6pm in Auckland is 9am–11am in Pakistan, every working day. In practice you send work at the end of your day and it's progressed by the start of your next one. If you need someone reachable throughout NZ business hours, hire locally.",
      },
      { type: "h3", text: "Who owns the code when I hire an overseas developer?" },
      {
        type: "p",
        text: "You should, and it must be written down before work starts — code, domain registered in your name, hosting account and design files, transferring on final payment. This matters more across borders than locally, because international enforcement is slow and expensive. The real protection is the written agreement and repository access from day one, not the ability to sue later.",
      },
      { type: "h3", text: "How do I pay an international web developer?" },
      {
        type: "p",
        text: "Bank transfer or an international payment service, on a schedule tied to named milestones rather than dates. Agree up front which currency the invoice is denominated in, who bears the transfer fees, and which side carries exchange-rate movement between quote and payment. A deposit of roughly a third with the balance against milestones is standard; full payment up front is not.",
      },
      { type: "h3", text: "What are the risks of hiring a remote developer?" },
      {
        type: "p",
        text: "Scope drift, mid-project silence, and work that can't be handed over. All three have the same prevention: a written scope, an agreed weekly update mapped to it, and repository access from day one rather than at handover. Treat a missed update as a signal rather than an oversight — it's the earliest warning you'll get.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Ask the awkward questions in the first conversation. When are you actually available in my hours? What happens if I'm unhappy with the work? Who owns the code, and when do I get repository access? The answers, and how readily they come, tell you most of what you need.",
      },
      {
        type: "p",
        text: "Ask me those directly if you like — including whether I'm the wrong choice for your project, which is sometimes the answer. [Get in touch](/contact), or [read more about how I work](/about).",
      },
    ],
  },
  {
    slug: "web-developer-contract-checklist",
    // 45 chars — withBrand() lands on 60.
    title: "What Should a Web Developer Contract Include?",
    excerpt:
      "Scope, ownership, payment, revisions, termination and support — the clauses that matter in a web development contract, and what happens without them.",
    coverImage:
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-14",
    tags: ["Hiring a Developer", "Small Business", "Contracts"],
    content: [
      {
        type: "p",
        text: "A web development contract should cover **the parties, the scope and deliverables, explicit exclusions, the timeline with both sides' dependencies, the payment schedule, IP and ownership transfer on final payment, revisions, change requests, confidentiality, a warranty period, termination, support after launch, and how disputes get handled.** Most disputes in web projects trace back to one of those being absent rather than badly worded.",
      },
      {
        type: "p",
        text: "**One thing up front: I'm a developer, not a lawyer.** What follows describes what these clauses do and why they matter in practice, based on how web projects actually go wrong. It isn't legal advice, and it isn't a substitute for it. For anything significant — a large budget, sensitive data, or a client who worries you — pay a lawyer to look at the contract. That's a small cost against the thing it protects.",
      },
      {
        type: "p",
        text: "You've compared the quotes and picked someone. This is the last checkpoint before work starts. If you want the earlier stage, [how to compare web developer quotes](/blogs/how-to-compare-web-developer-quotes) is the pillar.",
      },
      { type: "h2", text: "The clauses, and what each one is for" },
      { type: "h3", text: "1. Parties" },
      {
        type: "p",
        text: "The legal entities, not the trading names. If you're contracting with a company, the company's registered name and number; if with an individual, their name. This sounds like paperwork until you need to know who you actually have an agreement with.",
      },
      { type: "h3", text: "2. Scope and deliverables" },
      {
        type: "p",
        text: "What's being built, described specifically enough that a third party could tell whether it was delivered. This is the clause everything else hangs off — a warranty on undefined work means nothing, and neither does a termination clause that can't establish what was completed.",
      },
      { type: "h3", text: "3. Exclusions" },
      {
        type: "p",
        text: "What's explicitly not included. The most-skipped clause and one of the most valuable, because it converts the assumptions in your head into a written statement you can check now rather than discover later.",
      },
      { type: "h3", text: "4. Timeline and dependencies" },
      {
        type: "p",
        text: "Milestones with dates, **and what you have to supply by when.** A contract that only binds the developer's dates will be missed on your content, and then there's an argument about it. Naming both sides' obligations is the single cheapest way to prevent that.",
      },
      { type: "h3", text: "5. Payment schedule" },
      {
        type: "p",
        text: "Amounts tied to milestones or dates, when invoices are issued, and payment terms. Roughly a third up front with the remainder against milestones is standard. Check specifically whether final payment falls due **before or after** you've seen the finished work, because that ordering is where leverage lives.",
      },
      { type: "h3", text: "6. IP and ownership transfer" },
      {
        type: "p",
        text: "The clause that costs the most when it's missing. It should state that on final payment you own the code, the domain registered in your name, the hosting account and the design files.",
      },
      {
        type: "p",
        text: "Worth understanding why this needs saying explicitly: in many jurisdictions, where a contract is silent, copyright in commissioned work stays with the person who created it even though the client paid for it. That surprises people, and it's the mechanism behind a lot of \"but I paid for this\" disputes. Whether it applies to you depends on where each party sits and what the contract says — which is precisely the kind of question to put to a lawyer rather than to a developer's blog.",
      },
      {
        type: "p",
        text: "Also specify any third-party components: licensed themes, stock images, paid plugins. You need to know what transfers and what's licensed to whom. [Taking over a website from another developer](/blogs/take-over-existing-website-developer) is what this clause exists to prevent.",
      },
      { type: "h3", text: "7. Revisions" },
      {
        type: "p",
        text: "How many rounds, at which stages, and what constitutes one round. \"Unlimited\" belongs in marketing copy, not in a contract, because it can't be enforced by either side.",
      },
      { type: "h3", text: "8. Change requests" },
      {
        type: "p",
        text: "The process and the rate. Written request, written quote, written approval, then work. This clause is what stops a good idea in a phone call becoming an invoice nobody expected.",
      },
      { type: "h3", text: "9. Confidentiality" },
      {
        type: "p",
        text: "Mutual, ideally. They'll see your business data, your customer information, and possibly your financials. You may see their methods. If the project involves personal data, this clause needs to sit alongside your actual data-protection obligations rather than substitute for them.",
      },
      { type: "h3", text: "10. Warranty period" },
      {
        type: "p",
        text: "How long after launch defects in their own work get fixed at no charge, and what counts as a defect rather than a change. Thirty days is common and reasonable. The distinction that matters: **fixing what's broken** versus **changing what works as specified**.",
      },
      { type: "h3", text: "11. Termination" },
      {
        type: "p",
        text: "How either side ends the agreement, what notice is required, what's owed for work completed, and — critically — **what you receive on termination.** Does partial work transfer, and in what form? This is the clause you'll want when the relationship is going badly, which is exactly when it's too late to negotiate.",
      },
      { type: "h3", text: "12. Support after launch" },
      {
        type: "p",
        text: "Whether there's an ongoing arrangement, what it covers, what it costs and how it's terminated. Often a separate agreement, and that's fine — but it should exist before you need it. NZ maintenance retainers run $50–$200/month for a site; applications considerably more.",
      },
      { type: "h3", text: "13. Dispute handling and governing law" },
      {
        type: "p",
        text: "Which country's law applies and how disagreements are resolved — negotiation, then mediation, before anything formal. This matters more in cross-border work, where the practical answer is usually that litigation isn't worth it for either party, which makes the earlier clauses your real protection. [Hiring a remote developer](/blogs/hire-remote-web-developer) covers the rest of that setup.",
      },
      { type: "h2", text: "What a missing clause actually costs" },
      {
        type: "table",
        headers: ["Missing clause", "What happens"],
        rows: [
          ["Ownership / IP", "You may not own what you paid for. Worst case: your site is hostage to a relationship that ended."],
          ["Exclusions", "Everything you assumed was included becomes a change request at full rate."],
          ["Client dependencies in the timeline", "The project runs late and both sides believe it's the other's fault."],
          ["Change request process", "Verbal agreements become disputed invoices."],
          ["Warranty period", "Bugs in their own work get quoted as new jobs."],
          ["Termination", "No agreed way out, and no clarity on what you're owed or what you receive."],
        ],
      },
      { type: "h2", text: "Do you need a lawyer?" },
      {
        type: "p",
        text: "For a small, straightforward website with a developer who has a clear standard agreement, most small businesses reasonably proceed on a well-written contract without paying for review. That's a risk judgement, not a recommendation.",
      },
      {
        type: "p",
        text: "**Get a lawyer** when the budget is significant relative to your business, when the project handles personal, health or financial data, when you're contracting across borders on something substantial, or when anything in the contract seems designed to be difficult to understand. A couple of hours of legal time is cheap next to the cases above.",
      },
      {
        type: "p",
        text: "What I'd avoid is downloading a template and treating it as done. A contract you haven't read and don't understand protects you roughly as well as no contract, and it can be worse, because it creates the belief that the question is settled.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "What should a web development contract include?" },
      {
        type: "p",
        text: "The parties as legal entities, scope and deliverables, explicit exclusions, a timeline naming both sides' dependencies, the payment schedule, IP and ownership transferring on final payment, revision rounds, a change-request process and rate, confidentiality, a warranty period on defects, termination terms including what you receive, post-launch support, and governing law. This describes what the clauses do in practice; it isn't legal advice.",
      },
      { type: "h3", text: "Do I need a contract for a small website project?" },
      {
        type: "p",
        text: "Yes, though it can be short. Even a single page covering scope, price, timeline, ownership and payment protects both sides and prevents the most common disputes. The size of the project changes how much detail is warranted, not whether an agreement should exist — and a developer who resists writing one is telling you something useful.",
      },
      { type: "h3", text: "Who owns the website after the contract ends?" },
      {
        type: "p",
        text: "Whatever the contract says — which is why it must say something. A well-drafted clause transfers the code, the domain registered in your name, the hosting account and the design files to you on final payment, and names any third-party licensed components separately. Where a contract is silent, ownership can default in ways that surprise clients, and the specifics depend on jurisdiction. Worth a lawyer's eye if the project is significant.",
      },
      { type: "h3", text: "What is a reasonable warranty period for a website?" },
      {
        type: "p",
        text: "Thirty days of free fixes on defects in the developer's own work is common and reasonable, with some providers offering longer. The important part isn't the length but the definition: the contract should distinguish fixing something broken from changing something that works as specified, because that boundary is where warranty disputes actually happen.",
      },
      { type: "h3", text: "Can I use a web development contract template?" },
      {
        type: "p",
        text: "You can, but read every clause and make sure it matches your project and your jurisdiction — a template you haven't understood offers little real protection and can create false confidence. For a small straightforward site that's often an acceptable risk. For significant budgets, personal or financial data, or cross-border work, pay for a lawyer to review it.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Take the contract you've been sent and check it against the thirteen clauses above. Anything missing is a question to ask before signing, and asking it costs nothing — a good developer will answer it in a sentence and probably add the clause.",
      },
      {
        type: "p",
        text: "If you'd like a second read on scope and ownership specifically — the two most expensive to get wrong — send it over. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "is-my-web-developer-overcharging-me",
    // 45 chars — withBrand() lands on 60.
    title: "How Do I Know If a Developer Is Overcharging?",
    excerpt:
      "You have a quote and it feels high. The six signs you're being overcharged, the six that say the price is fair, and how to ask for an itemised breakdown.",
    coverImage:
      "https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-14",
    tags: ["Hiring a Developer", "Pricing", "Small Business"],
    content: [
      {
        type: "p",
        text: "You're **likely overpaying** if the quote has no written scope, no ownership clause, bills standard things like mobile-responsive design or SSL as extras, charges custom prices for template work, or won't itemise when you ask. You're **likely not overpaying** if the scope is detailed, the exclusions are stated, and the price maps to work you can actually see listed.",
      },
      {
        type: "p",
        text: "Note what isn't on that list: the size of the number. A high price is not automatically overcharging, and a low price is not automatically a bargain. Overcharging is a mismatch between what you pay and what you get — not a threshold.",
      },
      {
        type: "p",
        text: "Got a quote that feels high? Send it to me with what you asked for and I'll tell you what's fairly priced and what I'd question — free, before you sign anything. If it's a good quote, I'll say so. [Get in touch](/contact).",
      },
      { type: "h2", text: "What overcharging actually means" },
      {
        type: "p",
        text: "The most common overcharge in this market isn't an inflated number. It's **paying custom prices for template work** — a bought theme with your logo and colours dropped in, billed as though it were designed for you.",
      },
      {
        type: "p",
        text: "This is invisible unless you ask, because the finished site looks fine. It's also why \"is this too expensive?\" is the wrong question. The right one is: what am I getting for this, and does the price match that? If you're new to the process, [how to hire a web developer when you don't know how to code](/blogs/how-to-hire-a-web-developer) covers the whole conversation; this post is only about the money.",
      },
      { type: "h2", text: "Six signs you're being overcharged" },
      {
        type: "list",
        items: [
          "**No written scope.** A single-line total — \"Website — $6,500\" — can't be checked against anything. Ask for pages named and features described. Refusal to provide it is the answer.",
          "**Standard things billed as extras.** Mobile-responsive design, an SSL certificate and basic SEO structure are the 2026 baseline. A line item with a price beside any of them is selling you the floor as an upgrade.",
          "**Template work at custom prices.** Ask directly: is this a purchased theme, a design system applied to my brand, or designed from scratch? All three are legitimate. Only one of them costs custom money.",
          "**No ownership clause.** If the quote doesn't say you own the code, the domain and the hosting on final payment, you may be renting. That's a hidden cost that lands years later, not a discount.",
          "**Won't itemise on request.** Good providers break a quote down quickly, because they built it from parts. Vagueness here usually means the number came first and the justification second.",
          "**Vague ongoing costs.** \"Hosting and maintenance from $X\" with no ceiling. Published NZ figures are $39–$99/month hosting and $50–$200/month maintenance — a quote well above that should explain what's different.",
        ],
      },
      { type: "h2", text: "Six signs the price is fair" },
      {
        type: "p",
        text: "This half matters more than the first, because most quotes people worry about turn out to be fine.",
      },
      {
        type: "list",
        items: [
          "**The scope names pages and features specifically**, so you can see what you're buying line by line.",
          "**Exclusions are written down** without you having to ask. Providers who state what's *not* included have been burned before and are protecting you both.",
          "**Ownership transfers on final payment** — code, domain in your name, hosting, design files.",
          "**The timeline names your obligations too**, not just theirs. That's a sign of someone who has run projects rather than sold them.",
          "**There's a stated rate for changes.** A quote with a change mechanism is a quote that expects reality.",
          "**They asked questions before quoting.** A number produced without any questions about your business is a template price, and you'll discover what it doesn't cover later.",
        ],
      },
      { type: "h2", text: "Why the same brief legitimately costs 5× more from an agency" },
      {
        type: "p",
        text: "This is real, and it isn't a scam. An agency rate covers project managers, account managers, designers, QA and premises. A freelance rate covers one person's time. Published NZ hourly bands: **$65–$110** for a junior-to-mid freelancer, **$120–$175** senior, **$140–$220** blended at a boutique studio, **$220–$320+** at a large agency ([Web Maniacs](https://webmaniacs.co.nz/custom-web-application-development-pricing-nz/)).",
      },
      {
        type: "p",
        text: "One Auckland studio publishing its own numbers puts it bluntly: CBD agencies typically quote [$15,000–$30,000+ for projects lower-overhead providers deliver for $4,000–$8,000](https://kingtide.nz/blog/website-design-auckland-cost), and calls the difference overhead rather than capability.",
      },
      {
        type: "p",
        text: "So a 5× gap between an agency and a freelancer is **not evidence of overcharging**. It's evidence you're comparing two different products. What you should check is whether you need what the overhead buys. [Remote developer or local agency](/blogs/remote-developer-vs-local-agency) works through that decision.",
      },
      { type: "h2", text: "What's standard and shouldn't be a line item" },
      {
        type: "table",
        headers: ["Should be included as standard", "Reasonable to price separately"],
        rows: [
          ["Mobile-responsive design", "Content writing and copywriting"],
          ["SSL certificate and HTTPS", "Photography and image licensing"],
          ["Clean URLs, page titles, meta descriptions", "Keyword research and ongoing SEO"],
          ["A sitemap and indexable pages", "Migration from an old site and redirect mapping"],
          ["Basic performance and accessibility", "Third-party integrations (CRM, payments, booking)"],
          ["Testing on current browsers", "Training, and a maintenance retainer"],
        ],
      },
      {
        type: "p",
        text: "The right-hand column being priced separately is normal and honest. The left-hand column appearing as paid extras is the tell.",
      },
      { type: "h2", text: "How to ask for an itemised breakdown without insulting anyone" },
      {
        type: "p",
        text: "Most people avoid this because it feels like an accusation. It isn't — it's a normal commercial request, and how someone responds tells you more than the breakdown itself. Send this:",
      },
      {
        type: "code",
        lang: "text",
        code: `Thanks for the quote. Before I make a decision, could you break it
down a little so I can compare it properly against the others?

  - Roughly how the total splits across design, build, content
    and testing
  - Whether the design is a purchased theme, a design system
    applied to my brand, or designed from scratch
  - What's explicitly NOT included
  - What I own on final payment (code, domain, hosting, design files)
  - The rate for anything outside this scope
  - Total ongoing costs for the first 12 months

No rush, and happy to talk it through on a call — I'd just like it
in writing so I can line the quotes up side by side.`,
      },
      {
        type: "p",
        text: "A provider who answers this within a day, specifically, is showing you how the project will go. One who gets defensive, stalls, or replies only with reassurance is also showing you how the project will go.",
      },
      { type: "h2", text: "When the expensive quote is the right one" },
      {
        type: "p",
        text: "Sometimes the high number is the accurate one, and picking the cheap quote is the expensive decision. That's true when:",
      },
      {
        type: "list",
        items: [
          "**Your project touches another system.** Integrations are priced by the other system's API quality and what happens when a sync fails — risk that has to sit with whoever carries it.",
          "**You need real permissions.** Multiple user types seeing different views of the same records is engineering, not configuration — see [what a customer portal costs](/blogs/customer-portal-development-cost).",
          "**Data has to be migrated.** Moving thousands of inconsistently-stored records is slow work that can't be skipped.",
          "**Compliance or accessibility is contractual** rather than aspirational.",
          "**The cheap quote excluded things you'll need anyway** — content, migration, redirects, training. Add them back and it often lands above the quote you were suspicious of.",
        ],
      },
      { type: "h2", text: "When you don't need to hire anyone" },
      {
        type: "p",
        text: "Worth saying, since this post is about spending money. If you need under about five pages, you're not selling online, there are no logins or bookings, and you're happy editing text yourself, then a well-configured site builder at $20–$50/month will genuinely serve you — and any quote for a custom build is the wrong purchase, not an overpriced one.",
      },
      {
        type: "p",
        text: "Equally, if your current site works and the real problem is that nobody can find it, you may need help with visibility rather than a rebuild. [Why your website isn't showing on Google](/blogs/why-website-not-showing-on-google) is the cheaper place to start.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Don't judge the number. Judge the gap between the number and the written scope. Send the itemisation request above to everyone who has quoted you, then compare the replies rather than the totals — [how to compare web developer quotes](/blogs/how-to-compare-web-developer-quotes) is the checklist for doing that properly.",
      },
      {
        type: "p",
        text: "If after that the expensive quote still has the better scope, it's probably the better quote. That's an uncomfortable conclusion and it's frequently the correct one.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How do I know if my web developer is overcharging me?" },
      {
        type: "p",
        text: "Compare the price against the written scope, not against your expectations. You're likely overpaying if there's no itemised scope, no ownership clause, standard items like responsive design or SSL are billed as extras, or a purchased theme is priced as custom design. If the scope is detailed, exclusions are stated and ownership transfers on final payment, the price is probably fair even when it's higher than you hoped.",
      },
      { type: "h3", text: "Should responsive design be a separate charge on a website quote?" },
      {
        type: "p",
        text: "No. In 2026 most visitors arrive on a phone, so mobile-responsive design is the baseline rather than an upgrade — and the same goes for an SSL certificate, clean URLs, real page titles and meta descriptions, and a sitemap. Seeing any of those as a priced line item usually means the baseline is being sold to you as an enhancement.",
      },
      { type: "h3", text: "What should I do if I think a web developer's quote is too high?" },
      {
        type: "p",
        text: "Ask for an itemised breakdown in writing — how the total splits across design, build, content and testing, whether the design is a theme or custom, what's excluded, what you own on final payment, and the change rate. It's a normal commercial request, not an accusation. How quickly and specifically someone answers tells you more about the project than the breakdown does.",
      },
      { type: "h3", text: "Is a higher web development quote always worse value?" },
      {
        type: "p",
        text: "No, and assuming so is how people end up with the most expensive project. The cheap quote is often cheap because content, migration, redirect mapping, training and post-launch support were left out — add them back and it frequently exceeds the quote you were worried about. Higher prices are genuinely warranted for integrations, permission models, data migration and compliance work.",
      },
      { type: "h3", text: "Why is an agency quote so much higher than a freelancer's?" },
      {
        type: "p",
        text: "Because you're buying a different structure, not different code. Published NZ rates run $65–$175/hr for freelancers against $220–$320+/hr blended at a large agency, and NZ providers themselves describe the gap as overhead — project managers, account managers, QA and premises — rather than capability. That's worth paying when you need brand strategy or genuine team depth, and it's pure cost when you don't.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Send the itemisation request today, to every provider who has quoted you. It costs you nothing, it arrives in writing so you can compare like with like, and the quality of the replies will sort the field faster than the prices will.",
      },
      {
        type: "p",
        text: "If you'd like a second opinion on what comes back, send it over — free, with no expectation you hire me, and I'll tell you plainly if one of them is a good quote or if you'd be better served by someone else entirely. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "freelancer-vs-agency-web-development",
    // 44 chars — withBrand() lands on 59.
    title: "Freelancer or Agency: Which Should You Hire?",
    excerpt:
      "Solo developer or a team? What you're actually buying in each case, the risk each one carries, and the projects where I'd tell you to hire the agency.",
    coverImage:
      "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-14",
    tags: ["Hiring a Developer", "Small Business", "Pricing"],
    content: [
      {
        type: "p",
        text: "**A freelancer** gives you lower cost, direct access to the person actually building it, and faster decisions — with everything depending on one person's availability. **An agency** gives you process, specialists in parallel, and cover when someone leaves — paid for through overhead in the price. Neither is better. They're different products for different risk profiles, and the right answer depends on which risk you'd rather carry.",
      },
      {
        type: "p",
        text: "One distinction first, because the site has a post on a similar-sounding question: this post is about **solo versus team**. [Remote developer or local agency](/blogs/remote-developer-vs-local-agency) is about **where they are**, which is a different axis entirely — you can hire a local freelancer or a remote agency. If you're at the earlier stage of not knowing what to ask anyone, start with [how to hire a web developer when you don't know how to code](/blogs/how-to-hire-a-web-developer).",
      },
      {
        type: "p",
        text: "Not sure which fits your project? Tell me what you're building and how much internal time you have for it, and I'll tell you which way I'd go — free, before you spend anything. If it's an agency job, I'll say so. [Get in touch](/contact).",
      },
      { type: "h2", text: "What you're actually buying in each case" },
      {
        type: "p",
        text: "The single most useful reframe: **agency overhead is a product, not a markup.** You're paying for project managers who chase your feedback, account managers who absorb the awkward conversations, QA who test what the developer didn't think to, and a business that still exists if one person quits.",
      },
      {
        type: "p",
        text: "With a freelancer you're buying the opposite trade: no layer between you and the person writing the code, which means faster decisions, less translation loss, and nobody to escalate to when that person is unavailable.",
      },
      {
        type: "p",
        text: "Deciding well means being honest about which of those you actually need. A business with a marketing manager who can run a project doesn't need a project manager. A business where the owner is the marketing department often genuinely does.",
      },
      { type: "h2", text: "Cost: why the same brief legitimately differs" },
      {
        type: "p",
        text: "The gap is real and it isn't padding. Published NZ hourly bands run **$65–$110** for a junior-to-mid freelancer and **$120–$175** for a senior, against **$140–$220** blended at a boutique studio and **$220–$320+** at a large agency ([Web Maniacs](https://webmaniacs.co.nz/custom-web-application-development-pricing-nz/)).",
      },
      {
        type: "p",
        text: "One Auckland studio publishing its own comparison puts agency quotes at [$15,000–$30,000+ for projects lower-overhead providers deliver for $4,000–$8,000](https://kingtide.nz/blog/website-design-auckland-cost) — and attributes the difference to offices and account layers rather than capability.",
      },
      {
        type: "p",
        text: "So a 3–5× difference between two quotes for the same brief is normal and doesn't mean either is wrong. What it means is that you're comparing two different products, which is why [comparing them on scope rather than total](/blogs/how-to-compare-web-developer-quotes) is the only method that works.",
      },
      { type: "h2", text: "Communication: direct versus account-managed" },
      {
        type: "table",
        headers: ["", "Freelancer", "Agency"],
        rows: [
          ["Who you talk to", "The person building it", "Usually an account or project manager"],
          ["Decision speed", "Same conversation", "Relayed, then confirmed"],
          ["Translation loss", "None — they heard it directly", "Real, and it grows with team size"],
          ["When you're disorganised", "Project stalls; nobody chases you", "Someone chases you, and that's worth money"],
          ["Out of hours", "Depends entirely on the person", "Depends on the contract"],
        ],
      },
      {
        type: "p",
        text: "That fourth row decides more projects than people expect. If you know your content and approvals will slip — and most businesses' do — an agency's project manager is a genuine service you're buying, not a middleman tax.",
      },
      { type: "h2", text: "Risk: bus factor versus staff turnover" },
      {
        type: "p",
        text: "Both models have a people risk. They're just shaped differently, and honest comparison requires naming both.",
      },
      {
        type: "p",
        text: "**The freelance risk is availability.** One person gets sick, takes holidays, or takes on another client. There's no bench. Mitigate it by asking directly about capacity and what happens if they're unavailable mid-project, and by insisting on repository access from day one so the work isn't trapped with them.",
      },
      {
        type: "p",
        text: "**The agency risk is turnover and substitution.** The senior developer who impressed you in the sales meeting may not be the person assigned to your build, and staff change during long projects. Mitigate it by asking who specifically will do the work, and what happens if they leave.",
      },
      {
        type: "p",
        text: "The mitigation that works for both is identical and it's the one people skip: **ownership in writing, and repository access from the start.** Get that and either risk becomes recoverable — [taking over a website from another developer](/blogs/take-over-existing-website-developer) is what it costs when you didn't.",
      },
      { type: "h2", text: "Scale: when a project genuinely outgrows one person" },
      {
        type: "p",
        text: "There's a real ceiling, and pretending otherwise would be dishonest. A solo developer is the right call up to roughly the point where the work stops being sequential — where design, build, testing and content genuinely need to happen in parallel to hit a date, or where the specialisms diverge too far.",
      },
      {
        type: "list",
        items: [
          "**A hard external deadline** — a funding round, a trade show, a regulatory date — that only parallel work can hit.",
          "**Genuinely separate specialisms** needed at once: brand design, motion, copywriting, paid media and development.",
          "**24/7 uptime obligations** where someone must be reachable outside one person's working hours.",
          "**Procurement requirements** — some organisations simply cannot contract a sole trader, and that's a constraint rather than a judgement.",
          "**Multi-year programmes** where continuity across staff changes matters more than any individual's skill.",
        ],
      },
      { type: "h2", text: "When to hire the agency instead of me" },
      {
        type: "p",
        text: "Plainly, because a comparison written by a freelancer that concludes \"hire a freelancer\" is worth nothing.",
      },
      {
        type: "p",
        text: "**Hire an agency** if any of the five above apply. Also hire one if you need brand strategy rather than a website, if you want paid media managed alongside the build, if your organisation needs a supplier with formal insurance and process documentation, or if you know from experience that your projects need someone external chasing you to keep moving.",
      },
      {
        type: "p",
        text: "**Hire a freelancer or small studio** for marketing sites, mid-complexity applications, and anything where you'd rather talk to the builder than to a manager — and where you can hold up your end on content and approvals.",
      },
      {
        type: "p",
        text: "For what it's worth, I work solo, remotely from Pakistan, for clients in New Zealand, Cyprus and elsewhere. That's a real constraint as well as a real advantage, and the honest version of it is in [how to hire a remote web developer](/blogs/hire-remote-web-developer).",
      },
      { type: "h2", text: "When you don't need to hire anyone" },
      {
        type: "p",
        text: "If you need under about five pages, aren't selling online, have no logins or bookings, and want to edit text yourself, a site builder at $20–$50/month will serve you properly — and neither a freelancer nor an agency is the right purchase. [WordPress vs Wix vs a custom website](/blogs/wordpress-vs-wix-vs-custom-website) works through that honestly.",
      },
      { type: "h2", text: "What to check either way" },
      {
        type: "list",
        items: [
          "**Ownership** — code, domain in your name, hosting, design files, transferring on final payment. Non-negotiable in both models.",
          "**A written scope with exclusions.** Agencies are usually better at this. Ask freelancers for it explicitly.",
          "**Live URLs you can open**, not screenshots — and with an agency, ask which of those the assigned team actually built.",
          "**Who does the work**, named. With an agency this is the question people forget; with a freelancer it's already answered.",
          "**A change-request rate**, so scope changes have a price rather than an argument.",
        ],
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Decide which risk you'd rather carry, then choose the model that carries it. If an unavailable person would sink your timeline, pay for the team. If a slow, layered process would frustrate you more than a single point of failure, hire the individual.",
      },
      {
        type: "p",
        text: "Then send both types the same written brief and compare on scope. Most of the price gap explains itself the moment the exclusions are on paper — which is the subject of [why web development quotes differ so much](/blogs/why-web-development-quotes-differ).",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Should I hire a freelance web developer or an agency?" },
      {
        type: "p",
        text: "Hire a freelancer for marketing sites and mid-complexity applications where you want direct access to the builder and can hold up your end on content and approvals. Hire an agency when work must happen in parallel to hit a hard deadline, when you need several specialisms at once, when procurement requires a company rather than a sole trader, or when you know your projects need someone external chasing you.",
      },
      // Not "is a freelancer cheaper than an agency" — that exact question is
      // already on /blogs/custom-web-app-cost-2026, and duplicating it would
      // put the same string in two FAQPage blocks.
      { type: "h3", text: "What does agency overhead actually pay for?" },
      {
        type: "p",
        text: "Project managers who chase your feedback, account managers who absorb the awkward conversations, QA who test what the developer didn't think to, and a business that still exists if one person leaves. Published NZ rates put freelancers at $65–$175/hr against $140–$220/hr blended at a boutique studio and $220–$320+/hr at a large agency, and NZ providers themselves describe that gap as overhead rather than capability. It's a product worth buying when you need those things, and pure cost when you don't.",
      },
      { type: "h3", text: "What's the risk of hiring a solo web developer?" },
      {
        type: "p",
        text: "Availability. One person has no bench, so illness, holidays or another client can stall your project, and there's nobody to escalate to. Ask directly about current capacity and what happens if they're unavailable mid-build, and insist on repository access from day one so the work isn't trapped with them. That single step makes the risk recoverable rather than fatal.",
      },
      { type: "h3", text: "Will I work with the same people an agency showed me?" },
      {
        type: "p",
        text: "Not necessarily, and it's worth asking outright. The senior who attended the sales meeting is often not the person assigned to your build, and staff change during long projects. Ask who specifically will do the work, what their experience is, and what happens if they leave mid-project — a good agency answers this without defensiveness.",
      },
      { type: "h3", text: "When does a project become too big for one developer?" },
      {
        type: "p",
        text: "When the work stops being sequential — when design, build, content and testing must run in parallel to hit a fixed external date, when you need genuinely separate specialisms at the same time, when uptime obligations exceed one person's working hours, or when the programme runs long enough that continuity across staff changes matters more than any individual's skill.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Write down the one thing that would most damage your project if it went wrong — a missed date, a stalled month, a person disappearing. That answer picks your model more reliably than any feature comparison.",
      },
      {
        type: "p",
        text: "If you'd like a second opinion, describe the project and I'll tell you honestly which way I'd go — including when that's an agency rather than me. [Get in touch](/contact), [see recent work](/projects), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "how-long-does-a-website-take-to-build",
    // 44 chars — withBrand() lands on 59.
    title: "How Long Does It Take to Build a Website?",
    excerpt:
      "A small business site takes 4–6 weeks from kickoff, e-commerce 8–12. Why projects run late, and four things that keep yours on schedule.",
    coverImage:
      "https://images.unsplash.com/photo-1495364141860-b0d03eccd065?w=800&h=450&fit=crop",
    category: "Web Development",
    publishedAt: "2026-08-14",
    tags: ["Web Development", "Small Business", "Hiring a Developer"],
    content: [
      {
        type: "p",
        text: "From kickoff, a **small business marketing site typically takes 4–6 weeks**. **E-commerce and integration-heavy builds run 8–12 weeks**, and **custom applications 3–6 months**. The most common cause of overrun isn't development — it's waiting on the client's content, feedback and approvals. A timeline that doesn't name your obligations as well as the developer's will be missed.",
      },
      {
        type: "p",
        text: "\"From kickoff\" is doing real work in that sentence. Kickoff is the day the developer has what they need to start, which is often weeks after the day you signed. If you're still choosing who to hire, [how to hire a web developer when you don't know how to code](/blogs/how-to-hire-a-web-developer) comes first.",
      },
      {
        type: "p",
        text: "Been quoted a timeline you're unsure about? Tell me the scope and what you already have ready, and I'll tell you whether it's realistic — free, before you commit. If the timeline is fine, I'll say so. [Get in touch](/contact).",
      },
      { type: "h2", text: "Typical timelines by project type" },
      {
        type: "table",
        headers: ["Project", "From kickoff", "What usually sets the pace"],
        rows: [
          ["Landing page / one-pager", "1–2 weeks", "How fast the copy is ready"],
          ["Small business site, 5–8 pages", "4–6 weeks", "Content for every page, plus two review rounds"],
          ["Larger marketing site, 10–15 pages", "6–10 weeks", "Content volume and the number of approvers"],
          ["E-commerce", "8–12 weeks", "Product data, images, payment and shipping setup"],
          ["Integration-heavy build", "8–12 weeks", "The other system's API, and access to a test account"],
          ["Custom web application", "3–6 months", "User roles, permissions and the number of workflows"],
        ],
      },
      {
        type: "p",
        text: "These are working ranges for a competent solo developer or small studio, and they assume you're responsive. They stretch when approvals involve a committee, and they compress only slightly when you throw money at them — most web work doesn't parallelise as neatly as people hope.",
      },
      { type: "h2", text: "What actually happens in each phase" },
      {
        type: "list",
        items: [
          "**Discovery and scope (3–7 days).** Turning what you want into something specific enough to build and price. Skipping this is how projects end up in change requests.",
          "**Design (1–2 weeks).** Layouts and a visual direction, then a review round. Longer if it's a fully custom design rather than a design system applied to your brand.",
          "**Build (2–4 weeks for a marketing site).** The part people imagine is the whole project. It's usually less than half of it.",
          "**Content population.** Almost always the bottleneck — see below.",
          "**Testing and fixes (3–5 days).** Browsers, devices, forms, and the things that only break with real content in them.",
          "**Launch and handover (1–3 days).** DNS, redirects from the old URLs, analytics, and a walkthrough so you can run it.",
        ],
      },
      {
        type: "p",
        text: "Note how much of that list isn't coding. When a quote's timeline looks short, the usual explanation is that it counted only the build phase — which is why timeline belongs in the quote as a line item with your obligations attached, per [what should be in a web development quote](/blogs/what-should-be-in-web-development-quote).",
      },
      { type: "h2", text: "Why projects run late — and why it's usually not the developer" },
      {
        type: "p",
        text: "This isn't a complaint about clients. It's a structural feature of web projects, and knowing it in advance is the thing that prevents it.",
      },
      {
        type: "p",
        text: "**Content is the number one cause.** Writing twelve pages of copy about your own business is genuinely hard, it's nobody's actual job, and it always takes longer than the week everyone assumed. Meanwhile the build is finished and waiting, which is why a project can be \"almost done\" for a month.",
      },
      {
        type: "p",
        text: "**Feedback rounds are the second.** A review that sits for ten days doesn't cost ten days — it often costs more, because the developer has moved to another project and has to pick yours back up.",
      },
      {
        type: "p",
        text: "**Approvals are the third.** One decision-maker is fast. Three people who must agree, one of whom is on leave, is a fortnight nobody scheduled.",
      },
      { type: "h2", text: "What you have to supply, and by when" },
      {
        type: "table",
        headers: ["What", "When it's needed", "Cost of being late"],
        rows: [
          ["Final copy for every page", "Before build starts, ideally", "The single biggest source of delay"],
          ["Logo files, fonts, brand colours", "Before design starts", "Design work gets redone"],
          ["Photos, or a decision to buy stock", "Before content population", "Pages sit half-finished"],
          ["Domain and hosting access", "Before launch week", "Launch slips regardless of readiness"],
          ["Consolidated feedback per round", "Within 2–3 business days", "Compounds — the developer context-switches away"],
          ["A named decision-maker", "Day one", "Every round takes as long as the slowest approver"],
        ],
      },
      {
        type: "p",
        text: "The full pre-kickoff list is in [what to give a web developer before starting](/blogs/what-to-give-a-web-developer-before-starting).",
      },
      { type: "h2", text: "Two timeline red flags" },
      {
        type: "p",
        text: "**A timeline that doesn't name your obligations.** If the schedule lists only the developer's milestones, it will be missed, and the conversation about whose fault that was will be unpleasant. A schedule with your deadlines in it is a sign of someone who has run projects rather than just sold them.",
      },
      {
        type: "p",
        text: "**\"Two weeks\" for a custom build.** Either it's a template being sold as custom, or discovery, testing and handover have been quietly left out of the count. Ask what happens in each week — the answer resolves it immediately.",
      },
      { type: "h2", text: "How to keep the project on schedule" },
      {
        type: "list",
        items: [
          "**Write the content before the build starts**, not during it. If you can't, say so up front so the schedule reflects reality instead of hope — and consider paying for copywriting, which is cheaper than a two-month stall.",
          "**Name one decision-maker** with authority to approve. Gather other people's opinions before the round, not during it.",
          "**Consolidate feedback into one document per round.** Ten separate emails over a week is a week, not ten minutes.",
          "**Book the review slots in advance**, in your calendar, at kickoff. The rounds you scheduled are the ones that happen on time.",
        ],
      },
      { type: "h2", text: "When you don't need to hire anyone" },
      {
        type: "p",
        text: "If your honest answer to \"when will the content be ready?\" is \"I have no idea\", then the fastest route to a live site may not be hiring a developer at all — it may be a site builder you fill in yourself over a few evenings. A developer can't move faster than your content, and paying someone to wait is the most expensive way to be slow.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Add two weeks to whatever timeline you're given, and spend them on content before the project starts rather than during it. Projects that begin with the copy written finish roughly on schedule; projects that begin with \"we'll sort the content as we go\" do not.",
      },
      {
        type: "p",
        text: "And treat any timeline that doesn't ask anything of you as a warning rather than a convenience.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How long does it take to build a small business website?" },
      {
        type: "p",
        text: "Typically 4–6 weeks from kickoff for a 5–8 page site, assuming the content is ready and feedback comes back within a few days. Larger 10–15 page marketing sites run 6–10 weeks, e-commerce and integration-heavy builds 8–12 weeks, and custom applications 3–6 months. Kickoff means the day the developer has what they need — often weeks after you signed.",
      },
      { type: "h3", text: "Why do website projects take longer than quoted?" },
      {
        type: "p",
        text: "Almost always because of content, feedback and approvals rather than development. Writing pages of copy about your own business is harder than it sounds and is nobody's actual job, so the build finishes and waits. Slow review rounds compound the delay, because the developer context-switches to other work and has to pick yours back up.",
      },
      { type: "h3", text: "Is two weeks realistic for a custom website?" },
      {
        type: "p",
        text: "Rarely. Two weeks usually means either a purchased template being presented as custom work, or a count that excludes discovery, testing, launch and handover. Ask what happens in each week — a developer who has actually run projects will walk you through discovery, design, build, content, testing and launch without hesitating.",
      },
      { type: "h3", text: "What makes a website project finish on time?" },
      {
        type: "p",
        text: "Content written before the build starts, one named decision-maker with authority to approve, feedback consolidated into a single document per round, and review slots booked into calendars at kickoff. Those four things matter more than any scheduling technique the developer uses, because they remove the bottleneck that causes most overruns.",
      },
      { type: "h3", text: "Can I speed up a website build by paying more?" },
      {
        type: "p",
        text: "Only slightly, and less than people expect. Web projects don't parallelise cleanly — adding people to design and build creates coordination work, and none of it removes the real constraint, which is usually your content and approvals. Paying for copywriting genuinely does speed things up, because it attacks the actual bottleneck.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Before you agree a date, answer one question honestly: when will the final copy for every page exist? That date, not the developer's capacity, is what sets your launch.",
      },
      {
        type: "p",
        text: "If you'd like a realistic timeline for your scope, describe it and I'll give you one — including the parts that depend on you. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "what-to-give-a-web-developer-before-starting",
    // 45 chars — withBrand() lands on 60.
    title: "What to Give a Web Developer Before Starting",
    excerpt:
      "Content, brand assets, access, references and one decision-maker — the pre-kickoff checklist that decides whether your project runs on time.",
    coverImage:
      "https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800&h=450&fit=crop",
    category: "Web Development",
    publishedAt: "2026-08-14",
    tags: ["Web Development", "Small Business", "Hiring a Developer"],
    content: [
      {
        type: "p",
        text: "Before kickoff a developer needs five things: **your content** (the words and the photos), **your brand assets** (logo files, fonts, colours), **access** (domain registrar, hosting, existing site admin, analytics), **reference sites with reasons** you like them, and **one named decision-maker** who can approve work. Have those ready and the project runs to schedule. Miss the first one and nothing else matters.",
      },
      {
        type: "p",
        text: "This is the last step before work starts, and it's the one that decides whether the timeline you agreed survives contact with reality. If you haven't chosen a developer yet, [how to hire a web developer when you don't know how to code](/blogs/how-to-hire-a-web-developer) comes first.",
      },
      {
        type: "p",
        text: "Not sure what you actually need to prepare? Tell me what the site has to do and I'll send back a specific list for your project — free, before anything is booked. [Get in touch](/contact).",
      },
      { type: "h2", text: "1. Content — the words and the photos" },
      {
        type: "p",
        text: "Leading with this because it causes more delay than everything else on the list combined. **The build finishes and then waits for copy**, which is why projects sit at \"almost done\" for a month.",
      },
      {
        type: "p",
        text: "What's needed, per page: a heading, the body text, and any calls to action. Not polished — a plain document is fine. What matters is that it exists and says what you actually want to say.",
      },
      {
        type: "p",
        text: "If writing it yourself is unrealistic, say so **before** the schedule is agreed rather than three weeks in. Paying for copywriting costs less than a two-month stall, and a developer who knows the real position can plan around it. [How long a website takes to build](/blogs/how-long-does-a-website-take-to-build) covers what this does to a timeline.",
      },
      {
        type: "p",
        text: "For photos: real ones of your work, your premises and your team beat stock every time, and on a local business site they're often the difference between credible and generic. If you don't have them, decide early whether you're commissioning a shoot or buying stock — that decision itself is frequently what stalls.",
      },
      { type: "h2", text: "2. Brand assets" },
      {
        type: "list",
        items: [
          "**Logo files** — vector if you have them (`.svg`, `.ai`, `.eps`). A logo pulled off your old website at 200px wide will look soft on a modern screen, and nobody can fix that afterwards.",
          "**Fonts**, and the licence for them if they're not free. Web licences are separate from desktop licences, and this catches people out.",
          "**Colour codes** — hex values, not \"our blue\". If you have brand guidelines, that document answers most design questions before they're asked.",
          "**Anything printed** — signage, vehicle livery, business cards — so the site matches what your customers already recognise.",
        ],
      },
      { type: "h2", text: "3. Access" },
      {
        type: "p",
        text: "Gather these early, because tracking down a login nobody has used since 2019 takes days, not minutes — and it's usually discovered in launch week.",
      },
      {
        type: "list",
        items: [
          "**Domain registrar** — the account where the domain is registered, ideally in your business name. Check with a WHOIS lookup if you're unsure.",
          "**Hosting** — control panel or cloud account, at owner level rather than a user seat.",
          "**Existing site admin**, if there is one, with an administrator-level account.",
          "**Analytics and Search Console**, so history carries across rather than restarting at zero.",
          "**Any third-party accounts** the site touches: email marketing, booking tools, payment gateway.",
        ],
      },
      {
        type: "p",
        text: "Add the developer as a user on accounts you own rather than handing over your own passwords — you can remove that access later without changing everything. If you can't produce some of these because a previous developer holds them, [taking over a website from another developer](/blogs/take-over-existing-website-developer) covers recovery.",
      },
      { type: "h2", text: "4. Reference sites — and why you like them" },
      {
        type: "p",
        text: "Three to five sites, and here's the part that matters: **write one sentence per site saying what you like about it.** A list of URLs is nearly useless. \"I like how this one puts the phone number in the header and the pricing on the homepage\" is a design brief.",
      },
      {
        type: "p",
        text: "Include a couple you actively dislike, with reasons. Knowing what to avoid saves a revision round, and revision rounds are the expensive part.",
      },
      {
        type: "p",
        text: "Competitors count, but don't restrict yourself to your industry — the best reference is often a business nothing like yours that solved the same problem you have.",
      },
      { type: "h2", text: "5. Must-haves versus nice-to-haves" },
      {
        type: "p",
        text: "Write two lists and keep them separate. The must-have list is what the site fails without: the enquiry form, the service pages, the booking system. The nice-to-have list is everything else.",
      },
      {
        type: "p",
        text: "This does two useful things. It gives the developer a scope they can price honestly, and it gives you a lever when the budget or the timeline gets tight — because the negotiation becomes about cutting the second list rather than arguing about the first. It's also the document that makes [comparing quotes](/blogs/how-to-compare-web-developer-quotes) possible, since everyone is pricing the same thing.",
      },
      { type: "h2", text: "6. One named decision-maker" },
      {
        type: "p",
        text: "One person, named at kickoff, who can approve a design without convening a meeting. Collect other people's opinions **before** each review round and hand over one consolidated response.",
      },
      {
        type: "p",
        text: "Projects with three equal approvers don't run three times slower; they run at the speed of whoever is on leave. This is the cheapest scheduling decision available to you and it costs nothing.",
      },
      { type: "h2", text: "What you don't need to provide" },
      {
        type: "p",
        text: "Worth saying, because this is where people stall out of a sense that they're not prepared enough:",
      },
      {
        type: "list",
        items: [
          "**Wireframes or mockups.** Designing it is the job you're paying for. A rough sketch is welcome if you have one; it is not expected.",
          "**Technical specifications.** You don't need to know what framework, CMS or hosting to use, and a developer who asks you to choose is passing you their job.",
          "**A sitemap.** Describe what your business does and who it serves; the page structure follows from that.",
          "**Keyword research**, unless you're commissioning SEO as a separate engagement.",
          "**Perfect copy.** Clear and complete beats polished. It gets edited anyway.",
        ],
      },
      { type: "h2", text: "The pre-kickoff checklist" },
      {
        type: "code",
        lang: "text",
        code: `CONTENT
  [ ] Copy for every page (plain document is fine)
  [ ] Photos, or a decision: commission a shoot / buy stock
  [ ] Testimonials or reviews you're allowed to publish

BRAND
  [ ] Logo, vector if it exists
  [ ] Fonts + licence
  [ ] Colour hex codes / brand guidelines

ACCESS  (add me as a user; don't share your own password)
  [ ] Domain registrar
  [ ] Hosting / server
  [ ] Existing site admin
  [ ] Analytics + Search Console
  [ ] Third-party accounts the site uses

DIRECTION
  [ ] 3-5 reference sites, each with WHY
  [ ] 2 sites you dislike, with why
  [ ] Must-haves list
  [ ] Nice-to-haves list  (kept separate)

PEOPLE
  [ ] One named decision-maker
  [ ] Review slots booked in calendars`,
      },
      { type: "h2", text: "When you don't need to hire anyone" },
      {
        type: "p",
        text: "If working through that list makes it clear you have four pages of content, no bookings, no logins and nothing to sell online, then a site builder will genuinely serve you for a fraction of a custom build — and I'd tell you that rather than take the project. [WordPress vs Wix vs a custom website](/blogs/wordpress-vs-wix-vs-custom-website) covers where that line sits.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Do the content first and everything else follows. If you assemble only one item from this post before your kickoff call, make it the copy — it's the one nobody else can do for you, and it's the one that decides your launch date.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "What does a web developer need from me before starting?" },
      {
        type: "p",
        text: "Content for every page, brand assets (vector logo, fonts and licence, colour codes), access to your domain registrar, hosting, existing site admin and analytics, three to five reference sites with reasons you like them, separated must-have and nice-to-have lists, and one named decision-maker who can approve work without convening a meeting.",
      },
      { type: "h3", text: "Do I need to write the website content myself?" },
      {
        type: "p",
        text: "Someone has to, and it's the most common reason projects run late. You can write it, hire a copywriter, or ask the developer whether they include it — but decide before the schedule is agreed rather than three weeks in. Paying for copywriting is usually cheaper than a two-month stall while a finished build waits for words.",
      },
      { type: "h3", text: "Do I need wireframes or a design before hiring a developer?" },
      {
        type: "p",
        text: "No. Designing it is the work you're paying for, and a rough sketch is welcome but never expected. You also don't need to choose a framework, CMS or hosting — a developer who asks you to make those calls is handing you their job. What you do need is clarity about what the site must achieve in business terms.",
      },
      { type: "h3", text: "What access does a web developer need to my accounts?" },
      {
        type: "p",
        text: "Domain registrar, hosting or server, existing site admin, analytics and Search Console, plus any third-party services the site touches. Add them as a user on accounts you own rather than sharing your own credentials, so access can be removed later without changing every password. Gather these early — hunting for a forgotten login is a launch-week problem.",
      },
      { type: "h3", text: "How many example websites should I send a developer?" },
      {
        type: "p",
        text: "Three to five you like and two you don't, each with one sentence explaining why. The reasons matter far more than the list — \"I like the phone number in the header and pricing on the homepage\" is a usable brief, while a bare set of URLs leaves the developer guessing and usually costs a revision round.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Copy the checklist above into a document today and start with the content section. Everything else on it takes an afternoon; that one takes as long as it takes, which is exactly why it should start first.",
      },
      {
        type: "p",
        text: "Want a version tailored to your project before you commit to anyone? Describe what the site has to do and I'll send one back. [Get in touch](/contact), or [see recent work](/projects).",
      },
    ],
  },
  {
    slug: "web-developer-cyprus-what-to-look-for",
    // 41 chars — withBrand() lands on 56.
    title: "Web Developer in Cyprus: What to Look For",
    excerpt:
      "How to choose a web developer in Cyprus: the language question that moves quotes most, what to get in writing, and when to hire locally instead.",
    coverImage:
      "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-15",
    tags: ["Hiring a Developer", "Cyprus", "Small Business"],
    content: [
      {
        type: "p",
        text: "Five checks, in order. **Get scope, ownership and change costs in writing** before anything starts. **Settle the language question early** — who translates, and who pays for it — because that is where Cyprus quotes diverge most. **Confirm you own the domain, hosting and code** on final payment. **Ask for live sites, not screenshots.** And treat clear written communication as worth more than a local address.",
      },
      {
        type: "p",
        text: "That last one will sound self-serving coming from someone working remotely, so the honest version is further down under when to hire locally instead. For what a build actually costs here, [what a website costs in Cyprus](/blogs/website-cost-cyprus-2026) is the reference post.",
      },
      {
        type: "p",
        text: "Not sure what your project needs? Tell me who your customers are and what the site has to do, and I'll come back with a realistic scope and range — free. If a Cyprus-based developer is the better fit, I'll say so. [Get in touch](/contact).",
      },
      { type: "h2", text: "Ask about languages before you ask about price" },
      {
        type: "p",
        text: "This is the question that separates a Cyprus quote from a generic one, and most buyers raise it last.",
      },
      {
        type: "p",
        text: "Greek and Turkish are the Republic's two official languages, and English is widely used in business, tourism and higher education — roughly 80% of people in Cyprus speak it as a second language ([Languages of Cyprus](https://en.wikipedia.org/wiki/Languages_of_Cyprus)). So \"which languages does this site need?\" has a real answer that depends on who you sell to, not on what feels thorough.",
      },
      {
        type: "p",
        text: "Ask any developer three things about it: which languages are in scope, **who supplies the translated copy**, and whether translation is included or excluded. A quote that says \"multilingual site\" without answering those is not a quote yet. [Do Cyprus businesses need two languages?](/blogs/cyprus-multilingual-website) works through the decision itself.",
      },
      { type: "h2", text: "What to check in the quote" },
      {
        type: "p",
        text: "The same checks apply here as anywhere, so rather than repeat them: [how to compare web developer quotes](/blogs/how-to-compare-web-developer-quotes) has the full ten, and [what should be in a web development quote](/blogs/what-should-be-in-web-development-quote) is the line-by-line checklist. The short version is that a quote must name pages and features, state what's **excluded**, and give you a rate for changes.",
      },
      { type: "h2", text: "Ownership: the clause people skip" },
      {
        type: "p",
        text: "On final payment you should own the code, the domain registered in **your** business name, the hosting account, and the design files. Get it in writing before work starts rather than at handover.",
      },
      {
        type: "p",
        text: "This matters more when you're hiring across a border, because enforcing anything internationally is slow and expensive — the protection is the written agreement and having accounts in your own name from day one, not the ability to pursue someone later. [Taking over a website from another developer](/blogs/take-over-existing-website-developer) is what it costs when this clause is missing.",
      },
      { type: "h2", text: "Local developer or remote: what each actually buys" },
      {
        type: "table",
        headers: ["", "Cyprus-based", "Remote"],
        rows: [
          ["Meetings", "In person, if that matters to how you work", "Video calls only"],
          ["Greek-language copy", "Can often write it, not just place it", "Usually needs a translator you or they hire"],
          ["Cost", "Local market rates", "Typically lower, no local overhead"],
          ["Who you talk to", "Depends — agency or individual", "Usually the person writing the code"],
          ["If it goes wrong", "Same jurisdiction, same legal system", "Practically, the written scope is your protection"],
        ],
      },
      {
        type: "p",
        text: "Neither column is a winner. The mistake is choosing on proximity when the thing you actually needed was written clarity, or choosing on price when you genuinely needed someone who can write Greek marketing copy from scratch.",
      },
      { type: "h2", text: "What \"EU-based\" does and doesn't mean" },
      {
        type: "p",
        text: "Three practical points, and one caveat: I'm a developer, not a lawyer or an accountant, so treat this as how it tends to work in practice and take anything consequential to a professional.",
      },
      {
        type: "list",
        items: [
          "**Hosting location is a choice, not a consequence of who you hire.** A remote developer can deploy to EU regions on any major host. If you want data in the EU, put it in the scope as a requirement rather than assuming it.",
          "**GDPR follows your customers, not your developer.** If you process personal data of people in the EU, the obligations are yours as the business, whoever built the site. Ask what the developer does about consent, forms and analytics — and get the rest from a lawyer.",
          "**Invoicing and VAT treatment differ** depending on where the supplier is established. That's an accountant question, and it's worth asking before you sign rather than at the first invoice.",
        ],
      },
      { type: "h2", text: "Red flags" },
      {
        type: "list",
        items: [
          "**No written scope.** \"We'll figure it out as we go\" means you'll pay for it as you go.",
          "**100% payment up front** to someone you've never worked with. A third up front against milestones is normal.",
          "**Won't show live URLs** you can open yourself. Screenshots prove nothing.",
          "**Promises a Google ranking.** Nobody controls that, and offering it signals either dishonesty or inexperience.",
          "**Registers your domain in their own name.** Non-negotiable — it's yours.",
          "**Quotes a multilingual site without asking who writes the copy.** They haven't priced the expensive part.",
        ],
      },
      { type: "h2", text: "When you should hire locally instead" },
      {
        type: "p",
        text: "Plainly, because I work remotely from Pakistan and this is the part that costs me work.",
      },
      {
        type: "p",
        text: "**Hire in Cyprus** if you need someone in the room — some businesses genuinely run better that way, and it isn't a weakness. Hire locally if you need Greek marketing copy written from scratch rather than translated, since that's a copywriting job in a language I don't work in. Hire locally if your organisation requires an in-country supplier, or if you know from experience that projects only move when you can walk over and ask.",
      },
      {
        type: "p",
        text: "**Remote is the better buy** when you have your content sorted, you're comfortable working in writing, and you'd rather talk to the person building it than to an account manager. [Remote developer vs local agency](/blogs/remote-developer-vs-local-agency) weighs that more fully.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Decide the language question first, then write one page describing what the site has to do in business terms. Send that same page to everyone you ask. Most of the variation between Cyprus quotes disappears the moment every developer is pricing the same brief, and what's left is a real difference you can actually judge.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How do I find a good web developer in Cyprus?" },
      {
        type: "p",
        text: "Ask for three live URLs you can open on your own phone, a written scope naming pages and exclusions, and an ownership clause covering the domain, code and hosting. Then settle the language question — which languages, who translates, who pays — because that moves a Cyprus quote more than almost anything else. Judge the written answers rather than the sales conversation.",
      },
      { type: "h3", text: "Should I hire a Cyprus-based developer or work with someone remote?" },
      {
        type: "p",
        text: "Hire locally if you need in-person meetings, Greek marketing copy written from scratch, or an in-country supplier for procurement reasons. Work remotely if your content is sorted, you're comfortable communicating in writing, and you want direct access to the person building the site rather than an account manager. Written communication quality predicts the outcome better than distance does.",
      },
      { type: "h3", text: "Does my Cyprus website need to be hosted in the EU?" },
      {
        type: "p",
        text: "Not automatically — hosting region is a choice any developer can make on the major cloud providers, not something determined by where they're based. If EU hosting matters to you, write it into the scope as a requirement rather than assuming it. Whether it's legally necessary for your particular data is a question for a lawyer, not a developer.",
      },
      { type: "h3", text: "Who owns the website when a Cyprus developer builds it?" },
      {
        type: "p",
        text: "Whatever the contract says, which is exactly why it must say something. A sound clause transfers the code, the domain registered in your business name, the hosting account and the design files to you on final payment. Where an agreement is silent, ownership can default in ways that surprise clients, and that's worth a lawyer's eye on anything significant.",
      },
      { type: "h3", text: "What should a Cyprus web developer include in their quote?" },
      {
        type: "p",
        text: "Pages and features named specifically, an explicit list of what's excluded, which languages are in scope and who supplies the translations, the ownership clause, revision rounds, a payment schedule, the rate for out-of-scope changes, and the twelve-month total of hosting and maintenance rather than only the build price.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Write down who your customers are and which languages they read. That single answer shapes the scope, the price and the shortlist more than any other decision you'll make.",
      },
      {
        type: "p",
        text: "Send it over and I'll tell you what I'd scope and what I'd charge — free, and if the honest answer is a Cyprus-based developer, that's what you'll get. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "website-cost-limassol-nicosia",
    // 45 chars — withBrand() lands on 60.
    title: "Website Cost in Cyprus: Does the City Matter?",
    excerpt:
      "Limassol or Nicosia, the city barely moves a website quote. Languages, who writes the copy and who you hire move it far more — here's the ranking.",
    coverImage:
      "https://images.unsplash.com/photo-1467269204594-9661b134dd2b?w=800&h=450&fit=crop",
    category: "Pricing",
    publishedAt: "2026-08-15",
    tags: ["Pricing", "Cyprus", "Small Business"],
    content: [
      {
        type: "p",
        text: "Most Cyprus business sites land in the **€800–€3,500** band, and **the city you're in barely moves that number**. What moves it, in order: how many languages the site needs, who writes the copy, whether you hire an agency or one developer, how much of the design is custom, and what has to integrate with what.",
      },
      {
        type: "p",
        text: "That's the contrarian answer, so here's the reasoning rather than the assertion. Limassol and Nicosia are about an hour apart in a market of roughly a million people. There's no separate talent pool, no separate cost of doing business, and no separate customer expectation to price against. Two developers in the same country quoting the same brief differ because of what they include, not where they park.",
      },
      {
        type: "p",
        text: "Want a number for your actual project? Tell me who your customers are and which languages they read, and I'll give you a realistic scope and range — free, before you commit. [Get in touch](/contact).",
      },
      { type: "h2", text: "What actually drives a Cyprus quote, ranked" },
      { type: "h3", text: "1. Languages" },
      {
        type: "p",
        text: "The single biggest swing, and the one least likely to be itemised. Cyprus providers put the uplift at **roughly 20% on top of the project** for adding a second language ([Cyprus Digital Agency](https://cyprusdigitalagency.com/website-design-cost-in-cyprus-2026/)). That's a fair rule of thumb for a content site and it understates the case where prices, legal text or service descriptions genuinely differ per market.",
      },
      { type: "h3", text: "2. Who writes the copy" },
      {
        type: "p",
        text: "If you supply the words, the project is cheaper and slower. If the developer or a copywriter supplies them, it's more expensive and faster. Neither is wrong — but this is the line most often left ambiguous, and an ambiguous line becomes an invoice. Decide it before you compare quotes.",
      },
      { type: "h3", text: "3. Agency or one developer" },
      {
        type: "p",
        text: "In a market this size the gap is wide. Published Cyprus figures put an ongoing freelance engagement at **€500–€2,000/month** against **€3,500–€12,000+/month** for a full-service agency retainer ([Uveler](https://uveler.com/blogs/marketing-agency-cost-cyprus/)). On project work, the same source puts a basic build at €1,500–€4,500 and a mid-range custom build at €4,500–€12,000, while other Cyprus providers quote **€500–€1,000** for a starter site and **€1,200–€3,500** for a business site ([Cyprus Digital Agency](https://cyprusdigitalagency.com/website-design-cost-in-cyprus-2026/), [Bandziuk](https://www.bandziuk.com/blog/website-development-cost-in-cyprus)).",
      },
      {
        type: "p",
        text: "That spread between sources is not an error — it's the agency-versus-individual difference showing up as a price gap rather than a described one, which is precisely why [comparing on scope beats comparing on totals](/blogs/why-web-development-quotes-differ).",
      },
      { type: "h3", text: "4. Design depth, then integrations" },
      {
        type: "p",
        text: "Template, semi-custom, or designed from scratch — three different products often sold under one phrase. After that, anything that has to talk to another system is priced by that system's API, not by your requirements.",
      },
      { type: "h2", text: "The multilingual cost nobody quotes" },
      {
        type: "p",
        text: "Worth expanding, because \"add Greek\" sounds like a content task and isn't. Four separate pieces of work sit behind it:",
      },
      {
        type: "list",
        items: [
          "**Translation** — either a human translator you pay, or machine output somebody has to review. This is a recurring cost, not a one-off.",
          "**Layout that survives longer text.** Translated strings routinely run longer than the English they replace, and a design that only ever saw English breaks in ways nobody notices until launch.",
          "**A language switcher** that remembers the visitor's choice and doesn't dump them back on the homepage when they use it.",
          "**Separate SEO per language** — each language needs its own indexable URL, not a toggle on one page. Google's guidance on localised versions covers the markup ([Google Search Central](https://developers.google.com/search/docs/specialty/international/localized-versions)).",
        ],
      },
      {
        type: "p",
        text: "And the part that surprises people: **every content update happens twice, forever.** Each new service page, price change and blog post is two pieces of work from launch onwards. [Do Cyprus businesses need two languages?](/blogs/cyprus-multilingual-website) is the decision itself, in detail.",
      },
      { type: "h2", text: "Ongoing costs" },
      {
        type: "table",
        headers: ["Item", "Published Cyprus range"],
        rows: [
          ["Hosting and domain, bundled", "€80–€180/year"],
          ["Hosting alone", "€60–€200/year"],
          ["Domain alone", "€10–€20/year"],
          ["Maintenance", "€100–€500/month"],
          ["Ongoing freelance engagement", "€500–€2,000/month"],
        ],
        caption: "Sources: Cyprus Digital Agency, Bandziuk, Uveler.",
      },
      {
        type: "p",
        text: "Ask any provider for the twelve-month total rather than the build price. That's the number you're actually committing to, and it's where a cheap quote and an honest one separate.",
      },
      { type: "h2", text: "When the city does buy you something" },
      {
        type: "p",
        text: "Not never — just not through price. A Limassol or Nicosia developer can sit in your office, can often write Greek marketing copy rather than commissioning it, and shares your jurisdiction if something goes wrong. Those are real goods. They're just not what the number at the bottom of the quote is measuring.",
      },
      {
        type: "p",
        text: "If in-person work is how your business actually runs, buy that deliberately and accept the cost. What I'd avoid is paying a premium for a local address you never use.",
      },
      { type: "h2", text: "When you should hire locally instead" },
      {
        type: "p",
        text: "If your site needs Greek copy written from scratch rather than translated, hire in Cyprus — that's a copywriting job in a language I don't work in, and a translator bolted onto a remote build is the more expensive route to a worse result. Same if you need someone physically present, or an in-country supplier for procurement.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Stop comparing cities and start comparing scopes. Write one brief, name the languages, say explicitly who supplies the copy, and send it to everyone. The quotes that come back will differ for reasons you can actually evaluate — which is the whole point of getting three of them.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Is a website cheaper in Nicosia than Limassol?" },
      {
        type: "p",
        text: "Not meaningfully. The cities are about an hour apart in a market of roughly a million people, sharing one talent pool and one cost base, so there's no structural reason for a price gap. Differences between two Cyprus quotes come from what each one includes — languages, copywriting, agency overhead, design depth — not from the address at the bottom of the invoice.",
      },
      { type: "h3", text: "How much does a website cost in Limassol?" },
      {
        type: "p",
        text: "The same as elsewhere in Cyprus: most business sites land in the €800–€3,500 band, with starter sites published at €500–€1,000 and mid-range custom builds running €4,500–€12,000 depending on who you hire. Adding a second language typically adds around 20%. Ask for the twelve-month total including hosting and maintenance, not just the build price.",
      },
      { type: "h3", text: "Why do two Cyprus website quotes differ so much?" },
      {
        type: "p",
        text: "Usually because one is an agency and one is an individual, or because one priced translation and copywriting and the other assumed you'd supply them. Published Cyprus figures put freelance engagements at €500–€2,000/month against €3,500–€12,000+/month for full-service agency retainers — a gap that reflects structure rather than capability. Ask both to itemise what's excluded.",
      },
      { type: "h3", text: "What are the ongoing costs of a website in Cyprus?" },
      {
        type: "p",
        text: "Published ranges are €80–€180/year for hosting and domain bundled, or €60–€200/year hosting plus €10–€20/year for the domain separately, with maintenance at €100–€500/month. On a bilingual site, budget for content updates happening twice — that's an ongoing time cost that rarely appears in any quote.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Answer two questions before you ask anyone for a price: which languages, and who writes the words. Everything else in a Cyprus quote is downstream of those.",
      },
      {
        type: "p",
        text: "Send me both answers and I'll come back with a scope and a range — free, and I'll tell you if a local developer suits you better. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  {
    slug: "cyprus-multilingual-website",
    // 40 chars — withBrand() lands on 55.
    title: "Do Cyprus Businesses Need Two Languages?",
    excerpt:
      "Greek and English, or English alone? How to decide from who your customers are, and the ongoing cost of a second language that nobody quotes.",
    coverImage:
      "https://images.unsplash.com/photo-1526857240824-4b9f9e0d1f4a?w=800&h=450&fit=crop",
    category: "Web Development",
    publishedAt: "2026-08-15",
    tags: ["Cyprus", "Web Development", "Small Business"],
    content: [
      {
        type: "p",
        text: "**If your customers are local businesses or residents, Greek plus English is usually the baseline.** If you serve tourists or international clients, English alone may be enough. **Adding a language is not double the site** — it's translation, a layout that tolerates longer text, a language switcher, and separate SEO for each language. And the part that surprises people: **every content update then happens twice, forever.**",
      },
      {
        type: "p",
        text: "Greek and Turkish are the Republic's official languages, and English is widely used in business, tourism and higher education — around 80% of people in Cyprus speak it as a second language ([Languages of Cyprus](https://en.wikipedia.org/wiki/Languages_of_Cyprus)). That's why this isn't a simple yes: a large share of your potential customers can read an English-only site perfectly well, which makes the decision commercial rather than automatic.",
      },
      {
        type: "p",
        text: "Not sure which way to go? Tell me who your customers are and I'll tell you whether a second language earns its cost on your site — free, and if English alone will do, that's what I'll say. [Get in touch](/contact).",
      },
      { type: "h2", text: "How to decide: start from your customers" },
      {
        type: "p",
        text: "Not from what feels thorough. Three honest cases:",
      },
      {
        type: "list",
        items: [
          "**You sell to local residents and small businesses** — trades, clinics, accountants, retail. Greek is doing real work here, and English alongside it covers the rest. This is the clearest case for two.",
          "**You sell to tourists, expatriates, or clients outside Cyprus** — hospitality, yacht services, international consulting, most software. English alone is often sufficient, and a half-maintained Greek version reads worse than none.",
          "**You sell to both, but one is clearly bigger.** Build the bigger one properly first. A complete site in one language beats two half-finished ones, and you can add the second when the first is earning.",
        ],
      },
      {
        type: "p",
        text: "The test I'd apply: can you name customers you lost, or would lose, because the site was in the wrong language? If yes, that's your answer. If you're reaching for a hypothetical, you're buying reassurance rather than revenue.",
      },
      { type: "h2", text: "What adding a language actually involves" },
      {
        type: "p",
        text: "\"Duplicate the pages\" is the small part. Four pieces of work sit behind it, and only one of them is content:",
      },
      { type: "h3", text: "Translation" },
      {
        type: "p",
        text: "Either a human translator you pay, or machine output that a fluent human reviews. Budget it as recurring rather than one-off, because it applies to everything you publish afterwards too.",
      },
      { type: "h3", text: "A layout that survives longer text" },
      {
        type: "p",
        text: "Translated strings frequently run longer than the English they replace. Buttons that fitted, wrap. Headings that sat on one line, take two. A design that has only ever seen English breaks in small ways nobody catches until content goes in — which is why the second language is cheaper to plan for than to retrofit.",
      },
      { type: "h3", text: "A language switcher that behaves" },
      {
        type: "p",
        text: "It should remember the choice and keep the visitor on the page they were reading. Switchers that dump you back on the homepage are common and quietly infuriating.",
      },
      { type: "h3", text: "Separate SEO per language" },
      {
        type: "p",
        text: "This is the one most often got wrong. **Each language needs its own indexable URL** — a toggle that swaps text on a single page gives Google one page to index, not two, so the Greek version can't rank on its own. Google's guidance on localised versions covers the URL structures and the `hreflang` annotations that tell it which version to serve to whom ([Google Search Central](https://developers.google.com/search/docs/specialty/international/localized-versions)).",
      },
      { type: "h2", text: "Machine translation: where it costs you credibility" },
      {
        type: "p",
        text: "Machine translation is genuinely good now, and pretending otherwise would be dishonest. Where it still fails is exactly where it hurts most: your service descriptions, your value proposition, and anything with a legal or financial consequence.",
      },
      {
        type: "p",
        text: "A slightly-off product description reads as carelessness to a native speaker, and carelessness is the opposite of what a service business is selling. A reasonable middle path is machine translation reviewed by a fluent human for the pages that sell, and unreviewed machine output only for content where being 95% right is fine.",
      },
      { type: "h2", text: "The ongoing cost is the real one" },
      {
        type: "p",
        text: "Build cost is finite. Maintenance isn't. From launch, **every new service page, price change, blog post and seasonal update is two pieces of work.** That's the cost nobody quotes because it doesn't appear in the build price — it appears in your calendar, every month, indefinitely.",
      },
      {
        type: "p",
        text: "Cyprus providers put the build-side uplift at **roughly 20% on top of the project** for a second language ([Cyprus Digital Agency](https://cyprusdigitalagency.com/website-design-cost-in-cyprus-2026/)), and published maintenance runs **€100–€500/month** ([Uveler](https://uveler.com/blogs/marketing-agency-cost-cyprus/)). The 20% is the honest headline for a content site; it understates the case where prices, legal text or service terms genuinely differ per market. Fuller context in [what a website costs in Cyprus](/blogs/website-cost-cyprus-2026) and [does the city matter](/blogs/website-cost-limassol-nicosia).",
      },
      { type: "h2", text: "When one language is the right answer" },
      {
        type: "p",
        text: "Say it plainly, because the industry has an obvious incentive not to. **One language is right** when your customers overwhelmingly read it, when you don't have the time or budget to maintain a second version properly, or when you're early enough that you don't yet know who your customers are.",
      },
      {
        type: "p",
        text: "An abandoned Greek section with 2024 prices on it damages you more than an English-only site ever would. If you can't commit to maintaining it, don't build it — and add it later from a position of knowing it'll be used.",
      },
      { type: "h2", text: "When you should hire locally instead" },
      {
        type: "p",
        text: "If the Greek version needs to be **written**, not translated — real marketing copy that persuades — hire a Cyprus-based developer or copywriter. That's a language job, and I work in English. I can build the structure that serves two languages properly; I can't write the Greek that fills it, and a translator bolted onto the end is the expensive route to something that reads translated.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Build the language your customers actually use, completely. Then decide about the second one with real data — which pages they land on, which they leave, and whether anyone has asked. Structuring the site so a second language *can* be added cleanly costs very little at build time; adding one you don't need costs you every month afterwards.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Does my Cyprus business website need to be in Greek?" },
      {
        type: "p",
        text: "It depends on who buys from you. If your customers are local residents and small businesses, Greek alongside English is usually the baseline. If you serve tourists, expatriates or international clients, English alone is often enough — around 80% of people in Cyprus speak English as a second language. The deciding question is whether you can name customers you'd lose without it.",
      },
      { type: "h3", text: "How much does a bilingual website cost in Cyprus?" },
      {
        type: "p",
        text: "Cyprus providers put the build-side uplift at roughly 20% on top of the project cost for a second language. That's a fair rule of thumb for a content site, and it understates cases where prices, legal text or service terms differ per market. The larger cost is ongoing: every content update from launch onwards is two pieces of work rather than one.",
      },
      { type: "h3", text: "Can I just use Google Translate on my website?" },
      {
        type: "p",
        text: "For pages where being roughly right is acceptable, machine translation is genuinely good. For the pages that sell — service descriptions, your value proposition, anything with legal or financial consequence — unreviewed output reads as carelessness to a native speaker, which is the opposite of what a service business is selling. Machine translation reviewed by a fluent human is a reasonable middle path.",
      },
      { type: "h3", text: "How does SEO work for a two-language website?" },
      {
        type: "p",
        text: "Each language needs its own indexable URL. A switcher that swaps text on a single page gives Google one page to index rather than two, so the second-language version can't rank independently. Google's documentation on localised versions covers the accepted URL structures and the hreflang annotations that tell search engines which version to serve to which audience.",
      },
      { type: "h3", text: "Is it cheaper to add a second language later?" },
      {
        type: "p",
        text: "No — retrofitting is usually more expensive than planning for it. Layouts built for one language break in small ways when translated text runs longer, and URL structure and SEO markup are cheaper to get right at the start than to migrate afterwards. Structuring for two languages at build time costs very little even if you only launch one.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Write down your last ten customers and which language each of them reads. If that list is mixed, build both. If it isn't, you have your answer and you've saved yourself a recurring cost.",
      },
      {
        type: "p",
        text: "Send me the list and I'll tell you what I'd build — free, including when the answer is one language and a structure that can take a second later. [Get in touch](/contact), or [see what I build](/services).",
      },
    ],
  },
  // [CONFIRM — owner input] Article 4 deliberately does NOT state payment
  // methods, invoicing currency, VAT treatment, or a specific working-hours
  // window. Those are facts only Muhammad has, and the spec is explicit that
  // they are marked rather than invented. The timezone arithmetic below is
  // arithmetic (EET/EEST vs PKT), not a claim about his schedule.
  {
    slug: "hiring-remote-developer-cyprus",
    // 37 chars — withBrand() lands on 52.
    title: "Hiring a Remote Developer From Cyprus",
    excerpt:
      "What you gain, what you give up, and what to agree in writing first — written by the remote developer, including the cases where hiring in Cyprus wins.",
    coverImage:
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=800&h=450&fit=crop",
    category: "Hiring",
    publishedAt: "2026-08-15",
    tags: ["Hiring a Developer", "Cyprus", "Remote Work"],
    content: [
      {
        type: "p",
        text: "**Agree scope, ownership, payment and communication in writing before anything starts.** **Written communication quality matters more than timezone overlap.** **Fixed price protects you more than hourly** when you can't look over someone's shoulder. **Put domain, hosting and repository access in your name from day one.** And if you genuinely need someone in the room, that's a real reason to hire in Cyprus rather than a preference to talk yourself out of.",
      },
      {
        type: "p",
        text: "I should declare the obvious: I'm the remote developer in this scenario, working from Pakistan with clients in Cyprus and elsewhere. So this post names what you give up before what you gain.",
      },
      {
        type: "p",
        text: "Considering it and want the awkward version? Ask me the uncomfortable questions directly — what happens if you're unhappy, who owns what, what I'm not good at. [Get in touch](/contact).",
      },
      { type: "h2", text: "What you give up" },
      {
        type: "list",
        items: [
          "**No in-person meetings.** Video calls are not the same thing for everyone, and some businesses genuinely decide better around a table.",
          "**A different legal jurisdiction.** If something goes badly wrong, pursuing it across borders is slow and expensive enough that, realistically, your written scope and your account ownership are the protection — not the courts.",
          "**No local-language copywriting.** I work in English. Greek marketing copy needs a Greek writer, wherever the developer sits.",
          "**You carry more of the coordination.** No account manager is chasing you for content. If your feedback slips, the project slips, and nobody in your office will remind you.",
        ],
      },
      {
        type: "p",
        text: "If two or more of those are dealbreakers, hire in Cyprus. That's a sound decision and the rest of this post won't change it.",
      },
      { type: "h2", text: "What you gain" },
      {
        type: "p",
        text: "Direct access to the person writing the code, no agency layer translating your requirements into a brief and back again, and a lower cost base — published Cyprus figures put ongoing freelance engagements at **€500–€2,000/month** against **€3,500–€12,000+/month** for full-service agency retainers ([Uveler](https://uveler.com/blogs/marketing-agency-cost-cyprus/)).",
      },
      {
        type: "p",
        text: "Cost alone is a weak reason, though. A cheap developer who needs replacing is the most expensive option available. The better reason is that on a small project, the shortest path between what you want and what gets built is talking to the person building it.",
      },
      { type: "h2", text: "Timezone: Cyprus is one of the easy ones" },
      {
        type: "p",
        text: "Cyprus runs on EET in winter and EEST in summer; Pakistan is UTC+5 year-round with no daylight saving. That puts me **two to three hours ahead of you depending on the season** — so a Cypriot 9am is my 11am or midday, and we share most of a normal working day.",
      },
      {
        type: "p",
        text: "For comparison, this is the market where the timezone objection is weakest. [Hiring a remote web developer](/blogs/hire-remote-web-developer) covers the harder case, New Zealand, where the gap is seven to eight hours and the honest answer is different.",
      },
      { type: "h2", text: "Payment, invoicing and VAT" },
      {
        type: "p",
        text: "What to agree before the first invoice rather than after it: which currency the invoice is denominated in, which payment method, who bears the transfer fees, and which side carries exchange-rate movement between quote and payment. Those four lines prevent a genuinely annoying conversation later.",
      },
      {
        type: "p",
        text: "On VAT and how a non-EU supplier's invoices should be treated in your books — that's an accountant's question, not a developer's, and it's worth asking yours before you sign rather than at year end. I'd be suspicious of any developer who answers it confidently on your behalf.",
      },
      { type: "h2", text: "Ownership and contracts across borders" },
      {
        type: "p",
        text: "Get it in writing that on final payment you own the code, the domain registered in your business name, the hosting account and the design files. Then do the thing that actually matters: **hold those accounts yourself from day one** and add the developer as a user, rather than receiving them at handover.",
      },
      {
        type: "p",
        text: "The reasoning is unsentimental. Cross-border enforcement is expensive enough that in practice it isn't your remedy for a small project. What protects you is that you already hold the keys, so the worst case is finding someone new rather than recovering an asset. [What a web developer contract should include](/blogs/web-developer-contract-checklist) has the clauses; I'm a developer, not a lawyer, so anything significant deserves a proper legal read.",
      },
      { type: "h2", text: "Communication that makes it work" },
      {
        type: "list",
        items: [
          "**A named channel** and an agreed response time. Mine is within one business day, always.",
          "**A weekly written update** covering what was done, what's next, and what's blocked. It creates a record and surfaces problems while they're small.",
          "**Consolidated feedback**, one document per round. Ten separate messages over a week costs a week.",
          "**Treat a missed update as a signal**, not an oversight. It's the earliest warning you'll get that something is drifting.",
        ],
      },
      { type: "h2", text: "Red flags in any remote arrangement" },
      {
        type: "list",
        items: [
          "Won't put scope and exclusions in writing",
          "Wants 100% payment up front",
          "Repository access promised \"at the end\" rather than day one",
          "Vague about who owns the domain",
          "Goes quiet and treats it as normal",
          "Quotes a fixed price on an existing codebase without looking at it",
        ],
      },
      { type: "h2", text: "When you should hire locally instead" },
      {
        type: "p",
        text: "Hire in Cyprus if you need someone physically present, if you need Greek copy written rather than translated, if procurement requires an in-country supplier, or if you know your projects only move when you can walk over and ask. That last one isn't a character flaw — it's a real constraint, and remote work punishes it rather than fixing it.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Test the written communication before you commit to anything. Send a short brief and read what comes back. If the reply is clear, asks the right questions, and names something that will be difficult, distance is a detail. If it's vague now — while they're trying hardest — it will not improve once the work starts.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Does hiring a developer outside Cyprus actually work?" },
      {
        type: "p",
        text: "Yes, when four things are agreed first: a written scope with exclusions, an ownership clause covering code, domain and hosting, the payment currency and method, and a named communication cadence. Distance doesn't cause project failures by itself — it removes the informal corrections that hide underlying problems when everyone shares an office.",
      },
      { type: "h3", text: "What's the time difference between Cyprus and a Pakistan-based developer?" },
      {
        type: "p",
        text: "Two to three hours, depending on the season — Cyprus observes EET in winter and EEST in summer, while Pakistan stays on UTC+5 year-round. A Cypriot 9am is 11am or midday in Pakistan, so most of a normal working day overlaps. Of the markets I work with, Cyprus has the smallest timezone gap by a wide margin.",
      },
      { type: "h3", text: "How do I pay an overseas web developer from Cyprus?" },
      {
        type: "p",
        text: "By bank transfer or an international payment service, on a schedule tied to named milestones rather than dates. Agree up front which currency the invoice is denominated in, who bears transfer fees, and which side carries exchange-rate movement. How a non-EU supplier's invoices should be treated for VAT is a question for your accountant, not your developer.",
      },
      { type: "h3", text: "What happens if a remote developer disappears mid-project?" },
      {
        type: "p",
        text: "It depends entirely on whether you hold the accounts. If the domain, hosting and repository are already in your name with the developer added as a user, you lose time and find someone else. If they hold everything, you have a recovery problem that crossing a border makes considerably worse — which is why account ownership from day one matters more than any contract clause you'd realistically enforce.",
      },
      { type: "h3", text: "Should I pay a remote developer hourly or a fixed price?" },
      {
        type: "p",
        text: "Fixed price, when the scope can be settled in writing beforehand. It caps your exposure and moves the estimating risk to the developer, which matters more when you can't observe the work day to day. Hourly suits genuinely exploratory work or an existing codebase nobody has read yet — but insist on an estimate, a not-to-exceed cap, and regular reporting of hours used.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Before you shortlist anyone, open accounts for your own domain and hosting in your business name. It takes twenty minutes, costs almost nothing, and it converts the biggest risk in remote hiring into an inconvenience.",
      },
      {
        type: "p",
        text: "Then send a short brief to two or three people and judge the replies. Send me one too if you like — and if a Cyprus-based developer is the better answer for your project, I'll tell you. [Get in touch](/contact), or [see recent work](/projects).",
      },
    ],
  },

  // ── Cluster 9: after your website launches ──
  //
  // Six post-launch operations posts. Every market figure below is the one
  // already published and sourced in annual-website-maintenance-costs-nz,
  // and each is linked back to it rather than restated as a fresh claim —
  // two posts quoting two different maintenance ranges is the drift that
  // makes a whole site look careless. No WebDevStudio rate is quoted here;
  // /services stays the single source of truth for what I charge.
  {
    slug: "who-updates-my-website",
    title: "Who Updates My Website After It's Built?",
    excerpt:
      "You, your developer, or nobody — the three options after launch, what each costs, and the question to ask before you sign anything.",
    coverImage:
      "https://images.unsplash.com/photo-1499750310107-5fef28a66643?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-16",
    tags: ["Small Business", "New Zealand", "Website Handover"],
    content: [
      {
        type: "p",
        text: "Nobody tells you this at quote stage, and it's the thing that quietly decides whether your website stays useful or slowly goes stale.",
      },
      { type: "h2", text: "The short answer" },
      {
        type: "p",
        text: "There are three arrangements, and you should know which one you're buying before you pay a deposit.",
      },
      {
        type: "list",
        items: [
          "**You update it** — the site has a CMS, you log in and change text, prices and images yourself. Free, but only if the CMS is genuinely usable.",
          "**Your developer updates it** — you email or message, they make the change. Billed hourly or bundled into a monthly plan.",
          "**Nobody updates it** — the most common outcome, and the reason so many small business sites still show 2023 prices.",
        ],
      },
      {
        type: "p",
        text: "Ask which one you're getting before signing. “Can I update this myself?” is a better question than most people ask about design.",
      },
      { type: "h2", text: "What “you can update it yourself” actually means" },
      {
        type: "p",
        text: "This phrase covers two very different realities.",
      },
      {
        type: "p",
        text: "The good version: you log in, click into a page, edit text like a document, swap an image, hit save. No training needed beyond ten minutes.",
      },
      {
        type: "p",
        text: "The version people actually get: a CMS that technically allows editing but breaks the layout when you paste from Word, requires you to remember which of nine fields controls the homepage banner, and makes you nervous every time you touch it. Technically self-serviceable. Practically, you'll email the developer.",
      },
      {
        type: "p",
        text: "The difference isn't the platform. It's whether the person who built it set up the editing experience deliberately, or just handed you the admin panel and left. Ask to see it before you sign — a five-minute screen share of someone editing a page tells you more than any promise in a quote.",
      },
      { type: "h2", text: "What you'll realistically need to change" },
      {
        type: "p",
        text: "Most small businesses need surprisingly little:",
      },
      {
        type: "list",
        items: [
          "Prices and service details",
          "Team members joining and leaving",
          "Photos of recent work",
          "Opening hours, especially over holidays",
          "A new service page when the business shifts",
        ],
      },
      {
        type: "p",
        text: "That's a handful of edits a year. Which is exactly why the “nobody updates it” outcome happens — it never feels urgent enough to pay for, so it doesn't get done, and two years later your site describes a business you no longer run.",
      },
      { type: "h2", text: "What needs a developer regardless" },
      {
        type: "p",
        text: "Some things aren't CMS work, and no amount of self-service covers them:",
      },
      {
        type: "list",
        items: [
          "Adding a new feature or integration",
          "Changing the layout or structure of a page type",
          "Anything that touches how the site works rather than what it says",
          "Fixing something that broke",
          "Updates to the underlying platform and its dependencies",
        ],
      },
      {
        type: "p",
        text: "A reasonable arrangement: you handle content, the developer handles the machinery. Problems start when the boundary was never discussed.",
      },
      { type: "h2", text: "Three arrangements, honestly compared" },
      {
        type: "p",
        text: "**Self-service.** Cheapest, and right for most small service businesses — if the CMS is genuinely easy. You're trading a little of your time for full control. The risk is that you don't get around to it.",
      },
      {
        type: "p",
        text: "**Ad-hoc developer.** You message when you need something, they bill hourly. NZ providers publishing 2026 rates put small ad-hoc changes in the $80–$150 per hour band — the same figure quoted in [annual website maintenance costs in NZ](/blogs/annual-website-maintenance-costs-nz), where the sourcing sits. Fine for occasional work. It gets expensive if you need something monthly, and there's no guarantee they're free when you need them.",
      },
      {
        type: "p",
        text: "**Monthly plan.** A retainer covering updates, monitoring and small changes. Predictable, and someone's paying attention to your site rather than waiting to be asked. Worth it once you're changing things regularly or the site is generating real revenue. Not worth it for a five-page brochure site that changes twice a year.",
      },
      { type: "h2", text: "When you don't need anyone" },
      {
        type: "p",
        text: "If your site is five pages, your prices are stable, you're not blogging, and the CMS lets you fix a typo without fear — you don't need an update arrangement at all. Change what you need, once or twice a year, and spend the money elsewhere. Anyone selling you a monthly plan for that site is selling you comfort, not necessity.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Before you accept a quote, ask three things. Can I edit my own content — show me? What do I pay for changes outside that? What happens if you're unavailable? Whoever answers those clearly is telling you they've thought about the two years after launch, not just the six weeks before it.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Can I update my website myself?" },
      {
        type: "p",
        text: "If it was built with a CMS and set up properly, yes — text, images, prices and hours are usually straightforward. Structural changes, new features and anything that breaks still need a developer. The honest test is asking to watch someone make an edit before you sign.",
      },
      { type: "h3", text: "How much does it cost to have a developer update my website?" },
      {
        type: "p",
        text: "NZ providers publishing 2026 rates put small changes in the $80–$150 per hour band, or bundled into a monthly plan. Ask which applies and what the minimum billing increment is — some charge in 15-minute blocks, some have a one-hour minimum. Figures are NZD and exclude GST.",
      },
      { type: "h3", text: "What happens if my developer stops responding?" },
      {
        type: "p",
        text: "This is why domain, hosting and CMS access should be in your name from day one. If they hold the keys, you have a recovery problem before you have an update problem. [Taking over a website from another developer](/blogs/take-over-existing-website-developer) covers the recovery route.",
      },
      { type: "h3", text: "Do I need a maintenance plan just to update content?" },
      {
        type: "p",
        text: "No. Content updates and maintenance are different things — maintenance is about hosting, backups, security and platform updates. You can have one without the other, and [whether you need a plan at all](/blogs/do-i-need-a-maintenance-plan) is a separate question.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Find out what your current setup actually lets you do before you pay anyone to change it. Send me your site and I'll tell you what you can edit yourself and what needs a developer — and if the answer is that you can do all of it, that's the answer you'll get. [Get in touch](/contact), or [see recent work](/projects).",
      },
    ],
  },

  {
    slug: "do-i-need-a-maintenance-plan",
    title: "Do I Need a Website Maintenance Plan?",
    excerpt:
      "Some sites genuinely need a monthly plan. Plenty don't. How to tell which yours is — and what a plan must include to be worth paying for.",
    coverImage:
      "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800&h=450&fit=crop",
    category: "Business",
    publishedAt: "2026-08-16",
    tags: ["Small Business", "New Zealand", "Pricing"],
    content: [
      {
        type: "p",
        text: "Every developer offers one. Not every business needs one. Here's the honest version, including when the answer is no.",
      },
      {
        type: "p",
        text: "This post answers whether you need a plan. If you've already decided you do and want the numbers, [annual website maintenance costs in NZ](/blogs/annual-website-maintenance-costs-nz) is the cost breakdown, and every figure quoted here comes from it.",
      },
      { type: "h2", text: "The short answer" },
      {
        type: "p",
        text: "You probably need a plan if your site runs on WordPress or another platform with plugins, you take payments or store customer data, the site generates real revenue, or you have no idea what would happen if it went down tomorrow.",
      },
      {
        type: "p",
        text: "You can probably skip it if your site is a small static or simply-built brochure site, it has no logins or payments, it's on managed hosting that handles updates, and you'd survive a day of downtime without losing money.",
      },
      {
        type: "p",
        text: "The deciding question is not “is my site important”. It's what breaks if nobody's watching, and what that costs you.",
      },
      { type: "h2", text: "What a maintenance plan actually is" },
      {
        type: "p",
        text: "Not “someone occasionally looks at your website”. A real plan covers:",
      },
      {
        type: "list",
        items: [
          "**Platform and plugin updates** — the security patches that stop known vulnerabilities being exploited",
          "**Backups**, taken regularly and tested",
          "**Uptime monitoring**, so someone knows the site is down before your customers tell you",
          "**Security scanning**",
          "**SSL certificate renewal**",
          "**A set amount of small changes**, or a stated rate for them",
        ],
      },
      {
        type: "p",
        text: "If a plan doesn't specify all of that in writing, you're buying reassurance rather than maintenance. Ask for the list.",
      },
      { type: "h2", text: "Why plugin-based sites need it more" },
      {
        type: "p",
        text: "This is the part that decides most cases. A WordPress site typically runs a dozen or more plugins, each written by someone else, each updated on its own schedule, each a potential way in when it goes unpatched. That's not a criticism of WordPress — it's the trade-off for its flexibility.",
      },
      {
        type: "p",
        text: "A site built without that plugin surface has far less to maintain. Fewer moving parts, fewer things to patch, less that silently breaks. So the honest rule: the more third-party pieces your site depends on, the more a plan is genuinely necessary rather than upsold.",
      },
      { type: "h2", text: "What it costs" },
      {
        type: "p",
        text: "NZ providers publishing 2026 pricing put maintenance plans in the $50–$300 per month band, depending on whether it's monitoring-only or includes actual work, and hosting at $20–$100 per month. Hosting is often bundled; sometimes it isn't, so ask. All figures NZD, excluding GST — the sourcing is in [annual website maintenance costs in NZ](/blogs/annual-website-maintenance-costs-nz).",
      },
      {
        type: "p",
        text: "The number that matters isn't the monthly fee. It's the monthly fee against what a day of downtime, or a hacked site, would cost your business. For some businesses that's an afternoon of inconvenience. For others it's the whole week's bookings.",
      },
      { type: "h2", text: "When to skip it — genuinely" },
      {
        type: "p",
        text: "If you have a small brochure site, no logins, no payments, no plugin sprawl, sitting on managed hosting that handles platform updates — a monthly plan is money you could spend on something that grows the business. Keep a backup, keep the SSL renewing automatically, and check the site loads once a month.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Ask any provider offering a plan three things: what exactly is included, what the response time is when something breaks, and whether you can see a report of what they did last month. A plan without reporting is a subscription with nothing attached to it.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "What happens if I don't maintain my website?" },
      {
        type: "p",
        text: "Usually nothing, until suddenly something. Unpatched plugins are the most common route into a small business site, and the failure mode is a hacked site or a broken one — often noticed by a customer rather than by you. Static sites with no plugins carry far less of this risk.",
      },
      { type: "h3", text: "Is website maintenance really necessary for a small business?" },
      {
        type: "p",
        text: "It depends what the site is built on and what it does. A plugin-heavy site taking payments needs it. A simple brochure site on managed hosting usually doesn't.",
      },
      { type: "h3", text: "How much should a website maintenance plan cost?" },
      {
        type: "p",
        text: "NZ providers publishing 2026 pricing put plans in the $50–$300 per month band, depending on whether real work is included or just monitoring. Get the inclusions in writing. Figures are NZD and exclude GST.",
      },
      { type: "h3", text: "Can I do website maintenance myself?" },
      {
        type: "p",
        text: "Some of it — running updates, checking the site loads, confirming backups exist. What's harder to do yourself is knowing when an update will break something, and having a way back when it does. [Keeping a website secure without a developer](/blogs/keep-website-secure-without-developer) covers the part you can handle.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Work out what your site is built on and what it would cost you to lose for a day. Those two answers decide this, not a sales page. Tell me both and I'll give you a straight answer — including “you don't need one”. [Get in touch](/contact), or look at [what a plan actually covers](/services/website-maintenance) if you've already decided you want one.",
      },
    ],
  },

  {
    slug: "how-often-website-backup",
    title: "How Often Should a Website Be Backed Up?",
    excerpt:
      "Daily for anything that changes or takes payments, weekly for a static brochure site. What matters more is where backups live and whether they work.",
    coverImage:
      "https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&h=450&fit=crop",
    category: "Web Development",
    publishedAt: "2026-08-16",
    tags: ["Small Business", "Web Development"],
    content: [
      {
        type: "p",
        text: "Short post, because the answer is short — and because the frequency question distracts from the two that actually matter.",
      },
      { type: "h2", text: "The short answer" },
      {
        type: "list",
        items: [
          "**Daily** — if the site takes orders, bookings, payments, or has user accounts. Losing a day means losing real transactions.",
          "**Weekly** — for a brochure site that changes occasionally.",
          "**Before every change** — always, regardless of schedule. Updates and edits are when things break.",
          "**Kept somewhere other than the website's own server** — a backup sitting on the same server as the site isn't a backup.",
          "**Tested at least once** — an untested backup is a hope, not a safeguard.",
        ],
      },
      {
        type: "p",
        text: "The frequency matters less than that last point. Most people who lose a site had backups.",
      },
      { type: "h2", text: "The real question: how much work can you afford to lose?" },
      {
        type: "p",
        text: "Backup frequency is just this question in disguise. If your site is backed up weekly and it fails on day six, you lose six days. For a brochure site, that's a couple of text edits — annoying. For a store, that's six days of orders — a different conversation entirely. So set the frequency by what accumulates, not by what feels responsible.",
      },
      { type: "h2", text: "Where backups live matters more than how often they run" },
      {
        type: "p",
        text: "A backup stored on the same server as your website protects you from exactly one scenario: you broke something. It protects you from none of these:",
      },
      {
        type: "list",
        items: [
          "The server fails",
          "The hosting account is suspended or closed",
          "The site is compromised and the attacker reaches everything on that machine",
        ],
      },
      {
        type: "p",
        text: "Off-server backups — a separate cloud location, or a different provider — cover all three. Ask your host where backups are stored. If the answer is “on the server”, that's worth fixing.",
      },
      { type: "h2", text: "The untested backup problem" },
      {
        type: "p",
        text: "This is the failure people don't see coming. Backups run for two years, everyone assumes they're fine, then the day comes and the restore doesn't work — the database wasn't included, or the files are corrupt, or nobody knows the restore process.",
      },
      {
        type: "p",
        text: "Restore one, once, to a staging environment rather than over your live site. It takes an hour and it's the only way to know.",
      },
      { type: "h2", text: "Who's responsible for yours" },
      {
        type: "p",
        text: "Three possibilities, and you should know which applies:",
      },
      {
        type: "list",
        items: [
          "**Your host** — many managed hosts run automatic backups. Check the retention period; some keep only a few days.",
          "**Your maintenance plan** — if you have one, backups should be listed in it. If they aren't, they may not be happening.",
          "**You** — if neither of the above, it's you, and it's probably not happening.",
        ],
      },
      { type: "h2", text: "When you can be relaxed about it" },
      {
        type: "p",
        text: "A five-page static site with no database, no forms storing data, and content you have copies of elsewhere is nearly self-backing — you could rebuild it from your own files. Weekly host backups are plenty. Don't pay for a daily backup service for a site that changes twice a year.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "How often should I back up my website?" },
      {
        type: "p",
        text: "Daily if it takes payments, bookings or has user accounts. Weekly for a brochure site. Always before making changes.",
      },
      { type: "h3", text: "Where should website backups be stored?" },
      {
        type: "p",
        text: "Somewhere other than the site's own server — a separate cloud location or provider. Same-server backups don't survive a server failure or an account suspension.",
      },
      { type: "h3", text: "Does my hosting company back up my website?" },
      {
        type: "p",
        text: "Often, but not always, and retention varies. Check the frequency and how far back they keep copies. Don't assume.",
      },
      { type: "h3", text: "How do I know if my backups actually work?" },
      {
        type: "p",
        text: "Restore one to a staging environment. It's the only real test, and most people never do it until the day they need it to work.",
      },
      { type: "h3", text: "How long should backups be kept?" },
      {
        type: "p",
        text: "Long enough to cover a problem you didn't notice immediately. Thirty days is a reasonable default — some issues aren't spotted for weeks, and a three-day retention window is useless by then.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Find out three things today: who takes your backups, where they're stored, and whether anyone has ever restored one. If you can't answer all three, that's the gap. Tell me your host and I'll tell you what's likely running. [Get in touch](/contact).",
      },
    ],
  },

  {
    slug: "what-is-web-hosting",
    title: "What Is Web Hosting and How Do I Choose It?",
    excerpt:
      "Hosting explained without jargon — what you're actually paying for, the four types, and the two questions that matter more than price when choosing.",
    coverImage:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
    category: "Web Development",
    publishedAt: "2026-08-16",
    tags: ["Small Business", "Web Development", "New Zealand"],
    content: [
      {
        type: "p",
        text: "Hosting is the computer your website lives on, rented by the month. Most of what's written about it is a feature list. Three things actually matter.",
      },
      { type: "h2", text: "The short answer" },
      {
        type: "list",
        items: [
          "**It's separate from your domain.** The domain is your address; hosting is the building. They're often bought together, which is why people confuse them.",
          "**The account should be in your name**, not your developer's. This is the single most important thing on this page.",
          "**Speed and support matter more than price.** The difference between good and cheap hosting is a few dollars a month and a great deal of aggravation.",
        ],
      },
      { type: "h2", text: "What you're actually renting" },
      {
        type: "p",
        text: "Your website is a pile of files and, usually, a database. Those need to sit on a computer that's connected to the internet permanently, so that when someone types your address, something answers. That computer is the host. That's genuinely it — the rest is variations on how much of that computer is yours and who looks after it.",
      },
      { type: "h2", text: "The four types, briefly" },
      {
        type: "p",
        text: "**Shared hosting** — your site sits on a machine with many others. The cheapest tier, sitting at or below the floor of the band below. Fine for a small brochure site. The downside is neighbours: a busy site on the same machine can slow yours.",
      },
      {
        type: "p",
        text: "**Managed hosting** — shared or dedicated resources, but the host handles updates, security and backups. Usually the right answer for a small business that doesn't want to think about it.",
      },
      {
        type: "p",
        text: "**VPS or cloud** — a defined slice of a machine, yours alone. More control, more responsibility, and a price that scales with the resources you reserve rather than sitting in a fixed band. Right when the site outgrows shared hosting or needs specific configuration.",
      },
      {
        type: "p",
        text: "**Platform hosting** — Shopify, Squarespace and Wix include hosting in the subscription. Simplest, and you don't choose it separately; it comes with the platform.",
      },
      {
        type: "p",
        text: "On price: NZ providers publishing 2026 figures put hosting in the $20–$100 per month band, sourced in [annual website maintenance costs in NZ](/blogs/annual-website-maintenance-costs-nz). Shared plans sit at or under the floor of that band, VPS and cloud above its ceiling. NZD, excluding GST.",
      },
      { type: "h2", text: "What actually matters when choosing" },
      {
        type: "p",
        text: "**Speed.** Where the server physically sits affects load time. For an NZ audience, hosting in New Zealand or Australia is usually faster than the US or Europe. A CDN reduces the difference but doesn't eliminate it.",
      },
      {
        type: "p",
        text: "**Support.** The thing you're really buying. When the site is down at 9am on a Monday, “24/7 support” means nothing if it's a ticket queue. Ask how you reach a human and how fast they answer.",
      },
      {
        type: "p",
        text: "**Backups.** Included? How often? How far back? Stored where? [How often a website should be backed up](/blogs/how-often-website-backup) covers what good looks like.",
      },
      {
        type: "p",
        text: "**Whose name it's in.** Covered next, and it's the one people get wrong.",
      },
      { type: "h2", text: "The ownership trap" },
      {
        type: "p",
        text: "Plenty of developers host client sites under their own account and bill it on. It's convenient, and it's fine — until you want to leave, they stop responding, or they close the business. Then your site lives somewhere you can't reach.",
      },
      {
        type: "p",
        text: "Register the hosting account yourself, in your name, with your card, and give your developer access. That's the whole fix. It takes ten minutes at the start versus weeks of recovery later — [taking over a website from another developer](/blogs/take-over-existing-website-developer) is what the recovery looks like.",
      },
      { type: "h2", text: "When you don't need to choose at all" },
      {
        type: "p",
        text: "If you're on Shopify, Squarespace or Wix, hosting is bundled — there's nothing to pick and no benefit to overthinking it. And if your developer recommends a specific host for good technical reasons, that's often worth following, as long as the account is in your name.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "What's the difference between a domain and hosting?" },
      {
        type: "p",
        text: "The domain is your address; hosting is the building it points at. They're separate services, often sold together, and can be moved independently.",
      },
      { type: "h3", text: "How much should hosting cost for a small business website?" },
      {
        type: "p",
        text: "NZ providers publishing 2026 pricing put hosting in the $20–$100 per month band, NZD excluding GST. Well under that usually means oversold shared hosting, where you pay in speed instead.",
      },
      { type: "h3", text: "Can I change hosting later?" },
      {
        type: "p",
        text: "Yes. Moving a site between hosts is routine work. It's easier when the accounts are already in your name.",
      },
      { type: "h3", text: "Should my web developer host my website?" },
      {
        type: "p",
        text: "They can manage it, but the account should be yours. Convenience now versus being locked out later is the trade-off, and the recovery is far more expensive than the setup.",
      },
      { type: "h3", text: "Does hosting affect SEO?" },
      {
        type: "p",
        text: "Indirectly. Slow hosting means slow pages, and page speed affects both rankings and whether people stay. Server location matters for your target audience. It isn't a ranking factor by itself, but it feeds one that is.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Log in to your hosting account today. If you can't, or it isn't in your name, fix that before you worry about which tier you're on — it's the difference between a bad month and a lost website. [Get in touch](/contact) if you want a second opinion on the setup you've got.",
      },
    ],
  },

  {
    slug: "keep-website-secure-without-developer",
    title: "Website Security Without a Developer",
    excerpt:
      "Six things a non-technical owner can do to keep a website secure — and the two that genuinely need someone technical. No jargon, no scare tactics.",
    coverImage:
      "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=800&h=450&fit=crop",
    category: "Web Development",
    publishedAt: "2026-08-16",
    tags: ["Small Business", "Web Development"],
    content: [
      {
        type: "p",
        text: "Most small business sites aren't targeted deliberately. They're found by automated scans looking for known, unpatched weaknesses — which is good news, because the fixes are boring and you can do most of them yourself.",
      },
      { type: "h2", text: "The short answer" },
      {
        type: "p",
        text: "Six things, in order of how much they matter:",
      },
      {
        type: "list",
        items: [
          "**Keep everything updated** — platform, plugins, themes. Unpatched software is how most sites get compromised.",
          "**Use strong, unique passwords** and turn on two-factor authentication on hosting, CMS and domain accounts.",
          "**Remove what you don't use** — every unused plugin, theme and old admin account is a door you're not watching.",
          "**Keep the SSL certificate valid** so the site doesn't warn visitors away.",
          "**Keep working, off-server backups** — the thing that turns a disaster into an afternoon.",
          "**Limit who has admin access**, and remove people when they leave.",
        ],
      },
      {
        type: "p",
        text: "None of that requires a developer.",
      },
      { type: "h2", text: "Why updates matter more than anything else" },
      {
        type: "p",
        text: "When a vulnerability is found in a popular plugin, two things happen: the developer releases a patch, and the details become public. From that moment, automated scanners start sweeping the internet for sites that haven't applied it.",
      },
      {
        type: "p",
        text: "Your site isn't chosen. It's found. Which means the defence isn't cleverness — it's not being one of the unpatched ones. Set updates to automatic where your platform allows it, and where it doesn't, put a monthly reminder in your calendar. That single habit prevents most of what happens to small business sites.",
      },
      { type: "h2", text: "The passwords conversation, briefly" },
      {
        type: "p",
        text: "Yes, it's tedious. It's also where a real share of compromises start.",
      },
      {
        type: "p",
        text: "Three accounts matter most: hosting, CMS admin, and your domain registrar. Unique passwords on each, stored in a password manager, with two-factor authentication turned on. The registrar is the one people forget, and it's the account that controls everything else — lose it and you lose the address itself.",
      },
      { type: "h2", text: "Delete what you're not using" },
      {
        type: "p",
        text: "Every plugin, theme and admin account you don't need is surface area. The old developer's admin login from two years ago. The three plugins you trialled and abandoned. The theme you switched away from but never removed — still installed, still unpatched, still exploitable. Deleting things is the cheapest security work there is.",
      },
      { type: "h2", text: "What actually needs someone technical" },
      {
        type: "p",
        text: "**Recovery after a compromise.** If a site is hacked, cleaning it properly means finding what was changed, what was left behind, and how they got in. Restoring a backup without closing the hole just resets the clock.",
      },
      {
        type: "p",
        text: "**Server-level configuration** — firewall rules, permissions, anything below the CMS. If it isn't a setting in your admin panel, it isn't your job.",
      },
      { type: "h2", text: "When you're already fine" },
      {
        type: "p",
        text: "If your site is a small static build with no CMS, no plugins, no logins and no database, sitting on managed hosting — there's very little to secure and very little to attack. Keep the SSL valid, keep the accounts locked down, and get on with running your business. Not every site needs a security posture.",
      },
      { type: "h2", text: "What I'd recommend" },
      {
        type: "p",
        text: "Do the six things in the short answer once, properly. Then a monthly ten-minute check: updates applied, site loads, backup exists, SSL valid, no unfamiliar admin accounts. That's more than most small business sites get, and it prevents most of what goes wrong.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Can a small business website really get hacked?" },
      {
        type: "p",
        text: "Yes, and usually not because anyone targeted it. Automated scans look for known unpatched vulnerabilities across the whole internet. Being small doesn't hide you; being updated protects you.",
      },
      { type: "h3", text: "Do I need a security plugin?" },
      {
        type: "p",
        text: "On a plugin-based platform they can help — but they don't substitute for updates, strong passwords and backups. A security plugin on an unpatched site is a lock on an open window.",
      },
      { type: "h3", text: "What do I do if my website is already hacked?" },
      {
        type: "p",
        text: "Get help. Cleaning a compromised site properly means finding the entry point, not just restoring a backup — restore without closing the hole and it happens again. [What to do when your website goes down](/blogs/website-down-what-to-do) covers the first hour.",
      },
      { type: "h3", text: "Is WordPress less secure than a custom site?" },
      {
        type: "p",
        text: "Not inherently — but it has far more third-party plugins, which means more code from more authors to keep patched. The risk is the maintenance burden, not the platform. [Whether you need a maintenance plan](/blogs/do-i-need-a-maintenance-plan) turns largely on this.",
      },
      { type: "h3", text: "How often should I check my website's security?" },
      {
        type: "p",
        text: "Ten minutes a month covers it for most small sites: updates, backups, SSL, admin accounts.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "Do the ten-minute check this week rather than planning a bigger one you won't do. If you want a second pair of eyes, send me the address and I'll tell you what's visible from outside — including that there's nothing to worry about, if that's the case. [Get in touch](/contact).",
      },
    ],
  },

  {
    slug: "website-down-what-to-do",
    title: "What to Do When Your Website Goes Down",
    excerpt:
      "Website down? Work through this in order — check it's really down, find the cause, know who to call. Most outages are one of five things.",
    coverImage:
      "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?w=800&h=450&fit=crop",
    category: "Web Development",
    publishedAt: "2026-08-16",
    tags: ["Small Business", "Web Development"],
    content: [
      {
        type: "p",
        text: "Written as a checklist, because if you're reading this you probably don't want an essay.",
      },
      { type: "h2", text: "The short answer — work through these in order" },
      {
        type: "list",
        items: [
          "**Confirm it's actually down for everyone**, not just you. Use an “is it down” checker, or your phone on mobile data.",
          "**Check your email** — for a suspended hosting account, an expired domain, or a failed payment. This causes more outages than anything technical.",
          "**Check your hosting provider's status page** — if their infrastructure is down, it isn't your site and you can stop looking.",
          "**Ask what changed** — an update, a plugin, an edit, a DNS change in the last 24 hours. Recent change is the most likely culprit.",
          "**Contact your host, then your developer.**",
        ],
      },
      {
        type: "p",
        text: "Most outages are one of five things: an expired domain, an unpaid hosting invoice, a host outage, a bad update, or an expired SSL certificate.",
      },
      { type: "h2", text: "The two that catch people out" },
      {
        type: "p",
        text: "**An expired domain.** The renewal email went to an address you no longer check, or the card on file expired. The site vanishes with no warning and no error that explains itself. Check your registrar first — it's a five-minute fix and it's embarrassingly common.",
      },
      {
        type: "p",
        text: "**An unpaid hosting invoice.** Same story. Hosts suspend accounts for non-payment and the notice often lands in spam. Neither is technical. Both look identical to a catastrophic failure from the outside.",
      },
      { type: "h2", text: "Reading what you're seeing" },
      {
        type: "p",
        text: "The error tells you something:",
      },
      {
        type: "list",
        items: [
          "**“This site can't be reached” or a DNS error** — usually domain or DNS, not the site itself",
          "**500 error** — the server reached your site and something in it broke. Often a recent update or plugin",
          "**403 forbidden** — permissions, or a security tool blocking access",
          "**Account suspended page** — billing, almost always",
          "**Site loads but looks broken** — usually not down at all; a CSS or asset issue, often after an update",
          "**Security warning instead of the site** — an expired SSL certificate, or the site has been flagged",
        ],
      },
      { type: "h2", text: "Who to call, in what order" },
      {
        type: "p",
        text: "**Your host first**, for anything that looks like server, suspension or DNS. They can see things you can't, and it's included in what you pay them.",
      },
      {
        type: "p",
        text: "**Your developer second**, for anything that broke after a change to the site itself.",
      },
      {
        type: "p",
        text: "**Your domain registrar** if the domain has lapsed — sometimes a different company from your host, which is why people forget it exists.",
      },
      {
        type: "p",
        text: "If you can't reach any of them because they hold all the access, that's a different problem, and it's the one worth fixing once the site is back. [Taking over a website from another developer](/blogs/take-over-existing-website-developer) is the route out.",
      },
      { type: "h2", text: "After it's back: the ten minutes that prevent the next one" },
      {
        type: "list",
        items: [
          "Turn on auto-renew for domain and hosting, with a card that isn't about to expire",
          "Point billing notices at an address you actually read",
          "Set up uptime monitoring — free tools will email you when the site stops responding, so you find out before a customer does",
          "Note what caused it. Outages repeat when nobody writes down why.",
        ],
      },
      { type: "h2", text: "When you don't need a developer" },
      {
        type: "p",
        text: "If it was a lapsed domain, an unpaid invoice, or a host-side outage, you don't need anyone technical. Pay it, renew it, or wait it out. Developers get called for plenty of outages that were a billing email in a spam folder, and I'd rather you check that first.",
      },
      { type: "h2", text: "Frequently asked questions" },
      { type: "h3", text: "Why is my website suddenly down?" },
      {
        type: "p",
        text: "Most commonly: an expired domain, unpaid hosting, a host outage, a recent update that broke something, or an expired SSL certificate. Check the first two before assuming anything technical.",
      },
      { type: "h3", text: "How do I know if my website is really down or just down for me?" },
      {
        type: "p",
        text: "Use an online “is it down” checker, or open it on your phone using mobile data rather than your own wi-fi. Local caching and DNS make sites look down when they aren't.",
      },
      { type: "h3", text: "Who do I contact when my website goes down?" },
      {
        type: "p",
        text: "Host first for server, suspension or DNS issues. Developer second if something broke after a change. Registrar if the domain has lapsed.",
      },
      { type: "h3", text: "How long does it take to fix a website that's down?" },
      {
        type: "p",
        text: "Billing and domain issues resolve in minutes to a few hours once paid, though DNS can take longer to propagate. A broken update is usually quick if there's a recent backup. A compromised site takes longest, because it needs cleaning properly rather than just restoring.",
      },
      { type: "h3", text: "How can I stop my website going down again?" },
      {
        type: "p",
        text: "Auto-renew on domain and hosting, billing notices to an address you read, uptime monitoring, and a tested backup before any change. [How often a website should be backed up](/blogs/how-often-website-backup) covers the last one.",
      },
      { type: "h2", text: "Where to start" },
      {
        type: "p",
        text: "If the site is down right now, check your email and your registrar before anything else — that's where most of these end. If you've done that and it's still dark, send me the address and what you've already checked. [Get in touch](/contact).",
      },
    ],
  },
];

/**
 * Fails the build if two posts share a slug.
 *
 * A 2026-08-13 audit found `how-to-compare-web-developer-quotes` listed twice
 * in sitemap.xml AND twice in llms.txt, and diagnosed it as two separate
 * generator bugs. It was one bug, here: the post existed twice in BLOG_POSTS.
 * Everything downstream maps over this array, so a single duplicated entry
 * propagates into the sitemap, llms.txt and DYNAMIC_ROUTES at once — and the
 * prerenderer writes both to the same path, so whichever came last silently
 * won, while findBlogPost() (a .find(), so first match) served the other one
 * to the hydrated page. Two different versions of one post, on one URL.
 *
 * Module scope on purpose: the prerenderer imports this module, so a duplicate
 * breaks `npm run build` instead of shipping. Deduping in the sitemap writer
 * would have hidden the split-brain rendering rather than fixing it.
 */
const duplicateSlugs = BLOG_POSTS.map((p) => p.slug).filter(
  (slug, i, all) => all.indexOf(slug) !== i
);
if (duplicateSlugs.length > 0) {
  throw new Error(
    `blogs.ts: duplicate post slug(s): ${[...new Set(duplicateSlugs)].join(", ")}. ` +
      `Each slug must appear exactly once — see the note above this check.`
  );
}

/**
 * Posts newest-first, for anything that renders a list to a reader.
 *
 * BLOG_POSTS is maintained in the order posts were written, so slicing it
 * directly surfaced the three OLDEST articles — the 2025 React/MERN posts —
 * on the homepage widget, while every buyer-intent post sat below them. Two
 * costs: the site's strongest internal page passed its link equity to the
 * three least commercial posts, and the index read as abandoned to a crawler
 * (newest visible date was Nov 2025 on a site publishing in Aug 2026).
 *
 * A copy, not a sort in place: BLOG_POSTS order is also what the prerenderer
 * and DYNAMIC_ROUTES iterate, and mutating a module-level export from a
 * component render is the kind of thing that works until it doesn't.
 *
 * Sorted on publishedAt, not updatedAt — this is "latest articles", not
 * "recently touched". Revising an old post shouldn't push it back to the top.
 */
export const POSTS_BY_NEWEST: BlogPost[] = [...BLOG_POSTS].sort(
  (a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt)
);

/**
 * Posts related to `post`, best match first.
 *
 * An Aug 2026 audit found every article was reachable only from /blogs. No
 * post linked to another except where a link had been written into the body
 * by hand, which left most of the archive with a single internal path in —
 * a crawl-depth problem and a dead end for anyone who finished reading.
 *
 * Scored rather than hand-curated so it can't rot: a new post becomes
 * eligible everywhere the moment it's added, and deleting one can't strand
 * a hardcoded link.
 *
 * Shared tags dominate the score because tags encode intent ("Pricing",
 * "New Zealand") more precisely than category does. Category breaks ties
 * between posts sharing no tags, and recency breaks ties after that so the
 * related set doesn't ossify around whichever posts happen to be oldest.
 *
 * Always returns `limit` posts where the archive allows it: a post matching
 * nothing on tags or category still gets the newest others, because an empty
 * related block is the problem this function exists to solve.
 */
export function relatedPosts(post: BlogPost, limit = 4): BlogPost[] {
  const tags = new Set(post.tags);
  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug);

  const scored = others
    .map((p) => ({
      p,
      score:
        p.tags.filter((t) => tags.has(t)).length * 3 +
        (p.category === post.category ? 2 : 0),
    }))
    .filter((x) => x.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        Date.parse(b.p.publishedAt) - Date.parse(a.p.publishedAt)
    )
    .map((x) => x.p);

  if (scored.length >= limit) return scored.slice(0, limit);

  // Pad with the newest posts not already chosen.
  const chosen = new Set(scored.map((p) => p.slug));
  const filler = [...others]
    .filter((p) => !chosen.has(p.slug))
    .sort((a, b) => Date.parse(b.publishedAt) - Date.parse(a.publishedAt));

  return [...scored, ...filler].slice(0, limit);
}

export function findBlogPost(slug: string): BlogPost | undefined {
  return BLOG_POSTS.find((post) => post.slug === slug);
}

/**
 * The most recent date across all posts, as the /blogs listing's own lastmod.
 *
 * The listing page's `lastmod` in site.config.mjs was hand-maintained, and had
 * drifted a full ten days behind the posts it lists — a schema audit found
 * WebPage.dateModified saying 2026-07-30 on a page whose own blogPost array
 * carried entries dated 2026-08-09. The listing is, by definition, exactly as
 * fresh as its newest post, so nobody should have to remember to bump it.
 *
 * Dates are ISO (YYYY-MM-DD), which sorts correctly as a string.
 */
export function latestBlogDate(): string {
  return BLOG_POSTS.reduce((latest, post) => {
    const date = post.updatedAt ?? post.publishedAt;
    return date > latest ? date : latest;
  }, "");
}

/**
 * Q&A pairs lifted out of a post's own visible "Frequently asked questions"
 * section, for FAQPage schema.
 *
 * DERIVED, deliberately — not a hand-written `faqs` field on BlogPost.
 *
 * Google treats FAQ markup whose text does not appear on the page as a
 * structured-data violation, and a duplicated array is exactly the thing that
 * silently rots the first time someone edits the prose and forgets the copy
 * underneath it. Reading the rendered blocks means the markup is the page text
 * by construction.
 *
 * It looks for an h2 "Frequently asked questions", then collects
 * question-heading / answer-paragraph pairs until the section ends.
 *
 * Both heading levels are accepted. The three original posts put their
 * questions at h2; newer posts nest them at h3 under the FAQ h2, which is the
 * correct hierarchy. The section ends at the first h2 (any h2 — a new
 * top-level section always closes the FAQ) or the first heading that isn't
 * phrased as a question. Posts with no FAQ section get an empty array and no
 * FAQPage node.
 */
/**
 * Resolves the two inline markers to the plain text a reader actually sees.
 *
 * Mirrors `renderInline()` in BlogDetail: `**bold**` renders as its content,
 * `[label](/path)` renders as its label. The FAQ answers below feed FAQPage
 * schema, and Google treats markup whose text does not appear on the page as
 * a structured-data violation — so an answer containing a link shipped the
 * literal "[label](/path)" into the markup while the page showed "label".
 * Nine posts carried that mismatch before this existed.
 *
 * Kept next to faqsOf rather than exported: the renderer owns the visible
 * side of this, and a second exported formatter invites the two to drift.
 */
function stripInline(text: string): string {
  return text
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1");
}

export function faqsOf(post: BlogPost): { question: string; answer: string }[] {
  const start = post.content.findIndex(
    (b) => b.type === "h2" && /^frequently asked questions/i.test(b.text.trim())
  );
  if (start === -1) return [];

  const faqs: { question: string; answer: string }[] = [];
  let current: { question: string; answer: string[] } | null = null;

  const flush = () => {
    if (current?.answer.length) {
      faqs.push({
        question: stripInline(current.question),
        answer: stripInline(current.answer.join(" ")),
      });
    }
  };

  for (const block of post.content.slice(start + 1)) {
    if (block.type === "h2" || block.type === "h3") {
      flush();
      current = null;
      // A heading that isn't a question closes the section. So does any h2
      // once we've started collecting h3 questions, since that's a new
      // top-level section rather than another FAQ entry.
      if (!block.text.trim().endsWith("?")) return faqs;
      current = { question: block.text.trim(), answer: [] };
      continue;
    }
    // Only prose becomes an answer; the lead-in paragraph before the first
    // question is skipped because `current` is still null there.
    if (current && block.type === "p") current.answer.push(block.text);
  }

  flush();
  return faqs;
}

/** Average adult reading speed for technical prose, words per minute. */
const WORDS_PER_MINUTE = 220;

/** Prose only — code blocks are scanned, not read, so counting them inflates read time. */
export function wordCountOf(post: BlogPost): number {
  return post.content
    .flatMap((b) => {
      if (b.type === "p" || b.type === "h2" || b.type === "h3") return b.text;
      if (b.type === "list") return b.items;
      if (b.type === "table") return [...b.headers, ...b.rows.flat()];
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
