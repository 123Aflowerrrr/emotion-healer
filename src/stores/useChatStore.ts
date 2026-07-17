import { create } from 'zustand';
import type { ChatSession, ChatMessage } from '../types';
import { db } from '../db';
import { aiService } from '../services/ai';

interface ChatStore {
  sessions: ChatSession[];
  activeSessionId: string | null;
  isLoading: boolean;
  streamingContent: string;
  isStreaming: boolean;
  loadSessions: () => Promise<void>;
  createSession: (sceneId: string) => Promise<string>;
  sendMessage: (content: string) => Promise<void>;
  cancelStreaming: () => void;
  deleteSession: (id: string) => Promise<void>;
  getActiveSession: () => ChatSession | undefined;
}

let idCounter = Date.now();
const generateId = () => `msg_${++idCounter}_${Math.random().toString(36).slice(2, 7)}`;

export const useChatStore = create<ChatStore>((set, get) => ({
  sessions: [],
  activeSessionId: null,
  isLoading: false,
  streamingContent: '',
  isStreaming: false,

  loadSessions: async () => {
    const sessions = await db.chatSessions.orderBy('updatedAt').reverse().toArray();
    for (const s of sessions) {
      s.messages = await db.chatMessages.where('sessionId').equals(s.id).toArray();
    }
    set({ sessions });
  },

  createSession: async (sceneId) => {
    const id = `session_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
    const now = Date.now();
    const session: ChatSession = {
      id,
      sceneId,
      title: '新的对话',
      messages: [],
      createdAt: now,
      updatedAt: now,
    };
    await db.chatSessions.add(session);
    set((state) => ({
      sessions: [session, ...state.sessions],
      activeSessionId: id,
    }));
    return id;
  },

  sendMessage: async (content) => {
    const { activeSessionId } = get();
    if (!activeSessionId) return;

    const userMsg: ChatMessage = {
      id: generateId(),
      sessionId: activeSessionId,
      timestamp: Date.now(),
      role: 'user',
      content,
    };
    await db.chatMessages.add(userMsg);

    const assistantId = generateId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      sessionId: activeSessionId,
      timestamp: Date.now(),
      role: 'assistant',
      content: '',
    };
    await db.chatMessages.add(assistantMsg);

    set((state) => ({
      sessions: state.sessions.map((s) =>
        s.id === activeSessionId
          ? { ...s, messages: [...s.messages, userMsg, assistantMsg], updatedAt: Date.now() }
          : s
      ),
      isStreaming: true,
      streamingContent: '',
    }));

    const session = get().sessions.find((s) => s.id === activeSessionId);
    if (!session) return;

    const apiMessages = session.messages.map((m) => ({ role: m.role, content: m.content }));
    apiMessages.push({ role: 'user', content });

    await aiService.sendMessage(apiMessages, {
      onToken: (token) => {
        set((state) => ({
          streamingContent: state.streamingContent + token,
          sessions: state.sessions.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantId ? { ...m, content: m.content + token } : m
                  ),
                }
              : s
          ),
        }));
      },
      onComplete: async (fullText) => {
        await db.chatMessages.update(assistantId, { content: fullText });
        set({ isStreaming: false, streamingContent: '' });
      },
      onError: () => {
        set((state) => ({
          isStreaming: false,
          streamingContent: '',
          sessions: state.sessions.map((s) =>
            s.id === activeSessionId
              ? {
                  ...s,
                  messages: s.messages.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: '抱歉，我暂时无法回复... 🌧️ 可以稍后再试一次吗？' }
                      : m
                  ),
                }
              : s
          ),
        }));
      },
    });
  },

  cancelStreaming: () => {
    aiService.cancel();
    set({ isStreaming: false, streamingContent: '' });
  },

  deleteSession: async (id) => {
    await db.chatSessions.delete(id);
    await db.chatMessages.where('sessionId').equals(id).delete();
    set((state) => ({
      sessions: state.sessions.filter((s) => s.id !== id),
      activeSessionId: state.activeSessionId === id ? null : state.activeSessionId,
    }));
  },

  getActiveSession: () => {
    const { sessions, activeSessionId } = get();
    return sessions.find((s) => s.id === activeSessionId);
  },
}));
