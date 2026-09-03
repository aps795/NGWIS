import React, { useState } from 'react';
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
  Home
} from 'lucide-react';
import type { NoticeCategory, EnquiryStatus } from '../types/school';

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

  const [activeTab, setActiveTab] = useState<'enquiries' | 'notices' | 'events' | 'gallery' | 'testimonials' | 'settings'>('enquiries');

  // Enquiries search & filter
  const [enquirySearch, setEnquirySearch] = useState('');
  const [enquiryStatusFilter, setEnquiryStatusFilter] = useState<string>('All');

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
  const [galleryForm, setGalleryForm] = useState({
    title: '',
    category: 'Campus' as any,
    caption: '',
    imageUrl: ''
  });

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
                <span className="text-[11px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2 py-0.5 rounded">
                  Administration
                </span>
                <span className="text-xs text-slate-300">CMS Portal &bull; Saidpur Campus</span>
              </div>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white mt-1">
                School Management Desk
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setCurrentView('home')}
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors border border-white/20"
            >
              <Home className="w-4 h-4" />
              <span>View Public Website</span>
            </button>

            <button
              onClick={() => {
                if (window.confirm('Reset all demo data back to default settings?')) {
                  resetToDefaults();
                  alert('Demo database reset to default records.');
                }
              }}
              className="px-4 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs font-semibold flex items-center gap-1.5 transition-colors border border-rose-500/40"
              title="Reset records to default template"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Reset Seed Data</span>
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

              <button
                onClick={handleExportCSV}
                className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
              >
                <Download className="w-4 h-4" />
                <span>Export Enquiries to CSV</span>
              </button>
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
                    <th className="py-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredEnquiries.map((enq) => (
                    <tr key={enq.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-mono font-bold text-navy-900">{enq.id}</td>
                      <td className="py-3 px-3 font-semibold text-slate-900">{enq.studentName}</td>
                      <td className="py-3 px-3">{enq.parentName}</td>
                      <td className="py-3 px-3">
                        <span className="bg-academic-50 text-academic-700 font-semibold px-2 py-0.5 rounded border border-academic-100">
                          {enq.classApplying}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono font-medium">{enq.mobile}</td>
                      <td className="py-3 px-3 text-slate-500">{enq.submittedAt}</td>
                      <td className="py-3 px-3">
                        <select
                          value={enq.status}
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
                      <td className="py-3 px-3 text-right">
                        <button
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
              <div>
                <h3 className="font-serif text-xl font-bold text-navy-900">
                  Photo Gallery Manager
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Manage official photographs displayed on the website gallery.
                </p>
              </div>

              <button
                onClick={() => setShowGalleryModal(true)}
                className="bg-navy-900 hover:bg-navy-800 text-gold-300 text-xs font-bold px-4 py-2.5 rounded-xl shadow flex items-center space-x-1.5 transition-colors self-start sm:self-auto"
              >
                <Plus className="w-4 h-4" />
                <span>Add Photo to Gallery</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {gallery.map((g) => (
                <div key={g.id} className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                  <img src={g.imageUrl} alt={g.title} className="w-full h-32 object-cover" />
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
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-serif font-bold text-lg text-navy-900">Add Photo to Gallery</h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-navy-900 mb-1">Title</label>
                <input
                  type="text"
                  value={galleryForm.title}
                  onChange={(e) => setGalleryForm({ ...galleryForm, title: e.target.value })}
                  placeholder="e.g. Class 4 Science Model"
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-navy-900 mb-1">Category</label>
                <select
                  value={galleryForm.category}
                  onChange={(e) => setGalleryForm({ ...galleryForm, category: e.target.value as any })}
                  className="w-full px-3 py-2 border rounded-xl bg-white"
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
              <div>
                <label className="block font-bold text-navy-900 mb-1">Image URL</label>
                <input
                  type="url"
                  value={galleryForm.imageUrl}
                  onChange={(e) => setGalleryForm({ ...galleryForm, imageUrl: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
              <div>
                <label className="block font-bold text-navy-900 mb-1">Caption</label>
                <input
                  type="text"
                  value={galleryForm.caption}
                  onChange={(e) => setGalleryForm({ ...galleryForm, caption: e.target.value })}
                  placeholder="Brief descriptive caption..."
                  className="w-full px-3 py-2 border rounded-xl"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2 pt-2">
              <button
                onClick={() => setShowGalleryModal(false)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  if (!galleryForm.title || !galleryForm.imageUrl) return;
                  addGalleryItem(galleryForm);
                  setShowGalleryModal(false);
                }}
                className="bg-navy-900 text-gold-300 px-4 py-2 text-xs font-bold rounded-lg"
              >
                Save Photo
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
    </div>
  );
};
