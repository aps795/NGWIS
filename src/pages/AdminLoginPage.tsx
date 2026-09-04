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
  CheckCircle2,
  RefreshCw,
  Building2,
  Server,
  ArrowLeft
} from 'lucide-react';
import schoolLogo from '../assets/logo.jpg';
import { useSchoolData } from '../context/SchoolDataContext';
import {
  authenticateCredentials,
  verifyTwoFactorCode,
  getPending2FA,
  cancelPending2FA,
  validateSessionToken,
  type Pending2FA
} from '../services/adminAuth';

interface AdminLoginPageProps {
  initialError?: string | null;
}

export const AdminLoginPage: React.FC<AdminLoginPageProps> = ({ initialError }) => {
  const { setCurrentView } = useSchoolData();

  // If user already has an active valid session, immediately redirect to /admin
  useEffect(() => {
    const active = validateSessionToken();
    if (active) {
      setCurrentView('admin');
    }
  }, [setCurrentView]);

  // Form State
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // 2FA State
  const [step, setStep] = useState<'CREDENTIALS' | 'TWO_FACTOR'>('CREDENTIALS');
  const [pending2FA, setPending2FA] = useState<Pending2FA | null>(null);
  const [otpCode, setOtpCode] = useState('');
  const [countdown, setCountdown] = useState(60);

  // Status & Security States
  const [error, setError] = useState<string | null>(initialError || null);
  const [isLoading, setIsLoading] = useState(false);
  const [failedAttempts, setFailedAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockCountdown, setLockCountdown] = useState(0);

  // Restore pending 2FA challenge if page refreshed during step 2
  useEffect(() => {
    const existing = getPending2FA();
    if (existing) {
      setPending2FA(existing);
      setStep('TWO_FACTOR');
    }
  }, []);

  // 2FA 60s countdown timer
  useEffect(() => {
    let timer: any;
    if (step === 'TWO_FACTOR' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [step, countdown]);

  // Lockout countdown timer
  useEffect(() => {
    let timer: any;
    if (isLocked && lockCountdown > 0) {
      timer = setInterval(() => {
        setLockCountdown((prev) => {
          if (prev <= 1) {
            setIsLocked(false);
            setError(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isLocked, lockCountdown]);

  // Step 1: Submit ID & Password
  const handleCredentialSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLocked) return;
    setError(null);

    if (!userId.trim()) {
      setError('Please enter your authorized email address or administrator ID.');
      return;
    }
    if (!password.trim()) {
      setError('Please enter your security password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await authenticateCredentials(userId, password);
      setIsLoading(false);

      if (res.success && res.pending) {
        setPending2FA(res.pending);
        setStep('TWO_FACTOR');
        setCountdown(60);
        setError(null);
      } else {
        const nextAttempts = failedAttempts + 1;
        setFailedAttempts(nextAttempts);
        if (nextAttempts >= 5) {
          setIsLocked(true);
          setLockCountdown(30);
          setError('Too many failed login attempts. Portal locked for 30 seconds for security.');
        } else {
          setError(res.error || 'Invalid credentials. Access is restricted to authorized school administrators.');
        }
      }
    } catch {
      setIsLoading(false);
      setError('A secure connection error occurred. Please try again.');
    }
  };

  // Step 2: Submit 2FA OTP Code
  const handleTwoFactorSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!otpCode.trim() || otpCode.trim().length !== 6) {
      setError('Please enter the complete 6-digit verification passcode.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await verifyTwoFactorCode(otpCode, rememberMe);
      setIsLoading(false);

      if (res.success) {
        // Redirect to /admin
        setCurrentView('admin');
      } else {
        setError(res.error || 'Verification failed. Please check the code.');
      }
    } catch {
      setIsLoading(false);
      setError('An error occurred during verification. Please try again.');
    }
  };

  // Resend OTP
  const handleResendCode = async () => {
    if (countdown > 0) return;
    setError(null);
    setIsLoading(true);
    if (pending2FA?.user?.email) {
      const res = await authenticateCredentials(pending2FA.user.email, password);
      setIsLoading(false);
      if (res.success && res.pending) {
        setPending2FA(res.pending);
        setCountdown(60);
        setOtpCode('');
      }
    } else {
      setIsLoading(false);
    }
  };

  // Cancel 2FA and return to Step 1
  const handleCancel2FA = () => {
    cancelPending2FA();
    setPending2FA(null);
    setStep('CREDENTIALS');
    setOtpCode('');
    setError(null);
  };

  return (
    <div className="min-h-screen bg-slate-900 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center relative overflow-hidden">
      {/* Background Decorative Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-academic-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top School Header Identity */}
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

      {/* Main Container Card */}
      <div className="w-full max-w-md bg-navy-950/95 backdrop-blur-xl rounded-3xl border border-navy-800 shadow-2xl p-6 sm:p-8 relative z-10 text-white">
        {/* Portal Security Badge */}
        <div className="flex items-center justify-between border-b border-navy-800/80 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-gold-500/20 border border-gold-400 flex items-center justify-center">
              <Shield className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-gold-300 block">
                Restricted Admin Access
              </span>
              <span className="text-xs font-semibold text-slate-200">
                {step === 'CREDENTIALS' ? 'Step 1 of 2: Security Verification' : 'Step 2 of 2: Two-Factor Authorization'}
              </span>
            </div>
          </div>
          <div className="px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold uppercase flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SSL Secure
          </div>
        </div>

        {/* Error Alert Box */}
        {error && (
          <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
            <span className="leading-relaxed">{error}</span>
          </div>
        )}

        {/* STEP 1: USER ID & PASSWORD FORM */}
        {step === 'CREDENTIALS' ? (
          <form onSubmit={handleCredentialSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Authorized Administrator ID / Institutional Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  placeholder="ngwimail@gmail.com"
                  disabled={isLocked || isLoading}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all placeholder:text-slate-500 disabled:opacity-50"
                  autoComplete="username"
                  autoFocus
                />
              </div>
            </div>

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
                  disabled={isLocked || isLoading}
                  className="w-full pl-10 pr-11 py-2.5 bg-navy-900 border border-navy-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all placeholder:text-slate-500 disabled:opacity-50"
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

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center space-x-2 text-slate-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded border-navy-700 bg-navy-900 text-gold-500 focus:ring-gold-400"
                />
                <span className="text-[11px]">Keep administrator session active</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLocked || isLoading}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-gold-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : isLocked ? (
                <span>Portal Locked ({lockCountdown}s)</span>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Verify Credentials & Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        ) : (
          /* STEP 2: TWO-FACTOR VERIFICATION (2FA / OTP) */
          <form onSubmit={handleTwoFactorSubmit} className="space-y-4">
            {pending2FA && (
              <div className="p-3 bg-navy-900/90 rounded-2xl border border-navy-800 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-gold-500/20 border border-gold-400/40 flex items-center justify-center">
                    {pending2FA.user.role === 'IT_ADMIN' ? (
                      <Server className="w-4 h-4 text-gold-400" />
                    ) : (
                      <Building2 className="w-4 h-4 text-gold-400" />
                    )}
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white">{pending2FA.user.name}</h3>
                    <p className="text-[10px] text-slate-400">{pending2FA.user.department}</p>
                  </div>
                </div>
                <span className="text-[10px] font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  Verified
                </span>
              </div>
            )}

            <div className="p-3.5 rounded-xl bg-blue-500/10 border border-blue-500/30 text-xs text-blue-200">
              <p className="font-semibold text-white mb-1 flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-gold-400" />
                Enter 6-Digit One-Time Security Passcode
              </p>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                A one-time verification passcode has been generated for your authorized administrator session.
              </p>
              {pending2FA?.code && (
                <div className="mt-2.5 p-2 rounded-lg bg-navy-950 border border-gold-400/30 flex items-center justify-between">
                  <span className="text-[10px] text-slate-400">Institutional Dispatch Code:</span>
                  <span className="font-mono font-bold text-gold-300 tracking-wider text-xs">
                    {pending2FA.code}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Security Code
              </label>
              <input
                type="text"
                maxLength={6}
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, ''))}
                placeholder="0 0 0 0 0 0"
                disabled={isLoading}
                className="w-full text-center tracking-[0.6em] font-mono text-lg py-3 bg-navy-900 border border-navy-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-gold-400 focus:border-transparent transition-all placeholder:text-slate-600 disabled:opacity-50"
                autoFocus
              />
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-[11px] text-slate-400">
                Code expires in:{' '}
                <strong className="text-gold-300 font-mono">
                  {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                </strong>
              </span>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={countdown > 0 || isLoading}
                className="text-[11px] text-gold-400 hover:text-gold-300 disabled:text-slate-500 disabled:cursor-not-allowed flex items-center gap-1 font-medium transition-colors"
              >
                <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
                <span>Resend Code</span>
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading || otpCode.length !== 6}
              className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-gold-500 via-gold-400 to-gold-500 hover:from-gold-400 hover:to-gold-300 text-navy-950 font-bold text-xs sm:text-sm tracking-wide shadow-lg hover:shadow-gold-500/20 flex items-center justify-center gap-2 transition-all transform active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-navy-950 border-t-transparent rounded-full animate-spin" />
                  <span>Validating Security Code...</span>
                </>
              ) : (
                <>
                  <Shield className="w-4 h-4" />
                  <span>Authorize & Enter Admin Panel</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleCancel2FA}
              className="w-full py-2 text-center text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Cancel & Switch Account</span>
            </button>
          </form>
        )}

        <div className="mt-6 pt-6 border-t border-navy-800/80 flex items-center justify-between text-xs text-slate-400">
          <span className="text-[11px]">Academic Session: 2026–27</span>
          <button
            type="button"
            onClick={() => setCurrentView('home')}
            className="text-slate-300 hover:text-white flex items-center gap-1 text-[11px] transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Public Website</span>
          </button>
        </div>
      </div>

      <div className="mt-6 text-center text-xs text-slate-400 max-w-sm px-4">
        <p className="text-[11px]">
          Confidential NGWIS Enterprise Portal. Unauthorized entry or tampering with institutional records is strictly prohibited and logged.
        </p>
      </div>
    </div>
  );
};
