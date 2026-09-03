import React, { useState } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';
import { SectionHeading } from '../components/common/SectionHeading';
import {
  Trophy,
  Award
} from 'lucide-react';

export const ActivitiesPage: React.FC = () => {
  const { activities } = useSchoolData();
  const [activeTab, setActiveTab] = useState<'All' | 'Sports' | 'Art & Creativity' | 'Competitions' | 'Celebrations' | 'Educational'>('All');

  const filtered = activeTab === 'All'
    ? activities
    : activities.filter((a) => a.category === activeTab);

  const programs = [
    {
      title: 'Annual Athletic & Sports Meet',
      season: 'Winter Term',
      desc: 'Sprint races, relays, long jump, badminton, and team games teaching perseverance, fair play, and physical stamina.'
    },
    {
      title: 'Science & Environmental Exhibition',
      season: 'Autumn Term',
      desc: 'Interactive model demonstrations, environmental conservation displays, and working experiments prepared by student teams.'
    },
    {
      title: 'Independence & Republic Day Celebrations',
      season: 'August & January',
      desc: 'Patriotic song recitals, flag unfurling, drill march-past, and cultural dances honoring national heritage.'
    },
    {
      title: 'Debate, Elocution & Recitation Contests',
      season: 'Ongoing Monthly',
      desc: 'Bilingual public speaking contests in English and Hindi honing articulation, stage confidence, and research skills.'
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-3">
            <Trophy className="w-3.5 h-3.5" />
            Vibrant Student Life
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Sports & Extracurricular Activities
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            Where physical energy, creative talents, and collaborative teamwork discover meaningful expression beyond textbooks.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-12">
          {(['All', 'Sports', 'Art & Creativity', 'Competitions', 'Celebrations', 'Educational'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === tab
                  ? 'bg-navy-900 text-gold-300 shadow-md border border-navy-800'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200 border border-transparent'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Activities Visual Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-academic hover:shadow-academic-lg hover:border-gold-400 transition-all duration-300 group flex flex-col justify-between"
            >
              <div>
                <div className="relative h-56 overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-950/80 via-navy-950/20 to-transparent" />
                  <div className="absolute top-4 left-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider bg-gold-500 text-navy-950 px-2.5 py-1 rounded shadow">
                      {item.category}
                    </span>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif font-bold text-lg text-navy-900 mb-2 group-hover:text-academic-700 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>

              <div className="p-6 pt-0">
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-gold-700 font-semibold">
                  <span>Active Student Participation</span>
                  <Award className="w-4 h-4 text-gold-500" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Co-Curricular Calendar Showcase */}
        <div className="mt-20">
          <SectionHeading
            subtitle="Annual Schedule"
            title="Signature School Traditions & Events"
            description="Regular activities structured throughout the school year to build camaraderie, physical stamina, and artistic passion."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {programs.map((p, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-gold-300 transition-all">
                <span className="text-[10px] font-bold uppercase tracking-wider text-gold-700 bg-gold-100 px-2 py-0.5 rounded">
                  {p.season}
                </span>
                <h4 className="font-serif font-bold text-base text-navy-900 mt-3 mb-2">
                  {p.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
