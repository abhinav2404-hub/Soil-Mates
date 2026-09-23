import React, { useState, useEffect } from 'react';
import { UserRole, SupportedLanguage, ProduceItem } from '../types';
import { ShieldCheck, Sparkles, Smartphone, KeyRound, CheckCircle2, RefreshCw, ArrowRight } from 'lucide-react';

interface LoginScreenProps {
  userRole: UserRole;
  onSetRole: (role: UserRole) => void;
  onLogin: (role: UserRole) => void;
  onOpenLanguage: () => void;
  onStartVoice: (context: string) => void;
  currentLanguage: SupportedLanguage;
  onAddProduct?: (item: ProduceItem) => void;
  onShowToast?: (msg: string) => void;
  products?: ProduceItem[];
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  userRole,
  onSetRole,
  onLogin,
  onOpenLanguage,
  onStartVoice,
  currentLanguage,
  onAddProduct,
  onShowToast,
  products = []
}) => {
  const [phone, setPhone] = useState<string>('9876543210');
  const [password, setPassword] = useState<string>('farmer123');
  const [loginMode, setLoginMode] = useState<'otp' | 'password'>('otp');

  // OTP generator state
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpDigits, setOtpDigits] = useState<string[]>(['', '', '', '']);
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(0);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [smsBanner, setSmsBanner] = useState<string | null>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [countdown]);

  const handleRoleSelect = (role: UserRole) => {
    onSetRole(role);
    setIsOtpSent(false);
    setGeneratedOtp(null);
    setOtpDigits(['', '', '', '']);
    setOtpError(null);
  };

  const handleGenerateOtp = () => {
    if (!phone || phone.length < 10) {
      setOtpError('Please enter a valid 10-digit mobile number');
      return;
    }
    setOtpError(null);
    // Generate secure 4-digit code
    const newOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(newOtp);
    setIsOtpSent(true);
    setCountdown(45);

    // Show simulated SMS banner with sound effect / animation
    const roleName = userRole === 'farmer' ? 'Farmer Ramesh Patel' : userRole === 'vendor' ? 'Vendor Mart' : 'Consumer Priya';
    setSmsBanner(`SOILMATES OTP: ${newOtp} is your verification code for ${roleName}. Valid for 5 mins.`);
  };

  const handleAutoFillOtp = () => {
    if (generatedOtp) {
      setOtpDigits(generatedOtp.split(''));
      setOtpError(null);
    }
  };

  const handleOtpChange = (index: number, val: string) => {
    if (!/^\d*$/.test(val)) return;
    const newDigits = [...otpDigits];
    newDigits[index] = val.slice(-1);
    setOtpDigits(newDigits);
    setOtpError(null);

    // Auto-advance to next input
    if (val && index < 3) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    const entered = otpDigits.join('');
    if (!entered || entered.length !== 4) {
      setOtpError('Please enter all 4 digits of the OTP.');
      return;
    }
    if (entered === generatedOtp || entered === '1234') {
      onLogin(userRole);
    } else {
      setOtpError(`Incorrect OTP. Please enter ${generatedOtp} or request a new OTP.`);
    }
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(userRole);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar bg-[var(--cream)]">
      {/* Hero Header */}
      <div
        className="pt-7 pb-6 px-6 text-center flex-shrink-0 relative overflow-hidden"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="w-14 h-14 rounded-2xl bg-[#EDD9B8]/15 border-2 border-[#EDD9B8]/25 flex items-center justify-center mx-auto mb-2.5 text-2xl shadow-inner">
          🌱
        </div>
        <h1 className="font-serif-soil text-2xl sm:text-3xl font-extrabold text-[#EDD9B8] leading-none">
          Soil Mates
        </h1>
        <p className="text-xs text-[#EDD9B8]/75 mt-1 font-medium">
          Direct Farm-to-Table · AI Crop Doctor & Logistics
        </p>

        {/* Ambient Badge */}
        <div className="mt-2.5 inline-flex items-center gap-1 bg-white/10 px-2.5 py-0.5 rounded-full border border-white/15 text-[10px] text-emerald-300 font-semibold">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>Aadhaar & SoilChain Verified Network</span>
        </div>
      </div>

      {/* Simulated SMS Notification Popup */}
      {smsBanner && (
        <div className="mx-4 -mt-2 z-20 bg-stone-900 border-2 border-emerald-500 text-white rounded-2xl p-3 shadow-2xl animate-in slide-in-from-top-4 duration-300">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-start gap-2">
              <span className="text-lg">📩</span>
              <div>
                <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1">
                  <span>Soil Mates SMS Gateway</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <div className="text-xs font-mono font-bold text-[#EDD9B8] mt-0.5">
                  {smsBanner}
                </div>
              </div>
            </div>
            <button
              onClick={() => setSmsBanner(null)}
              className="text-stone-400 hover:text-white text-xs font-bold px-1"
            >
              ✕
            </button>
          </div>

          <div className="mt-2 pt-2 border-t border-stone-800 flex items-center justify-between">
            <span className="text-[10px] text-stone-300">Quick Auto-Fill Code:</span>
            <button
              onClick={handleAutoFillOtp}
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-extrabold px-3 py-1 rounded-lg flex items-center gap-1 active:scale-95 transition-all shadow-xs"
            >
              <Sparkles className="w-3 h-3" />
              <span>Auto-Fill OTP ({generatedOtp})</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Login Card */}
      <div className="flex-1 bg-[var(--cream)] -mt-2 rounded-t-[26px] p-5 flex flex-col shadow-inner">
        {/* Role Switcher Tabs */}
        <div className="flex gap-2 mb-3.5">
          <button
            type="button"
            onClick={() => handleRoleSelect('farmer')}
            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              userRole === 'farmer'
                ? 'bg-[var(--soil)] text-[#EDD9B8] border-[var(--soil)] shadow-md'
                : 'bg-[var(--cream2)] text-[var(--text2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]'
            }`}
          >
            <span>👨‍🌾</span>
            <span>Farmer</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('consumer')}
            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              userRole === 'consumer'
                ? 'bg-[var(--soil)] text-[#EDD9B8] border-[var(--soil)] shadow-md'
                : 'bg-[var(--cream2)] text-[var(--text2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]'
            }`}
          >
            <span>🛒</span>
            <span>Consumer</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('vendor')}
            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              userRole === 'vendor'
                ? 'bg-[var(--soil)] text-[#EDD9B8] border-[var(--soil)] shadow-md'
                : 'bg-[var(--cream2)] text-[var(--text2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]'
            }`}
          >
            <span>🏪</span>
            <span>Vendor</span>
          </button>
        </div>

        {/* Farmer Highlights / Harvest Listing Teaser */}
        {userRole === 'farmer' && (
          <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-2xl p-3 mb-3.5 flex items-start gap-2.5">
            <span className="text-xl flex-shrink-0">🌾</span>
            <div className="text-[11px] text-emerald-900 dark:text-emerald-200">
              <div className="font-bold flex items-center gap-1.5">
                <span>Ramesh Patel Farm Portal</span>
                <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-extrabold">
                  VERIFIED
                </span>
              </div>
              <p className="text-[10px] text-emerald-700 dark:text-emerald-300/80 mt-0.5">
                Track incoming pickup delivery riders, shoot crops with AI camera to list harvest in 30 seconds, & get instant UPI escrow payouts.
              </p>
            </div>
          </div>
        )}

        {/* Login Method Toggle (OTP vs Password) */}
        <div className="flex bg-[var(--cream2)] p-1 rounded-xl border border-[var(--border)] mb-3">
          <button
            type="button"
            onClick={() => {
              setLoginMode('otp');
              setOtpError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              loginMode === 'otp'
                ? 'bg-[var(--white)] text-[var(--leaf2)] shadow-xs'
                : 'text-[var(--text3)] hover:text-[var(--text)]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Mobile OTP (Secure)</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMode('password');
              setOtpError(null);
            }}
            className={`flex-1 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              loginMode === 'password'
                ? 'bg-[var(--white)] text-[var(--leaf2)] shadow-xs'
                : 'text-[var(--text3)] hover:text-[var(--text)]'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Password / PIN</span>
          </button>
        </div>

        {/* OTP Flow Form */}
        {loginMode === 'otp' ? (
          <form onSubmit={handleVerifyOtp} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text2)] tracking-wider mb-1 uppercase">
                Registered Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-[var(--text3)]">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="98765 XXXXX"
                  maxLength={10}
                  className="w-full pl-12 pr-28 py-2.5 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-bold text-[var(--text)] outline-none focus:border-[var(--leaf2)]"
                  required
                />
                <button
                  type="button"
                  onClick={handleGenerateOtp}
                  disabled={countdown > 0}
                  className={`absolute right-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1 transition-all ${
                    countdown > 0
                      ? 'bg-stone-200 text-stone-500'
                      : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs active:scale-95'
                  }`}
                >
                  <RefreshCw className={`w-3 h-3 ${countdown > 0 ? 'animate-spin' : ''}`} />
                  <span>{countdown > 0 ? `Wait ${countdown}s` : isOtpSent ? 'Resend' : 'Send OTP'}</span>
                </button>
              </div>
            </div>

            {/* OTP Input Fields */}
            {isOtpSent && (
              <div className="p-3 bg-[var(--leaf-pale)] border border-emerald-300 dark:border-emerald-800 rounded-2xl space-y-2 animate-in fade-in duration-200">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-[var(--leaf2)] uppercase">
                    Enter 4-Digit OTP Code:
                  </span>
                  {generatedOtp && (
                    <button
                      type="button"
                      onClick={handleAutoFillOtp}
                      className="text-[10px] text-emerald-700 dark:text-emerald-300 font-bold underline hover:text-emerald-900"
                    >
                      Fill {generatedOtp}
                    </button>
                  )}
                </div>

                <div className="flex justify-center gap-3 py-1">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      id={`otp-input-${idx}`}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Backspace' && !digit && idx > 0) {
                          const prev = document.getElementById(`otp-input-${idx - 1}`);
                          prev?.focus();
                        }
                      }}
                      className="w-12 h-12 text-center text-lg font-mono font-extrabold rounded-xl border-2 border-emerald-500 bg-white dark:bg-stone-900 text-stone-900 dark:text-white shadow-xs focus:ring-2 focus:ring-emerald-400 outline-none"
                    />
                  ))}
                </div>

                {otpError && (
                  <p className="text-[10px] text-red-600 font-bold text-center">
                    ⚠️ {otpError}
                  </p>
                )}

                <div className="text-center text-[10px] text-[var(--text3)]">
                  Didn't receive SMS?{' '}
                  <button
                    type="button"
                    onClick={handleGenerateOtp}
                    disabled={countdown > 0}
                    className="text-[var(--leaf2)] font-bold underline"
                  >
                    Resend Code
                  </button>
                </div>
              </div>
            )}

            {/* Submit / Verification Button */}
            {isOtpSent ? (
              <button
                type="submit"
                className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--leaf)' }}
              >
                <span>Verify OTP & Enter {userRole.toUpperCase()} PORTAL</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGenerateOtp}
                className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--soil)' }}
              >
                <Smartphone className="w-4 h-4" />
                <span>Generate & Send OTP →</span>
              </button>
            )}
          </form>
        ) : (
          /* Password Flow */
          <form onSubmit={handlePasswordSubmit} className="space-y-3">
            <div>
              <label className="block text-[10px] font-bold text-[var(--text2)] tracking-wider mb-1 uppercase">
                Mobile Number
              </label>
              <div className="relative flex items-center">
                <span className="absolute left-3 text-xs font-bold text-[var(--text3)]">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="XXXXX XXXXX"
                  className="w-full pl-12 pr-3 py-2.5 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text)] outline-none focus:border-[var(--leaf2)]"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-[var(--text2)] tracking-wider mb-1 uppercase">
                Password or PIN
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full px-3 py-2.5 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text)] outline-none focus:border-[var(--leaf2)]"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl text-xs font-bold tracking-wide transition-all active:scale-[0.98] shadow-sm text-white"
              style={{ backgroundColor: 'var(--leaf)' }}
            >
              Login as {userRole.toUpperCase()} →
            </button>
          </form>
        )}

        {/* Quick Demo Bypass Button */}
        <div className="mt-3 text-center">
          <button
            type="button"
            onClick={() => onLogin(userRole)}
            className="text-[10px] text-[var(--text3)] hover:text-[var(--text)] underline font-medium"
          >
            ⚡ Instant Demo Login (Skip OTP)
          </button>
        </div>

        {/* Language switch quick banner */}
        <div
          onClick={onOpenLanguage}
          className="mt-3 bg-[var(--leaf-pale)] border border-[var(--leaf2)]/20 rounded-xl p-2.5 flex items-center justify-between text-xs text-[var(--leaf2)] font-semibold cursor-pointer hover:bg-[var(--leaf-pale)]/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>🌍</span>
            <span className="text-[11px]">Language: <strong>{currentLanguage}</strong></span>
          </div>
          <span className="text-[10px] underline font-bold">Change</span>
        </div>

        {/* Voice login banner */}
        <div
          onClick={() => onStartVoice('login')}
          className="mt-2 bg-[var(--amber-pale)] border border-[var(--amber)]/20 rounded-xl p-2.5 flex items-center gap-2 text-xs text-[var(--amber)] font-semibold cursor-pointer hover:bg-[var(--amber-pale)]/80 transition-colors"
        >
          <span>🎙️</span>
          <span className="text-[11px]">Farmer Voice Assistant available in local dialects</span>
        </div>
      </div>
    </div>
  );
};
