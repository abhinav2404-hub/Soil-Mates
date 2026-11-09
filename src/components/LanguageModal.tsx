import React from 'react';
import { SupportedLanguage } from '../types';
import { SUPPORTED_LANGUAGES } from '../data/agriData';
import { X } from 'lucide-react';

interface LanguageModalProps {
  isOpen: boolean;
  currentLanguage: SupportedLanguage;
  onClose: () => void;
  onSelectLanguage: (lang: SupportedLanguage) => void;
}

export const LanguageModal: React.FC<LanguageModalProps> = ({
  isOpen,
  currentLanguage,
  onClose,
  onSelectLanguage
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[var(--cream)] rounded-2xl p-4 border border-white/30 shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]">
          <h3 className="font-serif-soil text-base font-bold text-[var(--text)]">
            Choose Language / भाषा चुनें
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--cream2)] text-[var(--soil)] flex items-center justify-center font-bold text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="max-h-80 overflow-y-auto no-scrollbar grid grid-cols-2 gap-2 pr-1">
          {SUPPORTED_LANGUAGES.map((lang) => {
            const isSelected = currentLanguage === lang.code;
            const isPriority = ['Hindi', 'English', 'Marathi', 'Tamil', 'Telugu', 'Gujarati', 'Bengali', 'Kannada'].includes(lang.code);
            return (
              <button
                key={lang.code}
                onClick={() => {
                  onSelectLanguage(lang.code);
                  onClose();
                }}
                className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[var(--leaf2)] bg-[var(--leaf-pale)] text-[var(--leaf2)] font-bold shadow-xs ring-1 ring-emerald-500'
                    : isPriority
                    ? 'border-emerald-500/40 bg-[var(--white)] text-[var(--text)] hover:bg-[var(--leaf-pale)]/50'
                    : 'border-[var(--border)] bg-[var(--white)] text-[var(--text)] hover:bg-[var(--leaf-pale)]/50'
                }`}
              >
                <div className="text-xs font-bold flex items-center justify-between">
                  <span>{lang.name}</span>
                  {isPriority && <span className="text-[9px] text-emerald-600 font-extrabold">★</span>}
                </div>
                <div className="text-[10px] text-[var(--text3)] font-medium mt-0.5">
                  {lang.native}
                </div>
              </button>
            );
          })}
        </div>

        <p className="text-[10px] text-[var(--text3)] text-center pt-1">
          Soil Mates audio voice, speech synthesis & diagnostics adapts to all 23 Indian languages automatically.
        </p>
      </div>
    </div>
  );
};
