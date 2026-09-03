import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { Quote, Sparkles, Settings, CheckCircle2 } from 'lucide-react';
import founderPhoto from '../../assets/rajnikant-singh.jpg';
import schoolLogo from '../../assets/logo.jpg';

export const PrincipalMessage: React.FC = () => {
  const { settings, setCurrentView } = useSchoolData();

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-slate-50 via-slate-100/70 to-slate-50 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl shadow-academic-lg border border-slate-200/80 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12">
            {/* Left Portrait Column */}
            <div className="lg:col-span-4 bg-navy-900 text-white p-8 sm:p-10 flex flex-col items-center text-center justify-center relative">
              {/* Background crest watermark */}
              <div className="absolute inset-0 opacity-10 flex items-center justify-center pointer-events-none">
                <img src={schoolLogo} alt="School Crest Watermark" className="w-64 h-64 object-contain rounded-full" />
              </div>

              {/* Portrait Container */}
              <div className="relative mb-6">
                <div className="w-44 h-44 sm:w-52 sm:h-52 rounded-2xl overflow-hidden border-4 border-gold-400 shadow-2xl bg-navy-950">
                  <img
                    src={founderPhoto}
                    alt="Hon. Mr. Rajnikant Singh - Managing Director & Founder"
                    className="w-full h-full object-cover object-top filter brightness-100"
                  />
                </div>
                <div className="absolute -bottom-3 bg-gradient-to-r from-gold-500 to-gold-600 text-navy-950 text-[10px] sm:text-xs font-extrabold px-4 py-1 rounded-full uppercase tracking-wider shadow-md">
                  Founder's Desk
                </div>
              </div>

              <h3 className="font-serif font-bold text-lg sm:text-xl text-white tracking-wide">
                {settings.principalName}
              </h3>
              <p className="text-xs text-gold-300 font-bold uppercase tracking-wider mt-1">
                {settings.principalTitle}
              </p>
              <p className="text-[11px] text-slate-300 mt-2 max-w-xs leading-relaxed">
                New Global Wisdom International School <br />
                Bhujehuan, Sauna, Ghazipur
              </p>

              {/* Admin quick customize button */}
              <div className="mt-6 pt-4 border-t border-navy-800 w-full">
                <button
                  onClick={() => setCurrentView('admin')}
                  className="text-[11px] text-slate-300 hover:text-gold-300 transition-colors inline-flex items-center gap-1.5"
                  title="Edit leadership details in Admin CMS"
                >
                  <Settings className="w-3 h-3 text-gold-400" />
                  <span>Update from Admin CMS</span>
                </button>
              </div>
            </div>

            {/* Right Message Content */}
            <div className="lg:col-span-8 p-8 sm:p-12 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-50 text-gold-700 border border-gold-200 shadow-sm">
                    <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                    Founder & Leadership Desk
                  </span>
                  <Quote className="w-10 h-10 text-gold-400/40" />
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 mb-6">
                  Message from the Founder & Managing Director
                </h2>

                <div className="space-y-4 text-slate-700 text-sm sm:text-base leading-relaxed">
                  {settings.principalMessage.map((paragraph, idx) => (
                    <p key={idx} className="leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Institutional Values Pillar */}
              <div className="mt-8 pt-6 border-t border-slate-200">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="flex items-center space-x-2 text-navy-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0" />
                    <span>Nurturing Inherent Potential</span>
                  </div>
                  <div className="flex items-center space-x-2 text-navy-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0" />
                    <span>Discipline with Compassion</span>
                  </div>
                  <div className="flex items-center space-x-2 text-navy-900 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-gold-600 flex-shrink-0" />
                    <span>Parent-Educator Synergy</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
