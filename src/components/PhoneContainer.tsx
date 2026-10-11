import React, { useState } from 'react';
import { Smartphone, Monitor } from 'lucide-react';

interface PhoneContainerProps {
  children: React.ReactNode;
  onOpenInstallModal?: () => void;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children, onOpenInstallModal }) => {
  const [isWideLayout, setIsWideLayout] = useState<boolean>(false);

  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-0 sm:p-3 md:p-6 bg-[var(--cream)] sm:bg-stone-900/90 selection:bg-emerald-600 selection:text-white overflow-x-hidden">
      {/* Desktop Viewport Switcher Toolbar */}
      <div className="hidden sm:flex items-center justify-between w-full max-w-md md:max-w-lg mb-2.5 px-3.5 py-1.5 rounded-full bg-stone-800/90 backdrop-blur border border-stone-700/60 text-xs text-stone-300 shadow-md">
        <span className="flex items-center gap-2 font-medium text-emerald-400">
          Soil Mates AgriTech
        </span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsWideLayout(!isWideLayout)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-700/80 hover:bg-stone-700 text-stone-200 transition-colors cursor-pointer"
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

      {/* Main Container - 100% full screen on phones, responsive frame on desktop */}
      <div
        className={`relative w-full h-[100dvh] sm:h-[880px] max-h-[100dvh] sm:max-h-[92vh] flex flex-col overflow-hidden bg-[var(--cream)] transition-all duration-300 ${
          isWideLayout
            ? 'sm:max-w-2xl sm:rounded-3xl sm:border-[3px] sm:border-stone-700 sm:shadow-2xl'
            : 'sm:max-w-[430px] sm:rounded-[40px] sm:border-[8px] sm:border-stone-800 sm:shadow-2xl'
        }`}
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {/* Inner Screen Content */}
        <div className="relative flex-1 flex flex-col overflow-hidden w-full h-full">
          {children}
        </div>
      </div>
    </div>
  );
};
