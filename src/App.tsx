import React from 'react';
import { SchoolDataProvider, useSchoolData } from './context/SchoolDataContext';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LightboxModal } from './components/common/LightboxModal';
import { NoticeModal } from './components/common/NoticeModal';

// Pages
import { HomePage } from './pages/HomePage';
import { AboutPage } from './pages/AboutPage';
import { AcademicsPage } from './pages/AcademicsPage';
import { FacilitiesPage } from './pages/FacilitiesPage';
import { ActivitiesPage } from './pages/ActivitiesPage';
import { GalleryPage } from './pages/GalleryPage';
import { AdmissionsPage } from './pages/AdmissionsPage';
import { NoticesPage } from './pages/NoticesPage';
import { ContactPage } from './pages/ContactPage';
import { AdminDashboard } from './pages/AdminDashboard';
import { AdminLoginPage } from './pages/AdminLoginPage';
import { FacultyPage } from './pages/FacultyPage';

import { GraduationCap } from 'lucide-react';
import { FacebookIcon } from './components/common/FacebookIcon';

const SchoolAppContent: React.FC = () => {
  const { currentView, setCurrentView, settings } = useSchoolData();

  const renderCurrentPage = () => {
    switch (currentView) {
      case 'home':
        return <HomePage />;
      case 'about':
        return <AboutPage />;
      case 'academics':
        return <AcademicsPage />;
      case 'faculty':
        return <FacultyPage />;
      case 'facilities':
        return <FacilitiesPage />;
      case 'activities':
        return <ActivitiesPage />;
      case 'gallery':
        return <GalleryPage />;
      case 'admissions':
        return <AdmissionsPage />;
      case 'notices':
        return <NoticesPage />;
      case 'contact':
        return <ContactPage />;
      case 'admin':
        return <AdminDashboard />;
      case 'admin-login':
        return <AdminLoginPage />;
      default:
        return <HomePage />;
    }
  };

  if (currentView === 'admin-login') {
    return (
      <div className="min-h-screen bg-slate-900 font-sans antialiased">
        <AdminLoginPage />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 font-sans antialiased">
      {/* Sticky Header */}
      <Header />

      {/* Main Page Body */}
      <main className="flex-1 w-full animate-fadeIn">
        {renderCurrentPage()}
      </main>

      {/* Institutional Footer */}
      <Footer />

      {/* Global Modals */}
      <LightboxModal />
      <NoticeModal />

      {/* Floating Bottom Action CTA (Mobile/Desktop) */}
      {currentView !== 'admissions' && currentView !== 'admin' && (
        <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-2.5">
          {/* Official Facebook Quick Trigger */}
          <a
            href={settings.facebookUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg hover:scale-110 transition-all border border-white/20"
            title="Visit Official Facebook Page"
          >
            <FacebookIcon className="w-5 h-5" />
          </a>

          {/* Floating Admission Enquiry CTA */}
          <button
            onClick={() => {
              setCurrentView('admissions');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="bg-gradient-to-r from-gold-500 to-gold-600 hover:from-gold-400 hover:to-gold-500 text-navy-950 font-bold text-xs sm:text-sm py-3 px-5 rounded-full shadow-gold-glow hover:shadow-2xl flex items-center space-x-2 transition-all hover:scale-105 border border-gold-300"
          >
            <GraduationCap className="w-4 h-4 text-navy-950" />
            <span>Admissions Open &bull; Enquire</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  return (
    <SchoolDataProvider>
      <SchoolAppContent />
    </SchoolDataProvider>
  );
}
