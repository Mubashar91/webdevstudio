import type { CaseStudy } from "./types";

/**
 * /projects/ecommerce-dashboard — legacy /projects/s4 301s here.
 *
 * Best-supported of the six: every claim in the prose has a technology behind
 * it in the stack. Socket.io for the push, Stripe for payments, Chart.js for
 * the analytics views. Nothing here contradicts anything, which is exactly why
 * it is the cheapest page to finish — it needs numbers, not repairs.
 */
export const ecommerceDashboard: CaseStudy = {
  _id: "s4",
  slug: "ecommerce-dashboard",
  title: "E-Commerce Dashboard",
  // 53 chars. Past withBrand()'s 62-character budget once " | WebDevStudio"
  // is added, so this ships without the brand — deliberately. The plain title
  // was 20 characters carrying no keyword at all, and the named stack is what
  // someone searching for this kind of build actually types.
  seoTitle: "E-Commerce Dashboard Case Study — React, Node & Stripe",
  subtitle:
    "Live inventory, orders and payments in one view that stays readable",
  // Doubles as the meta description. The previous version was 173 characters
  // and truncated in results; this leads with what the thing is.
  description:
    "A real-time e-commerce dashboard in React, Node.js and Socket.io — live inventory, orders and Stripe payments that stay readable at scale.",
  fullDescription:
    "Inventory, orders and payments in one operational view: Socket.io for the values that change under the operator, Stripe for payments so no card data reaches the application, and server-computed analytics.",
  image:
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=450&fit=crop",
  technologies: [
    "React",
    "Redux",
    "Node.js",
    "MongoDB",
    "Stripe",
    "Chart.js",
    "Socket.io",
  ],
  repoUrl: null,
  demoUrl: null,
  type: "MERN",
  appCategory: "BusinessApplication",
  context: null,
  timelineMonths: 6,
  completedAt: null,
  teamSize: 5,
  roleDetail: null,
  problem:
    "An e-commerce dashboard has to stay readable while the numbers change underneath it.\n\n" +
    "Inventory, orders and payments all update independently and on different rhythms — stock moves on every sale, orders arrive in bursts, payment status settles minutes later. A naive implementation picks one of two bad options: poll the API every few seconds and burn server capacity to show mostly-unchanged data, or fetch once and quietly display figures that are already stale.\n\n" +
    "Neither is acceptable when somebody is using the screen to decide whether to reorder stock or refund a customer. Stale numbers on an operations dashboard are not a cosmetic problem — they produce wrong decisions, and the person making them has no way to tell.",
  // Two edits left in this paragraph, both needing a fact only you have:
  //
  // 1. "a cached query layer" — name it. With Redux already in the stack a
  //    reader cannot tell whether this was RTK Query, React Query, or hand-
  //    rolled reducers with a TTL. A named tool is checkable; "a layer" is not,
  //    and vagueness next to six specific technologies reads as cover.
  //
  // 2. "large order volumes" — large is doing all the work in that sentence.
  //    10k orders and 500k orders are different engineering problems. One
  //    number replaces the whole clause.
  //
  // "Stripe handles payments so no card data touches the application" stays as
  // written — it shows you understand PCI scope reduction without saying so.
  approach:
    "Socket.io pushes updates only for the values that genuinely change moment to moment — stock levels, incoming orders, payment status transitions. Everything else is fetched through a cached query layer.\n\n" +
    "Splitting it that way is a decision about cost and stability rather than convenience. Pushing everything over sockets means every connected browser receives a firehose of updates it does not need, and the interface spends its time re-rendering instead of being useful. Scoping the socket channel to the handful of genuinely volatile fields keeps the connection light and the screen calm. The trade-off is that cached values can sit a few seconds behind — which is the right call for a revenue chart and the wrong one for a stock count, so the split is decided per field rather than applied uniformly.\n\n" +
    "Stripe handles payments so no card data touches the application. Nothing cardholder-related reaches the database, there are no card fields in the app, and the PCI scope drops to the lightest tier available. Handling card data yourself buys nothing a payment processor does not already do better, and costs you an audit obligation.\n\n" +
    "The analytics views are computed server-side. Sending raw order records to the browser and letting JavaScript aggregate them is what makes dashboards freeze — the tab locks while it grinds through the history. Aggregating in the database keeps the payload small and the browser responsive as that history grows, and Chart.js renders series that are already summarised.",
  hardPart: null,
  outcome: null,
  retrospective: null,
  screenshots: [],
  updatedAt: "2026-08-11",
};
