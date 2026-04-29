import { create } from 'zustand';
import { auth, googleProvider } from '@/lib/firebase';
import { signInWithPopup, signOut, onAuthStateChanged, User, setPersistence, browserSessionPersistence } from 'firebase/auth';
import { useChatStore } from './useChatStore';

interface AuthState {
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface AuthActions {
  login: () => Promise<void>;
  logout: () => Promise<void>;
  init: () => void;
}

export const useAuthStore = create<AuthState & AuthActions>((set) => ({
  user: null,
  loading: true,
  error: null,

  init: () => {
    // Set persistence to SESSION so it logs out when browser is closed
    setPersistence(auth, browserSessionPersistence).catch(err => console.error('Auth persistence error:', err));

    onAuthStateChanged(auth, (user) => {
      set({ user, loading: false });
      if (!user) {
        useChatStore.getState().clearAllSessions();
      }
    });
  },

  login: async () => {
    set({ loading: true, error: null });
    try {
      await signInWithPopup(auth, googleProvider);
      // loading state will be set to false by onAuthStateChanged
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },

  logout: async () => {
    set({ loading: true, error: null });
    try {
      await signOut(auth);
      useChatStore.getState().clearAllSessions();
      // Wait a bit or let onAuthStateChanged handle it
      set({ loading: false });
    } catch (err: any) {
      set({ error: err.message, loading: false });
    }
  },
}));
