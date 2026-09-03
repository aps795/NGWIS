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
  EnquiryStatus
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
  | 'admin';

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
  selectedGalleryImage: GalleryItem | null;
  setSelectedGalleryImage: (item: GalleryItem | null) => void;
  activeNoticeModal: Notice | null;
  setActiveNoticeModal: (notice: Notice | null) => void;
  resetToDefaults: () => void;
}

const SchoolDataContext = createContext<SchoolDataContextType | undefined>(undefined);

const STORAGE_PREFIX = 'ngwis_school_v4_';

export const SchoolDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentView, setCurrentViewRaw] = useState<PageView>('home');

  // Handle URL hash sync
  const setCurrentView = (view: PageView) => {
    setCurrentViewRaw(view);
    window.location.hash = view;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash.replace('#', '') as PageView;
      const validViews: PageView[] = [
        'home', 'about', 'academics', 'facilities', 'activities',
        'gallery', 'admissions', 'notices', 'contact', 'admin'
      ];
      if (validViews.includes(hash)) {
        setCurrentViewRaw(hash);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
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
      const parsed = JSON.parse(saved);
      const existingIds = new Set(parsed.map((item: GalleryItem) => item.id));
      const missing = initialGallery.filter(item => !existingIds.has(item.id));
      return [...missing, ...parsed];
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

  // Modals
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<GalleryItem | null>(null);
  const [activeNoticeModal, setActiveNoticeModal] = useState<Notice | null>(null);

  // Sync to localStorage
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
    localStorage.setItem(`${STORAGE_PREFIX}gallery`, JSON.stringify(gallery));
  }, [gallery]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}testimonials`, JSON.stringify(testimonials));
  }, [testimonials]);

  useEffect(() => {
    localStorage.setItem(`${STORAGE_PREFIX}enquiries`, JSON.stringify(enquiries));
  }, [enquiries]);

  // Actions
  const updateSettings = (newSettings: Partial<SchoolSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const addNotice = (noticeData: Omit<Notice, 'id'>) => {
    const newNotice: Notice = {
      ...noticeData,
      id: `not-${Date.now()}`
    };
    setNotices((prev) => [newNotice, ...prev]);
  };

  const updateNotice = (updated: Notice) => {
    setNotices((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
  };

  const deleteNotice = (id: string) => {
    setNotices((prev) => prev.filter((n) => n.id !== id));
  };

  const togglePublishNotice = (id: string) => {
    setNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isPublished: !n.isPublished } : n))
    );
  };

  const addEvent = (eventData: Omit<SchoolEvent, 'id'>) => {
    const newEvent: SchoolEvent = {
      ...eventData,
      id: `evt-${Date.now()}`
    };
    setEvents((prev) => [newEvent, ...prev]);
  };

  const updateEvent = (updated: SchoolEvent) => {
    setEvents((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));
  };

  const deleteEvent = (id: string) => {
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  const addGalleryItem = (itemData: Omit<GalleryItem, 'id'>) => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}`
    };
    setGallery((prev) => [newItem, ...prev]);
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
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

  const resetToDefaults = () => {
    localStorage.removeItem(`${STORAGE_PREFIX}settings`);
    localStorage.removeItem(`${STORAGE_PREFIX}notices`);
    localStorage.removeItem(`${STORAGE_PREFIX}events`);
    localStorage.removeItem(`${STORAGE_PREFIX}gallery`);
    localStorage.removeItem(`${STORAGE_PREFIX}testimonials`);
    localStorage.removeItem(`${STORAGE_PREFIX}enquiries`);
    setSettings(initialSchoolSettings);
    setNotices(initialNotices);
    setEvents(initialEvents);
    setGallery(initialGallery);
    setTestimonials(initialTestimonials);
    setEnquiries(initialEnquiries);
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
