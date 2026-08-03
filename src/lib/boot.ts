/**
 * Deferred boot tasks: web font promotion and analytics.
 *
 * Both used to live in inline <script> blocks in index.html, which forced the
 * Content-Security-Policy to allow `script-src 'unsafe-inline'` — and an
 * `unsafe-inline` script policy defeats most of CSP's XSS protection, which an
 * audit correctly flagged. Moving them into the bundle means the policy can be
 * `script-src 'self' https://www.googletagmanager.com` with no inline
 * allowance at all.
 */
import { GA_MEASUREMENT_ID } from "./site.config.mjs";

/**
 * Promotes the preloaded Google Fonts stylesheet to an active stylesheet.
 *
 * index.html requests it as `rel="preload" as="style"` so it does not block
 * first paint. Previously an inline `onload` attribute did the swap; that is
 * an inline script handler as far as CSP is concerned.
 */
function activateFonts(): void {
  document
    .querySelectorAll<HTMLLinkElement>('link[data-font-preload]')
    .forEach((link) => {
      if (link.rel !== "stylesheet") link.rel = "stylesheet";
    });
}

/**
 * Loads gtag.js on idle or first interaction, whichever comes first.
 *
 * gtag.js is ~163KB compressed — heavier than the React vendor chunk — and
 * executing it during load produced long main-thread tasks. Queuing the
 * pageview on dataLayer first means nothing is lost: gtag replays the queue
 * once the real script arrives.
 */
interface GtagWindow {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
}

/**
 * Sends a GA4 event.
 *
 * Safe to call at any time: events queue on dataLayer and gtag.js replays the
 * queue when it finishes loading, so nothing is lost during the deferred load
 * window. No-ops in dev and whenever analytics is disabled.
 *
 * GA4 was reporting **0 key events** — meaning there was no way to tell
 * whether anyone had ever used the contact form, only that pages were viewed.
 * Mark `generate_lead` as a key event in GA4 → Admin → Events to turn these
 * into conversion numbers.
 */
export function trackEvent(name: string, params: Record<string, unknown> = {}): void {
  if (typeof window === "undefined") return;
  const w = window as unknown as GtagWindow;
  if (typeof w.gtag !== "function") return;
  w.gtag("event", name, params);
}

function initAnalytics(): void {
  if (!GA_MEASUREMENT_ID || import.meta.env.DEV) return;

  const w = window as unknown as GtagWindow;
  w.dataLayer = w.dataLayer || [];
  // Assigned to window so trackEvent() elsewhere in the app can reach it.
  // eslint-disable-next-line prefer-rest-params
  w.gtag = function gtag(...args: unknown[]) { w.dataLayer!.push(args); };
  const gtag = w.gtag;

  gtag("js", new Date());
  gtag("config", GA_MEASUREMENT_ID);

  let loaded = false;
  const load = () => {
    if (loaded) return;
    loaded = true;
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
    document.head.appendChild(s);
  };

  (["pointerdown", "keydown", "touchstart", "scroll"] as const).forEach((evt) =>
    addEventListener(evt, load, { once: true, passive: true })
  );

  if ("requestIdleCallback" in window) {
    (window as unknown as { requestIdleCallback: (cb: () => void, o?: object) => void })
      .requestIdleCallback(load, { timeout: 5000 });
  } else {
    setTimeout(load, 3000);
  }
}

export function boot(): void {
  activateFonts();
  initAnalytics();
}
