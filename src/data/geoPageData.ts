/**
 * Single source of truth for the geo landing pages' city coverage.
 *
 * Imported by the page components AND by the JSON-LD builder in
 * entry-server.tsx, so the cities named in visible copy and the ones claimed in
 * `areaServed` cannot drift apart. Drift is the specific thing to avoid: a city
 * asserted in schema but absent from the page is a local-SEO mismatch.
 *
 * Prompted by real Search Console data — "web developer nicosia" is the
 * strongest non-brand query on the site, and Nicosia is named in both the
 * Cyprus copy and its areaServed. "react developers hamilton" was pulling
 * impressions while Hamilton appeared nowhere on the site at all, so the
 * cities below extend that pattern to the centres that were missing.
 *
 * NOTE ON FAQs: the geo FAQ entries deliberately do NOT live here. NZ_FAQS and
 * CYPRUS_FAQS in site.config.mjs already feed both the visible accordion
 * (via LocationHighlights) and the FAQPage schema (via routeGraph). Adding a
 * second FAQ array here would either duplicate the schema node or render text
 * the markup doesn't cover — the exact mismatch this file exists to prevent.
 */

export interface GeoGraph {
  country: string;
  /** Cities named in body copy AND in areaServed. Keep these identical. */
  cities: string[];
  heading: string;
  intro: string;
  note: string;
}

export const nzGeo: GeoGraph = {
  country: "New Zealand",
  cities: [
    "Auckland",
    "Wellington",
    "Christchurch",
    "Hamilton",
    "Tauranga",
    "Dunedin",
  ],
  heading: "Cities I work with across New Zealand",
  intro:
    "I work remotely with businesses anywhere in New Zealand — Auckland, Wellington, Christchurch, Hamilton, Tauranga, Dunedin and everywhere between. The workflow is identical wherever you are, because everything runs through video calls, shared project boards and daily written updates.",
  note: "If you're outside the main centres, remote usually works in your favour: you get senior React and MERN capacity at a fixed price, without an Auckland or Wellington agency's overhead.",
};

export const cyGeo: GeoGraph = {
  country: "Cyprus",
  cities: ["Limassol", "Nicosia", "Larnaca", "Paphos", "Famagusta"],
  heading: "Cities I work with across Cyprus",
  intro:
    "I work remotely with businesses across Cyprus — Limassol, Nicosia, Larnaca, Paphos and Famagusta. A 2–3 hour time zone gap means genuine live overlap most afternoons, so it feels closer to working with someone locally than a typical offshore arrangement.",
  note: "Fixed-price quotes in EUR or USD, with the scope and the number agreed before any work starts.",
};

/**
 * `areaServed` for a single-city landing page (e.g. /web-developer-auckland).
 *
 * Imported by BOTH the page component's runtime JSON-LD and the prerenderer's
 * pageSchema() in entry-server.tsx, for the same reason buildAreaServed() is
 * shared: hydration replaces the prerendered graph wholesale, so a second copy
 * defined in the component would silently diverge from the one crawlers see.
 *
 * City first, then the country it sits in — the city is what this page is
 * about, the country is context. Auckland is unambiguous enough not to need
 * the Hamilton treatment, but the containedInPlace edge is kept for shape
 * consistency with buildAreaServed().
 */
export function cityArea(city: string, country: string) {
  return [
    {
      "@type": "City",
      name: city,
      containedInPlace: { "@type": "Country", name: country },
    },
    { "@type": "Country", name: country },
  ];
}

/**
 * Builds the `areaServed` array for a location page's Service node.
 *
 * `containedInPlace` is set on every city deliberately. Hamilton is the reason:
 * there is also a Hamilton in Ontario and one in Scotland, so a bare
 * `{ "@type": "City", "name": "Hamilton" }` is ambiguous to a crawler trying to
 * resolve the entity. Qualifying all of them keeps the shape consistent and
 * costs nothing.
 */
export function buildAreaServed(geo: GeoGraph) {
  return [
    { "@type": "Country", name: geo.country },
    ...geo.cities.map((name) => ({
      "@type": "City",
      name,
      containedInPlace: { "@type": "Country", name: geo.country },
    })),
  ];
}
