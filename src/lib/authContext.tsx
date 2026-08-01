/**
 * SECURITY NOTICE - MOCK AUTH LIMITATIONS:
 * When Firebase environment variables are not configured (isMockAuth is true),
 * this authentication context operates in mock-auth mode. In mock-auth mode,
 * user credentials (including plain text passwords) are stored directly in
 * browser localStorage (under 'crazyfeb_mock_users').
 *
 * THIS MODE IS STRICTLY FOR LOCAL DEVELOPMENT, DEMO, AND TESTING PURPOSES ONLY.
 * NEVER USE MOCK-AUTH MODE IN PRODUCTION.
 */

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  type User,
} from 'firebase/auth';
import { auth, hasConfig, isMockAuth } from './firebase';

interface AuthState {
  user: User | null;
  loading: boolean;
  ready: boolean;
  configured: boolean;
  isMock: boolean;
  signUp: (email: string, password: string, displayName?: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
}

const AuthContext = createContext<AuthState | null>(null);

const friendly = (code: string): string => {
  const map: Record<string, string> = {
    'auth/invalid-email': 'Please enter a valid email address.',
    'auth/user-disabled': 'This account has been disabled.',
    'auth/user-not-found': 'No account found with this email.',
    'auth/wrong-password': 'Incorrect password. Please try again.',
    'auth/invalid-credential': 'Invalid email or password.',
    'auth/email-already-in-use': 'An account with this email already exists.',
    'auth/weak-password': 'Password should be at least 6 characters.',
    'auth/too-many-requests': 'Too many attempts. Please try again later.',
    'auth/popup-closed-by-user': 'Google sign-in was cancelled.',
    'auth/operation-not-allowed': 'This sign-in method is not enabled.',
    'auth/network-request-failed': 'Network error. Check your connection and try again.',
  };
  return map[code] || 'Something went wrong. Please try again.';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (isMockAuth) {
      // Initialize mock users store if empty
      const existing = localStorage.getItem('crazyfeb_mock_users');
      if (!existing) {
        localStorage.setItem(
          'crazyfeb_mock_users',
          JSON.stringify({
            'admin@crazyfeb.com': {
              email: 'admin@crazyfeb.com',
              password: 'password',
              displayName: 'Admin User',
              uid: 'mock-admin-uid-123',
            },
          })
        );
      }

      // Check current session
      const curr = localStorage.getItem('crazyfeb_current_user');
      if (curr) {
        try {
          const parsed = JSON.parse(curr);
          if (parsed && typeof parsed === 'object' && typeof parsed.uid === 'string') {
            setUser(parsed as User);
          } else {
            localStorage.removeItem('crazyfeb_current_user');
            setUser(null);
          }
        } catch {
          localStorage.removeItem('crazyfeb_current_user');
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setReady(true);
    } else {
      if (!auth) {
        setReady(true);
        return;
      }
      const unsub = onAuthStateChanged(auth, (u) => {
        setUser(u);
        setReady(true);
      });
      return () => unsub();
    }
  }, []);

  const value = useMemo<AuthState>(() => ({
    user,
    loading,
    ready,
    configured: hasConfig,
    isMock: isMockAuth,
    signUp: async (email, password, displayName) => {
      if (isMockAuth) {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        try {
          const lowerEmail = email.trim().toLowerCase();
          const users = JSON.parse(localStorage.getItem('crazyfeb_mock_users') || '{}');
          if (users[lowerEmail]) {
            throw { code: 'auth/email-already-in-use' };
          }
          if (password.length < 6) {
            throw { code: 'auth/weak-password' };
          }
          const newUser = {
            uid: `mock-uid-${Math.random().toString(36).substring(2, 11)}`,
            email: lowerEmail,
            displayName: displayName || null,
          };
          users[lowerEmail] = {
            ...newUser,
            password,
          };
          localStorage.setItem('crazyfeb_mock_users', JSON.stringify(users));
          localStorage.setItem('crazyfeb_current_user', JSON.stringify(newUser));
          setUser(newUser as unknown as User);
        } catch (e: unknown) {
          throw new Error(friendly((e as { code?: string })?.code || ''));
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!auth) throw new Error('Firebase is not configured.');
      setLoading(true);
      try {
        const cred = await createUserWithEmailAndPassword(auth, email, password);
        if (displayName) await updateProfile(cred.user, { displayName });
      } catch (e: unknown) {
        throw new Error(friendly((e as { code?: string })?.code || ''));
      } finally {
        setLoading(false);
      }
    },
    signIn: async (email, password) => {
      if (isMockAuth) {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 600));
        try {
          const lowerEmail = email.trim().toLowerCase();
          const users = JSON.parse(localStorage.getItem('crazyfeb_mock_users') || '{}');
          const found = users[lowerEmail];
          if (!found || found.password !== password) {
            throw { code: 'auth/invalid-credential' };
          }
          const sessionUser = {
            uid: found.uid,
            email: found.email,
            displayName: found.displayName,
          };
          localStorage.setItem('crazyfeb_current_user', JSON.stringify(sessionUser));
          setUser(sessionUser as unknown as User);
        } catch (e: unknown) {
          throw new Error(friendly((e as { code?: string })?.code || ''));
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!auth) throw new Error('Firebase is not configured.');
      setLoading(true);
      try {
        await signInWithEmailAndPassword(auth, email, password);
      } catch (e: unknown) {
        throw new Error(friendly((e as { code?: string })?.code || ''));
      } finally {
        setLoading(false);
      }
    },
    signInWithGoogle: async () => {
      if (isMockAuth) {
        setLoading(true);
        await new Promise((r) => setTimeout(r, 800));
        try {
          const googleUser = {
            uid: 'mock-google-uid-456',
            email: 'tester@crazyfeb.com',
            displayName: 'CrazyFeb Tester',
          };
          const users = JSON.parse(localStorage.getItem('crazyfeb_mock_users') || '{}');
          if (!users[googleUser.email]) {
            users[googleUser.email] = {
              ...googleUser,
              password: 'google-login',
            };
            localStorage.setItem('crazyfeb_mock_users', JSON.stringify(users));
          }
          localStorage.setItem('crazyfeb_current_user', JSON.stringify(googleUser));
          setUser(googleUser as unknown as User);
        } catch (e: unknown) {
          throw new Error(friendly((e as { code?: string })?.code || ''));
        } finally {
          setLoading(false);
        }
        return;
      }

      if (!auth) throw new Error('Firebase is not configured.');
      setLoading(true);
      try {
        const provider = new GoogleAuthProvider();
        await signInWithPopup(auth, provider);
      } catch (e: unknown) {
        throw new Error(friendly((e as { code?: string })?.code || ''));
      } finally {
        setLoading(false);
      }
    },
    logout: async () => {
      if (isMockAuth) {
        localStorage.removeItem('crazyfeb_current_user');
        setUser(null);
        return;
      }
      if (!auth) return;
      await signOut(auth);
    },
    resetPassword: async (email) => {
      if (isMockAuth) {
        await new Promise((r) => setTimeout(r, 500));
        return;
      }

      if (!auth) throw new Error('Firebase is not configured.');
      try {
        await sendPasswordResetEmail(auth, email);
      } catch (e: unknown) {
        throw new Error(friendly((e as { code?: string })?.code || ''));
      }
    },
    updateDisplayName: async (displayName) => {
      if (isMockAuth) {
        if (!user) throw new Error('Not signed in.');
        const updatedUser = {
          ...user,
          displayName,
        };
        const lowerEmail = (user.email ?? '').toLowerCase();
        const users = JSON.parse(localStorage.getItem('crazyfeb_mock_users') || '{}');
        if (users[lowerEmail]) {
          users[lowerEmail].displayName = displayName;
          localStorage.setItem('crazyfeb_mock_users', JSON.stringify(users));
        }
        localStorage.setItem('crazyfeb_current_user', JSON.stringify(updatedUser));
        setUser(updatedUser as unknown as User);
        return;
      }

      if (!auth || !auth.currentUser) throw new Error('Not signed in.');
      await updateProfile(auth.currentUser, { displayName });
      setUser({ ...auth.currentUser });
    },
  }), [user, loading, ready]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
