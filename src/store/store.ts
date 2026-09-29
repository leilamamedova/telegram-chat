import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ChatInfo, ChatMessage, Credentials } from '../types';

interface ChatState {
  creds: Credentials | null;
  chat: ChatInfo | null;
  messages: ChatMessage[];
  setCreds: (creds: Credentials) => void;
  logout: () => void;
  openChat: (chat: ChatInfo) => void;
  closeChat: () => void;
  addMessage: (message: ChatMessage) => void;
  updateMessage: (id: string, patch: Partial<ChatMessage>) => void;
}

export const useChatStore = create<ChatState>()(
  persist(
    (set) => ({
      creds: null,
      chat: null,
      messages: [],
      setCreds: (creds) => set({ creds }),
      logout: () => set({ creds: null, chat: null, messages: [] }),
      openChat: (chat) => set({ chat, messages: [] }),
      closeChat: () => set({ chat: null, messages: [] }),
      addMessage: (message) =>
        set((state) =>
          state.messages.some((m) => m.id === message.id)
            ? state
            : { messages: [...state.messages, message] },
        ),
      updateMessage: (id, patch) =>
        set((state) => ({
          messages: state.messages.map((m) =>
            m.id === id ? { ...m, ...patch } : m,
          ),
        })),
    }),
    {
      name: 'telegram-chat-credentials',
      partialize: (state) => ({
        creds: state.creds,
        chat: state.chat,
        messages: state.messages,
      }),
    },
  ),
);
