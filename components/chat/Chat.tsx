'use client';

import { useChat } from '@ai-sdk/react';
import { DefaultChatTransport } from 'ai';
import { useState, useEffect, useRef, useMemo } from 'react';
import { Message } from './Message';
import { TypingIndicator } from './TypingIndicator';
import { ChatInput } from './ChatInput';
import { suggestionRows } from '@/lib/suggestions';
import { useApp } from '@/context/AppContext';
import { useLanguage } from '@/context/LanguageContext';

interface ChatProps {
  initialQuestion?: string;
}

export function Chat({ initialQuestion }: ChatProps = {} as ChatProps) {
  const [input, setInput] = useState('');
  const initialSentRef = useRef(false);
  const autoSendBlockRef = useRef(false); // Evita doble envío (bug AI SDK #11024)
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const aiResponseStartRef = useRef<HTMLDivElement>(null);
  const prevStatusRef = useRef<string>('ready');
  const { addToChatHistory, consumePendingQuestion } = useApp();
  const { t, locale } = useLanguage();

  // Ref ensures transport always reads current locale when sending (fixes mid-chat language switch)
  const localeRef = useRef(locale);
  localeRef.current = locale;

  const transport = useMemo(
    () =>
      new DefaultChatTransport({
        api: '/api/chat',
        body: () => ({ locale: localeRef.current }),
      }),
    []
  );

  const { messages, sendMessage, status, error, regenerate } = useChat({
    transport,
    resume: false, // Evita bug activeResponse undefined (AI SDK #8531, #11024)
  });

  useEffect(() => {
    if (status !== 'ready' || autoSendBlockRef.current) return;
    const pending = consumePendingQuestion();
    if (pending) {
      autoSendBlockRef.current = true;
      addToChatHistory(pending);
      sendMessage({ text: pending });
      return;
    }
    if (initialQuestion && !initialSentRef.current && messages.length === 0) {
      initialSentRef.current = true;
      autoSendBlockRef.current = true;
      addToChatHistory(initialQuestion);
      sendMessage({ text: initialQuestion });
    }
  }, [status, consumePendingQuestion, addToChatHistory, sendMessage, initialQuestion, messages.length]);

  // Scroll inteligente: al enviar → muestra el indicador; al arrancar la respuesta → muestra el inicio
  useEffect(() => {
    const prev = prevStatusRef.current;
    prevStatusRef.current = status;

    if (status === 'submitted') {
      // Usuario acaba de enviar → scrollear al fondo para mostrar el typing indicator
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } else if (status === 'streaming' && prev === 'submitted') {
      // La IA empezó a responder → scrollear al inicio de la respuesta y quedarse ahí
      aiResponseStartRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // Durante streaming o cuando termina: no mover el scroll automáticamente
  }, [messages, status]);

  const handleSuggestionClick = (question: string) => {
    if (status === 'ready') {
      addToChatHistory(question);
      sendMessage({ text: question });
    }
  };

  const handleSubmit = () => {
    if (input.trim() && status === 'ready') {
      const text = input.trim();
      addToChatHistory(text);
      sendMessage({ text });
      setInput('');
    }
  };


  const getMessageContent = (message: { role: string; parts?: Array<{ type: string; text?: string }> }) => {
    if (message.parts) {
      return message.parts
        .filter((p): p is { type: string; text: string } => p.type === 'text' && 'text' in p)
        .map((p) => p.text)
        .join('');
    }
    return '';
  };

  if (messages.length === 0) {
    return (
      <div className="chat-welcome-screen">
        <p className="welcome-text text-center">
          {t.welcomeText}
        </p>
        <div className="flex flex-col gap-3 w-full max-w-2xl mx-auto">
          {suggestionRows.map((count, rowIndex) => {
            const start = suggestionRows.slice(0, rowIndex).reduce((a, b) => a + b, 0);
            const rowQuestions = t.suggestedQuestions.slice(start, start + count);
            return (
              <div key={rowIndex} className="flex gap-3 w-full justify-center flex-wrap">
                {rowQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => handleSuggestionClick(q)}
                    disabled={status !== 'ready'}
                    className="suggestion-btn disabled:opacity-50"
                  >
                    {q}
                  </button>
                ))}
              </div>
            );
          })}
        </div>
        <div className="w-full max-w-2xl mx-auto">
          <ChatInput
            value={input}
            onChange={setInput}
            onSubmit={handleSubmit}
            disabled={status !== 'ready'}
            placeholder={t.chatPlaceholder}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full min-h-0 flex-1">
      <div className="chat-messages flex-1 min-h-0 overflow-y-auto">
        {messages.map((message, index) => {
          const isLastAssistant = message.role === 'assistant' && index === messages.length - 1;
          return (
            <div key={`${message.id}-${index}`} ref={isLastAssistant ? aiResponseStartRef : undefined}>
              <Message
                role={message.role as 'user' | 'assistant'}
                content={getMessageContent(message)}
                index={index}
              />
            </div>
          );
        })}

        {(status === 'submitted' || status === 'streaming') && <TypingIndicator />}

        <div ref={messagesEndRef} />

        {error && (
          <div className="max-w-2xl mx-auto px-4 py-3 bg-red-500/10 border border-red-500/20 text-red-400 body-sm my-4">
            <p>{error.message || t.errorMessage}</p>
            <button
              onClick={() => regenerate({ body: { locale } })}
              className="mt-2 text-g1 hover:underline"
            >
              {t.retry}
            </button>
          </div>
        )}
      </div>
      <ChatInput
        value={input}
        onChange={setInput}
        onSubmit={handleSubmit}
        disabled={status !== 'ready'}
        placeholder={t.chatPlaceholder}
      />
    </div>
  );
}
