import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { apiFetch } from '../lib/api';
import type { AuthRole, AuthUser } from '../types/backend';

const TOKEN_KEY = 'virta7:authToken';
const USER_KEY = 'virta7:authUser';

interface AuthContextValue {
  token: string | null;
  user: AuthUser | null;
  isAuthenticated: boolean;
  register: (input: {
    role: 'admin' | 'tutor';
    name: string;
    email: string;
    password: string;
    adminCode?: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  childLogin: (loginCode: string, pin: string) => Promise<void>;
  logout: () => void;
  updateUser: (patch: Partial<AuthUser>) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState<AuthUser | null>(() => {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? (JSON.parse(raw) as AuthUser) : null;
  });

  const persist = useCallback((nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem(TOKEN_KEY, nextToken);
    localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    setToken(nextToken);
    setUser(nextUser);
  }, []);

  const register = useCallback(
    async (input: {
      role: 'admin' | 'tutor';
      name: string;
      email: string;
      password: string;
      adminCode?: string;
    }) => {
      const data = await apiFetch<{ token: string; user: AuthUser }>('/auth/register', {
        method: 'POST',
        body: input,
      });
      persist(data.token, data.user);
    },
    [persist]
  );

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await apiFetch<{ token: string; user: AuthUser }>('/auth/login', {
        method: 'POST',
        body: { email, password },
      });
      persist(data.token, data.user);
    },
    [persist]
  );

  const childLogin = useCallback(
    async (loginCode: string, pin: string) => {
      const data = await apiFetch<{ token: string; user: AuthUser }>('/auth/child-login', {
        method: 'POST',
        body: { loginCode, pin },
      });
      persist(data.token, data.user);
    },
    [persist]
  );

  const logout = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const updateUser = useCallback((patch: Partial<AuthUser>) => {
    setUser((prev) => {
      if (!prev) return prev;
      const next = { ...prev, ...patch };
      localStorage.setItem(USER_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token && user),
      register,
      login,
      childLogin,
      logout,
      updateUser,
    }),
    [token, user, register, login, childLogin, logout, updateUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export function roleHome(role: AuthRole): string {
  if (role === 'admin') return '/admin/dashboard';
  if (role === 'tutor') return '/tutor/dashboard';
  return '/greeting';
}
