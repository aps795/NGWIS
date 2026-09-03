import React, { useState } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';
import {
  Bell,
  Search,
  Calendar,
  Eye,
  Pin,
  FileText,
  Filter
} from 'lucide-react';
import type { NoticeCategory } from '../types/school';

export const NoticesPage: React.FC = () => {
  const { notices, setActiveNoticeModal } = useSchoolData();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const categories = ['All', 'Circular', 'Holiday', 'Examination', 'Admission', 'Event'];

  const filteredNotices = notices.filter((n) => {
    if (!n.isPublished) return false;
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch =
      n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.summary.toLowerCase().includes(searchQuery.toLowerCase()) ||
      n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getCategoryBadgeClass = (cat: NoticeCategory) => {
    switch (cat) {
      case 'Admission': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Examination': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Holiday': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Event': return 'bg-purple-100 text-purple-800 border-purple-300';
      case 'Circular': return 'bg-blue-100 text-blue-800 border-blue-300';
      default: return 'bg-slate-100 text-slate-800 border-slate-300';
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-3">
            <Bell className="w-3.5 h-3.5" />
            Official Notice Desk
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Notice Board & Circulars
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Stay updated with official institutional communications, examination routines, vacation dates, and parent circulars.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Search & Filter Controls */}
        <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200 shadow-sm mb-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Search Input */}
            <div className="relative w-full md:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search circulars by keyword..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-500"
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 w-full md:w-auto">
              <span className="text-xs font-semibold text-slate-500 mr-1 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Category:
              </span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-navy-900 text-gold-300 shadow-sm'
                      : 'bg-white text-slate-600 hover:bg-slate-200 border border-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Notices Feed */}
        <div className="space-y-4">
          {filteredNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setActiveNoticeModal(notice)}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-academic hover:border-gold-400 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-6 group"
            >
              <div className="flex items-start space-x-4 flex-1">
                <div className="w-12 h-12 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center flex-shrink-0 group-hover:bg-gold-50 group-hover:border-gold-300 transition-colors">
                  {notice.isPinned ? (
                    <Pin className="w-6 h-6 text-gold-600 rotate-45" />
                  ) : (
                    <FileText className="w-6 h-6 text-academic-700 group-hover:text-gold-600 transition-colors" />
                  )}
                </div>

                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded border ${getCategoryBadgeClass(notice.category)}`}>
                      {notice.category}
                    </span>
                    {notice.isPinned && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2 py-0.5 rounded shadow-sm">
                        Pinned Circular
                      </span>
                    )}
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Date of Issue: {notice.date}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-base sm:text-lg text-navy-900 group-hover:text-academic-700 transition-colors">
                    {notice.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {notice.summary}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-end flex-shrink-0 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                <span className="inline-flex items-center space-x-1.5 text-xs font-bold text-academic-700 group-hover:text-navy-900 transition-colors bg-slate-50 group-hover:bg-gold-50 px-4 py-2 rounded-xl border border-slate-200 group-hover:border-gold-300">
                  <Eye className="w-4 h-4" />
                  <span>View Details</span>
                </span>
              </div>
            </div>
          ))}

          {filteredNotices.length === 0 && (
            <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Bell className="w-10 h-10 text-slate-400 mx-auto mb-3" />
              <p className="text-sm font-semibold text-slate-600">No circulars match your search.</p>
              <p className="text-xs text-slate-400 mt-1">Please clear filters or search query to see all announcements.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
