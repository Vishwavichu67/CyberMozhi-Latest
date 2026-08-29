"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, CheckCircle, Search, Loader2, Copy, Check, ExternalLink, Phone } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

interface ScamResult {
  verdict: 'SCAM' | 'SUSPICIOUS' | 'SAFE';
  type: string;
  confidence: 'High' | 'Medium' | 'Low';
  explanation: string;
  redFlags: string[];
  whatToDo: string[];
  legalSection?: string;
}

const VERDICT_CONFIG = {
  SCAM: {
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    label: '🚨 This is a SCAM',
    labelColor: 'text-red-600 dark:text-red-400',
  },
  SUSPICIOUS: {
    color: 'text-yellow-600 dark:text-yellow-400',
    bg: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
    icon: AlertTriangle,
    iconColor: 'text-yellow-500',
    label: '⚠️ Looks Suspicious',
    labelColor: 'text-yellow-600 dark:text-yellow-400',
  },
  SAFE: {
    color: 'text-green-600 dark:text-green-400',
    bg: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
    icon: CheckCircle,
    iconColor: 'text-green-500',
    label: '✅ Appears Safe',
    labelColor: 'text-green-600 dark:text-green-400',
  },
};

const SCAM_EXAMPLES = [
  "Congratulations! You have won Rs. 50,000 in KBC lottery. Send your bank details to claim your prize.",
  "URGENT: Your SBI account will be blocked. Click here to update your KYC: bit.ly/sbi-kyc-update",
  "Hi, I'm from Amazon. Your package is on hold. Pay Rs. 299 customs fee via UPI: 9876543210@paytm",
];

export default function ScamCheckerPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState<ScamResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const analyzeScam = async () => {
    if (!input.trim() || isLoading) return;
    setIsLoading(true);
    setResult(null);
    setError(null);

    try {
      const response = await fetch('/api/scam-check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: input.trim() }),
      });

      if (!response.ok) {
        let friendlyMsg = 'Analysis failed. Please try again.';
        try {
          const errBody = await response.json();
          if (errBody?.error) friendlyMsg = errBody.error;
        } catch { /* body wasn't JSON, keep generic message */ }
        throw new Error(friendlyMsg);
      }
      const data = await response.json();
      setResult(data);
    } catch (e: any) {
      setError(e.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopy = async () => {
    if (!result) return;
    const text = `CyberMozhi Scam Check Result\n\nVerdict: ${result.verdict}\nType: ${result.type}\nExplanation: ${result.explanation}\n\nRed Flags:\n${result.redFlags.map(f => `• ${f}`).join('\n')}\n\nWhat To Do:\n${result.whatToDo.map(s => `• ${s}`).join('\n')}`;
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-3xl mx-auto">

      {/* Hero */}
      <motion.div initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8">
        <div className="inline-flex items-center justify-center h-16 w-16 rounded-2xl bg-primary/10 mb-4">
          <Shield className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Scam Checker</h1>
        <p className="text-muted-foreground text-sm max-w-lg mx-auto">
          Paste any suspicious message, email, or link. Our AI will instantly tell you if it's a scam and what to do.
        </p>
      </motion.div>

      {/* Input area */}
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
        className="bg-card border border-border rounded-2xl p-5 mb-4">
        <Textarea
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Paste the suspicious message, email content, or link here..."
          className="min-h-[120px] resize-none border-0 bg-transparent p-0 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
        />
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <span className="text-xs text-muted-foreground">{input.length} characters</span>
          <Button onClick={analyzeScam} disabled={!input.trim() || isLoading}
            className="gap-2">
            {isLoading
              ? <><Loader2 className="h-4 w-4 animate-spin" /> Analysing...</>
              : <><Search className="h-4 w-4" /> Check for Scam</>}
          </Button>
        </div>
      </motion.div>

      {/* Quick examples */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
        className="mb-6">
        <p className="text-xs text-muted-foreground mb-2">Try an example:</p>
        <div className="flex flex-col gap-2">
          {SCAM_EXAMPLES.map((ex, i) => (
            <button key={i}
              onClick={() => setInput(ex)}
              className="text-left text-xs px-3 py-2 rounded-lg border border-border/50 text-muted-foreground hover:text-foreground hover:border-primary/30 hover:bg-muted/30 transition-colors truncate">
              {ex}
            </button>
          ))}
        </div>
      </motion.div>

      {/* Error */}
      {error && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="flex items-start gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-xl p-4 mb-4">
          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
          {error}
        </motion.div>
      )}

      {/* Result */}
      <AnimatePresence>
        {result && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className={cn('border rounded-2xl p-5 space-y-5', VERDICT_CONFIG[result.verdict].bg)}>

            {/* Verdict header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className={cn('text-2xl font-bold', VERDICT_CONFIG[result.verdict].labelColor)}>
                  {VERDICT_CONFIG[result.verdict].label}
                </p>
                <p className="text-sm text-muted-foreground mt-1">
                  <span className="font-medium">{result.type}</span>
                  {' · '}Confidence: <span className="font-medium">{result.confidence}</span>
                </p>
              </div>
              <button onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-background text-muted-foreground hover:text-foreground transition-colors flex-shrink-0">
                {copied ? <><Check className="h-3 w-3 text-green-500" /> Copied</> : <><Copy className="h-3 w-3" /> Copy Result</>}
              </button>
            </div>

            {/* Explanation */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-1">What's happening?</p>
              <p className="text-sm text-foreground/80 leading-relaxed">{result.explanation}</p>
            </div>

            {/* Red flags */}
            {result.redFlags.length > 0 && (
              <div>
                <p className="text-sm font-semibold text-foreground mb-2">🚩 Red Flags</p>
                <ul className="space-y-1.5">
                  {result.redFlags.map((flag, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                      <span className="text-red-500 flex-shrink-0 mt-0.5">•</span>{flag}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* What to do */}
            <div>
              <p className="text-sm font-semibold text-foreground mb-2">✅ What To Do</p>
              <ul className="space-y-1.5">
                {result.whatToDo.map((step, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/80">
                    <span className="text-green-500 font-bold flex-shrink-0">{i + 1}.</span>{step}
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal section */}
            {result.legalSection && (
              <div className="bg-background/60 rounded-xl px-4 py-3 text-sm">
                <span className="font-semibold text-primary">Applicable Law: </span>
                <span className="text-foreground/80">{result.legalSection}</span>
              </div>
            )}

            {/* Report CTA */}
            {result.verdict !== 'SAFE' && (
              <div className="flex flex-wrap gap-2 pt-1 border-t border-border/30">
                <a href="https://cybercrime.gov.in" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 transition-colors">
                  <ExternalLink className="h-3 w-3" /> Report at cybercrime.gov.in
                </a>
                <a href="tel:1930"
                  className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border border-border bg-background text-foreground hover:bg-muted transition-colors">
                  <Phone className="h-3 w-3" /> Call 1930
                </a>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer note */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        AI analysis may not be 100% accurate. When in doubt, do not click links or share personal information.
      </p>
    </div>
  );
}