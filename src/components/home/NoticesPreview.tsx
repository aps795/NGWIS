import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SectionHeading } from '../common/SectionHeading';
import { Bell, Calendar, ArrowRight, Eye, Pin } from 'lucide-react';

export const NoticesPreview: React.FC = () => {
  const { notices, setActiveNoticeModal, setCurrentView } = useSchoolData();

  const publishedNotices = notices.filter((n) => n.isPublished).slice(0, 4);

  const getCategoryColor = (cat: string) => {
    switch (cat) {
      case 'Admission': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'Examination': return 'bg-rose-100 text-rose-800 border-rose-300';
      case 'Holiday': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'Event': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-blue-100 text-blue-800 border-blue-300';
    }
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <SectionHeading
            subtitle="Official Communication"
            title="School Notice Board & Circulars"
            description="Important institutional announcements, examination schedules, holiday circulars, and academic notifications."
            align="left"
          />

          <button
            onClick={() => setCurrentView('notices')}
            className="self-start sm:self-end inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-academic-700 hover:text-navy-900 mb-6 sm:mb-12 group transition-colors"
          >
            <span>View All Notices</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Notices Stack */}
        <div className="space-y-3">
          {publishedNotices.map((notice) => (
            <div
              key={notice.id}
              onClick={() => setActiveNoticeModal(notice)}
              className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/90 shadow-sm hover:shadow-academic hover:border-gold-400 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-4 group"
            >
              <div className="flex items-start space-x-3.5 flex-1">
                {/* Notice Icon / Pin */}
                <div className="w-10 h-10 rounded-xl bg-navy-50 border border-navy-100 flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-gold-50 group-hover:border-gold-300 transition-colors">
                  {notice.isPinned ? (
                    <Pin className="w-5 h-5 text-gold-600 rotate-45" />
                  ) : (
                    <Bell className="w-5 h-5 text-academic-700 group-hover:text-gold-600 transition-colors" />
                  )}
                </div>

                <div className="space-y-1 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded border ${getCategoryColor(notice.category)}`}>
                      {notice.category}
                    </span>
                    {notice.isPinned && (
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2 py-0.5 rounded shadow-sm">
                        Important
                      </span>
                    )}
                    <span className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3 text-slate-400" />
                      {notice.date}
                    </span>
                  </div>

                  <h3 className="font-serif font-bold text-sm sm:text-base text-navy-900 group-hover:text-academic-700 transition-colors">
                    {notice.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-1">
                    {notice.summary}
                  </p>
                </div>
              </div>

              {/* View Details Action */}
              <div className="flex items-center justify-between sm:justify-end border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
                <span className="inline-flex items-center space-x-1.5 text-xs font-semibold text-academic-700 group-hover:text-gold-600 transition-colors bg-slate-50 sm:bg-transparent px-3 py-1.5 rounded-lg">
                  <Eye className="w-3.5 h-3.5" />
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
