import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SectionHeading } from '../common/SectionHeading';
import {
  ExternalLink,
  ThumbsUp,
  Calendar,
  Sparkles
} from 'lucide-react';
import { FacebookIcon } from '../common/FacebookIcon';

export const FacebookConnect: React.FC = () => {
  const { settings } = useSchoolData();

  return (
    <section className="py-16 sm:py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Social Media Connection"
          title="Connect With Us on Facebook"
          description="Follow our official school page for updates, student life photographs, campus activities, and announcements."
        />

        <div className="max-w-4xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-academic-lg overflow-hidden">
          {/* Top Banner Ribbon */}
          <div className="bg-gradient-to-r from-blue-700 via-blue-800 to-navy-900 p-6 sm:p-8 text-white flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg">
                <FacebookIcon className="w-10 h-10" />
              </div>
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-300 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" />
                  Official Page
                </div>
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-white leading-tight">
                  New Global Wisdom International School
                </h3>
                <p className="text-xs text-blue-100 mt-0.5">
                  @NewGlobalWisdom &bull; Education &bull; Saidpur, Ghazipur
                </p>
              </div>
            </div>

            <a
              href={settings.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md flex items-center space-x-2 flex-shrink-0 hover:scale-105"
            >
              <ThumbsUp className="w-4 h-4 text-navy-950" />
              <span>Follow Us on Facebook</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>

          {/* Social Update Cards Preview */}
          <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Post Preview 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-navy-900 flex items-center gap-1.5">
                  <FacebookIcon className="w-4 h-4 text-blue-600" />
                  Campus Life Updates
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Recent Activity
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Highlights from our recent student development sessions and co-curricular sports competitions at Bhujehuan, Sauna campus.
              </p>
              <div className="rounded-xl overflow-hidden h-40 relative bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=600&q=80"
                  alt="Sports update"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-blue-700 font-semibold">
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  View post on Facebook <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Post Preview 2 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span className="font-semibold text-navy-900 flex items-center gap-1.5">
                  <FacebookIcon className="w-4 h-4 text-blue-600" />
                  Academic Announcements
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  Notice Feed
                </span>
              </div>
              <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
                Information regarding admission enquiries for Foundational, Primary, and Upper-Primary stages. Join our school community.
              </p>
              <div className="rounded-xl overflow-hidden h-40 relative bg-slate-100">
                <img
                  src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80"
                  alt="Classroom announcement"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-blue-700 font-semibold">
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  View post on Facebook <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
