'use server';

/**
 * @fileOverview Genkit tool for generating legal document drafts.
 */

import {ai, cleanJson} from '@/ai/genkit';
import { LegalDocumentInputSchema, LegalDocumentOutputSchema } from './types';

const documentGeneratorPrompt = ai.definePrompt({
  name: 'legalDocumentGeneratorPrompt',
  input: {schema: LegalDocumentInputSchema},
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are an AI assistant specialized in drafting initial legal documents related to Indian Cyber Law.

Document Type: {{{documentType}}}
Incident Details: {{{incidentDetails}}}
User Name: {{{userName}}}
User Contact: {{{userContact}}}
Accused Details: {{{accusedDetails}}}

Instructions:
1. Use professional Markdown formatting.
2. Include placeholders for missing info like [DATE].
3. Incorporate specific sections of the IT Act where applicable.
4. You MUST respond with a valid JSON object with a single key "generatedDocument". Do not include Markdown code blocks.

Example: { "generatedDocument": "## FIR Draft\\nTo, The Officer..." }
`,
});

export const legalDocumentGeneratorTool = ai.defineTool(
  {
    name: 'legalDocumentGeneratorTool',
    description: "Generates legal document drafts (FIR, Complaint Letter, Takedown Notice) based on incident details.",
    inputSchema: LegalDocumentInputSchema,
    outputSchema: LegalDocumentOutputSchema,
  },
  async (input) => {
    // Calling the prompt as a function for simple single-turn tool logic
    const { text } = await documentGeneratorPrompt(input);
    const cleanedText = cleanJson(text);
    try {
      const output = JSON.parse(cleanedText);
      return {
        generatedDocument: output.generatedDocument || text
      };
    } catch (e) {
      console.error("Document Tool Parse Error:", e, "Raw:", text);
      return {
        generatedDocument: text || "Failed to generate document."
      };
    }
  }
);
