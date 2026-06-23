import { genkit } from 'genkit';

/**
 * Genkit instance — no Google AI plugin needed.
 * All LLM calls go through Groq directly via fetch.
 * Firebase (Auth + Firestore) is unaffected — it uses its own keys.
 */
export const ai = genkit({ plugins: [] });

/**
 * Calls Groq API — LLaMA 3.3 70B, 30 RPM, free forever.
 * Uses OpenAI-compatible endpoint, no extra SDK needed.
 */
export async function callGroq(
  prompt: string,
  systemPrompt?: string
): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) throw new Error('GROQ_API_KEY is not set in .env');

  const messages: { role: string; content: string }[] = [];
  if (systemPrompt) messages.push({ role: 'system', content: systemPrompt });
  messages.push({ role: 'user', content: prompt });

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages,
      temperature: 0.7,
      max_tokens: 2048,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq API error ${response.status}: ${err}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content || '';
  if (!content) throw new Error('Groq returned empty response');
  return content;
}

/**
 * Strips markdown code fences before JSON.parse().
 */
export function cleanJson(text: string): string {
  if (!text) return '';
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}