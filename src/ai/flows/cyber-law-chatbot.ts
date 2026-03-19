'use server';

/**
 * @fileOverview Bilingual chatbot flow for Indian Cyber Law and Cybersecurity.
 */

import { ai, cleanJson } from '@/ai/genkit';
import { legalDocumentGeneratorTool } from './document-generator';
import {
  CyberLawChatbotInputSchema,
  CyberLawChatbotOutputSchema,
  type CyberLawChatbotInput,
  type CyberLawChatbotOutput
} from './types';

export async function cyberLawChatbot(input: CyberLawChatbotInput): Promise<CyberLawChatbotOutput> {
  return cyberLawChatbotFlow(input);
}

const prompt = ai.definePrompt({
  name: 'cyberLawChatbotPrompt',
  input: { schema: CyberLawChatbotInputSchema },
  model: 'googleai/gemini-1.5-flash',
  prompt: `You are CyberMozhi, an expert AI assistant specializing in Indian Cyber Law (IT Act 2000, IPC, and DPDP Act 2023).

Role: Provide layman-friendly legal guidance and cybersecurity mitigation steps.

Bilingual Requirement:
1. Every major point MUST be presented in both Tamil and English.
2. Structure your answer clearly with Markdown.
3. Use bold for legal sections like **Section 66C**.

User Greeting:
{{#if userName}}
Vanakkam {{userName}}!
{{/if}}

Specific Instructions:
- If the user describes a crime and needs an FIR, Complaint Letter, or Takedown Notice, you MUST use the legalDocumentGeneratorTool.
- You MUST respond with a valid JSON object with a single key "answer". Do not include Markdown code blocks like \`\`\`json in your response.

User Query: {{{query}}}

History:
{{{chatHistory}}}

Required Response Format (JSON):
{
  "answer": "## Response Summary\\n\\n### Tamil (தமிழ்)\\n[Detailed explanation in Tamil]\\n\\n### English\\n[Detailed explanation in English]"
}
`,
});

const cyberLawChatbotFlow = ai.defineFlow(
  {
    name: 'cyberLawChatbotFlow',
    inputSchema: CyberLawChatbotInputSchema,
    outputSchema: CyberLawChatbotOutputSchema,
  },
  async (input: CyberLawChatbotInput): Promise<CyberLawChatbotOutput> => {
    try {
      // Step 1: Render the prompt to get the messages
      // Passing input directly as it matches the schema
      const rendered = await prompt.render(input);

      // Step 2: Use ai.generate with explicit parameters
      const result = await ai.generate({
        model: 'googleai/gemini-1.5-flash',
        prompt: rendered.messages,
        tools: [legalDocumentGeneratorTool],
        config: {
          temperature: 0.7,
        }
      });
      
      const rawText = result.text;
      const cleanedText = cleanJson(rawText);
      
      try {
        const output = JSON.parse(cleanedText);
        return { answer: output.answer || rawText };
      } catch (e) {
         console.error("Chatbot Parse Error:", e, "Raw:", rawText);
         return { answer: rawText };
      }
    } catch (e: any) {
      console.error("Flow Error:", e);
      return { answer: "I encountered an error. Please try again later. " + (e.message || "") };
    }
  }
);
