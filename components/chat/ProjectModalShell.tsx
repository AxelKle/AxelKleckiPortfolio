'use client';

import { X } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import { ProjectPanel } from '@/components/chat/ProjectPanel';

export function ProjectModalShell() {
  const { openSlug, closePanel } = useProject();
  const { t } = useLanguage();

  if (!openSlug) return null;

  return (
    <>
      <button
        type="button"
        onClick={closePanel}
        className="project-modal-backdrop"
        aria-label={t.closePanel}
      />
      <div
        className="project-modal-shell"
        role="dialog"
        aria-modal="true"
        aria-labelledby="project-modal-title"
      >
        <button
          type="button"
          onClick={closePanel}
          className="project-modal-close-floating"
          aria-label={t.closePanel}
        >
          <X className="w-6 h-6" strokeWidth={1.75} aria-hidden />
        </button>
        {/* Wrapper so hint can overflow the card's overflow:hidden */}
        <div className="project-modal-card-wrapper">
          <div className="project-modal-card">
            <ProjectPanel />
          </div>
          {/* Scroll hint — sits outside the card so it's not clipped */}
          <span className="project-detail-hero-scroll-hint" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 6L8 11L13 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </>
  );
}
