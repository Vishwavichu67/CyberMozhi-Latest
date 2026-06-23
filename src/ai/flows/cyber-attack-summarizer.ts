'use server';

/**
 * @fileOverview Summarizes a cyber attack and lists applicable Indian laws.
 * Uses Groq LLaMA 3.3 — no Google AI dependency.
 */

import { ai, cleanJson, callGroq } from '@/ai/genkit';
import { z } from 'genkit';

const CyberAttackInputSchema = z.object({
  description: z.string().describe('Description of the cyber attack.'),
});
export type CyberAttackInput = z.infer<typeof CyberAttackInputSchema>;

const CyberAttackOutputSchema = z.object({
  summary: z.string(),
  relevantLaws: z.string(),
});
export type CyberAttackOutput = z.infer<typeof CyberAttackOutputSchema>;

export async function summarizeCyberAttack(
  input: CyberAttackInput
): Promise<CyberAttackOutput> {
  return summarizeCyberAttackFlow(input);
}

const summarizeCyberAttackFlow = ai.defineFlow(
  {
    name: 'summarizeCyberAttackFlow',
    inputSchema: CyberAttackInputSchema,
    outputSchema: CyberAttackOutputSchema,
  },
  async input => {
    try {
      const prompt = `You are an expert in Indian Cyber Law. Given this cyber attack description, provide:
1. A clear summary in simple language.
2. Specific applicable Indian laws with section numbers (IT Act 2000, IPC, DPDP Act 2023, etc.)

Description: ${input.description}

Respond ONLY with a valid JSON object with exactly two keys: "summary" and "relevantLaws". No markdown code fences.
Example: { "summary": "...", "relevantLaws": "Section 66C of IT Act 2000..." }`;

      const rawText = await callGroq(prompt);
      const output = JSON.parse(cleanJson(rawText));
      return {
        summary: output.summary || 'Summary not available.',
        relevantLaws: output.relevantLaws || 'No specific laws identified.',
      };
    } catch (e) {
      console.error('Cyber attack summarizer error:', e);
      return {
        summary: 'Could not generate a summary. Please try again.',
        relevantLaws: 'Could not identify applicable laws. Please try again.',
      };
    }
  }
);