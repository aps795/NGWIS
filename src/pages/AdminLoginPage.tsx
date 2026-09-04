import React, { useState, useEffect } from 'react';
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
  RefreshCw,
  X
} from 'lucide-react';
import schoolLogo from '../assets/logo.jpg';
import { useSchoolData } from '../context/SchoolDataContext';
import { useAuth } from '../auth/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { setCurrentView } = useSchoolData();
  const { isAuthenticated, login } = useAuth();

  // If already authenticated, redirect to /admin/dashboard immediately
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('admin-dashboard');
    }
  }, [isAuthenticated, setCurrentView]);

  // Form inputs
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [captchaInput, setCaptchaInput] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  // Dynamic Verification CAPTCHA (generates random arithmetic challenge)
  const [captchaChallenge, setCaptchaChallenge] = useState({ num1: 6, num2: 7, answer: 13 });

  const generateCaptcha = () => {
    const n1 = Math.floor(Math.random() * 9) + 2;
    const n2 = Math.floor(Math.random() * 9) + 1;
    setCaptchaChallenge({ num1: n1, num2: n2, answer: n1 + n2 });
    setCaptchaInput('');
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError('Please enter both your Administrator Email and Security Password.');
      return;
    }

    // Validate CAPTCHA
    if (parseInt(captchaInput.trim(), 10) !== captchaChallenge.answer) {
      setError('Verification challenge incorrect. Please calculate again.');
      generateCaptcha();
      return;
    }

    setIsLoading(true);

    try {
      const result = await login(cleanEmail, cleanPassword, captchaInput.trim());

      if (result.success) {
        setCurrentView('admin-dashboard');
      } else {
        setError(result.error || 'Authentication failed. Please verify your credentials.');
        generateCaptcha();
      }
    } catch {
      setError('A system error occurred. Please try again later.');
      generateCaptcha();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-hidden font-sans">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Institutional School Branding */}
      <div className="text-center mb-8 relative z-10">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-slate-950 border-2 border-amber-400/50 shadow-2xl p-1 mb-4">
          <img
            src={schoolLogo}
            alt="New Global Wisdom International School Emblem"
            className="w-full h-full object-cover rounded-xl"
          />
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-white tracking-wide font-serif">
          New Global Wisdom International School
        </h1>
        <p className="text-xs text-amber-300 italic mt-0.5">
          Bhujehuan, Sauna, Ghazipur &bull; Estd. 2016
        </p>
      </div>

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-slate-950/95 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 relative z-10 text-white">
        {/* Header Badge */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center">
              <Shield className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">School Administration</h2>
              <span className="text-[11px] text-slate-400 block">Restricted Authorized Access</span>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Secure Portal
          </div>
        </div>

        {/* Error Notification */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          {/* Admin User ID / Email */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Admin User ID / Institutional Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Mail className="w-4 h-4" />
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@newglobalwisdom.edu.in"
                disabled={isLoading}
                required
                className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-slate-500 disabled:opacity-50"
                autoComplete="username"
                autoFocus
              />
            </div>
          </div>

          {/* Security Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold text-slate-300">
                Password
              </label>
              <button
                type="button"
                onClick={() => setShowForgotModal(true)}
                className="text-[11px] text-amber-400 hover:text-amber-300 hover:underline transition-colors"
              >
                Forgot Password?
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={isLoading}
                required
                className="w-full pl-10 pr-11 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-slate-500 disabled:opacity-50"
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

          {/* Verification / Math CAPTCHA Challenge */}
          <div className="bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-amber-400" />
                <span>Security Verification</span>
              </label>
              <button
                type="button"
                onClick={generateCaptcha}
                className="text-[11px] text-slate-400 hover:text-amber-400 flex items-center gap-1 transition-colors"
                title="Refresh verification challenge"
              >
                <RefreshCw className="w-3 h-3" />
                <span>New Question</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <div className="px-3.5 py-2 bg-slate-950 border border-amber-400/40 rounded-lg text-sm font-mono font-bold text-amber-300 tracking-wider">
                {captchaChallenge.num1} + {captchaChallenge.num2} = ?
              </div>
              <input
                type="number"
                value={captchaInput}
                onChange={(e) => setCaptchaInput(e.target.value)}
                placeholder="Result"
                required
                disabled={isLoading}
                className="flex-1 px-3 py-2 bg-slate-950 border border-slate-700 rounded-lg text-white text-sm font-mono focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-slate-500"
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <span>Sign In to Administration</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Card Footer: Back to Public Website */}
        <div className="mt-6 pt-5 border-t border-slate-800 text-center">
          <button
            onClick={() => setCurrentView('home')}
            className="inline-flex items-center space-x-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            <Home className="w-3.5 h-3.5 text-amber-400" />
            <span>Back to Public Website</span>
          </button>
        </div>
      </div>

      {/* Security Disclaimer Notice */}
      <div className="text-center mt-6 relative z-10 max-w-sm">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Access is strictly reserved for authorized institutional staff. All login attempts are logged for security auditing.
        </p>
      </div>

      {/* Forgot Password Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl relative">
            <button
              onClick={() => setShowForgotModal(false)}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400 flex items-center justify-center mb-4 text-amber-400">
              <KeyRound className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-bold text-white mb-2">Administrative Password Recovery</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-4">
              For security reasons, administrator credentials cannot be reset publicly online. Please contact the school IT department or the administrative office to request a credential reset.
            </p>

            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1.5 mb-5">
              <div className="font-semibold text-amber-300">Official IT Department Contact:</div>
              <div>Email: <span className="text-white font-mono">it@newglobalwisdom.edu.in</span></div>
              <div>Helpline: <span className="text-white font-mono">+91 7081081119</span></div>
              <div>Office Hours: 8:00 AM – 2:00 PM (Mon – Sat)</div>
            </div>

            <button
              onClick={() => setShowForgotModal(false)}
              className="w-full py-2.5 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
