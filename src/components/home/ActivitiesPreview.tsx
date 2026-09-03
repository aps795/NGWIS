import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SectionHeading } from '../common/SectionHeading';
import { ArrowRight, Flame } from 'lucide-react';

export const ActivitiesPreview: React.FC = () => {
  const { activities, setCurrentView } = useSchoolData();

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 sm:mb-12">
          <SectionHeading
            subtitle="Student Life & Energy"
            title="Sports, Arts & Extracurriculars"
            description="Developing teamwork, physical vitality, creativity, and self-confidence through active student engagement."
            align="left"
          />

          <button
            onClick={() => setCurrentView('activities')}
            className="self-start sm:self-end inline-flex items-center space-x-1.5 text-xs sm:text-sm font-bold text-academic-700 hover:text-navy-900 mb-6 sm:mb-12 group transition-colors"
          >
            <span>Explore Activities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Masonry / Dynamic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {activities.map((activity) => (
            <div
              key={activity.id}
              className="relative group rounded-2xl overflow-hidden shadow-academic border border-slate-200 h-72 sm:h-80 cursor-pointer"
              onClick={() => setCurrentView('activities')}
            >
              {/* Background Image */}
              <img
                src={activity.imageUrl}
                alt={activity.title}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
              />

              {/* Gradient Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/30 to-transparent" />

              {/* Category Pill */}
              <div className="absolute top-4 left-4">
                <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-1 rounded-md shadow">
                  <Flame className="w-3 h-3" />
                  {activity.category}
                </span>
              </div>

              {/* Bottom Details */}
              <div className="absolute bottom-0 inset-x-0 p-5 text-white transform transition-transform">
                <h3 className="font-serif font-bold text-lg sm:text-xl text-white mb-1.5 group-hover:text-gold-300 transition-colors">
                  {activity.title}
                </h3>
                <p className="text-xs text-slate-200 leading-snug line-clamp-2">
                  {activity.description}
                </p>
                <div className="mt-3 flex items-center text-[11px] font-semibold text-gold-400 group-hover:text-gold-300">
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5 ml-1 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
