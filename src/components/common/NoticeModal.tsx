import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { X, Calendar, Tag, FileText, Download, Printer } from 'lucide-react';

export const NoticeModal: React.FC = () => {
  const { activeNoticeModal, setActiveNoticeModal, settings } = useSchoolData();

  if (!activeNoticeModal) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="notice-title"
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => setActiveNoticeModal(null)}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl border border-slate-200 max-w-2xl w-full overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Ribbon */}
        <div className="bg-navy-900 text-white p-6 border-b border-gold-500/30 relative">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img src="/favicon.svg" alt="Crest" className="w-8 h-8 object-contain" />
              <div>
                <p className="text-[11px] uppercase tracking-wider text-gold-400 font-semibold font-crest">
                  {settings.schoolName}
                </p>
                <p className="text-[10px] text-slate-300">Official Notice & Circular</p>
              </div>
            </div>

            <button
              onClick={() => setActiveNoticeModal(null)}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-navy-800 transition-colors"
              aria-label="Close notice"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
            <span className="inline-flex items-center gap-1 bg-gold-500/20 text-gold-300 px-2.5 py-1 rounded font-medium border border-gold-500/30">
              <Tag className="w-3.5 h-3.5" />
              {activeNoticeModal.category}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-gold-400" />
              Date of Issue: {activeNoticeModal.date}
            </span>
          </div>
        </div>

        {/* Notice Body */}
        <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-4">
          <h3 id="notice-title" className="font-serif text-xl sm:text-2xl font-bold text-navy-900 leading-snug">
            {activeNoticeModal.title}
          </h3>

          <div className="p-3 bg-slate-50 border-l-4 border-academic-700 rounded text-xs text-slate-700 font-medium">
            Summary: {activeNoticeModal.summary}
          </div>

          <div className="prose prose-slate max-w-none text-sm leading-relaxed text-slate-700 whitespace-pre-line pt-2">
            {activeNoticeModal.content}
          </div>

          {activeNoticeModal.fileDownloadName && (
            <div className="mt-6 p-4 rounded-xl bg-gold-50/60 border border-gold-200 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <FileText className="w-6 h-6 text-gold-600 flex-shrink-0" />
                <div>
                  <p className="text-xs font-bold text-navy-900">{activeNoticeModal.fileDownloadName}</p>
                  <p className="text-[11px] text-slate-500">Official Circular Attachment</p>
                </div>
              </div>
              <button
                onClick={() => alert(`Downloading attachment: ${activeNoticeModal.fileDownloadName}`)}
                className="bg-navy-900 hover:bg-navy-800 text-gold-300 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center space-x-1 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download</span>
              </button>
            </div>
          )}
        </div>

        {/* Footer controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between">
          <button
            onClick={handlePrint}
            className="inline-flex items-center space-x-1.5 text-xs text-slate-600 hover:text-navy-900 font-medium transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Circular</span>
          </button>

          <button
            onClick={() => setActiveNoticeModal(null)}
            className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
          >
            Close Notice
          </button>
        </div>
      </div>
    </div>
  );
};
