/**
 * NGWIS Client API Service
 * Connects to the backend REST API if VITE_API_BASE_URL is provided,
 * otherwise transparently falls back to local storage and offline services.
 */

const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const isBackendConfigured = (): boolean => {
  return Boolean(API_BASE_URL);
};

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  [key: string]: any;
}

// Helper fetch wrapper with timeout
async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  if (!API_BASE_URL) {
    return { success: false, error: 'No backend API configured.' };
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      },
      signal: controller.signal
    });

    const json = await res.json();
    return json;
  } catch (err: any) {
    console.warn(`[NGWIS API Warning] ${endpoint}:`, err.message || err);
    return {
      success: false,
      error: err.name === 'AbortError' ? 'Server timeout' : (err.message || 'Network error')
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

// 1. Submit Admission Enquiry
export async function apiSubmitEnquiry(enquiry: {
  studentName: string;
  parentName: string;
  classApplying: string;
  mobile: string;
  email?: string;
  address?: string;
  message?: string;
}) {
  return apiFetch('/enquiries', {
    method: 'POST',
    body: JSON.stringify(enquiry)
  });
}

// 2. Submit Contact Us Message
export async function apiSubmitContact(contact: {
  name: string;
  mobile: string;
  email?: string;
  subject?: string;
  message: string;
}) {
  return apiFetch('/contact', {
    method: 'POST',
    body: JSON.stringify(contact)
  });
}

// 3. Admin Authentication Step 1 (Login)
export async function apiAdminLogin(email: string, password: string) {
  return apiFetch('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password })
  });
}

// 4. Admin Authentication Step 2 (Verify 2FA)
export async function apiAdminVerify2FA(tempSessionId: string, code: string) {
  return apiFetch('/auth/verify-2fa', {
    method: 'POST',
    body: JSON.stringify({ tempSessionId, code })
  });
}

// 5. Fetch Notices
export async function apiFetchNotices() {
  return apiFetch('/notices');
}

// 6. Fetch Events
export async function apiFetchEvents() {
  return apiFetch('/events');
}
