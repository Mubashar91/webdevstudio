/**
 * Client testimonials.
 *
 * ─────────────────────────────────────────────────────────────────────────
 * HOW TO ADD A REAL ONE
 * ─────────────────────────────────────────────────────────────────────────
 * 1. Get the client's written permission to publish their name and company.
 * 2. Fill in every field below. `company` and `companyUrl` matter most —
 *    a checkable attribution converts far better than a bare first name.
 * 3. Set `verified: true`. Entries left false are never rendered.
 * 4. Prefer quotes that name a specific outcome ("cut checkout time by 40%")
 *    over general praise ("great to work with"). Specificity is what makes a
 *    testimonial persuasive to someone deciding whether to hire you.
 *
 * The six placeholder entries that used to live in Testimonials.tsx have been
 * removed: they paired invented names with Unsplash stock portraits, which
 * prospective clients reverse-image-search and recognise. A site showing no
 * testimonials reads as new; a site showing fake ones reads as dishonest.
 * ─────────────────────────────────────────────────────────────────────────
 */

export interface Testimonial {
  /** Full name, as the client agreed to have it published. */
  name: string;
  /** Job title, e.g. "Head of Product". */
  role: string;
  /** Company name — the single strongest credibility signal here. */
  company: string;
  /** Optional link to the company site so the claim is checkable. */
  companyUrl?: string;
  /** The quote itself. Aim for 2–3 sentences naming a concrete result. */
  content: string;
  /** Optional headshot URL. Use a real photo the client provided, or omit
   *  it — initials render instead. Never substitute a stock portrait. */
  image?: string;
  /** Optional link to the project this testimonial refers to. */
  projectUrl?: string;
  /** Only `true` entries are rendered. Keeps drafts out of production. */
  verified: boolean;
}

export const TESTIMONIALS: Testimonial[] = [
  // ── Template — copy this block, fill it in, set verified: true ──
  // {
  //   name: "Jane Smith",
  //   role: "Head of Product",
  //   company: "Acme Logistics",
  //   companyUrl: "https://acme-logistics.example",
  //   content:
  //     "Mubashar rebuilt our booking flow in React and cut page load from 6s to under 1.5s. Support tickets about the checkout dropped by roughly half in the first month.",
  //   projectUrl: "/projects/acme-booking",
  //   verified: true,
  // },
];

/** Entries safe to render publicly. */
export const publishedTestimonials = (): Testimonial[] =>
  TESTIMONIALS.filter((t) => t.verified);

/** Initials fallback for testimonials without a supplied headshot. */
export function initialsOf(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
