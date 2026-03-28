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
      className="pill-nav-btn"
    >
      <Languages className="size-3.5" />
      <span>{locale === 'es' ? 'EN' : 'ES'}</span>
    </button>
  );
}
