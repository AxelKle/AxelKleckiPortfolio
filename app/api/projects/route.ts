import { NextRequest, NextResponse } from 'next/server';
import { getAllProjects } from '@/lib/projects';
import type { Locale } from '@/lib/translations';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const locale = (searchParams.get('locale') || 'es') as Locale;
  const validLocale = locale === 'es' || locale === 'en' ? locale : 'es';
  const projects = await getAllProjects(validLocale);
  return NextResponse.json(projects);
}
