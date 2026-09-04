import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Award,
  BookOpen,
  ShieldCheck,
  CheckCircle2,
  GraduationCap,
  ArrowRight,
  School
} from 'lucide-react';
import { facultyList } from '../data/facultyData';
import { useSchoolData } from '../context/SchoolDataContext';

export const FacultyPage: React.FC = () => {
  const { setCurrentView } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'senior' | 'teaching' | 'science_math' | 'languages' | 'parent_teacher'>('all');

  // Senior leadership list: numbers 1, 2, 3, 4, 5, 6, 7, 8, 11, 22
  const seniorLeaders = useMemo(() => {
    return facultyList.filter(f => f.isSeniorLeadership);
  }, []);

  // Filtered members in strict S.No. (kram) order
  const filteredList = useMemo(() => {
    let list = [...facultyList].sort((a, b) => a.id - b.id);

    // Category filter
    if (activeTab === 'senior') {
      list = list.filter(f => f.isSeniorLeadership);
    } else if (activeTab === 'teaching') {
      list = list.filter(f => f.roleCategory === 'teacher' || f.roleCategory === 'hod');
    } else if (activeTab === 'science_math') {
      list = list.filter(f =>
        f.designation.toLowerCase().includes('science') ||
        f.designation.toLowerCase().includes('math') ||
        f.designation.toLowerCase().includes('physics') ||
        f.designation.toLowerCase().includes('chemistry') ||
        f.designation.toLowerCase().includes('biology') ||
        f.departmentOrSubject.toLowerCase().includes('science') ||
        f.departmentOrSubject.toLowerCase().includes('math')
      );
    } else if (activeTab === 'languages') {
      list = list.filter(f =>
        f.designation.toLowerCase().includes('hindi') ||
        f.designation.toLowerCase().includes('english') ||
        f.departmentOrSubject.toLowerCase().includes('hindi') ||
        f.departmentOrSubject.toLowerCase().includes('english')
      );
    } else if (activeTab === 'parent_teacher') {
      list = list.filter(f => f.roleCategory === 'parent_teacher');
    }

    // Search query filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      list = list.filter(
        f =>
          f.name.toLowerCase().includes(q) ||
          f.designation.toLowerCase().includes(q) ||
          f.departmentOrSubject.toLowerCase().includes(q) ||
          f.id.toString() === q
      );
    }

    return list;
  }, [activeTab, searchQuery]);

  return (
    <div className="w-full bg-white">
      {/* Hero Page Banner */}
      <div className="bg-navy-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-gold-500/30">
        <div className="absolute inset-0 bg-hero-pattern opacity-10 pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/40 mb-3.5 shadow-sm">
            <Users className="w-3.5 h-3.5 text-gold-400" />
            Official School Record &bull; Total Staff Strength: 42
          </span>
          <h1 className="font-crest text-3xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
            Our Faculty & Academic Staff
          </h1>
          <div className="flex items-center justify-center gap-2 mb-5">
            <div className="h-[2px] w-14 bg-gold-400 rounded-full" />
            <div className="w-2.5 h-2.5 rotate-45 bg-gold-400 rounded-[1px]" />
            <div className="h-[2px] w-14 bg-gold-400 rounded-full" />
          </div>
          <p className="max-w-3xl mx-auto text-sm sm:text-base text-slate-300 leading-relaxed">
            The intellectual and moral bedrock of <strong>New Global Wisdom International School</strong> is our 42-member dedicated educator team. Led by experienced pedagogical minds, subject masters, and student mentors in Bhujehuan, Sauna, Ghazipur.
          </p>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto mt-10">
            <div className="bg-navy-900/80 backdrop-blur-md p-4 rounded-2xl border border-navy-700/80 text-center">
              <span className="block text-2xl sm:text-3xl font-bold text-gold-400">42</span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider">Total Staff Members</span>
            </div>
            <div className="bg-navy-900/80 backdrop-blur-md p-4 rounded-2xl border border-navy-700/80 text-center">
              <span className="block text-2xl sm:text-3xl font-bold text-gold-400">10</span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider">Senior Leadership & HoDs</span>
            </div>
            <div className="bg-navy-900/80 backdrop-blur-md p-4 rounded-2xl border border-navy-700/80 text-center">
              <span className="block text-2xl sm:text-3xl font-bold text-gold-400">28</span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider">Subject Teachers</span>
            </div>
            <div className="bg-navy-900/80 backdrop-blur-md p-4 rounded-2xl border border-navy-700/80 text-center">
              <span className="block text-2xl sm:text-3xl font-bold text-gold-400">08</span>
              <span className="text-[11px] sm:text-xs text-slate-300 font-medium uppercase tracking-wider">Parent Teachers</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20">
        {/* ========================================================================= */}
        {/* TOP SECTION: SENIOR FACULTY & KEY LEADERSHIP (BOLD IN OFFICIAL RECORDS) */}
        {/* ========================================================================= */}
        <div className="mb-16">
          <div className="flex items-center justify-between flex-wrap gap-4 pb-4 mb-8 border-b-2 border-gold-400/40">
            <div className="flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-2xl bg-navy-950 text-gold-400 flex items-center justify-center shadow-lg border border-gold-500/40">
                <Award className="w-6 h-6 text-gold-400" />
              </div>
              <div>
                <span className="text-[11px] font-bold text-gold-700 uppercase tracking-wider block">
                  Prominent Academic Leadership
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-navy-950">
                  Senior Faculty & Institutional Leadership
                </h2>
                <p className="text-xs text-slate-600 mt-0.5">
                  Distinguished administrators, coordinators, and senior subject teachers (Records #1–#8, #11, #22)
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="px-3.5 py-1.5 rounded-xl bg-gold-100 text-navy-950 text-xs font-bold border border-gold-300 shadow-sm">
                10 Highlighted Leaders
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {seniorLeaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-white rounded-2xl p-5 border-2 border-gold-400/60 shadow-academic hover:shadow-academic-lg hover:border-gold-500 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-navy-950 text-gold-300 font-bold text-xs shadow">
                      #{leader.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-100 text-navy-950 border border-gold-300">
                      {leader.roleCategory === 'leadership'
                        ? 'Leadership'
                        : leader.roleCategory === 'hod'
                        ? 'HoD'
                        : leader.roleCategory === 'coordinator'
                        ? 'Coordinator'
                        : 'Senior Faculty'}
                    </span>
                  </div>

                  {/* Profile Photo */}
                  <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full p-1 bg-gradient-to-tr from-gold-500 via-amber-400 to-navy-900 shadow-md group-hover:scale-105 transition-transform overflow-hidden">
                      {leader.photoUrl ? (
                        <img
                          src={leader.photoUrl}
                          alt={leader.name}
                          className="w-full h-full object-cover rounded-full bg-slate-100"
                          loading="lazy"
                        />
                      ) : (
                        <div className="w-full h-full rounded-full bg-navy-900 text-gold-300 flex items-center justify-center font-serif font-bold text-xl sm:text-2xl">
                          {leader.name.split(' ').filter(n => !['Mr.', 'Mrs.', 'Miss', 'Ms.'].includes(n)).map(n => n[0]).join('')}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="text-center">
                    <h3 className="font-bold text-sm sm:text-base text-navy-950 group-hover:text-academic-700 transition-colors leading-snug">
                      {leader.name}
                    </h3>
                    <p className="text-xs font-semibold text-gold-700 mt-1">
                      {leader.designation}
                    </p>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-start space-x-2 text-[11px] text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{leader.departmentOrSubject}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPLETE STAFF DIRECTORY IN STRICT S.NO. (KRAM) ORDER (1 TO 42) */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-academic-lg">
          {/* Header & Description */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
            <div>
              <span className="text-xs font-bold text-academic-700 uppercase tracking-wider block">
                Official Staff Roster (S.No. 1 to 42)
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-bold text-navy-950 mt-1">
                Complete Faculty Directory
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                All 42 teachers arranged in official serial number sequence (S.No. kram) with individual designations and subject responsibilities.
              </p>
            </div>

            {/* Total Badge */}
            <div className="flex items-center space-x-2 bg-slate-100 px-4 py-2 rounded-2xl border border-slate-200 self-start md:self-auto">
              <GraduationCap className="w-5 h-5 text-gold-600" />
              <div className="text-left">
                <span className="text-[10px] uppercase tracking-wider text-slate-500 font-bold block">Total Staff</span>
                <span className="text-sm font-bold text-navy-950">42 Members Listed</span>
              </div>
            </div>
          </div>

          {/* Controls Bar: Search & Filter Tabs */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8">
            {/* Filter Tabs */}
            <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 pb-2 lg:pb-0">
              {[
                { id: 'all', label: `All Staff (1–42)` },
                { id: 'senior', label: `Senior Leadership (10)` },
                { id: 'teaching', label: `Teaching Faculty (28)` },
                { id: 'languages', label: `Languages (15)` },
                { id: 'science_math', label: `Science & Math (11)` },
                { id: 'parent_teacher', label: `Parent Teachers (8)` },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'bg-navy-950 text-gold-300 shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative min-w-[260px] sm:min-w-[320px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search teacher by name, subject, or S.No..."
                className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white transition-all shadow-sm"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 px-1"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-6 pb-2 border-b border-slate-100">
            <span>
              Showing <strong>{filteredList.length}</strong> of <strong>{facultyList.length}</strong> faculty members (sorted strictly by S.No.)
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
            <span className="hidden sm:inline text-gold-700 font-semibold">
              S.No. 1 to 42 Sequential Order
            </span>
          </div>

          {/* Staff Grid in S.No. Order */}
          {filteredList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredList.map((staff) => (
                <div
                  key={staff.id}
                  className={`p-4 rounded-2xl border transition-all duration-200 ${
                    staff.isSeniorLeadership
                      ? 'bg-gradient-to-br from-white via-gold-50/30 to-amber-50/20 border-gold-300/90 shadow-sm hover:shadow-md hover:border-gold-500'
                      : 'bg-slate-50/70 border-slate-200 hover:border-academic-300 hover:bg-white hover:shadow-sm'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Profile Photo Avatar & S.No. Badge */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-13 h-13 sm:w-14 sm:h-14 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs shadow-sm border-2 ${
                          staff.isSeniorLeadership
                            ? 'border-gold-400 bg-navy-950 text-gold-300 ring-2 ring-gold-400/20'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                        style={{ width: '3.25rem', height: '3.25rem' }}
                      >
                        {staff.photoUrl ? (
                          <img
                            src={staff.photoUrl}
                            alt={staff.name}
                            className="w-full h-full object-cover rounded-full bg-slate-100"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full bg-slate-100 flex items-center justify-center font-bold text-slate-600 text-xs">
                            {staff.name.split(' ').filter(n => !['Mr.', 'Mrs.', 'Miss', 'Ms.'].includes(n)).map(n => n[0]).join('') || `#${staff.id}`}
                          </div>
                        )}
                      </div>
                      <span className={`absolute -top-1 -right-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full shadow-sm ${
                        staff.isSeniorLeadership
                          ? 'bg-navy-950 text-gold-300 border border-gold-500/50'
                          : 'bg-slate-700 text-white'
                      }`}>
                        #{staff.id}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1.5">
                        <h4 className={`text-sm truncate ${staff.isSeniorLeadership ? 'font-bold text-navy-950' : 'font-semibold text-slate-900'}`}>
                          {staff.name}
                        </h4>
                        {staff.isSeniorLeadership && (
                          <span className="inline-flex items-center text-[10px] font-bold text-gold-800 bg-gold-100 px-2 py-0.5 rounded-full flex-shrink-0 border border-gold-200">
                            Senior
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-academic-700 font-medium truncate mt-0.5">
                        {staff.designation}
                      </p>

                      <p className="text-[11px] text-slate-500 truncate mt-1 flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                        <span>{staff.departmentOrSubject}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-14 text-slate-500">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm font-semibold">No faculty members found matching your search query.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                className="mt-3 text-xs font-bold text-gold-600 hover:underline inline-flex items-center gap-1"
              >
                <span>Reset search & view all 42 staff</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Institutional Compliance Verification Notice */}
          <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Certified under Official School Staff Records &bull; Total Staff Strength: 42</span>
            </div>
            <span className="font-semibold text-navy-950">New Global Wisdom International School &bull; Estd. 2016</span>
          </div>
        </div>

        {/* Join our Team / Contact CTA */}
        <div className="mt-14 bg-gradient-to-r from-navy-950 via-navy-900 to-academic-900 text-white rounded-3xl p-8 sm:p-10 border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 rounded-2xl bg-gold-500 text-navy-950 flex items-center justify-center flex-shrink-0 font-bold shadow-lg">
              <School className="w-7 h-7" />
            </div>
            <div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
                Learn More About Our Pedagogical Standards
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Have questions about our academic curriculum, teacher-student ratios, or admissions?
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => {
                setCurrentView('admissions');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md hover:scale-105"
            >
              Admissions Process
            </button>
            <button
              onClick={() => {
                setCurrentView('contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-5 py-3 rounded-xl transition-colors border border-white/20"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
