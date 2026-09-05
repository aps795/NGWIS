import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  Home,
  AlertCircle,
  RefreshCw,
  CheckCircle2,
  KeyRound
} from 'lucide-react';
import schoolLogo from '../assets/logo.jpg';
import { useSchoolData } from '../context/SchoolDataContext';
import { useAuth } from '../auth/AuthContext';

export const AdminLoginPage: React.FC = () => {
  const { setCurrentView } = useSchoolData();
  const {
    isAuthenticated,
    isOtpPending,
    pendingOtp,
    login,
    verifyOtp,
    resendOtp,
    cancelOtp
  } = useAuth();

  // If already authenticated, redirect to /admin/dashboard immediately
  useEffect(() => {
    if (isAuthenticated) {
      setCurrentView('admin-dashboard');
    }
  }, [isAuthenticated, setCurrentView]);

  // --- Step 1: Login Form State ---
  const [email, setEmail] = useState('newglobalwisdominternationalsc@gmail.com');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);

  // --- Step 2: OTP Verification State ---
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [otpSuccessMessage, setOtpSuccessMessage] = useState<string | null>(null);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [resendCountdown, setResendCountdown] = useState(60);
  const [isResending, setIsResending] = useState(false);
  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // 60-second live cooldown timer for OTP resend
  useEffect(() => {
    if (!isOtpPending) return;

    // Reset countdown whenever entering OTP pending state
    setResendCountdown(pendingOtp?.resendCooldown || 60);

    const timer = setInterval(() => {
      setResendCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Auto-focus first OTP input box on transition to Screen 2
    setTimeout(() => {
      otpInputsRef.current[0]?.focus();
    }, 100);

    return () => clearInterval(timer);
  }, [isOtpPending, pendingOtp]);

  // Handle Step 1 Login Submission
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);

    const cleanEmail = email.trim();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setLoginError('Please enter both your Administrator Email and Password.');
      return;
    }

    setIsSubmittingLogin(true);

    try {
      const result = await login(cleanEmail, cleanPassword);

      if (result.success) {
        if (!result.otpRequired) {
          // Direct login fallback
          setCurrentView('admin-dashboard');
        }
        // If otpRequired is true, AuthContext automatically toggles isOtpPending to true
      } else {
        setLoginError(result.error || 'Invalid administrative credentials. Please check your Email and Password.');
      }
    } catch {
      setLoginError('An administrative system error occurred. Please try again later.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handle OTP Input Changes (auto-advance & numeric constraint)
  const handleOtpChange = (index: number, value: string) => {
    setOtpError(null);
    setOtpSuccessMessage(null);

    // Allow only numeric digit
    const cleaned = value.replace(/\D/g, '');

    if (!cleaned) {
      const updated = [...otpDigits];
      updated[index] = '';
      setOtpDigits(updated);
      return;
    }

    const digit = cleaned[cleaned.length - 1];
    const updated = [...otpDigits];
    updated[index] = digit;
    setOtpDigits(updated);

    // Auto-advance to the next input box
    if (index < 5 && digit) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle OTP Key Navigation (backspace navigation)
  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!otpDigits[index] && index > 0) {
        otpInputsRef.current[index - 1]?.focus();
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  // Handle Paste of complete 6-digit verification code
  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);

    if (pastedData) {
      const updated = ['', '', '', '', '', ''];
      for (let i = 0; i < pastedData.length; i++) {
        updated[i] = pastedData[i];
      }
      setOtpDigits(updated);

      const nextFocus = Math.min(pastedData.length, 5);
      otpInputsRef.current[nextFocus]?.focus();
    }
  };

  // Handle Step 2 OTP Verification Submission
  const handleVerifyOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOtpError(null);
    setOtpSuccessMessage(null);

    const code = otpDigits.join('');

    if (code.length !== 6) {
      setOtpError('Please enter all 6 digits of your verification code.');
      return;
    }

    setIsVerifyingOtp(true);

    try {
      const result = await verifyOtp(code);

      if (result.success) {
        setOtpSuccessMessage('Verification confirmed! Entering administration dashboard...');
        setTimeout(() => {
          setCurrentView('admin-dashboard');
        }, 800);
      } else {
        setOtpError(result.error || 'Invalid verification code. Please try again.');
        // Clear inputs on error and focus first box
        setOtpDigits(['', '', '', '', '', '']);
        otpInputsRef.current[0]?.focus();
      }
    } catch {
      setOtpError('A server error occurred during verification. Please try again.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // Handle Resend OTP Request
  const handleResendCode = async () => {
    if (resendCountdown > 0 || isResending) return;

    setIsResending(true);
    setOtpError(null);
    setOtpSuccessMessage(null);

    try {
      const res = await resendOtp();

      if (res.success) {
        setOtpDigits(['', '', '', '', '', '']);
        setResendCountdown(60);
        setOtpSuccessMessage('A new 6-digit verification code has been dispatched to your email.');
        otpInputsRef.current[0]?.focus();
      } else {
        setOtpError(res.error || 'Could not resend code. Please wait and try again.');
        if (res.retryAfter) {
          setResendCountdown(res.retryAfter);
        }
      }
    } catch {
      setOtpError('Failed to dispatch new verification code.');
    } finally {
      setIsResending(false);
    }
  };

  // Cancel OTP verification and return to Screen 1
  const handleBackToLogin = () => {
    cancelOtp();
    setOtpDigits(['', '', '', '', '', '']);
    setOtpError(null);
    setOtpSuccessMessage(null);
    setPassword('');
  };

  const isOtpComplete = otpDigits.every((d) => d.length === 1);

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

      {/* Main Authentication Card */}
      <div className="w-full max-w-md bg-slate-950/95 backdrop-blur-xl rounded-3xl border border-slate-800 shadow-2xl p-6 sm:p-8 relative z-10 text-white">
        
        {/* Top Header Badge */}
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

        {/* ========================================================= */}
        {/* SCREEN 1: ADMIN LOGIN (Email & Password)                  */}
        {/* ========================================================= */}
        {!isOtpPending ? (
          <div>
            {/* Error Notification */}
            {loginError && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLoginSubmit} className="space-y-4">
              {/* Admin User ID / Institutional Email */}
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
                    placeholder="newglobalwisdominternationalsc@gmail.com"
                    disabled={isSubmittingLogin}
                    required
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-900 border border-slate-700 rounded-xl text-white text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all placeholder:text-slate-500 disabled:opacity-50"
                    autoComplete="username"
                    autoFocus
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-300">
                    Password
                  </label>
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
                    disabled={isSubmittingLogin}
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

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmittingLogin}
                className="w-full mt-2 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmittingLogin ? (
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

            {/* Back to Public Website */}
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
        ) : (
          /* ========================================================= */
          /* SCREEN 2: EMAIL OTP VERIFICATION (Two-Step Authentication) */
          /* ========================================================= */
          <div className="animate-fadeIn">
            <div className="text-center mb-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-400/40 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <KeyRound className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-white tracking-wide">
                Verify Your Email
              </h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed">
                A 6-digit verification code has been sent to:
              </p>
              <p className="text-xs font-semibold text-amber-300 mt-0.5 font-mono break-all">
                {pendingOtp?.email || email}
              </p>
            </div>

            {/* Error Notification */}
            {otpError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/40 text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{otpError}</span>
              </div>
            )}

            {/* Success Notification */}
            {otpSuccessMessage && (
              <div className="mb-5 p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-start gap-2.5 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{otpSuccessMessage}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtpSubmit} className="space-y-5">
              {/* 6 Individual OTP Input Boxes */}
              <div>
                <label className="block text-center text-xs font-semibold text-slate-300 mb-3">
                  Enter 6-Digit Security Code
                </label>
                <div
                  className="flex items-center justify-center gap-2 sm:gap-2.5"
                  onPaste={handleOtpPaste}
                >
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => {
                        otpInputsRef.current[idx] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      disabled={isVerifyingOtp}
                      className="w-10 h-12 sm:w-12 sm:h-14 text-center text-lg sm:text-xl font-mono font-bold bg-slate-900 border border-slate-700 rounded-xl text-amber-400 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent transition-all disabled:opacity-50 shadow-inner"
                      autoComplete="one-time-code"
                    />
                  ))}
                </div>
              </div>

              {/* Security Policy Reminder */}
              <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-3 flex items-center gap-2.5 text-[11px] text-slate-400">
                <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
                <span>Two-step verification is required to access the administration panel.</span>
              </div>

              {/* Verify & Continue Button */}
              <button
                type="submit"
                disabled={!isOtpComplete || isVerifyingOtp}
                className="w-full py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 active:bg-amber-600 text-slate-950 font-bold text-sm tracking-wide flex items-center justify-center space-x-2 shadow-lg hover:shadow-amber-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {isVerifyingOtp ? (
                  <>
                    <div className="w-4 h-4 border-2 border-slate-950 border-t-transparent rounded-full animate-spin" />
                    <span>Verifying Code...</span>
                  </>
                ) : (
                  <>
                    <span>Verify &amp; Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Resend Code Section */}
              <div className="text-center pt-2">
                <p className="text-xs text-slate-400 mb-1">Didn't receive the code?</p>
                {resendCountdown > 0 ? (
                  <span className="text-xs text-slate-500 font-medium">
                    Resend Code in <strong className="text-amber-400 font-mono">{resendCountdown}s</strong>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={handleResendCode}
                    disabled={isResending}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 underline transition-colors disabled:opacity-50"
                  >
                    {isResending ? (
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <RefreshCw className="w-3.5 h-3.5" />
                    )}
                    <span>Resend Code</span>
                  </button>
                )}
              </div>

              {/* Back to Login Action */}
              <div className="pt-3 border-t border-slate-800 text-center">
                <button
                  type="button"
                  onClick={handleBackToLogin}
                  disabled={isVerifyingOtp}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                  <span>Back to Login</span>
                </button>
              </div>
            </form>
          </div>
        )}

      </div>

      {/* Institutional Security Notice */}
      <div className="text-center mt-6 relative z-10 max-w-sm">
        <p className="text-[11px] text-slate-500 leading-relaxed">
          Access is strictly reserved for authorized institutional staff. All login attempts are logged for security auditing.
        </p>
      </div>
    </div>
  );
};
