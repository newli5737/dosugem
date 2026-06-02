import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { api } from '../api/client';

interface AdminAuth {
  token: string | null;
  admin: { name: string; email: string } | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AdminAuthContext = createContext<AdminAuth | null>(null);
const TOKEN_KEY = 'dosugem-admin-token';
const ADMIN_KEY = 'dosugem-admin-info';

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem(TOKEN_KEY));
  const [admin, setAdmin] = useState<{ name: string; email: string } | null>(() => {
    try { return JSON.parse(localStorage.getItem(ADMIN_KEY) || 'null'); } catch { return null; }
  });
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const res = await api.login(email, password);
      setToken(res.token);
      setAdmin(res.admin);
      localStorage.setItem(TOKEN_KEY, res.token);
      localStorage.setItem(ADMIN_KEY, JSON.stringify(res.admin));
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setAdmin(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(ADMIN_KEY);
  };

  return (
    <AdminAuthContext.Provider value={{ token, admin, login, logout, loading }}>
      {children}
    </AdminAuthContext.Provider>
  );
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext);
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider');
  return ctx;
}

export function useAdminToken() {
  return localStorage.getItem(TOKEN_KEY);
}
