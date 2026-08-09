# Visual & Mobile-Rendering Audit — webdevstudio.me
Date: 2026-08-09
Tool: Playwright (via claude-seo capture_screenshot.py), desktop 1920x1080 + mobile 375x812 (iPhone), plus targeted full-page captures.

Pages audited: `/` (home), `/services`, `/projects` (+ project detail `/projects/hospital-management-system`), `/about`, one blog post `/blogs/mern-stack-architecture-guide`.

Screenshots saved to: `C:\Users\mmuba\Downloads\frontend\frontend\webdevstudio.me-audit\screenshots\`
- `desktop.png` / `mobile.png` — homepage (canonical names per persistence contract)
- `home-desktop.png` / `home-mobile.png` — duplicates, homepage
- `services-desktop.png` / `services-mobile.png` / `services-fullpage.png`
- `projects-desktop.png` / `projects-mobile.png`
- `project-detail-hospital-fullpage.png` — individual case-study page, full page
- `about-desktop.png` / `about-mobile.png`
- `blog-desktop.png` / `blog-mobile.png`
- `footer-crop-check.png`, `services-footer-crop.png`, `services-footer-crop2.png` — diagnostic crops

## Score: 58/100

The prior "zero images sitewide" finding (July 30 audit, Images 10/100) is **partially resolved, not solved**. Images now exist, but they don't fill the gap that was flagged. Mobile responsiveness and above-the-fold execution are otherwise strong.

## Top issues

1. **Still no real project screenshots — the core gap survives, just disguised.** (High priority, confirms memory note `webdevstudio-pending-owner-inputs.md` item 5/7: `CaseStudy.screenshots` is still `null` for all six projects.)
   - `/projects` listing now shows a photo on every card — but they are generic stock photography, not product screenshots: a stock photo of hands on tax paperwork ("Expense-Sharing Mobile App"), a stock photo of a physical hospital lobby ("Hospital Management System"), a stock photo of a laptop with a generic dashboard mockup ("Fast Marketing Site"). None of these depict the actual delivered UI.
   - Opened the Hospital Management System detail page (`project-detail-hospital-fullpage.png`) end-to-end: the hero is the same stock hospital-lobby photo, and despite dedicated "The problem" / "The approach" / "Stack" sections, there is **no in-context screenshot of the actual application UI anywhere on the page**. A visitor evaluating "can this person build software" sees zero evidence of the product itself.
   - Net effect for a hiring/trust audit: this reads as decorative filler that may even look worse than no images at all, since it could read as misrepresenting stock photos as project work. Recommend either real screenshots (even low-fi/annotated ones) or removing photos in favor of the existing icon-based treatment used on `/services`.
   - The homepage and `/about` page still have **zero images** — not even a headshot of Muhammad Mubashar Shahzad on `/about`, which is the highest-trust placement for one.
   - Blog post checked has one generic stock photo (laptop showing unrelated code) at the top; not a screenshot of the article's subject matter either, but lower-stakes than the projects gap.

2. **Possible footer/CTA rendering bug on `/services` (and likely other pages) — needs live manual confirmation.** Full-page capture of `/services` shows a large solid-gradient band with a CTA at the very bottom that renders with **no visible text or content** (`services-footer-crop2.png`), followed by ~600px of blank whitespace before the page ends (also reproduced on the project detail page, `footer-crop-check.png`). Two possible explanations:
   - A scroll-triggered fade-in animation (e.g., Framer Motion `whileInView`) that stays at `opacity:0` because the automated full-page screenshot doesn't incrementally scroll to fire IntersectionObserver callbacks — a capture artifact, not a real bug.
   - A genuine CSS/content bug (missing footer component, or white-text-on-white-background contrast failure).
   Recommend a quick manual scroll-through in a real browser to confirm which; if it's a capture artifact, no action needed, but if the footer really is missing/invisible when scrolled to naturally, this is a site-wide defect (nav links, copyright, contact info potentially unreachable via footer) worth flagging as high priority.

3. **Theme-toggle consistency is unverified, not necessarily broken.** Homepage screenshot rendered in dark mode; `/services`, `/projects`, `/about`, and the blog post all rendered in light mode. Since each Playwright capture opens a fresh, isolated browser context (no shared localStorage), this is expected behavior for cross-page automated capture and does **not** demonstrate a bug in real user sessions (client-side routed SPA navigation should preserve the toggle within one browser tab). Flagged only so a human can confirm the toggle persists correctly when clicking between nav links in one live session.

## Above-the-fold assessment (desktop + mobile, all 4 static pages)

- **Home**: H1 ("React & MERN development for growing businesses"), subhead, two CTAs ("Book a free 30-min call", "See recent work"), and trust bullets all visible without scrolling on both viewports. A `developer.ts` code-snippet illustration sits alongside on desktop — a nice touch that fills the "no photo" gap tastefully for the hero specifically.
- **Services**: H1, breadcrumb, description, single clear CTA ("Get a quote") all above the fold on both viewports.
- **Projects**: H1, CTA ("Start a project"), and filter tabs are above the fold on desktop; on mobile the filter tabs are visible but the first project card is just below the fold (minor, acceptable).
- **About**: H1 (person's name), badge, contact details (location/email/phone) all above the fold on both viewports. No CTA above the fold here — the page leads straight into "Professional Summary" — acceptable for a bio page.
- **Blog post**: headline, byline, meta (date/read time) above the fold on both viewports; the stock hero image starts right at/just below the fold on desktop, fully below fold on mobile.
- No layout-shift artifacts observed in the static captures (content occupied final position, no visible overlap of hero text/CTA with other elements).

## Mobile responsiveness (375x812)

- **Navigation**: collapses correctly to a hamburger icon (three lines) at ≤768px; header stays compact and doesn't overlap content.
- **Touch targets**: primary CTAs ("Book a free 30-min call", "Get a quote", "Start a project") render as full-width pill buttons, comfortably exceeding 48x48px. Filter tabs on `/projects` (mobile) also look adequately sized, though tap-target testing was visual only (no synthetic tap-size measurement was run — recommend `agent_ux_check.py` or a Lighthouse tap-target audit as a follow-up if precision is needed).
- **Text sizing**: body copy and headings scale legibly at this width; no evidence of sub-16px base font or need-to-zoom text in any of the 5 pages checked.
- **No horizontal scroll observed** in any of the 5 mobile captures — content stayed within the 375px viewport edge-to-edge with consistent padding.
- **Dark-mode toggle and hamburger menu icons** are present and appropriately sized on every page's mobile header.

## Layout/visual issues summary

| Page | Desktop | Mobile | Notes |
|---|---|---|---|
| Home | Clean, no images (by design — code snippet only) | Clean, matches desktop hierarchy | No issues |
| Services | Clean; icon-only service cards (no stock photos here — inconsistent with `/projects`) | Clean | Footer/CTA band renders blank in full-page capture — needs live check |
| Projects | Stock photos on every card, not real screenshots | Same photos, correctly scaled | Core content gap (see issue #1) |
| Project detail (sampled: Hospital Management System) | Same stock-photo pattern; no real UI screenshot anywhere in body | Not separately captured, but detail template is shared | Same footer/blank-space anomaly as Services |
| About | No headshot/photo at all | Same | Missing trust-building photo |
| Blog post | One generic stock photo, unrelated to content | Same, below fold | Lower priority than projects gap |

## Recommendation priority

1. Replace/add real project screenshots on `/projects` and each project-detail page — this remains the single highest-leverage content gap, now compounded by the fact that generic stock photos are standing in for them (risk: looks like misrepresentation).
2. Manually verify the blank footer/CTA band on `/services` and project-detail pages in a live scrolled session — confirm it's a scroll-animation artifact and not a real content/contrast bug.
3. Consider adding a headshot to `/about` for trust.
4. Everything else — above-the-fold CTA placement, mobile nav, touch-target sizing, text legibility, absence of horizontal scroll — is in good shape and needs no immediate work.
