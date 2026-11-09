import React from 'react';

interface PhoneContainerProps {
  children: React.ReactNode;
  onOpenInstallModal?: () => void;
}

export const PhoneContainer: React.FC<PhoneContainerProps> = ({ children }) => {
  return (
    <div className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center p-0 bg-[var(--cream)] selection:bg-emerald-600 selection:text-white overflow-hidden">
      {/* Main Container - full height responsive viewport */}
      <div
        className="relative w-full h-[100dvh] max-h-[100dvh] flex flex-col overflow-hidden bg-[var(--cream)]"
        style={{
          paddingTop: 'env(safe-area-inset-top, 0px)',
          paddingBottom: 'env(safe-area-inset-bottom, 0px)'
        }}
      >
        {/* Inner Screen Content */}
        <div className="relative flex-1 flex flex-col overflow-hidden w-full h-full max-w-md sm:max-w-lg md:max-w-xl mx-auto shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
};
