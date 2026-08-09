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

/**
 * Dimensions for the same image when it goes into <head> rather than the page:
 * BlogPosting.image, CreativeWork.image, og:image, twitter:image.
 *
 * The card size is 800px wide, which is right for the card and too small
 * everywhere else — Google wants at least 1200px to consider an article for
 * large-image treatment, and social previews degrade below it too. A schema
 * audit flagged every article and case-study image at 800px for this reason.
 * 16:9 is kept so the crop matches what's on the page.
 */
export const SCHEMA_IMAGE = { width: 1200, height: 675 } as const;

/**
 * Re-requests an Unsplash URL at SCHEMA_IMAGE size.
 *
 * Only the w/h query parameters change, so this is the same crop of the same
 * photo — no second URL to keep in step with the card's. Non-Unsplash URLs
 * (and any without explicit sizing) pass through untouched, since nothing can
 * be assumed about how they're served.
 */
export function schemaImage(url: string | undefined): string | undefined {
  if (!url || !url.includes("images.unsplash.com")) return url;
  return url
    .replace(/([?&]w=)\d+/, `$1${SCHEMA_IMAGE.width}`)
    .replace(/([?&]h=)\d+/, `$1${SCHEMA_IMAGE.height}`);
}
