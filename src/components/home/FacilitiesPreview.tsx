import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SectionHeading } from '../common/SectionHeading';
import {
  LayoutGrid,
  BookOpen,
  Trophy,
  Monitor,
  Droplets,
  ShieldCheck,
  Palette,
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const FacilitiesPreview: React.FC = () => {
  const { facilities, setCurrentView } = useSchoolData();

  // Icon mapper helper
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
    <section className="py-16 sm:py-24 bg-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <SectionHeading
            subtitle="Campus Infrastructure"
            title="Purpose-Built Learning Facilities"
            description="Providing a clean, healthy, safe, and engaging setting where students can study, play, and grow."
            align="left"
          />

          <button
            onClick={() => setCurrentView('facilities')}
            className="self-start sm:self-end inline-flex items-center space-x-1 text-xs sm:text-sm font-semibold text-academic-700 hover:text-navy-900 mb-6 sm:mb-12 group transition-colors"
          >
            <span>View All Facilities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.slice(0, 8).map((facility) => {
            const Icon = getIcon(facility.iconName);
            return (
              <div
                key={facility.id}
                className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-academic hover:shadow-academic-lg hover:border-gold-300 transition-all duration-300 group flex flex-col justify-between"
              >
                <div>
                  {/* Photo with Overlay & Icon Badge */}
                  <div className="relative h-44 overflow-hidden">
                    <img
                      src={facility.imageUrl}
                      alt={facility.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />

                    <div className="absolute bottom-3 left-3 flex items-center space-x-2">
                      <div className="w-8 h-8 rounded-lg bg-gold-500 text-navy-950 flex items-center justify-center shadow">
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-[11px] font-semibold text-white uppercase tracking-wider bg-navy-900/80 backdrop-blur-sm px-2 py-0.5 rounded border border-white/10">
                        {facility.category}
                      </span>
                    </div>
                  </div>

                  {/* Body Text */}
                  <div className="p-5">
                    <h3 className="font-serif font-bold text-base text-navy-900 mb-2 group-hover:text-academic-700 transition-colors">
                      {facility.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                      {facility.description}
                    </p>
                  </div>
                </div>

                {/* Highlights pill list */}
                <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                  <div className="flex flex-wrap gap-1.5">
                    {facility.highlights.slice(0, 2).map((hl, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium">
                        &bull; {hl}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
