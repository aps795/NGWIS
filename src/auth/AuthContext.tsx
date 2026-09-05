import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  getCurrentSession,
  login as serviceLogin,
  verifyOtp as serviceVerifyOtp,
  resendOtp as serviceResendOtp,
  logout as serviceLogout,
  type UserSession
} from './authService';

export interface PendingOtpState {
  tempSessionId: string;
  email: string;
  expiresIn: number;
  resendCooldown: number;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isOtpPending: boolean;
  pendingOtp: PendingOtpState | null;
  user: UserSession | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; otpRequired?: boolean; error?: string }>;
  verifyOtp: (code: string) => Promise<{ success: boolean; error?: string }>;
  resendOtp: () => Promise<{ success: boolean; error?: string; retryAfter?: number }>;
  cancelOtp: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserSession | null>(null);
  const [pendingOtp, setPendingOtp] = useState<PendingOtpState | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Restore authenticated session on mount / page refresh
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

  /**
   * Step 1: Login with Email & Password
   */
  const login = async (email: string, pass: string) => {
    setIsLoading(true);
    try {
      const res = await serviceLogin(email, pass);

      if (res.success && res.otpRequired && res.tempSessionId) {
        setPendingOtp({
          tempSessionId: res.tempSessionId,
          email: res.email || email,
          expiresIn: res.expiresIn || 300,
          resendCooldown: res.resendCooldown || 60
        });
        return { success: true, otpRequired: true };
      }

      if (res.success && res.session) {
        setUser(res.session);
        setPendingOtp(null);
        return { success: true, otpRequired: false };
      }

      return { success: false, error: res.error || 'Authentication failed. Please verify credentials.' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Step 2: Verify 6-digit OTP code
   */
  const verifyOtp = async (code: string) => {
    if (!pendingOtp) {
      return { success: false, error: 'No active verification session. Please sign in again.' };
    }

    setIsLoading(true);
    try {
      const res = await serviceVerifyOtp(pendingOtp.tempSessionId, code);

      if (res.success && res.session) {
        setUser(res.session);
        setPendingOtp(null);
        return { success: true };
      }

      return { success: false, error: res.error || 'Invalid verification code. Please try again.' };
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Resend verification code
   */
  const resendOtp = async () => {
    if (!pendingOtp) {
      return { success: false, error: 'No active session. Please sign in again.' };
    }

    try {
      const res = await serviceResendOtp(pendingOtp.tempSessionId);

      if (res.success) {
        setPendingOtp((prev) => prev ? {
          ...prev,
          expiresIn: res.expiresIn || 300,
          resendCooldown: res.resendCooldown || 60
        } : null);
        return { success: true };
      }

      return {
        success: false,
        error: res.error || 'Failed to resend code.',
        retryAfter: res.retryAfter
      };
    } catch {
      return { success: false, error: 'Network error requesting new code.' };
    }
  };

  /**
   * Cancel pending verification and return to Step 1
   */
  const cancelOtp = () => {
    setPendingOtp(null);
  };

  /**
   * Sign out and clear all sessions
   */
  const logout = () => {
    serviceLogout();
    setUser(null);
    setPendingOtp(null);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated: Boolean(user && user.token),
        isOtpPending: Boolean(pendingOtp && !user),
        pendingOtp,
        user,
        isLoading,
        login,
        verifyOtp,
        resendOtp,
        cancelOtp,
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
