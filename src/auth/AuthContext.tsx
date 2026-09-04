import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentSession,
  login as serviceLogin,
  logout as serviceLogout,
  type UserSession
} from './authService';

interface AuthContextType {
  isAuthenticated: boolean;
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, pass: string, captcha: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore session on mount / refresh
  useEffect(() => {
    try {
      const existing = getCurrentSession();
      if (existing) {
        setUser(existing);
      }
    } catch {
      // ignore
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pass: string, captcha: string) => {
    setIsLoading(true);
    try {
      const res = await serviceLogin(email, pass, captcha);
      if (res.success && res.session) {
        setUser(res.session);
        return { success: true };
      }
      return { success: false, error: res.error || 'Login failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    serviceLogout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user && user.token),
        user,
        isLoading,
        login,
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
