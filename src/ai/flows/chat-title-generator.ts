'use server';

/**
 * @fileOverview Generates a short chat session title using Groq LLaMA 3.3.
 * No Google AI dependency.
 */

import { ai, cleanJson, callGroq } from '@/ai/genkit';
import { z } from 'genkit';

const ChatTitleInputSchema = z.object({
  query: z.string().describe('The first user message in a new chat session.'),
});
export type ChatTitleInput = z.infer<typeof ChatTitleInputSchema>;

const ChatTitleOutputSchema = z.object({
  title: z.string().describe('A short title, max 5 words.'),
});
export type ChatTitleOutput = z.infer<typeof ChatTitleOutputSchema>;

export async function generateChatTitle(
  input: ChatTitleInput
): Promise<ChatTitleOutput> {
  return generateChatTitleFlow(input);
}

const generateChatTitleFlow = ai.defineFlow(
  {
    name: 'generateChatTitleFlow',
    inputSchema: ChatTitleInputSchema,
    outputSchema: ChatTitleOutputSchema,
  },
  async input => {
    try {
      const prompt = `Based on this user query about Indian cyber law or cybersecurity, generate a short chat session title. Maximum 5 words. Simple English only.

User Query: ${input.query}

Respond ONLY with a valid JSON object: { "title": "..." }. No markdown code fences.
Example: { "title": "Identity Theft Help" }`;

      const rawText = await callGroq(prompt);
      const output = JSON.parse(cleanJson(rawText));
      return { title: output.title || input.query.substring(0, 30) };
    } catch (e) {
      console.error('Chat title error:', e);
      return { title: input.query.substring(0, 40) };
    }
  }
);