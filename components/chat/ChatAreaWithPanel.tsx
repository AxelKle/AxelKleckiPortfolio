'use client';

import { Chat } from './Chat';
import { ProjectModalShell } from './ProjectModalShell';

interface ChatAreaWithPanelProps {
  initialQuestion?: string;
}

export function ChatAreaWithPanel({ initialQuestion }: ChatAreaWithPanelProps) {
  return (
    <main
      className="chat-area relative overflow-hidden bg-[#F7F5F2]"
      style={{ display: 'flex', flexDirection: 'row', flex: 1, minHeight: 0 }}
    >
      <div className="min-w-0 min-h-0 flex flex-col overflow-hidden flex-1">
        <Chat initialQuestion={initialQuestion} />
      </div>
      <ProjectModalShell />
    </main>
  );
}
