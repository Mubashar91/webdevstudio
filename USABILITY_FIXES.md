# Usability Issues & Fixes

This document contains concrete, minimal code fixes for all 13 usability issues found on https://www.webdevstudio.me/.

---

## Issue 1: No consistent type scale (14 distinct font sizes)

**Root Cause:** Tailwind's default scale is used inconsistently across components without a constrained system. Each section uses arbitrary sizes based on visual needs rather than a unified scale.

**Fix:** Update `tailwind.config.ts` to constrain the type scale to ~8-10 sizes:

```js
// tailwind.config.ts
export default {
  theme: {
    fontSize: {
      xs: ['0.75rem', { lineHeight: '1rem' }],        // 12px
      sm: ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
      base: ['1rem', { lineHeight: '1.5rem' }],       // 16px
      lg: ['1.125rem', { lineHeight: '1.75rem' }],    // 18px
      xl: ['1.25rem', { lineHeight: '1.75rem' }],     // 20px
      '2xl': ['1.5rem', { lineHeight: '2rem' }],      // 24px
      '3xl': ['1.875rem', { lineHeight: '2.25rem' }], // 30px
      '4xl': ['2.25rem', { lineHeight: '2.5rem' }],   // 36px
      '5xl': ['3rem', { lineHeight: '1' }],           // 48px
      '6xl': ['3.75rem', { lineHeight: '1' }],        // 60px
    },
  },
}
```

Then audit components and replace arbitrary sizes (e.g., `text-[15px]`, `md:text-4xl`) with the standardized scale.

---

## Issue 2: Too many text colours (30 distinct text colours)

**Root Cause:** Components use inline color utilities and opacity variations without a palette constraint. E.g., `text-white/60`, `text-white/40`, `text-muted-foreground`, etc.

**Fix:** Define a constrained color palette in `tailwind.config.ts` and use only those:

```js
// tailwind.config.ts
export default {
  theme: {
    textColor: {
      // Core palette
      white: 'white',
      black: 'black',
      
      // Semantic
      foreground: 'hsl(var(--foreground))',
      'foreground-muted': 'hsl(var(--foreground) / 0.7)',
      'foreground-dim': 'hsl(var(--foreground) / 0.5)',
      
      muted: 'hsl(var(--muted-foreground))',
      'muted-dim': 'hsl(var(--muted-foreground) / 0.6)',
      
      primary: 'hsl(var(--primary))',
      'primary-dim': 'hsl(var(--primary) / 0.7)',
      
      // For dark hero sections
      'surface-text': 'white',
      'surface-text-muted': 'hsl(0 0% 100% / 0.6)',
      'surface-text-dim': 'hsl(0 0% 100% / 0.4)',
      'surface-text-dimmer': 'hsl(0 0% 100% / 0.25)',
    },
  },
}
```

Then replace inline color usage. Example in Hero.tsx:

```diff
- <p className="text-xs text-white/40 font-medium">
+ <p className="text-xs text-surface-text-dimmer font-medium">
```

---

## Issue 3: Many button styles (7 distinct button styles)

**Root Cause:** Buttons use multiple variant combinations (default, outline, ghost) plus inline shadow, scale, and border overrides. The Button component in `src/components/ui/button.tsx` needs consolidation.

**Fix:** Standardize to 4 variants in the Button component:

```tsx
// src/components/ui/button.tsx
// Ensure only these 4 variants exist:
const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-lg font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
  {
    variants: {
      variant: {
        default:  "bg-primary text-white hover:bg-primary/90 shadow-sm shadow-primary/30",
        outline:  "border border-border/50 hover:bg-muted/70 hover:border-primary/25",
        ghost:    "hover:bg-muted/50",
        secondary: "bg-muted text-foreground hover:bg-muted/80",
      },
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-10 px-4 text-base",
        lg: "h-12 px-6 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
)
```

Replace all inline button customizations with these 4 variants. Remove `rounded-xl`, `rounded-2xl`, custom shadows, and scale transforms from individual button usages.

---

## Issue 4 & 7: Misaligned 'Get a quote' buttons in pricing cards

**Root Cause:** The pricing card container uses `flex flex-col` but doesn't pin the button to the bottom. Feature lists and "Built this way" links vary in height, pushing the button down.

**Fix:** Update the pricing card container in `src/components/Pricing.tsx` (line 118-127):

```diff
- <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto items-start">
+ <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
```

And update the card wrapper (line 120-128):

```diff
  <div
    key={pkg.id}
-   className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-500
+   className={`relative flex flex-col rounded-2xl border p-7 transition-all duration-500 h-full
      ${pkg.featured
        ? "border-primary/40 bg-card shadow-[0_16px_56px_hsl(var(--primary)/0.16)] md:-mt-4 md:pb-9"
        : "border-border/50 bg-card shadow-card hover:border-primary/25 hover:shadow-card-hover"}
      ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
```

Then update the feature list to not grow (line 160):

```diff
- <ul className="space-y-3 mb-8 flex-1">
+ <ul className="space-y-3 mb-8">
```

And update the button container to use `mt-auto` (line 190):

```diff
  <Button
    asChild
+   className="w-full h-11 font-bold rounded-xl gap-2 group mt-auto
-   className={`w-full h-11 font-bold rounded-xl gap-2 group
```

---

## Issue 5: Social media icons grouped with location statement

**Root Cause:** In Hero.tsx (lines 265-301), the region links and social icons share one flex row with `gap-x-6`. This creates visual proximity between unrelated items.

**Fix:** Separate them into distinct rows in `src/components/Hero.tsx`:

```diff
  {/* Regions + socials share one row... */}
- <div className="flex flex-wrap items-center justify-center lg:justify-start
-   gap-x-6 gap-y-4 animate-fade-in">
+ <div className="flex flex-col lg:flex-row lg:items-center lg:justify-start
+   gap-6 animate-fade-in">
+   
    <p className="text-xs text-white/40 font-medium">
      Working with clients in{" "}
      {regions.map((r, i) => (
```

Add a visual separator:

```diff
    </p>

+   <div className="hidden lg:block w-px h-5 bg-white/10" />

    <div className="flex items-center gap-2.5">
```

---

## Issue 6 & 11: 7 items in 3-column grid (orphaned card)

**Root Cause:** `Projects.tsx` (line 148) uses `lg:grid-cols-3` with 7 items, leaving one card alone on the final row.

**Fix:** Center the orphaned card by adjusting the grid wrapper in `src/components/Projects.tsx` (line 147):

```diff
  {!loading && (
-   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
+   <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 justify-items-center lg:justify-items-start
+     [&>article:nth-last-child(1):nth-child(3n+2)]:lg:col-start-2
+     [&>article:nth-last-child(1):nth-child(3n+2)]:lg:col-span-1">
```

Or use CSS Grid with a simpler approach—add this to `src/index.css`:

```css
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

@media (min-width: 768px) {
  .projects-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .projects-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

/* Center orphaned card if it's alone */
.projects-grid > article:last-child:nth-child(3n+2):nth-child(-n+3) {
  grid-column: 2 / 3;
}

@media (max-width: 1023px) {
  .projects-grid > article:last-child:nth-child(odd) {
    grid-column: 1 / -1;
    max-width: 100%;
    margin: 0 auto;
  }
}
```

Then update the grid div:

```diff
- <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
+ <div className="projects-grid">
```

---

## Issue 8: 'Ongoing Partner' card lacks 'Built this way' link

**Root Cause:** The third pricing card has no matching "Built this way" case study link. This breaks visual symmetry.

**Fix:** Add a visual spacer to the "Ongoing Partner" card in `src/components/Pricing.tsx`. Update the `proofOf` logic or add a spacer element:

```diff
  {/* Proof sits above the CTA, not below it... */}
- {proofOf(pkg.proofSlug) && (
+ {proofOf(pkg.proofSlug) ? (
    <Link
      to={proofOf(pkg.proofSlug)!.href}
-     className="mb-4 flex items-start gap-2 rounded-xl border border-border/50
-       bg-surface-alt/60 px-3.5 py-3 text-xs leading-snug
-       hover:border-primary/30 transition-colors group/proof"
+     className="mb-4 flex items-start gap-2 rounded-xl border border-border/50
+       bg-surface-alt/60 px-3.5 py-3 text-xs leading-snug
+       hover:border-primary/30 transition-colors group/proof"
    >
      <Layers className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
      <span className="text-muted-foreground">
        Built this way:{" "}
        <span className="font-bold text-foreground/90 group-hover/proof:text-primary transition-colors">
          {proofOf(pkg.proofSlug)!.title}
        </span>
      </span>
    </Link>
+ ) : (
+   <div className="mb-4 h-16" />
+ )}
```

This reserves vertical space for the third card to align with the others.

---

## Issue 9 & 10: Mixed visual language in tech grid / Non-standard icons

**Root Cause:** `TechStack.tsx` uses emoji and text labels instead of consistent brand logos. Emoji are decorative; brand logos are recognizable.

**Fix:** Replace emoji with proper SVG icons in `src/components/TechStack.tsx`:

```diff
  const techs = [
-   { name: "React",      icon: "⚛️",  cat: "Frontend" },
+   { name: "React",      icon: "react", cat: "Frontend" },
-   { name: "Next.js",    icon: "▲",   cat: "Frontend" },
+   { name: "Next.js",    icon: "nextjs", cat: "Frontend" },
-   { name: "TypeScript", icon: "TS",  cat: "Language" },
+   { name: "TypeScript", icon: "typescript", cat: "Language" },
-   { name: "Node.js",    icon: "🟢",  cat: "Backend" },
+   { name: "Node.js",    icon: "nodejs", cat: "Backend" },
-   { name: "Express",    icon: "⚡",  cat: "Backend" },
+   { name: "Express",    icon: "express", cat: "Backend" },
-   { name: "MongoDB",    icon: "🍃",  cat: "Database" },
+   { name: "MongoDB",    icon: "mongodb", cat: "Database" },
-   { name: "PostgreSQL", icon: "🐘",  cat: "Database" },
+   { name: "PostgreSQL", icon: "postgresql", cat: "Database" },
-   { name: "Redis",      icon: "🔴",  cat: "Cache" },
+   { name: "Redis",      icon: "redis", cat: "Cache" },
-   { name: "Docker",     icon: "🐳",  cat: "DevOps" },
+   { name: "Docker",     icon: "docker", cat: "DevOps" },
-   { name: "AWS",        icon: "☁️",  cat: "Cloud" },
+   { name: "AWS",        icon: "aws", cat: "Cloud" },
-   { name: "GraphQL",    icon: "◈",   cat: "API" },
+   { name: "GraphQL",    icon: "graphql", cat: "API" },
-   { name: "Tailwind",   icon: "🎨",  cat: "Styling" },
+   { name: "Tailwind",   icon: "tailwind", cat: "Styling" },
  ];
```

Create an icon map. Add to `src/components/TechStack.tsx`:

```tsx
import { 
  ReactIcon, NextIcon, TypeScriptIcon, NodeIcon, ExpressIcon,
  MongoIcon, PostgresIcon, RedisIcon, DockerIcon, AWSIcon, GraphQLIcon, TailwindIcon
} from 'lucide-react'; // or use https://simpleicons.org/ SVG components

const iconMap: Record<string, React.ReactNode> = {
  react: <ReactIcon className="w-6 h-6" />,
  nextjs: <NextIcon className="w-6 h-6" />,
  typescript: <TypeScriptIcon className="w-6 h-6" />,
  nodejs: <NodeIcon className="w-6 h-6" />,
  express: <ExpressIcon className="w-6 h-6" />,
  mongodb: <MongoIcon className="w-6 h-6" />,
  postgresql: <PostgresIcon className="w-6 h-6" />,
  redis: <RedisIcon className="w-6 h-6" />,
  docker: <DockerIcon className="w-6 h-6" />,
  aws: <AWSIcon className="w-6 h-6" />,
  graphql: <GraphQLIcon className="w-6 h-6" />,
  tailwind: <TailwindIcon className="w-6 h-6" />,
};
```

Then update the render:

```diff
- <span className="text-2xl leading-none group-hover:scale-125 transition-transform duration-300">
-   {t.icon}
- </span>
+ <div className="w-8 h-8 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
+   {iconMap[t.icon as keyof typeof iconMap] || <span className="text-xl">{t.icon}</span>}
+ </div>
```

For a quicker solution without custom icons, use SimpleIcons CSS or download SVGs from https://simpleicons.org/.

---

## Issue 12: 'Technologies I Work With' low visual density

**Root Cause:** `TechStack.tsx` has small icons, wide spacing, and no card containers. It feels sparse compared to other sections.

**Fix:** Increase visual density in `src/components/TechStack.tsx`:

```diff
- <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 max-w-3xl mx-auto">
+ <div className="grid grid-cols-4 sm:grid-cols-6 gap-4 md:gap-5 max-w-5xl mx-auto">
    {techs.map((t, i) => (
      <div
        key={t.name}
-       className={`tilt-card group flex flex-col items-center gap-2 p-4 rounded-2xl
+       className={`tilt-card group flex flex-col items-center justify-center gap-3 p-5 rounded-2xl
-         border border-border/40 bg-card/80 cursor-default
+         border border-border/50 bg-gradient-to-br from-card/90 to-card/70 cursor-default
          hover:border-primary/40 hover:bg-primary/5 hover:shadow-card-hover`}
        style={{ transitionDelay: `${i * 30}ms` }}
      >
-       <span className="text-2xl leading-none group-hover:scale-125 transition-transform duration-300">
+       <div className="w-10 h-10 flex items-center justify-center group-hover:scale-125 transition-transform duration-300">
          {t.icon}
-       </span>
+       </div>
        <span className="font-bold text-sm md:text-base text-center group-hover:text-primary transition-colors leading-tight">
          {t.name}
        </span>
```

Also increase section padding:

```diff
  return (
-   <section className="py-20 relative overflow-hidden">
+   <section className="py-24 md:py-32 relative overflow-hidden">
```

---

## Issue 13: Excessive gap between project grid and 'Browse All Projects' button

**Root Cause:** `Projects.tsx` (line 271) has `mt-16` on the button container, which is larger than the `gap-8` between grid rows.

**Fix:** Reduce top margin in `src/components/Projects.tsx`:

```diff
  {!loading && !compactHeader && filtered.length > 0 && (
-   <div className={`text-center mt-16 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
+   <div className={`text-center mt-10 md:mt-12 transition-all duration-700 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
      <Link to="/projects">
```

---

## Summary of Changes

| Issue | File | Change | Impact |
|-------|------|--------|--------|
| 1 | `tailwind.config.ts` | Constrain type scale to 10 sizes | Consistency |
| 2 | `tailwind.config.ts` + components | Limit text color palette | Consistency |
| 3 | `src/components/ui/button.tsx` | Reduce to 4 button variants | Consistency |
| 4, 7 | `src/components/Pricing.tsx` | Add `h-full` + `mt-auto` for alignment | Alignment |
| 5 | `src/components/Hero.tsx` | Separate regions and socials into flex column | Grouping |
| 6, 11 | `src/components/Projects.tsx` | Add grid centering CSS for orphaned card | Alignment |
| 8 | `src/components/Pricing.tsx` | Add spacer div for third card | Consistency |
| 9, 10 | `src/components/TechStack.tsx` | Replace emoji with brand logos | Visual language |
| 12 | `src/components/TechStack.tsx` | Increase icon size, gap, padding | Visual density |
| 13 | `src/components/Projects.tsx` | Reduce `mt-16` to `mt-10` | Spacing |

---

## Testing Checklist

- [ ] Type scale: Audit components for non-standard sizes (search for `text-[`, `md:text-`)
- [ ] Colors: Check for inline opacity (`/40`, `/60`) and replace with palette
- [ ] Buttons: Verify all buttons use only 4 variants
- [ ] Pricing alignment: Visually verify buttons are horizontal on all 3 cards
- [ ] Socials: Check spacing between location text and icons
- [ ] Project grid: Verify 7th card is centered on final row
- [ ] Tech icons: Load page and verify all icons are brand logos
- [ ] Tech density: Confirm section has visual weight matching other sections
- [ ] Project button gap: Measure vertical space between grid and button
