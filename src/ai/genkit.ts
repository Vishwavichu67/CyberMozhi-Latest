import { genkit } from 'genkit';
import { googleAI } from '@genkit-ai/google-genai';

/**
 * Initialize Genkit with the Google AI plugin.
 * Next.js automatically loads the .env file.
 * Using stable v1 API for Gemini 1.5 Flash.
 */
export const ai = genkit({
  plugins: [
    googleAI({ apiVersion: 'v1' }),
  ],
});

/**
 * Helper to clean AI response text that might be wrapped in Markdown code blocks.
 * This is used to extract valid JSON strings before parsing.
 */
export function cleanJson(text: string): string {
  if (!text) return '';
  return text
    .replace(/```json/g, '')
    .replace(/```/g, '')
    .trim();
}
