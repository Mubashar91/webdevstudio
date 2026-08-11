import type { CaseStudy } from "./types";

/** /projects/hospital-management-system — legacy /projects/s2 301s here. */
export const hospitalManagementSystem: CaseStudy = {
  _id: "s2",
  slug: "hospital-management-system",
  title: "Hospital Management System",
  // 41 chars, so withBrand() still fits " | WebDevStudio" inside 62. The H1
  // keeps the plain name; this only changes <head>.
  seoTitle: "Hospital Management System — MERN case study",
  subtitle:
    "One patient record, three staff roles, and no double-booked appointments",
  // Doubles as the meta description, so it stays inside ~155 characters and
  // leads with the two decisions the page is actually about.
  description:
    "A hospital platform where reception, doctors and administrators share one patient record — permissions enforced at the API, appointments validated at write time.",
  fullDescription:
    "Patient registration, appointment scheduling and staff workflows behind one permission model — reception, doctors and administrators see the same record shaped by what their role is allowed to read.",
  image:
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=800&h=450&fit=crop",
  // PostgreSQL removed 2026-08-09.
  //
  // The list read React · TypeScript · Node · MongoDB · Tailwind · PostgreSQL
  // under a MERN badge, with nothing anywhere explaining why one system needs
  // two databases. To a technical reader that is not an impressive stack, it
  // is a tell — polyglot persistence is a real decision and it always comes
  // with a reason attached.
  //
  // If Postgres genuinely was in here, put it back WITH the clause that
  // justifies it, in `approach`: "Mongo for clinical documents, Postgres for
  // billing where the transactional guarantees matter" is the shape. Never the
  // bare name on its own.
  //
  // Same rule killed the "real-time notifications" capability this page used
  // to claim: there is no Socket.io, no SSE and no push service in the stack.
  // Don't reinstate the feature without the technology that delivers it.
  technologies: ["React", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS"],
  repoUrl: null,
  demoUrl: null,
  type: "MERN",
  appCategory: "HealthApplication",
  context: null,
  timelineMonths: 5,
  completedAt: null,
  teamSize: 4,
  roleDetail: null,
  problem:
    "Hospital software fails on permissions before it fails on features. Reception, doctors and administrators all need the same patient record, but each needs it to show something different — and getting that wrong is not a UI bug, it is a records breach.\n\n" +
    "The second failure point is scheduling. The moment two people can book the same slot, staff stop trusting the calendar and go back to paper — and a calendar nobody trusts is worse than no calendar, because it still has to be maintained.\n\n" +
    "So two requirements were fixed before any feature work started: every role sees exactly what its role permits and no more, and two concurrent bookings for the same practitioner and slot can never both succeed.",
  // "The UI only ever hides what the API already refuses" stays word for word.
  // It names a specific failure mode — client-side-only authorisation — and
  // the correct fix, in one clause. It is the best sentence on the site.
  //
  // The double-booking half does NOT land yet, and finishing it is the single
  // highest-value edit left on any of these six pages. The problem statement
  // raises a race; "validated at write time" does not resolve one, and any
  // reader who has hit this bug knows it. One clause naming the actual
  // mechanism turns the claim into proof. It was one of:
  //   · a unique compound index on (practitionerId, startTime)
  //   · the write wrapped in a transaction
  //   · an optimistic version check on the slot
  // Only you know which. Replace the "validated against" clause with it.
  approach:
    "Role-based access control was designed first and enforced server-side, so the UI only ever hides what the API already refuses. Removing the client-side check by hand gets you a 403, not a patient record — a hidden button is a convenience, never a security boundary.\n\n" +
    "Appointments are validated against the practitioner's calendar at write time rather than in the client. A client-side availability check is a display optimisation: it cannot arbitrate between two requests that arrive in the same second, because each was rendered from a calendar that was accurate when it loaded and stale by the time it was submitted. Putting the decision at the write boundary makes the calendar the single source of truth about what is actually booked.\n\n" +
    "Patient records are indexed on the fields staff actually search by — not on every field, which inflates the cost of every write, and not on the defaults, which miss how reception really looks somebody up with a patient standing at the counter.",
  hardPart: null,
  // Also missing and conspicuous for a system holding medical records: one
  // sentence on data protection. Encryption at rest, audit logging of record
  // access, HIPAA / GDPR / the NZ Health Information Privacy Code — whichever
  // applied. Silence reads as never having been asked the question. If this
  // ran on seeded demo data and never touched a real patient record, saying
  // exactly that is a complete and credible answer.
  outcome: null,
  retrospective: null,
  screenshots: [],
  updatedAt: "2026-08-09",
};
