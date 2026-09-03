import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  GraduationCap,
  Compass,
  ChevronDown,
  Sparkles,
  MapPin
} from 'lucide-react';
import campusBuildingImg from '../../assets/campus-building.jpg';

export const HeroSection: React.FC = () => {
  const { setCurrentView, settings } = useSchoolData();

  const handleScrollDown = () => {
    const nextElem = document.getElementById('welcome-section');
    if (nextElem) {
      nextElem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center bg-navy-950 overflow-hidden">
      {/* Authentic Official School Campus Building Hero Background */}
      <div className="absolute inset-0 z-0">
        <img
          src={campusBuildingImg}
          alt="New Global Wisdom International School Building - Bhujehuan, Sauna, Ghazipur"
          className="w-full h-full object-cover object-center transform scale-100 transition-transform duration-10000 filter brightness-95"
        />
        {/* Layered Gradient Overlays for Elegance, Warmth & Clear Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-navy-950/80 via-navy-950/60 to-navy-950/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-navy-950/80 via-transparent to-navy-950/80" />
      </div>

      {/* Decorative Golden Ambient Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Content Container */}
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center text-white">
        {/* Institutional Badge */}
        <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-white/15 backdrop-blur-md border border-gold-400/50 text-gold-300 text-xs sm:text-sm font-semibold tracking-wide uppercase mb-6 shadow-lg animate-fadeIn">
          <Sparkles className="w-4 h-4 text-gold-400" />
          <span className="font-bold text-white">Estd. 2016</span>
          <span className="text-white/40">&bull;</span>
          <span>Official Institutional Website</span>
          <span className="text-white/40">&bull;</span>
          <span className="flex items-center text-slate-200">
            <MapPin className="w-3.5 h-3.5 mr-1 text-gold-400" />
            Bhujehuan, Sauna, Ghazipur
          </span>
        </div>

        {/* School Name */}
        <h1 className="font-crest font-extrabold text-3xl sm:text-5xl md:text-6xl text-white tracking-tight leading-tight sm:leading-tight mb-4 drop-shadow-lg">
          NEW GLOBAL WISDOM <br className="hidden sm:inline" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-300 via-gold-400 to-gold-200 font-serif font-normal italic">
            INTERNATIONAL SCHOOL
          </span>
        </h1>

        {/* Primary Slogan */}
        <p className="font-serif italic text-lg sm:text-2xl md:text-3xl text-gold-200 font-medium tracking-wide mb-6 text-shadow-sm">
          "{settings.tagline}"
        </p>

        {/* Supporting Narrative */}
        <p className="font-sans text-sm sm:text-base md:text-lg text-slate-200 max-w-3xl mx-auto leading-relaxed mb-10 font-normal">
          "{settings.subtitle}"
        </p>

        {/* Core Values Tagline */}
        <div className="hidden sm:flex items-center justify-center space-x-3 text-xs tracking-widest text-slate-300 uppercase font-semibold mb-10 py-2 border-y border-white/10 max-w-xl mx-auto">
          <span>Education</span>
          <span className="text-gold-400">&bull;</span>
          <span>Discipline</span>
          <span className="text-gold-400">&bull;</span>
          <span>Excellence</span>
          <span className="text-gold-400">&bull;</span>
          <span>Character</span>
          <span className="text-gold-400">&bull;</span>
          <span>Growth</span>
          <span className="text-gold-400">&bull;</span>
          <span>Future</span>
        </div>

        {/* Call to Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-5">
          <button
            onClick={() => setCurrentView('about')}
            className="w-full sm:w-auto bg-white/15 hover:bg-white/25 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-xl backdrop-blur-sm border border-white/25 hover:border-white/40 transition-all flex items-center justify-center space-x-2 shadow-lg hover:-translate-y-0.5"
          >
            <Compass className="w-5 h-5 text-gold-300" />
            <span>Explore Our School</span>
          </button>

          <button
            onClick={() => setCurrentView('admissions')}
            className="w-full sm:w-auto bg-gradient-to-r from-gold-500 via-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold text-sm sm:text-base px-8 py-3.5 rounded-xl shadow-gold-glow hover:shadow-lg transition-all flex items-center justify-center space-x-2 hover:-translate-y-0.5"
          >
            <GraduationCap className="w-5 h-5 text-navy-950" />
            <span>Admission Enquiry</span>
          </button>
        </div>
      </div>

      {/* Subtle Scroll Cue */}
      <button
        onClick={handleScrollDown}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-slate-400 hover:text-gold-400 transition-colors flex flex-col items-center group cursor-pointer"
        aria-label="Scroll to content"
      >
        <span className="text-[11px] uppercase tracking-widest text-slate-400 group-hover:text-gold-300 mb-1">
          Explore
        </span>
        <ChevronDown className="w-5 h-5 animate-bounce text-gold-400" />
      </button>
    </div>
  );
};
