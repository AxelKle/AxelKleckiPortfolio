'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Providers } from '@/components/Providers';
import { useProject } from '@/context/ProjectContext';
import { ProjectModalShell } from '@/components/chat/ProjectModalShell';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function ProjectDetailPage() {
  return (
    <Providers>
      <ProjectDetailContent />
    </Providers>
  );
}

function ProjectDetailContent() {
  const params = useParams();
  const slug = typeof params.slug === 'string' ? params.slug : '';
  const { openProject } = useProject();
  const { t } = useLanguage();
  const router = useRouter();

  useEffect(() => {
    if (slug) openProject(slug);
  }, [slug, openProject]);

  return (
    <div className="min-h-screen flex flex-col bg-warm relative overflow-hidden">
      <div className="landing-bg-fx" aria-hidden>
        <div className="landing-orb-1" />
        <div className="landing-orb-2" />
        <div className="landing-orb-3" />
      </div>

      <div className="fixed top-0 left-0 right-0 z-50" style={{ paddingTop: '40px', paddingBottom: '16px' }}>
        <div className="container flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="projects-back-link"
              onClick={() => router.push('/projects')}
              aria-label={t.navBack}
            >
              <ArrowLeft className="size-5 shrink-0" strokeWidth={2} aria-hidden />
            </button>
          </div>
          <LanguageSwitcher />
        </div>
      </div>

      <ProjectModalShell />
    </div>
  );
}
