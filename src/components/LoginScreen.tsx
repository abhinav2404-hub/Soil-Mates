import React, { useState } from 'react';
import { UserRole, ScreenId, SupportedLanguage } from '../types';

interface LoginScreenProps {
  userRole: UserRole;
  onSetRole: (role: UserRole) => void;
  onLogin: (role: UserRole) => void;
  onOpenLanguage: () => void;
  onStartVoice: (context: string) => void;
  currentLanguage: SupportedLanguage;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  userRole,
  onSetRole,
  onLogin,
  onOpenLanguage,
  onStartVoice,
  currentLanguage
}) => {
  const [phone, setPhone] = useState<string>('9876543210');
  const [password, setPassword] = useState<string>('farmer123');

  const handleRoleSelect = (role: UserRole) => {
    onSetRole(role);
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(userRole);
  };

  return (
    <div className="h-full flex flex-col overflow-y-auto no-scrollbar bg-[var(--cream)]">
      {/* Hero Header */}
      <div
        className="pt-8 pb-7 px-6 text-center flex-shrink-0"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="w-16 h-16 rounded-2xl bg-[#EDD9B8]/15 border-2 border-[#EDD9B8]/25 flex items-center justify-center mx-auto mb-3 text-3xl shadow-inner">
          🌱
        </div>
        <h1 className="font-serif-soil text-2xl sm:text-3xl font-extrabold text-[#EDD9B8] leading-none">
          Soil Mates
        </h1>
        <p className="text-xs text-[#EDD9B8]/70 mt-1.5 font-medium">
          Direct farm to table · AI powered
        </p>
      </div>

      {/* Login Card Form */}
      <div className="flex-1 bg-[var(--cream)] -mt-3 rounded-t-[26px] p-5 flex flex-col shadow-inner">
        {/* Role Switcher Tabs */}
        <div className="flex gap-2 mb-4">
          <button
            type="button"
            onClick={() => handleRoleSelect('farmer')}
            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              userRole === 'farmer'
                ? 'bg-[var(--soil)] text-[#EDD9B8] border-[var(--soil)] shadow-sm'
                : 'bg-[var(--cream2)] text-[var(--text2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]'
            }`}
          >
            🌱 Farmer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('consumer')}
            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              userRole === 'consumer'
                ? 'bg-[var(--soil)] text-[#EDD9B8] border-[var(--soil)] shadow-sm'
                : 'bg-[var(--cream2)] text-[var(--text2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]'
            }`}
          >
            🛒 Consumer
          </button>
          <button
            type="button"
            onClick={() => handleRoleSelect('vendor')}
            className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all ${
              userRole === 'vendor'
                ? 'bg-[var(--soil)] text-[#EDD9B8] border-[var(--soil)] shadow-sm'
                : 'bg-[var(--cream2)] text-[var(--text2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]'
            }`}
          >
            🏪 Vendor
          </button>
        </div>

        {/* Form Inputs */}
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
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
                className="w-full pl-12 pr-3 py-2.5 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text)] outline-none focus:border-[var(--leaf2)] transition-colors"
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
              className="w-full px-3 py-2.5 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text)] outline-none focus:border-[var(--leaf2)] transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 mt-1 rounded-xl text-xs font-bold tracking-wide transition-all active:scale-[0.98] shadow-sm"
            style={{ backgroundColor: 'var(--leaf)', color: '#EDD9B8' }}
          >
            Login as {userRole.toUpperCase()} →
          </button>

          <div className="text-center text-[10px] text-[var(--text3)] font-semibold my-0.5">
            — or —
          </div>

          <button
            type="button"
            onClick={() => onLogin(userRole)}
            className="w-full py-2.5 rounded-xl text-xs font-bold text-[var(--leaf2)] border border-[var(--leaf2)]/40 bg-transparent hover:bg-[var(--leaf-pale)] transition-all active:scale-[0.98]"
          >
            📱 Login with OTP (Fast & Secure)
          </button>
        </form>

        <div className="text-center mt-3 text-[11px] text-[var(--text3)]">
          New to Soil Mates?{' '}
          <span
            onClick={() => onLogin(userRole)}
            className="text-[var(--leaf2)] font-bold cursor-pointer hover:underline"
          >
            Register free →
          </span>
        </div>

        {/* Language switch quick banner */}
        <div
          onClick={onOpenLanguage}
          className="mt-3.5 bg-[var(--leaf-pale)] border border-[var(--leaf2)]/20 rounded-xl p-2.5 flex items-center justify-between text-xs text-[var(--leaf2)] font-semibold cursor-pointer hover:bg-[var(--leaf-pale)]/80 transition-colors"
        >
          <div className="flex items-center gap-2">
            <span>🌍</span>
            <span className="text-[11px]">Selected Language: <strong>{currentLanguage}</strong></span>
          </div>
          <span className="text-[10px] underline font-bold">Change</span>
        </div>

        {/* Voice login banner */}
        <div
          onClick={() => onStartVoice('login')}
          className="mt-2 bg-[var(--amber-pale)] border border-[var(--amber)]/20 rounded-xl p-2.5 flex items-center gap-2 text-xs text-[var(--amber)] font-semibold cursor-pointer hover:bg-[var(--amber-pale)]/80 transition-colors"
        >
          <span>🎙️</span>
          <span className="text-[11px]">Voice login available in your local language</span>
        </div>
      </div>
    </div>
  );
};
