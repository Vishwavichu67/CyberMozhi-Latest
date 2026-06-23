'use server';

/**
 * @fileOverview Bilingual RAG chatbot for Indian Cyber Law and Cybersecurity.
 * LLM: Groq LLaMA 3.3 70B — 30 RPM, 14,400 req/day, free forever.
 * No Google AI dependency — completely separate from Firebase project keys.
 */

import { ai, cleanJson, callGroq } from '@/ai/genkit';
import { retrieveRelevantChunks, formatChunksAsContext } from './rag-retriever';
import {
  CyberLawChatbotInputSchema,
  CyberLawChatbotOutputSchema,
  type CyberLawChatbotInput,
  type CyberLawChatbotOutput,
} from './types';

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseAnswer(rawText: string): string {
  try {
    const output = JSON.parse(cleanJson(rawText));
    return output.answer || rawText;
  } catch {
    // If JSON parse fails, return raw text — still useful
    return rawText;
  }
}

function buildPrompt(
  input: CyberLawChatbotInput,
  ragContext: string,
  historyText: string
): string {
  const userContext = input.userDetails
    ? [
        input.userDetails.gender,
        input.userDetails.age ? `age ${input.userDetails.age}` : null,
        input.userDetails.state,
        input.userDetails.city,
        input.userDetails.preferredLanguage
          ? `prefers ${input.userDetails.preferredLanguage}`
          : null,
      ]
        .filter(Boolean)
        .join(', ')
    : '';

  const needsDocument =
    /\b(fir|complaint|letter|takedown|notice|draft|generate|write|file|police)\b/i.test(
      input.query
    );

  return `${input.userName ? `Vanakkam ${input.userName}! ` : ''}${userContext ? `User profile: ${userContext}.` : ''}
${input.isProfileIncomplete ? 'Note: Gently encourage this user to complete their profile.' : ''}

RELEVANT KNOWLEDGE FROM CYBERMOZHI DATABASE:
${ragContext}

INSTRUCTIONS:
1. Answer PRIMARILY from the CyberMozhi knowledge above. Cite specifically (e.g. "As per Section 66C of the IT Act...").
2. If the database has no relevant info, use general knowledge but clearly say "Based on my general knowledge:".
3. Every major point MUST appear in BOTH Tamil and English using Markdown headings (### Tamil / ### English).
4. Use bold for legal sections like **Section 66C** and **IT Act 2000**.
5. Keep language simple — explain as if talking to a non-lawyer.
6. End every response with a "### அடுத்த படிகள் / Next Steps" section in both languages.
${needsDocument
    ? `7. The user needs a legal document. Include a fully drafted FIR, Complaint Letter, or Takedown Notice as a Markdown section titled "## Document Draft".`
    : ''}
8. Respond ONLY with a valid JSON object: { "answer": "..." }
   - Single string value with all Markdown inside it.
   - Do NOT wrap in code fences like \`\`\`json.
   - Use \\n for line breaks inside the JSON string.

CONVERSATION HISTORY:
${historyText || 'No previous conversation.'}

USER QUESTION: ${input.query}`;
}

// ── Main flow ─────────────────────────────────────────────────────────────────

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
      // Step 1: RAG — retrieve relevant chunks from CyberMozhi's data
      const relevantChunks = retrieveRelevantChunks(input.query, 5);
      const ragContext = formatChunksAsContext(relevantChunks);

      // Step 2: Build chat history
      const historyText = (input.chatHistory || [])
        .slice(-10)
        .map(m =>
          `${m.role === 'user' ? 'User' : 'CyberMozhi'}: ${m.parts
            .map(p => p.text)
            .join(' ')}`
        )
        .join('\n');

      // Step 3: Build prompt
      const userPrompt = buildPrompt(input, ragContext, historyText);

      const systemPrompt = `You are CyberMozhi, an expert AI assistant for Indian Cyber Law and Cybersecurity, built to help common people in India understand their digital rights. You always respond in both Tamil and English. You always respond with a valid JSON object containing a single "answer" key.`;

      // Step 4: Call Groq — completely separate from Firebase keys
      console.log('[CyberMozhi] Calling Groq LLaMA 3.3...');
      const rawText = await callGroq(userPrompt, systemPrompt);
      console.log('[CyberMozhi] Groq responded successfully.');

      return { answer: parseAnswer(rawText) };

    } catch (e: any) {
      console.error('[CyberMozhi] Flow Error:', e);
      const msg = e?.message || '';

      if (msg.includes('429') || msg.includes('rate_limit')) {
        return {
          answer:
            '⏳ The AI is receiving too many requests. Please wait 1 minute and try again.',
        };
      }
      if (msg.includes('GROQ_API_KEY')) {
        return {
          answer:
            '🔑 Groq API key is missing. Please add GROQ_API_KEY to your .env file.',
        };
      }
      if (msg.includes('401') || msg.includes('invalid_api_key')) {
        return {
          answer:
            '🔑 Invalid Groq API key. Please check your GROQ_API_KEY in the .env file.',
        };
      }
      return {
        answer: '❌ I encountered an error processing your request. Please try again.',
      };
    }
  }
);