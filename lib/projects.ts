import { promises as fs } from 'fs';
import path from 'path';
import { serialize } from 'next-mdx-remote/serialize';
import type { Locale } from './translations';

export interface ProjectFrontmatter {
  slug: string;
  title: string;
  company: string;
  role: string;
  period: string;
  status: string;
  tags: string[];
  link?: string;
  demoVideo?: string;
  cover?: string;
}

const CONTENT_DIR = path.join(process.cwd(), 'content', 'projects');

/** Remove deprecated Stack / Tecnologías section (heading + rest of file). */
function stripStackSectionFromMdx(raw: string): string {
  const lines = raw.split(/\r?\n/);
  let cut = -1;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^##\s+Stack\b/i.test(line) || /^##\s+Tecnologías\b/i.test(line)) {
      cut = i;
      break;
    }
  }
  if (cut < 0) return raw;
  return lines.slice(0, cut).join('\n').trimEnd();
}

/** Featured / listing order (landing + /projects). Unknown slugs sort after these, by title. */
const PROJECT_SLUG_ORDER = [
  'the-sandbox-ugc',
  'damm-capital',
  'tokelab-earn',
  'propertize',
  'dex-aggregator-stylus',
  'optimism-venture-studio',
  'superchain-accounts',
  'private-erc20-starknet',
] as const;

function sortProjectsByConfiguredOrder<T extends { slug: string; title: string }>(
  projects: T[]
): T[] {
  const rank = (slug: string) => {
    const i = PROJECT_SLUG_ORDER.indexOf(slug as (typeof PROJECT_SLUG_ORDER)[number]);
    return i === -1 ? PROJECT_SLUG_ORDER.length : i;
  };
  return [...projects].sort((a, b) => {
    const d = rank(a.slug) - rank(b.slug);
    if (d !== 0) return d;
    return a.title.localeCompare(b.title);
  });
}

function getContentDir(locale?: Locale): string {
  if (locale === 'en') {
    return path.join(CONTENT_DIR, 'en');
  }
  return CONTENT_DIR; // es or default → Spanish content
}

export async function getProjectBySlug(slug: string, locale: Locale = 'es') {
  const dir = getContentDir(locale);
  const filePath = path.join(dir, `${slug}.mdx`);
  try {
    const raw = stripStackSectionFromMdx(await fs.readFile(filePath, 'utf-8'));
    const serialized = await serialize(raw, {
      parseFrontmatter: true,
      mdxOptions: {
        development: process.env.NODE_ENV === 'development',
      },
    });
    return {
      frontmatter: serialized.frontmatter as ProjectFrontmatter,
      compiledSource: serialized.compiledSource,
      scope: serialized.scope,
    };
  } catch {
    // Fallback to default (Spanish) when locale-specific file not found
    if (locale === 'en') {
      const fallbackPath = path.join(CONTENT_DIR, `${slug}.mdx`);
      try {
        const raw = stripStackSectionFromMdx(await fs.readFile(fallbackPath, 'utf-8'));
        const serialized = await serialize(raw, {
          parseFrontmatter: true,
          mdxOptions: { development: process.env.NODE_ENV === 'development' },
        });
        return {
          frontmatter: serialized.frontmatter as ProjectFrontmatter,
          compiledSource: serialized.compiledSource,
          scope: serialized.scope,
        };
      } catch {
        return null;
      }
    }
    return null;
  }
}

export async function getAllProjectSlugs(locale: Locale = 'es'): Promise<string[]> {
  const dir = getContentDir(locale);
  try {
    const files = await fs.readdir(dir);
    return files
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''));
  } catch {
    const fallback = await fs.readdir(CONTENT_DIR);
    return fallback
      .filter((f) => f.endsWith('.mdx'))
      .map((f) => f.replace(/\.mdx$/, ''));
  }
}

export interface ProjectListItem {
  slug: string;
  title: string;
  company: string;
  role: string;
  shortDesc: string;
  cover?: string;
}

export async function getAllProjects(locale: Locale = 'es'): Promise<ProjectListItem[]> {
  const slugs = await getAllProjectSlugs(locale);
  const dir = getContentDir(locale);
  const projects: ProjectListItem[] = [];
  for (const slug of slugs) {
    const project = await getProjectBySlug(slug, locale);
    if (!project) continue;
    const { frontmatter } = project;
    const filePath = path.join(dir, `${slug}.mdx`);
    let raw: string;
    try {
      raw = stripStackSectionFromMdx(await fs.readFile(filePath, 'utf-8'));
    } catch {
      raw = stripStackSectionFromMdx(
        await fs.readFile(path.join(CONTENT_DIR, `${slug}.mdx`), 'utf-8')
      );
    }
    const overviewMatch = raw.match(/## Overview\s*\n\s*([^\n#]+)/);
    let shortDesc =
      overviewMatch?.[1]?.trim() || `${frontmatter.company} — ${frontmatter.role}`;
    if (shortDesc.length > 120) shortDesc = shortDesc.slice(0, 119) + '…';
    projects.push({
      slug: frontmatter.slug,
      title: frontmatter.title,
      company: frontmatter.company,
      role: frontmatter.role,
      shortDesc,
      cover: frontmatter.cover,
    });
  }
  return sortProjectsByConfiguredOrder(projects);
}
