import React, { useState, useMemo, useRef } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Users,
  Plus,
  Search,
  Award,
  BookOpen,
  Edit3,
  Trash2,
  ExternalLink,
  Camera,
  X,
  Check,
  AlertCircle,
  UploadCloud,
  HardDrive,
  Link as LinkIcon,
  FileUp,
  Sparkles,
  Filter
} from 'lucide-react';

import type { FacultyMember, FacultyRoleCategory } from '../../types/school';
import {
  convertGoogleDriveUrl,
  isGoogleDriveUrl,
  isGoogleDriveFolder,
  checkSocialWebpageUrl,
  compressImageFile,
  resolveImageUrl
} from '../../utils/imageHelpers';

export const FacultyManager: React.FC = () => {
  const {
    faculty,
    addFacultyMember,
    updateFacultyMember,
    deleteFacultyMember,
    setCurrentView
  } = useSchoolData();

  // Search, Filter & Sort States
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | FacultyRoleCategory>('All');
  const [seniorFilter, setSeniorFilter] = useState<'All' | 'Senior' | 'Regular'>('All');
  const [sortOrder, setSortOrder] = useState<'sno_asc' | 'sno_desc' | 'name_asc'>('sno_asc');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMember, setEditingMember] = useState<FacultyMember | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [formId, setFormId] = useState<number>(1);
  const [formName, setFormName] = useState('');
  const [formDesignation, setFormDesignation] = useState('');
  const [formDeptOrSubject, setFormDeptOrSubject] = useState('');
  const [formRoleCategory, setFormRoleCategory] = useState<FacultyRoleCategory>('teacher');
  const [formIsSenior, setFormIsSenior] = useState(false);
  const [formPhotoUrl, setFormPhotoUrl] = useState('');

  // Photo Upload States
  const [uploadMode, setUploadMode] = useState<'device' | 'drive' | 'url'>('device');
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [rawInputUrl, setRawInputUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [driveDetected, setDriveDetected] = useState(false);
  const [folderWarning, setFolderWarning] = useState<string | null>(null);
  const [socialWarning, setSocialWarning] = useState<string | null>(null);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  // Toast / Feedback State
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'info' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open Modal in Add Mode
  const handleOpenAddModal = () => {
    const nextId = faculty.length > 0 ? Math.max(...faculty.map((f) => Number(f.id) || 0)) + 1 : 1;
    setEditingMember(null);
    setFormId(nextId);
    setFormName('');
    setFormDesignation('');
    setFormDeptOrSubject('');
    setFormRoleCategory('teacher');
    setFormIsSenior(false);
    setFormPhotoUrl('');
    setUploadMode('device');
    setSelectedFileName(null);
    setRawInputUrl('');
    setUploadError(null);
    setFolderWarning(null);
    setSocialWarning(null);
    setDriveDetected(false);
    setImageLoadFailed(false);
    setIsModalOpen(true);
  };

  // Open Modal in Edit Mode
  const handleOpenEditModal = (member: FacultyMember) => {
    setEditingMember(member);
    setFormId(member.id);
    setFormName(member.name);
    setFormDesignation(member.designation);
    setFormDeptOrSubject(member.departmentOrSubject);
    setFormRoleCategory(member.roleCategory);
    setFormIsSenior(Boolean(member.isSeniorLeadership));
    setFormPhotoUrl(member.photoUrl || '');
    setUploadMode(member.photoUrl && member.photoUrl.startsWith('data:') ? 'device' : 'url');
    setSelectedFileName(null);
    setRawInputUrl(member.photoUrl && !member.photoUrl.startsWith('data:') ? member.photoUrl : '');
    setUploadError(null);
    setFolderWarning(null);
    setSocialWarning(null);
    setDriveDetected(false);
    setImageLoadFailed(false);
    setIsModalOpen(true);
  };

  // Device File Upload Handler (with canvas compression)
  const handleDeviceUpload = async (file: File) => {
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file (JPG, PNG, WEBP).');
      return;
    }

    if (file.size > 15 * 1024 * 1024) {
      setUploadError('Photo file size exceeds 15MB. Please choose a smaller photo.');
      return;
    }

    setUploading(true);
    setUploadError(null);
    setSelectedFileName(file.name);
    setImageLoadFailed(false);

    try {
      // Compress to 600px max width/height with 0.8 quality for crisp circular avatar
      const compressedBase64 = await compressImageFile(file, 600, 0.8);
      setFormPhotoUrl(compressedBase64);
    } catch (err: any) {
      setUploadError(err.message || 'Failed to process image file.');
    } finally {
      setUploading(false);
    }
  };

  // Google Drive Link Handler
  const handleDriveUrlInput = (rawVal: string) => {
    setRawInputUrl(rawVal);
    setUploadError(null);
    setImageLoadFailed(false);
    setSocialWarning(null);

    if (!rawVal.trim()) {
      setDriveDetected(false);
      setFolderWarning(null);
      setFormPhotoUrl('');
      return;
    }

    if (isGoogleDriveFolder(rawVal)) {
      setFolderWarning('Google Drive folder link detected! Please open the individual photo in Drive and copy its share link.');
      setDriveDetected(false);
      setFormPhotoUrl('');
      return;
    } else {
      setFolderWarning(null);
    }

    const socialCheck = checkSocialWebpageUrl(rawVal);
    if (socialCheck.isSocial) {
      setSocialWarning(`${socialCheck.platform} link entered. For best results, download the photo and use Device upload.`);
      setDriveDetected(false);
      setFormPhotoUrl('');
      return;
    }

    const isDrive = isGoogleDriveUrl(rawVal);
    const converted = convertGoogleDriveUrl(rawVal);
    setDriveDetected(isDrive);
    setFormPhotoUrl(converted);
  };

  // Web URL Handler
  const handleWebUrlInput = (rawVal: string) => {
    setRawInputUrl(rawVal);
    setUploadError(null);
    setImageLoadFailed(false);
    setFolderWarning(null);

    if (!rawVal.trim()) {
      setDriveDetected(false);
      setSocialWarning(null);
      setFormPhotoUrl('');
      return;
    }

    const socialCheck = checkSocialWebpageUrl(rawVal);
    if (socialCheck.isSocial) {
      setSocialWarning(`${socialCheck.platform} webpage link entered. Please copy the direct image link or use Device upload.`);
    } else {
      setSocialWarning(null);
    }

    const converted = convertGoogleDriveUrl(rawVal);
    setFormPhotoUrl(converted);
  };

  // Save (Create or Update)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formName.trim()) {
      setUploadError('Please enter the faculty member\'s full name.');
      return;
    }

    if (!formDesignation.trim()) {
      setUploadError('Please enter the designation (e.g. Principal, Assistant Teacher).');
      return;
    }

    const memberData: FacultyMember = {
      id: Number(formId) || 1,
      name: formName.trim(),
      designation: formDesignation.trim(),
      departmentOrSubject: formDeptOrSubject.trim() || 'General Education',
      roleCategory: formRoleCategory,
      isSeniorLeadership: formIsSenior,
      photoUrl: formPhotoUrl.trim() || undefined
    };

    if (editingMember) {
      updateFacultyMember(memberData);
      showToast(`Faculty member "${memberData.name}" updated successfully!`);
    } else {
      addFacultyMember(memberData);
      showToast(`Faculty member "${memberData.name}" (S.No. #${memberData.id}) added to roster!`);
    }

    setIsModalOpen(false);
  };

  // Delete Member
  const handleDelete = (member: FacultyMember) => {
    const confirmMessage = `Are you sure you want to remove ${member.name} (S.No. #${member.id}, ${member.designation}) from the official faculty directory?`;
    if (window.confirm(confirmMessage)) {
      deleteFacultyMember(member.id);
      showToast(`Faculty member "${member.name}" removed from roster.`, 'info');
    }
  };

  // Filter & Sort Logic
  const filteredFaculty = useMemo(() => {
    let list = [...faculty];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        (f) =>
          f.name.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.departmentOrSubject.toLowerCase().includes(q) ||
          String(f.id) === q
      );
    }

    // Role Category Filter
    if (roleFilter !== 'All') {
      list = list.filter((f) => f.roleCategory === roleFilter);
    }

    // Senior Filter
    if (seniorFilter === 'Senior') {
      list = list.filter((f) => f.isSeniorLeadership);
    } else if (seniorFilter === 'Regular') {
      list = list.filter((f) => !f.isSeniorLeadership);
    }

    // Sorting
    if (sortOrder === 'sno_asc') {
      list.sort((a, b) => Number(a.id) - Number(b.id));
    } else if (sortOrder === 'sno_desc') {
      list.sort((a, b) => Number(b.id) - Number(a.id));
    } else if (sortOrder === 'name_asc') {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }

    return list;
  }, [faculty, searchQuery, roleFilter, seniorFilter, sortOrder]);

  // Statistics
  const seniorCount = useMemo(() => faculty.filter((f) => f.isSeniorLeadership).length, [faculty]);
  const teacherCount = useMemo(() => faculty.filter((f) => f.roleCategory === 'teacher' || f.roleCategory === 'hod').length, [faculty]);
  const coordinatorCount = useMemo(() => faculty.filter((f) => f.roleCategory === 'coordinator' || f.roleCategory === 'parent_teacher').length, [faculty]);

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-academic space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold transition-all shadow-md ${
            toastMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
              : toastMessage.type === 'error'
              ? 'bg-rose-50 text-rose-900 border border-rose-300'
              : 'bg-amber-50 text-amber-900 border border-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>{toastMessage.text}</span>
          </div>
          <button
            onClick={() => setToastMessage(null)}
            className="text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header & Quick Action */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-100 text-gold-900 px-2 py-0.5 rounded border border-gold-300">
              School IT & Administrative Desk
            </span>
            <span className="text-xs text-slate-500">Live Roster Synchronization</span>
          </div>
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-navy-900">
            Faculty & Staff Directory Manager
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Add, update, or remove school educators, designations, and profile photos in circular frames.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => {
              setCurrentView('faculty');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center gap-1.5 transition-colors border border-slate-300"
            title="View public faculty page"
          >
            <ExternalLink className="w-3.5 h-3.5 text-slate-600" />
            <span>Public Faculty Page</span>
          </button>

          <button
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-navy-900 hover:bg-navy-800 text-gold-300 text-xs font-bold flex items-center gap-1.5 transition-all shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Faculty Member</span>
          </button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Total Faculty</span>
          <span className="text-2xl font-serif font-bold text-navy-950 mt-1 block">
            {faculty.length}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Official Roster</span>
        </div>
        <div className="bg-gold-50/70 p-4 rounded-2xl border border-gold-300">
          <span className="text-[11px] font-bold text-gold-900 block flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-gold-700" />
            Senior Leadership
          </span>
          <span className="text-2xl font-serif font-bold text-gold-950 mt-1 block">
            {seniorCount}
          </span>
          <span className="text-[10px] text-gold-800 mt-0.5 block">Top Showcase</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Teachers & HoDs</span>
          <span className="text-2xl font-serif font-bold text-navy-950 mt-1 block">
            {teacherCount}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Subject Specialists</span>
        </div>
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <span className="text-[11px] font-semibold text-slate-500 block">Coordinators & Staff</span>
          <span className="text-2xl font-serif font-bold text-navy-950 mt-1 block">
            {coordinatorCount}
          </span>
          <span className="text-[10px] text-slate-400 mt-0.5 block">Parent Support</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-slate-50 rounded-2xl border border-slate-200">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by Name, Designation, Subject, or S.No..."
            className="w-full pl-9 pr-3.5 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-navy-900 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <div className="flex items-center space-x-1.5">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as any)}
              className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-navy-900 focus:outline-none"
            >
              <option value="All">All Roles</option>
              <option value="leadership">Leadership</option>
              <option value="hod">HoD</option>
              <option value="coordinator">Coordinator</option>
              <option value="teacher">Teacher</option>
              <option value="parent_teacher">Parent Teacher</option>
            </select>
          </div>

          {/* Senior Filter */}
          <select
            value={seniorFilter}
            onChange={(e) => setSeniorFilter(e.target.value as any)}
            className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-navy-900 focus:outline-none"
          >
            <option value="All">All Categories</option>
            <option value="Senior">Senior Leadership Only</option>
            <option value="Regular">Other Faculty & Staff</option>
          </select>

          {/* Sort Order */}
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as any)}
            className="px-2.5 py-2 bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:ring-2 focus:ring-navy-900 focus:outline-none"
          >
            <option value="sno_asc">S.No. (1 to 42)</option>
            <option value="sno_desc">S.No. (Highest first)</option>
            <option value="name_asc">Name (A-Z)</option>
          </select>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-500 px-1">
        <span>
          Showing <strong>{filteredFaculty.length}</strong> of <strong>{faculty.length}</strong> faculty members
          {searchQuery && ` matching "${searchQuery}"`}
        </span>
        <span className="font-semibold text-gold-700">
          Circle Profile Photo Frame Enabled
        </span>
      </div>

      {/* Faculty Cards Grid */}
      {filteredFaculty.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredFaculty.map((member) => (
            <div
              key={member.id}
              className={`rounded-2xl p-4 border transition-all duration-200 relative flex flex-col justify-between ${
                member.isSeniorLeadership
                  ? 'bg-gradient-to-br from-white via-gold-50/20 to-amber-50/20 border-gold-300 shadow-sm hover:shadow-md hover:border-gold-500'
                  : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-sm'
              }`}
            >
              <div>
                {/* Header: S.No. Badge & Category Pill */}
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`inline-flex items-center justify-center w-7 h-7 rounded-lg text-xs font-bold shadow-sm ${
                      member.isSeniorLeadership
                        ? 'bg-navy-950 text-gold-300 border border-gold-500/50'
                        : 'bg-slate-800 text-white'
                    }`}
                  >
                    #{member.id}
                  </span>

                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                      member.isSeniorLeadership
                        ? 'bg-gold-100 text-gold-950 border-gold-300'
                        : 'bg-slate-100 text-slate-700 border-slate-200'
                    }`}
                  >
                    {member.roleCategory === 'leadership'
                      ? 'Leadership'
                      : member.roleCategory === 'hod'
                      ? 'HoD'
                      : member.roleCategory === 'coordinator'
                      ? 'Coordinator'
                      : member.roleCategory === 'parent_teacher'
                      ? 'Parent Teacher'
                      : 'Teacher'}
                  </span>
                </div>

                {/* Profile Photo in Circular Frame */}
                <div className="flex justify-center mb-3">
                  <div
                    className={`w-20 h-20 rounded-full p-1 shadow-md transition-transform hover:scale-105 overflow-hidden flex items-center justify-center ${
                      member.isSeniorLeadership
                        ? 'bg-gradient-to-tr from-gold-500 via-amber-400 to-navy-900 ring-2 ring-gold-400/40'
                        : 'bg-gradient-to-tr from-slate-200 to-slate-400 ring-1 ring-slate-200'
                    }`}
                  >
                    {member.photoUrl ? (
                      <img
                        src={resolveImageUrl(member.photoUrl)}
                        alt={member.name}
                        className="w-full h-full object-cover rounded-full bg-slate-100"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-navy-950 text-gold-300 flex items-center justify-center font-serif font-bold text-lg">
                        {member.name
                          .split(' ')
                          .filter((n) => !['Mr.', 'Mrs.', 'Miss', 'Ms.', 'Dr.'].includes(n))
                          .map((n) => n[0])
                          .join('') || `#${member.id}`}
                      </div>
                    )}
                  </div>
                </div>

                {/* Name & Designation */}
                <div className="text-center">
                  <h4 className={`text-sm font-bold truncate ${member.isSeniorLeadership ? 'text-navy-950' : 'text-slate-900'}`}>
                    {member.name}
                  </h4>
                  <p className="text-xs font-semibold text-gold-800 truncate mt-0.5">
                    {member.designation}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate mt-1 flex items-center justify-center gap-1">
                    <BookOpen className="w-3 h-3 text-slate-400 flex-shrink-0" />
                    <span>{member.departmentOrSubject}</span>
                  </p>
                </div>
              </div>

              {/* Card Actions */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                {member.isSeniorLeadership && (
                  <span className="text-[10px] font-bold text-gold-800 bg-gold-100 px-2 py-0.5 rounded-md flex items-center gap-1 border border-gold-200">
                    <Sparkles className="w-2.5 h-2.5 text-gold-600" />
                    <span>Senior</span>
                  </span>
                )}
                {!member.isSeniorLeadership && <span />}

                <div className="flex items-center gap-1.5 ml-auto">
                  <button
                    onClick={() => handleOpenEditModal(member)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-navy-900 hover:text-gold-300 text-slate-700 transition-colors"
                    title="Edit faculty member"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(member)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-600 hover:text-white text-rose-600 transition-colors"
                    title="Delete faculty member"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-slate-500 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
          <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <p className="text-sm font-semibold text-slate-700">No faculty members found</p>
          <p className="text-xs text-slate-500 mt-1">Try adjusting your search terms or filters.</p>
          <button
            onClick={() => {
              setSearchQuery('');
              setRoleFilter('All');
              setSeniorFilter('All');
            }}
            className="mt-3 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-bold text-navy-900 hover:bg-slate-100 transition-all shadow-sm"
          >
            Clear Filters
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* ADD / EDIT FACULTY MODAL WITH LIVE CIRCLE FRAME PHOTO PREVIEW */}
      {/* ========================================================================= */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl space-y-5 my-8 border border-slate-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 block">
                  Faculty & Staff Management
                </span>
                <h3 className="font-serif font-bold text-xl text-navy-950">
                  {editingMember ? `Edit Faculty: ${editingMember.name}` : 'Add New Faculty Member'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSave} className="space-y-5 text-xs">
              {/* Profile Photo in Circle Frame Section */}
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex flex-col items-center justify-center">
                <label className="text-xs font-bold text-navy-950 mb-3 flex items-center gap-1.5">
                  <Camera className="w-4 h-4 text-gold-600" />
                  <span>Profile Photo in Circle Frame (Live Preview)</span>
                </label>

                {/* Circle Frame */}
                <div className="relative group">
                  <div
                    className={`w-28 h-28 sm:w-32 sm:h-32 rounded-full p-1.5 shadow-lg flex items-center justify-center transition-all ${
                      formIsSenior
                        ? 'bg-gradient-to-tr from-gold-500 via-amber-400 to-navy-900 ring-4 ring-gold-400/30'
                        : 'bg-gradient-to-tr from-slate-300 via-slate-200 to-navy-900 ring-2 ring-slate-300'
                    }`}
                  >
                    {formPhotoUrl && !imageLoadFailed ? (
                      <img
                        src={resolveImageUrl(formPhotoUrl)}
                        alt="Preview"
                        className="w-full h-full object-cover rounded-full bg-white"
                        onLoad={() => setImageLoadFailed(false)}
                        onError={() => setImageLoadFailed(true)}
                      />
                    ) : (
                      <div className="w-full h-full rounded-full bg-navy-950 text-gold-300 flex flex-col items-center justify-center font-bold">
                        {formName ? (
                          <span className="text-xl font-serif">
                            {formName
                              .split(' ')
                              .filter((n) => !['Mr.', 'Mrs.', 'Miss', 'Ms.', 'Dr.'].includes(n))
                              .map((n) => n[0])
                              .join('') || `#${formId}`}
                          </span>
                        ) : (
                          <>
                            <Users className="w-7 h-7 text-gold-400/80 mb-0.5" />
                            <span className="text-[10px] text-slate-400">No Photo</span>
                          </>
                        )}
                      </div>
                    )}
                  </div>

                  {formPhotoUrl && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormPhotoUrl('');
                        setSelectedFileName(null);
                        setRawInputUrl('');
                        setDriveDetected(false);
                      }}
                      className="absolute -top-1 -right-1 w-6 h-6 bg-rose-600 hover:bg-rose-700 text-white rounded-full flex items-center justify-center shadow-md transition-all hover:scale-110"
                      title="Remove photo"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {imageLoadFailed && (
                  <p className="text-[11px] text-rose-600 font-bold mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3.5 h-3.5" />
                    <span>Image preview failed to load. Check link permissions.</span>
                  </p>
                )}

                {formPhotoUrl && !imageLoadFailed && (
                  <p className="text-[10.5px] text-emerald-700 font-semibold mt-2 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Photo verified & ready for circular rendering.</span>
                  </p>
                )}

                {formIsSenior && (
                  <span className="mt-2 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-gold-100 text-navy-950 border border-gold-300 shadow-sm flex items-center gap-1">
                    <Award className="w-3 h-3 text-gold-700" />
                    <span>Senior Leadership Gold Ring</span>
                  </span>
                )}
              </div>

              {/* Photo Source Selector */}
              <div>
                <label className="block font-bold text-navy-950 mb-1.5">
                  Select Photo Source
                </label>
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-100 rounded-xl border border-slate-200">
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMode('device');
                      setUploadError(null);
                    }}
                    className={`py-2 px-2 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                      uploadMode === 'device'
                        ? 'bg-white text-navy-950 shadow-sm border border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-navy-950'
                    }`}
                  >
                    <UploadCloud className="w-3.5 h-3.5 text-navy-800" />
                    <span>Device / Phone</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMode('drive');
                      setUploadError(null);
                    }}
                    className={`py-2 px-2 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                      uploadMode === 'drive'
                        ? 'bg-white text-navy-950 shadow-sm border border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-navy-950'
                    }`}
                  >
                    <HardDrive className="w-3.5 h-3.5 text-amber-600" />
                    <span>Google Drive</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setUploadMode('url');
                      setUploadError(null);
                    }}
                    className={`py-2 px-2 rounded-lg font-semibold text-[11px] flex items-center justify-center gap-1.5 transition-all ${
                      uploadMode === 'url'
                        ? 'bg-white text-navy-950 shadow-sm border border-slate-200 font-bold'
                        : 'text-slate-600 hover:text-navy-950'
                    }`}
                  >
                    <LinkIcon className="w-3.5 h-3.5 text-blue-600" />
                    <span>Web Link</span>
                  </button>
                </div>
              </div>

              {/* Upload Inputs */}
              {uploadMode === 'device' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) handleDeviceUpload(file);
                    }}
                  />
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 hover:border-navy-900 bg-white rounded-2xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center group"
                  >
                    <FileUp className="w-5 h-5 text-navy-900 mb-1" />
                    <p className="font-bold text-slate-800 text-xs">
                      {selectedFileName ? `Selected: ${selectedFileName}` : 'Click to select profile photo from device'}
                    </p>
                    <p className="text-[10.5px] text-slate-400 mt-0.5">
                      JPG, PNG, WEBP &bull; Auto-compressed to lightweight circular avatar
                    </p>
                  </div>
                </div>
              )}

              {uploadMode === 'drive' && (
                <div>
                  <input
                    type="url"
                    value={rawInputUrl}
                    onChange={(e) => handleDriveUrlInput(e.target.value)}
                    placeholder="https://drive.google.com/file/d/.../view?usp=sharing"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Ensure Google Drive sharing permission is set to <strong>"Anyone with the link can view"</strong>.
                  </p>
                  {driveDetected && (
                    <p className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3 text-emerald-600" />
                      <span>Google Drive direct image link generated successfully.</span>
                    </p>
                  )}
                </div>

              )}

              {uploadMode === 'url' && (
                <div>
                  <input
                    type="url"
                    value={rawInputUrl}
                    onChange={(e) => handleWebUrlInput(e.target.value)}
                    placeholder="https://example.com/photos/teacher.jpg"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>
              )}

              {/* Warning Messages */}
              {folderWarning && (
                <div className="p-2.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-300 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{folderWarning}</span>
                </div>
              )}
              {socialWarning && (
                <div className="p-2.5 bg-amber-50 text-amber-900 rounded-xl border border-amber-300 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0" />
                  <span>{socialWarning}</span>
                </div>
              )}
              {uploadError && (
                <div className="p-2.5 bg-rose-50 text-rose-900 rounded-xl border border-rose-300 text-[11px] flex items-center gap-1.5">
                  <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                  <span>{uploadError}</span>
                </div>
              )}

              {/* Member Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-bold text-navy-950 mb-1">
                    Serial Number (S.No. / Kram) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formId}
                    onChange={(e) => setFormId(Number(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none font-bold"
                  />
                  <span className="text-[10.5px] text-slate-400 mt-0.5 block">
                    Determines position on public roster (Top 10 reserved for Senior Leadership)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-navy-950 mb-1">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    placeholder="e.g. Mr. Nilay Singh, Mrs. Aditee Singh"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none font-semibold"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-950 mb-1">
                    Designation / Title <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={formDesignation}
                    onChange={(e) => setFormDesignation(e.target.value)}
                    placeholder="e.g. Principal, Associate Teacher – Science"
                    required
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-950 mb-1">
                    Department or Subject
                  </label>
                  <input
                    type="text"
                    value={formDeptOrSubject}
                    onChange={(e) => setFormDeptOrSubject(e.target.value)}
                    placeholder="e.g. General & Applied Sciences, Mathematics"
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-navy-900 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-bold text-navy-950 mb-1">
                    Role Category
                  </label>
                  <select
                    value={formRoleCategory}
                    onChange={(e) => setFormRoleCategory(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl bg-white focus:ring-2 focus:ring-navy-900 focus:outline-none font-medium"
                  >
                    <option value="leadership">Institutional Leadership</option>
                    <option value="hod">Head of Department (HoD)</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="teacher">Teacher / Educator</option>
                    <option value="parent_teacher">Parent Teacher</option>
                  </select>
                </div>

                {/* Senior Leadership Toggle */}
                <div className="flex items-center pt-5">
                  <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={formIsSenior}
                      onChange={(e) => setFormIsSenior(e.target.checked)}
                      className="w-4 h-4 text-gold-600 rounded focus:ring-gold-500 border-slate-300"
                    />
                    <div>
                      <span className="font-bold text-navy-950 block">Mark as Senior Leadership</span>
                      <span className="text-[10px] text-slate-500 block">
                        Features member in the Top 10 Showcase with gold ring frame
                      </span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end space-x-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={uploading}
                  className="px-5 py-2.5 text-xs font-bold rounded-xl shadow-md transition-all flex items-center gap-1.5 bg-navy-900 hover:bg-navy-800 text-gold-300"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{editingMember ? 'Save Changes' : 'Add to Faculty Directory'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
