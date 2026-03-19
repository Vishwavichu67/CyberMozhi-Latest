'use server';
/**
 * @fileOverview Summarizes a cyber attack and provides relevant laws.
 */

import {ai, cleanJson} from '@/ai/genkit';
import {z} from 'genkit';

const CyberAttackInputSchema = z.object({
  description: z.string().describe('The description of the cyber attack.'),
});
export type CyberAttackInput = z.infer<typeof CyberAttackInputSchema>;

const CyberAttackOutputSchema = z.object({
  summary: z.string().describe('A summary of the cyber attack.'),
  relevantLaws: z.string().describe('The relevant Indian cyber laws applicable to the attack.'),
});
export type CyberAttackOutput = z.infer<typeof CyberAttackOutputSchema>;

export async function summarizeCyberAttack(input: CyberAttackInput): Promise<CyberAttackOutput> {
  return summarizeCyberAttackFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cyberAttackSummaryPrompt',
  input: {schema: CyberAttackInputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an expert in Indian Cyber Law. Given a description of a cyber attack, provide a summary of the attack and identify the relevant Indian cyber laws (IT Act 2000, IPC, etc.) that apply.

Description: {{{description}}}

Respond ONLY with a valid JSON object with two keys: "summary" and "relevantLaws". Do not include Markdown formatting.
`,
});

const summarizeCyberAttackFlow = ai.defineFlow(
  {
    name: 'summarizeCyberAttackFlow',
    inputSchema: CyberAttackInputSchema,
    outputSchema: CyberAttackOutputSchema,
  },
  async input => {
    const { text } = await prompt(input);
    const cleanedText = cleanJson(text);
    try {
      const output = JSON.parse(cleanedText);
      return {
        summary: output.summary || "Summary generation failed.",
        relevantLaws: output.relevantLaws || "No laws identified."
      };
    } catch(e) {
      console.error("Failed to parse cyber attack summary JSON:", e, "Raw:", text);
      return {
        summary: "Could not generate a summary due to a formatting error.",
        relevantLaws: "No laws could be identified."
      };
    }
  }
);
