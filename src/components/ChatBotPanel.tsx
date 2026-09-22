import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage, ScreenId } from '../types';
import { MessageCircle, X, Send, Sparkles } from 'lucide-react';

interface ChatBotPanelProps {
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
  onNavigate: (screen: ScreenId) => void;
  farmerName?: string;
}

export const ChatBotPanel: React.FC<ChatBotPanelProps> = ({
  isOpen,
  onToggle,
  onClose,
  onNavigate,
  farmerName
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-1',
      sender: 'bot',
      text: 'Namaste! I am your Soil Mate Agri Assistant. How can I help with crop disease, mandi prices, or orders today?',
      time: 'Just now'
    },
    {
      id: 'msg-2',
      sender: 'bot',
      text: 'Try asking: "tomato price today", "how to cure leaf spots", "vendor orders", or "speak in Hindi".',
      time: 'Just now'
    }
  ]);
  const [inputVal, setInputVal] = useState<string>('');
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  // When farmerName is passed (e.g. Chat with Farmer button on product detail)
  useEffect(() => {
    if (farmerName) {
      setMessages((prev) => [
        ...prev,
        {
          id: `msg-${Date.now()}`,
          sender: 'bot',
          text: `Direct line connected to ${farmerName}. You can ask about harvest quality, packaging, or bulk discounts.`,
          time: 'Just now'
        }
      ]);
    }
  }, [farmerName]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen]);

  const quickPrompts = [
    'Tomato Mandi Price',
    'Diagnose Leaf Spot',
    'Vendor Bulk Rates',
    'Hindi Support'
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = (textToSend || inputVal).trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      time: 'Now'
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal('');

    // Generate intelligent agricultural response
    setTimeout(() => {
      const lower = text.toLowerCase();
      let botReply =
        'I am your agri assistant. Ask me about crop diagnosis, mandi rates, cold-chain transport, or language settings!';
      let actionScreen: ScreenId | undefined = undefined;
      let actionLabel: string | undefined = undefined;

      if (lower.includes('price') || lower.includes('mandi') || lower.includes('rate') || lower.includes('tomato')) {
        botReply =
          'Today tomato mandi rate is ₹32–₹40/kg in Bhopal. Demand is high (+12%). Optimal farmer selling rate is ₹34/kg.';
        actionScreen = 's-market';
        actionLabel = 'Open Live Price Board';
      } else if (
        lower.includes('photo') ||
        lower.includes('camera') ||
        lower.includes('disease') ||
        lower.includes('leaf') ||
        lower.includes('spot') ||
        lower.includes('blight')
      ) {
        botReply =
          'For leaf disease analysis, open AI Crop Doctor and take a close daylight photo of the leaf. Our AI will identify the pathogen and recommend safe dosage.';
        actionScreen = 's-ai';
        actionLabel = 'Launch AI Crop Doctor';
      } else if (lower.includes('vendor') || lower.includes('bulk') || lower.includes('procure')) {
        botReply =
          'Vendor Hub allows bulk lot reservation directly from verified farmers like Ramesh Patel (220kg Tomato ready).';
        actionScreen = 's-vendor';
        actionLabel = 'Go to Vendor Hub';
      } else if (lower.includes('hindi') || lower.includes('भाषा') || lower.includes('language')) {
        botReply =
          'आप कभी भी प्रोफाइल या लॉगिन से अपनी भाषा बदल सकते हैं। हिन्दी, मराठी, तमिल, तेलुगु, कन्नड़, पंजाबी, बंगाली उपलब्ध हैं।';
      } else if (lower.includes('order') || lower.includes('track') || lower.includes('delivery')) {
        botReply =
          'Active orders are tracked via real-time GPS cold chain. Pickups from Vidisha and Sehore arrive within 2–3 hours.';
        actionScreen = 's-orders';
        actionLabel = 'View Active Orders';
      } else if (lower.includes('help') || lower.includes('support') || lower.includes('call')) {
        botReply =
          'You can contact our 24x7 Kisan Helpline toll-free at 1800-111-SOIL or chat with agronomy specialists directly.';
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: botReply,
          time: 'Now',
          actionScreen,
          actionLabel
        }
      ]);
    }, 400);
  };

  return (
    <>
      {/* Floating Action Button (FAB) */}
      <button
        onClick={onToggle}
        className="fixed bottom-20 right-4 sm:right-6 w-12 h-12 rounded-full text-white flex items-center justify-center text-xl shadow-xl z-40 transition-transform active:scale-90 hover:scale-105"
        style={{
          backgroundColor: 'var(--leaf)',
          boxShadow: '0 8px 24px rgba(45, 106, 45, 0.4)'
        }}
        title="Chat with Soil Mate Bot"
      >
        💬
      </button>

      {/* Slide-Up Chat Panel */}
      {isOpen && (
        <div className="fixed inset-x-3 bottom-20 sm:bottom-24 sm:right-6 sm:left-auto sm:w-96 h-[420px] bg-[var(--cream)] border border-[var(--border)] rounded-2xl shadow-2xl z-50 flex flex-col overflow-hidden animate-in slide-in-from-bottom-5 duration-200">
          {/* Header */}
          <div
            className="p-3 flex items-center justify-between text-[#EDD9B8] flex-shrink-0"
            style={{ backgroundColor: 'var(--soil)' }}
          >
            <div className="flex items-center gap-2">
              <span className="text-lg">🌱</span>
              <div>
                <strong className="font-serif-soil text-sm font-bold text-[#EDD9B8]">
                  Soil Mate Bot
                </strong>
                <span className="block text-[9px] text-emerald-400 font-bold">
                  ● AI Agronomy Online
                </span>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-[#EDD9B8] flex items-center justify-center text-xs"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 overflow-y-auto no-scrollbar p-3 space-y-2.5 bg-[var(--cream)]">
            {messages.map((m) => (
              <div
                key={m.id}
                className={`max-w-[85%] rounded-2xl p-2.5 text-xs leading-relaxed shadow-xs ${
                  m.sender === 'user'
                    ? 'ml-auto text-[#EDD9B8]'
                    : 'bg-[var(--white)] text-[var(--text2)] border border-[var(--border)]'
                }`}
                style={{
                  backgroundColor: m.sender === 'user' ? 'var(--leaf)' : undefined
                }}
              >
                <div>{m.text}</div>
                {m.actionScreen && m.actionLabel && (
                  <button
                    onClick={() => {
                      onNavigate(m.actionScreen!);
                      onClose();
                    }}
                    className="mt-2 w-full py-1 rounded-lg bg-[var(--leaf-pale)] text-[var(--leaf2)] text-[10px] font-bold border border-[var(--leaf2)]/30 hover:bg-[var(--leaf2)] hover:text-white transition-colors"
                  >
                    {m.actionLabel} →
                  </button>
                )}
                <div
                  className={`text-[8px] mt-1 text-right ${
                    m.sender === 'user' ? 'text-white/60' : 'text-[var(--text3)]'
                  }`}
                >
                  {m.time}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Prompts Chips */}
          <div className="px-2 py-1.5 bg-[var(--cream2)] border-t border-[var(--border)] flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((p, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(p)}
                className="px-2 py-0.5 rounded-full bg-white border border-[var(--border)] text-[9px] font-bold text-[var(--soil2)] whitespace-nowrap hover:bg-[var(--leaf-pale)]"
              >
                {p}
              </button>
            ))}
          </div>

          {/* Input Box */}
          <div className="p-2 bg-[var(--white)] border-t border-[var(--border)] flex gap-1.5 items-center">
            <input
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSendMessage();
              }}
              placeholder="Ask about crops, disease, mandi..."
              className="flex-1 px-3 py-2 bg-[var(--cream2)] border border-[var(--border)] rounded-xl text-xs font-medium text-[var(--text)] outline-none focus:border-[var(--leaf2)]"
            />
            <button
              onClick={() => handleSendMessage()}
              className="w-8 h-8 rounded-xl flex items-center justify-center text-white shadow-xs transition-transform active:scale-95"
              style={{ backgroundColor: 'var(--soil)' }}
            >
              <Send className="w-3.5 h-3.5 text-[#EDD9B8]" />
            </button>
          </div>
        </div>
      )}
    </>
  );
};
