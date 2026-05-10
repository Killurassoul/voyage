import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Message, Client, ChatSession } from "../types";

interface Settings {
  geminiKey: string;
  openaiKey: string;
  amadeusKey: string;
  currency: string;
  language: string;
  beginnerMode: boolean;
  aiModel: "gemini" | "ollama";
  ollamaEndpoint: string;
}

interface AppState {
  // AI Chat
  messages: Message[];
  addMessage: (message: Omit<Message, "id" | "timestamp">) => void;
  clearMessages: () => void;
  isAIPanelOpen: boolean;
  toggleAIPanel: () => void;
  
  // Chat Session Management
  sessions: ChatSession[];
  activeSessionId: string | null;
  saveCurrentSession: (name?: string) => void;
  loadSession: (sessionId: string) => void;
  deleteSession: (sessionId: string) => void;
  createNewSession: () => void;

  // CRM
  clients: Client[];
  addClient: (client: Client) => void;

  // Navigation
  activeTab: "dashboard" | "search" | "crm" | "bookings" | "settings";
  setActiveTab: (tab: "dashboard" | "search" | "crm" | "bookings" | "settings") => void;

  // Settings
  settings: Settings;
  updateSettings: (settings: Partial<Settings>) => void;
}

export const useStore = create<AppState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (msg) =>
        set((state) => ({
          messages: [
            ...state.messages,
            { ...msg, id: Math.random().toString(36).substring(7), timestamp: Date.now() },
          ],
        })),
      clearMessages: () => set({ messages: [], activeSessionId: null }),
      isAIPanelOpen: false,
      toggleAIPanel: () => set((state) => ({ isAIPanelOpen: !state.isAIPanelOpen })),

      sessions: [],
      activeSessionId: null,

      saveCurrentSession: (name) =>
        set((state) => {
          const currentMessages = state.messages;
          if (currentMessages.length === 0) return state;

          const existingSessionIndex = state.sessions.findIndex(s => s.id === state.activeSessionId);
          
          if (existingSessionIndex !== -1) {
            // Update existing
            const updatedSessions = [...state.sessions];
            updatedSessions[existingSessionIndex] = {
              ...updatedSessions[existingSessionIndex],
              messages: currentMessages,
              updatedAt: Date.now(),
              name: name || updatedSessions[existingSessionIndex].name
            };
            return { sessions: updatedSessions };
          } else {
            // Create new
            const newSession: ChatSession = {
              id: Math.random().toString(36).substring(7),
              name: name || `Session ${state.sessions.length + 1}`,
              messages: currentMessages,
              updatedAt: Date.now()
            };
            return { 
              sessions: [newSession, ...state.sessions],
              activeSessionId: newSession.id
            };
          }
        }),

      loadSession: (sessionId) =>
        set((state) => {
          const session = state.sessions.find(s => s.id === sessionId);
          if (session) {
            return { messages: session.messages, activeSessionId: session.id };
          }
          return state;
        }),

      deleteSession: (sessionId) =>
        set((state) => ({
          sessions: state.sessions.filter(s => s.id !== sessionId),
          activeSessionId: state.activeSessionId === sessionId ? null : state.activeSessionId,
          messages: state.activeSessionId === sessionId ? [] : state.messages
        })),

      createNewSession: () => set({ messages: [], activeSessionId: null }),

      clients: [
        {
          id: "1",
          name: "Jean Dupont",
          email: "jean.dupont@email.com",
          phone: "0123456789",
          preferences: ["Business Class", "Hotels 5*", "Asie"],
          totalSpent: 12500,
        },
      ],
      addClient: (client) => set((state) => ({ clients: [...state.clients, client] })),

      activeTab: "search", // On commence par la recherche pour la simplicité
      setActiveTab: (tab) => set({ activeTab: tab }),

      settings: {
        geminiKey: "",
        openaiKey: "",
        amadeusKey: "",
        currency: "XOF",
        language: "fr",
        beginnerMode: true,
        aiModel: "gemini",
        ollamaEndpoint: "http://localhost:11434",
      },
      updateSettings: (newSettings) => 
        set((state) => ({ settings: { ...state.settings, ...newSettings } })),
    }),
    {
      name: "sky-dex-v2-storage",
    }
  )
);
