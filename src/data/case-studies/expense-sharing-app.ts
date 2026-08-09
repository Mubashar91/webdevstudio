import type { CaseStudy } from "./types";

/** /projects/expense-sharing-app — legacy /projects/s1 301s here. */
export const expenseSharingApp: CaseStudy = {
  _id: "s1",
  slug: "expense-sharing-app",
  title: "Expense-Sharing Mobile App",
  subtitle:
    "Split bills across a group without balances drifting out of sync",
  description:
    "React Native app for shared group expenses. Balances are derived from the transaction log rather than stored, so they cannot drift from the expenses behind them.",
  // Was "A comprehensive expense tracking application that enables users to
  // split bills…" — the same "comprehensive / modern / beautiful" opener that
  // led all six of these. It asserts nothing and reads as generated.
  fullDescription:
    "Group expense tracking on iOS and Android: expenses, derived balances, settlement as its own transaction type, and push notification when someone adds a cost to a group you're in.",
  image:
    "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=450&fit=crop",
  technologies: [
    "React Native",
    "Node.js",
    "Express",
    "MongoDB",
    "JWT",
    "Firebase Cloud Messaging",
  ],
  repoUrl: null,
  demoUrl: null,
  type: "MERN",
  context: null,
  timelineMonths: 4,
  completedAt: null,
  teamSize: 3,
  roleDetail: null,
  problem:
    "Splitting shared costs across a group is deceptively hard. Balances have to stay correct while several people add expenses at once, and everyone needs to see the same number at the same time. Doing that on top of a plain CRUD API produces stale balances and arguments about who owes what.",
  approach:
    "Balances are derived from the transaction log rather than stored as a mutable field, so they can never drift out of sync with the expenses behind them. Settlement is modelled as its own transaction type, which keeps history auditable. JWT auth with refresh tokens covers the mobile session, and Firebase handles push so users hear about a new expense without opening the app.",
  // The derived-balance decision is the one worth 200 words here: recomputing
  // from the log is correct by construction but gets slower as the log grows,
  // and the honest version names where that stops being free — the group size
  // and expense count you actually tested at, and the snapshot you'd add past
  // it. That number is yours; the shape of the answer is above.
  hardPart: null,
  outcome: null,
  retrospective: null,
  screenshots: [],
  updatedAt: "2026-08-09",
};
