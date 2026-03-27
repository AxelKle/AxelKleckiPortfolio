'use client';

import { useLanguage } from '@/context/LanguageContext';
import { Languages } from 'lucide-react';

export function LanguageSwitcher() {
  const { locale, setLocale } = useLanguage();

  const toggle = () => {
    setLocale(locale === 'es' ? 'en' : 'es');
  };

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={locale === 'es' ? 'Switch to English' : 'Cambiar a español'}
      title={locale === 'es' ? 'English' : 'Español'}
      style={{ padding: '8px 14px' }}
      className="flex items-center gap-2 rounded-full text-[12px] font-medium text-ink-2 hover:text-ink transition-all backdrop-blur-md bg-white/70 border border-[var(--line)] shadow-sm hover:shadow-md hover:border-[rgba(107,78,255,0.25)]"
    >
      <Languages className="size-3.5" />
      <span>{locale === 'es' ? 'EN' : 'ES'}</span>
    </button>
  );
}
