import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SectionHeading } from '../common/SectionHeading';
import { Quote, ChevronLeft, ChevronRight, UserCheck, Shield, PlusCircle } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, setCurrentView } = useSchoolData();
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const current = testimonials[currentIndex] || testimonials[0];

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Community Voice"
          title="Parent & Student Feedback"
          description="Dedicated section for verified reviews from parents, guardians, and enrolled families."
        />

        {/* Carousel Card */}
        <div className="max-w-3xl mx-auto relative bg-slate-50 rounded-3xl p-8 sm:p-12 border border-slate-200/90 shadow-academic">
          <Quote className="w-12 h-12 text-gold-400/40 mb-4" />

          {/* Testimonial Quote Text */}
          <div className="min-h-[120px] flex items-center">
            <p className="font-serif italic text-base sm:text-xl text-slate-700 leading-relaxed">
              {current.text}
            </p>
          </div>

          {/* Author Meta */}
          <div className="mt-8 pt-6 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h4 className="font-bold text-sm sm:text-base text-navy-900 flex items-center gap-2">
                {current.authorName}
                {current.verified ? (
                  <span className="inline-flex items-center text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                    <UserCheck className="w-3 h-3 mr-1" />
                    Verified Parent
                  </span>
                ) : (
                  <span className="inline-flex items-center text-[10px] font-semibold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                    Official Placeholder Slot
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 mt-0.5">{current.relationship}</p>
            </div>

            {/* Carousel Controls */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handlePrev}
                className="p-2 rounded-full bg-white border border-slate-200 hover:bg-navy-900 hover:text-white transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <span className="text-xs text-slate-400 px-2">
                {currentIndex + 1} / {testimonials.length}
              </span>
              <button
                onClick={handleNext}
                className="p-2 rounded-full bg-white border border-slate-200 hover:bg-navy-900 hover:text-white transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Admin Note Badge */}
          <div className="mt-6 bg-gold-50/70 border border-gold-200 rounded-xl p-3 text-xs text-slate-600 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span className="flex items-center gap-1.5 text-slate-700">
              <Shield className="w-4 h-4 text-gold-600 flex-shrink-0" />
              <span>School Administrators can add, edit, or publish verified parent reviews directly from the Admin CMS.</span>
            </span>
            <button
              onClick={() => setCurrentView('admin')}
              className="text-xs font-bold text-navy-900 hover:text-gold-700 underline flex items-center gap-1 flex-shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Manage Testimonials
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
