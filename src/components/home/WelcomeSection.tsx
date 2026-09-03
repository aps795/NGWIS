import React from 'react';
import { useSchoolData } from '../../context/SchoolDataContext';
import {
  Sparkles,
  ArrowRight,
  BookOpen
} from 'lucide-react';
import schoolChildrenImg from '../../assets/school-children.jpg';

export const WelcomeSection: React.FC = () => {
  const { setCurrentView } = useSchoolData();

  const valuesList = [
    { label: 'Academic Development', desc: 'Solid foundational literacy, numeracy & scientific curiosity' },
    { label: 'Character & Discipline', desc: 'Instilling respect, moral values, timekeeping & social responsibility' },
    { label: 'Confidence & Creativity', desc: 'Stage exposure, public speaking, art workshops & active participation' },
    { label: 'Holistic Growth', desc: 'Harmonious synthesis of physical fitness, mental sharpness & empathy' },
  ];

  return (
    <section id="welcome-section" className="py-16 sm:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Authentic Classroom/Campus Visual */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden shadow-academic-lg border-4 border-white">
              <img
                src={schoolChildrenImg}
                alt="Students of New Global Wisdom International School in cultural festivities"
                className="w-full h-[380px] sm:h-[460px] object-cover object-center hover:scale-105 transition-transform duration-700 filter brightness-100"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-transparent to-transparent" />

              {/* Bottom Card Badge */}
              <div className="absolute bottom-4 left-4 right-4 bg-navy-900/90 backdrop-blur-md rounded-xl p-4 text-white border border-gold-400/30">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-gold-500/20 border border-gold-400 flex items-center justify-center flex-shrink-0">
                    <BookOpen className="w-5 h-5 text-gold-400" />
                  </div>
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-white">Nurturing Every Child</h4>
                    <p className="text-[11px] text-slate-300">Active student life & cultural joy in Bhujehuan, Sauna, Ghazipur</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Decorative Gold Frame Offset */}
            <div className="absolute -bottom-3 -right-3 w-full h-full rounded-2xl border-2 border-gold-400/40 -z-10 hidden sm:block" />
          </div>

          {/* Right Column: Educational Philosophy Narrative */}
          <div className="lg:col-span-7 space-y-6">
            <div>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-50 text-gold-700 border border-gold-200 mb-3 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-gold-500" />
                Educational Philosophy
              </span>

              <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold text-navy-900 leading-tight">
                Welcome to <br />
                <span className="text-academic-700">New Global Wisdom International School</span>
              </h2>

              <div className="flex items-center gap-2 mt-3 mb-5">
                <div className="h-[2px] w-12 bg-gold-500 rounded-full" />
                <div className="w-2 h-2 rotate-45 bg-gold-600 rounded-[1px]" />
                <div className="h-[2px] w-12 bg-gold-500 rounded-full" />
              </div>
            </div>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Located in <strong>Bhujehuan, Sauna, Saidpur (Ghazipur)</strong>, New Global Wisdom International School is dedicated to providing children with an education that goes beyond textbooks. We believe that true learning occurs when intellectual curiosity is paired with strong human values, discipline, and creative expression.
            </p>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Our campus provides a warm, safe, and disciplined environment where young learners develop effective communication skills, physical vitality, and emotional resilience. We emphasize holistic child development, nurturing responsible and confident individuals prepared for tomorrow.
            </p>

            {/* Core Focus Matrix */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {valuesList.map((item, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:border-gold-300 hover:bg-gold-50/20 transition-all"
                >
                  <h4 className="font-bold text-xs sm:text-sm text-navy-900 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                    {item.label}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-snug">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="pt-4">
              <button
                onClick={() => setCurrentView('about')}
                className="inline-flex items-center space-x-2 bg-navy-900 hover:bg-navy-800 text-gold-300 hover:text-white font-semibold text-xs sm:text-sm px-6 py-3 rounded-xl transition-all shadow-md group"
              >
                <span>Learn More About Us</span>
                <ArrowRight className="w-4 h-4 text-gold-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
