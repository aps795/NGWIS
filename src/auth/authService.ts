/**
 * NGWIS Authentication Service
 * 
 * SECURITY COMPLIANCE:
 * - NO passwords, password hashes, OTP codes, or secrets are stored in this file.
 * - Communicates with backend endpoints (/api/admin/* and /api/auth/*).
 * - All credential validation and OTP generation occur strictly server-side.
 */

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  token: string;
}

export interface LoginResult {
  success: boolean;
  otpRequired?: boolean;
  tempSessionId?: string;
  email?: string;
  expiresIn?: number;
  resendCooldown?: number;
  session?: UserSession;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  session?: UserSession;
  error?: string;
}

export interface ResendOtpResult {
  success: boolean;
  message?: string;
  expiresIn?: number;
  resendCooldown?: number;
  retryAfter?: number;
  error?: string;
}

const STORAGE_KEY = 'ngwis_admin_session';

// Support both standard env variable names, or default to relative path for proxy/serverless
const getApiBaseUrl = (): string => {
  const url = import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '';
  return url.replace(/\/$/, '');
};

/**
 * Retrieve current active session from sessionStorage.
 * Returns null if unauthenticated or expired.
 */
export function getCurrentSession(): UserSession | null {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw);
    if (!session || !session.token) return null;
    return session;
  } catch {
    return null;
  }
}

/**
 * Step 1: Submit Admin Email & Password.
 * Backend verifies credentials and dispatches 6-digit OTP to admin Gmail.
 */
export async function login(emailInput: string, passwordInput: string): Promise<LoginResult> {
  const email = emailInput.trim();
  const password = passwordInput.trim();

  if (!email || !password) {
    return {
      success: false,
      error: 'Please enter both your Admin User ID / Email and Password.'
    };
  }

  const apiUrl = getApiBaseUrl();
  const targetUrl = apiUrl ? `${apiUrl}/api/admin/login` : '/api/admin/login';

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Authentication failed. Please verify your credentials.'
      };
    }

    if (data.step === 'otp_required' || data.step === '2fa_required') {
      return {
        success: true,
        otpRequired: true,
        tempSessionId: data.tempSessionId,
        email: data.email || email,
        expiresIn: data.expiresIn || 300,
        resendCooldown: data.resendCooldown || 60
      };
    }

    // Direct session fallback if 2FA disabled on server
    if (data.token) {
      const session: UserSession = {
        id: data.user?.id || 'admin-user',
        email: data.user?.email || email,
        name: data.user?.name || 'Administrator',
        role: data.user?.role || 'ADMIN',
        department: data.user?.department || 'School Administration',
        token: data.token
      };
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
      return { success: true, session };
    }

    return {
      success: false,
      error: 'Unexpected response from administration server.'
    };
  } catch (err) {
    console.error('[AuthService Error]:', err);
    return {
      success: false,
      error: 'Unable to connect to administration authentication server. Please check your network or try again.'
    };
  }
}

/**
 * Step 2: Verify 6-digit OTP code received in email.
 */
export async function verifyOtp(tempSessionId: string, otpInput: string): Promise<VerifyOtpResult> {
  const otp = otpInput.trim();

  if (!tempSessionId || !otp || otp.length !== 6) {
    return {
      success: false,
      error: 'Please enter the complete 6-digit verification code.'
    };
  }

  const apiUrl = getApiBaseUrl();
  const targetUrl = apiUrl ? `${apiUrl}/api/admin/verify-otp` : '/api/admin/verify-otp';

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempSessionId, otp })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Invalid verification code. Please try again.'
      };
    }

    const session: UserSession = {
      id: data.user?.id || 'adm-user',
      email: data.user?.email || '',
      name: data.user?.name || 'Administrator',
      role: data.user?.role || 'ADMIN',
      department: data.user?.department || 'School Administration',
      token: data.token
    };

    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    return { success: true, session };
  } catch (err) {
    console.error('[AuthService verifyOtp Error]:', err);
    return {
      success: false,
      error: 'Server verification failed. Please check network connection.'
    };
  }
}

/**
 * Resend 6-digit verification code with server cooldown enforcement.
 */
export async function resendOtp(tempSessionId: string): Promise<ResendOtpResult> {
  if (!tempSessionId) {
    return { success: false, error: 'Session expired. Please sign in again.' };
  }

  const apiUrl = getApiBaseUrl();
  const targetUrl = apiUrl ? `${apiUrl}/api/admin/resend-otp` : '/api/admin/resend-otp';

  try {
    const response = await fetch(targetUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tempSessionId })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        error: data.error || 'Failed to resend code.',
        retryAfter: data.retryAfter
      };
    }

    return {
      success: true,
      message: data.message,
      expiresIn: data.expiresIn || 300,
      resendCooldown: data.resendCooldown || 60
    };
  } catch (err) {
    console.error('[AuthService resendOtp Error]:', err);
    return {
      success: false,
      error: 'Network error while requesting new verification code.'
    };
  }
}

/**
 * Terminate active administrator session.
 */
export function logout(): void {
  try {
    const apiUrl = getApiBaseUrl();
    const targetUrl = apiUrl ? `${apiUrl}/api/admin/logout` : '/api/admin/logout';
    fetch(targetUrl, { method: 'POST' }).catch(() => {});
  } catch {
    // ignore
  } finally {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  }
}
