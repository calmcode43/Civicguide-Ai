import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import SEO from '@/components/SEO';
import { useChatStore } from '@/store/useChatStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useChat } from '@/hooks/useChat';
import { useApiHealth } from '@/hooks/useApiHealth';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';
import apiClient from '@/lib/apiClient';
import { ChatBubble, GoldButton, ErrorBanner } from '@/components/ui';

const CONTEXTS = ['First-Time Voter', 'Returning Voter', 'Candidate', 'Observer'];

function ShieldIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#d4a017" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12 8v4M12 16h.01" stroke="#d4a017" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </svg>
  );
}

function SendIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M5 12l7-7 7 7" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function MessageIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    </svg>
  );
}

// =============================================================================
// AssistantPage
// =============================================================================

export default function AssistantPage() {
  const { 
    sessions, 
    activeSessionId, 
    getActiveSession, 
    initSession, 
    createNewSession, 
    switchSession, 
    deleteSession,
    clearAllSessions, 
    setUserContext, 
    error: chatError, 
    setError: setChatError,
    syncSessions,
    fetchSessionMessages
  } = useChatStore();
  
  const { user, login, logout, init: initAuth, loading: authLoading, error: authError } = useAuthStore();
  const { sendMessage, isLoading } = useChat();
  const { isOnline } = useNetworkStatus();
  const { isReachable, isChecking } = useApiHealth();
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [inputValue, setInputValue] = useState('');
  const [initialSuggestions, setInitialSuggestions] = useState<string[]>([]);
  const [suggestionsLoading, setSuggestionsLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const session = getActiveSession();
  
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 0. Initialise Auth
  useEffect(() => {
    initAuth();
  }, []);

  // 0.1 Sync sessions on login
  useEffect(() => {
    if (user) {
      user.getIdToken().then(token => {
        syncSessions(token);
      });
    }
  }, [user]);

  // 1. Initialise session on mount
  useEffect(() => {
    if (!isChecking) {
      initSession();
    }
  }, [isChecking]);

  // 1b. Handle prefill from URL
  useEffect(() => {
    const prefill = searchParams.get('prefill');
    if (prefill && session && !isLoading && session.messages.length === 0) {
      sendMessage(prefill);
      setSearchParams({}, { replace: true });
    }
  }, [searchParams, session, isLoading, sendMessage, setSearchParams]);

  // 2. Fetch initial suggestions
  useEffect(() => {
    const fetchSuggestions = async () => {
      setSuggestionsLoading(true);
      try {
        const response = await apiClient.get('/api/suggestions');
        if (response.data?.data) {
          setInitialSuggestions(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch suggestions:', err);
      } finally {
        setSuggestionsLoading(false);
      }
    };
    fetchSuggestions();
  }, []);

  const handleSwitchSession = async (id: string) => {
    console.log('[AssistantPage] Switching to session:', id);
    switchSession(id);
    if (user) {
      try {
        const token = await user.getIdToken();
        console.log('[AssistantPage] Calling fetchSessionMessages with token');
        fetchSessionMessages(id, token);
      } catch (e) {
        console.error('Failed to get token for sync:', e);
      }
    } else {
      console.warn('[AssistantPage] No user logged in, cannot fetch from server');
    }
  };

  // 3. Scroll to bottom on new messages
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [session?.messages]);

  // 5. Keyboard Shortcuts (Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // 6. Handle Message Send
  const handleSend = useCallback(() => {
    if (!inputValue.trim() || isLoading) return;
    sendMessage(inputValue);
    setInputValue('');
  }, [inputValue, isLoading, sendMessage]);

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 160)}px`;
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const getSessionTitle = (sess: any) => {
    if (sess.messages.length === 0) return 'New Conversation';
    const firstUserMsg = sess.messages.find((m: any) => m.role === 'user');
    if (!firstUserMsg) return 'Assistant Chat';
    return firstUserMsg.content.length > 28 
      ? firstUserMsg.content.substring(0, 25) + '...' 
      : firstUserMsg.content;
  };

  // ---------------------------------------------------------------------------
  // Render Helpers
  // ---------------------------------------------------------------------------

  const renderSuggestions = (suggestions: string[]) => {
    if (!Array.isArray(suggestions)) return null;
    return (
      <div className="flex flex-wrap gap-2 mt-4">
        {suggestions.map((suggestion) => (
          <button
            key={suggestion}
            onClick={() => sendMessage(suggestion)}
            className="px-4 py-2 rounded-full border border-border text-text-secondary text-sm hover:border-gold hover:text-gold transition-all backdrop-blur-sm bg-abyss/40"
          >
            {suggestion}
          </button>
        ))}
      </div>
    );
  };

  const renderSkeletonSuggestions = () => (
    <div className="flex flex-wrap gap-2 mt-4">
      {[1, 2, 3].map((i) => (
        <div key={i} className="w-32 h-9 rounded-full bg-border/40 animate-pulse" />
      ))}
    </div>
  );

  // If no session is active yet (should be rare with new init logic), 
  // we render the main structure but with empty content
  const messages = session?.messages || [];
  const lastMessage = messages[messages.length - 1];
  const showSuggestions = !isLoading && lastMessage?.role === 'assistant' && lastMessage.suggestions && lastMessage.suggestions.length > 0;

  return (
    <div className="flex h-screen overflow-hidden bg-void">
      <SEO 
        title="Chat with CivicGuide AI"
        description="Get instant answers to your election questions. Verified information on voting rules, registration deadlines, and voter IDs powered by AI."
        path="/assistant"
      />

      {/* ─── Sidebar (History) ──────────────────────────────────────────────── */}
      <motion.aside
        initial={false}
        animate={{ width: isSidebarOpen ? 280 : 0, opacity: isSidebarOpen ? 1 : 0 }}
        className="hidden md:flex flex-col border-r border-border bg-abyss/40 relative z-30"
      >
        <div className="p-4 border-b border-border">
          <button
            onClick={() => createNewSession()}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gold/30 bg-gold/5 text-gold hover:bg-gold/10 transition-all font-bold text-sm uppercase tracking-widest"
          >
            <PlusIcon />
            New Chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
          <div className="px-3 py-2 text-[10px] text-text-secondary uppercase tracking-widest font-bold opacity-50">
            Recent Conversations
          </div>
          {sessions.map(sess => (
            <div
              key={sess.id}
              className={`group flex items-center justify-between px-3 py-2.5 rounded-lg cursor-pointer transition-all ${
                activeSessionId === sess.id 
                  ? 'bg-gold/10 text-gold border border-gold/20' 
                  : 'text-text-secondary hover:bg-surface/50 hover:text-white'
              }`}
              onClick={() => handleSwitchSession(sess.id)}
            >
              <div className="flex items-center gap-2 overflow-hidden">
                <MessageIcon />
                <span className="text-xs truncate font-medium">
                  {getSessionTitle(sess)}
                </span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteSession(sess.id);
                }}
                className="opacity-0 group-hover:opacity-100 p-1 hover:text-danger transition-all"
              >
                <TrashIcon />
              </button>
            </div>
          ))}
        </div>

        <div className="p-4 border-t border-border space-y-4">
          {authLoading ? (
            <div className="flex items-center gap-3 animate-pulse">
              <div className="w-8 h-8 rounded-full bg-border" />
              <div className="h-3 w-20 bg-border rounded" />
            </div>
          ) : user ? (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={user.photoURL || ''} alt="" className="w-8 h-8 rounded-full border border-gold/30" />
                <div className="flex flex-col">
                  <span className="text-[10px] text-white font-bold truncate max-w-[100px]">{user.displayName}</span>
                  <span className="text-[8px] text-text-secondary uppercase tracking-widest font-bold">Election Hero</span>
                </div>
              </div>
              <button onClick={logout} className="p-2 text-text-secondary hover:text-danger transition-colors">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg>
              </button>
            </div>
          ) : (
            <button
              onClick={login}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-border bg-surface hover:border-gold transition-all text-[10px] font-bold uppercase tracking-widest text-text-secondary hover:text-gold"
            >
              <svg width="14" height="14" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
              Sign in with Google
            </button>
          )}

           <button 
             onClick={clearAllSessions}
             className="w-full text-[9px] text-text-secondary/50 hover:text-danger transition-colors uppercase tracking-widest font-bold flex items-center justify-center gap-2 pt-2 border-t border-border/20"
           >
             <TrashIcon />
             Purge Local History
           </button>
        </div>
      </motion.aside>

      {/* ─── Main Content Area ─────────────────────────────────────────────── */}
      <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-void-radial">
        {/* Static Background Glow */}
        <div className="absolute inset-0 bg-void-radial pointer-events-none z-0 opacity-50" />

        {/* Top Bar */}
        <div className="relative z-20 flex items-center justify-between px-6 py-3 border-b border-border bg-void/90 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="hidden md:flex p-1.5 rounded-lg border border-border hover:border-gold transition-colors text-text-secondary hover:text-gold"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
            </button>
            <span className="text-white font-medium flex items-center gap-2">
               <span className="md:hidden">🗳️</span>
               Election Assistant
            </span>
          </div>

          <div className="md:hidden">
             <button
                onClick={() => createNewSession()}
                className="p-2 rounded-full bg-gold/10 text-gold border border-gold/20"
             >
                <PlusIcon />
             </button>
          </div>

          <GoldButton 
            variant="ghost" 
            size="sm" 
            onClick={() => deleteSession(activeSessionId!)}
            className="hidden sm:flex"
          >
            <TrashIcon />
            <span>Delete Session</span>
          </GoldButton>
        </div>

        {/* User Context Bar (Persona Selector) */}
        <div className="relative z-10 border-b border-border/40 bg-void/60 backdrop-blur-md px-6 py-2 flex items-center gap-3 overflow-x-auto no-scrollbar shadow-inner">
          <span className="text-[10px] text-gold font-bold uppercase tracking-widest shrink-0 opacity-80">
            Your Persona:
          </span>
          <div role="group" aria-label="Select your voter context" className="flex items-center gap-2">
            {CONTEXTS.map((ctx) => (
              <button
                key={ctx}
                onClick={() => setUserContext(ctx)}
                className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all whitespace-nowrap border ${
                  session?.userContext === ctx
                    ? 'bg-gold text-void border-gold shadow-gold-glow scale-105'
                    : 'border-border/60 text-text-secondary hover:border-gold/40 hover:text-gold bg-abyss/30'
                }`}
              >
                {ctx}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <section className="flex-1 overflow-y-auto scroll-smooth relative z-10 px-4 py-8">
          <div className="max-w-[760px] mx-auto w-full flex flex-col gap-8">
            <AnimatePresence initial={false} mode="wait">
              {messages.length === 0 ? (
                <motion.div
                  key="empty-state"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center py-20 text-center"
                >
                  <ShieldIcon />
                  <h2 className="text-2xl font-display text-white mt-6 mb-2">Ask me anything about elections</h2>
                  <p className="text-text-secondary max-w-sm">
                    I can help with voter registration, timelines, ballots, and more.
                  </p>
                  
                  {suggestionsLoading ? renderSkeletonSuggestions() : renderSuggestions(initialSuggestions)}
                </motion.div>
              ) : (
                <div key="messages-list" className="flex flex-col gap-8">
                  {messages.map((msg, idx) => {
                    const onRetry = msg.role === 'assistant' && msg.error ? () => {
                      const userMsg = messages[idx - 1];
                      if (userMsg && userMsg.role === 'user') sendMessage(userMsg.content, true);
                    } : undefined;

                    return <ChatBubble key={msg.id} message={msg} onRetry={onRetry} />;
                  })}
                </div>
              )}
            </AnimatePresence>

            {showSuggestions && renderSuggestions(lastMessage.suggestions!)}
            <div ref={scrollRef} className="h-4" />
          </div>
        </section>

        {/* Input Area */}
        <section className="relative z-20 border-t border-border bg-void/90 backdrop-blur-xl p-4">
          <AnimatePresence>
            {!isChecking && !isReachable && isOnline && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="max-w-[760px] mx-auto w-full mb-3 overflow-hidden"
              >
                <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-3 flex items-center gap-3 text-amber-500 text-xs">
                  <span>⚠️</span>
                  <span>Backend is unreachable.</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="max-w-[760px] mx-auto w-full flex items-end gap-3">
            <div className="relative flex-1">
              <textarea
                ref={inputRef}
                rows={1}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about voter registration, election dates..."
                className="w-full bg-surface border border-border rounded-2xl px-4 py-3.5 text-text-primary placeholder-text-secondary/50 focus:outline-none focus:border-gold focus:ring-4 focus:ring-gold-glow transition-all resize-none font-body text-[0.95rem]"
                style={{ minHeight: '54px' }}
              />
              <div className="absolute right-3 bottom-3 hidden sm:block text-[10px] text-text-secondary/30 pointer-events-none uppercase tracking-widest font-mono">
                ⌘K to focus
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={`w-12 h-12 flex items-center justify-center rounded-full transition-all duration-200 ${
                !inputValue.trim() || isLoading
                  ? 'bg-muted text-text-secondary cursor-not-allowed opacity-50'
                  : 'bg-gold-gradient text-void hover:scale-105 hover:brightness-110 shadow-gold-glow'
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-void/30 border-t-void rounded-full animate-spin" />
              ) : (
                <SendIcon />
              )}
            </button>
          </div>
        </section>
      </main>

      {/* Error Banner */}
      <AnimatePresence>
        {(chatError || authError) && (
          <ErrorBanner 
            message={chatError || authError || 'An unknown error occurred'} 
            onDismiss={() => {
              if (chatError) setChatError(null);
              // Auth error dismissal handled by store if needed, or we just leave it for now
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
