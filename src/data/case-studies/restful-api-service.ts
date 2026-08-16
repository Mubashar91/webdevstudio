import type { CaseStudy } from "./types";

/**
 * /projects/restful-api-service — legacy /projects/s5 301s here.
 *
 * The most credible-sounding prose of the six and the weakest portfolio piece,
 * because it describes standard API hygiene with no product attached. Two
 * facts fix that, and both are cheap:
 *
 *   1. WHAT DID IT SERVE, and who consumed it. An API with no consumer reads
 *      as a tutorial. One clause in `problem` closes it.
 *
 *   2. A BENCHMARK. This is the only page on the site whose missing number you
 *      can generate today rather than dig out of an old analytics account:
 *      point autocannon or k6 at it locally, once with Redis on and once with
 *      it off, and publish both figures. Label it a lab benchmark on your own
 *      machine — that caveat is not a weakness, it is what a careful engineer
 *      writes, and it turns "APIs fall over under real traffic" from an
 *      assertion into a measurement. An afternoon's work.
 *
 * And if the Swagger docs can be hosted, host them and set `demoUrl`. A live
 * Swagger UI is the most convincing artifact a backend project can have — the
 * reader hits the endpoints themselves. That single link solves this page's
 * share of the portfolio-wide "nothing verifiable" problem outright.
 */
export const restfulApiService: CaseStudy = {
  _id: "s5",
  slug: "restful-api-service",
  title: "RESTful API Service",
  subtitle:
    "A Node.js API that holds up under traffic, not just in development",
  // Dropped "for high-traffic production environments" — that is a claim about
  // load, and there is no number on this page supporting it. Describe what was
  // built; let the benchmark make the performance claim once it exists.
  description:
    "Node.js REST API with Redis caching on read-heavy endpoints, stateless JWT auth, rate limiting where it costs most, and a Swagger-documented contract.",
  fullDescription:
    "A REST API built to survive its own success: cached reads, stateless sessions so instances scale horizontally, per-route rate limits, one consistent error shape, and Docker to keep local and deployed environments identical.",
  image:
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&h=450&fit=crop",
  technologies: ["Node.js", "Express", "MongoDB", "Redis", "JWT", "Swagger", "Docker"],
  repoUrl: null,
  demoUrl: null,
  type: "Node",
  context: null,
  timelineMonths: 2,
  completedAt: null,
  teamSize: 2,
  roleDetail: null,
  problem:
    "APIs that work fine in development fall over under real traffic, usually because every request hits the database and nothing limits how fast a client can ask.",
  // If versioning was part of this, name the strategy rather than the noun:
  // "URL path" or "Accept header" is three words and shows a decision was
  // made. "API versioning" on its own shows only that the term is known.
  approach:
    "Redis caches the read-heavy endpoints and JWT handles stateless auth so the service scales horizontally. Rate limiting sits in front of the routes that cost the most, errors follow one consistent shape, and Swagger documents the contract so consumers are not reverse-engineering responses. Docker keeps local and production environments identical.",
  hardPart: null,
  outcome: null,
  retrospective: null,
  screenshots: [],
  updatedAt: "2026-08-09",
};
