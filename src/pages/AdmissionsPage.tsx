import React, { useState } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';
import { SectionHeading } from '../components/common/SectionHeading';
import {
  CheckCircle2,
  FileText,
  Clock,
  Send,
  Sparkles,
  Check,
  AlertCircle
} from 'lucide-react';

export const AdmissionsPage: React.FC = () => {
  const { addEnquiry, settings } = useSchoolData();

  const [formData, setFormData] = useState({
    studentName: '',
    parentName: '',
    classApplying: 'Class 1',
    mobile: '',
    email: '',
    address: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successRef, setSuccessRef] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const steps = [
    {
      step: '01',
      title: 'Enquiry & Consultation',
      desc: 'Submit an online enquiry or visit the school reception at Bhujehuan, Sauna to receive information regarding class openings and syllabus.'
    },
    {
      step: '02',
      title: 'Registration / Application',
      desc: 'Obtain and fill the official admission registration form along with applicant and parent contact credentials.'
    },
    {
      step: '03',
      title: 'Interaction / Assessment',
      desc: 'A friendly, age-appropriate interactive dialogue to understand the child’s learning readiness and foundational aptitude.'
    },
    {
      step: '04',
      title: 'Document Verification',
      desc: 'Verification of standard paperwork including birth certificate, passport photographs, and previous academic records where applicable.'
    },
    {
      step: '05',
      title: 'Admission Confirmation',
      desc: 'Formal confirmation of admission, allocation of roll number and class section, followed by orientation details.'
    }
  ];

  const requiredDocuments = [
    'Original Birth Certificate (for verification) and self-attested photocopy',
    'Recent passport-size photographs of the student (4 copies)',
    'Passport-size photographs of father, mother, or guardian (2 copies each)',
    'Aadhaar card copy of student and parents (for official record)',
    'Transfer Certificate (TC) from the previous recognized school (for Class 2 & above)',
    'Previous academic session progress report or marksheet (if applicable)'
  ];

  const classOptions = [
    'Playgroup / Nursery',
    'LKG (Lower Kindergarten)',
    'UKG (Upper Kindergarten)',
    'Class 1',
    'Class 2',
    'Class 3',
    'Class 4',
    'Class 5',
    'Class 6',
    'Class 7',
    'Class 8',
    'Class 9 / 10 (Subject to availability)'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Basic validation
    if (!formData.studentName.trim()) {
      setErrorMessage('Please enter the student full name.');
      return;
    }
    if (!formData.parentName.trim()) {
      setErrorMessage('Please enter the parent or guardian name.');
      return;
    }
    if (!formData.mobile.trim() || formData.mobile.length < 10) {
      setErrorMessage('Please provide a valid 10-digit mobile number.');
      return;
    }

    setIsSubmitting(true);
    try {
      const generatedId = addEnquiry(formData);
      setSuccessRef(generatedId);
      setFormData({
        studentName: '',
        parentName: '',
        classApplying: 'Class 1',
        mobile: '',
        email: '',
        address: '',
        message: ''
      });
    } catch (err) {
      setErrorMessage('An unexpected error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full bg-white">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/40 mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Official Admissions Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Admissions Open
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            {settings.admissionNote}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Step-by-Step Admission Process */}
        <div className="mb-20">
          <SectionHeading
            subtitle="Roadmap to Admission"
            title="Admission Process"
            description="Our straightforward 5-stage procedure designed to guide parents with transparency and clarity."
          />

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {steps.map((s, idx) => (
              <div
                key={idx}
                className="bg-slate-50 rounded-2xl p-6 border border-slate-200 shadow-sm relative flex flex-col justify-between hover:border-gold-400 hover:bg-white transition-all group"
              >
                <div>
                  <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 font-bold text-sm flex items-center justify-center mb-4 group-hover:bg-gold-500 group-hover:text-navy-950 transition-colors shadow">
                    {s.step}
                  </div>
                  <h4 className="font-serif font-bold text-base text-navy-900 mb-2">
                    {s.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6 pt-3 border-t border-slate-200/60 text-[11px] text-gold-700 font-semibold flex items-center justify-between">
                  <span>Stage {idx + 1}</span>
                  <CheckCircle2 className="w-3.5 h-3.5 text-gold-600" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form and Documents Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Left Column: Interactive Enquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-academic-lg">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                Online Enquiry Form
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy-900 mt-2">
                Enquire Now
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Please fill in the form below. Our admissions desk will review your enquiry and contact you promptly.
              </p>
            </div>

            {/* Success Confirmation Banner */}
            {successRef && (
              <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 animate-fadeIn">
                <div className="flex items-center space-x-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Enquiry Submitted Successfully!</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Thank you for your interest in New Global Wisdom International School. Your enquiry reference number is:
                </p>
                <div className="p-2 bg-white rounded-lg border border-emerald-300 inline-block font-mono font-bold text-sm text-navy-900">
                  {successRef}
                </div>
                <p className="text-[11px] text-emerald-700">
                  The school office will reach out to your registered mobile number during working hours.
                </p>
              </div>
            )}

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-300 text-rose-800 text-xs flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Student Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.studentName}
                    onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                    placeholder="e.g. Master Aarav Singh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Parent / Guardian Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="e.g. Shri Rajesh Singh"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Class Applying For *
                  </label>
                  <select
                    value={formData.classApplying}
                    onChange={(e) => setFormData({ ...formData, classApplying: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 bg-white"
                  >
                    {classOptions.map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Mobile Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.mobile}
                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Email Address (Optional)
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="parent@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Village / Locality / Tehsil
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="e.g. Sauna / Saidpur / Ghazipur"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Message or Questions (Optional)
                </label>
                <textarea
                  rows={3}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Any specific questions regarding curriculum, transportation, or timings..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold text-sm py-3.5 px-6 rounded-xl shadow-gold-glow flex items-center justify-center space-x-2 transition-all hover:scale-[1.01]"
              >
                <Send className="w-4 h-4 text-navy-950" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Admission Enquiry'}</span>
              </button>
            </form>
          </div>

          {/* Right Column: Required Documents Checklist & Visiting Guide */}
          <div className="lg:col-span-5 space-y-6">
            {/* Documentation Card */}
            <div className="bg-slate-50 rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-academic">
              <h3 className="font-serif text-lg font-bold text-navy-900 mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5 text-academic-700" />
                Documentation Checklist
              </h3>
              <p className="text-xs text-slate-600 mb-4">
                Please prepare the following documents at the time of formal admission confirmation:
              </p>

              <ul className="space-y-3 text-xs text-slate-700">
                {requiredDocuments.map((doc, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <Check className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <span>{doc}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Office Visiting Hours Card */}
            <div className="bg-navy-900 text-white rounded-3xl p-6 sm:p-8 border border-navy-800 shadow-academic space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-gold-500/20 border border-gold-400 text-gold-400 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-white">Campus Visiting Hours</h4>
                  <p className="text-xs text-slate-300">Monday – Saturday: 8:00 AM – 2:00 PM</p>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed border-t border-navy-800 pt-3">
                Parents are warmly invited to visit our administrative office at <strong>Bhujehuan, Sauna, Saidpur (Ghazipur)</strong> to observe our classroom infrastructure and meet our admissions coordinators in person.
              </p>

              <div className="p-3 bg-navy-950 rounded-xl border border-navy-800 text-[11px] text-gold-300">
                <span className="font-semibold block text-white mb-0.5">Direct Enquiries:</span>
                Contact lines will be activated once verified telephone credentials are registered by the school administration.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
