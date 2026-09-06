import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { SectionHeading } from '../common/SectionHeading';
import {
  ExternalLink,
  Calendar,
  Sparkles
} from 'lucide-react';
import { FacebookIcon } from '../common/FacebookIcon';
import { YouTubeIcon } from '../common/YouTubeIcon';
import { InstagramIcon } from '../common/InstagramIcon';

export const FacebookConnect: React.FC = () => {
  const { settings } = useSchoolData();

  return (
    <section className="py-16 sm:py-20 bg-slate-50 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Official Media & Video Channels"
          title="Connect on YouTube, Facebook & Instagram"
          description="Subscribe to our YouTube channel for campus event videos, follow our Facebook page for news & announcements, and explore our Instagram for vibrant campus life photos & reels."
        />

        <div className="max-w-5xl mx-auto bg-white rounded-3xl border border-slate-200 shadow-academic-lg overflow-hidden">
          {/* Top Banner Ribbon */}
          <div className="bg-gradient-to-r from-navy-950 via-navy-900 to-academic-900 p-6 sm:p-8 text-white flex flex-col lg:flex-row items-center justify-between gap-6 border-b border-gold-500/30">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 rounded-2xl bg-white text-red-600 flex items-center justify-center flex-shrink-0 shadow-lg">
                <YouTubeIcon className="w-10 h-10" />
              </div>
              <div className="text-center sm:text-left">
                <div className="inline-flex items-center gap-1 text-[11px] font-semibold text-gold-300 uppercase tracking-wider mb-1">
                  <Sparkles className="w-3 h-3" />
                  Official Video & Social Channels
                </div>
                <h3 className="font-crest text-xl sm:text-2xl font-bold text-white leading-tight">
                  New Global Wisdom International School
                </h3>
                <p className="text-xs text-slate-300 mt-0.5">
                  @newglobalwisdom &bull; @newglobalwisdominternation2959 &bull; Bhujehuan, Sauna, Ghazipur
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <a
                href={settings.youtubeUrl || 'https://www.youtube.com/@newglobalwisdominternation2959'}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-red-600 hover:bg-red-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 flex-shrink-0 hover:scale-105"
              >
                <YouTubeIcon className="w-4 h-4 text-white" />
                <span>YouTube</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 flex-shrink-0 hover:scale-105"
              >
                <FacebookIcon className="w-4 h-4 text-white" />
                <span>Facebook</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>

              <a
                href={settings.instagramUrl || 'https://www.instagram.com/newglobalwisdom?stkn=MXZmdG8xd2l6NzJlaw=='}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-gradient-to-r from-pink-600 via-rose-500 to-amber-500 hover:opacity-95 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl transition-all shadow-md flex items-center space-x-1.5 flex-shrink-0 hover:scale-105"
              >
                <InstagramIcon className="w-4 h-4 text-white" />
                <span>Instagram</span>
                <ExternalLink className="w-3.5 h-3.5 ml-0.5" />
              </a>
            </div>
          </div>

          {/* Social Update Cards Preview */}
          <div className="p-6 sm:p-8 bg-slate-50 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Post Preview 1 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-navy-900 flex items-center gap-1.5">
                    <FacebookIcon className="w-4 h-4 text-blue-600" />
                    Campus Life Updates
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Recent
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Highlights from our recent student development sessions and co-curricular sports competitions at Bhujehuan, Sauna campus.
                </p>
                <div className="rounded-xl overflow-hidden h-36 relative bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1576678927484-cc907957088c?auto=format&fit=crop&w=600&q=80"
                    alt="Sports update"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-blue-700 font-semibold">
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  View on Facebook <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Post Preview 2 - Instagram */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-pink-600 flex items-center gap-1.5">
                    <InstagramIcon className="w-4 h-4 text-pink-600" />
                    Instagram Highlights
                  </span>
                  <span className="flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-amber-500" />
                    Reels & Photos
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Follow @newglobalwisdom for daily glimpses of student activities, competitions, celebrations, and vibrant campus life.
                </p>
                <div className="rounded-xl overflow-hidden h-36 relative bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80"
                    alt="Campus moments on Instagram"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-pink-600 font-semibold">
                <a
                  href={settings.instagramUrl || 'https://www.instagram.com/newglobalwisdom?stkn=MXZmdG8xd2l6NzJlaw=='}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  Follow @newglobalwisdom <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>

            {/* Post Preview 3 */}
            <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span className="font-semibold text-navy-900 flex items-center gap-1.5">
                    <FacebookIcon className="w-4 h-4 text-blue-600" />
                    Academic Notices
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Notice Feed
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed">
                  Information regarding admission enquiries for Foundational, Primary, and Upper-Primary stages. Join our school community.
                </p>
                <div className="rounded-xl overflow-hidden h-36 relative bg-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80"
                    alt="Classroom announcement"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="pt-2 flex items-center justify-between text-xs text-blue-700 font-semibold">
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline flex items-center gap-1"
                >
                  View on Facebook <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
