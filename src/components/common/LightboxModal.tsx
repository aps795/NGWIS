import React, { useEffect } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export const LightboxModal: React.FC = () => {
  const { selectedGalleryImage, setSelectedGalleryImage, gallery } = useSchoolData();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedGalleryImage) return;
      if (e.key === 'Escape') setSelectedGalleryImage(null);
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedGalleryImage, gallery]);

  if (!selectedGalleryImage) return null;

  const currentIndex = gallery.findIndex((img) => img.id === selectedGalleryImage.id);

  const handleNext = () => {
    if (currentIndex < gallery.length - 1) {
      setSelectedGalleryImage(gallery[currentIndex + 1]);
    } else {
      setSelectedGalleryImage(gallery[0]);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setSelectedGalleryImage(gallery[currentIndex - 1]);
    } else {
      setSelectedGalleryImage(gallery[gallery.length - 1]);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Image Lightbox"
      className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 animate-fadeIn"
      onClick={() => setSelectedGalleryImage(null)}
    >
      {/* Modal Controls Bar */}
      <div
        className="absolute top-4 right-4 z-50 flex items-center gap-3"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-xs text-slate-300 bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm hidden sm:inline-block">
          {currentIndex + 1} of {gallery.length} &bull; Press ESC to close
        </span>
        <button
          onClick={() => setSelectedGalleryImage(null)}
          className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
          aria-label="Close modal"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Prev button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handlePrev();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
        aria-label="Previous image"
      >
        <ChevronLeft className="w-7 h-7" />
      </button>

      {/* Main Image Container */}
      <div
        className="max-w-5xl max-h-[85vh] w-full flex flex-col items-center justify-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative rounded-xl overflow-hidden shadow-2xl bg-black/40 border border-white/10">
          <img
            src={selectedGalleryImage.imageUrl}
            alt={selectedGalleryImage.title}
            className="max-h-[72vh] w-auto object-contain mx-auto transition-all"
          />
        </div>

        {/* Caption Bar */}
        <div className="mt-4 text-center max-w-2xl px-4">
          <div className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold uppercase tracking-wider bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-1.5">
            {selectedGalleryImage.category}
          </div>
          <h3 className="text-lg font-bold text-white tracking-wide">
            {selectedGalleryImage.title}
          </h3>
          <p className="text-sm text-slate-300 mt-1">
            {selectedGalleryImage.caption}
          </p>
        </div>
      </div>

      {/* Next button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-50 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all hover:scale-110"
        aria-label="Next image"
      >
        <ChevronRight className="w-7 h-7" />
      </button>
    </div>
  );
};
