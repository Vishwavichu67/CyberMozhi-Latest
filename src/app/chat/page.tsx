"use client";

import { useCallback, useState } from 'react';
import { ChatHistorySidebar } from '@/components/chatbot/ChatHistorySidebar';
import { ChatInterface } from '@/components/chatbot/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const [chatSessionId, setChatSessionId] = useState<string | null>(null);

  // Separate state for mobile overlay vs desktop panel
  const [mobileOpen, setMobileOpen] = useState(false);      // mobile overlay
  const [desktopOpen, setDesktopOpen] = useState(true);     // desktop inline panel

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  const handleSelectChatSession = useCallback((sessionId: string | null) => {
    setChatSessionId(sessionId);
    setMobileOpen(false); // always close mobile overlay after selection
  }, []);

  const handleNewChat = useCallback(() => {
    setChatSessionId(null);
    setMobileOpen(false);
  }, []);

  const handleToggleSidebar = useCallback(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setMobileOpen(prev => !prev);   // mobile: toggle overlay
    } else {
      setDesktopOpen(prev => !prev);  // desktop: toggle inline panel
    }
  }, []);

  if (loading || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex w-full h-full overflow-hidden">

      {/* Mobile backdrop — only when overlay is open */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/*
        SIDEBAR
        ───────
        Mobile (<768px):
          - Always fixed overlay (z-50)
          - Controlled by mobileOpen: slides in/out with translate-x
          - Never affects desktop layout

        Desktop (≥768px):
          - Static flex column, part of the page flow
          - Controlled by desktopOpen: collapses with w-0 / hidden
          - Never uses translate (avoids md:hidden conflict)
      */}

      {/* MOBILE sidebar — fixed overlay, hidden on desktop */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-50 w-72 flex flex-col',
        'bg-background border-r border-border/40',
        'transition-transform duration-200 ease-in-out',
        'md:hidden', // never shows on desktop
        mobileOpen ? 'translate-x-0' : '-translate-x-full'
      )}>
        <ChatHistorySidebar
          currentChatSessionId={chatSessionId}
          onSelectChatSession={handleSelectChatSession}
          onNewChat={handleNewChat}
        />
      </aside>

      {/* DESKTOP sidebar — static inline, hidden on mobile */}
      <aside className={cn(
        'hidden md:flex flex-col flex-shrink-0',
        'bg-background border-r border-border/40',
        'transition-all duration-200 ease-in-out',
        desktopOpen ? 'w-72' : 'w-0 overflow-hidden border-r-0'
      )}>
        <ChatHistorySidebar
          currentChatSessionId={chatSessionId}
          onSelectChatSession={handleSelectChatSession}
          onNewChat={handleNewChat}
        />
      </aside>

      {/* Chat area — fills remaining width */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <ChatInterface
          chatSessionId={chatSessionId}
          setChatSessionId={setChatSessionId}
          onToggleSidebar={handleToggleSidebar}
          onNewChat={handleNewChat}
        />
      </div>
    </div>
  );
}