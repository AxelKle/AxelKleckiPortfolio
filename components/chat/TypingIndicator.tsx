'use client';

export function TypingIndicator() {
  return (
    <div className="msg-ai">
      <div className="msg-ai-avatar">AK</div>
      <div>
        <div className="msg-ai-name">Axel Klecki</div>
        <div className="msg-ai-bubble">
          <div className="typing-indicator">
            <span />
            <span />
            <span />
          </div>
        </div>
      </div>
    </div>
  );
}
