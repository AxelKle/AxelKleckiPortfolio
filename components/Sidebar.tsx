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
    return <strong className="sidebar-project-name">{title}</strong>;
  }
  const [, name, subtitle] = match;
  return (
    <>
      <strong className="sidebar-project-name">{name}</strong>
      {' — '}
      {subtitle}
    </>
  );
}

export function Sidebar() {
  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const { chatHistory, enterChatView } = useApp();
  const { openSlug, openProject } = useProject();
  const { t, locale } = useLanguage();

  useEffect(() => {
    fetch(`/api/projects?locale=${locale}`)
      .then((res) => res.json())
      .then((data: ProjectItem[]) => setProjects(data))
      .catch(() => setProjects([]));
  }, [locale]);

  const visibleProjects = projects.slice(0, 4);

  return (
    <aside className="sidebar w-[260px] shrink-0">
      <div className="flex-1 flex flex-col overflow-y-auto min-h-0 sidebar-scroll">
        {/* Profile section */}
        <div className="sidebar-profile-section">
          <img src="/axel-avatar.png" alt="Axel Klecki" className="avatar-gradient-sidebar" style={{ objectFit: 'cover', borderRadius: '50%' }} />
          <div className="sidebar-profile-info">
            <span className="sidebar-profile-name">{t.name}</span>
            <span className="sidebar-profile-role">{t.role}</span>
          </div>
          <span className="avail-badge avail-badge-sidebar">
            <span className="avail-badge-dot" />
            {t.available}
          </span>
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
          {t.viewAllProjects}
        </Link>

        {/* Chat history — always visible */}
        <div className="sidebar-history-section">
          <h3 className="sidebar-section-label">{t.chatHistory}</h3>
          {chatHistory.length === 0 ? (
            <p className="sidebar-no-history">{t.noHistory}</p>
          ) : (
            <ul className="sidebar-history-list">
              {[...chatHistory].reverse().map((q, i) => (
                <li key={`${i}-${q.slice(0, 20)}`} className="sidebar-history-item">
                  <button
                    type="button"
                    onClick={() => enterChatView(q)}
                    className="sidebar-history-button"
                  >
                    <span className="sidebar-history-text truncate">{q}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
