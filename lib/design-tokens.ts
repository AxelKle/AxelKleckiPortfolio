// ============================================================
// AK PORTFOLIO AI — DESIGN TOKENS
// Para usar en Tailwind, inline styles o variables de JS
// ============================================================

export const tokens = {
  // Colors
  colors: {
    bg: "#F7F5F2",
    surface: "#FFFFFF",
    surface2: "#F0EEE9",
    surface3: "#ECEAE5",
    ink: "#14121A",
    ink2: "#7A7585",
    ink3: "#C4BFD0",
    line: "#E8E4DC",
    line2: "#D9D5CC",

    // Gradient stops
    g1: "#6B4EFF",
    g2: "#C254F5",
    g3: "#FF6B6B",
    g4: "#FFB347",

    // Semantic
    green: "#1AA058",
    blue: "#3B82F6",
    amber: "#D97706",
    purple: "#C254F5",
  },

  // Gradients
  gradients: {
    primary:
      "linear-gradient(135deg, #6B4EFF 0%, #C254F5 50%, #FF6B6B 100%)",
    soft: "linear-gradient(135deg, rgba(107,78,255,0.08) 0%, rgba(194,84,245,0.08) 50%, rgba(255,107,107,0.06) 100%)",
    btn: "linear-gradient(135deg, #6B4EFF, #C254F5)",
    avatar: "linear-gradient(135deg, #6B4EFF, #C254F5, #FF6B6B)",
  },

  // Typography
  font: {
    family: "'Bricolage Grotesque', sans-serif",
    sizes: {
      display: "clamp(40px, 7vw, 72px)",
      h1: "clamp(28px, 4vw, 40px)",
      h2: "22px",
      h3: "16px",
      body: "14px",
      bodySm: "12px",
      label: "10px",
      caption: "11px",
    },
    weights: {
      light: 300,
      regular: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
    },
  },

  // Border radius
  radius: {
    none: "0px",
    xs: "8px",
    sm: "14px",
    md: "20px",
    lg: "28px",
    pill: "100px",
  },

  // Spacing (4px base)
  space: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "40px",
    "2xl": "64px",
  },

  // Shadows
  shadows: {
    sm: "0 1px 4px rgba(0,0,0,0.04)",
    md: "0 4px 16px rgba(0,0,0,0.06)",
    lg: "0 8px 40px rgba(107,78,255,0.08), 0 1px 0 #E8E4DC",
    accent: "0 0 0 3px rgba(107,78,255,0.08)",
  },

  // Animation
  transitions: {
    ease: "0.18s ease",
    easeFast: "0.12s ease",
  },
}

// Tailwind config extend (para tailwind.config.ts si se usa v3)
export const tailwindExtend = {
  colors: {
    bg: tokens.colors.bg,
    surface: tokens.colors.surface,
    ink: tokens.colors.ink,
    "ink-2": tokens.colors.ink2,
    "ink-3": tokens.colors.ink3,
    line: tokens.colors.line,
    g1: tokens.colors.g1,
    g2: tokens.colors.g2,
    g3: tokens.colors.g3,
    green: tokens.colors.green,
  },
  fontFamily: {
    sans: ["Bricolage Grotesque", "sans-serif"],
  },
  borderRadius: {
    xs: tokens.radius.xs,
    sm: tokens.radius.sm,
    md: tokens.radius.md,
    lg: tokens.radius.lg,
    pill: tokens.radius.pill,
  },
  boxShadow: {
    sm: tokens.shadows.sm,
    md: tokens.shadows.md,
    lg: tokens.shadows.lg,
    accent: tokens.shadows.accent,
  },
}
