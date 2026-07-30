import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      screens: {
        /* Height-based, for elements that only make sense when there's
           vertical room to spare — e.g. the hero's scroll indicator, which
           collided with the CTA row on short laptop screens. */
        tall: { raw: "(min-height: 780px)" },
      },
      /**
       * Tailwind's default opacity scale is 0 plus multiples of 5. Any other
       * value in a colour modifier — `bg-primary/8`, `bg-white/12`,
       * `bg-background/92` — matches nothing and Tailwind silently emits NO
       * rule, so the colour is simply absent rather than faint.
       *
       * 46 such classes were in use: every aurora blur orb, the frosted glass
       * buttons and icon chips, several borders, and the sticky nav's
       * background were all fully transparent in production. Declaring the
       * values actually used makes the existing markup render as written.
       */
      opacity: {
        2: "0.02", 3: "0.03", 4: "0.04", 6: "0.06", 8: "0.08", 9: "0.09",
        12: "0.12", 14: "0.14", 16: "0.16", 18: "0.18", 22: "0.22",
        26: "0.26", 28: "0.28", 92: "0.92", 96: "0.96",
      },
      spacing: {
        /* Tailwind's default scale skips 13, so the `h-13` used on the hero
           and services CTAs generated no CSS at all — those buttons collapsed
           to their 24px content height instead of 52px, well under the 44px
           minimum touch target. Defining it makes the existing markup work. */
        13: "3.25rem",
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        /* Alternating section band + the always-dark hero/CTA tone.
           `bg-section-alt` was used in two components but never defined here,
           so it compiled to nothing and those sections rendered transparent. */
        "surface-alt": "hsl(var(--surface-alt))",
        "surface-deep": "hsl(var(--surface-deep))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          glow: "hsl(var(--primary-glow))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
          blue: "hsl(var(--accent-blue))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      backgroundImage: {
        'gradient-hero': 'var(--gradient-hero)',
        'gradient-card': 'var(--gradient-card)',
      },
      boxShadow: {
        'glow': 'var(--shadow-glow)',
        'glow-sm': '0 0 15px hsl(var(--primary) / 0.2)',
        'glow-lg': '0 0 50px hsl(var(--primary) / 0.35)',
        'card': '0 1px 3px hsl(0 0% 0% / 0.08), 0 4px 16px hsl(0 0% 0% / 0.06)',
        'card-hover': '0 4px 20px hsl(0 0% 0% / 0.12), 0 8px 32px hsl(var(--primary) / 0.12)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "calc(var(--radius) + 4px)",
        "2xl": "calc(var(--radius) + 8px)",
        "3xl": "calc(var(--radius) + 14px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(16px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in-up": {
          from: { opacity: "0", transform: "translateY(28px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        "slide-in": {
          from: { transform: "translateX(-100%)" },
          to: { transform: "translateX(0)" },
        },
        "scale-in": {
          from: { opacity: "0", transform: "scale(0.92)" },
          to: { opacity: "1", transform: "scale(1)" },
        },
        "glow-pulse": {
          "0%, 100%": { boxShadow: "0 0 20px hsl(var(--primary) / 0.25)" },
          "50%": { boxShadow: "0 0 45px hsl(var(--primary) / 0.5)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-18px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to: { transform: "rotate(360deg)" },
        },
        "blob": {
          "0%, 100%": { borderRadius: "60% 40% 30% 70% / 60% 30% 70% 40%" },
          "50%": { borderRadius: "30% 60% 70% 40% / 50% 60% 30% 60%" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.55s ease-out both",
        "fade-in-up": "fade-in-up 0.7s ease-out both",
        "scale-in": "scale-in 0.5s ease-out both",
        "slide-in": "slide-in 0.5s ease-out",
        "glow-pulse": "glow-pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "shimmer": "shimmer 3s ease-in-out infinite",
        "spin-slow": "spin-slow 12s linear infinite",
        "blob": "blob 8s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
