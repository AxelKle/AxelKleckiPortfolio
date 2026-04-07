import type { Metadata } from 'next';
import { getProjectBySlug } from '@/lib/projects';

interface Props {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug, 'es');

  if (!project) {
    return {
      title: 'Proyecto | Axel Klecki',
    };
  }

  const { title, shortDesc, cover, company } = project.frontmatter as {
    title?: string;
    shortDesc?: string;
    cover?: string;
    company?: string;
  };

  const pageTitle = title
    ? `${title} | Axel Klecki`
    : 'Axel Klecki | PM & Design Strategist';

  const description = shortDesc
    || (company ? `Proyecto de ${company} — Axel Klecki, PM y diseñador.` : 'Axel Klecki, PM y diseñador.')

  const baseUrl = 'https://axelklecki.site';
  const imageUrl = cover ? `${baseUrl}${cover}` : `${baseUrl}/axel-avatar.png`;

  return {
    title: pageTitle,
    description,
    openGraph: {
      title: pageTitle,
      description,
      url: `${baseUrl}/projects/${slug}`,
      siteName: 'Axel Klecki Portfolio',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title || 'Axel Klecki Portfolio',
        },
      ],
      locale: 'es_AR',
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description,
      images: [imageUrl],
    },
  };
}

export default function ProjectSlugLayout({ children }: { children: React.ReactNode }) {
  return children;
}
