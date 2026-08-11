import { useEffect, useMemo } from "react";
import { DEFAULT_OG_IMAGE, SITE_NAME, SITE_URL } from "@/lib/seo";
import { ogImageSize } from "@/lib/site.config.mjs";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  canonical?: string;
  ogImage?: string;
  ogType?: string;
  noindex?: boolean;
  structuredData?: object | object[];
}

export const useSEO = ({
  title,
  description,
  keywords,
  canonical,
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  noindex = false,
  structuredData,
}: SEOProps) => {
  // Callers build their graph inline, so `structuredData` is a new object
  // identity on every render. Depending on it directly made the effect tear
  // down and re-append every JSON-LD script on each render. Keying on the
  // serialized form means the DOM is only touched when the data changes —
  // and the serialized string is what gets written anyway.
  const structuredDataJson = useMemo(
    () => (structuredData ? JSON.stringify(structuredData) : ""),
    [structuredData]
  );

  useEffect(() => {
    document.title = title;

    const setMeta = (selector: string, content: string, attr = "name") => {
      let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${selector}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, selector);
        document.head.appendChild(el);
      }
      el.setAttribute("content", content);
    };

    setMeta("description", description);
    if (keywords) setMeta("keywords", keywords);
    setMeta("robots", noindex ? "noindex, nofollow" : "index, follow, max-image-preview:large");

    setMeta("og:title", title, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", ogType, "property");
    setMeta("og:image", ogImage, "property");
    // The declared size has to follow the image it describes. Client-side
    // navigation swaps og:image between routes whose covers are different
    // heights, so leaving the prerendered numbers in place would announce the
    // previous page's dimensions for the current page's card. Unknown size
    // means the tags come off entirely — see ogImageSize().
    const size = ogImageSize(ogImage, SITE_URL);
    for (const [prop, value] of [
      ["og:image:width", size && String(size.width)],
      ["og:image:height", size && String(size.height)],
    ] as const) {
      if (value) setMeta(prop, value, "property");
      else document.querySelector(`meta[property="${prop}"]`)?.remove();
    }
    setMeta("og:site_name", SITE_NAME, "property");
    if (canonical) setMeta("og:url", canonical, "property");

    setMeta("twitter:card", "summary_large_image", "name");
    setMeta("twitter:title", title, "name");
    setMeta("twitter:description", description, "name");
    setMeta("twitter:image", ogImage, "name");

    if (canonical) {
      let link = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.setAttribute("rel", "canonical");
        document.head.appendChild(link);
      }
      link.setAttribute("href", canonical);
    }

    // Remove any JSON-LD baked in at build time by the prerenderer before
    // adding the runtime graph, otherwise a hydrated page carries two copies
    // of the same entities with conflicting @id nodes.
    document
      .querySelectorAll('script[type="application/ld+json"]')
      .forEach((el) => el.remove());

    const scripts: HTMLScriptElement[] = [];
    if (structuredDataJson) {
      const parsed = JSON.parse(structuredDataJson);
      const items = Array.isArray(parsed) ? parsed : [parsed];
      items.forEach((data, index) => {
        const script = document.createElement("script");
        script.type = "application/ld+json";
        script.setAttribute("data-seo", `page-${index}`);
        script.textContent = JSON.stringify(data);
        document.head.appendChild(script);
        scripts.push(script);
      });
    }

    return () => {
      scripts.forEach((s) => s.remove());
    };
  }, [title, description, keywords, canonical, ogImage, ogType, noindex, structuredDataJson]);
};
