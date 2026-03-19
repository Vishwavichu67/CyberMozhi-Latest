
"use client";

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { PlusCircle, MessageSquareText, Loader2, AlertCircle, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, onSnapshot, type Timestamp, doc, deleteDoc } from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from '@/hooks/use-toast';
import { ScrollArea } from '@/components/ui/scroll-area';


interface ChatSession {
  id: string;
  title: string;
  createdAt: Timestamp;
  lastMessageAt: Timestamp;
  userId: string;
}

interface ChatHistorySidebarProps {
  currentChatSessionId: string | null;
  onSelectChatSession: (sessionId: string | null) => void;
  onNewChat: () => void;
}

export function ChatHistorySidebar({
  currentChatSessionId,
  onSelectChatSession,
  onNewChat,
}: ChatHistorySidebarProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) {
      setSessions([]);
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    const sessionsRef = collection(db, `users/${user.uid}/chatSessions`);
    const q = query(sessionsRef, orderBy('lastMessageAt', 'desc'));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const fetchedSessions: ChatSession[] = [];
      querySnapshot.forEach((docSnap) => {
        fetchedSessions.push({
          id: docSnap.id,
          ...docSnap.data()
        } as ChatSession);
      });
      setSessions(fetchedSessions);
      setIsLoading(false);
    }, (err) => {
      console.error("Error fetching chat sessions:", err);
      let errorMessage = "Failed to fetch chat sessions.";
      if (err.code === 'permission-denied') {
        errorMessage = "Permission Denied: Could not read chat history. Please check your Firestore security rules.";
      }
      setError(errorMessage);
      setIsLoading(false);
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [user]);

  const handleDeleteSession = async (sessionId: string) => {
    if (!user) return;
    try {
      // It's not possible to delete a subcollection directly from the client.
      // A cloud function is the recommended way. For client-side, we delete the session doc.
      // The messages will become orphaned but inaccessible from the app.
      await deleteDoc(doc(db, `users/${user.uid}/chatSessions`, sessionId));
      
      toast({
        title: "Chat Deleted",
        description: "The chat session has been removed.",
      });

      // If the deleted chat was the active one, start a new chat.
      if (currentChatSessionId === sessionId) {
        onNewChat();
      }

    } catch (err: any) {
       console.error("Error deleting chat session:", err);
       let errorMessage = "Could not delete chat session.";
       if (err.code === 'permission-denied') {
          errorMessage = "Permission Denied: Could not delete this chat. Please check your Firestore security rules.";
       }
       toast({
         variant: 'destructive',
         title: 'Error',
         description: errorMessage,
       });
    }
  };

  const renderHistoryList = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center p-4 space-y-2">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 w-full bg-muted/50 rounded animate-pulse"></div>
          ))}
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-destructive text-sm p-2 flex items-center rounded bg-destructive/10 border border-destructive/20 m-4">
          <AlertCircle className="h-4 w-4 mr-2 shrink-0" /> <span className="flex-grow">{error}</span>
        </div>
      );
    }
    if (sessions.length === 0 && user) {
      return (
        <p className="text-sm text-muted-foreground text-center py-4 px-2">No chat history yet.</p>
      );
    }
    return (
      <div className="space-y-1 p-2">
        {sessions.map((session) => {
          const lastMessageDate = session.lastMessageAt?.toDate ? session.lastMessageAt.toDate() : null;
          return (
            <div key={session.id} className="group relative">
              <Button
                variant="ghost"
                onClick={() => onSelectChatSession(session.id)}
                className={cn(
                  "w-full justify-start text-left h-auto py-2.5 px-3 text-sm truncate",
                  currentChatSessionId === session.id ? 'bg-primary/10 text-primary' : 'hover:bg-muted/50'
                )}
                title={session.title}
              >
                <MessageSquareText className="mr-2.5 h-4 w-4 flex-shrink-0" />
                <div className="flex-grow truncate">
                  <p className="font-medium truncate">{session.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {lastMessageDate ? formatDistanceToNow(lastMessageDate, { addSuffix: true }) : 'Just now'}
                  </p>
                </div>
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Trash2 className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete this chat session. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteSession(session.id)} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          )
        })}
      </div>
    );
  };

  if (!user) {
    return (
        <div className="flex h-full w-full items-center justify-center p-4">
            <p className="text-sm text-center text-muted-foreground">
                Please log in to see and save chat history.
            </p>
        </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full pt-8">
      <div className="p-4 border-b border-border/40">
        <Button onClick={onNewChat} variant="outline" className="w-full transition-shadow hover:shadow-md">
            <PlusCircle className="mr-2 h-5 w-5" />
            New Chat
        </Button>
      </div>
      <ScrollArea className="flex-1">
        {renderHistoryList()}
      </ScrollArea>
    </div>
  );
}
