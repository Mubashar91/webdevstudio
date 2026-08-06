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
  {
    slug: "custom-web-app-cost-2026",
    title: "How Much Does a Custom Web App Cost in 2026? A Developer's Honest Breakdown",
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
        text: "Nobody wants to be the client who asks “how much does a custom web app cost” and gets back “it depends.” It does depend — but the things it depends on are knowable, and you're entitled to see them before you sign anything. This is how I price work, what pushes a quote from $800 to $5,000, and where you can genuinely save money without ending up with something you'll pay someone else to rebuild in eighteen months.",
      },
      { type: "h2", text: "How much does a custom web app cost? The three price bands" },
      {
        type: "p",
        text: "Most custom web projects fall into one of three shapes. These are my own fixed-price bands, and they're the same numbers on my services page.",
      },
      {
        type: "list",
        items: [
          "Marketing site — from $300, 2–3 weeks: up to about six pages, React and TypeScript, SEO foundations, a contact form, Core Web Vitals tuned",
          "Web application — from $800, 6–10 weeks: a full MERN build, auth and roles, a REST API, a MongoDB schema, an admin dashboard, a deploy pipeline",
          "Ongoing partner — from $400 a month, rolling: dedicated hours, features, code review, performance and accessibility audits",
        ],
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
        text: "Budget for it as a real line item — dependency updates, security patches and small fixes don't stop after launch. My retainers start at $400 a month; ad hoc work is also fine if your needs are occasional.",
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
          "Starting price — website from $300, web app from $800, mobile app significantly more since it's two platforms",
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
        text: "If you'd like a straight answer on which one your situation calls for, book a free 30-minute call. I'll tell you if a website is enough, and I'll tell you if you don't need to build anything at all — that answer has saved more than one person a five-figure mistake.",
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
        text: "If you'd like to try that conversation with no strings attached: book a free 30-minute call. You'll get honest answers about scope and a fixed written quote, and if your problem doesn't need a developer at all, I'll tell you that too.",
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
