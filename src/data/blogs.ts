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
      "What a custom web app really costs, what drives the number up, and the four levers that cut the price without cutting quality — from a developer who quotes fixed prices.",
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
      "Real 2026 NZ website prices: $1,500–$8,000 + GST for most small business sites. What each band buys, what agencies leave out, and how to compare quotes properly.",
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
      "When an offshore developer is the right call and when a local agency is worth several times the price — written by a remote developer who'll tell you to hire locally sometimes.",
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
        text: "If you'd like to try that conversation with no strings attached: book a free 30-minute call. You'll get honest answers about scope and a fixed written quote, and if your problem doesn't need a developer at all, I'll tell you that too.",
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
        text: "If you're mid-comparison right now, send me the brief you're sending everyone else and I'll tell you whether the scope makes sense and what a fair number looks like for it — including when I think you'd be better served elsewhere. [Get in touch](/contact), or [see recent work](/projects).",
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
      "The checks that separate a good web developer from an expensive one: how to audit their live work in ten minutes, 12 questions to send in writing, and the ownership clause most contracts leave out.",
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
        text: "If you're at the quoting stage, bring me that brief and I'll tell you honestly whether the scope makes sense — including if I think you'd be better served elsewhere. [Get in touch](/contact), or [see recent work](/projects).",
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
        text: "All figures NZD, excluding GST. A website is closer to a vehicle than a painting — the ongoing number is not optional, and leaving it out of the original decision is how people end up surprised.",
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
        text: "Inherited a site nobody has touched in two years? Send me the URL and I'll tell you what state it's actually in: what's outdated, what's exposed, and what it would take to make it safe. No charge for the look. [Get in touch](/contact), or [see recent work](/projects).",
      },
    ],
  },
  {
    slug: "website-vs-social-media",
    title: "Website vs Social Media: Why You Need Both",
    excerpt:
      "Why a business website still beats relying on social alone — what you don't own on a platform, what each channel is actually good at, and how they work together.",
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
        text: "The smartest way to control that is to build the smallest version that delivers real value, use existing services for solved problems, and nail scope before development starts. If you want an honest scope-and-cost conversation — including whether you need a full application yet — [get in touch](/contact).",
      },
    ],
  },
  {
    slug: "take-over-existing-website-developer",
    // 44 chars — withBrand() lands on 59, inside the 62 limit.
    title: "Taking Over a Website From Another Developer",
    excerpt:
      "Your developer has gone quiet, or you want to move on. Here's the four pieces of access to secure first, how to recover them when someone else holds the keys, and what a takeover actually costs.",
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
          // Was /blogs/web-developer-contract-checklist — a forward-reference
          // to an unwritten post that shipped as a real 404. Repointed to the
          // published post that actually covers ownership clauses.
          "**Get ownership in writing** before work starts — the code, the domain, the hosting, the design files, transferring on final payment. [How to choose a web development company](/blogs/how-to-choose-a-web-development-company) covers the ownership clauses to insist on.",
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
      { type: "h3", text: "Is it cheaper to fix an old website or rebuild it?" },
      {
        type: "p",
        text: "Fix it if the site works, performs, and mainly needs maintenance — rebuilding to solve a maintenance problem is expensive and risks the search visibility the current site has accumulated. Rebuild if the audit finds no version control, outdated dependencies and no staging, and you also want significant new functionality on top. In that combination the cost of working carefully inside fragile code usually overtakes the cost of replacing it within about eighteen months.",
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
      "Three quotes, three prices, no way to compare them. The ten things to check in a web developer quote before you sign — scope, ownership, revisions, maintenance and change costs — with NZ and Cyprus ranges.",
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
        text: "Market ranges published by providers in each country, not my quote. Yours will differ with scope and with who you hire.",
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
      "Adding a booking system, logins or payments to an existing site? The price depends less on the feature than on the codebase it lands in. Here's what drives the number, and when a rebuild is cheaper.",
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
        text: "The fix has to sit at the point the data is written — a uniqueness constraint, a transaction, or a version check on the slot — and it's the difference between a calendar staff trust and one they quietly abandon for a paper diary. On the [hospital system I built](/projects/hospital-management-system), that decision was made before any feature work started, because a calendar nobody trusts is worse than no calendar at all: it still has to be maintained.",
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
export function faqsOf(post: BlogPost): { question: string; answer: string }[] {
  const start = post.content.findIndex(
    (b) => b.type === "h2" && /^frequently asked questions/i.test(b.text.trim())
  );
  if (start === -1) return [];

  const faqs: { question: string; answer: string }[] = [];
  let current: { question: string; answer: string[] } | null = null;

  const flush = () => {
    if (current?.answer.length) {
      faqs.push({ question: current.question, answer: current.answer.join(" ") });
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
