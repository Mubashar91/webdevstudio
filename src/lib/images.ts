/**
 * Image URL + sizing helpers.
 *
 * Two problems this solves:
 *
 * 1. Unsplash is hotlinked and returns plain JPEG even when the browser
 *    advertises AVIF/WebP support. Its imgix backend negotiates format via a
 *    URL parameter, so `auto=format` alone typically saves 30-60% of bytes.
 *
 * 2. <img> tags shipped without width/height, so the browser could not reserve
 *    space before the image loaded — the layout shifted as each one arrived.
 *    Passing intrinsic dimensions lets the browser compute the aspect ratio up
 *    front, which is the fix for image-driven CLS.
 */

/** Adds format negotiation + sensible quality to an Unsplash URL. Other hosts pass through. */
export function optimizedImage(url: string | undefined): string | undefined {
  if (!url) return url;
  if (!url.includes("images.unsplash.com")) return url;
  if (url.includes("auto=format")) return url;
  return `${url}${url.includes("?") ? "&" : "?"}auto=format&q=75`;
}

/** Intrinsic dimensions for the 16:9 cards used across projects and blog. */
export const CARD_IMAGE = { width: 800, height: 450 } as const;
