import React, { useState, useMemo } from 'react';
import {
  Users,
  Search,
  Award,
  BookOpen,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { facultyList } from '../../data/facultyData';

export const FacultySection: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'senior' | 'teaching' | 'science_math' | 'languages' | 'parent_teacher'>('all');

  // Senior leadership list: numbers 1, 2, 3, 4, 5, 6, 7, 8, 11, 22
  const seniorLeaders = useMemo(() => {
    return facultyList.filter(f => f.isSeniorLeadership);
  }, []);

  // Filtered members for the full list / search in strict S.No. order (1 to 42)
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
    <section id="faculty-section" className="py-16 sm:py-24 bg-slate-50 relative overflow-hidden border-t border-slate-200">
      {/* Background Decorative Pattern */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gold-500/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-academic-600/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Heading */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-500/15 text-gold-800 border border-gold-400/40 mb-3 shadow-sm">
            <Users className="w-3.5 h-3.5 text-gold-600" />
            Official School Record &bull; Total Staff Strength: 42
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-navy-900 leading-tight">
            Our Faculty & Academic Staff
          </h2>
          <div className="flex items-center justify-center gap-2 mt-3 mb-4">
            <div className="h-[2px] w-12 bg-gold-500 rounded-full" />
            <div className="w-2.5 h-2.5 rotate-45 bg-gold-600 rounded-[1px]" />
            <div className="h-[2px] w-12 bg-gold-500 rounded-full" />
          </div>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The foundation of <strong>New Global Wisdom International School</strong> is our 42-member dedicated team of pedagogical leaders, subject specialists, and educators committed to holistic child development.
          </p>
        </div>

        {/* ========================================================================= */}
        {/* TOP SECTION: SENIOR FACULTY & KEY LEADERSHIP (BOLD IN OFFICIAL RECORDS) */}
        {/* ========================================================================= */}
        <div className="mb-16">
          <div className="flex items-center justify-between flex-wrap gap-3 pb-4 mb-6 border-b border-gold-300/60">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-navy-950 text-gold-400 flex items-center justify-center shadow">
                <Award className="w-5 h-5 text-gold-400" />
              </div>
              <div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-navy-950">
                  Senior Faculty & Institutional Leadership
                </h3>
                <p className="text-xs text-slate-600">
                  Key Management, Heads of Department & Senior Educators (Records #1–#8, #11, #22)
                </p>
              </div>
            </div>
            <span className="px-3 py-1 rounded-full bg-navy-950 text-gold-300 text-xs font-bold shadow-sm">
              10 Key Staff
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 sm:gap-5">
            {seniorLeaders.map((leader) => (
              <div
                key={leader.id}
                className="bg-white rounded-2xl p-5 border-2 border-gold-400/50 shadow-academic hover:shadow-academic-lg hover:border-gold-500 transition-all duration-300 relative group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="inline-flex items-center justify-center w-8 h-8 rounded-xl bg-navy-950 text-gold-300 font-bold text-xs shadow">
                      #{leader.id}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-gold-100 text-navy-950 border border-gold-300">
                      {leader.roleCategory === 'leadership' ? 'Leadership' : leader.roleCategory === 'hod' ? 'HoD' : leader.roleCategory === 'coordinator' ? 'Coordinator' : 'Senior Faculty'}
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
                    <h4 className="font-bold text-sm sm:text-base text-navy-950 group-hover:text-academic-700 transition-colors leading-snug">
                      {leader.name}
                    </h4>
                    <p className="text-xs font-semibold text-gold-700 mt-1">
                      {leader.designation}
                    </p>
                  </div>
                </div>

                {/* Department / Subject */}
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-start space-x-2 text-[11px] text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{leader.departmentOrSubject}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================================= */}
        {/* COMPLETE STAFF DIRECTORY WITH FILTER TABS & SEARCH */}
        {/* ========================================================================= */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-academic-lg">
          {/* Controls Bar: Search & Filter Tabs */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
            {/* Filter Tabs */}
            <div className="flex items-center overflow-x-auto no-scrollbar gap-1.5 pb-2 lg:pb-0">
              {[
                { id: 'all', label: `All Staff (42)` },
                { id: 'senior', label: `Senior Faculty (10)` },
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
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by teacher name, subject, or roll #..."
                className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-gold-400 focus:bg-white transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Results Summary */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-6">
            <span>
              Showing <strong>{filteredList.length}</strong> of <strong>{facultyList.length}</strong> staff members
              {searchQuery && ` matching "${searchQuery}"`}
            </span>
            <span className="hidden sm:inline text-gold-700 font-medium">
              Official School Record Staff Roster
            </span>
          </div>

          {/* Staff Grid */}
          {filteredList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredList.map((staff) => (
                <div
                  key={staff.id}
                  className={`p-4 rounded-xl border transition-all ${
                    staff.isSeniorLeadership
                      ? 'bg-gradient-to-br from-white to-gold-50/40 border-gold-300 hover:border-gold-500 shadow-sm'
                      : 'bg-slate-50/70 border-slate-200 hover:border-academic-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    {/* Profile Photo Avatar & S.No. Badge */}
                    <div className="relative flex-shrink-0">
                      <div
                        className={`w-12 h-12 rounded-full overflow-hidden flex items-center justify-center font-bold text-xs shadow-sm border-2 ${
                          staff.isSeniorLeadership
                            ? 'border-gold-400 bg-navy-950 text-gold-300 ring-2 ring-gold-400/20'
                            : 'border-slate-200 bg-white text-slate-700'
                        }`}
                        style={{ width: '3rem', height: '3rem' }}
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
                      <span className={`absolute -top-1 -right-1 text-[9px] font-bold px-1.5 py-0.2 rounded-full shadow-sm ${
                        staff.isSeniorLeadership
                          ? 'bg-navy-950 text-gold-300 border border-gold-500/50'
                          : 'bg-slate-700 text-white'
                      }`}>
                        #{staff.id}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <h4 className={`text-sm truncate ${staff.isSeniorLeadership ? 'font-bold text-navy-950' : 'font-semibold text-slate-900'}`}>
                          {staff.name}
                        </h4>
                        {staff.isSeniorLeadership && (
                          <span className="inline-flex items-center text-[10px] font-bold text-gold-700 bg-gold-100 px-1.5 py-0.5 rounded flex-shrink-0">
                            Senior
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-academic-700 font-medium truncate mt-0.5">
                        {staff.designation}
                      </p>

                      <p className="text-[11px] text-slate-500 truncate mt-1 flex items-center gap-1">
                        <BookOpen className="w-3 h-3 text-slate-400 flex-shrink-0" />
                        <span>{staff.departmentOrSubject}</span>
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-500">
              <p className="text-sm">No faculty members found matching your search.</p>
              <button
                onClick={() => { setSearchQuery(''); setActiveTab('all'); }}
                className="mt-2 text-xs font-semibold text-gold-600 hover:underline"
              >
                Reset search & show all 42 staff
              </button>
            </div>
          )}

          {/* Institutional Note */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
              <span>Certified under New Global Wisdom International School Administration Records.</span>
            </div>
            <span className="font-semibold text-navy-950">Saidpur, Ghazipur Campus</span>
          </div>
        </div>
      </div>
    </section>
  );
};
