"use client";

import { useState, useRef, useEffect, FormEvent, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Send, User, Sparkles, Loader2, Bot,
  MessageCircle, AlertCircle, Menu,
  FileSignature, ShieldQuestion, Gavel,
  Download, Copy, Check, Languages
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import type { ChatMessage as AIChatMessage } from '@/ai/flows/types';
import { db } from '@/lib/firebase';
import { doc, getDoc, collection, query, orderBy, onSnapshot, type Timestamp } from 'firebase/firestore';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
import { AnimatePresence, motion } from 'framer-motion';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// ── Types ─────────────────────────────────────────────────────────────────────
interface Message {
  id: string;
  text: string;
  role: 'user' | 'model';
  timestamp: string;
  isStreaming?: boolean;
}
interface FirestoreMessage { role: 'user' | 'model'; text: string; timestamp: Timestamp; }
interface UserDetails {
  displayName?: string; age?: number | null; gender?: string;
  preferredLanguage?: string; maritalStatus?: string; state?: string; city?: string;
}
interface ChatInterfaceProps {
  chatSessionId: string | null;
  setChatSessionId: (id: string) => void;
  onToggleSidebar: () => void;
  onNewChat: () => void;
}

// ── Streaming cursor ──────────────────────────────────────────────────────────
function StreamingCursor() {
  return <span className="inline-block w-0.5 h-4 bg-primary ml-0.5 animate-pulse align-middle" />;
}

// ── Markdown renderer ─────────────────────────────────────────────────────────
const MarkdownMessage = memo(function MarkdownMessage({ text }: { text: string }) {
  return (
    <ReactMarkdown
      className="prose prose-sm dark:prose-invert max-w-none break-words"
      remarkPlugins={[remarkGfm]}
      rehypePlugins={[rehypeRaw]}
      components={{
        p: ({ node, ...props }) => <p className="mb-2 last:mb-0 leading-relaxed" {...props} />,
        h2: ({ node, ...props }) => <h2 className="text-base font-bold mt-3 mb-1 text-primary" {...props} />,
        h3: ({ node, ...props }) => <h3 className="text-sm font-semibold mt-2 mb-1 text-foreground/90" {...props} />,
        ul: ({ node, ...props }) => <ul className="list-disc pl-4 mb-2 space-y-1" {...props} />,
        ol: ({ node, ...props }) => <ol className="list-decimal pl-4 mb-2 space-y-1" {...props} />,
        li: ({ node, ...props }) => <li className="text-sm" {...props} />,
        strong: ({ node, ...props }) => <strong className="text-primary font-bold" {...props} />,
        a: ({ node, ...props }) => <a className="text-primary hover:underline" target="_blank" rel="noopener noreferrer" {...props} />,
        hr: ({ node, ...props }) => <hr className="my-3 border-border/40" {...props} />,
        blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-primary/40 pl-3 italic text-muted-foreground my-2" {...props} />,
      }}
    >
      {text}
    </ReactMarkdown>
  );
});

// ── PDF Download ──────────────────────────────────────────────────────────────
// Detects if the AI message contains a legal document draft
function hasDocumentDraft(text: string): boolean {
  return /##\s*📄\s*Document Draft|##\s*Document Draft|First Information Report|Complaint Letter|Takedown Notice/i.test(text);
}

function downloadDocument(text: string) {
  const date = new Date().toLocaleDateString('en-IN', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  // Convert basic markdown to HTML for the PDF
  const body = text
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/^#### (.*$)/gm, '<h4>$1</h4>')
    .replace(/^### (.*$)/gm, '<h3>$1</h3>')
    .replace(/^## (.*$)/gm, '<h2>$1</h2>')
    .replace(/^# (.*$)/gm, '<h1>$1</h1>')
    .replace(/^---$/gm, '<hr>')
    .replace(/\n/g, '<br>');

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>CyberMozhi — Legal Document</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Times New Roman', Times, serif;
      font-size: 14px;
      line-height: 1.8;
      color: #111;
      max-width: 800px;
      margin: 0 auto;
      padding: 40px 40px;
    }
    .cm-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 2px solid #1a56db;
      padding-bottom: 12px;
      margin-bottom: 20px;
    }
    .cm-logo { font-size: 20px; font-weight: bold; color: #1a56db; letter-spacing: -0.5px; }
    .cm-date { font-size: 12px; color: #666; }
    .disclaimer {
      background: #fff8e1;
      border: 1px solid #f59e0b;
      border-left: 4px solid #f59e0b;
      padding: 10px 14px;
      border-radius: 4px;
      font-size: 12px;
      color: #92400e;
      margin-bottom: 24px;
    }
    h1 { font-size: 20px; color: #1a56db; margin: 16px 0 8px; }
    h2 { font-size: 17px; color: #1a56db; margin: 14px 0 6px; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; }
    h3 { font-size: 15px; color: #1e3a5f; margin: 12px 0 4px; }
    h4 { font-size: 14px; font-weight: bold; margin: 8px 0 4px; }
    br { display: block; margin: 2px 0; }
    strong { font-weight: bold; }
    hr { border: none; border-top: 1px solid #e5e7eb; margin: 16px 0; }
    .cm-footer {
      margin-top: 40px;
      padding-top: 12px;
      border-top: 1px solid #e5e7eb;
      font-size: 11px;
      color: #9ca3af;
      text-align: center;
    }
    @media print {
      body { padding: 20px; }
      .no-print { display: none; }
    }
  </style>
</head>
<body>
  <div class="cm-header">
    <div class="cm-logo">CyberMozhi</div>
    <div class="cm-date">Generated: ${date}</div>
  </div>
  <div class="disclaimer">
    ⚠️ <strong>DRAFT ONLY</strong> — This is an AI-generated draft for reference purposes.
    Please review with a qualified lawyer before submitting to any authority.
    Fill in all fields marked with [brackets] before use.
  </div>
  <div class="content">${body}</div>
  <div class="cm-footer">
    Generated by CyberMozhi — Your Indian Cyber Law Assistant &nbsp;|&nbsp; cybercrime.gov.in &nbsp;|&nbsp; Helpline: 1930
  </div>
</body>
</html>`;

  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `CyberMozhi-Document-${Date.now()}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

// ── Download button component ─────────────────────────────────────────────────
function DownloadButton({ text }: { text: string }) {
  const [downloading, setDownloading] = useState(false);

  const handleDownload = () => {
    setDownloading(true);
    try {
      downloadDocument(text);
    } finally {
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={downloading}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all',
        'border-primary/30 text-primary bg-primary/5 hover:bg-primary/10',
        downloading && 'opacity-60 cursor-not-allowed'
      )}
      title="Download document as HTML (open in browser → Ctrl+P to save as PDF)"
    >
      <Download className="h-3 w-3" />
      {downloading ? 'Downloading...' : 'Download Document'}
    </button>
  );
}

// ── Suggestions ───────────────────────────────────────────────────────────────

// ── Copy Button ───────────────────────────────────────────────────────────────
function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const el = document.createElement('textarea');
      el.value = text;
      el.style.position = 'fixed';
      el.style.opacity = '0';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <button
      onClick={handleCopy}
      className={cn(
        'inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-md border transition-all',
        copied
          ? 'border-green-500/30 text-green-600 bg-green-50 dark:bg-green-950/20'
          : 'border-border text-muted-foreground hover:text-foreground hover:bg-muted'
      )}
      title="Copy response"
    >
      {copied
        ? <><Check className="h-3 w-3" /> Copied!</>
        : <><Copy className="h-3 w-3" /> Copy</>}
    </button>
  );
}

const SUGGESTIONS = [
  { icon: FileSignature, title: 'Generate FIR Draft', prompt: 'Help me draft an FIR for an online financial fraud I experienced.' },
  { icon: ShieldQuestion, title: 'Explain a Term', prompt: "What is 'phishing' in simple terms and how can I avoid it?" },
  { icon: Gavel, title: 'Understand a Law', prompt: 'Explain Section 66C of the IT Act regarding identity theft.' },
  { icon: MessageCircle, title: 'Ask a Question', prompt: 'What are the first steps to take if my social media account is hacked?' },
];

function EmptyState({ onSuggestionClick }: { onSuggestionClick: (p: string) => void }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center h-full p-4">
      <MessageCircle className="w-14 h-14 mb-4 opacity-30 text-primary" />
      <h2 className="text-xl font-semibold mb-1">Start a Conversation</h2>
      <p className="text-muted-foreground text-sm text-center max-w-sm mb-6">
        Ask anything about Indian cyber law, or try a suggestion below.
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 w-full max-w-2xl">
        {SUGGESTIONS.map((s, i) => (
          <motion.div key={s.title} initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}>
            <Card className="cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => onSuggestionClick(s.prompt)} role="button" tabIndex={0}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onSuggestionClick(s.prompt); }}>
              <CardHeader className="flex-row items-center gap-3 p-4">
                <s.icon className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <CardTitle className="text-sm font-semibold">{s.title}</CardTitle>
                  <CardDescription className="text-xs line-clamp-1">{s.prompt}</CardDescription>
                </div>
              </CardHeader>
            </Card>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// ── Messages list ─────────────────────────────────────────────────────────────
function MessagesList({ messages, isSendingMessage }: { messages: Message[]; isSendingMessage: boolean }) {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isSendingMessage]);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:px-6 space-y-4">
      <AnimatePresence initial={false}>
        {messages.map(msg => (
          <motion.div key={msg.id} layout
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={cn('flex items-end gap-2.5 w-full', msg.role === 'user' ? 'justify-end' : 'justify-start')}>
            {msg.role === 'model' && (
              <Avatar className="h-8 w-8 flex-shrink-0 self-start shadow-sm">
                <AvatarFallback className="bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            )}
            <div className={cn('flex flex-col max-w-[82%] md:max-w-[76%]', msg.role === 'user' ? 'items-end' : 'items-start')}>
              <div className={cn('p-3 rounded-2xl shadow-sm',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground rounded-br-lg'
                  : 'bg-card border border-border/50 text-card-foreground rounded-bl-lg')}>
                {msg.role === 'user'
                  ? <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                  : (
                    msg.text
                      ? <><MarkdownMessage text={msg.text} />{msg.isStreaming && <StreamingCursor />}</>
                      : <StreamingCursor />
                  )
                }
              </div>

              {/* ── PDF Download button — shows only when doc draft detected ── */}
              {/* Action row — copy always shown, download only for documents */}
              {msg.role === 'model' && !msg.isStreaming && msg.text && (
                <div className="mt-1.5 px-1 flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <CopyButton text={msg.text} />
                    {hasDocumentDraft(msg.text) && <DownloadButton text={msg.text} />}
                  </div>
                  {hasDocumentDraft(msg.text) && (
                    <p className="text-[10px] text-muted-foreground ml-0.5">
                      Open the downloaded file → Ctrl+P → Save as PDF
                    </p>
                  )}
                </div>
              )}

              <span className="text-xs text-muted-foreground mt-1 px-1">{msg.timestamp}</span>
            </div>
            {msg.role === 'user' && (
              <Avatar className="h-8 w-8 flex-shrink-0 self-start shadow-sm">
                <AvatarFallback className="bg-accent text-accent-foreground"><User className="h-4 w-4" /></AvatarFallback>
              </Avatar>
            )}
          </motion.div>
        ))}

        {/* Typing dots */}
        {isSendingMessage && !messages.some(m => m.isStreaming) && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="flex items-end gap-2.5 justify-start">
            <Avatar className="h-8 w-8 flex-shrink-0 self-start shadow-sm">
              <AvatarFallback className="bg-primary text-primary-foreground"><Sparkles className="h-4 w-4" /></AvatarFallback>
            </Avatar>
            <div className="p-3 rounded-2xl shadow-sm bg-card border border-border/50 rounded-bl-lg">
              <div className="flex items-center space-x-1.5">
                {[0, 0.2, 0.4].map((d, i) => (
                  <span key={i} className="h-1.5 w-1.5 bg-muted-foreground rounded-full animate-pulse" style={{ animationDelay: `${d}s` }} />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Main ChatInterface ────────────────────────────────────────────────────────
export function ChatInterface({ chatSessionId, setChatSessionId, onToggleSidebar, onNewChat }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isProfileIncomplete, setIsProfileIncomplete] = useState(false);
  const [tamilFirst, setTamilFirst] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const messagesRef = useRef<Message[]>([]);
  useEffect(() => { messagesRef.current = messages; }, [messages]);

  const { toast } = useToast();
  const { user, loading: authLoading, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!user || !isLoggedIn) { setUserDetails(null); return; }
    getDoc(doc(db, 'users', user.uid)).then(snap => {
      if (snap.exists()) {
        const d = snap.data();
        setUserDetails(d as UserDetails);
        setIsProfileIncomplete(!d.state && !d.maritalStatus && !d.age);
        if (d.preferredLanguage === 'Tamil') setTamilFirst(true);
      } else {
        setUserDetails({ displayName: user.displayName || user.email?.split('@')[0] });
        setIsProfileIncomplete(true);
      }
    }).catch(() => { setUserDetails({ displayName: user.displayName || user.email?.split('@')[0] }); });
  }, [user, isLoggedIn]);

  useEffect(() => {
    if (!chatSessionId || !user) { setMessages([]); setIsLoading(false); return; }
    abortRef.current?.abort();
    setIsLoading(true);
    setError(null);

    const q = query(
      collection(db, `users/${user.uid}/chatSessions/${chatSessionId}/messages`),
      orderBy('timestamp')
    );
    const unsub = onSnapshot(q,
      snap => {
        if (!messagesRef.current.some(m => m.isStreaming)) {
          setMessages(snap.docs.map(d => {
            const data = d.data() as FirestoreMessage;
            return {
              id: d.id, role: data.role, text: data.text,
              timestamp: data.timestamp
                ? new Date(data.timestamp.seconds * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                : '',
            };
          }));
        }
        setIsLoading(false);
      },
      err => { setError('Failed to load chat. Try a new chat.'); setIsLoading(false); console.error(err); }
    );
    return () => unsub();
  }, [chatSessionId, user]);

  const handleSubmit = useCallback(async (e?: FormEvent<HTMLFormElement> | string) => {
    if (e && typeof e !== 'string') e.preventDefault();
    const queryText = typeof e === 'string' ? e : input;
    if (!queryText.trim() || isSendingMessage || authLoading) return;
    if (!isLoggedIn || !user) {
      toast({ variant: 'destructive', title: 'Login Required', description: 'Please log in.' });
      return;
    }

    if (typeof e !== 'string') setInput('');
    setIsSendingMessage(true);
    setError(null);

    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: `user-${Date.now()}`, text: queryText, role: 'user', timestamp: now }]);

    const history: AIChatMessage[] = messagesRef.current.slice(-20).map(m => ({
      role: m.role, parts: [{ text: m.text }],
    }));

    const streamId = `model-${Date.now()}`;
    let streamingBubbleAdded = false;
    abortRef.current = new AbortController();

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        signal: abortRef.current.signal,
        body: JSON.stringify({
          query: queryText,
          userId: user.uid,
          chatSessionId,
          chatHistory: history,
          userName: userDetails?.displayName || user.displayName || user.email?.split('@')[0],
          userContact: user.email || '',
          userDetails,
          isProfileIncomplete,
          tamilFirst,
        }),
      });

      if (!res.ok || !res.body) throw new Error(`Server error: ${res.status}`);

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buf = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buf += decoder.decode(value, { stream: true });
        const lines = buf.split('\n');
        buf = lines.pop() || '';

        for (const line of lines) {
          const t = line.trim();
          if (!t || !t.startsWith('data: ')) continue;
          try {
            const data = JSON.parse(t.slice(6));
            if (data.type === 'session' && data.chatSessionId && !chatSessionId) {
              setChatSessionId(data.chatSessionId);
            }
            if (data.type === 'token' && data.token) {
              if (!streamingBubbleAdded) {
                setMessages(prev => [...prev, { id: streamId, text: data.token, role: 'model', isStreaming: true, timestamp: now }]);
                streamingBubbleAdded = true;
              } else {
                setMessages(prev => prev.map(m => m.id === streamId ? { ...m, text: m.text + data.token } : m));
              }
            }
            if (data.type === 'done') {
              setMessages(prev => prev.map(m => m.id === streamId ? { ...m, isStreaming: false } : m));
            }
          } catch { /* skip malformed */ }
        }
      }
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      const msg = err instanceof Error ? err.message : 'Unexpected error.';
      setError(msg);
      setMessages(prev => prev.filter(m => m.id !== streamId));
      toast({ variant: 'destructive', title: 'Error', description: msg });
    } finally {
      setIsSendingMessage(false);
      abortRef.current = null;
    }
  }, [input, isSendingMessage, authLoading, isLoggedIn, user, chatSessionId,
      setChatSessionId, userDetails, isProfileIncomplete, toast, tamilFirst]);

  const showEmpty = !isLoading && !error && messages.length === 0;

  return (
    <div className="flex flex-col h-full bg-background overflow-hidden">
      <header className="flex-shrink-0 flex items-center p-3 border-b border-border/40 bg-background/95 backdrop-blur-sm">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="mr-2 md:hidden">
          <Menu className="h-5 w-5" /><span className="sr-only">Toggle sidebar</span>
        </Button>
        <Avatar className="h-9 w-9 mr-3">
          <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5" /></AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <h1 className="text-md font-bold text-primary">CyberMozhi</h1>
          <p className={cn('text-xs', isLoggedIn ? 'text-green-600' : 'text-destructive font-medium')}>
            {authLoading ? 'Connecting...' : isLoggedIn ? 'Online' : 'Offline — Please login'}
          </p>
        </div>
        {/* Tamil-first toggle */}
        <button
          onClick={() => setTamilFirst(prev => !prev)}
          className={cn(
            'flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full border transition-all mr-1',
            tamilFirst
              ? 'bg-primary text-primary-foreground border-primary'
              : 'border-border text-muted-foreground hover:border-primary hover:text-primary'
          )}
          title={tamilFirst ? 'Switch to English first' : 'Switch to Tamil first'}
        >
          <Languages className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{tamilFirst ? 'தமிழ் முதல்' : 'Tamil First'}</span>
        </button>
      </header>

      <div className="flex-1 overflow-hidden flex flex-col">
        {isLoading ? (
          <div className="flex items-center justify-center h-full gap-3 text-muted-foreground">
            <Loader2 className="w-6 h-6 animate-spin" /><p className="text-sm">Loading chat...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-full p-6 text-center gap-3 text-destructive">
            <AlertCircle className="w-10 h-10" /><p className="text-sm max-w-sm">{error}</p>
          </div>
        ) : showEmpty ? (
          <EmptyState onSuggestionClick={p => handleSubmit(p)} />
        ) : (
          <MessagesList messages={messages} isSendingMessage={isSendingMessage} />
        )}
      </div>

      <footer className="flex-shrink-0 border-t border-border/40 bg-background/95">
        <div className="p-2 sm:p-3">
          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <Textarea
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }}
              placeholder={authLoading ? 'Authenticating...' : !isLoggedIn ? 'Please log in to chat.' : 'Ask anything...'}
              className="flex-grow resize-none text-sm rounded-full py-2 px-4 max-h-24"
              rows={1}
              disabled={isSendingMessage || authLoading || !isLoggedIn || isLoading}
            />
            <Button type="submit" size="icon" className="h-10 w-10 rounded-full flex-shrink-0"
              disabled={isSendingMessage || authLoading || !isLoggedIn || !input.trim() || isLoading}>
              {isSendingMessage ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground text-center mt-2">
            CyberMozhi can make mistakes. Consider checking important information.
          </p>
        </div>
      </footer>
    </div>
  );
}