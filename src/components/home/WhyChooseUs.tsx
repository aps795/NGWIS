import React from 'react';
import { SectionHeading } from '../common/SectionHeading';
import {
  GraduationCap,
  Sparkles,
  Users2,
  Trophy,
  Lightbulb,
  HeartHandshake
} from 'lucide-react';

export const WhyChooseUs: React.FC = () => {
  const features = [
    {
      icon: GraduationCap,
      title: 'Quality Education',
      description: 'Focused learning environment supporting strong academic foundations and conceptual understanding.',
      tag: 'Academic Focus'
    },
    {
      icon: Sparkles,
      title: 'Holistic Development',
      description: 'Harmonious development spanning academic, physical, creative, and social dimensions.',
      tag: 'All-Round Growth'
    },
    {
      icon: Users2,
      title: 'Experienced Educators',
      description: 'Supportive, attentive teachers who encourage curiosity, confidence, and individualized progress.',
      tag: 'Mentorship'
    },
    {
      icon: Trophy,
      title: 'Sports & Activities',
      description: 'Regular opportunities for students to participate and excel beyond the classroom in sports and arts.',
      tag: 'Co-Curricular'
    },
    {
      icon: HeartHandshake,
      title: 'Values & Discipline',
      description: 'Building responsible, respectful, and confident young individuals grounded in moral character.',
      tag: 'Character Building'
    },
    {
      icon: Lightbulb,
      title: 'Student-Centered Learning',
      description: 'Encouraging active classroom participation, creative inquiry, and independent thinking skills.',
      tag: 'Student First'
    }
  ];

  return (
    <section className="py-16 sm:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          subtitle="Why Choose Us"
          title="Nurturing Excellence in Saidpur, Ghazipur"
          description="A structured institution committed to child safety, character building, and academic discipline without compromise."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="p-6 sm:p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-gold-400 hover:bg-white transition-all duration-300 shadow-academic hover:shadow-academic-lg group flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-5">
                    <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-academic-700 transition-all shadow-md">
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-[11px] font-semibold text-gold-700 bg-gold-100/60 px-2.5 py-1 rounded-full border border-gold-200">
                      {item.tag}
                    </span>
                  </div>

                  <h3 className="font-serif text-lg font-bold text-navy-900 mb-2.5 group-hover:text-academic-700 transition-colors">
                    {item.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-400">
                  <span>Pillar {idx + 1}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
