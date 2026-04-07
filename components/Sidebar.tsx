'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { useProject } from '@/context/ProjectContext';

interface ProjectItem {
  slug: string;
  title: string;
}

/** Name before em/en dash is bold; subtitle stays regular. No dash → whole title bold. */
const TITLE_SUBTITLE_SPLIT = /^(.+?)\s*[—–]\s*(.+)$/;

function SidebarProjectTitle({ title }: { title: string }) {
  const match = title.match(TITLE_SUBTITLE_SPLIT);
  if (!match) {
    return (
      <span className="sidebar-project-name">{title}</span>
    );
  }
  const [, name, subtitle] = match;
  return (
    <span className="sidebar-project-stack">
      <span className="sidebar-project-name">{name}</span>
      <span className="sidebar-project-sub">{subtitle}</span>
    </span>
  );
}

export function Sidebar() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const { goToLanding } = useApp();
  const { openSlug, openProject } = useProject();
  const { t, locale } = useLanguage();

  useEffect(() => {
    fetch(`/api/projects?locale=${locale}`)
      .then((res) => res.json())
      .then((data: ProjectItem[]) => setProjects(data))
      .catch(() => setProjects([]));
  }, [locale]);

  const visibleProjects = projects.slice(0, 6);

  return (
    <aside className="sidebar w-[260px] shrink-0">
      <div className="flex-1 flex flex-col overflow-y-auto min-h-0 sidebar-scroll">
        {/* Profile section */}
        <div className="sidebar-profile-section">
          <button onClick={goToLanding} style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}>
            <div className="sidebar-avatar-wrap">
              <img src="/axel-avatar.png" alt="Axel Klecki" style={{ objectFit: 'cover' }} />
            </div>
          </button>
          <div className="sidebar-profile-info">
            <span className="sidebar-profile-name">{t.name}</span>
            <span className="sidebar-profile-role">{t.role}</span>
          </div>
        </div>
        <div className="sidebar-divider" />

        {/* Projects */}
        <h3 className="sidebar-section-label">{t.projectsLabel}</h3>
        <ul className="sidebar-projects-list">
          {visibleProjects.length > 0 ? (
            visibleProjects.map((p) => {
              const isActive = openSlug === p.slug;
              return (
                <li key={p.slug} className="sidebar-project-item-wrapper">
                  <button
                    type="button"
                    onClick={() => openProject(p.slug)}
                    className={`sidebar-project-item ${isActive ? 'sidebar-project-item-active' : ''}`}
                  >
                    <span className="sidebar-project-dot" />
                    <span className="sidebar-project-title">
                      <SidebarProjectTitle title={p.title} />
                    </span>
                  </button>
                </li>
              );
            })
          ) : (
            <li className="body-sm text-ink-3 sidebar-project-item-wrapper">{t.noProjectsLoaded}</li>
          )}
        </ul>
        <Link href="/projects" className="sidebar-view-all">
          Ver todos los proyectos
          <span className="sidebar-view-all-arrow">→</span>
        </Link>

      </div>
    </aside>
  );
}
