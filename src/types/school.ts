export type NoticeCategory = 'Circular' | 'Holiday' | 'Examination' | 'Admission' | 'Event' | 'General';

export interface Notice {
  id: string;
  title: string;
  date: string;
  category: NoticeCategory;
  summary: string;
  content: string;
  isPinned?: boolean;
  isPublished: boolean;
  fileDownloadName?: string;
}

export type EventCategory = 'Sports' | 'Cultural' | 'Academic' | 'Celebration' | 'Meeting';

export interface SchoolEvent {
  id: string;
  title: string;
  date: string;
  time?: string;
  venue?: string;
  category: EventCategory;
  description: string;
  imageUrl: string;
}

export type EnquiryStatus = 'New' | 'Contacted' | 'Interaction Scheduled' | 'Enrolled' | 'Archived';

export interface AdmissionEnquiry {
  id: string;
  studentName: string;
  parentName: string;
  classApplying: string;
  mobile: string;
  email?: string;
  address?: string;
  message?: string;
  submittedAt: string;
  status: EnquiryStatus;
  adminNotes?: string;
}

export interface Facility {
  id: string;
  title: string;
  iconName: string;
  category: string;
  description: string;
  imageUrl: string;
  highlights: string[];
}

export interface ActivityItem {
  id: string;
  title: string;
  category: 'Sports' | 'Cultural' | 'Competitions' | 'Art & Creativity' | 'Celebrations' | 'Educational';
  description: string;
  imageUrl: string;
  featured?: boolean;
}

export type GalleryCategory =
  | 'All'
  | 'Campus'
  | 'Classrooms'
  | 'Sports'
  | 'Activities'
  | 'Events'
  | 'Celebrations'
  | 'Students'
  | 'Infrastructure';

export interface GalleryItem {
  id: string;
  title: string;
  category: Exclude<GalleryCategory, 'All'>;
  imageUrl: string;
  caption: string;
}

export interface Testimonial {
  id: string;
  authorName: string;
  relationship: string; // e.g. "Parent of Class 4 Student"
  text: string;
  isPlaceholder: boolean;
  verified: boolean;
}

export interface SchoolSettings {
  schoolName: string;
  tagline: string;
  subtitle: string;
  address: {
    line1: string;
    subLocality: string;
    tehsil: string;
    district: string;
    state: string;
    pincode: string;
    country: string;
  };
  phonePlaceholder: string;
  emailPlaceholder: string;
  whatsappPlaceholder: string;
  officeHours: string;
  facebookUrl: string;
  youtubeUrl?: string;
  instagramUrl?: string;
  principalTitle: string;
  principalName: string;
  principalMessage: string[];
  principalPhotoUrl: string;
  showStatistics: boolean;
  stats: {
    label: string;
    value: string;
    description: string;
  }[];
  admissionsOpen: boolean;
  admissionNote: string;
}
