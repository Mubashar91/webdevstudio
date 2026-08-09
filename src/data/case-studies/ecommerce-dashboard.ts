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
  subtitle:
    "Live inventory, orders and payments in one view that stays readable",
  description:
    "Admin dashboard where only the genuinely live values are pushed over Socket.io and everything else is cached, so the numbers stay current without the client polling the API.",
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
  context: null,
  timelineMonths: 6,
  completedAt: null,
  teamSize: 5,
  roleDetail: null,
  problem:
    "An e-commerce dashboard has to stay readable while numbers change underneath it. Inventory, orders and payments all update independently, and a naive implementation either polls constantly or shows figures that are quietly out of date.",
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
    "Socket.io pushes updates for the values that genuinely change in real time, while everything else is fetched through a cached query layer to avoid hammering the API. Stripe handles payments so no card data touches the application, and the analytics views are computed server-side to keep the browser responsive with large order volumes.",
  hardPart: null,
  outcome: null,
  retrospective: null,
  screenshots: [],
  updatedAt: "2026-08-09",
};
