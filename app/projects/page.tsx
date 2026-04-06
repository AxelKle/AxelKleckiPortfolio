'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Providers } from '@/components/Providers';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import { useProject } from '@/context/ProjectContext';
import { ProjectModalShell } from '@/components/chat/ProjectModalShell';
import { EmailPopover } from '@/components/EmailPopover';

interface ProjectItem {
  slug: string;
  title: string;
  company: string;
  role: string;
  shortDesc: string;
  cover?: string;
}

export default function ProjectsPage() {
  return (
    <Providers>
      <ProjectsPageContent />
    </Providers>
  );
}

function ProjectsPageContent() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const { t, locale } = useLanguage();
  const { openProject } = useProject();
  const router = useRouter();

  const handleBack = useCallback(() => {
    if (typeof window === 'undefined') return;

    let sameOriginReferrer = false;
    if (document.referrer) {
      try {
        sameOriginReferrer =
          new URL(document.referrer).origin === window.location.origin;
      } catch {
        sameOriginReferrer = false;
      }
    }

    if (sameOriginReferrer || window.history.length > 1) {
      router.back();
    } else {
      router.push('/');
    }
  }, [router]);

  useEffect(() => {
    fetch(`/api/projects?locale=${locale}`, { cache: 'no-store' })
      .then((res) => res.json())
      .then((data: ProjectItem[]) => setProjects(data))
      .catch(() => setProjects([]));
  }, [locale]);

  return (
    <div className="min-h-screen flex flex-col bg-warm relative overflow-hidden">
      {/* Ambient orbs — same as landing */}
      <div className="landing-bg-fx" aria-hidden>
        <div className="landing-orb-1" />
        <div className="landing-orb-2" />
        <div className="landing-orb-3" />
      </div>

      {/* Top bar */}
      <div className="relative z-10 container flex items-center justify-between" style={{ paddingTop: '40px', paddingBottom: '20px' }}>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="projects-back-link"
            onClick={handleBack}
            aria-label={t.navBack}
          >
            <ArrowLeft className="size-5 shrink-0" strokeWidth={2} aria-hidden />
          </button>
          <h1 className="projects-page-title">{t.projects}</h1>
        </div>
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {/* LinkedIn + Email — hidden on mobile (moved to bottom bar) */}
          <a
            href="https://linkedin.com/in/axelklecki"
            target="_blank"
            rel="noopener noreferrer"
            className="pill-nav-btn projects-desktop-only"
          >
            {t.linkedIn}
          </a>
          <a
            href="mailto:kleckiax@gmail.com"
            className="pill-nav-btn projects-desktop-only"
          >
            {t.email}
          </a>
        </div>
      </div>

      {/* Mobile-only floating bottom bar */}
      <div className="projects-mobile-bar">
        <a
          href="/axel-klecki-cv.pdf"
          download="Axel_Klecki_CV.pdf"
          className="projects-mobile-bar-btn"
        >
          {t.downloadCV}
        </a>
        <a
          href="https://linkedin.com/in/axelklecki"
          target="_blank"
          rel="noopener noreferrer"
          className="projects-mobile-bar-btn"
        >
          {t.linkedIn}
        </a>
        <EmailPopover className="projects-mobile-bar-btn" />
      </div>

      <main className="flex-1 relative container projects-page-main">

        <div className="projects-grid">
          {projects.map((p) => (
            <button
              key={p.slug}
              type="button"
              onClick={() => openProject(p.slug)}
              className="featured-project-card"
            >
              <div className="featured-card-image-wrap">
                {p.cover ? (
                  <Image
                    src={p.cover}
                    alt={p.title}
                    fill
                    className="object-cover"
                    style={{ objectPosition: 'top center' }}
                    sizes="(max-width: 767px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  />
                ) : (
                  <div className="w-full h-full bg-[#E8E4DC]" />
                )}
              </div>
              <div className="featured-card-text">
                <h3 className="featured-card-title">{p.title}</h3>
                <p className="featured-card-desc">{p.shortDesc}</p>
              </div>
            </button>
          ))}
        </div>
      </main>

      {/* Project modal overlay */}
      <ProjectModalShell />
    </div>
  );
}
