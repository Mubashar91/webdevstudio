import type { CaseStudy } from "./types";

export const mkNailsBeauty: CaseStudy = {
  _id: "mk-nails-beauty",
  slug: "mk-nails-beauty",
  title: "MK Nails & Beauty — Salon Website, Cyprus",
  subtitle: "A fast, mobile-first website for a two-branch salon in Larnaca and Nicosia",
  description:
    "A fast, mobile-first website for a two-branch nails and beauty salon in Larnaca and Nicosia — built to be found locally and to get bookings started.",
  fullDescription:
    "MK Nails & Beauty operates two branches in Larnaca and Nicosia offering nails, laser hair removal, body treatments, facials, brows, lashes, and permanent makeup. The website is built for mobile-first discovery and local search, with separate location pages and a clear path to booking.",
  image: "/images/mk-nails-beauty/hero.jpg",
  seoTitle: "MK Nails & Beauty — Salon Website, Cyprus | WebDevStudio",
  technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
  repoUrl: null,
  demoUrl: "https://mknailsnbeauty.com",
  type: "Business Website",
  context: "Cyprus",
  timelineMonths: 3,
  completedAt: "2026-08-15",
  teamSize: 1,
  roleDetail: "Designed and built solo",
  problem:
    "Beauty salons live on being found and being trusted. Someone searching for laser hair removal at night on a phone is comparing three salons in ninety seconds. They want to see the work, know the services, and find a way to get in touch — fast. MK Nails & Beauty had two challenges: two branches serving different customers, and a wide service list (nails, laser, body treatments, facials, brows, lashes, permanent makeup) where each service needed to be discoverable separately.",
  approach:
    "Mobile-first design built from the start on a phone screen, not adapted down. Photography and galleries are the primary selling tool — for a beauty business, images do what copy cannot. Services are structured as individual pages so each can rank for its own search term. Both Larnaca and Nicosia locations are represented with local context. A clear path to contact includes tap-to-call and WhatsApp options, which outperform contact forms for salons.",
  hardPart:
    "The challenge wasn't technical — it was information architecture. A salon has many services but one booking system. If all services live on one page, none can rank individually for 'laser hair removal Larnaca' or 'permanent makeup Nicosia'. The solution was separate service pages linked from a clear location structure, so the search intent each page targets is unambiguous.",
  outcome:
    "Launched live on mknailsnbeauty.com. Site loads in under 2 seconds on mobile 3G, with Lighthouse mobile score 94+. Indexed for both branch names and service terms within two weeks of launch.",
  retrospective:
    "This is the first client site on the portfolio where the proof is one click away — anyone can open it and verify the work. For a business-to-consumer site, that changes the credibility completely.",
  screenshots: [
    "/images/mk-nails-beauty/hero.jpg",
    "/images/mk-nails-beauty/services.jpg",
    "/images/mk-nails-beauty/locations.jpg",
  ],
  testimonial: null,
  updatedAt: "2026-08-15",
};
