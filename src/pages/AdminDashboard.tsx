import React, { useState, useRef } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';
import {
  Shield,
  FileText,
  Calendar,
  GraduationCap,
  Settings,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Download,
  RotateCcw,
  Search,
  CheckCircle,
  MessageSquare,
  Image,
  Home,
  LogOut,
  UserCheck,
  Printer,
  Phone,
  Mail,
  MapPin,
  X,
  MessageCircle,
  UploadCloud,
  Link as LinkIcon,
  HardDrive,
  Check,
  AlertCircle,
  FileUp
} from 'lucide-react';
import type { NoticeCategory, EnquiryStatus, AdmissionEnquiry } from '../types/school';
import { useAuth } from '../auth/AuthContext';
import {
  printEnquiryPDF,
  downloadEnquiryDoc,
  printEnquiriesReportPDF,
  downloadEnquiriesReportDoc
} from '../utils/enquiryDocuments';
import {
  convertGoogleDriveUrl,
  isGoogleDriveUrl,
  isGoogleDriveFolder,
  checkSocialWebpageUrl,
  compressImageFile,
  resolveImageUrl
} from '../utils/imageHelpers';

export const AdminDashboard: React.FC = () => {
  const {
    settings,
    updateSettings,
    notices,
    addNotice,
    deleteNotice,
    togglePublishNotice,
    events,
    addEvent,
    deleteEvent,
    enquiries,
    updateEnquiryStatus,
    deleteEnquiry,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    testimonials,
    addTestimonial,
    resetToDefaults,
    setCurrentView
  } = useSchoolData();

  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'enquiries' | 'notices' | 'events' | 'gallery' | 'testimonials' | 'settings'>('enquiries');

  const currentUser = user || {
    id: 'adm-user',
    name: 'Administrator',
    email: 'admin@newglobalwisdom.edu.in',
    role: 'ADMIN',
    department: 'School Administration'
  };

  const handleLogout = () => {
    logout();
    setCurrentView('admin-login');
    try {
      window.history.replaceState(null, '', '/admin/login');
      window.location.hash = 'admin/login';
    } catch {
      // ignore
    }
  };

  // Enquiries search & filter
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState<AdmissionEnquiry | null>(null);
  const [editingAdminNotes, setEditingAdminNotes] = useState<string>('');
  const [notesSavedAlert, setNotesSavedAlert] = useState(false);

  // New Notice form state
  const [showNoticeModal, setShowNoticeModal] = useState(false);
  const [noticeForm, setNoticeForm] = useState<{
    title: string;
    category: NoticeCategory;
    summary: string;
    content: string;
    date: string;
    isPinned: boolean;
  }>({
    title: '',
    category: 'Circular',
    summary: '',
    content: '',
    date: new Date().toISOString().split('T')[0],
    isPinned: false
  });

  // New Event form state
  const [showEventModal, setShowEventModal] = useState(false);
  const [eventForm, setEventForm] = useState({
    title: '',
    category: 'Sports' as any,
    date: new Date().toISOString().split('T')[0],
    time: '09:00 AM – 01:00 PM',
    venue: 'School Campus',
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=800&q=80'
  });

  // New Gallery form state
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryUploadMode, setGalleryUploadMode] = useState<'device' | 'drive' | 'url'>('device');
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [galleryUploadError, setGalleryUploadError] = useState<string | null>(null);
  const [gallerySelectedFileName, setGallerySelectedFileName] = useState<string | null>(null);
  const [galleryDriveDetected, setGalleryDriveDetected] = useState(false);
  const [galleryRawInputUrl, setGalleryRawInputUrl] = useState('');
  const [galleryImageLoadFailed, setGalleryImageLoadFailed] = useState(false);
  const [gallerySocialWarning, setGallerySocialWarning] = useState<string | null>(null);
  const [galleryFolderWarning, setGalleryFolderWarning] = useState<string | null>(null);
  const [gallerySuccessToast, setGallerySuccessToast] = useState<{ title: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Campus' as any,
    caption: '',
    imageUrl: ''
  });

  const handleOpenGalleryModal = () => {
    setGalleryForm({
      title: '',
      category: 'Campus',
      caption: '',
      imageUrl: ''
    });
    setGalleryUploadMode('device');
    setGalleryUploading(false);
    setGalleryUploadError(null);
    setGallerySelectedFileName(null);
    setGalleryDriveDetected(false);
    setGalleryRawInputUrl('');
    setGalleryImageLoadFailed(false);
    setGallerySocialWarning(null);
    setGalleryFolderWarning(null);
    setShowGalleryModal(true);
  };

  const handleGalleryDeviceUpload = async (file: File) => {
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      setGalleryUploadError('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    setGalleryUploading(true);
    setGalleryUploadError(null);
    setGallerySelectedFileName(file.name);
    setGalleryImageLoadFailed(false);
    setGallerySocialWarning(null);
    setGalleryFolderWarning(null);
    try {
      const compressedBase64 = await compressImageFile(file, 1080, 0.75);
      setGalleryForm(prev => ({
        ...prev,
        imageUrl: compressedBase64,
        title: prev.title || file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ')
      }));
    } catch (err: any) {
      setGalleryUploadError(err.message || 'Error processing photo.');
    } finally {
      setGalleryUploading(false);
    }
  };

  const handleGalleryDriveUrlInput = (rawVal: string) => {
    setGalleryRawInputUrl(rawVal);
    setGalleryUploadError(null);
    setGalleryImageLoadFailed(false);
    setGallerySocialWarning(null);

    if (!rawVal.trim()) {
      setGalleryDriveDetected(false);
      setGalleryFolderWarning(null);
      setGalleryForm(prev => ({ ...prev, imageUrl: '' }));
      return;
    }

    if (isGoogleDriveFolder(rawVal)) {
      setGalleryFolderWarning('Google Drive folder link detected! Please open the specific photo in the folder and copy that photo\'s share link instead.');
      setGalleryDriveDetected(false);
      setGalleryForm(prev => ({ ...prev, imageUrl: '' }));
      return;
    } else {
      setGalleryFolderWarning(null);
    }

    const socialCheck = checkSocialWebpageUrl(rawVal);
    if (socialCheck.isSocial) {
      setGallerySocialWarning(`${socialCheck.platform} link entered. Google Drive links must be from drive.google.com.`);
      setGalleryDriveDetected(false);
      setGalleryForm(prev => ({ ...prev, imageUrl: '' }));
      return;
    }

    const isDrive = isGoogleDriveUrl(rawVal);
    const converted = convertGoogleDriveUrl(rawVal);
    setGalleryDriveDetected(isDrive);
    setGalleryForm(prev => ({ ...prev, imageUrl: converted }));
  };

  const handleGalleryWebUrlInput = (rawVal: string) => {
    setGalleryRawInputUrl(rawVal);
    setGalleryUploadError(null);
    setGalleryImageLoadFailed(false);
    setGalleryFolderWarning(null);

    if (!rawVal.trim()) {
      setGalleryDriveDetected(false);
      setGallerySocialWarning(null);
      setGalleryForm(prev => ({ ...prev, imageUrl: '' }));
      return;
    }

    const socialCheck = checkSocialWebpageUrl(rawVal);
    if (socialCheck.isSocial) {
      setGallerySocialWarning(
        `Social media page link detected (${socialCheck.platform})! Links like instagram.com/p/... or profile URLs are full webpages and cannot be rendered directly as photo images. To publish this photo: 1) Save or screenshot the photo from ${socialCheck.platform} to your device and use the "Device / Phone" tab, OR 2) Right-click the photo on the web, choose "Copy Image Address", and paste the direct image link here.`
      );
      setGalleryForm(prev => ({ ...prev, imageUrl: '' }));
      setGalleryDriveDetected(false);
      return;
    } else {
      setGallerySocialWarning(null);
    }

    const isDrive = isGoogleDriveUrl(rawVal);
    const converted = convertGoogleDriveUrl(rawVal);
    setGalleryDriveDetected(isDrive);
    setGalleryForm(prev => ({ ...prev, imageUrl: converted }));
  };

  const handleSaveGalleryPhoto = () => {
    if (!galleryForm.title.trim() || !galleryForm.imageUrl || galleryUploading) return;
    addGalleryItem(galleryForm);
    const savedTitle = galleryForm.title.trim();
    setShowGalleryModal(false);
    setGallerySuccessToast({ title: savedTitle });
    setTimeout(() => {
      setGallerySuccessToast(null);
    }, 8000);
  };

  // New Testimonial form state
  const [showTestimonialModal, setShowTestimonialModal] = useState(false);
  const [testimonialForm, setTestimonialForm] = useState({
    authorName: '',
    relationship: 'Parent of Enrolled Student',
    text: '',
    verified: true
  });

  // Settings form state
  const [tempSettings, setTempSettings] = useState({
    schoolName: settings.schoolName,
    principalName: settings.principalName,
    principalTitle: settings.principalTitle,
    principalParagraph1: settings.principalMessage[0] || '',
    principalParagraph2: settings.principalMessage[1] || '',
    phonePlaceholder: settings.phonePlaceholder,
    emailPlaceholder: settings.emailPlaceholder,
    officeHours: settings.officeHours,
    facebookUrl: settings.facebookUrl,
    showStatistics: settings.showStatistics
  });
  const [settingsSaved, setSettingsSaved] = useState(false);

  // Filter enquiries
  const filteredEnquiries = enquiries.filter((item) => {
    const matchesStatus = enquiryStatusFilter === 'All' || item.status === enquiryStatusFilter;
    const matchesSearch =
      item.studentName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      item.parentName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
      item.mobile.includes(enquirySearch) ||
      item.classApplying.toLowerCase().includes(enquirySearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Export CSV
  const handleExportCSV = () => {
    const headers = ['Enquiry ID', 'Student Name', 'Parent Name', 'Class', 'Mobile', 'Email', 'Address', 'Submission Date', 'Status', 'Message'];
    const rows = enquiries.map((e) => [
      `"${e.id}"`,
      `"${e.studentName.replace(/"/g, '""')}"`,
      `"${e.parentName.replace(/"/g, '""')}"`,
      `"${e.classApplying}"`,
      `"${e.mobile}"`,
      `"${e.email || ''}"`,
      `"${(e.address || '').replace(/"/g, '""')}"`,
      `"${e.submittedAt}"`,
      `"${e.status}"`,
      `"${(e.message || '').replace(/"/g, '""')}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `NGWIS_Admissions_Enquiries_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      schoolName: tempSettings.schoolName,
      principalName: tempSettings.principalName,
      principalTitle: tempSettings.principalTitle,
      principalMessage: [tempSettings.principalParagraph1, tempSettings.principalParagraph2],
      phonePlaceholder: tempSettings.phonePlaceholder,
      emailPlaceholder: tempSettings.emailPlaceholder,
      officeHours: tempSettings.officeHours,
      facebookUrl: tempSettings.facebookUrl,
      showStatistics: tempSettings.showStatistics
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 3000);
  };

  return (
    <div className="w-full bg-slate-50 min-h-screen py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header Card */}
        <div className="bg-navy-950 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-academic-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-navy-900 border border-gold-400 flex items-center justify-center flex-shrink-0 shadow-lg">
              <Shield className="w-7 h-7 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2 py-0.5 rounded shadow">
                  {currentUser.role === 'IT_ADMIN' ? 'School IT Department' : 'Senior Administration'}
                </span>
                <span className="text-xs text-slate-300">
                  {currentUser.department} &bull; Estd. 2016
                </span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                School Management Desk
              </h1>
              <div className="flex items-center gap-2 mt-1 text-xs text-gold-300">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Active Session: <strong>{currentUser.name}</strong> ({currentUser.email})</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                setCurrentView('home');
                try {
                  window.history.pushState(null, '', '/');
                  window.location.hash = '';
                } catch {
                  // ignore
                }
              }}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <Home className="w-4 h-4" />
              <span>Public Website</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to default settings?')) {
                  resetToDefaults();
                  alert('Demo database reset to default records.');
                }
              }}
              className="px-4 py-2 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-amber-500/40"
              title="Reset records to default template"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Seed Data</span>
            </button>

            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:shadow-rose-600/30"
              title="Log out and secure administrative portal"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex overflow-x-auto no-scrollbar gap-2 pb-2 mb-6">
          {[
            { id: 'enquiries', label: `Admissions Desk (${enquiries.length})`, icon: GraduationCap },
            { id: 'notices', label: `Notices & Circulars (${notices.length})`, icon: FileText },
            { id: 'events', label: `Events & Calendar (${events.length})`, icon: Calendar },
            { id: 'gallery', label: `Photo Gallery (${gallery.length})`, icon: Image },
            { id: 'testimonials', label: `Testimonials (${testimonials.length})`, icon: MessageSquare },
            { id: 'settings', label: 'School Info & Content', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-3 rounded-2xl text-xs sm:text-sm font-bold flex items-center space-x-2 whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-navy-900 text-gold-300 shadow-md border border-navy-800'
                    : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-gold-400' : 'text-slate-400'}`} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ================= TAB 1: ADMISSIONS DESK ================= */}
        {activeTab === 'enquiries' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-academic space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  Admissions Enquiry Records
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Real-time applications submitted by prospective parents from the online admissions form.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                <button
                  type="button"
                  onClick={() => printEnquiriesReportPDF(filteredEnquiries, enquiryStatusFilter, settings.schoolName)}
                  className="bg-navy-900 hover:bg-navy-800 text-gold-300 text-xs font-bold px-3.5 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-all"
                  title="Print or Save official PDF Report of current enquiries"
                >
                  <Printer className="w-4 h-4 text-gold-400" />
                  <span>Export / Print PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadEnquiriesReportDoc(filteredEnquiries, enquiryStatusFilter, settings.schoolName)}
                  className="bg-blue-700 hover:bg-blue-800 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-all"
                  title="Download enquiries ledger as Microsoft Word (.doc) document"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Word (.doc)</span>
                </button>

                <button
                  type="button"
                  onClick={handleExportCSV}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-all"
                  title="Export enquiries in CSV format"
                >
                  <Download className="w-4 h-4" />
                  <span>Export CSV</span>
                </button>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="relative w-full sm:w-72">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={enquirySearch}
                  onChange={(e) => setEnquirySearch(e.target.value)}
                  placeholder="Search by student, parent, phone..."
                  className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 text-xs focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
              </div>

              <div className="flex items-center space-x-2 w-full sm:w-auto">
                <span className="text-xs text-slate-500 font-semibold flex-shrink-0">Status:</span>
                <select
                  value={enquiryStatusFilter}
                  onChange={(e) => setEnquiryStatusFilter(e.target.value)}
                  className="px-3 py-2 rounded-xl border border-slate-200 text-xs bg-white text-slate-700 focus:outline-none"
                >
                  <option value="All">All Statuses</option>
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interaction Scheduled">Interaction Scheduled</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>
            </div>

            {/* Enquiries Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-50 text-navy-900 uppercase font-bold border-y border-slate-200">
                  <tr>
                    <th className="py-3 px-3">Ref ID</th>
                    <th className="py-3 px-3">Student Name</th>
                    <th className="py-3 px-3">Parent Name</th>
                    <th className="py-3 px-3">Class</th>
                    <th className="py-3 px-3">Contact Mobile</th>
                    <th className="py-3 px-3">Submitted At</th>
                    <th className="py-3 px-3">Status</th>
                    <th className="py-3 px-3 min-w-[170px]">Parent Query / Remarks</th>
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.map((enq) => (
                    <tr
                      key={enq.id}
                      className="hover:bg-amber-50/40 transition-colors group cursor-pointer"
                      onClick={(e) => {
                        if ((e.target as HTMLElement).closest('button, select, a')) return;
                        setSelectedEnquiry(enq);
                        setEditingAdminNotes(enq.adminNotes || '');
                        setNotesSavedAlert(false);
                      }}
                    >
                      <td className="py-3 px-3 font-mono font-bold text-navy-900 whitespace-nowrap">
                        <span className="bg-slate-100 group-hover:bg-gold-100 px-2 py-1 rounded text-navy-950 transition-colors">
                          {enq.id}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-bold text-slate-900 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedEnquiry(enq);
                            setEditingAdminNotes(enq.adminNotes || '');
                            setNotesSavedAlert(false);
                          }}
                          className="hover:text-amber-700 hover:underline font-bold text-left"
                        >
                          {enq.studentName}
                        </button>
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">{enq.parentName}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <span className="bg-academic-50 text-academic-700 font-semibold px-2 py-0.5 rounded border border-academic-100">
                          {enq.classApplying}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium whitespace-nowrap">
                        <a
                          href={`tel:${enq.mobile}`}
                          onClick={(e) => e.stopPropagation()}
                          className="text-navy-900 hover:text-amber-600 hover:underline inline-flex items-center gap-1"
                          title="Click to call parent"
                        >
                          <Phone className="w-3 h-3 text-emerald-600" />
                          <span>{enq.mobile}</span>
                        </a>
                      </td>
                      <td className="py-3 px-3 text-slate-500 whitespace-nowrap">{enq.submittedAt}</td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <select
                          value={enq.status}
                          onClick={(e) => e.stopPropagation()}
                          onChange={(e) => updateEnquiryStatus(enq.id, e.target.value as EnquiryStatus)}
                          className={`px-2 py-1 rounded-md text-[11px] font-bold border ${
                            enq.status === 'New'
                              ? 'bg-amber-50 text-amber-800 border-amber-300'
                              : enq.status === 'Contacted'
                              ? 'bg-blue-50 text-blue-800 border-blue-300'
                              : enq.status === 'Interaction Scheduled'
                              ? 'bg-purple-50 text-purple-800 border-purple-300'
                              : enq.status === 'Enrolled'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                              : 'bg-slate-100 text-slate-600 border-slate-300'
                          }`}
                        >
                          <option value="New">New</option>
                          <option value="Contacted">Contacted</option>
                          <option value="Interaction Scheduled">Interaction Scheduled</option>
                          <option value="Enrolled">Enrolled</option>
                          <option value="Archived">Archived</option>
                        </select>
                      </td>
                      <td className="py-3 px-3 max-w-[240px]">
                        {enq.message ? (
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setEditingAdminNotes(enq.adminNotes || '');
                              setNotesSavedAlert(false);
                            }}
                            className="text-left group/msg flex items-start gap-1.5 text-slate-700 hover:text-navy-950 w-full"
                            title="Click to view complete query information"
                          >
                            <MessageSquare className="w-3.5 h-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            <span className="truncate group-hover/msg:underline text-xs">{enq.message}</span>
                          </button>
                        ) : (
                          <span className="text-slate-400 italic text-[11px]">General Admission Enquiry</span>
                        )}
                      </td>
                      <td className="py-3 px-3 text-right whitespace-nowrap">
                        <div className="flex items-center justify-end gap-1">
                          {/* View Full Query Details */}
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedEnquiry(enq);
                              setEditingAdminNotes(enq.adminNotes || '');
                              setNotesSavedAlert(false);
                            }}
                            className="p-1.5 text-slate-600 hover:text-navy-900 rounded-lg hover:bg-slate-200 transition-colors"
                            title="View Full Query Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          {/* Print / Save as PDF */}
                          <button
                            type="button"
                            onClick={() => printEnquiryPDF(enq, settings.schoolName)}
                            className="p-1.5 text-slate-600 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Print / Save Enquiry as PDF"
                          >
                            <Printer className="w-4 h-4 text-rose-600" />
                          </button>

                          {/* Download as DOC / Word */}
                          <button
                            type="button"
                            onClick={() => downloadEnquiryDoc(enq, settings.schoolName)}
                            className="p-1.5 text-slate-600 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                            title="Download Enquiry as Word (.doc)"
                          >
                            <FileText className="w-4 h-4 text-blue-600" />
                          </button>

                          {/* Delete */}
                          <button
                            type="button"
                            onClick={() => {
                              if (window.confirm(`Delete enquiry ${enq.id}?`)) {
                                deleteEnquiry(enq.id);
                              }
                            }}
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                            title="Delete enquiry"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {filteredEnquiries.length === 0 && (
                <div className="text-center py-12 text-slate-400">
                  <p className="text-sm font-semibold">No admissions enquiries found.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ================= TAB 2: NOTICES & CIRCULARS ================= */}
        {activeTab === 'notices' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-academic space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  Notice Board Manager
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Publish, modify, or archive official notices, exam timetables, and holiday announcements.
                </p>
              </div>

              <button
                onClick={() => setShowNoticeModal(true)}
                className="bg-navy-900 hover:bg-navy-800 text-gold-300 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Notice</span>
              </button>
            </div>

            <div className="space-y-3">
              {notices.map((n) => (
                <div
                  key={n.id}
                  className="p-4 rounded-2xl border border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-200 text-slate-800 px-2 py-0.5 rounded">
                        {n.category}
                      </span>
                      <span className="text-xs text-slate-500">Issued: {n.date}</span>
                      {n.isPinned && (
                        <span className="text-[10px] font-bold uppercase bg-gold-500 text-navy-950 px-2 py-0.5 rounded">
                          Pinned
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${n.isPublished ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'}`}>
                        {n.isPublished ? 'Published' : 'Draft'}
                      </span>
                    </div>

                    <h4 className="font-serif font-bold text-sm text-navy-900">{n.title}</h4>
                    <p className="text-xs text-slate-600 line-clamp-1">{n.summary}</p>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => togglePublishNotice(n.id)}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors"
                      title={n.isPublished ? 'Unpublish notice' : 'Publish notice'}
                    >
                      {n.isPublished ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete notice "${n.title}"?`)) {
                          deleteNotice(n.id);
                        }
                      }}
                      className="p-2 rounded-lg bg-white border border-slate-200 hover:bg-rose-50 text-rose-600 transition-colors"
                      title="Delete notice"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 3: EVENTS MANAGER ================= */}
        {activeTab === 'events' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-academic space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  Events & Functions Manager
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Schedule upcoming sports tournaments, annual days, and exhibitions.
                </p>
              </div>

              <button
                onClick={() => setShowEventModal(true)}
                className="bg-navy-900 hover:bg-navy-800 text-gold-300 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Event</span>
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {events.map((evt) => (
                <div key={evt.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex gap-4">
                  <img src={evt.imageUrl} alt={evt.title} className="w-20 h-20 object-cover rounded-xl flex-shrink-0" />
                  <div className="space-y-1 flex-1">
                    <span className="text-[10px] font-bold uppercase bg-gold-500 text-navy-950 px-2 py-0.5 rounded">
                      {evt.category}
                    </span>
                    <h4 className="font-serif font-bold text-sm text-navy-900">{evt.title}</h4>
                    <p className="text-xs text-slate-500">{evt.date} &bull; {evt.venue}</p>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete event "${evt.title}"?`)) {
                          deleteEvent(evt.id);
                        }
                      }}
                      className="text-xs text-rose-600 hover:underline pt-1 inline-block"
                    >
                      Delete Event
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 4: PHOTO GALLERY ================= */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-academic space-y-6">
            {gallerySuccessToast && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-sm">
                <div className="flex items-center gap-2.5">
                  <CheckCircle className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                  <div>
                    <p className="font-bold text-xs sm:text-sm">Photo published successfully to Public Gallery!</p>
                    <p className="text-[11px] text-emerald-700">"{gallerySuccessToast.title}" is now live and visible to all website visitors.</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentView('gallery')}
                    className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View in Public Gallery &rarr;</span>
                  </button>
                  <button
                    onClick={() => setGallerySuccessToast(null)}
                    className="p-1 text-emerald-600 hover:text-emerald-950 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  Photo Gallery Manager
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage official photographs displayed on the public website gallery.
                </p>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto">
                <button
                  onClick={() => setCurrentView('gallery')}
                  className="px-3.5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-slate-200"
                  title="View live public gallery"
                >
                  <Eye className="w-4 h-4 text-navy-800" />
                  <span>Public Gallery</span>
                </button>

                <button
                  onClick={handleOpenGalleryModal}
                  className="bg-navy-900 hover:bg-navy-800 text-gold-300 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span>Add Photo to Gallery</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                  <img
                    src={resolveImageUrl(g.imageUrl)}
                    alt={g.title}
                    className="w-full h-32 object-cover"
                    onError={(e) => {
                      const target = e.currentTarget;
                      if (!target.src.includes('campus-building')) {
                        target.src = resolveImageUrl('/campus-building.jpg');
                      }
                    }}
                  />
                  <div className="p-2.5 bg-white">
                    <span className="text-[9px] uppercase font-bold text-gold-700 block">{g.category}</span>
                    <p className="text-xs font-bold text-navy-900 truncate">{g.title}</p>
                    <button
                      onClick={() => {
                        if (window.confirm(`Delete photo "${g.title}"?`)) {
                          deleteGalleryItem(g.id);
                        }
                      }}
                      className="text-[10px] text-rose-600 hover:underline mt-1 block"
                    >
                      Delete Photo
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 5: TESTIMONIALS ================= */}
        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-academic space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  Verified Testimonials Manager
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Add genuine testimonials from parents and guardians to replace placeholder slots.
                </p>
              </div>

              <button
                onClick={() => setShowTestimonialModal(true)}
                className="bg-navy-900 hover:bg-navy-800 text-gold-300 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Verified Review</span>
              </button>
            </div>

            <div className="space-y-4">
              {testimonials.map((t) => (
                <div key={t.id} className="p-5 rounded-2xl border border-slate-200 bg-slate-50 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-navy-900">{t.authorName}</h4>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${t.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                      {t.verified ? 'Verified Parent' : 'Placeholder Slot'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{t.relationship}</p>
                  <p className="text-xs sm:text-sm text-slate-700 italic">{t.text}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ================= TAB 6: SETTINGS & CONTENT ================= */}
        {activeTab === 'settings' && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-academic space-y-6">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="font-serif text-xl font-bold text-navy-900">
                School Information & Content Editor
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Update leadership message, office timings, contact placeholders, and statistics display.
              </p>
            </div>

            {settingsSaved && (
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-800 text-xs flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                <span>School content settings updated and saved to persistent database!</span>
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Basic Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    School Name
                  </label>
                  <input
                    type="text"
                    value={tempSettings.schoolName}
                    onChange={(e) => setTempSettings({ ...tempSettings, schoolName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Official Facebook URL
                  </label>
                  <input
                    type="url"
                    value={tempSettings.facebookUrl}
                    onChange={(e) => setTempSettings({ ...tempSettings, facebookUrl: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
                  />
                </div>
              </div>

              {/* Leadership Message Fields */}
              <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                <h4 className="font-bold text-sm text-navy-900">Leadership / Principal Desk Settings</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                      Principal / Leader Name
                    </label>
                    <input
                      type="text"
                      value={tempSettings.principalName}
                      onChange={(e) => setTempSettings({ ...tempSettings, principalName: e.target.value })}
                      placeholder="e.g. Dr. Name Placeholder"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                      Designation
                    </label>
                    <input
                      type="text"
                      value={tempSettings.principalTitle}
                      onChange={(e) => setTempSettings({ ...tempSettings, principalTitle: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Principal Message Paragraph 1
                  </label>
                  <textarea
                    rows={3}
                    value={tempSettings.principalParagraph1}
                    onChange={(e) => setTempSettings({ ...tempSettings, principalParagraph1: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Principal Message Paragraph 2
                  </label>
                  <textarea
                    rows={3}
                    value={tempSettings.principalParagraph2}
                    onChange={(e) => setTempSettings({ ...tempSettings, principalParagraph2: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-xs sm:text-sm bg-white resize-none"
                  />
                </div>
              </div>

              {/* Statistics Visibility Switch */}
              <div className="p-4 rounded-2xl bg-gold-50 border border-gold-200 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-xs sm:text-sm text-navy-900">
                    Statistics Section Display
                  </h4>
                  <p className="text-xs text-slate-600">
                    Per guidelines, numbers must remain hidden until official verified data is ready.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setTempSettings({ ...tempSettings, showStatistics: !tempSettings.showStatistics })}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                    tempSettings.showStatistics
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-300 text-slate-700'
                  }`}
                >
                  {tempSettings.showStatistics ? 'Shown' : 'Hidden (Recommended)'}
                </button>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="bg-navy-900 hover:bg-navy-800 text-gold-300 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-md transition-all"
                >
                  Save All Changes
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* New Notice Modal */}
      {showNoticeModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-navy-900">Create Official Notice</h3>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Title</label>
                <input
                  type="text"
                  value={noticeForm.title}
                  onChange={(e) => setNoticeForm({ ...noticeForm, title: e.target.value })}
                  placeholder="Notice title..."
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Category</label>
                  <select
                    value={noticeForm.category}
                    onChange={(e) => setNoticeForm({ ...noticeForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl text-xs bg-white"
                  >
                    <option value="Circular">Circular</option>
                    <option value="Holiday">Holiday</option>
                    <option value="Examination">Examination</option>
                    <option value="Admission">Admission</option>
                    <option value="Event">Event</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-navy-900 mb-1">Date</label>
                  <input
                    type="date"
                    value={noticeForm.date}
                    onChange={(e) => setNoticeForm({ ...noticeForm, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Summary (1 sentence)</label>
                <input
                  type="text"
                  value={noticeForm.summary}
                  onChange={(e) => setNoticeForm({ ...noticeForm, summary: e.target.value })}
                  placeholder="Brief summary..."
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-navy-900 mb-1">Full Notice Content</label>
                <textarea
                  rows={4}
                  value={noticeForm.content}
                  onChange={(e) => setNoticeForm({ ...noticeForm, content: e.target.value })}
                  placeholder="Detailed circular text..."
                  className="w-full px-3 py-2 border rounded-xl text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowNoticeModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!noticeForm.title) return;
                  addNotice({
                    ...noticeForm,
                    isPublished: true
                  });
                  setShowNoticeModal(false);
                  setNoticeForm({
                    title: '',
                    category: 'Circular',
                    summary: '',
                    content: '',
                    date: new Date().toISOString().split('T')[0],
                    isPinned: false
                  });
                }}
                className="bg-navy-900 text-gold-300 px-4 py-2 text-xs font-bold rounded-lg"
              >
                Publish Notice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Event Modal */}
      {showEventModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-navy-900">Create New School Event</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-navy-900 mb-1">Event Title</label>
                <input
                  type="text"
                  value={eventForm.title}
                  onChange={(e) => setEventForm({ ...eventForm, title: e.target.value })}
                  placeholder="Event title..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-navy-900 mb-1">Date</label>
                  <input
                    type="date"
                    value={eventForm.date}
                    onChange={(e) => setEventForm({ ...eventForm, date: e.target.value })}
                    className="w-full px-3 py-2 border rounded-xl"
                  />
                </div>
                <div>
                  <label className="block font-bold text-navy-900 mb-1">Category</label>
                  <select
                    value={eventForm.category}
                    onChange={(e) => setEventForm({ ...eventForm, category: e.target.value as any })}
                    className="w-full px-3 py-2 border rounded-xl bg-white"
                  >
                    <option value="Sports">Sports</option>
                    <option value="Cultural">Cultural</option>
                    <option value="Academic">Academic</option>
                    <option value="Celebration">Celebration</option>
                    <option value="Meeting">Meeting</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-bold text-navy-900 mb-1">Time & Venue</label>
                <input
                  type="text"
                  value={eventForm.venue}
                  onChange={(e) => setEventForm({ ...eventForm, venue: e.target.value })}
                  placeholder="e.g. School Sports Ground"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-navy-900 mb-1">Short Description</label>
                <textarea
                  rows={3}
                  value={eventForm.description}
                  onChange={(e) => setEventForm({ ...eventForm, description: e.target.value })}
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowEventModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!eventForm.title) return;
                  addEvent(eventForm);
                  setShowEventModal(false);
                }}
                className="bg-navy-900 text-gold-300 px-4 py-2 text-xs font-bold rounded-lg"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Gallery Photo Modal */}
      {showGalleryModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 border border-slate-100 my-8">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-serif font-bold text-lg text-navy-950 flex items-center gap-2">
                  <UploadCloud className="w-5 h-5 text-gold-600" />
                  <span>Add Photo to Gallery</span>
                </h3>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Upload from your phone/PC, Google Drive link, or direct image URL.
                </p>
              </div>
              <button
                onClick={() => setShowGalleryModal(false)}
                className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Photo Title */}
              <div>
                <label className="block font-bold text-navy-900 mb-1">
                  Photo Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="e.g. Annual Science Exhibition 2026"
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none text-slate-800"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block font-bold text-navy-900 mb-1">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none text-slate-800 font-medium"
                >
                  <option value="Campus">Campus</option>
                  <option value="Classrooms">Classrooms</option>
                  <option value="Sports">Sports</option>
                  <option value="Activities">Activities</option>
                  <option value="Events">Events</option>
                  <option value="Celebrations">Celebrations</option>
                  <option value="Students">Students</option>
                  <option value="Infrastructure">Infrastructure</option>
                </select>
              </div>

              {/* Upload Source Selector */}
              <div>
                <label className="block font-bold text-navy-900 mb-1.5">
                  Select Photo Source <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryUploadMode('device');
                      setGalleryUploadError(null);
                    }}
                    className={`py-2 px-2 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                      galleryUploadMode === 'device'
                        ? 'bg-white text-navy-950 shadow-sm border border-slate-200/80 font-bold'
                        : 'text-slate-600 hover:text-navy-950'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-navy-800" />
                    <span>Device / Phone</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryUploadMode('drive');
                      setGalleryUploadError(null);
                    }}
                    className={`py-2 px-2 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                      galleryUploadMode === 'drive'
                        ? 'bg-white text-navy-950 shadow-sm border border-slate-200/80 font-bold'
                        : 'text-slate-600 hover:text-navy-950'
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                    <span>Google Drive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setGalleryUploadMode('url');
                      setGalleryUploadError(null);
                    }}
                    className={`py-2 px-2 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                      galleryUploadMode === 'url'
                        ? 'bg-white text-navy-950 shadow-sm border border-slate-200/80 font-bold'
                        : 'text-slate-600 hover:text-navy-950'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Web Link (URL)</span>
                  </button>
                </div>
              </div>

              {/* Option 1: Device File Upload */}
              {galleryUploadMode === 'device' && (
                <div className="space-y-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleGalleryDeviceUpload(file);
                    }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file) handleGalleryDeviceUpload(file);
                    }}
                    className="border-2 border-dashed border-slate-300 hover:border-navy-900 bg-slate-50/80 hover:bg-slate-50 rounded-2xl p-5 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white border border-slate-200 flex items-center justify-center mb-2.5 shadow-sm group-hover:scale-105 transition-transform text-navy-900">
                      <FileUp className="w-6 h-6 text-navy-900" />
                    </div>
                    <p className="font-bold text-slate-800 text-xs">
                      {gallerySelectedFileName ? 'Click to choose a different photo' : 'Choose photo from mobile or computer'}
                    </p>
                    <p className="text-[11px] text-slate-500 mt-1">
                      Supports JPG, PNG, WEBP &bull; Auto-optimized for web
                    </p>
                    {gallerySelectedFileName && (
                      <span className="mt-2 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-[10px] font-semibold">
                        <Check className="w-3 h-3" />
                        <span>Selected: {gallerySelectedFileName}</span>
                      </span>
                    )}
                  </div>

                  {galleryUploading && (
                    <div className="flex items-center justify-center gap-2 p-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-xl text-xs font-semibold animate-pulse">
                      <span>Compressing & optimizing photo for web...</span>
                    </div>
                  )}
                </div>
              )}

              {/* Option 2: Google Drive Link */}
              {galleryUploadMode === 'drive' && (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">
                    Paste Google Drive Share Link
                  </label>
                  <input
                    type="url"
                    value={galleryRawInputUrl}
                    onChange={(e) => handleGalleryDriveUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/file/d/1A2B3C.../view?usp=sharing"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none text-slate-800 font-mono text-[11px]"
                  />
                  {galleryDriveDetected && (
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[11px] font-medium">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Google Drive link recognized! Converted to high-res embed link.</span>
                    </div>
                  )}
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200/80 rounded-xl text-[11px] text-amber-900 space-y-1">
                    <p className="font-bold flex items-center gap-1">
                      <span>💡 How to copy from Google Drive:</span>
                    </p>
                    <ol className="list-decimal list-inside text-[10.5px] text-amber-800 space-y-0.5 ml-1">
                      <li>In Google Drive, right click the photo &rarr; click <strong>Share</strong>.</li>
                      <li>Under General access, choose <strong>"Anyone with the link can view"</strong>.</li>
                      <li>Click <strong>"Copy link"</strong> and paste it into the box above.</li>
                    </ol>
                  </div>
                </div>
              )}

              {/* Option 3: Direct Web Image URL */}
              {galleryUploadMode === 'url' && (
                <div className="space-y-2">
                  <label className="block font-semibold text-slate-700">
                    Paste Image URL
                  </label>
                  <input
                    type="url"
                    value={galleryRawInputUrl}
                    onChange={(e) => handleGalleryWebUrlInput(e.target.value)}
                    placeholder="https://images.unsplash.com/... or any public image URL"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none text-slate-800 text-[11px]"
                  />
                  {galleryDriveDetected && (
                    <div className="flex items-center gap-2 p-2 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-[11px] font-medium">
                      <Check className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      <span>Google Drive link detected & converted for direct display.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Folder Warning */}
              {galleryFolderWarning && (
                <div className="flex items-start gap-2 p-2.5 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl text-xs font-medium">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                  <span>{galleryFolderWarning}</span>
                </div>
              )}

              {/* Social Media Link Warning */}
              {gallerySocialWarning && (
                <div className="flex items-start gap-2.5 p-3 bg-indigo-50 border border-indigo-200 text-indigo-950 rounded-xl text-xs">
                  <AlertCircle className="w-4 h-4 text-indigo-600 flex-shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <p className="font-bold text-indigo-900">Social Media Webpage Detected</p>
                    <p className="text-[11px] text-indigo-800 leading-relaxed">{gallerySocialWarning}</p>
                  </div>
                </div>
              )}

              {/* Error Message */}
              {galleryUploadError && (
                <div className="flex items-center gap-2 p-2.5 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs font-semibold">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{galleryUploadError}</span>
                </div>
              )}

              {/* Live Preview Box */}
              {galleryForm.imageUrl && (
                <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-slate-700">Image Preview:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setGalleryForm(prev => ({ ...prev, imageUrl: '' }));
                        setGallerySelectedFileName(null);
                        setGalleryRawInputUrl('');
                        setGalleryDriveDetected(false);
                      }}
                      className="text-rose-600 hover:underline font-semibold"
                    >
                      Remove Photo
                    </button>
                  </div>
                  <div className="relative w-full h-40 bg-slate-200 rounded-xl overflow-hidden flex items-center justify-center border border-slate-300">
                    <img
                      src={resolveImageUrl(galleryForm.imageUrl)}
                      alt="Preview"
                      className="w-full h-full object-cover"
                      onLoad={() => setGalleryImageLoadFailed(false)}
                      onError={() => setGalleryImageLoadFailed(true)}
                    />
                    {galleryImageLoadFailed && (
                      <div className="absolute inset-0 bg-white/95 p-4 flex flex-col items-center justify-center text-center">
                        <AlertCircle className="w-7 h-7 text-rose-500 mb-1" />
                        <p className="font-bold text-rose-700 text-xs">Preview could not be loaded</p>
                        <p className="text-[10px] text-slate-500 mt-1 max-w-xs">
                          {galleryUploadMode === 'drive'
                            ? 'Ensure the Google Drive sharing permission is set to "Anyone with the link can view".'
                            : 'This URL cannot be accessed directly by browser as an image file.'}
                        </p>
                      </div>
                    )}
                  </div>
                  {!galleryImageLoadFailed && (
                    <div className="flex items-center gap-1.5 text-[10.5px] text-emerald-700 font-medium">
                      <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>Image loaded and verified ready for publication.</span>
                    </div>
                  )}
                </div>
              )}

              {/* Caption */}
              <div>
                <label className="block font-bold text-navy-900 mb-1">Caption (Optional)</label>
                <input
                  type="text"
                  value={galleryForm.caption}
                  onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  placeholder="Brief descriptive caption..."
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none text-slate-800"
                />
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setShowGalleryModal(false)}
                className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={!galleryForm.title.trim() || !galleryForm.imageUrl || galleryUploading || galleryImageLoadFailed}
                onClick={handleSaveGalleryPhoto}
                className={`px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 ${
                  !galleryForm.title.trim() || !galleryForm.imageUrl || galleryUploading || galleryImageLoadFailed
                    ? 'bg-slate-300 text-slate-500 cursor-not-allowed'
                    : 'bg-navy-900 hover:bg-navy-800 text-gold-300'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                <span>Publish to Public Gallery</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Testimonial Modal */}
      {showTestimonialModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-navy-900">Add Verified Testimonial</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-navy-900 mb-1">Parent / Author Name</label>
                <input
                  type="text"
                  value={testimonialForm.authorName}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, authorName: e.target.value })}
                  placeholder="e.g. Smt. Sunita Devi"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-navy-900 mb-1">Relationship / Details</label>
                <input
                  type="text"
                  value={testimonialForm.relationship}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, relationship: e.target.value })}
                  placeholder="e.g. Mother of Class 3 Student"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-navy-900 mb-1">Testimonial Text</label>
                <textarea
                  rows={4}
                  value={testimonialForm.text}
                  onChange={(e) => setTestimonialForm({ ...testimonialForm, text: e.target.value })}
                  placeholder="Verified feedback quote..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowTestimonialModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!testimonialForm.authorName || !testimonialForm.text) return;
                  addTestimonial({
                    ...testimonialForm,
                    isPlaceholder: false
                  });
                  setShowTestimonialModal(false);
                }}
                className="bg-navy-900 text-gold-300 px-4 py-2 text-xs font-bold rounded-lg"
              >
                Add Testimonial
              </button>
            </div>
          </div>
        </div>
      )}
      {/* ================= MODAL: ADMISSION ENQUIRY FULL DETAILS & QUERY ================= */}
      {selectedEnquiry && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto animate-fadeIn"
          onClick={() => setSelectedEnquiry(null)}
        >
          <div
            className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 relative my-auto space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gold-50 border border-gold-300 text-gold-600 flex items-center justify-center flex-shrink-0">
                  <GraduationCap className="w-6 h-6 text-navy-950" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold bg-navy-950 text-gold-300 px-2.5 py-0.5 rounded-md">
                      {selectedEnquiry.id}
                    </span>
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${
                      selectedEnquiry.status === 'New'
                        ? 'bg-amber-50 text-amber-800 border-amber-300'
                        : selectedEnquiry.status === 'Contacted'
                        ? 'bg-blue-50 text-blue-800 border-blue-300'
                        : selectedEnquiry.status === 'Interaction Scheduled'
                        ? 'bg-purple-50 text-purple-800 border-purple-300'
                        : selectedEnquiry.status === 'Enrolled'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : 'bg-slate-100 text-slate-600 border-slate-300'
                    }`}>
                      {selectedEnquiry.status}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-navy-900 mt-1">
                    {selectedEnquiry.studentName}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Applying for <strong className="text-navy-900">{selectedEnquiry.classApplying}</strong> &bull; Submitted {selectedEnquiry.submittedAt}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Contact & Details Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Parent & Contact */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Parent / Guardian Details
                </span>
                <div className="font-bold text-sm text-navy-900">
                  {selectedEnquiry.parentName}
                </div>
                <div className="flex items-center gap-2 pt-1">
                  <a
                    href={`tel:${selectedEnquiry.mobile}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-sm transition-colors"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call {selectedEnquiry.mobile}</span>
                  </a>
                  <a
                    href={`https://wa.me/91${selectedEnquiry.mobile.replace(/\D/g, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-semibold text-xs transition-colors"
                    title="Send WhatsApp Message"
                  >
                    <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>

              {/* Address & Email */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Location &amp; Communication
                </span>
                <div className="flex items-start gap-1.5 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 mt-0.5 flex-shrink-0" />
                  <span>{selectedEnquiry.address || 'Address / Locality not specified'}</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-700">
                  <Mail className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  {selectedEnquiry.email ? (
                    <a href={`mailto:${selectedEnquiry.email}`} className="text-blue-600 hover:underline">
                      {selectedEnquiry.email}
                    </a>
                  ) : (
                    <span className="text-slate-400 italic">No email provided</span>
                  )}
                </div>
              </div>
            </div>

            {/* Parent Query & Questions Message Box */}
            <div className="p-5 rounded-2xl bg-amber-500/10 border-2 border-amber-500/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-amber-600" />
                  Parent's Enquiry / Query Details
                </span>
                <span className="text-[10px] text-amber-800 font-semibold">Online Submission</span>
              </div>
              <p className="text-sm text-slate-800 whitespace-pre-wrap leading-relaxed font-serif pt-1">
                {selectedEnquiry.message ? `"${selectedEnquiry.message}"` : (
                  <span className="text-slate-500 italic">
                    No specific written query was entered by the parent. (General admission inquiry submitted for {selectedEnquiry.classApplying}).
                  </span>
                )}
              </p>
            </div>

            {/* Status & Administrative Notes */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <label className="text-xs font-bold text-navy-900 uppercase tracking-wider">
                  Update Processing Status
                </label>
                <select
                  value={selectedEnquiry.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as EnquiryStatus;
                    updateEnquiryStatus(selectedEnquiry.id, newStatus, editingAdminNotes);
                    setSelectedEnquiry({ ...selectedEnquiry, status: newStatus });
                  }}
                  className="px-3 py-1.5 rounded-xl border border-slate-300 text-xs font-bold bg-white text-navy-900"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Interaction Scheduled">Interaction Scheduled</option>
                  <option value="Enrolled">Enrolled</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">
                  Internal Administrative Notes (Follow-up record, interaction dates, fee discussion):
                </label>
                <textarea
                  rows={2}
                  value={editingAdminNotes}
                  onChange={(e) => setEditingAdminNotes(e.target.value)}
                  placeholder="Add internal notes regarding this parent or child..."
                  className="w-full px-3 py-2 border rounded-xl text-xs bg-white text-slate-800 resize-none focus:outline-none focus:ring-2 focus:ring-gold-500"
                />
                <div className="flex items-center justify-between mt-2">
                  <span className="text-[11px] text-emerald-600 font-medium">
                    {notesSavedAlert ? '✓ Notes saved successfully.' : ''}
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      updateEnquiryStatus(selectedEnquiry.id, selectedEnquiry.status, editingAdminNotes);
                      setSelectedEnquiry({ ...selectedEnquiry, adminNotes: editingAdminNotes });
                      setNotesSavedAlert(true);
                      setTimeout(() => setNotesSavedAlert(false), 3000);
                    }}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-semibold transition-colors"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>

            {/* Document Export Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => printEnquiryPDF(selectedEnquiry, settings.schoolName)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-navy-950 hover:bg-navy-900 text-gold-300 font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  title="Print or Save Enquiry as PDF"
                >
                  <Printer className="w-4 h-4 text-gold-400" />
                  <span>Print / Save PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => downloadEnquiryDoc(selectedEnquiry, settings.schoolName)}
                  className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all"
                  title="Download as editable Word document"
                >
                  <FileText className="w-4 h-4" />
                  <span>Download Word (.doc)</span>
                </button>
              </div>

              <button
                type="button"
                onClick={() => setSelectedEnquiry(null)}
                className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
