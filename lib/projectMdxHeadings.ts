import { isValidElement, type ReactNode } from 'react';
import { translations, type Locale } from '@/lib/translations';

const H2_TRANSLATION_KEY = {
  overview: 'projectSectionOverview',
  problem: 'projectSectionProblem',
  process: 'projectSectionProcess',
  result: 'projectSectionResult',
} as const satisfies Record<
  string,
  keyof (typeof translations)['es']
>;

/** Flattens MDX heading children (usually a string) for label translation. */
export function reactNodeToPlainText(node: ReactNode): string {
  if (node == null || typeof node === 'boolean') return '';
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(reactNodeToPlainText).join('');
  if (isValidElement(node)) {
    const ch = (node.props as { children?: ReactNode }).children;
    return reactNodeToPlainText(ch);
  }
  return '';
}

export function translateProjectH2Heading(text: string, locale: Locale): string {
  const key = text.trim().toLowerCase();
  const tKey = H2_TRANSLATION_KEY[key as keyof typeof H2_TRANSLATION_KEY];
  if (tKey) return translations[locale][tKey] as string;
  return text;
}

/** Normalizes "Step 1 — …" / "Paso 1 — …" to the current locale. */
export function translateProjectH3Heading(text: string, locale: Locale): string {
  const trimmed = text.trim();
  const m = trimmed.match(/^(Step|Paso)\s+(\d+)\s*[—–-]\s*(.*)$/i);
  if (!m) return text;
  const n = m[2];
  const rest = m[3];
  const word = translations[locale].projectStepLabel;
  return `${word} ${n} — ${rest}`;
}
