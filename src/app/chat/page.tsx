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
  const [isSidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    if (!loading && !user) router.push('/login');
  }, [user, loading, router]);

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
    <div className="flex w-full h-full overflow-hidden">

      {/* Mobile backdrop */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar
          Mobile: fixed overlay (z-50), slides from left
          Desktop: static inline column, toggled by removing from layout
          Width: w-72 (288px) — enough for title + ⋮ button
      */}
      <aside className={cn(
        // Mobile: fixed overlay
        'fixed inset-y-0 left-0 z-50 w-72',
        'bg-background border-r border-border/40',
        'transition-transform duration-200 ease-in-out',
        // Desktop: static, participates in flex layout
        'md:static md:inset-auto md:z-auto md:w-72',
        'md:flex md:flex-col md:flex-shrink-0',
        'md:transition-none',
        // Toggle visibility
        isSidebarOpen
          ? 'translate-x-0'
          : '-translate-x-full md:-translate-x-full md:hidden',
      )}>
        <ChatHistorySidebar
          currentChatSessionId={chatSessionId}
          onSelectChatSession={handleSelectChatSession}
          onNewChat={handleNewChat}
        />
      </aside>

      {/* Chat area — takes remaining width */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
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