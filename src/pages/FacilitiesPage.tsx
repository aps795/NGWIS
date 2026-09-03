import React, { useState } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';
import {
  LayoutGrid,
  BookOpen,
  Trophy,
  Monitor,
  Droplets,
  ShieldCheck,
  Palette,
  Sparkles,
  CheckCircle2,
  Building
} from 'lucide-react';

export const FacilitiesPage: React.FC = () => {
  const { facilities, setCurrentView } = useSchoolData();
  const [selectedFilter, setSelectedFilter] = useState('All');

  const categories = ['All', 'Academic Infrastructure', 'Sports & Health', 'Technology', 'Health & Hygiene', 'Safety & Discipline', 'Holistic Development'];

  const filtered = selectedFilter === 'All'
    ? facilities
    : facilities.filter((f) => f.category === selectedFilter);

  const getIcon = (name: string) => {
    switch (name) {
      case 'LayoutGrid': return LayoutGrid;
      case 'BookOpen': return BookOpen;
      case 'Trophy': return Trophy;
      case 'Monitor': return Monitor;
      case 'Droplets': return Droplets;
      case 'ShieldCheck': return ShieldCheck;
      case 'Palette': return Palette;
      default: return Sparkles;
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-3">
            <Building className="w-3.5 h-3.5" />
            Infrastructure & Amenities
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Campus Facilities
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            A clean, well-maintained, and secure environment designed to facilitate academic focus, physical fitness, and student well-being.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                selectedFilter === cat
                  ? 'bg-navy-900 text-gold-300 shadow-md border border-navy-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((facility) => {
            const Icon = getIcon(facility.iconName);
            return (
              <div
                key={facility.id}
                className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-academic hover:shadow-academic-lg hover:border-gold-400 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Visual Image */}
                  <div className="relative h-52 overflow-hidden bg-slate-100">
                    <img
                      src={facility.imageUrl}
                      alt={facility.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />

                    <div className="absolute top-4 left-4">
                      <span className="text-[10px] font-bold uppercase tracking-wider bg-navy-950/90 text-gold-300 px-2.5 py-1 rounded-lg border border-gold-500/30 shadow">
                        {facility.category}
                      </span>
                    </div>

                    <div className="absolute bottom-4 left-4 flex items-center space-x-2 text-white">
                      <div className="w-9 h-9 rounded-xl bg-gold-500 text-navy-950 flex items-center justify-center shadow">
                        <Icon className="w-5 h-5" />
                      </div>
                    </div>
                  </div>

                  {/* Description */}
                  <div className="p-6">
                    <h3 className="font-serif font-bold text-lg text-navy-900 mb-2 group-hover:text-academic-700 transition-colors">
                      {facility.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                      {facility.description}
                    </p>
                  </div>
                </div>

                {/* Highlights List */}
                <div className="p-6 pt-0">
                  <div className="pt-4 border-t border-slate-100">
                    <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
                      Key Highlights:
                    </h4>
                    <ul className="space-y-1.5 text-xs text-slate-700">
                      {facility.highlights.map((hl, i) => (
                        <li key={i} className="flex items-center space-x-2">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{hl}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Hygiene & Security Safety Banner */}
        <div className="mt-16 bg-gradient-to-r from-navy-900 to-navy-950 rounded-3xl p-8 sm:p-10 text-white border border-gold-500/30 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-gold-300">
              Campus Safety & Hygiene Standards
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              Every facility at New Global Wisdom International School is maintained under strict protocols ensuring verified RO drinking water, sanitized washroom spaces, active CCTV perimeter vigilance, and attentive staff presence.
            </p>
          </div>
          <button
            onClick={() => setCurrentView('contact')}
            className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md flex-shrink-0"
          >
            Visit Our Campus
          </button>
        </div>
      </div>
    </div>
  );
};
