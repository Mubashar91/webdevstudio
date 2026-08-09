/**
 * The six hand-written case studies, one file each.
 *
 * They used to be a single 200-line array literal in ../projects.ts, wedged
 * between the type definitions and the helpers. That layout is why the August
 * 2026 portfolio audit found what it found: read one at a time the entries look
 * fine, and the problems — six identical boilerplate sentences, six missing
 * outcomes, five different job titles under a solo-founder footer — are only
 * visible across the set. A file per case study makes each one an object you
 * can open, review and diff on its own, and this index the one place the set is
 * visible as a set.
 *
 * ORDER IS PUBLISHED. It drives the /projects listing, the ItemList JSON-LD
 * position on that page, and the homepage preview. Reordering is a content
 * change, not a refactor.
 */
import type { CaseStudy } from "./types";
import { expenseSharingApp } from "./expense-sharing-app";
import { hospitalManagementSystem } from "./hospital-management-system";
import { softwareHouseWebsite } from "./software-house-website";
import { ecommerceDashboard } from "./ecommerce-dashboard";
import { restfulApiService } from "./restful-api-service";
import { portfolioBlogPlatform } from "./portfolio-blog-platform";

export const STATIC_PROJECTS: CaseStudy[] = [
  expenseSharingApp,
  hospitalManagementSystem,
  softwareHouseWebsite,
  ecommerceDashboard,
  restfulApiService,
  portfolioBlogPlatform,
];

export {
  expenseSharingApp,
  hospitalManagementSystem,
  softwareHouseWebsite,
  ecommerceDashboard,
  restfulApiService,
  portfolioBlogPlatform,
};
