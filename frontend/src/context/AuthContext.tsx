import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthResponse, UserRole } from '../types';

interface RegisterPayload {
  email: string;
  password: string;
  role: UserRole;
  display_name: string;
  company_name?: string;
  nip?: string;
  phone?: string;
  website?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoggedIn: boolean;
  isBusiness: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (payload: RegisterPayload) => Promise<{ success: boolean; error?: string }>;
  demoLogin: (role: 'user' | 'business') => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

import { API_BASE } from '../config/api';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Wczytywanie zapisanego tokenu z localStorage przy starcie aplikacji
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('access_token');
      if (savedToken) {
        setToken(savedToken);
        try {
          const res = await fetch(`${API_BASE}/auth/me`, {
            headers: { Authorization: `Bearer ${savedToken}` }
          });
          if (res.ok) {
            const userData: User = await res.json();
            setUser(userData);
          } else {
            // Token nieważny
            localStorage.removeItem('access_token');
            setToken(null);
            setUser(null);
          }
        } catch (err) {
          console.warn('Błąd sprawdzania sesji użytkownika:', err);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const handleAuthSuccess = (data: AuthResponse) => {
    setUser(data.user);
    setToken(data.access_token);
    localStorage.setItem('access_token', data.access_token);
  };

  const login = async (email: string, password: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.detail || 'Błąd logowania' };
      }
      handleAuthSuccess(data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Błąd połączenia z serwerem' };
    }
  };

  const register = async (payload: RegisterPayload) => {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.detail || 'Błąd rejestracji' };
      }
      handleAuthSuccess(data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Błąd połączenia z serwerem' };
    }
  };

  const demoLogin = async (role: 'user' | 'business') => {
    try {
      const res = await fetch(`${API_BASE}/auth/demo/${role}`, {
        method: 'POST'
      });
      const data = await res.json();
      if (!res.ok) {
        return { success: false, error: data.detail || 'Błąd logowania demo' };
      }
      handleAuthSuccess(data);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message || 'Błąd połączenia z serwerem' };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('access_token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoggedIn: !!user,
        isBusiness: user?.role === 'business',
        loading,
        login,
        register,
        demoLogin,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
