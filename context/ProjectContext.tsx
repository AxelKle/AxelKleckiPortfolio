'use client';

import { createContext, useContext, useState, useCallback, useEffect, useRef, type ReactNode } from 'react';

interface ProjectContextType {
  openSlug: string | null;
  openProject: (slug: string) => void;
  closePanel: () => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);
  const historyPushedRef = useRef(false);

  const openProject = useCallback((slug: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({ axelModal: slug }, '');
      historyPushedRef.current = true;
    }
    setOpenSlug(slug);
  }, []);

  const closePanel = useCallback(() => {
    setOpenSlug(null);
    if (historyPushedRef.current) {
      historyPushedRef.current = false;
      window.history.back();
    }
  }, []);

  // Intercept browser/mobile back button when modal is open
  useEffect(() => {
    const handlePop = () => {
      if (historyPushedRef.current) {
        historyPushedRef.current = false;
        setOpenSlug(null);
      }
    };
    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, []);

  return (
    <ProjectContext.Provider value={{ openSlug, openProject, closePanel }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProject() {
  const ctx = useContext(ProjectContext);
  if (!ctx) throw new Error('useProject must be used within ProjectProvider');
  return ctx;
}
