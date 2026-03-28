'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';
import { ProjectPanel } from '@/components/chat/ProjectPanel';

export function ProjectModalShell() {
  const { openSlug, closePanel } = useProject();
  const { t } = useLanguage();
  const [isAtBottom, setIsAtBottom] = useState(false);

  useEffect(() => {
    if (!openSlug) return;

    // Reset on new project
    setIsAtBottom(false);

    // Wait for the panel to render, then attach scroll listener
    const timer = setTimeout(() => {
      const scrollEl = document.querySelector('.project-modal-body-scroll');
      if (!scrollEl) return;

      const check = () => {
        const { scrollTop, scrollHeight, clientHeight } = scrollEl;
        setIsAtBottom(scrollHeight - scrollTop - clientHeight < 48);
      };

      check(); // initial check (in case content is short)
      scrollEl.addEventListener('scroll', check, { passive: true });
      return () => scrollEl.removeEventListener('scroll', check);
    }, 100);

    return () => clearTimeout(timer);
  }, [openSlug]);

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
          {/* Scroll hint — hides when user reaches the bottom */}
          <span
            className="project-detail-hero-scroll-hint"
            aria-hidden="true"
            style={{
              opacity: isAtBottom ? 0 : undefined,
              pointerEvents: 'none',
              transition: 'opacity 0.3s ease',
            }}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 6L8 11L13 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </span>
        </div>
      </div>
    </>
  );
}
