'use server';

/**
 * @fileOverview A Genkit flow to generate a concise title for a new chat session.
 */

import { ai, cleanJson } from '@/ai/genkit';
import { z } from 'genkit';

const ChatTitleInputSchema = z.object({
  query: z.string().describe('The first message from the user in a new chat session.'),
});
export type ChatTitleInput = z.infer<typeof ChatTitleInputSchema>;

const ChatTitleOutputSchema = z.object({
  title: z.string().describe('A short, relevant title for the chat session, no more than 5 words.'),
});
export type ChatTitleOutput = z.infer<typeof ChatTitleOutputSchema>;

export async function generateChatTitle(input: ChatTitleInput): Promise<ChatTitleOutput> {
  return generateChatTitleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'chatTitlePrompt',
  input: { schema: ChatTitleInputSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `Based on the following user query, generate a short, relevant title for the chat session. The title should be a maximum of 5 words.

User Query: {{{query}}}

Respond ONLY with a valid JSON object containing a single key "title". Do not include Markdown code blocks.
Example: { "title": "Identity Theft Help" }
`,
});

const generateChatTitleFlow = ai.defineFlow(
  {
    name: 'generateChatTitleFlow',
    inputSchema: ChatTitleInputSchema,
    outputSchema: ChatTitleOutputSchema,
  },
  async (input) => {
    const { text } = await prompt(input);
    const cleanedText = cleanJson(text);

    try {
      const output = JSON.parse(cleanedText);
      return { title: output.title || input.query.substring(0, 30) };
    } catch (e) {
      console.error("Failed to parse chat title JSON:", e, "Raw:", text);
      const fallbackTitle = input.query.substring(0, 40) + (input.query.length > 40 ? '...' : '');
      return { title: fallbackTitle };
    }
  }
);
