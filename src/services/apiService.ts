import type { Notice, SchoolEvent, GalleryItem } from '../types/school';
import { getCurrentSession } from '../auth/authService';

const getApiBaseUrl = (): string => {
  let url = (import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || '').trim();
  url = url.replace(/\/$/, '');
  if (url.includes('aps795s-projects.vercel.app')) {
    return '';
  }
  if (url.endsWith('/api')) {
    url = url.slice(0, -4);
  }
  return url;
};

const getHeaders = (token?: string) => {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json'
  };
  const activeToken = token || getCurrentSession()?.token;
  if (activeToken) {
    headers['Authorization'] = `Bearer ${activeToken}`;
  }
  return headers;
};

// ==================== GALLERY API ====================

export async function fetchGalleryApi(): Promise<GalleryItem[] | null> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/gallery` : '/api/gallery';
  try {
    const res = await fetch(url, { headers: { credentials: 'omit' } });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && Array.isArray(data.gallery)) {
      return data.gallery;
    }
    return null;
  } catch (err) {
    console.warn('[ApiService] Failed to fetch gallery from server:', err);
    return null;
  }
}

export async function createGalleryItemApi(
  item: Omit<GalleryItem, 'id'>,
  token?: string
): Promise<GalleryItem | null> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/gallery` : '/api/gallery';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(item)
    });
    const data = await res.json();
    if (data.success && data.item) {
      return data.item;
    }
    return null;
  } catch (err) {
    console.warn('[ApiService] Failed to upload gallery photo to server:', err);
    return null;
  }
}

export async function deleteGalleryItemApi(id: string, token?: string): Promise<boolean> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/gallery/${id}` : `/api/gallery/${id}`;
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.warn('[ApiService] Failed to delete gallery item from server:', err);
    return false;
  }
}

// ==================== NOTICES API ====================

export async function fetchNoticesApi(publishedOnly = true): Promise<Notice[] | null> {
  const base = getApiBaseUrl();
  const query = publishedOnly ? '?publishedOnly=true' : '';
  const url = base ? `${base}/api/notices${query}` : `/api/notices${query}`;
  try {
    const res = await fetch(url, { headers: getHeaders() });
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && Array.isArray(data.notices)) {
      return data.notices;
    }
    return null;
  } catch (err) {
    console.warn('[ApiService] Failed to fetch notices from server:', err);
    return null;
  }
}

export async function createNoticeApi(
  notice: Omit<Notice, 'id'>,
  token?: string
): Promise<Notice | null> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/notices` : '/api/notices';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(notice)
    });
    const data = await res.json();
    if (data.success && data.notice) {
      return data.notice;
    }
    return null;
  } catch (err) {
    console.warn('[ApiService] Failed to create notice on server:', err);
    return null;
  }
}

export async function updateNoticeApi(
  id: string,
  updates: Partial<Notice>,
  token?: string
): Promise<Notice | null> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/notices/${id}` : `/api/notices/${id}`;
  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: getHeaders(token),
      body: JSON.stringify(updates)
    });
    const data = await res.json();
    if (data.success && data.notice) {
      return data.notice;
    }
    return null;
  } catch (err) {
    console.warn('[ApiService] Failed to update notice on server:', err);
    return null;
  }
}

export async function deleteNoticeApi(id: string, token?: string): Promise<boolean> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/notices/${id}` : `/api/notices/${id}`;
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.warn('[ApiService] Failed to delete notice from server:', err);
    return false;
  }
}

// ==================== EVENTS API ====================

export async function fetchEventsApi(): Promise<SchoolEvent[] | null> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/events` : '/api/events';
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();
    if (data.success && Array.isArray(data.events)) {
      return data.events;
    }
    return null;
  } catch (err) {
    console.warn('[ApiService] Failed to fetch events from server:', err);
    return null;
  }
}

export async function createEventApi(
  event: Omit<SchoolEvent, 'id'>,
  token?: string
): Promise<SchoolEvent | null> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/events` : '/api/events';
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: getHeaders(token),
      body: JSON.stringify(event)
    });
    const data = await res.json();
    if (data.success && data.event) {
      return data.event;
    }
    return null;
  } catch (err) {
    console.warn('[ApiService] Failed to create event on server:', err);
    return null;
  }
}

export async function deleteEventApi(id: string, token?: string): Promise<boolean> {
  const base = getApiBaseUrl();
  const url = base ? `${base}/api/events/${id}` : `/api/events/${id}`;
  try {
    const res = await fetch(url, {
      method: 'DELETE',
      headers: getHeaders(token)
    });
    const data = await res.json();
    return Boolean(data.success);
  } catch (err) {
    console.warn('[ApiService] Failed to delete event from server:', err);
    return false;
  }
}
