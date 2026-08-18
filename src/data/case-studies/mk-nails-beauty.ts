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
  subtitle: "A salon website for two branches, in Larnaca and Nicosia",
  description:
    "Website for a nails and beauty salon with branches in Larnaca and Nicosia, Cyprus — built to be found locally and to make getting in touch easy from a phone.",
  fullDescription:
    "MK Nails & Beauty runs two branches in Cyprus, in Larnaca and Nicosia, offering nails, laser hair removal, body treatments, facials, brows, lashes and permanent makeup. The site is live and public, so the work can be opened and checked rather than taken on trust.",
  image: "/images/mk-nails-beauty/hero.png",
  // A real capture, not a stock photo — so it gets described rather than
  // marked decorative. See the imageAlt note in ./types.ts.
  imageAlt:
    "The MK Nails & Beauty homepage, showing the salon's branding and its main booking call to action",
  seoTitle: "MK Nails & Beauty — Salon Website, Cyprus",
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
    "A salon is found or it isn't. Someone looking for laser hair removal is on a phone, at night, comparing two or three places in about a minute — they want to see the work, find the service they came for, and get in touch, in that order. Two things make that harder here than it sounds: two branches whose customers search differently, and a service list wide enough that anyone arriving for one of them has no interest in the other six on the way past.",
  // [CONFIRM] What you actually decided and built. The paragraph below is the
  // shape of the answer, not the answer — replace it with what you did.
  approach: null,
  // [CONFIRM] ONE decision, 150–250 words, including what it cost you.
  hardPart: null,
  // [CONFIRM] Wants a digit. The cheapest honest number available is a
  // PageSpeed Insights run on the live site — five minutes, real, and more
  // than any other case study on this site currently has.
  outcome: null,
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
  updatedAt: "2026-08-18",
};
