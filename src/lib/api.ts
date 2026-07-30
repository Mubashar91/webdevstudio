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

if (API_MISCONFIGURED) {
  // Visible in the browser console and in build/preview logs so this cannot
  // ship unnoticed a second time.
  console.error(
    "[config] VITE_API_URL is not set. Contact form submissions will fall back " +
      "to email. Set VITE_API_URL in your hosting environment variables."
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
 * Submits an enquiry. Throws on any failure so the caller can trigger the
 * mailto fallback — a lead is never dropped silently.
 */
export async function submitRequirement(form: RequirementPayload): Promise<void> {
  if (API_MISCONFIGURED) {
    throw new Error("No backend configured");
  }

  const res = await fetch(`${API_BASE_URL}/api/requirements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...form,
      budget: form.budget || undefined,
      timeline: form.timeline || undefined,
    }),
  });

  if (!res.ok) {
    throw new Error(
      (await res.text().catch(() => "")) || `Request failed (${res.status})`
    );
  }
}
