import React, { useState, useEffect } from 'react';
import { useSchoolData, type PageView } from '../../context/SchoolDataContext';
import {
  Menu,
  X,
  GraduationCap,
  MapPin,
  Shield,
  ChevronRight,
  Sparkles
} from 'lucide-react';

export const Header: React.FC = () => {
  const { currentView, setCurrentView } = useSchoolData();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems: { label: string; view: PageView }[] = [
    { label: 'Home', view: 'home' },
    { label: 'About Us', view: 'about' },
    { label: 'Academics', view: 'academics' },
    { label: 'Facilities', view: 'facilities' },
    { label: 'Activities', view: 'activities' },
    { label: 'Gallery', view: 'gallery' },
    { label: 'Admissions', view: 'admissions' },
    { label: 'Notices', view: 'notices' },
    { label: 'Contact', view: 'contact' },
  ];

  const handleNavClick = (view: PageView) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300">
      {/* Top Institutional Notification Bar */}
      <div className="bg-navy-950 text-slate-200 text-xs py-1.5 px-4 border-b border-navy-800/60 hidden sm:block">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center space-x-4">
            <span className="flex items-center text-slate-300 font-medium">
              <MapPin className="w-3.5 h-3.5 mr-1 text-gold-400" />
              Bhujehuan, Sauna, Saidpur, Ghazipur (U.P.) – 233307
            </span>
            <span className="text-navy-700">|</span>
            <span className="text-gold-300 font-medium flex items-center">
              <Sparkles className="w-3 h-3 mr-1" />
              English Medium &bull; Co-Educational
            </span>
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-slate-300">
              Office Hours: 8:00 AM – 2:00 PM
            </span>
            <span className="text-navy-700">|</span>
            <button
              onClick={() => handleNavClick('admin')}
              className="hover:text-gold-300 transition-colors flex items-center gap-1 font-medium text-slate-300"
              title="School Administration Portal"
            >
              <Shield className="w-3.5 h-3.5 text-gold-400" />
              Admin Portal
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div
        className={`w-full transition-all duration-300 ${
          isScrolled
            ? 'bg-navy-900/95 backdrop-blur-md shadow-lg py-2.5 border-b border-navy-800'
            : 'bg-navy-900 py-3.5 border-b border-navy-800'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo & School Branding */}
          <div
            onClick={() => handleNavClick('home')}
            className="flex items-center space-x-3 cursor-pointer group select-none"
          >
            {/* Crest Emblem */}
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 flex-shrink-0">
              <img
                src="/favicon.svg"
                alt="New Global Wisdom International School Crest"
                className="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
              />
            </div>

            {/* School Identity */}
            <div className="flex flex-col">
              <span className="font-crest font-bold text-base sm:text-lg md:text-xl text-white tracking-tight leading-tight group-hover:text-gold-200 transition-colors">
                New Global Wisdom
              </span>
              <span className="font-serif italic text-xs sm:text-sm text-gold-400 font-medium tracking-wide">
                International School
              </span>
              <span className="text-[10px] text-slate-300 hidden sm:block tracking-wider uppercase font-semibold">
                Saidpur, Ghazipur (U.P.)
              </span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navItems.map((item) => {
              const isActive = currentView === item.view;
              return (
                <button
                  key={item.view}
                  onClick={() => handleNavClick(item.view)}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium tracking-wide transition-all ${
                    isActive
                      ? 'bg-academic-700/80 text-white shadow-sm font-semibold'
                      : 'text-slate-200 hover:text-white hover:bg-navy-800/80'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </nav>

          {/* Right Action CTAs */}
          <div className="hidden sm:flex items-center space-x-2">
            <button
              onClick={() => handleNavClick('admissions')}
              className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 text-xs sm:text-sm font-bold px-4 py-2 rounded-lg shadow-md hover:shadow-gold-glow transition-all flex items-center space-x-1.5"
            >
              <GraduationCap className="w-4 h-4 text-navy-950" />
              <span>Admission Enquiry</span>
            </button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex lg:hidden items-center space-x-2">
            <button
              onClick={() => handleNavClick('admissions')}
              className="sm:hidden bg-gold-500 text-navy-950 text-xs font-bold px-2.5 py-1.5 rounded shadow"
            >
              Admissions
            </button>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-200 hover:text-white hover:bg-navy-800 focus:outline-none focus:ring-2 focus:ring-gold-400"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-[60px] z-50 bg-navy-950/95 backdrop-blur-md overflow-y-auto pb-12 transition-all">
          <div className="p-4 space-y-2 max-w-md mx-auto">
            {/* Quick Badge */}
            <div className="bg-navy-900 border border-navy-800 rounded-lg p-3 text-xs text-slate-300 flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-gold-400 flex-shrink-0" />
              <span>Bhujehuan, Sauna, Saidpur, Ghazipur – 233307</span>
            </div>

            {/* Menu items */}
            <div className="py-2 space-y-1">
              {navItems.map((item) => {
                const isActive = currentView === item.view;
                return (
                  <button
                    key={item.view}
                    onClick={() => handleNavClick(item.view)}
                    className={`w-full text-left px-4 py-3 rounded-lg text-sm font-medium flex items-center justify-between transition-colors ${
                      isActive
                        ? 'bg-academic-700 text-white font-semibold'
                        : 'text-slate-200 hover:bg-navy-900 hover:text-white'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>

            {/* Mobile Action Buttons */}
            <div className="pt-4 space-y-2 border-t border-navy-800">
              <button
                onClick={() => handleNavClick('admissions')}
                className="w-full bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold py-3 px-4 rounded-lg text-center flex items-center justify-center space-x-2 shadow-md"
              >
                <GraduationCap className="w-5 h-5" />
                <span>Admission Enquiry</span>
              </button>

              <button
                onClick={() => handleNavClick('admin')}
                className="w-full bg-navy-900 hover:bg-navy-800 text-slate-300 hover:text-white text-xs font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center space-x-2 border border-navy-700"
              >
                <Shield className="w-4 h-4 text-gold-400" />
                <span>School Admin CMS</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
