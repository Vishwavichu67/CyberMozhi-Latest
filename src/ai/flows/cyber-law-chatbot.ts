'use server';

/**
 * @fileOverview CyberMozhi chatbot flow — server actions only.
 * Prompt builders live in chatbot-prompts.ts (no 'use server').
 * Primary path: /api/chat/route.ts (streaming).
 * This file is used by actions.ts as a non-streaming fallback.
 */

import { ai, callGroq } from '@/ai/genkit';
import { retrieveRelevantChunks, formatChunksAsContext } from './rag-retriever';
import { buildCyberMozhiSystemPrompt, buildCyberMozhiUserPrompt } from './chatbot-prompts';
import {
  CyberLawChatbotInputSchema,
  CyberLawChatbotOutputSchema,
  type CyberLawChatbotInput,
  type CyberLawChatbotOutput,
} from './types';

export async function cyberLawChatbot(
  input: CyberLawChatbotInput
): Promise<CyberLawChatbotOutput> {
  return cyberLawChatbotFlow(input);
}

const cyberLawChatbotFlow = ai.defineFlow(
  {
    name: 'cyberLawChatbotFlow',
    inputSchema: CyberLawChatbotInputSchema,
    outputSchema: CyberLawChatbotOutputSchema,
  },
  async (input: CyberLawChatbotInput): Promise<CyberLawChatbotOutput> => {
    try {
      const relevantChunks = retrieveRelevantChunks(input.query, 5);
      const ragContext = formatChunksAsContext(relevantChunks);

      const historyText = (input.chatHistory || [])
        .slice(-10)
        .map(m => `${m.role === 'user' ? 'User' : 'CyberMozhi'}: ${m.parts.map(p => p.text).join(' ')}`)
        .join('\n');

      const systemPrompt = buildCyberMozhiSystemPrompt();
      const userPrompt = buildCyberMozhiUserPrompt(input, ragContext, historyText);

      console.log('[CyberMozhi] Calling Groq...');
      const answer = await callGroq(userPrompt, systemPrompt);
      console.log('[CyberMozhi] Done.');

      return { answer };

    } catch (e: any) {
      console.error('[CyberMozhi] Error:', e);
      const msg = e?.message || '';
      if (msg.includes('429') || msg.includes('rate_limit')) {
        return { answer: '⏳ Too many requests. Please wait a moment and try again.' };
      }
      if (msg.includes('GROQ_API_KEY') || msg.includes('401')) {
        return { answer: '🔑 API key issue. Please check your GROQ_API_KEY in .env.' };
      }
      return { answer: '❌ Something went wrong. Please try again.' };
    }
  }
);