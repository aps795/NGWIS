import React from 'react';
import { useSchoolData, type PageView } from '../../context/SchoolDataContext';
import {
  MapPin,
  Clock,
  ChevronRight,
  GraduationCap,
  Shield
} from 'lucide-react';
import { FacebookIcon } from './FacebookIcon';
import { YouTubeIcon } from './YouTubeIcon';
import schoolLogo from '../../assets/logo.jpg';

export const Footer: React.FC = () => {
  const { setCurrentView, settings } = useSchoolData();
  const currentYear = new Date().getFullYear();

  const handleNav = (view: PageView) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-navy-950 text-slate-300 border-t-2 border-gold-500/40 relative">
      {/* Decorative top crest motif */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
          {/* Column 1: School Identity */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 border-2 border-gold-400/90 shadow-md bg-white p-0.5">
                <img
                  src={schoolLogo}
                  alt="New Global Wisdom International School Logo"
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
              <div>
                <h3 className="font-crest font-bold text-white text-base leading-tight">
                  New Global Wisdom
                </h3>
                <p className="font-serif italic text-gold-400 text-xs">
                  International School
                </p>
                <p className="text-[10px] text-slate-400 uppercase tracking-widest">
                  Bhujehuan, Sauna, Ghazipur &bull; Estd. 2016
                </p>
              </div>
            </div>

            <p className="text-xs text-slate-400 leading-relaxed">
              An educational institution committed to academic excellence, disciplined character building, moral values, and nurturing the multifaceted potential of every child in Ghazipur.
            </p>

            <div className="pt-2">
              <span className="text-[11px] font-semibold text-gold-300 uppercase tracking-wider block mb-2">
                Core Motto
              </span>
              <div className="text-xs text-slate-300 font-serif italic border-l-2 border-gold-500 pl-3 py-0.5">
                "Inspiring Young Minds. Building Bright Futures."
              </div>
            </div>

            {/* Social Links */}
            <div className="pt-2">
              <p className="text-xs font-semibold text-slate-200 mb-2">Official Social & Video Channels</p>
              <div className="flex items-center space-x-2.5">
                <a
                  href={settings.youtubeUrl || 'https://www.youtube.com/@newglobalwisdominternation2959'}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white flex items-center gap-1.5 transition-all border border-red-500/40 text-xs font-semibold group shadow-sm"
                  title="Official YouTube Channel (@newglobalwisdominternation2959)"
                >
                  <YouTubeIcon className="w-4 h-4 text-red-500 group-hover:text-white transition-colors" />
                  <span>YouTube Channel</span>
                </a>

                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-lg bg-navy-900 hover:bg-blue-600 text-slate-300 hover:text-white flex items-center justify-center transition-colors border border-navy-800 hover:border-blue-500 shadow-sm"
                  title="Official Facebook Page"
                >
                  <FacebookIcon className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-4 pb-1 border-b border-navy-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              Quick Links
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'About Us', view: 'about' as PageView },
                { label: 'Faculty & Staff (42)', view: 'academics' as PageView },
                { label: 'Academics & Pedagogy', view: 'academics' as PageView },
                { label: 'Campus Facilities', view: 'facilities' as PageView },
                { label: 'Sports & Student Life', view: 'activities' as PageView },
                { label: 'Photo Gallery', view: 'gallery' as PageView },
                { label: 'Admissions Process', view: 'admissions' as PageView },
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNav(link.view)}
                    className="hover:text-gold-300 text-slate-300 transition-colors flex items-center space-x-1.5 py-0.5 group"
                  >
                    <ChevronRight className="w-3 h-3 text-gold-500/70 group-hover:translate-x-0.5 transition-transform" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Institutional Links */}
          <div>
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-4 pb-1 border-b border-navy-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              Important Links
            </h4>
            <ul className="space-y-2 text-xs">
              {[
                { label: 'Official Notice Board', view: 'notices' as PageView },
                { label: 'School Events Calendar', view: 'home' as PageView },
                { label: 'Admission Enquiry Form', view: 'admissions' as PageView },
                { label: 'Contact & Location Guide', view: 'contact' as PageView },
                { label: 'School Admin Dashboard', view: 'admin' as PageView },
              ].map((link, idx) => (
                <li key={idx}>
                  <button
                    onClick={() => handleNav(link.view)}
                    className="hover:text-gold-300 text-slate-300 transition-colors flex items-center space-x-1.5 py-0.5 group"
                  >
                    <ChevronRight className="w-3 h-3 text-gold-500/70 group-hover:translate-x-0.5 transition-transform" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="mt-6 p-3 rounded-lg bg-navy-900 border border-navy-800 text-[11px] text-slate-300">
              <span className="font-semibold text-gold-300 block mb-1">Authenticity Pledge:</span>
              Official institutional portal. Factual information verified per school management records.
            </div>
          </div>

          {/* Column 4: Contact Information */}
          <div className="space-y-3">
            <h4 className="font-sans font-bold text-sm text-white uppercase tracking-wider mb-4 pb-1 border-b border-navy-800 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gold-400" />
              School Address
            </h4>

            <div className="flex items-start space-x-2.5 text-xs text-slate-300">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-white">New Global Wisdom International School</p>
                <p>Bhujehuan, Sauna</p>
                <p>Ghazipur, Uttar Pradesh – 233307</p>
                <p className="text-slate-400 text-[11px]">(Saidpur, Ghazipur)</p>
              </div>
            </div>

            <div className="flex items-start space-x-2.5 text-xs text-slate-300 pt-1">
              <Clock className="w-4 h-4 text-gold-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-white">Administrative Hours</p>
                <p className="text-slate-400">Monday – Saturday: 8:00 AM – 2:00 PM</p>
                <p className="text-[11px] text-gold-400/80">Closed on Sundays & Gazetted Holidays</p>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={() => handleNav('admissions')}
                className="w-full bg-gradient-to-r from-academic-700 to-academic-600 hover:from-academic-600 hover:to-academic-500 text-white font-semibold text-xs py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 transition-all shadow"
              >
                <GraduationCap className="w-4 h-4 text-gold-300" />
                <span>Submit Admission Query</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Copyright Strip */}
        <div className="mt-12 pt-6 border-t border-navy-900 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
          <p className="text-center sm:text-left">
            &copy; {currentYear} <strong className="text-white font-medium">New Global Wisdom International School</strong>. All Rights Reserved.
          </p>

          <div className="flex items-center space-x-4 text-[11px]">
            <span className="text-slate-400">
              Bhujehuan, Sauna, Ghazipur, Uttar Pradesh
            </span>
            <button
              onClick={() => handleNav('admin')}
              className="text-gold-400 hover:text-gold-300 font-medium flex items-center gap-1 hover:underline transition-colors"
              title="Restricted access for School IT Department and Senior Administration"
            >
              <Shield className="w-3 h-3 text-gold-400" />
              <span>Administration & IT Portal</span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
