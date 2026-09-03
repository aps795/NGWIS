import React from 'react';
import {
  BookOpen,
  Users,
  Award,
  Trophy,
  ShieldCheck
} from 'lucide-react';

export const QuickInfoStrip: React.FC = () => {
  const pillars = [
    {
      icon: BookOpen,
      title: 'English Medium',
      subtitle: 'Structured curriculum & fluent communication'
    },
    {
      icon: Users,
      title: 'Co-Educational',
      subtitle: 'Equal opportunity & collaborative atmosphere'
    },
    {
      icon: Award,
      title: 'Academic Excellence',
      subtitle: 'Conceptual foundations & critical thinking'
    },
    {
      icon: Trophy,
      title: 'Sports & Activities',
      subtitle: 'Physical fitness, athletics & creative arts'
    },
    {
      icon: ShieldCheck,
      title: 'Safe & Supportive Environment',
      subtitle: 'CCTV surveillance & attentive faculty care'
    }
  ];

  return (
    <div className="w-full bg-navy-900 border-y border-gold-500/30 text-white relative shadow-lg">
      {/* Subtle top gold highlight line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-gold-400 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-4">
          {pillars.map((pillar, idx) => {
            const Icon = pillar.icon;
            return (
              <div
                key={idx}
                className="flex items-center space-x-3.5 p-3 rounded-lg bg-navy-800/60 border border-navy-700/80 hover:border-gold-400/50 hover:bg-navy-800 transition-all group"
              >
                <div className="w-11 h-11 rounded-lg bg-navy-950 border border-gold-500/40 flex items-center justify-center flex-shrink-0 group-hover:scale-105 group-hover:border-gold-400 transition-all shadow-inner">
                  <Icon className="w-5 h-5 text-gold-400 group-hover:text-gold-300" />
                </div>
                <div>
                  <h3 className="font-sans font-bold text-sm text-white group-hover:text-gold-200 transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs text-slate-300 font-normal leading-tight mt-0.5">
                    {pillar.subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
