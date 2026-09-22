import React from 'react';
import { X, Phone, MessageSquare, HelpCircle } from 'lucide-react';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenChat: () => void;
  onShowToast: (msg: string) => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({
  isOpen,
  onClose,
  onOpenChat,
  onShowToast
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4 animate-in fade-in duration-150">
      <div className="w-full max-w-sm bg-[var(--cream)] rounded-2xl p-4 border border-white/30 shadow-2xl space-y-3">
        <div className="flex items-center justify-between pb-1 border-b border-[var(--border)]">
          <h3 className="font-serif-soil text-base font-bold text-[var(--text)]">
            Help & Farmer Support
          </h3>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-[var(--cream2)] text-[var(--soil)] flex items-center justify-center font-bold text-xs"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Helpline Card */}
        <div
          onClick={() => onShowToast('Connecting to Toll-Free IVR: 1800-111-7645 (SOIL)...')}
          className="bg-[var(--white)] border border-[var(--border)] rounded-xl p-3 cursor-pointer hover:border-[var(--leaf2)] transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text)]">
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>Kisan & Vendor Toll-Free Helpline</span>
          </div>
          <p className="text-[10px] text-[var(--text3)] mt-1 leading-relaxed">
            Call <strong>1800-111-SOIL</strong> (Toll Free, 24x7 in 12 Indian languages) for agronomy help, listing assistance, and payment disputes.
          </p>
        </div>

        {/* WhatsApp Card */}
        <div
          onClick={() => onShowToast('Opening Soil Mates WhatsApp Bot (+91 94251 00000)...')}
          className="bg-[var(--white)] border border-[var(--border)] rounded-xl p-3 cursor-pointer hover:border-[var(--leaf2)] transition-colors shadow-xs"
        >
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text)]">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-700" />
            <span>WhatsApp Crop Helpdesk</span>
          </div>
          <p className="text-[10px] text-[var(--text3)] mt-1 leading-relaxed">
            Send photo of leaf directly on WhatsApp for instant automated diagnostic report and pesticide advice.
          </p>
        </div>

        {/* FAQ Card */}
        <div className="bg-[var(--white)] border border-[var(--border)] rounded-xl p-3 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-[var(--text)] mb-1">
            <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
            <span>Frequently Asked Questions</span>
          </div>
          <div className="text-[10px] text-[var(--text2)] space-y-1">
            <div>• <strong>How do I get paid?</strong> Direct bank deposit via UPI within 24h of pickup.</div>
            <div>• <strong>Is AI Crop Doctor free?</strong> 100% free for all registered farmers.</div>
            <div>• <strong>Who pays delivery?</strong> Platform handles free cold-chain on verified lots.</div>
          </div>
        </div>

        {/* Chat Bot Button */}
        <button
          onClick={() => {
            onClose();
            onOpenChat();
          }}
          className="w-full py-3 rounded-xl text-xs font-bold shadow-sm transition-all active:scale-[0.98]"
          style={{ backgroundColor: 'var(--soil)', color: '#EDD9B8' }}
        >
          💬 Chat with Soil Mate AI Bot Now
        </button>
      </div>
    </div>
  );
};
