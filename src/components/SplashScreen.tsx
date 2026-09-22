import React from 'react';
import { ScreenId } from '../types';

interface SplashScreenProps {
  onNavigate: (screen: ScreenId) => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onNavigate }) => {
  return (
    <div className="relative h-full flex flex-col items-center justify-center p-6 text-center overflow-hidden" style={{ backgroundColor: '#1A3A1A' }}>
      <div className="splash-pattern"></div>

      {/* Decorative Glow */}
      <div className="absolute top-1/4 w-48 h-48 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>

      {/* App Icon */}
      <div className="relative z-10 w-24 h-24 rounded-3xl bg-[#2D6A2D] border-[3px] border-[rgba(107,191,107,0.4)] flex items-center justify-center text-5xl mb-5 shadow-lg shadow-emerald-950/40">
        🌱
      </div>

      {/* App Titles */}
      <h1 className="relative z-10 font-serif-soil text-4xl font-extrabold text-[#EDD9B8] leading-tight tracking-tight">
        Soil Mates
      </h1>
      <p className="relative z-10 text-sm text-[#EDD9B8]/80 mt-2 font-medium">
        Your crop doctor & direct marketplace
      </p>

      {/* Tagline Badge */}
      <div className="relative z-10 mt-6 bg-[rgba(107,191,107,0.15)] border border-[rgba(107,191,107,0.3)] rounded-xl px-4 py-2.5 text-xs text-[#6BBF6B] font-bold">
        Empowering 600M+ Indian farmers digitally
      </div>

      {/* Action Buttons */}
      <div className="relative z-10 mt-8 w-full flex flex-col gap-2.5">
        <button
          onClick={() => onNavigate('s-login')}
          className="w-full py-3.5 rounded-xl text-sm font-bold tracking-wide transition-all active:scale-[0.98] shadow-md shadow-emerald-950/40"
          style={{ backgroundColor: 'var(--leaf)', color: '#EDD9B8' }}
        >
          Get Started →
        </button>
        <button
          onClick={() => onNavigate('s-login')}
          className="w-full py-3 rounded-xl text-xs font-bold text-[#6BBF6B] border border-[rgba(107,191,107,0.4)] bg-transparent hover:bg-emerald-900/30 transition-all active:scale-[0.98]"
        >
          Login to my farm account
        </button>
      </div>

      {/* Trust Stats Counters */}
      <div className="relative z-10 mt-8 flex items-center justify-center gap-5">
        <div className="text-center">
          <div className="font-serif-soil text-xl font-extrabold text-[#6BBF6B]">48K+</div>
          <div className="text-[10px] text-[#EDD9B8]/60 uppercase tracking-wider font-semibold">Farmers</div>
        </div>
        <div className="w-[1px] h-6 bg-[rgba(107,191,107,0.25)]"></div>
        <div className="text-center">
          <div className="font-serif-soil text-xl font-extrabold text-[#6BBF6B]">12</div>
          <div className="text-[10px] text-[#EDD9B8]/60 uppercase tracking-wider font-semibold">Languages</div>
        </div>
        <div className="w-[1px] h-6 bg-[rgba(107,191,107,0.25)]"></div>
        <div className="text-center">
          <div className="font-serif-soil text-xl font-extrabold text-[#6BBF6B]">AI</div>
          <div className="text-[10px] text-[#EDD9B8]/60 uppercase tracking-wider font-semibold">Powered</div>
        </div>
      </div>
    </div>
  );
};
