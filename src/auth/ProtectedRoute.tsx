import React, { useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSchoolData } from '../context/SchoolDataContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const { setCurrentView } = useSchoolData();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      setCurrentView('admin-login');
    }
  }, [isAuthenticated, isLoading, setCurrentView]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-4 text-white">
        <div className="w-10 h-10 border-4 border-gold-400 border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs font-semibold text-slate-300">Verifying administrator authorization...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
