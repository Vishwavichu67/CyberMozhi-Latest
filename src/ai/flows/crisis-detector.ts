/**
 * @fileOverview Crisis detection — CODE-ENFORCED, not prompt-requested.
 *
 * Why this file exists: relying on the LLM to "remember" to show empathy
 * and helpline numbers for distressing queries is probabilistic — it can
 * (and eventually will) forget, get truncated by a rate limit retry, or
 * simply generate a response that skips it. For a brand positioned as a
 * "legal guardian and friend," the safety message must ship every single
 * time a distress/crisis signal is detected, regardless of what the model
 * generates. This module runs as a pure, synchronous, in-memory check
 * BEFORE the Groq call — the resulting message is sent to the client as
 * its own guaranteed event, independent of the AI's streamed response.
 */

export type CrisisLevel = 'self_harm' | 'distress' | 'none';

export interface CrisisNotice {
  level: CrisisLevel;
  title: string;
  message: string; // bilingual — Tamil + English, matches chatbot's own format
}

// ── Self-harm / suicide risk — highest priority, checked first ─────────────
const SELF_HARM_PATTERNS = [
  /\b(suicide|suicidal)\b/i,
  /\b(kill myself|end my life|ending my life|end(ing)? it all)\b/i,
  /\b(want to die|wanna die|don'?t want to live)\b/i,
  /\b(no reason to live|better off dead|life is not worth)\b/i,
  /\bself[\s-]?harm(ing)?\b/i,
  /\b(hurt myself|harming myself)\b/i,
];

// ── Distress signals — sextortion, blackmail, active harassment/threats ────
const DISTRESS_PATTERNS = [
  /\bsextortion\b/i,
  /\bblackmail(ing)?\b/i,
  /\bextort(ing|ion)?\b/i,
  /\b(threatening|threatened) me\b/i,
  /\b(being|getting) harassed\b/i,
  /\bstalking me\b/i,
  /\b(scared|afraid|terrified|panicking)\b/i,
  /\bplease help( me)?\b/i,
  /\bi'?m (a )?victim\b/i,
  /\bnude(s)?\b.*\b(leak|share|post|send)/i,
  /\b(leak|share|post)\b.*\bnude(s)?\b/i,
];

export function detectCrisisLevel(query: string): CrisisLevel {
  if (SELF_HARM_PATTERNS.some(p => p.test(query))) return 'self_harm';
  if (DISTRESS_PATTERNS.some(p => p.test(query))) return 'distress';
  return 'none';
}

export function getCrisisNotice(level: CrisisLevel, tamilFirst = false): CrisisNotice | null {
  if (level === 'none') return null;

  if (level === 'self_harm') {
    const english = `You matter, and you don't have to go through this alone. Please reach out right now to a crisis helpline — trained counsellors are available 24/7:

**KIRAN Mental Health Helpline: 1800-599-0019** (toll-free, 24/7)
**iCall: 9152987821** (Mon–Sat, 8am–10pm)
**AASRA: 9820466726** (24/7)

If you're in immediate danger, please call **112** or go to your nearest hospital right now.

I'm here to help with any cyber law or online safety concerns whenever you're ready — but your safety comes first.`;
    const tamil = `நீங்கள் மதிப்புமிக்கவர், இதை தனியாக சமாளிக்க வேண்டாம். இப்போதே இந்த உதவி எண்களை தொடர்பு கொள்ளவும் — பயிற்சி பெற்ற ஆலோசகர்கள் 24/7 கிடைக்கின்றனர்:

**KIRAN மனநல உதவி எண்: 1800-599-0019** (இலவசம், 24/7)
**iCall: 9152987821** (திங்கள்–சனி, காலை 8 - இரவு 10)
**AASRA: 9820466726** (24/7)

உடனடி ஆபத்தில் இருந்தால், தயவுசெய்து **112** ஐ அழைக்கவும் அல்லது அருகிலுள்ள மருத்துவமனைக்கு உடனே செல்லவும்.

நீங்கள் தயாராக இருக்கும்போது சைபர் சட்டம் அல்லது ஆன்லைன் பாதுகாப்பு தொடர்பான எந்த கேள்விக்கும் நான் இங்கே இருக்கிறேன் — ஆனால் உங்கள் பாதுகாப்பே முதலில்.`;

    return {
      level,
      title: '💙 You are not alone',
      message: tamilFirst ? `${tamil}\n\n---\n\n${english}` : `${english}\n\n---\n\n${tamil}`,
    };
  }

  // level === 'distress'
  const english = `I'm really sorry you're going through this — what's happening to you is not your fault, and there is a clear path forward.

**Report immediately: National Cyber Crime Helpline — 1930** (toll-free, 24/7)
**Online:** cybercrime.gov.in

Do NOT pay any blackmail demand — it rarely stops the threat and can make things worse. Save all evidence (screenshots, messages, usernames) before reporting.

I'm here to walk you through exactly what to do next, including drafting a complaint if you need one.`;
  const tamil = `நீங்கள் இதை சந்திப்பது மிகவும் வருந்தத்தக்கது — இது உங்கள் தவறு அல்ல, மேலும் இதற்கு தெளிவான தீர்வு வழி உள்ளது.

**உடனடியாக புகார் அளிக்கவும்: தேசிய சைபர் கிரைம் உதவி எண் — 1930** (இலவசம், 24/7)
**ஆன்லைனில்:** cybercrime.gov.in

பிளாக்மெயில் தொகையை செலுத்த வேண்டாம் — இது அச்சுறுத்தலை நிறுத்தாது, மேலும் விஷயங்களை மோசமாக்கலாம். புகார் அளிக்கும் முன் அனைத்து ஆதாரங்களையும் (ஸ்கிரீன்ஷாட்கள், செய்திகள், பயனர்பெயர்கள்) சேமிக்கவும்.

அடுத்து என்ன செய்ய வேண்டும் என்பதை உங்களுக்கு வழிகாட்ட நான் இங்கே இருக்கிறேன், தேவைப்பட்டால் புகார் வரைவு செய்வதும் அடங்கும்.`;

  return {
    level,
    title: '🛡️ You are not alone — help is available',
    message: tamilFirst ? `${tamil}\n\n---\n\n${english}` : `${english}\n\n---\n\n${tamil}`,
  };
}