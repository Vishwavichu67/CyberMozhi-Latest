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
  // Desktop: sidebar open by default. Mobile: closed by default.
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

  // On mobile, close sidebar after selecting a chat
  const handleSelectChatSession = useCallback((sessionId: string | null) => {
    setChatSessionId(sessionId);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
    }
  }, []);

  const handleNewChat = useCallback(() => {
    setChatSessionId(null);
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setSidebarOpen(false);
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
    // h-full works because layout.tsx gives main min-h-0 + flex-1
    <div className="flex w-full h-full min-h-0">

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar
          Mobile: fixed overlay slides from left (z-50)
          Desktop: inline static column, toggled with md:hidden
      */}
      <aside className={cn(
        // Mobile: always fixed overlay
        'fixed inset-y-0 left-0 z-50 w-72 flex flex-col',
        'bg-background border-r border-border/40',
        'transition-transform duration-200 ease-in-out',
        // Desktop: static, participates in flex flow
        'md:static md:inset-auto md:z-auto md:flex-shrink-0',
        'md:transition-none',
        // Show/hide
        isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:-translate-x-full md:hidden',
      )}>
        <ChatHistorySidebar
          currentChatSessionId={chatSessionId}
          onSelectChatSession={handleSelectChatSession}
          onNewChat={handleNewChat}
        />
      </aside>

      {/* Chat area — takes all remaining width, strict height containment */}
      <div className="flex-1 flex flex-col min-w-0 min-h-0 overflow-hidden">
        <ChatInterface
          chatSessionId={chatSessionId}
          setChatSessionId={setChatSessionId}
          onToggleSidebar={() => setSidebarOpen(prev => !prev)}
          onNewChat={handleNewChat}
        />
      </div>
    </div>
  );
}