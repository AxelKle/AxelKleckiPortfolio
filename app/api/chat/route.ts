import { streamText } from 'ai';
import { convertToModelMessages } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import { getSystemPrompt } from '@/lib/systemPrompt';
import type { Locale } from '@/lib/translations';
export const maxDuration = 60;

export async function POST(req: Request) {
  try {
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('Chat API: ANTHROPIC_API_KEY is not set');
      return Response.json(
        {
          error: 'API key not configured. Add ANTHROPIC_API_KEY to .env.local',
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { messages, locale } = body as { messages?: unknown[]; locale?: string };

    if (!messages || !Array.isArray(messages)) {
      return Response.json(
        { error: 'Messages are required' },
        { status: 400 }
      );
    }

    const validLocale: Locale = locale === 'es' || locale === 'en' ? locale : 'en';
    const systemPrompt = getSystemPrompt(validLocale);

    // Track user message in PostHog via direct API call
    console.log('POSTHOG_API_KEY present:', !!process.env.POSTHOG_API_KEY);
    if (process.env.POSTHOG_API_KEY) {
      const lastUserMsg = [...messages].reverse().find((m: any) => m.role === 'user');
      const userText = lastUserMsg
        ? typeof lastUserMsg.content === 'string'
          ? lastUserMsg.content
          : Array.isArray(lastUserMsg.content)
          ? lastUserMsg.content.find((p: any) => p.type === 'text')?.text ?? ''
          : ''
        : '';

      if (userText) {
        try {
          const phRes = await fetch('https://us.i.posthog.com/capture/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: process.env.POSTHOG_API_KEY,
              event: 'chat_message',
              distinct_id: 'portfolio-visitor',
              properties: { message: userText, locale: validLocale, turn: messages.filter((m: any) => m.role === 'user').length },
            }),
          });
          console.log('PostHog response:', phRes.status, await phRes.text());
        } catch (e) {
          console.error('PostHog capture failed:', e);
        }
      }
    }

    const result = streamText({
      model: anthropic('claude-haiku-4-5'),
      system: systemPrompt,
      messages: await convertToModelMessages(messages),
      abortSignal: req.signal,
    });

    return result.toUIMessageStreamResponse({
      getErrorMessage: (err: unknown) => {
        if (err == null) return 'Unknown error';
        if (typeof err === 'string') return err;
        if (err instanceof Error) return err.message;
        return JSON.stringify(err);
      },
    });
  } catch (error) {
    const err = error instanceof Error ? error : new Error(String(error));
    console.error('Chat API error:', err.message, err);
    return Response.json(
      {
        error:
          process.env.NODE_ENV === 'development'
            ? `Error: ${err.message}`
            : 'Something went wrong. Please try again.',
      },
      { status: 500 }
    );
  }
}
