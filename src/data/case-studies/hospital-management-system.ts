import type { CaseStudy } from "./types";

/** /projects/hospital-management-system — legacy /projects/s2 301s here. */
export const hospitalManagementSystem: CaseStudy = {
  _id: "s2",
  slug: "hospital-management-system",
  title: "Hospital Management System",
  subtitle:
    "One patient record, three staff roles, and no double-booked appointments",
  description:
    "Hospital platform where role-based access is enforced server-side, so the UI only ever hides what the API already refuses. Patient records, scheduling, and staff workflows in one system.",
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
  context: null,
  timelineMonths: 5,
  completedAt: null,
  teamSize: 4,
  roleDetail: null,
  problem:
    "Hospital software fails on permissions before it fails on features. Reception, doctors and administrators need the same patient record to show different things, and appointment scheduling has to hold up when two people book the same slot.",
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
    "Role-based access control was designed first and enforced server-side, so the UI only ever hides what the API already refuses. Appointments are validated against the practitioner's calendar at write time rather than in the client, and patient records are indexed on the fields staff actually search by.",
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
