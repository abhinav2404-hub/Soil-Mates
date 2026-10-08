import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
  onOpenInstallModal?: () => void;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children, onOpenInstallModal }) => {
  const [isWideLayout, setIsWideLayout] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center p-0 sm:p-4 md:p-6 bg-stone-900/90 selection:bg-emerald-600 selection:text-white">
      {/* Desktop Viewport Switcher Toolbar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md md:max-w-lg mb-2 px-3 py-1.5 rounded-full bg-stone-800/80 backdrop-blur border border-stone-700/50 text-xs text-stone-300">
        <span className="flex items-center gap-1.5 font-medium text-emerald-400">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Soil Mates Mobile Platform
        </span>
        <div className="flex items-center gap-2">
          {/* Direct APK Download Link */}
          <a
            href="/SoilMates.apk"
            download="SoilMates.apk"
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition-all active:scale-95 shadow-xs"
            title="Download SoilMates.apk directly"
          >
            <span>⬇️</span>
            <span>Download APK</span>
          </a>
          {onOpenInstallModal && (
            <button
              onClick={onOpenInstallModal}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-600/80 hover:bg-emerald-600 text-white font-bold transition-all active:scale-95 shadow-xs"
              title="Open Mobile APK & Android Package Hub"
            >
              <span>📱</span>
              <span>APK & Mobile</span>
            </button>
          )}
          <button
            onClick={() => setIsWideLayout(!isWideLayout)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-700/60 hover:bg-stone-700 text-stone-200 transition-colors"
            title="Toggle phone frame vs expanded width"
          >
            {isWideLayout ? (
              <>
                <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                <span>Phone Frame</span>
              </>
            ) : (
              <>
                <Monitor className="w-3.5 h-3.5 text-emerald-400" />
                <span>Expanded</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div
        className={`relative w-full h-[100dvh] sm:h-[880px] max-h-[100dvh] sm:max-h-[92vh] flex flex-col overflow-hidden bg-[var(--cream)] shadow-2xl transition-all duration-300 ${
          isWideLayout
            ? 'sm:max-w-2xl sm:rounded-3xl sm:border-[3px] sm:border-stone-700'
            : 'sm:max-w-[430px] sm:rounded-[38px] sm:border-[8px] sm:border-stone-800'
        }`}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.45)'
        }}
      >
        {/* Inner Screen Content */}
        <div className="relative flex-1 flex flex-col overflow-hidden">
          {children}
        </div>
      </div>
    </div>
  );
};
