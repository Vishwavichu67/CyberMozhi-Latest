"use client";

import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  PlusCircle, MessageSquareText, AlertCircle,
  Trash2, Pencil, Pin, PinOff, MoreVertical, Check, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatDistanceToNow } from 'date-fns';
import { db } from '@/lib/firebase';
import {
  collection, query, orderBy, onSnapshot,
  type Timestamp, doc, deleteDoc, updateDoc
} from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel,
  AlertDialogContent, AlertDialogDescription,
  AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

interface ChatSession {
  id: string;
  title: string;
  createdAt: Timestamp;
  lastMessageAt: Timestamp;
  userId: string;
  pinned?: boolean;
}

interface ChatHistorySidebarProps {
  currentChatSessionId: string | null;
  onSelectChatSession: (sessionId: string | null) => void;
  onNewChat: () => void;
}

export function ChatHistorySidebar({
  currentChatSessionId, onSelectChatSession, onNewChat,
}: ChatHistorySidebarProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [renamingId, setRenamingId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState('');
  const renameInputRef = useRef<HTMLInputElement>(null);
  const [deletingSession, setDeletingSession] = useState<ChatSession | null>(null);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  useEffect(() => {
    if (!user) { setSessions([]); setIsLoading(false); return; }
    setIsLoading(true);
    const q = query(
      collection(db, `users/${user.uid}/chatSessions`),
      orderBy('lastMessageAt', 'desc')
    );
    const unsub = onSnapshot(q,
      snap => {
        setSessions(snap.docs.map(d => ({ id: d.id, ...d.data() } as ChatSession)));
        setIsLoading(false);
      },
      err => {
        setError(err.code === 'permission-denied' ? 'Permission denied.' : 'Failed to load chats.');
        setIsLoading(false);
      }
    );
    return () => unsub();
  }, [user]);

  useEffect(() => {
    if (renamingId && renameInputRef.current) {
      renameInputRef.current.focus();
      renameInputRef.current.select();
    }
  }, [renamingId]);

  // Close menu on outside click
  useEffect(() => {
    if (!openMenuId) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest('[data-menu]')) setOpenMenuId(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [openMenuId]);

  const handleDelete = async (session: ChatSession) => {
    if (!user) return;
    try {
      await deleteDoc(doc(db, `users/${user.uid}/chatSessions`, session.id));
      toast({ title: 'Deleted', description: `"${session.title}" removed.` });
      if (currentChatSessionId === session.id) onNewChat();
    } catch {
      toast({ variant: 'destructive', title: 'Delete failed' });
    } finally {
      setDeletingSession(null);
    }
  };

  const handleRenameCommit = async (sessionId: string) => {
    const trimmed = renameValue.trim();
    setRenamingId(null);
    if (!trimmed || !user) return;
    const original = sessions.find(s => s.id === sessionId)?.title;
    if (trimmed === original) return;
    try {
      await updateDoc(doc(db, `users/${user.uid}/chatSessions`, sessionId), { title: trimmed });
      toast({ title: 'Renamed', description: `Renamed to "${trimmed}".` });
    } catch {
      toast({ variant: 'destructive', title: 'Rename failed' });
    }
  };

  const handleTogglePin = async (session: ChatSession) => {
    if (!user) return;
    const newPinned = !session.pinned;
    try {
      await updateDoc(doc(db, `users/${user.uid}/chatSessions`, session.id), { pinned: newPinned });
      toast({ title: newPinned ? '📌 Pinned' : 'Unpinned' });
    } catch {
      toast({ variant: 'destructive', title: 'Error' });
    }
  };

  const pinned = sessions.filter(s => s.pinned);
  const unpinned = sessions.filter(s => !s.pinned);

  const renderSession = (session: ChatSession) => {
    const isActive = currentChatSessionId === session.id;
    const lastDate = session.lastMessageAt?.toDate?.() ?? null;
    const isMenuOpen = openMenuId === session.id;

    // ── Rename mode ──────────────────────────────────────────────────────
    if (renamingId === session.id) {
      return (
        <div key={session.id} className="flex items-center gap-1 p-1.5 mx-1 bg-muted/50 rounded-md">
          <Input
            ref={renameInputRef}
            value={renameValue}
            onChange={e => setRenameValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleRenameCommit(session.id);
              if (e.key === 'Escape') setRenamingId(null);
            }}
            onBlur={() => handleRenameCommit(session.id)}
            className="h-7 text-sm flex-1 min-w-0"
            maxLength={60}
          />
          <Button size="icon" variant="ghost" className="h-7 w-7 flex-shrink-0"
            onMouseDown={e => { e.preventDefault(); handleRenameCommit(session.id); }}>
            <Check className="h-3.5 w-3.5 text-green-500" />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7 flex-shrink-0"
            onMouseDown={e => { e.preventDefault(); setRenamingId(null); }}>
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      );
    }

    // ── Normal mode ──────────────────────────────────────────────────────
    return (
      <div key={session.id} className="relative mx-1">
        <div className={cn(
          'flex items-center rounded-md transition-colors',
          isActive ? 'bg-primary/10' : 'hover:bg-muted/30'
        )}>
          {/* Title */}
          <button
            onClick={() => onSelectChatSession(session.id)}
            className="flex items-center flex-1 min-w-0 text-left py-2.5 pl-3 pr-1 gap-2"
          >
            <div className="relative flex-shrink-0">
              <MessageSquareText className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-primary' : 'text-muted-foreground')} />
              {session.pinned && <span className="absolute -top-1 -right-1 text-[8px]">📌</span>}
            </div>
            <div className="flex-1 min-w-0">
              <p className={cn('text-sm font-medium truncate', isActive ? 'text-primary' : 'text-foreground')}>
                {session.title}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {lastDate ? formatDistanceToNow(lastDate, { addSuffix: true }) : 'Just now'}
              </p>
            </div>
          </button>

          {/* ⋮ Menu trigger */}
          <div data-menu className="flex-shrink-0 pr-1">
            <Button
              variant="ghost"
              size="icon"
              data-menu
              className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
              onClick={e => {
                e.stopPropagation();
                setOpenMenuId(isMenuOpen ? null : session.id);
              }}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Dropdown menu — absolutely positioned OUTSIDE ScrollArea clipping */}
        {isMenuOpen && (
          <div
            data-menu
            className="absolute right-0 top-9 z-[200] w-44 rounded-md border border-border bg-popover shadow-lg py-1"
          >
            <button
              data-menu
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => { setOpenMenuId(null); setRenamingId(session.id); setRenameValue(session.title); }}
            >
              <Pencil className="h-3.5 w-3.5" /> Rename
            </button>
            <button
              data-menu
              className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent transition-colors"
              onClick={() => { setOpenMenuId(null); handleTogglePin(session); }}
            >
              {session.pinned
                ? <><PinOff className="h-3.5 w-3.5" /> Unpin</>
                : <><Pin className="h-3.5 w-3.5" /> Pin to top</>}
            </button>
            <div className="h-px bg-border my-1" />
            <button
              data-menu
              className="flex w-full items-center gap-2 px-3 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors"
              onClick={() => { setOpenMenuId(null); setDeletingSession(session); }}
            >
              <Trash2 className="h-3.5 w-3.5" /> Delete
            </button>
          </div>
        )}
      </div>
    );
  };

  if (!user) {
    return (
      <div className="flex h-full items-center justify-center p-4">
        <p className="text-sm text-center text-muted-foreground">Please log in to see chat history.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-full pt-14">
        <div className="p-3 border-b border-border/40">
          <Button onClick={onNewChat} variant="outline" className="w-full">
            <PlusCircle className="mr-2 h-4 w-4" /> New Chat
          </Button>
        </div>

        {/* Plain div instead of ScrollArea — avoids overflow:hidden clipping buttons */}
        <div className="flex-1 overflow-y-auto">
          {isLoading ? (
            <div className="p-4 space-y-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 w-full bg-muted/50 rounded animate-pulse" />
              ))}
            </div>
          ) : error ? (
            <div className="text-destructive text-sm p-4 flex gap-2 bg-destructive/10 m-3 rounded">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />{error}
            </div>
          ) : sessions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8 px-4">
              No chats yet. Start a conversation!
            </p>
          ) : (
            <div className="py-2 space-y-0.5">
              {pinned.length > 0 && (
                <>
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 pt-2 pb-1">
                    📌 Pinned
                  </p>
                  {pinned.map(renderSession)}
                  {unpinned.length > 0 && (
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide px-4 pt-3 pb-1">
                      Recent
                    </p>
                  )}
                </>
              )}
              {unpinned.map(renderSession)}
            </div>
          )}
        </div>
      </div>

      {/* Delete confirm dialog */}
      <AlertDialog open={!!deletingSession} onOpenChange={open => !open && setDeletingSession(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this chat?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{deletingSession?.title}&rdquo; will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deletingSession && handleDelete(deletingSession)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}