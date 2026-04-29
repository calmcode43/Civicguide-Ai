import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import type { ChatSession, Message } from '@/types';

// =============================================================================
// State Shape
// =============================================================================

interface ChatState {
  /** All available chat sessions. */
  sessions: ChatSession[];
  /** ID of the currently viewed session. */
  activeSessionId: string | null;
  /** True when an API request is in-flight. */
  isLoading: boolean;
  /** True when the store has finished its first sync/init. */
  isInitialised: boolean;
  /** Non-null when the last operation produced an error. */
  error: string | null;
}

// =============================================================================
// Actions Shape
// =============================================================================

interface ChatActions {
  /** Returns the currently active session object. */
  getActiveSession: () => ChatSession | null;

  /** Initialises the store. If no sessions exist, creates the first one. */
  initSession: () => void;

  /** Creates a fresh session and makes it active. */
  createNewSession: () => string;

  /** Switches to an existing session by ID. */
  switchSession: (id: string) => void;

  /** Deletes a session from history. */
  deleteSession: (id: string) => void;

  /** Appends a message to the active session. */
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void;

  /** Updates a specific message in the active session. */
  updateMessage: (id: string, patch: Partial<Message>) => void;

  /** Updates the user context for the active session. */
  setUserContext: (context: string) => void;

  /** Sets the global loading flag. */
  setLoading: (isLoading: boolean) => void;

  /** Sets or clears the global error string. */
  setError: (error: string | null) => void;

  /** Resets the entire chat state (deletes all sessions). */
  clearAllSessions: () => void;

  /** Syncs local sessions with server sessions (if logged in). */
  syncSessions: (token: string) => Promise<void>;

  /** Fetches full history for a specific session. */
  fetchSessionMessages: (id: string, token: string) => Promise<void>;
}

// =============================================================================
// Store
// =============================================================================

const initialState: ChatState = {
  sessions: [],
  activeSessionId: null,
  isLoading: false,
  isInitialised: false,
  error: null,
};

export const useChatStore = create<ChatState & ChatActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      getActiveSession: () => {
        const { sessions, activeSessionId } = get();
        return sessions.find(s => s.id === activeSessionId) || null;
      },

      initSession: () => {
        const { sessions, activeSessionId, isInitialised } = get();
        if (isInitialised) return;

        if (sessions.length > 0) {
          if (!activeSessionId) {
            set({ activeSessionId: sessions[0].id, isInitialised: true });
          } else {
            set({ isInitialised: true });
          }
          return;
        }
        
        get().createNewSession();
        set({ isInitialised: true });
      },

      createNewSession: () => {
        const { sessions } = get();
        // Prevent creating multiple empty sessions
        const emptySession = sessions.find(s => s.messages.length === 0);
        if (emptySession) {
          set({ activeSessionId: emptySession.id, error: null });
          return emptySession.id;
        }

        const newId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newSession: ChatSession = {
          id: newId,
          messages: [],
          userContext: 'general',
          createdAt: new Date(),
          title: 'New Chat'
        };
        set(state => ({
          sessions: [newSession, ...state.sessions],
          activeSessionId: newId,
          error: null
        }));
        return newId;
      },

      switchSession: (id) => set({ activeSessionId: id, error: null }),

      deleteSession: (id) => {
        set(state => {
          const nextSessions = state.sessions.filter(s => s.id !== id);
          let nextActiveId = state.activeSessionId;
          if (nextActiveId === id) {
            nextActiveId = nextSessions.length > 0 ? nextSessions[0].id : null;
          }
          return { sessions: nextSessions, activeSessionId: nextActiveId };
        });
        const { sessions } = get();
        if (sessions.length === 0) get().createNewSession();
      },

      addMessage: (message) => {
        const { activeSessionId } = get();
        if (!activeSessionId) return;

        const newMessage: Message = {
          id: uuidv4(),
          timestamp: new Date(),
          ...message,
        };

        set(state => ({
          sessions: state.sessions.map(s => 
            s.id === activeSessionId 
              ? { 
                  ...s, 
                  messages: [...s.messages, newMessage], 
                  updatedAt: new Date(),
                  title: s.messages.length === 0 && message.role === 'user' 
                    ? message.content.substring(0, 30) + (message.content.length > 30 ? '...' : '')
                    : s.title
                }
              : s
          )
        }));
      },

      updateMessage: (id, patch) => {
        const { activeSessionId } = get();
        if (!activeSessionId) return;

        set(state => ({
          sessions: state.sessions.map(s => 
            s.id === activeSessionId 
              ? { 
                  ...s, 
                  messages: s.messages.map(m => m.id === id ? { ...m, ...patch } : m) 
                }
              : s
          )
        }));
      },

      setUserContext: (userContext) => {
        const { activeSessionId } = get();
        if (!activeSessionId) return;
        set(state => ({
          sessions: state.sessions.map(s => 
            s.id === activeSessionId ? { ...s, userContext } : s
          )
        }));
      },

      setLoading: (isLoading) => set({ isLoading }),

      setError: (error) => set({ error }),

      clearAllSessions: () => {
        localStorage.removeItem('civicguide-chat-storage');
        const newId = `sess_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        const newSession: ChatSession = {
          id: newId,
          messages: [],
          userContext: 'general',
          createdAt: new Date(),
          title: 'New Chat'
        };
        set({ 
          ...initialState, 
          sessions: [newSession], 
          activeSessionId: newId,
          isInitialised: true 
        });
      },

      syncSessions: async (token) => {
        console.log('[ChatStore] Syncing sessions with server...');
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/sessions`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          if (response.data?.status === 'success') {
            const serverSessions = response.data.data;
            set(state => {
              // Extract non-empty local sessions
              const nonEmptyLocal = state.sessions.filter(s => s.messages.length > 0);
              const localIds = new Set(nonEmptyLocal.map(s => s.id));
              
              const mergedSessions = [...nonEmptyLocal];
              
              serverSessions.forEach((ss: any) => {
                if (!localIds.has(ss.id)) {
                  mergedSessions.push({
                    id: ss.id,
                    userContext: ss.userContext || 'general',
                    createdAt: new Date(ss.updatedAt),
                    title: ss.title || 'Past Chat',
                    messages: [], 
                  });
                }
              });
              
              mergedSessions.sort((a, b) => 
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
              );

              return { 
                sessions: mergedSessions.length > 0 ? mergedSessions : state.sessions,
                activeSessionId: mergedSessions.length > 0 ? mergedSessions[0].id : state.activeSessionId,
                isInitialised: true
              };
            });
          }
        } catch (err) {
          console.error('[ChatStore] Sync failed:', err);
        }
      },

      fetchSessionMessages: async (id, token) => {
        console.log(`[ChatStore] Fetching messages for ${id}...`);
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/sessions/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          console.log(`[ChatStore] Fetch response for ${id}:`, response.data);
          if (response.data?.status === 'success') {
            const serverMessages = response.data.data.messages;
            set(state => ({
              sessions: state.sessions.map(s => 
                s.id === id 
                  ? { 
                      ...s, 
                      messages: serverMessages.map((m: any) => ({ 
                        ...m, 
                        id: m.id || uuidv4(), 
                        timestamp: new Date(m.timestamp) 
                      })) 
                    }
                  : s
              )
            }));
          }
        } catch (err) {
          console.error('[ChatStore] Fetch history failed:', err);
        }
      }
    }),
    {
      name: 'civicguide-chat-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ 
        sessions: state.sessions, 
        activeSessionId: state.activeSessionId 
      }),
    }
  )
);
