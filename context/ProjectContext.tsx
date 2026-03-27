'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';

interface ProjectContextType {
  openSlug: string | null;
  openProject: (slug: string) => void;
  closePanel: () => void;
}

const ProjectContext = createContext<ProjectContextType | null>(null);

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [openSlug, setOpenSlug] = useState<string | null>(null);

  const openProject = useCallback((slug: string) => {
    setOpenSlug(slug);
  }, []);

  const closePanel = useCallback(() => {
    setOpenSlug(null);
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
