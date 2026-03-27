'use client';

import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { ProjectProvider } from './ProjectContext';

interface AppContextType {
  showChatView: boolean;
  chatHistory: string[];
  pendingQuestion: string | null;
  enterChatView: (question?: string) => void;
  goToLanding: () => void;
  addToChatHistory: (question: string) => void;
  consumePendingQuestion: () => string | null;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [showChatView, setShowChatView] = useState(false);
  const [chatHistory, setChatHistory] = useState<string[]>([]);
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null);

  const enterChatView = useCallback((question?: string) => {
    if (question?.trim()) {
      setPendingQuestion(question.trim());
    }
    setShowChatView(true);
  }, []);

  const addToChatHistory = useCallback((question: string) => {
    const trimmed = question.trim();
    if (!trimmed) return;
    setChatHistory((prev) => [...prev, trimmed]);
  }, []);

  const consumePendingQuestion = useCallback(() => {
    const q = pendingQuestion;
    setPendingQuestion(null);
    return q;
  }, [pendingQuestion]);

  const goToLanding = useCallback(() => {
    setShowChatView(false);
  }, []);

  return (
    <ProjectProvider>
    <AppContext.Provider
      value={{
        showChatView,
        chatHistory,
        pendingQuestion,
        enterChatView,
        goToLanding,
        addToChatHistory,
        consumePendingQuestion,
      }}
    >
      {children}
    </AppContext.Provider>
    </ProjectProvider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
