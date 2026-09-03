import React, { useState } from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SectionHeading } from '../common/SectionHeading';
import { Calendar, Clock, MapPin, ArrowRight, X } from 'lucide-react';
import type { SchoolEvent } from '../../types/school';

export const EventsPreview: React.FC = () => {
  const { events } = useSchoolData();
  const [selectedEvent, setSelectedEvent] = useState<SchoolEvent | null>(null);

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Calendar of Activities"
          title="Upcoming School Functions & Events"
          description="Fostering sportsmanship, cultural pride, and hands-on learning through organized institutional functions."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {events.slice(0, 4).map((evt) => (
            <div
              key={evt.id}
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-academic hover:shadow-academic-lg hover:border-gold-300 transition-all group flex flex-col justify-between"
            >
              <div>
                {/* Event Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={evt.imageUrl}
                    alt={evt.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />

                  {/* Date Badge */}
                  <div className="absolute top-3 left-3 bg-navy-950/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-lg border border-gold-400/40 text-center shadow">
                    <span className="block text-[10px] uppercase font-bold text-gold-400">
                      {new Date(evt.date).toLocaleString('default', { month: 'short' })}
                    </span>
                    <span className="block text-base font-extrabold text-white leading-none">
                      {new Date(evt.date).getDate() || '15'}
                    </span>
                  </div>

                  {/* Category */}
                  <div className="absolute bottom-3 left-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2 py-0.5 rounded shadow">
                      {evt.category}
                    </span>
                  </div>
                </div>

                {/* Event Details */}
                <div className="p-5 space-y-2">
                  <h3 className="font-serif font-bold text-base text-navy-900 group-hover:text-academic-700 transition-colors line-clamp-2">
                    {evt.title}
                  </h3>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                    {evt.description}
                  </p>

                  <div className="pt-2 text-[11px] text-slate-500 space-y-1">
                    {evt.time && (
                      <div className="flex items-center space-x-1.5">
                        <Clock className="w-3.5 h-3.5 text-gold-500" />
                        <span>{evt.time}</span>
                      </div>
                    )}
                    {evt.venue && (
                      <div className="flex items-center space-x-1.5">
                        <MapPin className="w-3.5 h-3.5 text-gold-500" />
                        <span>{evt.venue}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* View Details Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={() => setSelectedEvent(evt)}
                  className="w-full text-xs font-semibold text-academic-700 hover:text-navy-900 py-2 rounded-lg bg-slate-50 hover:bg-gold-50/60 border border-slate-200 hover:border-gold-300 transition-all flex items-center justify-center space-x-1.5"
                >
                  <span>View Details</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Event Details Modal */}
      {selectedEvent && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setSelectedEvent(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative h-48 sm:h-56">
              <img
                src={selectedEvent.imageUrl}
                alt={selectedEvent.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950 via-navy-950/30 to-transparent" />
              <button
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className="text-xs font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-0.5 rounded shadow">
                  {selectedEvent.category}
                </span>
                <h3 className="font-serif font-bold text-xl text-white mt-1.5">
                  {selectedEvent.title}
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="flex items-center space-x-2 text-slate-700">
                  <Calendar className="w-4 h-4 text-gold-500" />
                  <span>Date: {selectedEvent.date}</span>
                </div>
                {selectedEvent.time && (
                  <div className="flex items-center space-x-2 text-slate-700">
                    <Clock className="w-4 h-4 text-gold-500" />
                    <span>{selectedEvent.time}</span>
                  </div>
                )}
                {selectedEvent.venue && (
                  <div className="col-span-2 flex items-center space-x-2 text-slate-700 pt-1 border-t border-slate-200">
                    <MapPin className="w-4 h-4 text-gold-500" />
                    <span>Venue: {selectedEvent.venue}</span>
                  </div>
                )}
              </div>

              <div className="text-sm text-slate-700 leading-relaxed">
                {selectedEvent.description}
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => setSelectedEvent(null)}
                  className="bg-navy-900 hover:bg-navy-800 text-white text-xs font-semibold px-5 py-2 rounded-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
