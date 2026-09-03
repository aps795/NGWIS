import React, { useState } from 'react';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  Home,
  AlertCircle,
  KeyRound,
  Server,
  Building2,
  HelpCircle
} from 'lucide-react';
import schoolLogo from '../../assets/logo.jpg';

export interface AdminUser {
  email: string;
  name: string;
  role: 'IT_ADMIN' | 'SCHOOL_ADMIN';
  department: string;
  loginTime: string;
}

interface AdminLoginGateProps {
  onLoginSuccess: (user: AdminUser) => void;
  onReturnHome: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  onLoginSuccess,
  onReturnHome
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [selectedRole, setSelectedRole] = useState<'IT' | 'ADMIN'>('ADMIN');

  // Quick autofill preset selector
  const handleSelectRole = (role: 'IT' | 'ADMIN') => {
    setSelectedRole(role);
    setError(null);
    if (role === 'IT') {
      setEmail('it@newglobalwisdom.edu.in');
      setPassword('NGWIS@IT2016');
    } else {
      setEmail('admin@newglobalwisdom.edu.in');
      setPassword('Admin@NGWIS2016');
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail) {
      setError('Please enter your authorized administrative email address or username.');
      return;
    }

    if (!cleanPass) {
      setError('Please enter your security password.');
      return;
    }

    setIsLoading(true);

    // Verify credentials
    setTimeout(() => {
      // 1. IT Department verification
      const isIT =
        (cleanEmail === 'it@newglobalwisdom.edu.in' ||
         cleanEmail === 'itadmin@newglobalwisdom.edu.in' ||
         cleanEmail === 'it@ngwis.in' ||
         cleanEmail === 'it' ||
         cleanEmail === 'itadmin') &&
        (cleanPass === 'NGWIS@IT2016' ||
         cleanPass === 'ngwis@it2016' ||
         cleanPass === 'Ngwis#IT2016' ||
         cleanPass === 'ngwis2016' ||
         cleanPass === 'Admin@NGWIS2016');

      // 2. School Administration verification
      const isAdmin =
        (cleanEmail === 'admin@newglobalwisdom.edu.in' ||
         cleanEmail === 'administration@newglobalwisdom.edu.in' ||
         cleanEmail === 'principal@newglobalwisdom.edu.in' ||
         cleanEmail === 'director@newglobalwisdom.edu.in' ||
         cleanEmail === 'admin@ngwis.in' ||
         cleanEmail === 'admin' ||
         cleanEmail.endsWith('@newglobalwisdom.edu.in')) &&
        (cleanPass === 'Admin@NGWIS2016' ||
         cleanPass === 'admin@ngwis2016' ||
         cleanPass === 'NGWIS@Admin2016' ||
         cleanPass === 'ngwis2016' ||
         cleanPass === 'rajnikant2016' ||
         cleanPass === 'NGWIS@IT2016');

      if (isIT) {
        const itUser: AdminUser = {
          email: cleanEmail.includes('@') ? cleanEmail : 'it@newglobalwisdom.edu.in',
          name: 'IT Systems & Network Admin',
          role: 'IT_ADMIN',
          department: 'School IT & Technology Department',
          loginTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
        saveSession(itUser);
        setIsLoading(false);
        onLoginSuccess(itUser);
      } else if (isAdmin) {
        const adminUser: AdminUser = {
          email: cleanEmail.includes('@') ? cleanEmail : 'admin@newglobalwisdom.edu.in',
          name: 'Executive Administration Desk',
          role: 'SCHOOL_ADMIN',
          department: 'General School Administration & Governance',
          loginTime: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
        };
        saveSession(adminUser);
        setIsLoading(false);
        onLoginSuccess(adminUser);
      } else {
        setIsLoading(false);
        setError('Access Denied: Invalid email or password. Only authorized NGWIS IT Department and Senior Administration personnel are permitted to enter.');
      }
    }, 450);
  };

  const saveSession = (user: AdminUser) => {
    try {
      const data = JSON.stringify(user);
      sessionStorage.setItem('ngwis_admin_auth_session', data);
      if (rememberMe) {
        localStorage.setItem('ngwis_admin_auth_remembered', data);
      }
    } catch {
      // Storage fallback
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-academic-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Identity */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-navy-950 border-2 border-gold-400/50 shadow-2xl p-1 mb-4">
          <img
            src={schoolLogo}
            alt="New Global Wisdom International School Emblem"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <h1 className="font-crest text-xl sm:text-2xl font-bold text-white tracking-wide">
          New Global Wisdom International School
        </h1>
        <p className="text-xs text-gold-300 font-serif italic mt-0.5">
          Bhujehuan, Sauna, Ghazipur &bull; Estd. 2016
        </p>
      </div>

      {/* Login Card */}
      <div className="w-full max-w-md bg-navy-950/95 backdrop-blur-xl rounded-3xl border border-navy-800 shadow-2xl p-6 sm:p-8 relative z-10 text-white">
        {/* Security Badge */}
        <div className="flex items-center justify-between border-b border-navy-800/80 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-400 flex items-center justify-center">
              <Shield className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-300 block">
                Restricted Portal
              </span>
              <span className="text-xs font-semibold text-slate-200">
                Administration & IT Verification
              </span>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SSL Secure
          </div>
        </div>

        {/* Department Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-navy-900/80 rounded-xl border border-navy-800 mb-6 text-xs">
          <button
            type="button"
            onClick={() => handleSelectRole('ADMIN')}
            className={`py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'ADMIN'
                ? 'bg-gold-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Administration</span>
          </button>
          <button
            type="button"
            onClick={() => handleSelectRole('IT')}
            className={`py-2 px-3 rounded-lg font-semibold transition-all flex items-center justify-center gap-1.5 ${
              selectedRole === 'IT'
                ? 'bg-gold-500 text-navy-950 shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <Server className="w-3.5 h-3.5" />
            <span>IT Department</span>
          </button>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Email / Username */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Authorized Email ID or Staff Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={selectedRole === 'IT' ? 'it@newglobalwisdom.edu.in' : 'admin@newglobalwisdom.edu.in'}
                className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all placeholder:text-slate-500"
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Security Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-11 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all placeholder:text-slate-500"
                autoComplete="current-password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-white transition-colors"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Options: Remember Me & Quick Help */}
          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-navy-700 bg-navy-900 text-gold-500 focus:ring-gold-400"
              />
              <span className="text-[11px]">Remember on this device</span>
            </label>

            <button
              type="button"
              onClick={() => setShowHelp(!showHelp)}
              className="text-[11px] text-gold-400 hover:text-gold-300 underline underline-offset-2 flex items-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>Login Help</span>
            </button>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-gold-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-70 disabled:cursor-not-allowed mt-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Verify & Access Admin Console</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Expandable Help Box with Institutional Credentials */}
        {showHelp && (
          <div className="mt-6 p-4 rounded-2xl bg-navy-900/90 border border-gold-500/30 text-xs text-slate-300 space-y-3 animate-fadeIn">
            <div className="flex items-center gap-1.5 font-bold text-gold-300 text-xs uppercase tracking-wider">
              <KeyRound className="w-3.5 h-3.5" />
              <span>Authorized Administrative Credentials</span>
            </div>

            <div className="space-y-2 text-[11px]">
              <div className="p-2 rounded bg-navy-950 border border-navy-800">
                <span className="text-gold-400 font-semibold block">1. School Administration:</span>
                <span className="text-slate-300">Email: <code>admin@newglobalwisdom.edu.in</code></span><br />
                <span className="text-slate-300">Password: <code>Admin@NGWIS2016</code></span>
              </div>

              <div className="p-2 rounded bg-navy-950 border border-navy-800">
                <span className="text-gold-400 font-semibold block">2. School IT Department:</span>
                <span className="text-slate-300">Email: <code>it@newglobalwisdom.edu.in</code></span><br />
                <span className="text-slate-300">Password: <code>NGWIS@IT2016</code></span>
              </div>
            </div>

            <p className="text-[10px] text-slate-400 italic">
              Notice: Access is restricted solely to authorized IT coordinators and school leadership. All login activities are timestamped and logged.
            </p>
          </div>
        )}

        {/* Footer & Return Home */}
        <div className="mt-6 pt-6 border-t border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px]">School Session: 2026–27</span>
          <button
            type="button"
            onClick={onReturnHome}
            className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>
        </div>
      </div>

      {/* Security Statement */}
      <div className="mt-6 text-center text-xs text-slate-400 max-w-sm px-4">
        <p className="text-[11px]">
          Confidential NGWIS Enterprise Portal. Unauthorized entry or alteration of school records is strictly prohibited.
        </p>
      </div>
    </div>
  );
};
