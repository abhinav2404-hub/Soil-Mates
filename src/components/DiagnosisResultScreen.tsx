import React, { useState, useEffect } from 'react';
import { CropDiagnosis, ScreenId, ProduceItem } from '../types';
import { Volume2, VolumeX, ArrowLeft, ShoppingBag } from 'lucide-react';

interface DiagnosisResultScreenProps {
  diagnosis: CropDiagnosis;
  onNavigate: (screen: ScreenId) => void;
  onAddToCart: (item: ProduceItem) => void;
  onShowToast: (msg: string) => void;
}

export const DiagnosisResultScreen: React.FC<DiagnosisResultScreenProps> = ({
  diagnosis,
  onNavigate,
  onAddToCart,
  onShowToast
}) => {
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [speechLang, setSpeechLang] = useState<'hi' | 'en'>('hi');

  // Stop speech when leaving screen
  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const toggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      onShowToast('Text-to-speech audio not supported on this device.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      onShowToast('Audio paused.');
    } else {
      window.speechSynthesis.cancel();
      const textToSpeak =
        speechLang === 'hi'
          ? diagnosis.hindiNarration
          : diagnosis.englishNarration;

      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = speechLang === 'hi' ? 'hi-IN' : 'en-IN';
      utterance.rate = 0.95;

      utterance.onend = () => {
        setIsSpeaking(false);
      };
      utterance.onerror = () => {
        setIsSpeaking(false);
      };

      window.speechSynthesis.speak(utterance);
      setIsSpeaking(true);
      onShowToast(speechLang === 'hi' ? '🎙️ Playing Hindi voice narration...' : '🎙️ Playing English voice narration...');
    }
  };

  const handleBuyMedicine = () => {
    // Generate a temporary produce item representation for the recommended medicine
    const medicineItem: ProduceItem = {
      id: `med-${diagnosis.id}`,
      name: diagnosis.recommendedProduct.name,
      category: 'herbs',
      emoji: '💊',
      farmName: 'Agro-Care Pharmacy Partner',
      location: 'Certified Agro Store, Bhopal',
      pricePerKg: diagnosis.recommendedProduct.price,
      unit: 'pack',
      availableKg: 50,
      rating: 4.9,
      reviewsCount: 142,
      deliveryHours: 2,
      farmerAadhaarVerified: true,
      harvestTime: 'Verified Authentic Batch',
      grade: 'Grade A',
      description: `Targeted treatment for ${diagnosis.diseaseName}. Prescribed dosage: ${diagnosis.recommendedProduct.dosage}.`
    };

    onAddToCart(medicineItem);
    onShowToast(`Added ${diagnosis.recommendedProduct.name} to Cart!`);
  };

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Top Header Bar */}
      <div
        className="px-4 py-3 flex items-center gap-3 flex-shrink-0"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <button
          onClick={() => onNavigate('s-ai')}
          className="text-[#EDD9B8] hover:text-white text-lg p-1 transition-transform active:scale-95"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="font-serif-soil text-base font-extrabold text-[#EDD9B8]">
          Diagnosis Result
        </h3>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {/* Infected Leaf Visual Header */}
        <div className="bg-[var(--coral-pale)] h-32 flex items-center justify-center text-7xl border-b border-[var(--border)] relative">
          <span>{diagnosis.detectedVisual}</span>
          <span className="absolute bottom-2 right-3 text-[10px] bg-white/80 backdrop-blur px-2 py-0.5 rounded-full font-bold text-[var(--soil)] shadow-sm">
            AI Scanned Sample
          </span>
        </div>

        {/* Urgency Alert Bar */}
        <div className="m-3.5 bg-[var(--coral-pale)] border border-[var(--coral)]/30 rounded-xl p-3 flex items-center gap-2.5">
          <span className="text-xl flex-shrink-0">⚠️</span>
          <div>
            <div className="text-xs font-bold text-[var(--coral)]">
              {diagnosis.diseaseName} Detected
            </div>
            <div className="text-[10px] text-[var(--text2)] mt-0.5">
              Act within <strong>{diagnosis.urgencyDays}</strong> to prevent crop spread
            </div>
          </div>
        </div>

        {/* Main Diagnostic Card */}
        <div className="mx-3.5 bg-[var(--white)] rounded-2xl p-4 border border-[var(--border)] shadow-sm space-y-3.5">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[var(--coral-pale)] flex items-center justify-center text-2xl flex-shrink-0">
              {diagnosis.detectedVisual}
            </div>
            <div>
              <div className="font-serif-soil text-sm font-bold text-[var(--text)]">
                {diagnosis.diseaseName}
              </div>
              <div className="text-[11px] text-[var(--text3)]">
                {diagnosis.scientificName}
              </div>
            </div>
          </div>

          {/* AI Confidence Bar */}
          <div>
            <div className="flex justify-between text-[11px] text-[var(--text3)] mb-1 font-semibold">
              <span>AI Diagnostic Confidence</span>
              <span className="text-[var(--coral)] font-bold">{diagnosis.confidence}%</span>
            </div>
            <div className="h-2 bg-[var(--cream2)] rounded-full overflow-hidden">
              <div
                className="h-full bg-[var(--coral)] rounded-full transition-all duration-700"
                style={{ width: `${diagnosis.confidence}%` }}
              ></div>
            </div>
          </div>

          {/* Symptoms Detected */}
          <div>
            <div className="text-xs font-bold text-[var(--text)] mb-2">
              Detected Symptoms:
            </div>
            <div className="space-y-1.5">
              {diagnosis.symptoms.map((symp, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-[var(--text2)] leading-tight">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--coral)] mt-1 flex-shrink-0"></span>
                  <span>{symp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recommended Treatment Steps */}
          <div className="pt-1 border-t border-[var(--border)]/50">
            <div className="text-xs font-bold text-[var(--text)] mb-2">
              Step-by-Step Treatment Protocol:
            </div>
            <div className="space-y-2">
              {diagnosis.treatmentSteps.map((step, idx) => (
                <div key={idx} className="flex items-start gap-2 text-[11px] text-[var(--text2)] leading-tight">
                  <span className="w-4 h-4 rounded-full bg-[var(--leaf-pale)] text-[var(--leaf2)] font-bold text-[9px] flex items-center justify-center mt-0.5 flex-shrink-0 border border-[var(--leaf2)]/30">
                    {idx + 1}
                  </span>
                  <span>{step}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-3.5 mt-3.5 space-y-2">
          {/* Buy Prescribed Medicine Button */}
          <button
            onClick={handleBuyMedicine}
            className="w-full py-3 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98] flex items-center justify-center gap-2"
            style={{ backgroundColor: 'var(--leaf)', color: '#EDD9B8' }}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Buy {diagnosis.recommendedProduct.name} (₹{diagnosis.recommendedProduct.price})</span>
          </button>

          {/* Voice Narration Audio Toggle */}
          <div className="flex gap-2">
            <button
              onClick={toggleSpeech}
              className={`flex-1 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
                isSpeaking
                  ? 'bg-[var(--coral)] text-white border-[var(--coral)] animate-pulse'
                  : 'bg-[var(--cream2)] text-[var(--text2)] border-[var(--border)] hover:bg-[var(--leaf-pale)]'
              }`}
            >
              {isSpeaking ? (
                <>
                  <VolumeX className="w-4 h-4" />
                  <span>Stop Voice Audio</span>
                </>
              ) : (
                <>
                  <Volume2 className="w-4 h-4 text-emerald-700" />
                  <span>Hear in {speechLang === 'hi' ? 'Hindi (हिन्दी)' : 'English'}</span>
                </>
              )}
            </button>

            <button
              onClick={() => {
                if (isSpeaking) {
                  window.speechSynthesis?.cancel();
                  setIsSpeaking(false);
                }
                setSpeechLang(speechLang === 'hi' ? 'en' : 'hi');
                onShowToast(`Speech switched to ${speechLang === 'hi' ? 'English' : 'Hindi'}`);
              }}
              className="px-3 py-2 rounded-xl border border-[var(--border)] bg-[var(--white)] text-[10px] font-bold text-[var(--soil2)] hover:bg-[var(--cream2)]"
            >
              {speechLang === 'hi' ? 'EN' : 'HI'}
            </button>
          </div>
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
};
