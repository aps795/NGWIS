import type { GalleryItem } from '../types/school';

const DB_NAME = 'ngwis_gallery_db';
const DB_VERSION = 1;
const STORE_NAME = 'gallery_items';

/**
 * Open or upgrade the IndexedDB database for gallery items
 */
function openGalleryDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      resolve(null);
      return;
    }

    try {
      const request = window.indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event: IDBVersionChangeEvent) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        }
      };

      request.onsuccess = () => {
        resolve(request.result);
      };

      request.onerror = (err) => {
        console.warn('[IndexedDB] Failed to open gallery database:', err);
        resolve(null);
      };
    } catch (err) {
      console.warn('[IndexedDB] Exception opening gallery database:', err);
      resolve(null);
    }
  });
}

/**
 * Retrieve all custom or persisted gallery items from IndexedDB
 */
export async function getAllIndexedDbGallery(): Promise<GalleryItem[]> {
  const db = await openGalleryDb();
  if (!db) return [];

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readonly');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.getAll();

      request.onsuccess = () => {
        const results = request.result as GalleryItem[];
        resolve(Array.isArray(results) ? results : []);
      };

      request.onerror = () => {
        resolve([]);
      };
    } catch (err) {
      console.warn('[IndexedDB] Error fetching gallery items:', err);
      resolve([]);
    }
  });
}

/**
 * Save or update a single gallery item in IndexedDB
 */
export async function saveGalleryItemIndexedDb(item: GalleryItem): Promise<boolean> {
  const db = await openGalleryDb();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.put(item);

      request.onsuccess = () => resolve(true);
      request.onerror = (err) => {
        console.warn('[IndexedDB] Error storing gallery item:', err);
        resolve(false);
      };
    } catch (err) {
      console.warn('[IndexedDB] Exception saving gallery item:', err);
      resolve(false);
    }
  });
}

/**
 * Delete a single gallery item by ID from IndexedDB
 */
export async function deleteGalleryItemIndexedDb(id: string): Promise<boolean> {
  const db = await openGalleryDb();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.delete(id);

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    } catch (err) {
      console.warn('[IndexedDB] Exception deleting gallery item:', err);
      resolve(false);
    }
  });
}

/**
 * Batch save multiple gallery items into IndexedDB
 */
export async function saveAllGalleryIndexedDb(items: GalleryItem[]): Promise<boolean> {
  const db = await openGalleryDb();
  if (!db || !Array.isArray(items) || items.length === 0) return false;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);

      for (const item of items) {
        if (item && item.id) {
          store.put(item);
        }
      }

      transaction.oncomplete = () => resolve(true);
      transaction.onerror = () => resolve(false);
    } catch (err) {
      console.warn('[IndexedDB] Exception bulk saving gallery items:', err);
      resolve(false);
    }
  });
}

/**
 * Clear all gallery items from IndexedDB (e.g. upon admin reset)
 */
export async function clearGalleryIndexedDb(): Promise<boolean> {
  const db = await openGalleryDb();
  if (!db) return false;

  return new Promise((resolve) => {
    try {
      const transaction = db.transaction([STORE_NAME], 'readwrite');
      const store = transaction.objectStore(STORE_NAME);
      const request = store.clear();

      request.onsuccess = () => resolve(true);
      request.onerror = () => resolve(false);
    } catch (err) {
      console.warn('[IndexedDB] Exception clearing gallery store:', err);
      resolve(false);
    }
  });
}
