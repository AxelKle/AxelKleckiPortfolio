/**
 * generate_cv.mjs
 * Generates Axel Klecki's CV PDF using pdf-lib.
 * Design: clean, modern, ATS-friendly, #6B4EFF purple accent, warm white BG.
 *
 * Run:  node generate_cv.mjs
 */

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { writeFileSync, mkdirSync } from "fs";
import { dirname } from "path";

// ─── Colours ──────────────────────────────────────────────────────────────────

function hex(h) {
  return rgb(
    parseInt(h.slice(1, 3), 16) / 255,
    parseInt(h.slice(3, 5), 16) / 255,
    parseInt(h.slice(5, 7), 16) / 255
  );
}

const C = {
  purple:  hex("#6B4EFF"),
  dark:    hex("#14121A"),
  mid:     hex("#2D2B35"),
  gray:    hex("#6B7280"),
  lgray:   hex("#9CA3AF"),
  rule:    hex("#E5E3DF"),
  bg:      hex("#FAFAF8"),
  headerBg:hex("#F4F1FF"),  // very light purple tint for header area
};

// ─── Layout ───────────────────────────────────────────────────────────────────

const PAGE_W  = 595.28;   // A4 pt
const PAGE_H  = 841.89;
const ML      = 42;       // ~1.48 cm left margin
const MR      = 42;
const MT      = 36;       // top margin
const MB      = 36;
const CW      = PAGE_W - ML - MR;  // content width

// ─── Output ───────────────────────────────────────────────────────────────────

const OUTPUT =
  "C:\\Users\\axelk\\Documents\\Cursor\\Portfolio\\AxelKleckiPortfolio\\public\\axel-klecki-cv.pdf";

// ─── Word-wrap helpers ────────────────────────────────────────────────────────

/**
 * Split text into lines that fit within maxWidth at given font/size.
 */
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

/**
 * Measure total height of wrapped text block.
 */
function measureH(text, font, size, maxWidth, lineH) {
  return wrapLines(text, font, size, maxWidth).length * lineH;
}

// ─── Page manager ─────────────────────────────────────────────────────────────

class PageManager {
  constructor(doc) {
    this.doc = doc;
    this.page = null;
    this.y = 0;
    this._addPage();
  }

  _addPage() {
    this.page = this.doc.addPage([PAGE_W, PAGE_H]);
    // warm white background
    this.page.drawRectangle({ x: 0, y: 0, width: PAGE_W, height: PAGE_H, color: C.bg });
    this.y = PAGE_H - MT;
  }

  /** Ensure `needed` pts are available; break page if not. */
  ensure(needed) {
    if (this.y - needed < MB) this._addPage();
  }

  /** Move cursor down by `pts`. */
  down(pts) { this.y -= pts; }

  /** Draw a line of text. Returns x-advance for chaining. */
  text(str, x, { font, size, color = C.dark } = {}) {
    this.page.drawText(str, { x, y: this.y, font, size, color });
    return font.widthOfTextAtSize(str, size);
  }

  /** Draw wrapped paragraph; cursor moves down. Returns height used. */
  para(text, x, { font, size, color = C.dark, lineH, maxW = CW - (x - ML) } = {}) {
    const lh = lineH || size * 1.45;
    const lines = wrapLines(text, font, size, maxW);
    const totalH = lines.length * lh;
    this.ensure(totalH);
    for (const l of lines) {
      this.page.drawText(l, { x, y: this.y, font, size, color });
      this.y -= lh;
    }
    return totalH;
  }

  /** Draw a horizontal rule. */
  rule(x = ML, w = CW, thickness = 0.5, color = C.rule) {
    this.page.drawLine({
      start: { x, y: this.y },
      end:   { x: x + w, y: this.y },
      thickness,
      color,
    });
  }

  /** Draw a filled rectangle relative to current y (top of rect = this.y). */
  rect(x, dy, w, h, color) {
    this.page.drawRectangle({ x, y: this.y - dy - h, width: w, height: h, color });
  }

  /** Draw a line from (x1,y) to (x2,y) at a fixed absolute y. */
  hline(x1, x2, absY, thickness, color) {
    this.page.drawLine({
      start: { x: x1, y: absY },
      end:   { x: x2, y: absY },
      thickness,
      color,
    });
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function buildCV() {
  const doc = await PDFDocument.create();
  doc.setTitle("Axel Klecki — CV");
  doc.setAuthor("Axel Klecki");
  doc.setSubject("Curriculum Vitae");
  doc.setKeywords(["Product Manager", "Product Designer", "UX/UI", "Fintech"]);

  const bold   = await doc.embedFont(StandardFonts.HelveticaBold);
  const reg    = await doc.embedFont(StandardFonts.Helvetica);

  const pm = new PageManager(doc);

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADER — light purple-tinted band
  // ═══════════════════════════════════════════════════════════════════════════

  const headerH = 108;
  pm.page.drawRectangle({
    x: 0, y: PAGE_H - headerH,
    width: PAGE_W, height: headerH,
    color: C.headerBg,
  });
  // Left accent bar inside header
  pm.page.drawRectangle({
    x: 0, y: PAGE_H - headerH,
    width: 5, height: headerH,
    color: C.purple,
  });

  pm.y = PAGE_H - MT;

  // Name
  pm.text("Axel Klecki", ML, { font: bold, size: 26, color: C.dark });
  pm.down(30);

  // Headline — wrap within content width
  pm.para(
    "Product Manager & Product Designer  |  Building user-centric digital products from strategy to execution  |  Fintech, Marketplaces & Emerging Technologies",
    ML,
    { font: reg, size: 9.5, color: C.gray, lineH: 14, maxW: CW }
  );
  pm.down(4);

  // Contact row (three items)
  const contact = [
    "Spain",
    "linkedin.com/in/axelklecki",
    "axelklecki.com",
  ];
  const colW = CW / 3;
  // item 1: left
  pm.text(contact[0], ML, { font: reg, size: 8.5, color: C.lgray });
  // item 2: center
  const c2w = reg.widthOfTextAtSize(contact[1], 8.5);
  pm.text(contact[1], ML + colW + (colW - c2w) / 2, { font: reg, size: 8.5, color: C.lgray });
  // item 3: right-aligned
  const c3w = reg.widthOfTextAtSize(contact[2], 8.5);
  pm.text(contact[2], ML + CW - c3w, { font: reg, size: 8.5, color: C.lgray });

  // Move cursor below header band
  pm.y = PAGE_H - headerH - 14;

  // ═══════════════════════════════════════════════════════════════════════════
  // Section heading helper
  // ═══════════════════════════════════════════════════════════════════════════

  function section(label) {
    pm.ensure(26);
    // accent bar
    pm.page.drawRectangle({ x: ML, y: pm.y - 13, width: 3, height: 14, color: C.purple });
    pm.text(label.toUpperCase(), ML + 9, { font: bold, size: 8.5, color: C.dark });
    pm.down(16);
    pm.rule(ML, CW, 0.5, C.rule);
    pm.down(8);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // SUMMARY
  // ═══════════════════════════════════════════════════════════════════════════

  section("Summary");

  pm.para(
    "Product Manager and Product Designer focused on building digital products that balance " +
    "user experience, business strategy, and technical feasibility. Background combines " +
    "product strategy and UX/UI design, working end-to-end from discovery and definition " +
    "to design execution and delivery. Worked across fintech, marketplaces, and emerging " +
    "technologies, collaborating with cross-functional teams to turn complex ideas into " +
    "intuitive and scalable products. Recently integrating AI-assisted development workflows " +
    "using Cursor and Claude AI to rapidly prototype features and accelerate product iteration.",
    ML,
    { font: reg, size: 9, color: C.mid, lineH: 13.5 }
  );
  pm.down(13);

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIENCE
  // ═══════════════════════════════════════════════════════════════════════════

  section("Experience");

  const experiences = [
    {
      company: "WakeUp Labs",
      role: "Product Manager & Design Strategist",
      meta: "October 2024 – Present  |  Remote",
      bullets: [
        "Led product strategy and UX design across multiple digital products, end-to-end from discovery and definition to execution and delivery",
        "Collaborated with engineers, founders, and stakeholders to define roadmaps, validate ideas, and ship scalable products",
        "Translated complex technical systems (DeFi, RWA tokenization, Smart Accounts) into intuitive user experiences",
        "Designed product flows, interfaces, and interaction patterns that improve usability, clarity, and engagement",
        "Used AI-assisted development tools (Cursor, Claude, Vercel, GitHub, Gemini) for prototyping and rapid iteration",
      ],
    },
    {
      company: "Espinosa Consultores",
      role: "UX/UI Designer",
      meta: "January 2024 – October 2024  |  Valencia, Spain",
      bullets: [
        "Designed corporate websites, e-commerce platforms, and landing pages using user-centered design principles",
        "Crafted intuitive UX/UI designs that improved user satisfaction and retention",
        "Developed cohesive brand identities through logo and packaging design",
      ],
    },
    {
      company: "Kenion",
      role: "UI Designer",
      meta: "January 2021 – September 2023",
      bullets: [
        "Designed user experiences and interfaces for websites, e-commerce platforms, and landing pages",
        "Conducted user research and developed user archetypes, flows, and wireframes",
        "Analyzed benchmark data to inform design strategies",
      ],
    },
    {
      company: "BAW Electric S.A.",
      role: "Graphic Designer",
      meta: "December 2020 – December 2021  |  Buenos Aires",
      bullets: [
        "Developed packaging designs enhancing product visibility and brand identity",
        "Designed editorial materials including manuals, brochures, and business stationery",
      ],
    },
    {
      company: "Instituto Bet El",
      role: "Graphic Designer",
      meta: "August 2019 – December 2020",
      bullets: [
        "Developed comprehensive visual brand identity",
        "Designed marketing collateral and social media content",
      ],
    },
  ];

  for (const exp of experiences) {
    pm.ensure(50);

    // Company name (bold, dark)
    pm.text(exp.company, ML, { font: bold, size: 10, color: C.dark });
    pm.down(13);

    // Role (bold, purple)
    pm.text(exp.role, ML, { font: bold, size: 9, color: C.purple });
    pm.down(12);

    // Meta (dates | location, light gray)
    pm.text(exp.meta, ML, { font: reg, size: 8, color: C.lgray });
    pm.down(13);

    // Bullets
    for (const b of exp.bullets) {
      const indent = 14;
      const bMaxW = CW - indent;
      const bLines = wrapLines(b, reg, 8.5, bMaxW);
      const bH = bLines.length * 12.5;
      pm.ensure(bH + 2);
      // bullet dot
      pm.page.drawText("•", { x: ML + 2, y: pm.y, font: bold, size: 8.5, color: C.purple });
      for (const bl of bLines) {
        pm.page.drawText(bl, { x: ML + indent, y: pm.y, font: reg, size: 8.5, color: C.mid });
        pm.down(12.5);
      }
      pm.down(1);
    }
    pm.down(7);
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // EDUCATION
  // ═══════════════════════════════════════════════════════════════════════════

  section("Education");

  const education = [
    {
      institution: "Universidad de Buenos Aires",
      degree: "Industrial Designer — Industrial and Product Design",
      years: "2016 – 2021",
    },
    {
      institution: "ORT Argentina",
      degree: "Technical High School — Construction focus",
      years: "2011 – 2015",
    },
  ];

  for (const edu of education) {
    pm.ensure(38);
    pm.text(edu.institution, ML, { font: bold, size: 9.5, color: C.dark });
    pm.down(13);
    pm.text(edu.degree, ML, { font: reg, size: 9, color: C.gray });
    pm.down(11);
    pm.text(edu.years, ML, { font: reg, size: 8, color: C.lgray });
    pm.down(14);
  }
  pm.down(4);

  // ═══════════════════════════════════════════════════════════════════════════
  // SKILLS — two-column
  // ═══════════════════════════════════════════════════════════════════════════

  section("Skills");

  const skills = [
    "Product Management",
    "UX/UI Design",
    "Product Strategy",
    "User Research",
    "Wireframing & Prototyping",
    "Figma",
    "Stakeholder Management",
    "Roadmapping",
    "AI-Assisted Development (Cursor, Claude)",
    "React.js",
    "Web3 / DeFi / Fintech",
    "User-Centered Design",
  ];

  const half = Math.ceil(skills.length / 2);
  const col1 = skills.slice(0, half);
  const col2 = skills.slice(half);
  const rowH = 14;
  const rows = Math.max(col1.length, col2.length);
  pm.ensure(rows * rowH + 4);

  for (let i = 0; i < rows; i++) {
    if (col1[i]) {
      pm.page.drawText("-", { x: ML, y: pm.y, font: bold, size: 9, color: C.purple });
      pm.page.drawText(col1[i], { x: ML + 10, y: pm.y, font: reg, size: 9, color: C.dark });
    }
    if (col2[i]) {
      pm.page.drawText("-", { x: ML + CW / 2 + 4, y: pm.y, font: bold, size: 9, color: C.purple });
      pm.page.drawText(col2[i], { x: ML + CW / 2 + 14, y: pm.y, font: reg, size: 9, color: C.dark });
    }
    pm.down(rowH);
  }
  pm.down(10);

  // ═══════════════════════════════════════════════════════════════════════════
  // LANGUAGES
  // ═══════════════════════════════════════════════════════════════════════════

  section("Languages");

  pm.ensure(18);
  pm.text("Spanish", ML, { font: bold, size: 9, color: C.dark });
  const swW = bold.widthOfTextAtSize("Spanish", 9);
  pm.text("  Native", ML + swW, { font: reg, size: 9, color: C.gray });

  const langSep = CW / 2;
  pm.text("English", ML + langSep, { font: bold, size: 9, color: C.dark });
  const ewW = bold.widthOfTextAtSize("English", 9);
  pm.text("  Full Professional", ML + langSep + ewW, { font: reg, size: 9, color: C.gray });
  pm.down(18);
  pm.down(6);

  // ═══════════════════════════════════════════════════════════════════════════
  // CERTIFICATIONS
  // ═══════════════════════════════════════════════════════════════════════════

  section("Certifications");

  pm.ensure(16);
  pm.text("UX/UI Designer", ML, { font: reg, size: 9, color: C.dark });
  pm.down(16);
  pm.down(6);

  // ═══════════════════════════════════════════════════════════════════════════
  // AWARDS
  // ═══════════════════════════════════════════════════════════════════════════

  section("Awards");

  pm.para(
    "Exhibition of LUNA spacesuit design at Galileo Galilei Planetarium, Buenos Aires",
    ML,
    { font: reg, size: 9, color: C.dark, lineH: 13.5 }
  );

  // ─── Save ──────────────────────────────────────────────────────────────────

  mkdirSync(dirname(OUTPUT.replace(/\\\\/g, "\\")), { recursive: true });
  const pdfBytes = await doc.save();
  writeFileSync(OUTPUT, pdfBytes);
  const pages = doc.getPages().length;
  console.log(`CV saved: ${OUTPUT}`);
  console.log(`Pages: ${pages}  |  Size: ${(pdfBytes.length / 1024).toFixed(1)} KB`);
}

buildCV().catch((err) => {
  console.error("Error:", err.message);
  process.exit(1);
});
