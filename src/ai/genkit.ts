import { genkit } from 'genkit';

/**
 * Genkit instance — no Google AI plugin.
 * All LLM calls go through Groq directly via fetch.
 */
export const ai = genkit({ plugins: [] });

/**
 * Calls Groq — returns full response string.
 * Used by: chat-title-generator, document-generator, cyber-attack-summarizer.
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
 * Calls Groq with streaming enabled.
 * Returns the raw ReadableStream from Groq's SSE response.
 * Used by: /api/chat/route.ts (streaming endpoint).
 */
export async function callGroqStream(
  prompt: string,
  systemPrompt?: string
): Promise<ReadableStream<Uint8Array>> {
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
      stream: true,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Groq stream error ${response.status}: ${err}`);
  }

  if (!response.body) throw new Error('No response body from Groq');
  return response.body;
}

/**
 * Strips markdown code fences before JSON.parse().
 */
export function cleanJson(text: string): string {
  if (!text) return '';
  return text.replace(/```json/g, '').replace(/```/g, '').trim();
}