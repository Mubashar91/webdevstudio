/**
 * API base URL resolution.
 *
 * The localhost fallback is DEV-ONLY on purpose. Previously it applied in
 * production too, so a missing VITE_API_URL meant every contact-form
 * submission silently POSTed to http://localhost:5000 and every lead was lost.
 * In production we now surface the misconfiguration instead of swallowing it,
 * and the contact form falls back to a prefilled mailto so the enquiry still
 * reaches an inbox.
 */
const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;

export const API_BASE_URL =
  rawApiUrl?.replace(/\/$/, "") ||
  (import.meta.env.DEV ? "http://localhost:5000" : "");

/** True when the app was built without a backend URL — production only. */
export const API_MISCONFIGURED = !API_BASE_URL;

if (API_MISCONFIGURED && import.meta.env.DEV) {
  // DEV only now. The contact form no longer depends on this — it posts to the
  // same-origin /api/contact function — so a missing VITE_API_URL only affects
  // the projects list and the admin panel, both of which degrade gracefully to
  // static data. Warning on every production page view would be noise.
  console.warn(
    "[config] VITE_API_URL is not set. The projects list will use static data " +
      "and the admin panel will not connect. The contact form is unaffected."
  );
}

/** Inbox that receives enquiries when the API is unreachable or unset. */
export const CONTACT_EMAIL = "mmubasharshahzad40@gmail.com";

export interface RequirementPayload {
  name: string;
  email: string;
  projectType: string;
  description: string;
  budget?: string;
  timeline?: string;
  /** Honeypot. Real submissions leave this empty; see api/contact.js. */
  company?: string;
}

/** Builds a prefilled mailto: URL carrying the whole enquiry. */
export function buildEnquiryMailto(form: RequirementPayload): string {
  const subject = `Project enquiry — ${form.projectType} — ${form.name}`;
  const body = [
    `Name: ${form.name}`,
    `Email: ${form.email}`,
    `Project type: ${form.projectType}`,
    form.budget ? `Budget: ${form.budget}` : null,
    form.timeline ? `Timeline: ${form.timeline}` : null,
    "",
    "Project details:",
    form.description,
  ]
    .filter(Boolean)
    .join("\n");

  return `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(
    subject
  )}&body=${encodeURIComponent(body)}`;
}

/**
 * Submits an enquiry to the same-origin serverless endpoint (api/contact.js).
 *
 * Deliberately NOT `${API_BASE_URL}/api/requirements` any more. That depended
 * on VITE_API_URL — a client-side build variable that wasn't set in Vercel, so
 * the request had nowhere to go and every lead was lost. `/api/contact` always
 * exists, needs no client config, and avoids CORS entirely; the delivery
 * method is chosen server-side where the credentials live.
 *
 * Throws on any failure so the caller can trigger the mailto fallback.
 */
export async function submitRequirement(form: RequirementPayload): Promise<void> {
  const res = await fetch("/api/contact", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...form,
      budget: form.budget || undefined,
      timeline: form.timeline || undefined,
      company: form.company ?? "",
    }),
  });

  if (!res.ok) {
    throw new Error(
      (await res.text().catch(() => "")) || `Request failed (${res.status})`
    );
  }
}
