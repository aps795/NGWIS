import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import { GraduationCap, ArrowRight, Clock, FileCheck } from 'lucide-react';

export const AdmissionsCTA: React.FC = () => {
  const { setCurrentView } = useSchoolData();

  return (
    <section className="py-16 sm:py-20 bg-navy-950 text-white relative overflow-hidden">
      {/* Background Crest Silhouette */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/4 opacity-10 pointer-events-none">
        <img src="/favicon.svg" alt="crest watermark" className="w-[500px] h-[500px]" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-gradient-to-r from-navy-900 via-navy-850 to-navy-900 rounded-3xl p-8 sm:p-14 border border-gold-500/30 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-2xl text-center lg:text-left">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/40">
              <span className="w-2 h-2 rounded-full bg-gold-400 animate-ping" />
              Admissions Open
            </span>

            <h2 className="font-serif text-2xl sm:text-4xl font-bold text-white leading-tight">
              Begin Your Child's Journey with <br />
              <span className="text-gold-400">New Global Wisdom International School</span>
            </h2>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              We welcome prospective parents to submit an admission enquiry online or visit our school campus at Bhujehuan, Sauna, Saidpur for direct interaction.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 text-xs text-slate-300 pt-2">
              <div className="flex items-center gap-1.5">
                <FileCheck className="w-4 h-4 text-gold-400" />
                <span>Simple 5-Step Process</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-gold-400" />
                <span>Office: Mon–Sat 8:00 AM – 2:00 PM</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row lg:flex-col gap-3.5 w-full sm:w-auto flex-shrink-0">
            <button
              onClick={() => setCurrentView('admissions')}
              className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-extrabold text-sm sm:text-base px-8 py-4 rounded-xl shadow-gold-glow hover:shadow-lg transition-all flex items-center justify-center space-x-2"
            >
              <GraduationCap className="w-5 h-5 text-navy-950" />
              <span>Submit Admission Enquiry</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCurrentView('contact')}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl border border-white/20 transition-all flex items-center justify-center space-x-2"
            >
              <span>Visit Campus & Contact Info</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
