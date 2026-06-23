'use server';

/**
 * @fileOverview Generates legal document drafts using Groq LLaMA 3.3.
 * No Google AI dependency.
 */

import { ai, cleanJson, callGroq } from '@/ai/genkit';
import { LegalDocumentInputSchema, LegalDocumentOutputSchema } from './types';

export const legalDocumentGeneratorTool = ai.defineTool(
  {
    name: 'legalDocumentGeneratorTool',
    description:
      "Generates legal document drafts (FIR, Complaint Letter, Takedown Notice) based on the user's incident details.",
    inputSchema: LegalDocumentInputSchema,
    outputSchema: LegalDocumentOutputSchema,
  },
  async input => {
    try {
      const prompt = `Generate a ${input.documentType} legal document draft for an Indian cyber crime case.

Document Type: ${input.documentType}
Incident Details: ${input.incidentDetails}
User Name: ${input.userName || '[Your Name]'}
User Contact: ${input.userContact || '[Your Contact]'}
Accused Details: ${input.accusedDetails || 'Unknown'}

Instructions:
1. Use professional Markdown formatting with clear sections.
2. Include placeholders like [DATE], [POLICE STATION NAME], [JURISDICTION] for missing info.
3. Incorporate specific sections of the IT Act 2000 or IPC where applicable.
4. Add this disclaimer at the top: "DRAFT ONLY — Review with a qualified lawyer before submitting."
5. Respond ONLY with a valid JSON object: { "generatedDocument": "..." }. No markdown code fences.`;

      const rawText = await callGroq(prompt);
      const output = JSON.parse(cleanJson(rawText));
      return { generatedDocument: output.generatedDocument || rawText };
    } catch (e) {
      console.error('Document Tool Error:', e);
      return {
        generatedDocument:
          '> **Error:** Could not generate document. Please describe your incident again.',
      };
    }
  }
);