import React from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import { PrincipalMessage } from '../components/home/PrincipalMessage';
import {
  Sparkles,
  Compass,
  Target,
  MapPin
} from 'lucide-react';
import schoolLogo from '../assets/logo.jpg';

export const AboutPage: React.FC = () => {

  const coreValues = [
    { title: 'Education', desc: 'Fostering intellectual curiosity, clarity of foundational concepts, and a love for continuous learning.' },
    { title: 'Discipline', desc: 'Developing self-regulation, respect for time, punctuality, and orderly habits essential for life.' },
    { title: 'Excellence', desc: 'Encouraging every student to pursue their best potential in scholastic and co-curricular realms.' },
    { title: 'Character', desc: 'Instilling honesty, humility, empathy, and strong moral ethics rooted in Indian traditions.' },
    { title: 'Growth', desc: 'Supporting progressive physical, mental, emotional, and social development at every stage.' },
    { title: 'Future', desc: 'Equipping young minds with critical thinking, communication fluency, and confidence for tomorrow.' },
  ];

  return (
    <div className="w-full bg-white">
      {/* Page Header Banner */}
      <div className="bg-navy-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Institutional Identity
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            About New Global Wisdom International School
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto font-normal">
            An educational institution in Saidpur, Ghazipur committed to character building, academic discipline, and comprehensive child development.
          </p>
        </div>

        {/* Decorative background crest */}
        <div className="absolute left-1/2 -translate-x-1/2 -bottom-20 opacity-10 pointer-events-none">
          <img src={schoolLogo} alt="crest watermark" className="w-80 h-80 rounded-full object-cover" />
        </div>
      </div>

      {/* Main Narrative Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <SectionHeading
              subtitle="Our Educational Foundation"
              title="A Purposeful Institution in Ghazipur"
              align="left"
            />

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              <strong>New Global Wisdom International School</strong> is established at <strong>Bhujehuan, Sauna, Ghazipur, Uttar Pradesh – 233307</strong> to meet the growing need for high-standard, value-grounded English-medium education in eastern Uttar Pradesh.
            </p>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Our pedagogical philosophy is built on the understanding that schools should be cheerful, secure sanctuaries where children are encouraged to explore their curiosity without intimidation. We prioritize strong conceptual learning in English, Hindi, Mathematics, Sciences, and Social Studies, while harmonizing academic rigor with physical sports, creative arts, and moral discipline.
            </p>

            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Rather than relying on rote memorization, our educators employ interactive techniques, classroom dialogue, and practical activities designed to nurture confident speech, analytical reasoning, and genuine love for books.
            </p>

            <div className="p-4 rounded-xl bg-slate-50 border-l-4 border-gold-500 text-xs sm:text-sm text-slate-800 font-medium">
              "We believe that education must cultivate both intellect and character. An intelligent mind without values is incomplete. At New Global Wisdom, we nurture both."
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="rounded-2xl overflow-hidden shadow-academic-lg border-4 border-white">
              <img
                src="https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=1000&q=80"
                alt="Classroom learning at New Global Wisdom International School"
                className="w-full h-80 object-cover"
              />
            </div>
            <div className="p-4 bg-navy-900 rounded-xl text-white flex items-center space-x-3 text-xs">
              <MapPin className="w-5 h-5 text-gold-400 flex-shrink-0" />
              <div>
                <span className="font-bold text-gold-300 block">Campus Location</span>
                <span>Bhujehuan, Sauna, Ghazipur, Uttar Pradesh – 233307</span>
              </div>
            </div>
          </div>
        </div>

        {/* Vision & Mission Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16 sm:mt-24">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-academic relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center mb-6">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-3">Our Vision</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              To be a beacon of quality education in Saidpur and the broader Ghazipur region, empowering every young learner to develop academic excellence, ethical grounding, creative thinking, and the confidence to contribute constructively to society.
            </p>
          </div>

          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-200 shadow-academic relative overflow-hidden">
            <div className="w-12 h-12 rounded-xl bg-academic-700 text-white flex items-center justify-center mb-6">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-2xl font-bold text-navy-900 mb-3">Our Mission</h3>
            <p className="text-sm text-slate-700 leading-relaxed">
              To provide a safe, disciplined, and supportive co-educational environment that integrates rigorous curricular instruction with active physical sports, artistic expression, digital familiarity, and enduring moral values.
            </p>
          </div>
        </div>

        {/* 6 Core Pillars Grid */}
        <div className="mt-16 sm:mt-24">
          <SectionHeading
            subtitle="Core Institutional Pillars"
            title="Values That Guide Our School Community"
            description="Six core tenets embedded into everyday student life, morning assemblies, and classroom interactions."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreValues.map((val, idx) => (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-gold-400 shadow-sm hover:shadow-academic transition-all"
              >
                <div className="flex items-center space-x-2 text-gold-600 font-bold text-xs uppercase tracking-wider mb-2">
                  <span className="w-2 h-2 rounded-full bg-gold-500" />
                  <span>Pillar 0{idx + 1}</span>
                </div>
                <h4 className="font-serif text-lg font-bold text-navy-900 mb-2">
                  {val.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {val.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Leadership Section */}
      <PrincipalMessage />
    </div>
  );
};
