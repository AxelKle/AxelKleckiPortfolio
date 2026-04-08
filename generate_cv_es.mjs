/**
 * generate_cv_es.mjs — Axel Klecki CV v2 (Español)
 * Versión en castellano del CV. Mismo diseño que la versión en inglés.
 *
 * Run: node generate_cv_es.mjs
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
  "C:\\Users\\axelk\\Documents\\Cursor\\Portfolio\\AxelKleckiPortfolio\\public\\axel-klecki-cv-es.pdf";

// ─── Grid overlay helper ───────────────────────────────────────────────────────

function drawGrid(page, x, y, width, height, cellSize = 22, lineColor = rgb(1,1,1), opacity = 0.10) {
  const opts = { thickness: 0.5, color: lineColor, opacity };
  for (let cx = x; cx <= x + width; cx += cellSize) {
    page.drawLine({ start: { x: cx, y }, end: { x: cx, y: y + height }, ...opts });
  }
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
      width:  sw + 0.6,
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
  doc.setSubject("Product Manager y Diseñador de Producto");
  doc.setKeywords([
    "Product Manager", "Diseñador de Producto", "UX Designer", "UI Designer",
    "Figma", "Fintech", "Web3", "DeFi", "Agile", "Estrategia de Producto",
    "Investigación de Usuarios", "Wireframing", "Prototipado", "Roadmapping",
    "Gestión de Stakeholders", "React", "IA", "Cursor", "Claude",
    "Producto End-to-End", "Discovery", "Delivery",
  ]);

  // Embed Bricolage Grotesque
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
    return startY - cy;
  }

  function section(label, cy) {
    page.drawRectangle({ x: ML - 8, y: cy - 3, width: 3, height: 12, color: C.purple });
    txt(label.toUpperCase(), ML, cy, { font: bold, size: 8, color: C.dark });
    const ruleY = cy - 15;
    page.drawLine({
      start: { x: ML, y: ruleY }, end: { x: ML + CW, y: ruleY },
      thickness: 0.4, color: C.rule,
    });
    return ruleY - 13;
  }

  // ═══════════════════════════════════════════════════════════════════════════
  // HEADER
  // ═══════════════════════════════════════════════════════════════════════════

  const HEADER_H = 88;

  drawGradientRect(page, 0, PAGE_H - HEADER_H, PAGE_W, HEADER_H,
    rgb(130/255, 100/255, 255/255),
    rgb(210/255, 110/255, 250/255),
  );

  drawGrid(page, 0, PAGE_H - HEADER_H, PAGE_W, HEADER_H, 22, rgb(1,1,1), 0.12);

  txt("Axel Klecki", ML, PAGE_H - 38, { font: bold, size: 22, color: C.white });
  txt("Product Manager y Diseñador de Producto", ML, PAGE_H - 59,
      { font: reg, size: 9.5, color: C.lavender });

  const c1 = "linkedin.com/in/axelklecki";
  const c2 = "axelklecki.site";
  const c1w = reg.widthOfTextAtSize(c1, 8.5);
  const c2w = reg.widthOfTextAtSize(c2, 8.5);
  const rightEdge = ML + CW;
  txt(c1, rightEdge - c1w, PAGE_H - 44, { font: reg, size: 8.5, color: C.lavender });
  txt(c2, rightEdge - c2w, PAGE_H - 59, { font: reg, size: 8.5, color: C.lavender });

  let y = PAGE_H - HEADER_H - 18;

  // ═══════════════════════════════════════════════════════════════════════════
  // RESUMEN
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Resumen", y);
  const sumH = paraAt(
    "Soy Product Manager y Diseñador de Producto, enfocado en construir productos digitales que " +
    "equilibren experiencia de usuario, estrategia de negocio y viabilidad tecnica. " +
    "Mi background combina estrategia de producto y diseno UX/UI, lo que me permite trabajar de " +
    "punta a punta: desde el discovery y la definicion del producto hasta la ejecucion del diseno " +
    "y la entrega. Trabaje en fintech, marketplaces y tecnologias emergentes, colaborando con " +
    "equipos multidisciplinarios para transformar ideas complejas en productos intuitivos y escalables. " +
    "Recientemente, integre flujos de desarrollo asistidos por IA al proceso de construccion de " +
    "producto, usando herramientas como Cursor y Claude para prototipar features rapidamente, " +
    "explorar posibilidades tecnicas y acelerar la iteracion. Con una base solida en diseno, " +
    "aporto un enfoque centrado en el usuario a las decisiones de producto, asegurando la " +
    "alineacion con los objetivos del negocio y las restricciones tecnicas.",
    ML, y,
    { font: reg, size: 8, color: C.mid, lineH: 12 }
  );
  y -= sumH + 16;

  // ═══════════════════════════════════════════════════════════════════════════
  // EXPERIENCIA
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Experiencia", y);

  const jobs = [
    {
      company: "WakeUp Labs",
      role:    "Product Manager y Design Strategist",
      meta:    "Oct 2024 – Actualidad",
      bullets: [
        "Lideré la estrategia de producto y el diseño UX de punta a punta en múltiples productos digitales, desde el discovery hasta la entrega",
        "Traduje sistemas complejos (DeFi, tokenizacion de activos reales, Smart Accounts) en experiencias de usuario intuitivas",
        "Colaboré con ingenieros, fundadores y stakeholders para definir roadmaps y lanzar productos escalables",
        "Utilicé herramientas de desarrollo asistido por IA (Cursor, Claude, Vercel) para prototipado rápido e iteracion de producto",
      ],
    },
    {
      company: "Espinosa Consultores",
      role:    "Diseñador UX/UI",
      meta:    "Ene 2024 – Oct 2024",
      bullets: [
        "Diseñé sitios corporativos, plataformas de e-commerce y landing pages aplicando principios de diseño centrado en el usuario",
        "Desarrollé identidades de marca y soluciones UX que mejoraron la satisfaccion y retencion de usuarios",
      ],
    },
    {
      company: "Kenion",
      role:    "Diseñador UI",
      meta:    "Ene 2021 – Sep 2023",
      bullets: [
        "Diseñé experiencias de usuario para sitios web, e-commerce y landing pages; realicé investigacion de usuarios",
        "Desarrollé arquetipos de usuario, flujos y wireframes basados en analisis de benchmark y competencia",
      ],
    },
    {
      company: "BAW Electric S.A.",
      role:    "Diseñador Gráfico",
      meta:    "Dic 2020 – Dic 2021",
      bullets: [
        "Diseñé packaging, materiales editoriales y activos de identidad de marca que potenciaron la visibilidad del producto",
      ],
    },
    {
      company: "Instituto Bet El",
      role:    "Diseñador Gráfico",
      meta:    "Ago 2019 – Dic 2020",
      bullets: [
        "Desarrollé identidad visual integral y materiales de marketing para institución educativa",
      ],
    },
  ];

  for (const job of jobs) {
    txt(job.company, ML, y, { font: bold, size: 9.5, color: C.dark });
    const mw = reg.widthOfTextAtSize(job.meta, 7.5);
    txt(job.meta, ML + CW - mw, y, { font: reg, size: 7.5, color: C.lgray });
    y -= 13;

    txt(job.role, ML, y, { font: bold, size: 8.5, color: C.purple });
    y -= 12;

    const bMaxW = CW - 12;
    for (const b of job.bullets) {
      const bLines = wrapLines(b, reg, 8, bMaxW);
      page.drawText("•", { x: ML + 1, y, font: bold, size: 8, color: C.purple });
      for (const bl of bLines) {
        page.drawText(bl, { x: ML + 11, y, font: reg, size: 8, color: C.mid });
        y -= 12.5;
      }
    }
    y -= 12;
  }

  y -= 4;

  // ═══════════════════════════════════════════════════════════════════════════
  // EDUCACIÓN
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Educación", y);

  const edu = [
    {
      inst:  "Universidad de Buenos Aires",
      deg:   "Diseñador Industrial — Diseño Industrial y de Producto",
      years: "2016 – 2021",
    },
    {
      inst:  "ORT Argentina",
      deg:   "Bachiller Técnico — Orientación Construcciones",
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
  // HABILIDADES — tres columnas
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Habilidades", y);

  const skillCols = [
    ["Gestión de Producto", "Diseño UX/UI", "Estrategia de Producto", "Investigacion de Usuarios"],
    ["Wireframing y Prototipado", "Figma", "Gestión de Stakeholders", "Roadmapping"],
    ["Desarrollo con IA (Cursor, Claude)", "Vibecoding", "Web3 / DeFi / Fintech", "Diseño Centrado en Usuario"],
  ];

  const skColW = CW / 3;
  const skRowH = 14;
  const rows   = Math.max(...skillCols.map(c => c.length));

  for (let i = 0; i < rows; i++) {
    for (let c = 0; c < skillCols.length; c++) {
      if (!skillCols[c][i]) continue;
      const xBase = ML + c * skColW;
      page.drawText("•", { x: xBase,      y, font: bold, size: 8.5, color: C.purple });
      page.drawText(skillCols[c][i], { x: xBase + 10, y, font: reg,  size: 8.5, color: C.dark });
    }
    y -= skRowH;
  }

  y -= 14;

  // ═══════════════════════════════════════════════════════════════════════════
  // IDIOMAS Y CERTIFICACIONES
  // ═══════════════════════════════════════════════════════════════════════════

  y = section("Idiomas y Certificaciones", y);

  txt("Español", ML, y, { font: bold, size: 8.5, color: C.dark });
  txt("  Nativo", ML + bold.widthOfTextAtSize("Español", 8.5), y,
      { font: reg, size: 8.5, color: C.gray });

  const engX = ML + CW / 3;
  txt("Inglés", engX, y, { font: bold, size: 8.5, color: C.dark });
  txt("  Profesional completo", engX + bold.widthOfTextAtSize("Inglés", 8.5), y,
      { font: reg, size: 8.5, color: C.gray });

  const certText = "Diseñador UX/UI — Certificado";
  const certW = reg.widthOfTextAtSize(certText, 8.5);
  txt(certText, ML + CW - certW, y, { font: reg, size: 8.5, color: C.gray });

  y -= 14;

  // ─── Diagnostics ──────────────────────────────────────────────────────────
  const pages = doc.getPages().length;
  console.log(`y at end: ${y.toFixed(1)} pt  (bottom margin: ${MB} pt)`);
  console.log(`Pages: ${pages}`);
  if (y < MB) console.warn(`⚠️  Content overflows by ${(MB - y).toFixed(1)} pt`);

  // ─── Save ──────────────────────────────────────────────────────────────────
  const pdfBytes = await doc.save();
  writeFileSync(OUTPUT, pdfBytes);
  console.log(`CV guardado → ${OUTPUT}  (${(pdfBytes.length / 1024).toFixed(1)} KB)`);
}

buildCV().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
