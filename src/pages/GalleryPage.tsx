import React, { useState } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';
import { Camera, Maximize2 } from 'lucide-react';
import type { GalleryCategory } from '../types/school';

export const GalleryPage: React.FC = () => {
  const { gallery, setSelectedGalleryImage } = useSchoolData();
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('All');

  const categories: GalleryCategory[] = [
    'All',
    'Campus',
    'Classrooms',
    'Sports',
    'Activities',
    'Events',
    'Celebrations',
    'Students',
    'Infrastructure'
  ];

  const filtered = activeCategory === 'All'
    ? gallery
    : gallery.filter((img) => img.category === activeCategory);

  return (
    <div className="w-full bg-white">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-3">
            <Camera className="w-3.5 h-3.5" />
            Visual Archive
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            School Photo Gallery
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            A visual glimpse into daily life, classroom interactions, athletic achievements, and cultural celebrations at New Global Wisdom.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Category Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeCategory === cat
                  ? 'bg-navy-900 text-gold-300 shadow-md border border-navy-800 scale-105'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedGalleryImage(item)}
              className="relative group rounded-2xl overflow-hidden shadow-academic border border-slate-200 cursor-pointer bg-slate-100 aspect-video sm:aspect-square"
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                loading="lazy"
              />

              {/* Hover Dark Overlay */}
              <div className="absolute inset-0 bg-navy-950/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-5 text-white">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded shadow">
                    {item.category}
                  </span>
                  <div className="p-2 rounded-full bg-white/20 hover:bg-white/30 text-white">
                    <Maximize2 className="w-4 h-4" />
                  </div>
                </div>

                <div>
                  <h3 className="font-serif font-bold text-base text-white mb-1 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-200 line-clamp-2">
                    {item.caption}
                  </p>
                </div>
              </div>

              {/* Mobile Always-Visible Caption Bar */}
              <div className="sm:hidden absolute bottom-0 inset-x-0 bg-navy-950/80 p-2 text-white">
                <p className="text-xs font-bold truncate">{item.title}</p>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
            <Camera className="w-10 h-10 text-slate-400 mx-auto mb-3" />
            <p className="text-sm font-semibold text-slate-600">No photos in this category yet.</p>
            <p className="text-xs text-slate-400 mt-1">Official photos will be uploaded by school administration.</p>
          </div>
        )}
      </div>
    </div>
  );
};
