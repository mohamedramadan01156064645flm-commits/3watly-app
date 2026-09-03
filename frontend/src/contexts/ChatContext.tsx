"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { AssistantPayload } from '../data/chat';
import { useAuth } from './AuthContext';
import { inferNavigationButtons } from '@/lib/copilot/navigation';
import { toast } from 'sonner';

export type Feedback = 'up' | 'down' | null;

export interface ChatNavigationItem {
  path: string;
  label: string;
  priority?: 'primary' | 'secondary';
}

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant';
  time: string;
  text?: string;
  content?: string;
  attachment?: string;
  navigation?: ChatNavigationItem[];
  followUps?: string[];
  payload?: AssistantPayload;
  pending?: boolean;
  feedback?: Feedback;
  created_at?: string;
};

type ChatValue = {
  messages: ChatMessage[];
  isThinking: boolean;
  isLoading: boolean;
  error: string | null;
  sendMessage: (text: string, attachment?: string) => Promise<void>;
  loadMessages: () => Promise<void>;
  resetChat: () => Promise<void>;
  clearChat: () => Promise<void>;
  setFeedback: (id: string, value: Feedback) => void;
  buildTranscript: () => string;
};

const ChatContext = createContext<ChatValue | null>(null);

const formatTime = (date?: string | Date) => {
  const d = date ? new Date(date) : new Date();
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
};

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const cached = localStorage.getItem('3watly_copilot_chat_history');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch {}
    return [];
  });
  const [isThinking, setIsThinking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isSendingRef = useRef(false);

  // Sync rich messages (with navigation and follow-ups) to localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      if (messages.length > 0) {
        const toSave = messages.filter((m) => !m.pending);
        localStorage.setItem('3watly_copilot_chat_history', JSON.stringify(toSave));
      }
    } catch {}
  }, [messages]);

  // Load conversation history from Supabase on mount while preserving rich buttons
  const loadMessages = useCallback(async () => {
    if (!user) return;

    setIsLoading(true);
    setError(null);

    try {
      const q = user?.id || user?.email ? `?userId=${encodeURIComponent(user.id || user.email)}` : '';
      const res = await fetch(`/api/copilot/messages${q}`);
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.messages) && data.messages.length > 0) {
          // Read local cache to retain rich buttons and followUps
          const localMap = new Map<string, ChatMessage>();
          try {
            const cached = localStorage.getItem('3watly_copilot_chat_history');
            if (cached) {
              const list: ChatMessage[] = JSON.parse(cached);
              list.forEach((m) => {
                if (m.content) localMap.set(m.content.trim(), m);
              });
            }
          } catch {}

          const formatted: ChatMessage[] = data.messages.map((m: any) => {
            const content = (m.content || '').trim();
            const matchedLocal = localMap.get(content);
            const defaultNav = inferNavigationButtons(content);

            return {
              id: m.id || `msg-${Date.now()}-${Math.random()}`,
              role: m.role,
              text: m.content,
              content: m.content,
              time: formatTime(m.created_at),
              feedback: m.feedback || null,
              created_at: m.created_at,
              navigation:
                matchedLocal?.navigation && matchedLocal.navigation.length > 0
                  ? matchedLocal.navigation
                  : m.role === 'assistant'
                  ? defaultNav
                  : [],
              followUps:
                matchedLocal?.followUps && matchedLocal.followUps.length > 0
                  ? matchedLocal.followUps
                  : [],
            };
          });

          setMessages(formatted);
          try {
            localStorage.setItem('3watly_copilot_chat_history', JSON.stringify(formatted));
          } catch {}
        }
      }
    } catch (e: any) {
      console.warn('Error loading copilot messages:', e);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  // Send message and process structured JSON response
  const sendMessage = useCallback(
    async (text: string, attachment?: string) => {
      const trimmed = text.trim();
      if (!trimmed && !attachment) return;
      if (isSendingRef.current || isThinking) return;

      const userMsgId = `user-${Date.now()}`;
      const assistantMsgId = `assistant-${Date.now()}`;
      const timeStamp = formatTime();

      const userMsg: ChatMessage = {
        id: userMsgId,
        role: 'user',
        text: trimmed,
        content: trimmed,
        attachment,
        time: timeStamp,
      };

      const pendingAssistantMsg: ChatMessage = {
        id: assistantMsgId,
        role: 'assistant',
        text: '',
        content: '',
        pending: true,
        time: timeStamp,
        feedback: null,
      };

      setMessages((prev) => [...prev, userMsg, pendingAssistantMsg]);
      setIsThinking(true);
      setError(null);
      isSendingRef.current = true;

      try {
        let activeCvPayload: any = undefined;
        try {
          const raw = localStorage.getItem('3watly_parsed_cv');
          if (raw) activeCvPayload = JSON.parse(raw);
        } catch {}

        // Gather recent messages for memory context
        const recentMessagesPayload = messages.slice(-6).map((m) => ({
          role: m.role,
          content: m.text || m.content || '',
        }));

        const response = await fetch('/api/copilot/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            message: trimmed,
            attachment,
            userId: user?.id,
            activeCv: activeCvPayload,
            recentMessages: recentMessagesPayload,
            user: user
              ? {
                  id: user.id,
                  email: user.email,
                  fullName: user.fullName,
                  targetRole: activeCvPayload?.targetRole || user.targetRole,
                }
              : undefined,
          }),
        });

        if (!response.ok) {
          if (response.status === 429) {
            toast.error('تم تجاوز الحد المسموح من الأسئلة مؤقتاً، يرجى الانتظار قليلاً');
            throw new Error('Rate limit exceeded');
          }
          const errData = await response.json().catch(() => ({}));
          throw new Error(errData.error || errData.message || `Server error ${response.status}`);
        }

        const data = await response.json();

        if (data.success && data.data) {
          const { message, navigation, followUps } = data.data;
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    text: message,
                    content: message,
                    navigation: Array.isArray(navigation) ? navigation : [],
                    followUps: Array.isArray(followUps) ? followUps : [],
                    pending: false,
                  }
                : msg
            )
          );
        } else {
          // Fallback if plain text returned
          const msgText = typeof data === 'string' ? data : (data.message || 'تمت معالجة استفسارك بنجاح.');
          setMessages((prev) =>
            prev.map((msg) =>
              msg.id === assistantMsgId
                ? {
                    ...msg,
                    text: msgText,
                    content: msgText,
                    pending: false,
                  }
                : msg
            )
          );
        }
      } catch (err: any) {
        console.error('Error sending message in ChatContext:', err);
        setError(err?.message || 'Failed to send message');

        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === assistantMsgId
              ? {
                  ...msg,
                  text:
                    msg.text ||
                    'عذراً، حدث خطأ أثناء الاتصال بمساعد 3watly الذكي. يرجى التحقق من الاتصال والمحاولة مجدداً.',
                  pending: false,
                }
              : msg
          )
        );
      } finally {
        setIsThinking(false);
        isSendingRef.current = false;
      }
    },
    [isThinking, user, messages]
  );

  // Clear/Reset chat conversation
  const resetChat = useCallback(async () => {
    setIsThinking(false);
    isSendingRef.current = false;
    setMessages([]);

    try {
      localStorage.removeItem('3watly_copilot_chat_history');
    } catch {}

    try {
      const q = user?.id || user?.email ? `?userId=${encodeURIComponent(user.id || user.email)}` : '';
      await fetch(`/api/copilot/messages${q}`, { method: 'DELETE' });
    } catch (e) {
      console.warn('Failed to clear messages from server:', e);
    }
  }, [user]);

  const clearChat = resetChat;

  const setFeedback = useCallback((id: string, value: Feedback) => {
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, feedback: value } : m))
    );
  }, []);

  const buildTranscript = useCallback(() => {
    return messages
      .filter((m) => !m.pending)
      .map((m) => {
        const roleName = m.role === 'user' ? 'You' : '3WATLY';
        const text = m.text || m.content || '';
        const attachmentStr = m.attachment ? ` [Attachment: ${m.attachment}]` : '';
        return `[${m.time}] ${roleName}: ${text}${attachmentStr}`;
      })
      .filter(Boolean)
      .join('\n\n');
  }, [messages]);

  const value = useMemo(
    () => ({
      messages,
      isThinking,
      isLoading,
      error,
      sendMessage,
      loadMessages,
      resetChat,
      clearChat,
      setFeedback,
      buildTranscript,
    }),
    [
      messages,
      isThinking,
      isLoading,
      error,
      sendMessage,
      loadMessages,
      resetChat,
      clearChat,
      setFeedback,
      buildTranscript,
    ]
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useChat() {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used inside ChatProvider');
  return ctx;
}