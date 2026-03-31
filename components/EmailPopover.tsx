'use client';

import { useState, useRef, useEffect } from 'react';
import { Mail, Copy, Check, Send, X } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';

const EMAIL = 'kleckiax@gmail.com';

type View = 'menu' | 'form';

export function EmailPopover({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>('menu');
  const [copied, setCopied] = useState(false);
  const [senderEmail, setSenderEmail] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'sent' | 'error'>('idle');
  const ref = useRef<HTMLDivElement>(null);
  const { t } = useLanguage();

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  function handleClose() {
    setOpen(false);
    setTimeout(() => {
      setView('menu');
      setSenderEmail('');
      setMessage('');
      setStatus('idle');
    }, 200);
  }

  function handleCopy() {
    navigator.clipboard.writeText(EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    if (!senderEmail.trim() || !message.trim()) return;
    setStatus('loading');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senderEmail: senderEmail.trim(), message: message.trim() }),
      });
      if (res.ok) {
        setStatus('sent');
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={className ?? 'pill-nav-btn'}
      >
        {t.email}
      </button>

      {open && view === 'form' && status !== 'sent' && (
        <div className="email-popover-backdrop" onClick={handleClose} aria-hidden />
      )}

      {open && (
        <div className="email-popover">
          <button
            type="button"
            onClick={handleClose}
            className="email-popover-close"
            aria-label="Cerrar"
          >
            <X className="size-3.5" />
          </button>

          {view === 'menu' && (
            <div className="email-popover-menu">
              <p className="email-popover-address">{EMAIL}</p>
              <button
                type="button"
                onClick={handleCopy}
                className="email-popover-option"
              >
                {copied ? (
                  <Check className="size-4 text-green-600" />
                ) : (
                  <Copy className="size-4" />
                )}
                <span>{copied ? t.emailCopied : t.emailCopy}</span>
              </button>
              <button
                type="button"
                onClick={() => setView('form')}
                className="email-popover-option"
              >
                <Mail className="size-4" />
                <span>{t.emailSendMessage}</span>
              </button>
            </div>
          )}

          {view === 'form' && status !== 'sent' && (
            <form onSubmit={handleSend} className="email-popover-form" style={{ paddingTop: '24px' }}>
              <input
                type="email"
                placeholder={t.emailSenderPlaceholder}
                value={senderEmail}
                onChange={(e) => setSenderEmail(e.target.value)}
                className="email-popover-input"
                required
              />
              <textarea
                placeholder={t.emailMessagePlaceholder}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="email-popover-textarea"
                rows={4}
                required
              />
              {status === 'error' && (
                <p className="email-popover-error">{t.emailError}</p>
              )}
              <button
                type="submit"
                disabled={status === 'loading' || !senderEmail.trim() || !message.trim()}
                className="email-popover-send"
              >
                {status === 'loading' ? (
                  t.emailSending
                ) : (
                  <>
                    <Send className="size-4" />
                    {t.emailSendBtn}
                  </>
                )}
              </button>
            </form>
          )}

          {view === 'form' && status === 'sent' && (
            <div className="email-popover-success">
              <Check className="size-6 text-green-600" />
              <p>{t.emailSentTitle}</p>
              <span>{t.emailSentSubtitle}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
