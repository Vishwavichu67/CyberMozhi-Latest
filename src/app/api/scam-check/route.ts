/**
 * Scam Checker API Route
 * Path: src/app/api/scam-check/route.ts
 * Uses Groq LLaMA 3.3 to analyse suspicious messages
 */

import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { text } = await req.json();

    if (!text || text.trim().length < 5) {
      return new Response(JSON.stringify({ error: 'Please provide a message to analyse.' }), {
        status: 400, headers: { 'Content-Type': 'application/json' },
      });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'API key not configured.' }), {
        status: 500, headers: { 'Content-Type': 'application/json' },
      });
    }

    const prompt = `You are CyberMozhi's scam detection expert specialising in Indian cyber fraud patterns.

Analyse this message/content for scam indicators:
"""
${text.slice(0, 1000)}
"""

Common Indian scam types: KBC lottery, fake KYC, UPI fraud, job offer scam, investment fraud, sextortion, fake delivery fee, tech support scam, impersonation of banks/govt agencies, OTP theft.

Respond ONLY with a valid JSON object — no markdown, no code fences:
{
  "verdict": "SCAM" | "SUSPICIOUS" | "SAFE",
  "type": "short scam type name e.g. Lottery Scam / OTP Fraud / Safe Message",
  "confidence": "High" | "Medium" | "Low",
  "explanation": "2-3 sentence plain English explanation of what this is and why",
  "redFlags": ["flag 1", "flag 2", "flag 3"],
  "whatToDo": ["step 1", "step 2", "step 3"],
  "legalSection": "applicable Indian law section if scam, else null"
}

Rules:
- redFlags: empty array [] if SAFE
- whatToDo: always 2-4 practical steps
- legalSection: e.g. "Section 66D of IT Act 2000 (Cheating by impersonation)" or null
- Keep explanation simple — non-technical Indian user audience`;

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.3,
        max_tokens: 600,
      }),
    });

    if (response.status === 429) {
      const retryAfter = response.headers.get('retry-after');
      return new Response(
        JSON.stringify({
          error: "CyberMozhi's AI is handling a lot of requests right now. Please try again in a moment.",
          type: 'rate_limit',
          retryAfterSeconds: retryAfter ? Number(retryAfter) : undefined,
        }),
        {
          status: 429,
          headers: {
            'Content-Type': 'application/json',
            ...(retryAfter ? { 'Retry-After': retryAfter } : {}),
          },
        }
      );
    }

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Groq error: ${err}`);
    }

    const data = await response.json();
    const raw = data.choices?.[0]?.message?.content || '';
    const cleaned = raw.replace(/```json|```/g, '').trim();
    const result = JSON.parse(cleaned);

    return new Response(JSON.stringify(result), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (e: any) {
    console.error('[scam-check]', e);
    return new Response(JSON.stringify({ error: 'Analysis failed. Please try again.' }), {
      status: 500, headers: { 'Content-Type': 'application/json' },
    });
  }
}