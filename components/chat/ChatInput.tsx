'use client';

import { Send } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  disabled?: boolean;
  placeholder?: string;
}

export function ChatInput({
  value,
  onChange,
  onSubmit,
  disabled = false,
  placeholder = 'Ask anything about Axel...',
}: ChatInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <div className="chat-input-area">
      <div className="chat-input-wrap flex items-center max-w-3xl mx-auto">
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className={cn(
            'chat-input-field flex-1 resize-none',
            'min-h-[48px] max-h-[200px] py-3.5',
            'disabled:opacity-50 disabled:cursor-not-allowed'
          )}
        />
        <button
          type="button"
          onClick={onSubmit}
          disabled={disabled || !value.trim()}
          className="chat-send-btn"
        >
          <Send className="size-5" />
        </button>
      </div>
    </div>
  );
}
