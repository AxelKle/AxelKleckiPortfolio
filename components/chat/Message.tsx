'use client';

import { getCompaniesMentionedInText } from '@/lib/companyLinks';
import { useProject } from '@/context/ProjectContext';

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
}

function renderTextWithBold(text: string) {
  return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) =>
    part.startsWith('**') && part.endsWith('**') ? (
      <strong key={i} className="font-semibold">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    )
  );
}

export function Message({ role, content }: MessageProps) {
  const { openProject } = useProject();
  const isUser = role === 'user';

  if (isUser) {
    return (
      <div className="msg-user">
        <div className="msg-user-bubble">
          <div className="whitespace-pre-wrap break-words">
            {renderTextWithBold(content)}
          </div>
        </div>
      </div>
    );
  }

  const companies = getCompaniesMentionedInText(content);

  return (
    <div className="msg-ai">
      <div className="avatar-gradient avatar-gradient-msg">AK</div>
      <div>
        <div className="msg-ai-name">Axel Klecki</div>
        <div className="msg-ai-bubble">
          <div className="whitespace-pre-wrap break-words">
            {renderTextWithBold(content)}
          </div>
          {companies.length > 0 && (
            <div className="mt-6 pt-4 border-t border-[var(--line)] flex flex-wrap gap-2">
              {companies.map(({ name, slug }) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => openProject(slug)}
                  title={name}
                  className="inline-flex items-center gap-0.5 text-[11px] font-medium text-g1 hover:text-g2 px-2 py-1 rounded border border-[var(--line)] hover:border-g1/40 transition-colors bg-transparent cursor-pointer"
                >
                  {companies.length > 1 ? `Ver ${name} →` : 'Ver proyecto →'}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
