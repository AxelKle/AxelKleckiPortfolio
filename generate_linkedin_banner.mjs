// LinkedIn banner generator — 1584x396px
// Matches the landing page background: warm base + purple/violet/pink orbs + grid overlay

import sharp from 'sharp';
import { resolve } from 'path';

const W = 1200;
const H = 1200;

// Draw everything as SVG (sharp renders SVG natively)
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">
  <defs>
    <!-- Base background color -->
    <rect id="bg" width="${W}" height="${H}" fill="#F7F5F2"/>

    <!-- Orb 1: purple, top-left -->
    <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(107,78,255,0.72)"/>
      <stop offset="60%" stop-color="rgba(107,78,255,0.18)"/>
      <stop offset="100%" stop-color="rgba(107,78,255,0)"/>
    </radialGradient>

    <!-- Orb 2: violet, top-right -->
    <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(194,84,245,0.65)"/>
      <stop offset="60%" stop-color="rgba(194,84,245,0.14)"/>
      <stop offset="100%" stop-color="rgba(194,84,245,0)"/>
    </radialGradient>

    <!-- Orb 3: pink/red, bottom-center -->
    <radialGradient id="orb3" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="rgba(255,107,107,0.55)"/>
      <stop offset="60%" stop-color="rgba(255,107,107,0.12)"/>
      <stop offset="100%" stop-color="rgba(255,107,107,0)"/>
    </radialGradient>

    <!-- Gaussian blur filter for orb soft glow -->
    <filter id="blur1" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="40"/>
    </filter>
    <filter id="blur2" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="38"/>
    </filter>
    <filter id="blur3" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="45"/>
    </filter>
  </defs>

  <!-- Base -->
  <rect width="${W}" height="${H}" fill="#F7F5F2"/>

  <!-- Orb 1: purple, top-left -->
  <ellipse cx="200" cy="150" rx="560" ry="560" fill="url(#orb1)" filter="url(#blur1)"/>

  <!-- Orb 2: violet, top-right -->
  <ellipse cx="${W - 180}" cy="100" rx="500" ry="500" fill="url(#orb2)" filter="url(#blur2)"/>

  <!-- Orb 3: pink, bottom-center -->
  <ellipse cx="${W / 2}" cy="${H - 100}" rx="480" ry="480" fill="url(#orb3)" filter="url(#blur3)"/>

  <!-- Grid overlay: horizontal lines every 40px -->
  ${Array.from({ length: Math.ceil(H / 40) + 1 }, (_, i) =>
    `<line x1="0" y1="${i * 40}" x2="${W}" y2="${i * 40}" stroke="rgba(107,78,255,0.12)" stroke-width="1"/>`
  ).join('\n  ')}

  <!-- Grid overlay: vertical lines every 40px -->
  ${Array.from({ length: Math.ceil(W / 40) + 1 }, (_, i) =>
    `<line x1="${i * 40}" y1="0" x2="${i * 40}" y2="${H}" stroke="rgba(107,78,255,0.12)" stroke-width="1"/>`
  ).join('\n  ')}
</svg>`;

const outPath = resolve('public/axel-klecki-linkedin-square.png');

await sharp(Buffer.from(svg))
  .png()
  .toFile(outPath);

console.log(`Imagen generada: ${outPath}`);
console.log(`Dimensiones: ${W}x${H}px`);
