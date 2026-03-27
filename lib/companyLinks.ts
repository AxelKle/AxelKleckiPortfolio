/**
 * Names that appear in AI replies and get a "Ver proyecto →" button.
 * Use distinct product/project titles (duplicate `name` would break the slug map).
 */
export const COMPANY_LINKS = [
  { name: 'DEX Aggregator — Stylus on Arbitrum', slug: 'dex-aggregator-stylus' },
  { name: 'DEX Aggregator', slug: 'dex-aggregator-stylus' },
  { name: 'Propertize', slug: 'propertize' },
  { name: 'Superchain Accounts', slug: 'superchain-accounts' },
  { name: 'The Sandbox', slug: 'the-sandbox-ugc' },
  { name: 'UGC Platform', slug: 'the-sandbox-ugc' },
  { name: 'DAMM Capital', slug: 'damm-capital' },
  { name: 'Optimism as Venture Studio', slug: 'optimism-venture-studio' },
  { name: 'Private ERC20 on Starknet', slug: 'private-erc20-starknet' },
  { name: 'Enigma', slug: 'private-erc20-starknet' },
  { name: 'Tokelab Earn', slug: 'tokelab-earn' },
] as const;

const COMPANY_PATTERN = new RegExp(
  COMPANY_LINKS.length > 0
    ? `(${COMPANY_LINKS.map((c) => c.name.replace(/\s+/g, '\\s+')).join('|')})`
    : '(?!.)',
  'gi'
);

export type ContentSegment =
  | { type: 'text'; value: string }
  | { type: 'company'; name: string; slug: string };

export function parseContentWithCompanyLinks(content: string): ContentSegment[] {
  const slugMap = Object.fromEntries(
    COMPANY_LINKS.map((c) => [c.name.toLowerCase(), c.slug])
  );
  const parts = content.split(COMPANY_PATTERN);
  const segments: ContentSegment[] = [];

  for (const part of parts) {
    const slug = slugMap[part.toLowerCase()];
    const match = COMPANY_LINKS.find(
      (c) => c.name.toLowerCase() === part.toLowerCase()
    );
    if (slug && match) {
      segments.push({ type: 'company', name: match.name, slug });
    } else if (part) {
      segments.push({ type: 'text', value: part });
    }
  }
  return segments;
}

/** Returns unique companies mentioned in text (frontend detection, not AI output), in order of first appearance */
export function getCompaniesMentionedInText(content: string): Array<{ name: string; slug: string }> {
  const seen = new Set<string>();
  const result: Array<{ name: string; slug: string }> = [];
  const matches = content.matchAll(COMPANY_PATTERN);

  for (const match of matches) {
    const name = match[0];
    const link = COMPANY_LINKS.find((c) => c.name.toLowerCase() === name.toLowerCase());
    if (link && !seen.has(link.slug)) {
      seen.add(link.slug);
      result.push({ name: link.name, slug: link.slug });
    }
  }
  return result;
}

/** Question to auto-send when opening /chat?context=<slug> */
export const SLUG_TO_QUESTION: Record<string, string> = {
  propertize: 'Contame sobre Propertize en WakeUp Labs',
  'superchain-accounts': 'Contame sobre Superchain Accounts',
  'the-sandbox-ugc': 'Contame sobre el proyecto UGC Platform en WakeUp Labs',
  'damm-capital': 'Contame sobre DAMM Capital',
  'optimism-venture-studio': 'Contame sobre el programa Optimism as Venture Studio',
  'private-erc20-starknet': 'Contame sobre Private ERC20 on Starknet / Enigma',
  'tokelab-earn': 'Contame sobre Tokelab Earn',
  'dex-aggregator-stylus': 'Contame sobre el DEX Aggregator en Stylus / Arbitrum',
};
