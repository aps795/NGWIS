/**
 * NGWIS Authentication Service
 * 
 * SECURITY COMPLIANCE:
 * - NO admin passwords, password hashes, or secrets are stored in this file.
 * - Communicates with the backend server via VITE_API_URL or VITE_API_BASE_URL.
 * - The backend is responsible for all credential and password verification.
 */

export interface UserSession {
  id: string;
  email: string;
  name: string;
  role: string;
  department?: string;
  token: string;
}

const STORAGE_KEY = 'ngwis_admin_session';

// Support both standard env variable names
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
 * Perform login request.
 * When backend API is available, calls POST ${API_URL}/api/auth/admin/login.
 * In local frontend-only mock development mode (no backend configured),
 * creates a mock development session without storing any credentials in the bundle.
 */
export async function login(
  emailInput: string,
  passwordInput: string,
  captchaResponse: string
): Promise<{ success: boolean; session?: UserSession; error?: string }> {
  const email = emailInput.trim();
  const password = passwordInput.trim();

  if (!email || !password) {
    return { success: false, error: 'Please enter both your Admin ID / Email and Password.' };
  }

  if (!captchaResponse || captchaResponse.trim() === '') {
    return { success: false, error: 'Please complete the verification challenge.' };
  }

  const apiUrl = getApiBaseUrl();

  // 1. Backend Integration Mode
  if (apiUrl) {
    try {
      const response = await fetch(`${apiUrl}/api/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          password,
          captcha: captchaResponse
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        return {
          success: false,
          error: data.error || 'Authentication failed. Please verify your credentials.'
        };
      }

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
    } catch (err: any) {
      console.error('[AuthService Error]:', err);
      return {
        success: false,
        error: 'Unable to connect to administration authentication server. Please check network.'
      };
    }
  }

  // 2. Frontend Development Mode (Backend not yet attached)
  // SECURITY: No passwords or password hashes are hardcoded here.
  // Requires properly formatted institutional email.
  const isValidFormat = email.includes('@') && email.length >= 5 && password.length >= 6;
  if (!isValidFormat) {
    return {
      success: false,
      error: 'Invalid credentials. Password must be at least 6 characters.'
    };
  }

  const devSession: UserSession = {
    id: 'admin_dev_' + Date.now(),
    email: email,
    name: email.split('@')[0].toUpperCase() + ' Administration',
    role: 'ADMIN',
    department: 'School Administration Desk',
    token: 'dev_token_' + Math.random().toString(36).substring(2)
  };

  sessionStorage.setItem(STORAGE_KEY, JSON.stringify(devSession));
  return { success: true, session: devSession };
}

/**
 * Terminate active session and clear storage.
 */
export function logout(): void {
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}
