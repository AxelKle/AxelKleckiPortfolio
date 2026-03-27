'use client';

import { AppProvider } from '@/context/AppContext';
import { LanguageProvider } from '@/context/LanguageContext';
import { ProjectProvider } from '@/context/ProjectContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <LanguageProvider>
      <AppProvider>
        <ProjectProvider>{children}</ProjectProvider>
      </AppProvider>
    </LanguageProvider>
  );
}
