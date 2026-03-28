import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import type { Locale } from '@/lib/translations';

export async function POST(req: Request) {
  const body = await req.json();
  const { texts, locale } = body as { texts: string[]; locale: Locale };

  const language = locale === 'es' ? 'Spanish' : 'English';

  const { text } = await generateText({
    model: anthropic('claude-haiku-4-5'),
    prompt: `Translate each of these texts to ${language}. Return ONLY a valid JSON array of strings in the same order. Preserve all markdown formatting (**, *, bullet lists, etc). Do not add any explanation or extra text outside the JSON array.\n\nTexts:\n${JSON.stringify(texts)}`,
  });

  const translated = JSON.parse(text.trim());
  return Response.json({ texts: translated });
}
