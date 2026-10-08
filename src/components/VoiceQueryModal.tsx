import React, { useState, useEffect, useRef } from 'react';
import { SupportedLanguage } from '../types';
import { Mic, X, Volume2, Sparkles, CheckCircle2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface VoiceQueryModalProps {
  isOpen: boolean;
  context: string;
  currentLanguage: SupportedLanguage;
  onClose: () => void;
  onShowToast: (msg: string) => void;
  onSelectOption?: (option: string) => void;
}

export const VoiceQueryModal: React.FC<VoiceQueryModalProps> = ({
  isOpen,
  context,
  currentLanguage,
  onClose,
  onShowToast,
  onSelectOption
}) => {
  const [isListening, setIsListening] = useState<boolean>(true);
  const [transcript, setTranscript] = useState<string>('');
  const [responseMsg, setResponseMsg] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = currentLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';
      utter.rate = 0.95;
      window.speechSynthesis.speak(utter);
    }
  };

  useEffect(() => {
    if (!isOpen) {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      return;
    }

    setIsListening(true);
    setResponseMsg(null);

    let introPrompt = '';
    if (context === 'login') {
      introPrompt = currentLanguage === 'Hindi'
        ? 'नमस्ते! आप बोल सकते हैं: "किसान", "खरीदार", या अपना फ़ोन नंबर बताएं।'
        : 'Welcome! You can say: "Farmer", "Buyer", or speak your mobile number.';
      setTranscript(introPrompt);
    } else if (context === 'vendor') {
      introPrompt = 'Listening for mandi wholesale rate or bulk pickup inquiry.';
      setTranscript(introPrompt);
    } else {
      introPrompt = currentLanguage === 'Hindi'
        ? 'बोलिए, आपकी फसल या खेत में क्या समस्या है?'
        : 'Please speak: What is the issue with your crop or field?';
      setTranscript(introPrompt);
    }

    speakText(introPrompt);

    // Try web speech recognition if available in modern browsers/webviews
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.lang = currentLanguage === 'Hindi' ? 'hi-IN' : 'en-IN';

        recognition.onresult = (event: any) => {
          const speechResult = event.results[0][0].transcript;
          setTranscript(speechResult);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.onerror = () => {
          setIsListening(false);
        };

        recognition.start();
        recognitionRef.current = recognition;
      } catch (e) {
        console.info('[VoiceModal] Native recognition fallback mode active');
      }
    }
  }, [isOpen, context, currentLanguage]);

  if (!isOpen) return null;

  const handleSimulateAnswer = (customText?: string) => {
    setIsListening(false);
    let reply = '';
    const input = customText || transcript;

    if (context === 'login') {
      if (input.toLowerCase().includes('kisan') || input.toLowerCase().includes('farmer')) {
        reply = 'Farmer portal selected! Logging in as Farmer Ramesh Patel.';
        onSelectOption?.('farmer');
      } else if (input.toLowerCase().includes('buyer') || input.toLowerCase().includes('consumer')) {
        reply = 'Consumer marketplace selected! Logging in as Priya Sharma.';
        onSelectOption?.('consumer');
      } else {
        reply = 'Mobile number recognized! Logging you in safely to your farm account.';
      }
    } else if (context === 'vendor') {
      reply = 'Tomato wholesale rate is ₹34 per kilogram today in Karond Mandi. 8 farmer crates ready.';
    } else {
      reply = currentLanguage === 'Hindi'
        ? 'टमाटर की पत्ती पर अर्ली ब्लाइट फफूंद है। मैन्कोजेब 2 ग्राम प्रति लीटर पानी का छिड़काव करें।'
        : 'Early blight fungal spots detected. Apply Mancozeb 75% WP spray with bio-stimulant within 3 days.';
    }

    setResponseMsg(reply);
    speakText(reply);
    onShowToast('Voice assistance completed 👍');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-200">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-sm bg-[var(--cream)] rounded-3xl p-5 border border-white/40 shadow-2xl space-y-4"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-2 border-b border-[var(--border)]">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎙️</span>
            <div>
              <h3 className="font-serif-soil text-sm font-bold text-[var(--text)]">
                Voice Assistant (बोलकर पूछें)
              </h3>
              <p className="text-[10px] text-[var(--text3)]">
                Instant help in {currentLanguage} / English
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
                window.speechSynthesis.cancel();
              }
              onClose();
            }}
            className="w-8 h-8 rounded-full bg-[var(--cream2)] hover:bg-stone-200 text-[var(--soil)] flex items-center justify-center font-bold text-xs transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Dynamic Listening Graphic with Framer Motion Concentric Rings & Equalizer Bars */}
        <div className="bg-gradient-to-b from-amber-50 to-amber-100/60 dark:from-amber-950/40 dark:to-amber-900/30 border border-amber-300 dark:border-amber-700/50 rounded-2xl p-4 text-center space-y-3 relative overflow-hidden">
          {/* Animated Background Radar Wave */}
          <div className="relative inline-flex items-center justify-center my-1">
            {isListening && (
              <>
                <motion.span
                  animate={{ scale: [1, 1.7, 2.2], opacity: [0.6, 0.25, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, ease: 'easeOut' }}
                  className="absolute w-16 h-16 rounded-full bg-amber-400 pointer-events-none"
                />
                <motion.span
                  animate={{ scale: [1, 1.4, 1.9], opacity: [0.7, 0.3, 0] }}
                  transition={{ repeat: Infinity, duration: 1.8, delay: 0.45, ease: 'easeOut' }}
                  className="absolute w-16 h-16 rounded-full bg-amber-500 pointer-events-none"
                />
              </>
            )}

            <motion.div
              animate={isListening ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
              className="w-16 h-16 rounded-full bg-amber-600 text-white flex items-center justify-center text-2xl shadow-lg relative z-10 transition-transform active:scale-95"
            >
              <Mic className="w-8 h-8" />
            </motion.div>
          </div>

          {/* Equalizer Sound Wave Animation Bars */}
          <div className="flex items-center justify-center gap-1.5 h-6 py-1">
            {[0.4, 0.8, 1.2, 0.6, 1.0, 0.5, 0.9, 0.7].map((factor, idx) => (
              <motion.span
                key={idx}
                animate={isListening ? { scaleY: [0.25, factor * 1.5, 0.25] } : { scaleY: 0.25 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.7,
                  delay: idx * 0.1,
                  ease: 'easeInOut'
                }}
                className="w-1.5 h-5 bg-amber-600 rounded-full origin-center"
              />
            ))}
          </div>

          <div>
            <div className="text-xs font-extrabold text-amber-900 dark:text-amber-200 flex items-center justify-center gap-1.5">
              <span>{isListening ? 'Listening to your voice...' : 'Speech Captured'}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            </div>
            <p className="text-[11px] text-amber-800/80 dark:text-amber-300/80 mt-0.5">
              Speak naturally in any Indian language
            </p>
          </div>

          <div className="text-xs font-medium text-[var(--text)] italic bg-white/80 dark:bg-stone-800/80 rounded-xl p-3 border border-amber-300/40 shadow-inner">
            "{transcript}"
          </div>
        </div>

        {/* Quick Voice Tap Options for Friendly Usage */}
        <div className="space-y-1.5">
          <div className="text-[10px] font-bold text-[var(--text3)] uppercase tracking-wider">
            Or tap an option directly:
          </div>
          <div className="flex flex-wrap gap-1.5">
            {context === 'login' ? (
              <>
                <button
                  type="button"
                  onClick={() => handleSimulateAnswer('Farmer login')}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold hover:bg-emerald-200 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>👨‍🌾</span>
                  <span>"I am Farmer"</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateAnswer('Consumer buyer login')}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold hover:bg-emerald-200 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>🛒</span>
                  <span>"I am Buyer"</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => handleSimulateAnswer('Tomato disease treatment')}
                  className="px-2.5 py-1.5 rounded-xl bg-emerald-100 text-emerald-900 text-xs font-bold hover:bg-emerald-200 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>🍅</span>
                  <span>"Leaf spot cure"</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSimulateAnswer('Today mandi prices')}
                  className="px-2.5 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-bold hover:bg-amber-200 transition-all active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  <span>📈</span>
                  <span>"Mandi rates"</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Spoken Response Box */}
        {responseMsg && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/50 rounded-2xl p-3 text-xs text-emerald-950 dark:text-emerald-100 space-y-1"
          >
            <div className="font-bold flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400">
              <Volume2 className="w-4 h-4 animate-pulse" />
              <span>Spoken Reply:</span>
            </div>
            <p className="leading-relaxed font-medium">{responseMsg}</p>
          </motion.div>
        )}

        {/* Main Action Button */}
        <button
          onClick={() => handleSimulateAnswer()}
          className="w-full py-3 rounded-xl text-xs font-bold text-white shadow-md transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
          style={{ backgroundColor: 'var(--soil)' }}
        >
          <Sparkles className="w-4 h-4 text-emerald-300" />
          <span>{isListening ? 'Analyze & Answer My Voice' : 'Ask Another Question'}</span>
        </button>
      </motion.div>
    </div>
  );
};
