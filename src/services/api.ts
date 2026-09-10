/**
 * NGWIS Client API Service
 * Connects to the backend REST API (/api/*), persists data,
 * and triggers administrative email dispatches.
 */

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
  trackingId?: string;
  [key: string]: any;
}

const getApiBaseUrl = (): string => {
  let url = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/$/, '');
  if (url.includes('aps795s-projects.vercel.app')) return '';
  if (url.endsWith('/api')) url = url.slice(0, -4);
  return url;
};

// Helper fetch wrapper with timeout and automatic same-origin fallback
export async function apiFetch<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const base = getApiBaseUrl();
  const normalizedEndpoint = endpoint.startsWith('/api')
    ? endpoint
    : `/api${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const primaryUrl = base ? `${base}${normalizedEndpoint}` : normalizedEndpoint;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 12000);

  try {
    const res = await fetch(primaryUrl, {
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
    console.warn(`[NGWIS API Warning] ${primaryUrl} failed:`, err.message || err);

    // If external primary URL failed, retry same-origin relative URL
    if (base && primaryUrl !== normalizedEndpoint) {
      try {
        const fallbackRes = await fetch(normalizedEndpoint, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...(options.headers || {})
          }
        });
        const fallbackJson = await fallbackRes.json();
        return fallbackJson;
      } catch (fallbackErr: any) {
        return { success: false, error: fallbackErr.message || 'Network error' };
      }
    }

    return {
      success: false,
      error: err.name === 'AbortError' ? 'Server timeout' : (err.message || 'Network error')
    };
  } finally {
    clearTimeout(timeoutId);
  }
}

// 1. Submit Admission Enquiry -> Saves in DB and emails newglobalwisdominternationalsc@gmail.com
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
