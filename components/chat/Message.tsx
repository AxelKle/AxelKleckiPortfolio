'use client';

import { getCompaniesMentionedInText, shouldShowViewAllProjects } from '@/lib/companyLinks';
import { useProject } from '@/context/ProjectContext';
import { useLanguage } from '@/context/LanguageContext';

const PM_DESIGN_ICONS = ['✎', '◎', '✦', '⊕'];

interface MessageProps {
  role: 'user' | 'assistant';
  content: string;
  index?: number;
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

export function Message({ role, content, index = 0 }: MessageProps) {
  const { openProject } = useProject();
  const { t } = useLanguage();
  const isUser = role === 'user';
  const icon = PM_DESIGN_ICONS[index % PM_DESIGN_ICONS.length];

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
  const showViewAll = shouldShowViewAllProjects(content);
  const cleanContent = content
    .replace(/\[VER_PROYECTOS\]/gi, '')
    .replace(/\s*—\s*/g, ', ')
    .trim();

  return (
    <div className="msg-ai">
      {/* Desktop: gradient icon */}
      <div className="avatar-gradient avatar-gradient-msg msg-avatar-desktop">{icon}</div>
      {/* Mobile: profile photo */}
      <img
        src="/axel-avatar.png"
        alt="Axel Klecki"
        className="msg-avatar-mobile"
      />
      <div>
        <div className="msg-ai-name">Axel Klecki</div>
        <div className="msg-ai-bubble">
          <div className="whitespace-pre-wrap break-words">
            {renderTextWithBold(cleanContent)}
          </div>
          {(companies.length > 0 || showViewAll) && (
            <div className="border-t border-[var(--line)] flex flex-wrap gap-2" style={{ marginTop: '40px', paddingTop: '20px' }}>
              {companies.map(({ name, slug }) => (
                <button
                  key={slug}
                  type="button"
                  onClick={() => openProject(slug)}
                  title={name}
                  className="inline-flex items-center text-[11px] font-medium text-g1 hover:text-g2 rounded-full border border-[var(--line)] hover:border-g1/40 transition-colors bg-transparent cursor-pointer"
                  style={{ padding: '6px 14px', gap: '4px' }}
                >
                  {`${t.viewProjectNamed} ${name} →`}
                </button>
              ))}
              {showViewAll && (
                <a
                  href="/projects"
                  className="inline-flex items-center text-[11px] font-medium text-g1 hover:text-g2 rounded-full border border-[var(--line)] hover:border-g1/40 transition-colors bg-transparent cursor-pointer"
                  style={{ padding: '6px 14px', gap: '4px' }}
                >
                  {t.viewAllProjects}
                </a>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
