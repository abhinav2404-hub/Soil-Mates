import React, { useState, useEffect } from 'react';
import { SupportedLanguage } from '../types';
import { Mic, X, Volume2 } from 'lucide-react';

interface VoiceQueryModalProps {
  isOpen: boolean;
  context: string;
  currentLanguage: SupportedLanguage;
  onClose: () => void;
  onShowToast: (msg: string) => void;
}

export const VoiceQueryModal: React.FC<VoiceQueryModalProps> = ({
  isOpen,
  context,
  currentLanguage,
  onClose,
  onShowToast
}) => {
  const [isListening, setIsListening] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>('');
  const [responseMsg, setResponseMsg] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIsListening(true);
      setResponseMsg(null);
      if (context === 'vendor') {
        setTranscript('Try saying: "Today tomato bulk rate and pending pickup orders."');
      } else if (context === 'treatment') {
        setTranscript('Listening: "Is Mancozeb safe for harvesting within 3 days?"');
      } else if (context === 'login') {
        setTranscript('Say your registered mobile number in Hindi or local language.');
      } else {
        setTranscript('Try saying: "Mere tamatar ke patte par kaale daag hain, kya karun?"');
      }
    }
  }, [isOpen, context]);

  if (!isOpen) return null;

  const handleRunDemoVoice = () => {
    setIsListening(false);
    let demoAnswer = '';
    if (context === 'vendor') {
      demoAnswer =
        'Vendor rate for Tomato Grade A is ₹34/kg today with high buyer demand. 8 farmer lots are ready for pickup.';
    } else {
      demoAnswer =
        'टमाटर में अर्ली ब्लाइट रोग के लक्षण हैं। मैन्कोजेब 75% WP का 2.5 ग्राम प्रति लीटर पानी में छिड़काव करें। (Mancozeb spray recommended within 3 days).';
    }

    setResponseMsg(demoAnswer);
    onShowToast('Voice query captured successfully.');

    // Speak audio if available
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(demoAnswer);
      utter.lang = currentLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';
      window.speechSynthesis.speak(utter);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[var(--cream)] rounded-2xl p-4 border border-white/30 shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]">
          <h3 className="font-serif-soil text-base font-bold text-[var(--text)]">
            Voice Query Active
          </h3>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="w-7 h-7 rounded-full bg-[var(--cream2)] text-[var(--soil)] flex items-center justify-center font-bold text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Listening Graphic */}
        <div className="bg-[var(--amber-pale)] border border-[var(--amber)]/30 rounded-2xl p-4 text-center space-y-2">
          <div className="relative inline-flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[var(--amber)] text-white flex items-center justify-center text-2xl pulsing-mic shadow-md">
              <Mic className="w-8 h-8" />
            </div>
          </div>

          <div className="text-xs font-extrabold text-[var(--amber)]">
            {isListening ? `Listening in ${currentLanguage}...` : 'Voice Query Processed'}
          </div>

          <p className="text-xs text-[var(--text2)] leading-relaxed italic bg-white/60 rounded-xl p-2 border border-[var(--amber)]/20">
            "{transcript}"
          </p>
        </div>

        {/* Audio Answer if available */}
        {responseMsg && (
          <div className="bg-[var(--leaf-pale)] border border-[var(--leaf2)]/30 rounded-xl p-3 text-xs text-[var(--leaf2)] leading-relaxed space-y-1">
            <div className="font-bold flex items-center gap-1">
              <Volume2 className="w-3.5 h-3.5" />
              <span>Soil Mate Spoken Answer:</span>
            </div>
            <p className="text-[var(--text)]">{responseMsg}</p>
          </div>
        )}

        {/* Action Button */}
        <button
          onClick={handleRunDemoVoice}
          className="w-full py-3 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
          style={{ backgroundColor: 'var(--soil)', color: '#EDD9B8' }}
        >
          {isListening ? 'Capture & Analyze Spoken Query' : 'Ask Another Voice Question'}
        </button>
      </div>
    </div>
  );
};
