import React, { useState } from 'react';
import { useSchoolData } from '../context/SchoolDataContext';
import { SectionHeading } from '../components/common/SectionHeading';
import {
  MapPin,
  Clock,
  Send,
  ExternalLink,
  Shield,
  CheckCircle2
} from 'lucide-react';
import { FacebookIcon } from '../components/common/FacebookIcon';

export const ContactPage: React.FC = () => {
  const { settings, addEnquiry } = useSchoolData();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Save into SchoolDataContext as contact enquiry
    setTimeout(() => {
      addEnquiry({
        studentName: `General Enquiry: ${formData.subject || 'Campus Visit'}`,
        parentName: formData.name,
        classApplying: 'General Contact',
        mobile: formData.phone,
        email: formData.email,
        message: formData.message
      });
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', phone: '', email: '', subject: '', message: '' });
    }, 500);
  };

  return (
    <div className="w-full bg-white">
      {/* Header Banner */}
      <div className="bg-navy-950 text-white py-16 sm:py-20 relative overflow-hidden border-b border-gold-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wider uppercase bg-gold-500/20 text-gold-300 border border-gold-500/30 mb-3">
            <MapPin className="w-3.5 h-3.5" />
            Reach Out to Us
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white mb-4">
            Contact & Campus Location
          </h1>
          <p className="text-sm sm:text-base text-slate-300 max-w-2xl mx-auto">
            We welcome visits, queries, and conversations from parents and community members in Ghazipur and neighboring regions.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Official Institutional Address & Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-slate-50 p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-academic space-y-6">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-gold-600 bg-gold-100 px-2.5 py-1 rounded-md">
                  Official Campus
                </span>
                <h3 className="font-serif text-2xl font-bold text-navy-900 mt-2">
                  New Global Wisdom International School
                </h3>
              </div>

              {/* Physical Address */}
              <div className="flex items-start space-x-3.5 text-xs sm:text-sm text-slate-700">
                <div className="w-10 h-10 rounded-xl bg-navy-900 text-gold-400 flex items-center justify-center flex-shrink-0 shadow">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900 text-sm sm:text-base">Full Campus Address</h4>
                  <p className="mt-1 font-semibold text-navy-950 text-sm sm:text-base">Bhujehuan, Sauna</p>
                  <p className="font-medium text-slate-800">Ghazipur, Uttar Pradesh – 233307</p>
                  <p className="text-xs text-slate-500 mt-1">(Tehsil: Saidpur, District: Ghazipur, Uttar Pradesh, India)</p>
                </div>
              </div>

              {/* Office Hours */}
              <div className="flex items-start space-x-3.5 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-academic-700 text-white flex items-center justify-center flex-shrink-0 shadow">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900">School & Office Timings</h4>
                  <p className="mt-0.5">{settings.officeHours}</p>
                  <p className="text-[11px] text-slate-500 mt-0.5">Sundays & Notified Holidays: Closed</p>
                </div>
              </div>

              {/* Social Presence */}
              <div className="flex items-start space-x-3.5 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-200/80">
                <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center flex-shrink-0 shadow">
                  <FacebookIcon className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-bold text-navy-900">Official Social Channel</h4>
                  <a
                    href={settings.facebookUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-0.5 text-blue-600 hover:text-blue-800 font-semibold flex items-center gap-1"
                  >
                    facebook.com/NewGlobalWisdom
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                  <p className="text-[11px] text-slate-500 mt-0.5">Follow for photos, functions & updates</p>
                </div>
              </div>
            </div>

            {/* Authenticity Notice */}
            <div className="p-5 rounded-2xl bg-gold-50/70 border border-gold-200 text-xs text-slate-700 space-y-1.5">
              <span className="font-bold text-navy-900 flex items-center gap-1.5">
                <Shield className="w-4 h-4 text-gold-600" />
                Institutional Notice
              </span>
              <p className="leading-relaxed">
                As per institutional standards, phone numbers and email contacts will be displayed on this portal once verified by the school administration. You may submit your message using the adjacent form.
              </p>
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-academic-lg">
            <div className="mb-6">
              <span className="text-xs font-bold uppercase tracking-wider text-gold-600 bg-gold-50 px-3 py-1 rounded-full border border-gold-200">
                Write to the Institution
              </span>
              <h3 className="font-serif text-2xl font-bold text-navy-900 mt-2">
                Send Us a Message
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1">
                Whether you have an academic inquiry, wish to schedule an administrative campus visit, or seek general information, submit your message below.
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-5 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-900 space-y-2 animate-fadeIn">
                <div className="flex items-center space-x-2 font-bold text-sm text-emerald-800">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>Message Sent Successfully!</span>
                </div>
                <p className="text-xs text-emerald-800">
                  Thank you for reaching out to New Global Wisdom International School. Your inquiry has been forwarded to our administration desk.
                </p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter your full name"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="10-digit mobile number"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Email Address
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="yourname@domain.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                    Subject / Topic *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="e.g. Admission / Campus Visit"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-navy-900 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Type your message or inquiry details here..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-gold-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-navy-900 hover:bg-navy-800 text-gold-300 hover:text-white font-bold text-sm py-3.5 px-6 rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Sending Message...' : 'Submit Contact Message'}</span>
              </button>
            </form>
          </div>
        </div>

        {/* Location Map Simulation & Landmark Directions */}
        <div className="mt-16 bg-slate-50 rounded-3xl p-8 border border-slate-200 shadow-academic">
          <SectionHeading
            subtitle="Campus Route & Map"
            title="Directions to Saidpur Campus"
            description="Conveniently situated in Bhujehuan, Sauna, connecting students and families from Saidpur, Ghazipur, and neighboring rural localities."
          />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Interactive Simulated Map Frame */}
            <div className="lg:col-span-7 rounded-2xl overflow-hidden shadow-md border border-slate-200 h-72 sm:h-80 bg-slate-200 relative">
              <iframe
                title="Saidpur Ghazipur Regional Map Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d57579.54471954867!2d83.18129064115162!3d25.54877209701198!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3991fdc5b6510309%3A0x6fb262078fe1562!2sSaidpur%2C%20Uttar%20Pradesh%20233307!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                className="w-full h-full border-0"
                loading="lazy"
              />
            </div>

            {/* Landmarks & Transportation */}
            <div className="lg:col-span-5 space-y-4 text-xs sm:text-sm text-slate-700">
              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <h4 className="font-bold text-navy-900">Landmark & Locality</h4>
                <p>Located in Bhujehuan, Sauna village area, easily accessible from the main Saidpur – Ghazipur roadway corridors.</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <h4 className="font-bold text-navy-900">Tehsil & District Center</h4>
                <p>Tehsil Saidpur, District Ghazipur, Uttar Pradesh – Pincode 233307.</p>
              </div>

              <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-1">
                <h4 className="font-bold text-navy-900">Visiting Advice</h4>
                <p>Visitors are advised to schedule appointments during morning hours (8:30 AM to 1:30 PM) for administrative assistance.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
