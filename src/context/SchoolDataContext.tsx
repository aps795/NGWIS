import React, { createContext, useContext, useState, useEffect } from 'react';
import type {
  SchoolSettings,
  Notice,
  SchoolEvent,
  Facility,
  ActivityItem,
  GalleryItem,
  Testimonial,
  AdmissionEnquiry,
  EnquiryStatus,
  FacultyMember
} from '../types/school';
import {
  initialSchoolSettings,
  initialNotices,
  initialEvents,
  initialFacilities,
  initialActivities,
  initialGallery,
  initialTestimonials,
  initialEnquiries
} from '../data/initialData';
import { facultyList } from '../data/facultyData';
import { getCurrentSession } from '../auth/authService';
import {
  fetchGalleryApi,
  createGalleryItemApi,
  deleteGalleryItemApi,
  fetchNoticesApi,
  createNoticeApi,
  updateNoticeApi,
  deleteNoticeApi,
  fetchEventsApi,
  createEventApi,
  deleteEventApi,
  fetchFacultyApi,
  createFacultyApi,
  updateFacultyApi,
  deleteFacultyApi
} from '../services/apiService';

import {
  getAllIndexedDbGallery,
  saveGalleryItemIndexedDb,
  deleteGalleryItemIndexedDb,
  saveAllGalleryIndexedDb,
  clearGalleryIndexedDb
} from '../utils/indexedDbStore';

export type PageView =
  | 'home'
  | 'about'
  | 'academics'
  | 'facilities'
  | 'activities'
  | 'gallery'
  | 'admissions'
  | 'notices'
  | 'contact'
  | 'admin-login'
  | 'admin-dashboard'
  | 'faculty';

interface SchoolDataContextType {
  currentView: PageView;
  setCurrentView: (view: PageView) => void;
  settings: SchoolSettings;
  updateSettings: (newSettings: Partial<SchoolSettings>) => void;
  notices: Notice[];
  addNotice: (notice: Omit<Notice, 'id'>) => void;
  updateNotice: (notice: Notice) => void;
  deleteNotice: (id: string) => void;
  togglePublishNotice: (id: string) => void;
  events: SchoolEvent[];
  addEvent: (event: Omit<SchoolEvent, 'id'>) => void;
  updateEvent: (event: SchoolEvent) => void;
  deleteEvent: (id: string) => void;
  facilities: Facility[];
  activities: ActivityItem[];
  gallery: GalleryItem[];
  addGalleryItem: (item: Omit<GalleryItem, 'id'>) => void;
  deleteGalleryItem: (id: string) => void;
  testimonials: Testimonial[];
  addTestimonial: (item: Omit<Testimonial, 'id'>) => void;
  enquiries: AdmissionEnquiry[];
  addEnquiry: (enquiryData: {
    studentName: string;
    parentName: string;
    classApplying: string;
    mobile: string;
    email?: string;
    address?: string;
    message?: string;
  }) => string;
  updateEnquiryStatus: (id: string, status: EnquiryStatus, adminNotes?: string) => void;
  deleteEnquiry: (id: string) => void;
  faculty: FacultyMember[];
  addFacultyMember: (member: Omit<FacultyMember, 'id'> & { id?: number }) => void;
  updateFacultyMember: (member: FacultyMember) => void;
  deleteFacultyMember: (id: number) => void;
  reorderFaculty: (newList: FacultyMember[]) => void;
  selectedGalleryImage: GalleryItem | null;
  setSelectedGalleryImage: (item: GalleryItem | null) => void;
  activeNoticeModal: Notice | null;
  setActiveNoticeModal: (notice: Notice | null) => void;
  resetToDefaults: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const STORAGE_PREFIX = 'ngwis_school_v7_';

const getInitialView = (): PageView => {
  try {
    const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const rawHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');

    const isLegacyAdmin =
      rawPath === '/admin' ||
      rawHash === 'admin' ||
      rawHash === 'admin#admin' ||
      rawHash === '/admin';

    if (isLegacyAdmin) {
      const session = getCurrentSession();
      return session ? 'admin-dashboard' : 'admin-login';
    }

    const isAdminLogin =
      rawPath === '/admin/login' ||
      rawPath === '/admin-login' ||
      rawHash === 'admin/login' ||
      rawHash === 'admin-login' ||
      rawHash === '/admin/login';

    if (isAdminLogin) {
      const session = getCurrentSession();
      return session ? 'admin-dashboard' : 'admin-login';
    }

    const isAdminDashboard =
      rawPath === '/admin/dashboard' ||
      rawPath === '/admin-dashboard' ||
      rawHash === 'admin/dashboard' ||
      rawHash === 'admin-dashboard' ||
      rawHash === '/admin/dashboard';

    if (isAdminDashboard) {
      const session = getCurrentSession();
      return session ? 'admin-dashboard' : 'admin-login';
    }

    // For the Public Portal: Whenever refreshed or loaded from scratch, by default open 'home'
    try {
      if (rawHash && !rawHash.includes('admin')) {
        window.location.hash = '';
      }
      if (rawPath !== '/' && !rawPath.includes('admin')) {
        window.history.replaceState(null, '', '/' + (window.location.search || ''));
      }
    } catch {}

    return 'home';
  } catch {
    return 'home';
  }
};

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentViewRaw] = useState<PageView>(getInitialView);

  // Handle URL navigation and route protection
  const setCurrentView = (view: PageView) => {
    // If attempting to go to admin-dashboard, verify session
    if (view === 'admin-dashboard') {
      const session = getCurrentSession();
      if (!session) {
        setCurrentViewRaw('admin-login');
        try {
          window.history.pushState(null, '', '/admin/login');
          window.location.hash = 'admin/login';
        } catch {}
        window.scrollTo({ top: 0, behavior: 'smooth' });
        return;
      }
    }

    setCurrentViewRaw(view);

    try {
      if (view === 'admin-login') {
        window.history.pushState(null, '', '/admin/login');
        window.location.hash = 'admin/login';
      } else if (view === 'admin-dashboard') {
        window.history.pushState(null, '', '/admin/dashboard');
        window.location.hash = 'admin/dashboard';
      } else if (view === 'home') {
        window.history.pushState(null, '', '/');
        window.location.hash = '';
      } else {
        window.history.pushState(null, '', `/${view}`);
        window.location.hash = view;
      }
    } catch {}

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleRoute = () => {
      const rawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
      const rawHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');

      // 1. Check for legacy admin routes (/admin, /admin#admin, #/admin, #admin)
      const isLegacyAdmin =
        rawPath === '/admin' ||
        rawHash === 'admin' ||
        rawHash === 'admin#admin' ||
        rawHash === '/admin';

      if (isLegacyAdmin) {
        const session = getCurrentSession();
        if (session) {
          try {
            window.history.replaceState(null, '', '/admin/dashboard');
            window.location.hash = 'admin/dashboard';
          } catch {}
          setCurrentViewRaw('admin-dashboard');
        } else {
          try {
            window.history.replaceState(null, '', '/admin/login');
            window.location.hash = 'admin/login';
          } catch {}
          setCurrentViewRaw('admin-login');
        }
        return;
      }

      // 2. Check for admin login (/admin/login, /admin-login, #admin/login, #admin-login)
      const isAdminLogin =
        rawPath === '/admin/login' ||
        rawPath === '/admin-login' ||
        rawHash === 'admin/login' ||
        rawHash === 'admin-login' ||
        rawHash === '/admin/login';

      if (isAdminLogin) {
        const session = getCurrentSession();
        if (session) {
          // If already logged in, redirect to dashboard
          try {
            window.history.replaceState(null, '', '/admin/dashboard');
            window.location.hash = 'admin/dashboard';
          } catch {}
          setCurrentViewRaw('admin-dashboard');
        } else {
          setCurrentViewRaw('admin-login');
        }
        return;
      }

      // 3. Check for admin dashboard (/admin/dashboard, /admin-dashboard, #admin/dashboard, #admin-dashboard)
      const isAdminDashboard =
        rawPath === '/admin/dashboard' ||
        rawPath === '/admin-dashboard' ||
        rawHash === 'admin/dashboard' ||
        rawHash === 'admin-dashboard' ||
        rawHash === '/admin/dashboard';

      if (isAdminDashboard) {
        const session = getCurrentSession();
        if (!session) {
          try {
            window.history.replaceState(null, '', '/admin/login');
            window.location.hash = 'admin/login';
          } catch {}
          setCurrentViewRaw('admin-login');
        } else {
          setCurrentViewRaw('admin-dashboard');
        }
        return;
      }

      // 4. Match public pages by path or hash
      const validPublicViews: PageView[] = [
        'home',
        'about',
        'academics',
        'faculty',
        'facilities',
        'activities',
        'gallery',
        'admissions',
        'notices',
        'contact'
      ];

      const pathView = rawPath.replace(/^\//, '') as PageView;
      const hashView = rawHash.replace(/^\//, '') as PageView;

      if (validPublicViews.includes(pathView)) {
        setCurrentViewRaw(pathView);
      } else if (validPublicViews.includes(hashView)) {
        setCurrentViewRaw(hashView);
      } else if (rawPath === '/' && (!rawHash || rawHash === 'home')) {
        setCurrentViewRaw('home');
      }
    };

    // Check if initial load is an admin route
    const initialRawPath = window.location.pathname.toLowerCase().replace(/\/+$/, '') || '/';
    const initialRawHash = window.location.hash.toLowerCase().replace(/^#\/?/, '');
    const isInitialAdmin =
      initialRawPath.includes('admin') ||
      initialRawHash.includes('admin');

    if (isInitialAdmin) {
      handleRoute();
    } else {
      // Public Portal refreshed or loaded: by default open home page
      setCurrentViewRaw('home');
      try {
        if (window.location.hash && !window.location.hash.toLowerCase().includes('admin')) {
          window.location.hash = '';
        }
        if (initialRawPath !== '/' && !initialRawPath.includes('admin')) {
          window.history.replaceState(null, '', '/' + (window.location.search || ''));
        }
      } catch {}
    }

    window.addEventListener('hashchange', handleRoute);
    window.addEventListener('popstate', handleRoute);
    return () => {
      window.removeEventListener('hashchange', handleRoute);
      window.removeEventListener('popstate', handleRoute);
    };
  }, []);

  // Settings
  const [settings, setSettings] = useState<SchoolSettings>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}settings`);
    return saved ? JSON.parse(saved) : initialSchoolSettings;
  });

  // Notices
  const [notices, setNotices] = useState<Notice[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}notices`);
    return saved ? JSON.parse(saved) : initialNotices;
  });

  // Events
  const [events, setEvents] = useState<SchoolEvent[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}events`);
    return saved ? JSON.parse(saved) : initialEvents;
  });

  // Facilities
  const [facilities] = useState<Facility[]>(initialFacilities);

  // Activities
  const [activities] = useState<ActivityItem[]>(initialActivities);

  // Gallery
  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}gallery`);
    if (!saved) return initialGallery;
    try {
      const parsed: GalleryItem[] = JSON.parse(saved);
      const filtered = parsed
        .filter(item => !item.imageUrl.includes('unsplash.com'))
        .map(item => ({
          ...item,
          imageUrl: item.imageUrl && item.imageUrl.startsWith('./') ? item.imageUrl.replace(/^\.\//, '/') : item.imageUrl
        }));
      const existingIds = new Set(filtered.map(item => item.id));
      const missing = initialGallery.filter(item => !existingIds.has(item.id));
      return [...missing, ...filtered];
    } catch {
      return initialGallery;
    }
  });

  // Testimonials
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}testimonials`);
    return saved ? JSON.parse(saved) : initialTestimonials;
  });

  // Enquiries
  const [enquiries, setEnquiries] = useState<AdmissionEnquiry[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}enquiries`);
    return saved ? JSON.parse(saved) : initialEnquiries;
  });

  // Faculty
  const [faculty, setFaculty] = useState<FacultyMember[]>(() => {
    const saved = localStorage.getItem(`${STORAGE_PREFIX}faculty`);
    if (!saved) return facultyList;
    try {
      const parsed: FacultyMember[] = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
      return facultyList;
    } catch {
      return facultyList;
    }
  });

  // Modals
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryItem | null>(null);
  const [activeNoticeModal, setActiveNoticeModal] = useState<Notice | null>(null);

  // Load persisted photos from IndexedDB on startup (overcoming localStorage 5MB limit)
  useEffect(() => {
    let isMounted = true;
    getAllIndexedDbGallery().then((indexedItems) => {
      if (!isMounted || !indexedItems || indexedItems.length === 0) return;
      setGallery((prev) => {
        const itemMap = new Map(prev.map(item => [item.id, item]));
        for (const item of indexedItems) {
          itemMap.set(item.id, item);
        }
        const merged = Array.from(itemMap.values());
        const mergedIds = new Set(merged.map(item => item.id));
        const missingInitial = initialGallery.filter(item => !mergedIds.has(item.id));
        return [...missingInitial, ...merged];
      });
    }).catch((err) => {
      console.warn('[SchoolDataContext] IndexedDB load notice:', err);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Sync to localStorage & IndexedDB
  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}settings`, JSON.stringify(settings));
  }, [settings]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}notices`, JSON.stringify(notices));
  }, [notices]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}events`, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}gallery`, JSON.stringify(gallery));
    } catch (err) {
      console.warn('LocalStorage gallery quota notice (IndexedDB handling persistence):', err);
    }
    // Always persist to IndexedDB asynchronously (no quota constraints)
    saveAllGalleryIndexedDb(gallery).catch((err) => {
      console.warn('[SchoolDataContext] IndexedDB save error:', err);
    });
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}testimonials`, JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}enquiries`, JSON.stringify(enquiries));
  }, [enquiries]);

  useEffect(() => {
    try {
      localStorage.setItem(`${STORAGE_PREFIX}faculty`, JSON.stringify(faculty));
    } catch (err) {
      console.warn('LocalStorage faculty quota notice:', err);
    }
  }, [faculty]);


  // Live Background Sync with Server API (Notices, Events, Gallery)
  useEffect(() => {
    let isMounted = true;

    const syncWithBackend = async () => {
      try {
        const [serverGallery, serverNotices, serverEvents, serverFaculty] = await Promise.all([
          fetchGalleryApi(),
          fetchNoticesApi(),
          fetchEventsApi(),
          fetchFacultyApi()
        ]);

        if (!isMounted) return;

        if (serverGallery && Array.isArray(serverGallery) && serverGallery.length > 0) {
          const normalizedServer = serverGallery.map(g => ({
            ...g,
            imageUrl: g.imageUrl && g.imageUrl.startsWith('./') ? g.imageUrl.replace(/^\.\//, '/') : g.imageUrl
          }));
          setGallery((prev) => {
            const serverIds = new Set(normalizedServer.map((g) => g.id));
            const unsyncedLocal = prev.filter(
              (p) => !serverIds.has(p.id) && (
                p.id.startsWith('gal-') ||
                p.imageUrl.startsWith('data:') ||
                p.imageUrl.startsWith('blob:') ||
                p.imageUrl.includes('googleusercontent.com')
              )
            );
            const combined = [...unsyncedLocal, ...normalizedServer];
            saveAllGalleryIndexedDb(combined).catch(console.warn);
            return combined;
          });
        }

        if (serverNotices && Array.isArray(serverNotices) && serverNotices.length > 0) {
          setNotices((prev) => {
            const serverIds = new Set(serverNotices.map((n) => n.id));
            const unsyncedLocal = prev.filter(
              (p) => !serverIds.has(p.id) && p.id.startsWith('not-')
            );
            return [...unsyncedLocal, ...serverNotices];
          });
        }

        if (serverEvents && Array.isArray(serverEvents) && serverEvents.length > 0) {
          setEvents((prev) => {
            const serverIds = new Set(serverEvents.map((e) => e.id));
            const unsyncedLocal = prev.filter(
              (p) => !serverIds.has(p.id) && p.id.startsWith('evt-')
            );
            return [...unsyncedLocal, ...serverEvents];
          });
        }

        if (serverFaculty && Array.isArray(serverFaculty) && serverFaculty.length > 0) {
          setFaculty(serverFaculty);
        }
      } catch (err) {
        console.warn('[SchoolDataContext] Background sync note:', err);
      }
    };

    syncWithBackend();

    const handleVisibilityOrFocus = () => {
      if (document.visibilityState === 'visible') {
        syncWithBackend();
      }
    };

    window.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);

    // Periodic sync every 45 seconds so all visitors get real-time updates
    const intervalId = setInterval(syncWithBackend, 45000);

    return () => {
      isMounted = false;
      window.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      clearInterval(intervalId);
    };
  }, []);

  // Actions
  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addNotice = (noticeData: Omit<Notice, 'id'>) => {
    const tempId = `not-${Date.now()}`;
    const newNotice: Notice = {
      ...noticeData,
      id: tempId
    };
    setNotices((prev) => [newNotice, ...prev]);

    createNoticeApi(noticeData).then((saved) => {
      if (saved && saved.id) {
        setNotices((prev) =>
          prev.map((n) => (n.id === tempId ? saved : n))
        );
      }
    }).catch((err) => {
      console.warn('[SchoolDataContext] Server notice sync warning:', err);
    });
  };

  const updateNotice = (updated: Notice) => {
    setNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    updateNoticeApi(updated.id, updated).catch((err) => {
      console.warn('[SchoolDataContext] Server notice update warning:', err);
    });
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
    deleteNoticeApi(id).catch((err) => {
      console.warn('[SchoolDataContext] Server notice delete warning:', err);
    });
  };

  const togglePublishNotice = (id: string) => {
    let targetNotice: Notice | undefined;
    setNotices((prev) =>
      prev.map((n) => {
        if (n.id === id) {
          targetNotice = { ...n, isPublished: !n.isPublished };
          return targetNotice;
        }
        return n;
      })
    );
    if (targetNotice) {
      updateNoticeApi(id, { isPublished: (targetNotice as Notice).isPublished }).catch((err) => {
        console.warn('[SchoolDataContext] Server notice toggle warning:', err);
      });
    }
  };

  const addEvent = (eventData: Omit<SchoolEvent, 'id'>) => {
    const tempId = `evt-${Date.now()}`;
    const newEvent: SchoolEvent = {
      ...eventData,
      id: tempId
    };
    setEvents((prev) => [newEvent, ...prev]);

    createEventApi(eventData).then((saved) => {
      if (saved && saved.id) {
        setEvents((prev) =>
          prev.map((e) => (e.id === tempId ? saved : e))
        );
      }
    }).catch((err) => {
      console.warn('[SchoolDataContext] Server event sync warning:', err);
    });
  };

  const updateEvent = (updated: SchoolEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
    deleteEventApi(id).catch((err) => {
      console.warn('[SchoolDataContext] Server event delete warning:', err);
    });
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const tempId = `gal-${Date.now()}`;
    const newItem: GalleryItem = {
      ...itemData,
      id: tempId
    };
    setGallery((prev) => [newItem, ...prev]);
    saveGalleryItemIndexedDb(newItem).catch(console.warn);

    createGalleryItemApi(itemData).then((saved) => {
      if (saved && saved.id) {
        setGallery((prev) =>
          prev.map((item) => (item.id === tempId ? saved : item))
        );
        saveGalleryItemIndexedDb(saved).catch(console.warn);
      }
    }).catch((err) => {
      console.warn('[SchoolDataContext] Server gallery sync warning:', err);
    });
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
    deleteGalleryItemIndexedDb(id).catch(console.warn);
    deleteGalleryItemApi(id).catch((err) => {
      console.warn('[SchoolDataContext] Server gallery delete warning:', err);
    });
  };

  const addTestimonial = (itemData: Omit<Testimonial, 'id'>) => {
    const newItem: Testimonial = {
      ...itemData,
      id: `test-${Date.now()}`
    };
    setTestimonials((prev) => [newItem, ...prev]);
  };

  const addEnquiry = (enquiryData: {
    studentName: string;
    parentName: string;
    classApplying: string;
    mobile: string;
    email?: string;
    address?: string;
    message?: string;
  }) => {
    const now = new Date();
    const dateFormatted = now.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    const id = `ENQ-${Math.floor(100000 + Math.random() * 900000)}`;
    const newEnquiry: AdmissionEnquiry = {
      id,
      ...enquiryData,
      submittedAt: dateFormatted,
      status: 'New'
    };
    setEnquiries((prev) => [newEnquiry, ...prev]);
    return id;
  };

  const updateEnquiryStatus = (id: string, status: EnquiryStatus, adminNotes?: string) => {
    setEnquiries((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status,
              ...(adminNotes !== undefined ? { adminNotes } : {})
            }
          : item
      )
    );
  };

  const deleteEnquiry = (id: string) => {
    setEnquiries((prev) => prev.filter((e) => e.id !== id));
  };

  const addFacultyMember = (memberData: Omit<FacultyMember, 'id'> & { id?: number }) => {
    let assignedId = memberData.id;
    setFaculty((prev) => {
      if (!assignedId || isNaN(assignedId)) {
        const maxId = prev.reduce((max, f) => Math.max(max, Number(f.id) || 0), 0);
        assignedId = maxId + 1;
      }
      const newMember: FacultyMember = {
        ...memberData,
        id: assignedId
      };
      return [...prev, newMember].sort((a, b) => a.id - b.id);
    });

    createFacultyApi({ ...memberData, id: assignedId }).catch((err) => {
      console.warn('[SchoolDataContext] Server faculty create warning:', err);
    });
  };

  const updateFacultyMember = (updated: FacultyMember) => {
    setFaculty((prev) =>
      prev
        .map((f) => (Number(f.id) === Number(updated.id) ? updated : f))
        .sort((a, b) => a.id - b.id)
    );

    updateFacultyApi(updated.id, updated).catch((err) => {
      console.warn('[SchoolDataContext] Server faculty update warning:', err);
    });
  };

  const deleteFacultyMember = (id: number) => {
    setFaculty((prev) => prev.filter((f) => Number(f.id) !== Number(id)));

    deleteFacultyApi(id).catch((err) => {
      console.warn('[SchoolDataContext] Server faculty delete warning:', err);
    });
  };

  const reorderFaculty = (newList: FacultyMember[]) => {
    setFaculty(newList);
  };

  const resetToDefaults = () => {
    localStorage.removeItem(`${STORAGE_PREFIX}settings`);
    localStorage.removeItem(`${STORAGE_PREFIX}notices`);
    localStorage.removeItem(`${STORAGE_PREFIX}events`);
    localStorage.removeItem(`${STORAGE_PREFIX}gallery`);
    localStorage.removeItem(`${STORAGE_PREFIX}testimonials`);
    localStorage.removeItem(`${STORAGE_PREFIX}enquiries`);
    localStorage.removeItem(`${STORAGE_PREFIX}faculty`);
    clearGalleryIndexedDb().catch(console.warn);
    setSettings(initialSchoolSettings);
    setNotices(initialNotices);
    setEvents(initialEvents);
    setGallery(initialGallery);
    setTestimonials(initialTestimonials);
    setEnquiries(initialEnquiries);
    setFaculty(facultyList);
  };

  return (
    <SchoolDataContext.Provider
      value={{
        currentView,
        setCurrentView,
        settings,
        updateSettings,
        notices,
        addNotice,
        updateNotice,
        deleteNotice,
        togglePublishNotice,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        facilities,
        activities,
        gallery,
        addGalleryItem,
        deleteGalleryItem,
        testimonials,
        addTestimonial,
        enquiries,
        addEnquiry,
        updateEnquiryStatus,
        deleteEnquiry,
        faculty,
        addFacultyMember,
        updateFacultyMember,
        deleteFacultyMember,
        reorderFaculty,
        selectedGalleryImage,
        setSelectedGalleryImage,
        activeNoticeModal,
        setActiveNoticeModal,
        resetToDefaults
      }}
    >
      {children}
    </SchoolDataContext.Provider>
  );
};

export const useSchoolData = () => {
  const context = useContext(SchoolDataContext);
  if (!context) {
    throw new Error('useSchoolData must be used within a SchoolDataProvider');
  }
  return context;
};
