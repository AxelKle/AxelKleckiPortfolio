import { NextRequest, NextResponse } from 'next/server';
import { getProjectBySlug } from '@/lib/projects';
import type { Locale } from '@/lib/translations';

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const { searchParams } = new URL(req.url);
  const locale = (searchParams.get('locale') || 'es') as Locale;
  const validLocale = locale === 'es' || locale === 'en' ? locale : 'es';
  const project = await getProjectBySlug(slug, validLocale);
  if (!project) {
    return NextResponse.json({ error: 'Project not found' }, { status: 404 });
  }
  return NextResponse.json(project, {
    headers: { 'Cache-Control': 'no-store, max-age=0' },
  });
}
