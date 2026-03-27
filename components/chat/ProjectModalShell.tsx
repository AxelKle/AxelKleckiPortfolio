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
        <div className="project-modal-card">
          <ProjectPanel />
        </div>
      </div>
    </>
  );
}
