/**
 * generate_cv.mjs — Axel Klecki CV v2
 * Redesigned: gradient header aligned with website (#6B4EFF → #C254F5),
 * ATS-optimised metadata, single A4 page, dates right-aligned.
 *
 * Run: node generate_cv.mjs
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { writeFileSync } from "fs";

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

  const bold = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg  = await doc.embedFont(StandardFonts.Helvetica);

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
    page.drawRectangle({ x: ML, y: cy - 12, width: 3, height: 14, color: C.purple });
    txt(label.toUpperCase(), ML + 9, cy, { font: bold, size: 8, color: C.dark });
    const ruleY = cy - 15;
    page.drawLine({
      start: { x: ML, y: ruleY }, end: { x: ML + CW, y: ruleY },
      thickness: 0.4, color: C.rule,
    });
    return ruleY - 9;   // +2pt gap after rule
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADER — full-width gradient band
  // ═══════════════════════════════════════════════════════════════════════════

  const HEADER_H = 82;
  drawGradientRect(page, 0, PAGE_H - HEADER_H, PAGE_W, HEADER_H, C.purple, C.pink);

  // Name
  txt("Axel Klecki", ML, PAGE_H - 22, { font: bold, size: 22, color: C.white });

  // Headline — one concise line, ATS-rich
  const headline =
    "Product Manager & Product Designer  |  Fintech  ·  Web3  ·  AI  |  Strategy to Shipped Product";
  const hlLines = wrapLines(headline, reg, 9, CW);
  let hly = PAGE_H - 47;
  for (const l of hlLines) {
    txt(l, ML, hly, { font: reg, size: 9, color: C.lavender });
    hly -= 13;
  }

  // Contact row — pinned to bottom of header band
  const contactY = PAGE_H - HEADER_H + 13;
  const contacts = [
    "linkedin.com/in/axelklecki",
    "axelklecki.site",
  ];
  const sep = "  |  ";
  const fullContact = contacts[0] + sep + contacts[1];
  const fcW = reg.widthOfTextAtSize(fullContact, 8);
  txt(fullContact, (PAGE_W - fcW) / 2, contactY, { font: reg, size: 8, color: C.lavender });

  // ─── content cursor starts below header ────────────────────────────────────
  let y = PAGE_H - HEADER_H - 20;

  // ═══════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Summary", y);
  const sumH = paraAt(
    "Product Manager and Product Designer building digital products across fintech, marketplaces, and Web3. " +
    "Combines product strategy with end-to-end UX/UI design — from discovery and definition to execution and delivery. " +
    "Experienced working with engineers, founders, and stakeholders to ship scalable, user-centered products. " +
    "Integrating AI-assisted workflows (Cursor, Claude) for rapid prototyping and product iteration.",
    ML, y,
    { font: reg, size: 8.5, color: C.mid, lineH: 14 }
  );
  y -= sumH + 20;

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIENCE
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Experience", y);

  const jobs = [
    {
      company: "WakeUp Labs",
      role:    "Product Manager & Design Strategist",
      meta:    "Oct 2024 – Present  ·  Remote",
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
      meta:    "Jan 2024 – Oct 2024  ·  Valencia, Spain",
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
      meta:    "Dec 2020 – Dec 2021  ·  Buenos Aires",
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
    y -= 10;
  }

  y -= 8;

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
    y -= 13;
    txt(e.deg, ML, y, { font: reg, size: 8.5, color: C.gray });
    y -= 16;
  }

  y -= 8;

  // ═══════════════════════════════════════════════════════════════════════════
  // SKILLS — two columns
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Skills", y);

  const skills = [
    "Product Management",          "Figma",
    "UX/UI Design",                "Stakeholder Management",
    "Product Strategy",            "Roadmapping",
    "User Research",               "AI-Assisted Dev (Cursor, Claude)",
    "Wireframing & Prototyping",   "React.js",
    "Web3 / DeFi / Fintech",       "User-Centered Design",
  ];

  const half    = Math.ceil(skills.length / 2);
  const col1    = skills.slice(0, half);
  const col2    = skills.slice(half);
  const skRowH  = 14;

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
