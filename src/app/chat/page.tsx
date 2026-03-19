
"use client";

import { useCallback, useState } from 'react';
import { ChatHistorySidebar } from '@/components/chatbot/ChatHistorySidebar';
import { ChatInterface } from '@/components/chatbot/ChatInterface';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Sheet,
  SheetContent,
} from "@/components/ui/sheet";

export default function ChatPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  
  const [chatSessionId, setChatSessionId] = useState<string | null>(null);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleSelectChatSession = useCallback((sessionId: string | null) => {
    setChatSessionId(sessionId);
    setSidebarOpen(false); // Close sidebar after selection
  }, []);

  const handleNewChat = useCallback(() => {
    setChatSessionId(null);
    setSidebarOpen(false); // Close sidebar on new chat
  }, []);

  const toggleSidebar = () => setSidebarOpen(prev => !prev);
  
  if (loading || !user) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex flex-1 w-full overflow-hidden">
      <Sheet open={isSidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="p-0 w-80">
          <ChatHistorySidebar
            currentChatSessionId={chatSessionId}
            onSelectChatSession={handleSelectChatSession}
            onNewChat={handleNewChat}
          />
        </SheetContent>
      </Sheet>
      
      <div className="flex-1 flex flex-col">
        <ChatInterface
          key={chatSessionId} // Re-mount component when session changes
          chatSessionId={chatSessionId}
          setChatSessionId={setChatSessionId}
          onToggleSidebar={toggleSidebar}
        />
      </div>
    </div>
  );
}
