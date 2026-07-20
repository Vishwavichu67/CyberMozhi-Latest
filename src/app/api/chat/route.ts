/**
 * Streaming API route for CyberMozhi chatbot.
 * Path: src/app/api/chat/route.ts
 *
 * ARCHITECTURE:
 * - RAG runs first (sync, instant, in-memory)
 * - Groq stream opens immediately after
 * - Firestore (session, title, save) runs FULLY IN BACKGROUND
 * - First token reaches client in ~400ms on every message including first
 */

import { NextRequest } from 'next/server';
import { callGroqStream } from '@/ai/genkit';
import { buildCyberMozhiSystemPrompt, buildCyberMozhiUserPrompt } from '@/ai/flows/chatbot-prompts';
import { retrieveRelevantChunks, formatChunksAsContext } from '@/ai/flows/rag-retriever';
import { generateChatTitle } from '@/ai/flows/chat-title-generator';
import { admin, db } from '@/lib/firebase-admin';

const { Timestamp } = admin.firestore;

async function setupSessionAndSave(
  userId: string,
  query: string,
  incomingSessionId: string | null,
  fullResponse: Promise<string>
): Promise<string> {
  // Resolve or create session ID
  let chatSessionId = incomingSessionId;

  if (!chatSessionId) {
    const titleRes = await generateChatTitle({ query });
    const ref = await db.collection(`users/${userId}/chatSessions`).add({
      title: titleRes.title,
      userId,
      createdAt: Timestamp.now(),
      lastMessageAt: Timestamp.now(),
    });
    chatSessionId = ref.id;
  } else {
    await db.doc(`users/${userId}/chatSessions/${chatSessionId}`)
      .update({ lastMessageAt: Timestamp.now() })
      .catch(() => {});
  }

  // Save user message
  await db.collection(`users/${userId}/chatSessions/${chatSessionId}/messages`)
    .add({ role: 'user', text: query, timestamp: Timestamp.now() });

  // Wait for stream to finish, then save AI response
  const aiText = await fullResponse;
  if (aiText.trim()) {
    await db.collection(`users/${userId}/chatSessions/${chatSessionId}/messages`)
      .add({ role: 'model', text: aiText, timestamp: Timestamp.now() });
  }

  return chatSessionId;
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      query, userId, chatSessionId: incomingSessionId,
      chatHistory, userName, userDetails, isProfileIncomplete, tamilFirst,
    } = body;

    if (!query || !userId) {
      return new Response(JSON.stringify({ error: 'Missing query or userId' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    // ── Step 1: RAG — instant, in-memory ────────────────────────────────────
    const relevantChunks = retrieveRelevantChunks(query, 5);
    const ragContext = formatChunksAsContext(relevantChunks);

    const historyText = (chatHistory || [])
      .slice(-10)
      .map((m: { role: string; parts: { text: string }[] }) =>
        `${m.role === 'user' ? 'User' : 'CyberMozhi'}: ${m.parts.map(p => p.text).join(' ')}`
      ).join('\n');

    const systemPrompt = buildCyberMozhiSystemPrompt(tamilFirst === true);
    const userPrompt = buildCyberMozhiUserPrompt(
      { query, userName, userDetails, isProfileIncomplete, chatHistory, tamilFirst },
      ragContext,
      historyText
    );

    // ── Step 2: Open Groq stream — no Firestore blocking ────────────────────
    const groqStream = await callGroqStream(userPrompt, systemPrompt);

    // ── Step 3: Set up a resolver so Firestore can wait for full response ────
    let resolveFullResponse!: (text: string) => void;
    const fullResponsePromise = new Promise<string>(resolve => {
      resolveFullResponse = resolve;
    });

    // ── Step 4: Firestore runs completely in background ──────────────────────
    // It does NOT block the stream. It waits for fullResponsePromise to resolve.
    const sessionIdPromise = setupSessionAndSave(
      userId,
      query,
      incomingSessionId,
      fullResponsePromise
    ).catch(err => {
      console.error('[/api/chat] Firestore background error:', err);
      return incomingSessionId || 'unknown';
    });

    // ── Step 5: Stream tokens immediately ───────────────────────────────────
    const encoder = new TextEncoder();
    const decoder = new TextDecoder();
    let fullResponse = '';

    const readable = new ReadableStream({
      async start(controller) {
        const reader = groqStream.getReader();
        let buf = '';

        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buf += decoder.decode(value, { stream: true });
            const lines = buf.split('\n');
            buf = lines.pop() || '';

            for (const line of lines) {
              const t = line.trim();
              if (!t || t === 'data: [DONE]' || !t.startsWith('data: ')) continue;
              try {
                const json = JSON.parse(t.slice(6));
                const token = json.choices?.[0]?.delta?.content || '';
                if (token) {
                  fullResponse += token;
                  controller.enqueue(
                    encoder.encode(`data: ${JSON.stringify({ type: 'token', token })}\n\n`)
                  );
                }
              } catch { /* skip malformed */ }
            }
          }
        } finally {
          reader.releaseLock();
        }

        // Stream done — resolve so Firestore can save the full response
        resolveFullResponse(fullResponse);

        // Wait for session ID (Firestore may still be creating it)
        const chatSessionId = await sessionIdPromise;

        // Send session ID and done signal to client
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'session', chatSessionId })}\n\n`)
        );
        controller.enqueue(
          encoder.encode(`data: ${JSON.stringify({ type: 'done' })}\n\n`)
        );
        controller.close();
      },

      cancel() {
        // User navigated away mid-stream
        resolveFullResponse(fullResponse);
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });

  } catch (e: any) {
    console.error('[/api/chat]', e);
    return new Response(JSON.stringify({ error: e?.message || 'Unknown error' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}