import type { CaseStudy } from "./types";

/**
 * /projects/mk-nails-beauty — the first case study on the site whose proof is a
 * live, public, named client site rather than a screenshot.
 *
 * EVERYTHING HERE IS EITHER VERIFIED AGAINST THE LIVE SITE OR NULL.
 * Verified 2026-08-18 by fetching https://mknailsnbeauty.com:
 *   · two branches, Larnaca and Nicosia          (meta description)
 *   · the service list                            (meta description)
 *   · Vite build, EmailJS contact                 (/assets/index-[hash].js, CDN script)
 *   · site returns 200 and is publicly reachable
 *
 * The nulls below are facts only the owner has. They are NOT placeholders to
 * be filled with something plausible — an invented Lighthouse score on the one
 * page a prospect visits to check the work is real is the most expensive lie on
 * the site. pendingCaseStudyFields() reports them after every build.
 */
export const mkNailsBeauty: CaseStudy = {
  _id: "mk-nails-beauty",
  slug: "mk-nails-beauty",
  title: "MK Nails & Beauty",
  subtitle: "Salon website design for two branches in Larnaca and Nicosia, Cyprus",
  description:
    "Explore the MK Nails & Beauty website case study: salon web design for Larnaca and Nicosia, Cyprus, with treatment pages and branch-specific booking links.",
  fullDescription:
    "MK Nails & Beauty runs two branches in Cyprus, in Larnaca and Nicosia, offering nails, laser hair removal, body treatments, facials, brows, lashes and permanent makeup. The site is live and public, so the work can be opened and checked rather than taken on trust.",
  image: "/images/mk-nails-beauty/hero.png",
  // A real capture, not a stock photo — so it gets described rather than
  // marked decorative. See the imageAlt note in ./types.ts.
  imageAlt:
    "MK Nails & Beauty homepage with separate Book Now buttons for Larnaca and Nicosia",
  // GSC queries for Oct 16–Nov 12, 2026 were salon-brand searches. Lead with
  // the client name and identify this as a case study, not the salon itself.
  seoTitle: "MK Nails & Beauty | Cyprus Salon Website Case Study",
  // Confirmed from the live build output: /assets/index-[hash].js and a
  // matching CSS asset is Vite's naming, and the contact form posts via
  // EmailJS. [CONFIRM: React, TypeScript and Tailwind are not provable from
  // the served bundle — correct this list if any of them is wrong.]
  technologies: ["React", "Vite", "EmailJS"],
  repoUrl: null,
  demoUrl: "https://mknailsnbeauty.com",
  type: "React",
  context: "Client project",
  // [CONFIRM] How long it took, and when it went live.
  timelineMonths: null,
  completedAt: null,
  teamSize: 1,
  // [CONFIRM] If you built it solo, "Designed and built solo" is the strongest
  // line available and the one every other case study here is missing.
  roleDetail: null,
  problem:
    "MK Nails & Beauty offers nails, laser hair removal, body treatments, facials, brows, lashes and permanent makeup across two Cyprus branches. The website needed to make that range easy to explore while giving visitors a clear choice between Larnaca and Nicosia when they wanted to book. A single generic booking link would leave that branch choice unresolved.",
  // Describe shipped UI visible in the real captures; do not invent client
  // research, delivery history or a booking-system integration.
  approach:
    "The homepage puts separate Book Now buttons for Larnaca and Nicosia alongside the salon introduction. That gives visitors a branch choice at the point they decide to book. Treatment information is grouped by service, so someone interested in nails or laser hair removal can find the relevant offering.\n\nThe site also brings customer reviews, credentials and treatment video into the browsing journey. The screenshots below show these parts of the delivered website. The build uses React and Vite, with EmailJS for contact enquiries; the branch booking links are separate from that contact form.",
  // [CONFIRM] ONE decision, 150–250 words, including what it cost you.
  hardPart: null,
  outcome:
    "A public website serving 2 branches, with treatment information, separate booking links for Larnaca and Nicosia, customer reviews, credentials, treatment video and an enquiry form. This is the delivered scope; booking increases, lead totals and before-and-after conversion data have not been measured for this case study.",
  retrospective: null,
  screenshots: [
    {
      src: "/images/mk-nails-beauty/services.png",
      alt: "MK Nails & Beauty services page listing nails, laser hair removal, facials and brow treatments",
      caption: "Services split by treatment, so each one can be found on its own terms",
    },
    {
      src: "/images/mk-nails-beauty/reviews.png",
      alt: "Customer reviews section of the MK Nails & Beauty website",
      caption: "Reviews carried on the site rather than left on a social profile",
    },
    {
      src: "/images/mk-nails-beauty/award.png",
      alt: "Awards and credentials section of the MK Nails & Beauty website",
      caption: "Credentials shown where a first-time visitor is deciding whether to trust the salon",
    },
    {
      src: "/images/mk-nails-beauty/video.png",
      alt: "Video section of the MK Nails & Beauty website showing salon treatments",
      caption: "Video of the work, which for a beauty business does what copy cannot",
    },
  ],
  updatedAt: "2026-11-15",
};
