/**
 * Generates public/og-image.png (1200×630) and public/logo-512.png.
 *
 * Run manually — `npm run og` — and commit the output. Deliberately NOT part
 * of `npm run build`: SVG text rasterisation depends on system fonts, and a
 * Linux CI host without them would silently ship a card with missing text.
 *
 * og-image.png is what LinkedIn, WhatsApp, Slack and X show when someone
 * shares a link. It was referenced in index.html but never existed, so every
 * share rendered a blank grey box.
 *
 * logo-512.png backs the Organization.logo node in the schema graph. Google
 * does not accept SVG for logo rich results, which is why favicon.svg cannot
 * serve that role.
 */
import { writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, "..", "public");

const FONT = "Segoe UI, Inter, Helvetica Neue, Arial, sans-serif";

const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#0b1020"/>
      <stop offset="55%" stop-color="#0d1226"/>
      <stop offset="100%" stop-color="#090e1c"/>
    </linearGradient>
    <radialGradient id="glowA" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#2563eb" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#2563eb" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowB" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#8b5cf6" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#8b5cf6" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="glowC" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#06b6d4" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#06b6d4" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="headline" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="60%" stop-color="#c7d8ff"/>
      <stop offset="100%" stop-color="#c4b5fd"/>
    </linearGradient>
    <linearGradient id="mark" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>
  <ellipse cx="150" cy="90" rx="460" ry="400" fill="url(#glowA)"/>
  <ellipse cx="1120" cy="300" rx="420" ry="360" fill="url(#glowB)"/>
  <ellipse cx="420" cy="640" rx="420" ry="300" fill="url(#glowC)"/>

  <!-- Brand mark -->
  <rect x="72" y="66" width="60" height="60" rx="17" fill="url(#mark)"/>
  <path d="M 93 86 L 85 96 L 93 106 M 111 86 L 119 96 L 111 106"
        stroke="#ffffff" stroke-width="4.5" stroke-linecap="round"
        stroke-linejoin="round" fill="none"/>
  <text x="150" y="107" font-family="${FONT}" font-size="30" font-weight="700" fill="#ffffff">
    WebDev<tspan fill="#60a5fa">Studio</tspan>
  </text>

  <!-- Availability pill -->
  <rect x="72" y="176" width="332" height="46" rx="23" fill="#ffffff" fill-opacity="0.09"
        stroke="#ffffff" stroke-opacity="0.18" stroke-width="1"/>
  <circle cx="98" cy="199" r="6" fill="#34d399"/>
  <text x="116" y="206" font-family="${FONT}" font-size="18" font-weight="600" fill="#e2e8f0">
    Available for new projects
  </text>

  <!-- Headline -->
  <text x="72" y="306" font-family="${FONT}" font-size="66" font-weight="800"
        fill="url(#headline)" letter-spacing="-1.5">React &amp; MERN Development</text>
  <text x="72" y="384" font-family="${FONT}" font-size="66" font-weight="800"
        fill="#ffffff" fill-opacity="0.62" letter-spacing="-1.5">for Growing Businesses</text>

  <!-- Subline -->
  <text x="72" y="446" font-family="${FONT}" font-size="25" font-weight="500" fill="#94a3b8">
    Fast, accessible web applications — built and shipped end to end.
  </text>

  <!-- Divider -->
  <rect x="72" y="496" width="1056" height="1" fill="#ffffff" fill-opacity="0.12"/>

  <!-- Proof stats. One <text> with dx offsets so each label is positioned
       relative to the measured width of the number before it — absolute x
       values collided whenever the font rendered wider than estimated. -->
  <text x="72" y="556" font-family="${FONT}" font-size="34" font-weight="800" fill="#ffffff">
    <tspan>5+</tspan><tspan dx="12" font-size="19" font-weight="500" fill="#7d8ba3">years</tspan>
    <tspan dx="40" font-size="34" font-weight="800" fill="#ffffff">50+</tspan><tspan dx="12" font-size="19" font-weight="500" fill="#7d8ba3">projects</tspan>
    <tspan dx="40" font-size="34" font-weight="800" fill="#ffffff">30+</tspan><tspan dx="12" font-size="19" font-weight="500" fill="#7d8ba3">clients</tspan>
  </text>

  <text x="1128" y="556" text-anchor="end" font-family="${FONT}" font-size="19"
        font-weight="600" fill="#60a5fa">webdevstudio.me</text>
</svg>`;

const logoSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">
  <defs>
    <linearGradient id="lg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#3b82f6"/>
      <stop offset="100%" stop-color="#8b5cf6"/>
    </linearGradient>
  </defs>
  <rect width="512" height="512" rx="112" fill="url(#lg)"/>
  <path d="M 196 186 L 138 256 L 196 326 M 316 186 L 374 256 L 316 326"
        stroke="#ffffff" stroke-width="34" stroke-linecap="round"
        stroke-linejoin="round" fill="none"/>
</svg>`;

async function main() {
  const og = await sharp(Buffer.from(ogSvg)).png({ quality: 92 }).toBuffer();
  await writeFile(join(publicDir, "og-image.png"), og);
  console.log(`  ✓ public/og-image.png (${(og.length / 1024).toFixed(0)} KB)`);

  const logo = await sharp(Buffer.from(logoSvg)).png().toBuffer();
  await writeFile(join(publicDir, "logo-512.png"), logo);
  console.log(`  ✓ public/logo-512.png (${(logo.length / 1024).toFixed(0)} KB)`);
}

main().catch((err) => {
  console.error("og image generation failed:", err);
  process.exit(1);
});
