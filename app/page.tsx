'use client';

import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';
import { Providers } from '@/components/Providers';
import { Sidebar } from '@/components/Sidebar';
import { ChatAreaWithPanel } from '@/components/chat/ChatAreaWithPanel';
import { ProjectModalShell } from '@/components/chat/ProjectModalShell';
import { LandingPage } from '@/components/landing/LandingPage';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { ArrowLeft } from 'lucide-react';

function PageContent() {
  const { showChatView, goToLanding } = useApp();
  const { t } = useLanguage();

  const fadeStyle: React.CSSProperties = {
    animation: 'fadein 0.5s cubic-bezier(0.22, 1, 0.36, 1) both',
  };

  if (!showChatView) {
    return (
      <div style={fadeStyle}>
        <LandingPage />
        <ProjectModalShell />
      </div>
    );
  }

  return (
    <div className="h-screen bg-warm" style={fadeStyle}>
      {/* Mobile back button */}
      <button
        type="button"
        onClick={goToLanding}
        className="mobile-back-btn"
        aria-label={t.navBack}
      >
        <ArrowLeft className="size-4" strokeWidth={2} aria-hidden />
      </button>

      {/* Floating CTAs */}
      <div className="chat-topbar-ctas fixed top-5 right-5 z-50 flex items-center gap-2">
        <LanguageSwitcher />
        <a
          href="/axel-klecki-cv.pdf"
          download="Axel_Klecki_CV.pdf"
          className="pill-nav-btn pill-nav-btn--cv"
        >
          {t.downloadCV}
        </a>
        <a
          href="https://linkedin.com/in/axelklecki"
          target="_blank"
          rel="noopener noreferrer"
          className="pill-nav-btn"
        >
          {t.linkedIn}
        </a>
        <a
          href="mailto:axel@example.com"
          className="pill-nav-btn"
        >
          {t.email}
        </a>
      </div>

      <div className="chat-layout">
        <Sidebar />
        <ChatAreaWithPanel />
      </div>
    </div>
  );
}

export default function Home() {
  return (
    <Providers>
      <PageContent />
    </Providers>
  );
}
