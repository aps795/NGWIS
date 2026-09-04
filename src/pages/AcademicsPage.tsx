import React, { useState } from 'react';
import { SectionHeading } from '../components/common/SectionHeading';
import {
  BookOpen,
  GraduationCap,
  Sparkles,
  Download,
  CheckCircle,
  FileText,
  X
} from 'lucide-react';
import { FacultySection } from '../components/academics/FacultySection';

export const AcademicsPage: React.FC = () => {
  const [showDownloadModal, setShowDownloadModal] = useState(false);

  const stages = [
    {
      level: 'Foundational & Early Years',
      grades: 'Pre-Primary Stages',
      focus: 'Play-based conceptual discovery, phonics, motor skills, sensory learning, and positive socialization.',
      keySubjects: ['English Phonics & Early Vocabulary', 'Number Sense & Counting', 'Environmental Awareness', 'Drawing, Rhythm & Rhymes', 'Social & Self-Care Habits'],
      features: ['Activity-based learning kit', 'Theme-based storytelling', 'Safe indoor play materials', 'No formal exam pressure']
    },
    {
      level: 'Primary Education Stage',
      grades: 'Classes 1 to 5',
      focus: 'Solidifying linguistic fluency, foundational arithmetic, environmental observation, and disciplined study habits.',
      keySubjects: ['English (Grammar, Reading, Composition)', 'Hindi (Vyakaran, Sahitya, Handwriting)', 'Mathematics (Mental Math & Problem Solving)', 'Environmental Studies & Basic Science', 'Computer Fundamentals & Digital Literacy', 'General Knowledge & Moral Science'],
      features: ['Periodic formative assessments', 'Classroom reading hours', 'Project-based exploration', 'Mental math drills']
    },
    {
      level: 'Upper-Primary Education Stage',
      grades: 'Classes 6 to 8',
      focus: 'Transitioning into formal sciences, social studies, analytical reasoning, debate, and independent project work.',
      keySubjects: ['Science (Physics, Chemistry, Biology basics)', 'Social Science (History, Civics, Geography)', 'Mathematics (Algebra, Geometry, Data)', 'English & Hindi Literature & Speech', 'Computer Applications & ICT', 'Sanskrit / Third Language Option'],
      features: ['Laboratory demonstrations', 'Inter-house competitions', 'Structured term examinations', 'Critical thinking assignments']
    }
  ];

  const methodology = [
    {
      title: 'Conceptual Clarity Over Rote Learning',
      desc: 'Concepts are introduced with real-world examples, models, and everyday applications rather than mechanical memorization.'
    },
    {
      title: 'Bilingual Support with English Medium Focus',
      desc: 'While instruction and textbooks are in English, teachers provide empathetic bilingual guidance to ensure thorough comprehension.'
    },
    {
      title: 'Continuous Formative Evaluation',
      desc: 'Regular classroom observations, weekly checks, and oral quizzes identify learning gaps early without inducing test anxiety.'
    },
    {
      title: 'Active Student Expression',
      desc: 'Every student is called upon to read aloud, ask questions, explain diagrams, and participate in classroom conversations.'
    }
  ];

  return (
    <div className="w-full bg-white">
      {/* Banner */}
      <div className="bg-navy-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-3">
            <GraduationCap className="w-3.5 h-3.5" />
            Scholastic Structure
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Academic Program & Curriculum
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            A balanced curriculum designed to instill strong foundations in languages, mathematics, sciences, and moral values.
          </p>
          <div className="mt-6 flex justify-center">
            <button
              onClick={() => setShowDownloadModal(true)}
              className="bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold text-xs sm:text-sm px-6 py-3 rounded-xl shadow-gold-glow flex items-center space-x-2 transition-all hover:scale-105"
            >
              <Download className="w-4 h-4 text-navy-950" />
              <span>Download Academic Information</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Academic Philosophy */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-16 sm:mb-24">
          <div className="lg:col-span-7 space-y-5">
            <SectionHeading
              subtitle="Pedagogical Philosophy"
              title="Building Conceptual Roots That Last a Lifetime"
              align="left"
            />
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              At <strong>New Global Wisdom International School</strong>, academic learning is viewed as an inspiring pursuit rather than an imposition. We believe that when students understand <em>why</em> a concept matters, learning becomes exciting and enduring.
            </p>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
              Our classrooms prioritize interactive engagement where educators guide students through guided inquiry, step-by-step mathematical problem solving, expressive language exercises, and foundational scientific experimentation.
            </p>
          </div>

          <div className="lg:col-span-5 bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-academic">
            <h3 className="font-serif text-lg font-bold text-navy-900 mb-4 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-gold-500" />
              Key Scholastic Tenets
            </h3>
            <ul className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Structured English-medium instruction with vocabulary reinforcement</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Daily Hindi language literacy, literature & neat handwriting practice</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Conceptual mathematics emphasizing speed, accuracy & logic</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>Integrated environmental and scientific awareness from early grades</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Curriculum Stages Breakdown */}
        <div className="mb-16 sm:mb-24">
          <SectionHeading
            subtitle="Curriculum Stages"
            title="Educational Pathways by Developmental Stage"
            description="Our academic progression is structured to meet the cognitive and developmental needs of growing children."
          />

          <div className="space-y-8">
            {stages.map((stg, idx) => (
              <div
                key={idx}
                className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-academic hover:shadow-academic-lg hover:border-gold-400/80 transition-all"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-100">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-gold-600 bg-gold-50 px-2.5 py-1 rounded-md border border-gold-200">
                      Stage {idx + 1} &bull; {stg.grades}
                    </span>
                    <h3 className="font-serif text-xl sm:text-2xl font-bold text-navy-900 mt-2">
                      {stg.level}
                    </h3>
                  </div>
                  <p className="text-xs sm:text-sm text-slate-600 md:max-w-md">
                    {stg.focus}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                  {/* Subjects */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3 flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4 text-academic-700" />
                      Key Subject Areas
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {stg.keySubjects.map((sub, i) => (
                        <div key={i} className="text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-academic-700 flex-shrink-0" />
                          <span>{sub}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-wider text-navy-900 mb-3 flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-gold-500" />
                      Stage Highlights
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-600">
                      {stg.features.map((feat, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Teaching Methodology Matrix */}
        <div>
          <SectionHeading
            subtitle="Instructional Approach"
            title="Our Teaching Methodology"
            description="Educators blend traditional discipline with active modern instructional methods."
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {methodology.map((m, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-slate-50 border border-slate-200 hover:border-gold-300 transition-colors">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-navy-900 text-gold-400 flex items-center justify-center font-bold text-xs">
                    0{idx + 1}
                  </div>
                  <h4 className="font-serif font-bold text-base text-navy-900">
                    {m.title}
                  </h4>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {m.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Official Faculty & Academic Staff Directory (Total Staff: 42) */}
      <FacultySection />

      {/* Download Info Modal */}
      {showDownloadModal && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setShowDownloadModal(false)}
        >
          <div
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
              <div className="flex items-center space-x-2 text-navy-900 font-bold">
                <FileText className="w-5 h-5 text-gold-500" />
                <span>Academic Information Document</span>
              </div>
              <button
                onClick={() => setShowDownloadModal(false)}
                className="text-slate-400 hover:text-slate-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
              The official academic syllabus, session timetable, and curriculum overview document for New Global Wisdom International School (Saidpur, Ghazipur) is available for prospective and enrolled parents.
            </p>

            <div className="p-3 bg-gold-50 rounded-xl border border-gold-200 text-xs text-navy-900 mb-6">
              <span className="font-bold block text-gold-800 mb-1">Administrative Note:</span>
              Official printed copies are also accessible at the school reception desk during visiting hours (8:00 AM – 2:00 PM).
            </div>

            <div className="flex items-center justify-end space-x-3">
              <button
                onClick={() => setShowDownloadModal(false)}
                className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Academic information document downloaded successfully.');
                  setShowDownloadModal(false);
                }}
                className="bg-navy-900 hover:bg-navy-800 text-gold-300 px-5 py-2 rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow"
              >
                <Download className="w-4 h-4" />
                <span>Download PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
