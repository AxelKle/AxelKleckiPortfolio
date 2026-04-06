import { generateText } from 'ai';
import { anthropic } from '@ai-sdk/anthropic';
import type { Locale } from '@/lib/translations';

export async function POST(req: Request) {
  const body = await req.json();
  const { texts, locale } = body as { texts: string[]; locale: Locale };

  // Filter out empty strings, only translate non-empty ones
  const nonEmptyIndices: number[] = [];
  const nonEmptyTexts: string[] = [];
  texts.forEach((t, i) => {
    if (t.trim()) {
      nonEmptyIndices.push(i);
      nonEmptyTexts.push(t);
    }
  });

  if (nonEmptyTexts.length === 0) {
    return Response.json({ texts });
  }

  const language = locale === 'es' ? 'Spanish' : 'English';

  try {
    const { text } = await generateText({
      model: anthropic('claude-haiku-4-5'),
      prompt: `Translate each of these texts to ${language}. Return ONLY a valid JSON array of strings in the same order, with no extra text or explanation. Preserve all formatting.\n\nTexts:\n${JSON.stringify(nonEmptyTexts)}`,
    });

    const match = text.match(/\[[\s\S]*\]/);
    if (!match) throw new Error('No JSON array found in response');
    const translated: string[] = JSON.parse(match[0]);

    const result = [...texts];
    nonEmptyIndices.forEach((originalIdx, translatedIdx) => {
      result[originalIdx] = translated[translatedIdx] ?? texts[originalIdx];
    });

    return Response.json({ texts: result });
  } catch {
    // Fallback: return originals unchanged
    return Response.json({ texts });
  }
}
