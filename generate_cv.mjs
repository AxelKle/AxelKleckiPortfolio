/**
 * generate_cv.mjs — Axel Klecki CV v2
 * Redesigned: gradient header aligned with website (#6B4EFF → #C254F5),
 * ATS-optimised metadata, single A4 page, dates right-aligned.
 *
 * Run: node generate_cv.mjs
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import fontkit from "@pdf-lib/fontkit";
import { writeFileSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

// ─── Colours ──────────────────────────────────────────────────────────────────

const C = {
  purple:  rgb(107/255,  78/255, 255/255),   // #6B4EFF
  pink:    rgb(194/255,  84/255, 245/255),   // #C254F5
  white:   rgb(1, 1, 1),
  lavender:rgb(0.92, 0.90, 1.0),             // soft white-lavender for header text
  dark:    rgb( 20/255,  18/255,  26/255),   // #14121A
  mid:     rgb( 45/255,  43/255,  53/255),   // #2D2B35
  gray:    rgb(107/255, 114/255, 128/255),   // #6B7280
  lgray:   rgb(156/255, 163/255, 175/255),   // #9CA3AF
  rule:    rgb(229/255, 227/255, 223/255),   // #E5E3DF
  bg:      rgb(250/255, 250/255, 248/255),   // #FAFAF8
};

// ─── Layout ───────────────────────────────────────────────────────────────────

const PAGE_W  = 595.28;   // A4 pt
const PAGE_H  = 841.89;
const ML      = 40;
const MR      = 40;
const MT      = 30;
const MB      = 28;
const CW      = PAGE_W - ML - MR;  // 515.28 pt

const OUTPUT  =
  "C:\\Users\\axelk\\Documents\\Cursor\\Portfolio\\AxelKleckiPortfolio\\public\\axel-klecki-cv.pdf";

// ─── Grid overlay helper (simulates landing page grid) ────────────────────────

function drawGrid(page, x, y, width, height, cellSize = 22, lineColor = rgb(1,1,1), opacity = 0.10) {
  const opts = { thickness: 0.5, color: lineColor, opacity };
  // Vertical lines
  for (let cx = x; cx <= x + width; cx += cellSize) {
    page.drawLine({ start: { x: cx, y }, end: { x: cx, y: y + height }, ...opts });
  }
  // Horizontal lines
  for (let cy = y; cy <= y + height; cy += cellSize) {
    page.drawLine({ start: { x, y: cy }, end: { x: x + width, y: cy }, ...opts });
  }
}

// ─── Gradient helper ──────────────────────────────────────────────────────────

function drawGradientRect(page, x, y, width, height, from, to, steps = 90) {
  const sw = width / steps;
  for (let i = 0; i < steps; i++) {
    const t = i / (steps - 1);
    page.drawRectangle({
      x:      x + i * sw,
      y,
      width:  sw + 0.6,   // slight overlap to avoid hairlines
      height,
      color: rgb(
        from.red   + (to.red   - from.red)   * t,
        from.green + (to.green - from.green) * t,
        from.blue  + (to.blue  - from.blue)  * t,
      ),
    });
  }
}

// ─── Word-wrap ────────────────────────────────────────────────────────────────

function wrapLines(text, font, size, maxWidth) {
  const words = text.split(" ");
  const lines = [];
  let line = "";
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(test, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function buildCV() {
  const doc = await PDFDocument.create();
  doc.registerFontkit(fontkit);

  // ATS metadata
  doc.setTitle("Axel Klecki — CV");
  doc.setAuthor("Axel Klecki");
  doc.setSubject("Product Manager & Product Designer");
  doc.setKeywords([
    "Product Manager", "Product Designer", "UX Designer", "UI Designer",
    "Figma", "Fintech", "Web3", "DeFi", "Agile", "Product Strategy",
    "User Research", "Wireframing", "Prototyping", "Roadmapping",
    "Stakeholder Management", "React", "AI", "Cursor", "Claude",
    "End-to-End Product", "Discovery", "Delivery",
  ]);

  // Embed Bricolage Grotesque (same font as the website)
  const boldBytes = readFileSync(join(__dirname, "bricolage-700.ttf"));
  const regBytes  = readFileSync(join(__dirname, "bricolage-400.ttf"));
  const bold = await doc.embedFont(boldBytes);
  const reg  = await doc.embedFont(regBytes);

  const page = doc.addPage([PAGE_W, PAGE_H]);

  // Warm off-white background
  page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: C.bg });

  // ── Micro helpers ────────────────────────────────────────────────────────────

  function txt(str, x, y, { font = reg, size = 9, color = C.dark } = {}) {
    page.drawText(str, { x, y, font, size, color });
  }

  function paraAt(text, x, startY, {
    font = reg, size = 8.5, color = C.mid, lineH = 12.5,
    maxW = CW - (x - ML),
  } = {}) {
    const lines = wrapLines(text, font, size, maxW);
    let cy = startY;
    for (const l of lines) {
      page.drawText(l, { x, y: cy, font, size, color });
      cy -= lineH;
    }
    return startY - cy; // height consumed
  }

  // Section heading — returns y after heading+rule+gap
  function section(label, cy) {
    // Bar vertically centred with the 8pt label text:
    // 8pt Helvetica ascender ≈ 5.8pt → text occupies cy … cy+5.8, centre ≈ cy+2.9
    // Bar height 12pt centred at cy+2.9 → y_bottom = cy+2.9-6 = cy-3.1 ≈ cy-3
    page.drawRectangle({ x: ML - 8, y: cy - 3, width: 3, height: 12, color: C.purple });
    // Title text at same left edge as all body content
    txt(label.toUpperCase(), ML, cy, { font: bold, size: 8, color: C.dark });
    const ruleY = cy - 15;
    page.drawLine({
      start: { x: ML, y: ruleY }, end: { x: ML + CW, y: ruleY },
      thickness: 0.4, color: C.rule,
    });
    return ruleY - 12;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADER — full-width gradient band
  // ═══════════════════════════════════════════════════════════════════════════

  const HEADER_H = 88;

  // 1. Gradient base
  drawGradientRect(page, 0, PAGE_H - HEADER_H, PAGE_W, HEADER_H, C.purple, C.pink);

  // 2. Semi-transparent dark overlay so grid reads cleaner (opacity 0.18)
  page.drawRectangle({
    x: 0, y: PAGE_H - HEADER_H, width: PAGE_W, height: HEADER_H,
    color: rgb(0.06, 0.04, 0.12), opacity: 0.18,
  });

  // 3. Grid pattern — same vibe as landing page crosshatch
  drawGrid(page, 0, PAGE_H - HEADER_H, PAGE_W, HEADER_H, 22, rgb(1,1,1), 0.12);

  // Name — with top breathing room
  txt("Axel Klecki", ML, PAGE_H - 38, { font: bold, size: 22, color: C.white });

  // Headline — close below name
  txt("Product Manager & Product Designer", ML, PAGE_H - 59,
      { font: reg, size: 9.5, color: C.lavender });

  // Contact — stacked, right-aligned
  const c1 = "linkedin.com/in/axelklecki";
  const c2 = "axelklecki.site";
  const c1w = reg.widthOfTextAtSize(c1, 8.5);
  const c2w = reg.widthOfTextAtSize(c2, 8.5);
  const rightEdge = ML + CW;
  txt(c1, rightEdge - c1w, PAGE_H - 44, { font: reg, size: 8.5, color: C.lavender });
  txt(c2, rightEdge - c2w, PAGE_H - 59, { font: reg, size: 8.5, color: C.lavender });

  // ─── content cursor starts below header ────────────────────────────────────
  let y = PAGE_H - HEADER_H - 18;

  // ═══════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Summary", y);
  const sumH = paraAt(
    "I'm a Product Manager and Product Designer focused on building digital products that balance " +
    "user experience, business strategy, and technical feasibility. " +
    "My background combines product strategy and UX/UI design, allowing me to work end-to-end " +
    "from discovery and product definition to design execution and delivery. " +
    "I've worked across fintech, marketplaces, and emerging technologies, collaborating with " +
    "cross-functional teams to turn complex ideas into intuitive and scalable products. " +
    "Recently, I've been integrating AI-assisted development workflows into product building, " +
    "using tools such as Cursor and Claude AI to rapidly prototype features, explore technical " +
    "possibilities, and accelerate product iteration. " +
    "With a strong design foundation, I bring a user-first mindset into product decisions " +
    "while ensuring alignment with business goals and technical constraints.",
    ML, y,
    { font: reg, size: 8, color: C.mid, lineH: 12 }
  );
  y -= sumH + 16;

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIENCE
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Experience", y);

  const jobs = [
    {
      company: "WakeUp Labs",
      role:    "Product Manager & Design Strategist",
      meta:    "Oct 2024 – Present",
      bullets: [
        "Led product strategy and UX design end-to-end across multiple digital products, from discovery to delivery",
        "Translated complex systems (DeFi, RWA tokenization, Smart Accounts) into intuitive user experiences",
        "Collaborated with engineers, founders, and stakeholders to define roadmaps and ship scalable products",
        "Leveraged AI-assisted tooling (Cursor, Claude, Vercel) for rapid prototyping and product iteration",
      ],
    },
    {
      company: "Espinosa Consultores",
      role:    "UX/UI Designer",
      meta:    "Jan 2024 – Oct 2024",
      bullets: [
        "Designed corporate websites, e-commerce platforms, and landing pages using user-centered design principles",
        "Developed cohesive brand identities and UX solutions that improved user satisfaction and retention",
      ],
    },
    {
      company: "Kenion",
      role:    "UI Designer",
      meta:    "Jan 2021 – Sep 2023",
      bullets: [
        "Designed user experiences for websites, e-commerce, and landing pages; conducted user research",
        "Developed user archetypes, flows, and wireframes informed by benchmark and competitive analysis",
      ],
    },
    {
      company: "BAW Electric S.A.",
      role:    "Graphic Designer",
      meta:    "Dec 2020 – Dec 2021",
      bullets: [
        "Designed packaging, editorial materials, and brand identity assets enhancing product visibility",
      ],
    },
    {
      company: "Instituto Bet El",
      role:    "Graphic Designer",
      meta:    "Aug 2019 – Dec 2020",
      bullets: [
        "Developed comprehensive visual brand identity and marketing collateral for educational institution",
      ],
    },
  ];

  for (const job of jobs) {
    // Company (bold dark) + meta right-aligned on same line
    txt(job.company, ML, y, { font: bold, size: 9.5, color: C.dark });
    const mw = reg.widthOfTextAtSize(job.meta, 7.5);
    txt(job.meta, ML + CW - mw, y, { font: reg, size: 7.5, color: C.lgray });
    y -= 13;

    // Role
    txt(job.role, ML, y, { font: bold, size: 8.5, color: C.purple });
    y -= 12;

    // Bullets
    const bMaxW = CW - 12;
    for (const b of job.bullets) {
      const bLines = wrapLines(b, reg, 8, bMaxW);
      page.drawText("•", { x: ML + 1, y, font: bold, size: 8, color: C.purple });
      for (const bl of bLines) {
        page.drawText(bl, { x: ML + 11, y, font: reg, size: 8, color: C.mid });
        y -= 12.5;
      }
    }
    y -= 9;
  }

  y -= 6;

  // ═══════════════════════════════════════════════════════════════════════════
  // EDUCATION
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Education", y);

  const edu = [
    {
      inst:  "Universidad de Buenos Aires",
      deg:   "Industrial Designer — Industrial and Product Design",
      years: "2016 – 2021",
    },
    {
      inst:  "ORT Argentina",
      deg:   "Technical High School — Construction focus",
      years: "2011 – 2015",
    },
  ];

  for (const e of edu) {
    txt(e.inst, ML, y, { font: bold, size: 9, color: C.dark });
    const yw = reg.widthOfTextAtSize(e.years, 7.5);
    txt(e.years, ML + CW - yw, y, { font: reg, size: 7.5, color: C.lgray });
    y -= 12;
    txt(e.deg, ML, y, { font: reg, size: 8.5, color: C.gray });
    y -= 14;
  }

  y -= 5;

  // ═══════════════════════════════════════════════════════════════════════════
  // SKILLS — two columns
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Skills", y);

  const skills = [
    "Product Management",          "Figma",
    "UX/UI Design",                "Stakeholder Management",
    "Product Strategy",            "Roadmapping",
    "User Research",               "AI-Assisted Dev (Cursor, Claude)",
    "Wireframing & Prototyping",   "Vibecoding",
    "Web3 / DeFi / Fintech",       "User-Centered Design",
  ];

  const half    = Math.ceil(skills.length / 2);
  const col1    = skills.slice(0, half);
  const col2    = skills.slice(half);
  const skRowH  = 13.5;

  for (let i = 0; i < Math.max(col1.length, col2.length); i++) {
    if (col1[i]) {
      page.drawText("•", { x: ML, y, font: bold, size: 8.5, color: C.purple });
      page.drawText(col1[i], { x: ML + 10, y, font: reg, size: 8.5, color: C.dark });
    }
    if (col2[i]) {
      page.drawText("•", { x: ML + CW / 2 + 4, y, font: bold, size: 8.5, color: C.purple });
      page.drawText(col2[i], { x: ML + CW / 2 + 14, y, font: reg, size: 8.5, color: C.dark });
    }
    y -= skRowH;
  }

  y -= 12;

  // ═══════════════════════════════════════════════════════════════════════════
  // LANGUAGES & CERTIFICATIONS — combined row
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Languages & Certifications", y);

  // Languages (left + center)
  txt("Spanish", ML, y, { font: bold, size: 8.5, color: C.dark });
  txt("  Native", ML + bold.widthOfTextAtSize("Spanish", 8.5), y,
      { font: reg, size: 8.5, color: C.gray });

  const engX = ML + CW / 3;
  txt("English", engX, y, { font: bold, size: 8.5, color: C.dark });
  txt("  Full Professional", engX + bold.widthOfTextAtSize("English", 8.5), y,
      { font: reg, size: 8.5, color: C.gray });

  // Certification (right)
  const certText = "UX/UI Designer — Certified";
  const certW = reg.widthOfTextAtSize(certText, 8.5);
  txt(certText, ML + CW - certW, y, { font: reg, size: 8.5, color: C.gray });

  y -= 14;

  // ── Gradient footer bar ──────────────────────────────────────────────────
  drawGradientRect(page, ML, MB, CW, 2, C.purple, C.pink);

  // ─── Diagnostics ──────────────────────────────────────────────────────────
  const pages = doc.getPages().length;
  console.log(`y at end: ${y.toFixed(1)} pt  (bottom margin: ${MB} pt)`);
  console.log(`Pages: ${pages}`);
  if (y < MB) console.warn(`⚠️  Content overflows by ${(MB - y).toFixed(1)} pt`);

  // ─── Save ──────────────────────────────────────────────────────────────────
  const pdfBytes = await doc.save();
  writeFileSync(OUTPUT, pdfBytes);
  console.log(`CV saved → ${OUTPUT}  (${(pdfBytes.length / 1024).toFixed(1)} KB)`);
}

buildCV().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
