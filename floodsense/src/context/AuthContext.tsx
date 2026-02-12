'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

const TOKEN_KEY = 'floodsense_token';
const USER_KEY = 'floodsense_user';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (user: AuthUser, token: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function loadStoredAuth(): { user: AuthUser | null; token: string | null } {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const userJson = localStorage.getItem(USER_KEY);
    if (!token || !userJson) return { user: null, token: null };
    const user = JSON.parse(userJson) as AuthUser;
    if (!user?.id || !user?.name || !user?.email) return { user: null, token: null };
    return { user, token };
  } catch {
    return { user: null, token: null };
  }
}

function persistAuth(user: AuthUser, token: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  } catch {
    // Storage full or unavailable
  }
}

function clearStoredAuth() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  } catch {
    // Ignore
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, token: null, isLoading: true });

  useEffect(() => {
    const hydrate = () => {
      const { user, token } = loadStoredAuth();
      setState({ user, token, isLoading: false });
    };
    if (typeof window !== "undefined") {
      queueMicrotask(hydrate);
    }
  }, []);

  const login = useCallback((user: AuthUser, token: string) => {
    persistAuth(user, token);
    setState({ user, token, isLoading: false });
  }, []);

  const logout = useCallback(() => {
    clearStoredAuth();
    setState({ user: null, token: null, isLoading: false });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      logout,
      isAuthenticated: !!state.user && !!state.token,
    }),
    [state, login, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
