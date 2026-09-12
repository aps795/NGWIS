import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { X, Calendar, Tag, FileText, Download, Printer, ExternalLink, Eye, ZoomIn } from 'lucide-react';
import { resolveImageUrl } from '../../utils/imageHelpers';

export const NoticeModal: React.FC = () => {
  const { activeNoticeModal, setActiveNoticeModal, settings } = useSchoolData();
  const [showDocPreview, setShowDocPreview] = useState(false);
  const [docFullscreenModal, setDocFullscreenModal] = useState(false);

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

          {/* Attached Official Notice Document / JPG / PDF Attachment Card */}
          {activeNoticeModal.imageUrl && (
            <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/90 overflow-hidden shadow-sm">
              <div className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-slate-50 to-amber-50/40">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/90 border border-amber-300 flex items-center justify-center flex-shrink-0 text-amber-900 shadow-sm">
                    <FileText className="w-5 h-5 text-amber-700" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-xs font-bold text-navy-950">
                        {activeNoticeModal.fileDownloadName || `Official_Notice_Document_${activeNoticeModal.date}.jpg`}
                      </p>
                      <span className="text-[9px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-navy-900 text-gold-300">
                        JPG / Document
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Official Institutional Circular Attachment & Signed Copy
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  {/* Option: View Notice Document / JPG */}
                  <button
                    type="button"
                    onClick={() => setShowDocPreview(!showDocPreview)}
                    className="bg-navy-900 hover:bg-navy-800 text-gold-300 text-xs font-bold px-3.5 py-2 rounded-xl shadow flex items-center gap-1.5 transition-all"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{showDocPreview ? 'Hide Document' : 'View Notice Document (JPG)'}</span>
                  </button>

                  {/* Option: Open in Full Screen / New Tab */}
                  <button
                    type="button"
                    onClick={() => setDocFullscreenModal(true)}
                    className="p-2 text-slate-700 hover:text-navy-950 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-sm transition-colors"
                    title="View Fullscreen Lightbox"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>

                  <a
                    href={resolveImageUrl(activeNoticeModal.imageUrl)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-slate-700 hover:text-navy-950 bg-white hover:bg-slate-100 rounded-xl border border-slate-200 shadow-sm transition-colors"
                    title="Open Document in New Tab"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Collapsible / Expandable Notice Document Viewer */}
              {showDocPreview && (
                <div className="p-3 bg-slate-900/5 border-t border-slate-200 flex flex-col items-center animate-fadeIn">
                  <div className="relative group/doc max-w-full">
                    <img
                      src={resolveImageUrl(activeNoticeModal.imageUrl)}
                      alt={activeNoticeModal.title}
                      className="max-h-[500px] w-auto max-w-full rounded-xl object-contain shadow-md cursor-zoom-in bg-white"
                      onClick={() => setDocFullscreenModal(true)}
                      title="Click to view full screen zoom"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div
                      onClick={() => setDocFullscreenModal(true)}
                      className="absolute inset-0 bg-black/20 opacity-0 group-hover/doc:opacity-100 rounded-xl flex items-center justify-center cursor-zoom-in transition-opacity"
                    >
                      <span className="bg-black/75 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow">
                        <ZoomIn className="w-4 h-4" />
                        <span>Click for Fullscreen View</span>
                      </span>
                    </div>
                  </div>

                  <div className="w-full flex items-center justify-between pt-2 px-1 text-[11px] text-slate-500">
                    <span>Click on circular to zoom in full screen</span>
                    <a
                      href={resolveImageUrl(activeNoticeModal.imageUrl)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-academic-700 hover:text-navy-950 hover:underline font-semibold flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>Open in Browser Tab</span>
                    </a>
                  </div>
                </div>
              )}
            </div>
          )}

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

      {/* Fullscreen High-Resolution Document Lightbox */}
      {docFullscreenModal && activeNoticeModal.imageUrl && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setDocFullscreenModal(false)}
        >
          <div
            className="relative max-w-5xl max-h-[95vh] bg-slate-950 rounded-2xl overflow-hidden shadow-2xl p-2 border border-slate-800 flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between p-2 text-white border-b border-slate-800">
              <span className="text-xs font-semibold text-slate-300 truncate max-w-md">
                {activeNoticeModal.title} — Official Circular Document
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={resolveImageUrl(activeNoticeModal.imageUrl)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1 rounded-lg bg-navy-800 hover:bg-navy-700 text-gold-300 text-xs font-semibold flex items-center gap-1 transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open Tab</span>
                </a>
                <button
                  onClick={() => setDocFullscreenModal(false)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  title="Close viewer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            <div className="p-2 overflow-auto max-h-[85vh] w-full flex items-center justify-center">
              <img
                src={resolveImageUrl(activeNoticeModal.imageUrl)}
                alt={activeNoticeModal.title}
                className="max-h-[82vh] w-auto max-w-full rounded-lg object-contain"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
