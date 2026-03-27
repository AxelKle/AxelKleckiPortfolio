'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { Providers } from '@/components/Providers';
import { Sidebar } from '@/components/Sidebar';
import { ChatAreaWithPanel } from '@/components/chat/ChatAreaWithPanel';
import { LanguageSwitcher } from '@/components/LanguageSwitcher';
import { useLanguage } from '@/context/LanguageContext';
import Link from 'next/link';
import { SLUG_TO_QUESTION } from '@/lib/companyLinks';

function ChatPageContent() {
  const searchParams = useSearchParams();
  const context = searchParams.get('context');
  const question = context ? SLUG_TO_QUESTION[context] : null;

  return (
    <Providers>
      <div className="h-screen bg-warm">
        {/* Floating CTAs */}
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2">
          <LanguageSwitcher />
          <a
            href="https://linkedin.com/in/axelklecki"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 rounded-full text-[12px] font-medium text-ink-2 hover:text-ink transition-all backdrop-blur-md bg-white/70 border border-[var(--line)] shadow-sm hover:shadow-md hover:border-[rgba(107,78,255,0.25)] px-3 py-2"
          >
            <ChatPageLinkedIn />
          </a>
          <a
            href="mailto:axel@example.com"
            className="flex items-center gap-2 rounded-full text-[12px] font-medium text-ink-2 hover:text-ink transition-all backdrop-blur-md bg-white/70 border border-[var(--line)] shadow-sm hover:shadow-md hover:border-[rgba(107,78,255,0.25)] px-3 py-2"
          >
            <ChatPageEmail />
          </a>
        </div>

        <div className="chat-layout">
          <Sidebar />
          <ChatAreaWithPanel initialQuestion={question ?? undefined} />
        </div>
      </div>
    </Providers>
  );
}

function ChatPageAvailBadge() {
  const { t } = useLanguage();
  return (
    <span className="avail-badge">
      <span className="avail-badge-dot" />
      {t.available}
    </span>
  );
}

function ChatPageLinkedIn() {
  const { t } = useLanguage();
  return t.linkedIn;
}

function ChatPageEmail() {
  const { t } = useLanguage();
  return t.email;
}

export default function ChatPage() {
  return (
    <Suspense fallback={<div className="h-screen flex items-center justify-center bg-warm">Cargando…</div>}>
      <ChatPageContent />
    </Suspense>
  );
}
