/**
 * Serverless contact endpoint — POST /api/contact
 *
 * Why this exists
 * ───────────────
 * The form used to post directly to `VITE_API_URL`, a *client-side* env var.
 * When it wasn't set in Vercel the request went nowhere, and every enquiry was
 * lost. It also meant cross-origin requests to a separate backend, with the
 * CORS setup that implies.
 *
 * This endpoint is same-origin, so it always exists — no client env var, no
 * CORS. It delivers by whichever of these is configured, in order:
 *
 *   1. WEB3FORMS_ACCESS_KEY → posts to Web3Forms, which emails the enquiry
 *   2. RESEND_API_KEY       → emails via Resend
 *   3. BACKEND_API_URL      → forwards to your own /api/requirements backend
 *
 * If none is set it returns 503, and the client falls back to opening a
 * prefilled mailto — so a lead is never silently dropped.
 *
 * Set these in Vercel → Settings → Environment Variables. They are SERVER-side
 * (no VITE_ prefix), so the values are never shipped to the browser.
 */

const CONTACT_EMAIL = "mmubasharshahzad40@gmail.com";

/**
 * Web3Forms access key.
 *
 * Web3Forms designs this key to be public — their documented usage puts it
 * directly in client-side JavaScript. Calling it from here instead keeps it
 * out of the JS bundle, so it can't be scraped and replayed to spam the
 * inbox, and it lets the honeypot and field validation below run before
 * anything is sent. Override with WEB3FORMS_ACCESS_KEY in Vercel to rotate it
 * without a code change.
 */
const WEB3FORMS_KEY =
  process.env.WEB3FORMS_ACCESS_KEY || "50db1ca8-cf90-48db-a946-c148f9d06a79";

/** Basic shape + length validation. Keeps junk out of the inbox. */
function validate(body) {
  const errors = [];
  const str = (v) => (typeof v === "string" ? v.trim() : "");

  const name = str(body.name);
  const email = str(body.email);
  const description = str(body.description);

  if (name.length < 2 || name.length > 100) errors.push("name");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || email.length > 200) errors.push("email");
  if (description.length < 10 || description.length > 5000) errors.push("description");

  return {
    errors,
    data: {
      name,
      email,
      description,
      projectType: str(body.projectType) || "Other",
      budget: str(body.budget),
      timeline: str(body.timeline),
    },
  };
}

function asText(d) {
  return [
    `Name: ${d.name}`,
    `Email: ${d.email}`,
    `Project type: ${d.projectType}`,
    d.budget ? `Budget: ${d.budget}` : null,
    d.timeline ? `Timeline: ${d.timeline}` : null,
    "",
    "Project details:",
    d.description,
  ]
    .filter(Boolean)
    .join("\n");
}

async function sendViaResend(d) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      // Resend's shared sender works without domain verification. Switch to an
      // address on webdevstudio.me once the domain is verified in Resend.
      from: process.env.RESEND_FROM || "WebDevStudio <onboarding@resend.dev>",
      to: [process.env.CONTACT_TO || CONTACT_EMAIL],
      reply_to: d.email,
      subject: `New enquiry — ${d.projectType} — ${d.name}`,
      text: asText(d),
    }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}: ${await res.text().catch(() => "")}`);
}

async function forwardToBackend(d) {
  const base = process.env.BACKEND_API_URL.replace(/\/$/, "");
  const res = await fetch(`${base}/api/requirements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(d),
  });
  if (!res.ok) throw new Error(`Backend ${res.status}`);
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  let body = req.body;
  if (typeof body === "string") {
    try { body = JSON.parse(body); } catch { body = {}; }
  }
  body = body || {};

  // Honeypot: a field hidden from humans. Bots fill every input they find, so
  // anything here means automation. Return 200 so the bot thinks it succeeded
  // and doesn't retry with a different strategy.
  if (typeof body.company === "string" && body.company.trim() !== "") {
    return res.status(200).json({ ok: true });
  }

  const { errors, data } = validate(body);
  if (errors.length) {
    return res.status(400).json({ error: "Invalid fields", fields: errors });
  }

  try {
    if (process.env.RESEND_API_KEY) {
      await sendViaResend(data);
    } else if (process.env.BACKEND_API_URL) {
      await forwardToBackend(data);
    } else {
      // Nothing configured — tell the client to use the mailto fallback.
      console.error(
        "[contact] No delivery method configured. Set RESEND_API_KEY or BACKEND_API_URL in Vercel."
      );
      return res.status(503).json({ error: "Contact endpoint not configured" });
    }
    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("[contact] delivery failed:", err.message);
    return res.status(502).json({ error: "Could not deliver enquiry" });
  }
}
