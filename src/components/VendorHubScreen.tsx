import React from 'react';
import { ScreenId } from '../types';

interface VendorHubScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onOpenSupport: () => void;
  onStartVoice: (context: string) => void;
  onOpenChat: () => void;
}

export const VendorHubScreen: React.FC<VendorHubScreenProps> = ({
  onNavigate,
  onOpenSupport,
  onStartVoice,
  onOpenChat
}) => {
  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Header */}
      <div
        className="px-4 pt-3.5 pb-3 flex-shrink-0"
        style={{ backgroundColor: 'var(--soil)' }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif-soil text-xl font-extrabold text-[#EDD9B8]">
              🏪 Vendor Hub
            </h2>
            <p className="text-[11px] text-[#EDD9B8]/75 mt-0.5 font-medium">
              Bhopal Fresh Mart · 18 farmer partners
            </p>
          </div>
          <button
            onClick={() => onNavigate('s-profile')}
            className="w-8 h-8 rounded-full bg-[#EDD9B8]/20 border border-[#EDD9B8]/30 flex items-center justify-center text-sm cursor-pointer hover:bg-[#EDD9B8]/30"
          >
            👤
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3">
        {/* Procurement Banner */}
        <div
          className="rounded-2xl p-3.5 flex items-center justify-between shadow-sm relative overflow-hidden"
          style={{ backgroundColor: 'var(--leaf)' }}
        >
          <div className="relative z-10">
            <h3 className="font-serif-soil text-sm font-extrabold text-[#EDD9B8]">
              Procurement Today
            </h3>
            <p className="text-[11px] text-[#EDD9B8]/80 mt-0.5">
              Tomato demand is high · lock farmer price before noon
            </p>
            <button
              onClick={() => onNavigate('s-market')}
              className="mt-2 inline-block bg-[#EDD9B8]/20 hover:bg-[#EDD9B8]/30 border border-[#EDD9B8]/30 rounded-lg px-2.5 py-1 text-[10px] font-bold text-[#EDD9B8] transition-colors"
            >
              Check Rates →
            </button>
          </div>
          <div className="text-4xl pr-1">📦</div>
        </div>

        {/* Dashboard 2x2 Stats Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          <div className="bg-[var(--white)] border border-[var(--border)] rounded-2xl p-3 shadow-sm">
            <div className="text-[11px] font-bold text-[var(--text)] font-serif-soil">
              Open Orders
            </div>
            <div className="font-serif-soil text-2xl font-extrabold text-[var(--leaf)] mt-0.5">
              32
            </div>
            <p className="text-[10px] text-[var(--text3)] mt-0.5 leading-tight">
              8 need pickup confirmation
            </p>
          </div>

          <div className="bg-[var(--white)] border border-[var(--border)] rounded-2xl p-3 shadow-sm">
            <div className="text-[11px] font-bold text-[var(--text)] font-serif-soil">
              Today's Revenue
            </div>
            <div className="font-serif-soil text-2xl font-extrabold text-[var(--leaf)] mt-0.5">
              ₹48K
            </div>
            <p className="text-[10px] text-[var(--text3)] mt-0.5 leading-tight">
              +14% vs yesterday
            </p>
          </div>

          <div className="bg-[var(--white)] border border-[var(--border)] rounded-2xl p-3 shadow-sm">
            <div className="text-[11px] font-bold text-[var(--text)] font-serif-soil">
              Inventory Health
            </div>
            <div className="font-serif-soil text-2xl font-extrabold text-[var(--leaf)] mt-0.5">
              91%
            </div>
            <p className="text-[10px] text-[var(--text3)] mt-0.5 leading-tight">
              Fresh stock for 2 days
            </p>
          </div>

          <div className="bg-[var(--white)] border border-[var(--border)] rounded-2xl p-3 shadow-sm">
            <div className="text-[11px] font-bold text-[var(--text)] font-serif-soil">
              Farmer Payouts
            </div>
            <div className="font-serif-soil text-2xl font-extrabold text-[var(--leaf)] mt-0.5">
              ₹1.8L
            </div>
            <p className="text-[10px] text-[var(--text3)] mt-0.5 leading-tight">
              Scheduled before 6 PM
            </p>
          </div>
        </div>

        {/* Quick Vendor Actions */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <h3 className="font-serif-soil text-xs font-bold text-[var(--text)]">
              Quick Vendor Actions
            </h3>
            <span
              onClick={onOpenChat}
              className="text-[10px] text-[var(--leaf2)] font-bold cursor-pointer hover:underline"
            >
              Ask bot
            </span>
          </div>

          <div
            onClick={() => onNavigate('s-market')}
            className="bg-[var(--cream2)] border border-[var(--border)] rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-[var(--leaf-pale)] transition-colors"
          >
            <span className="text-xl">📊</span>
            <div>
              <strong className="text-xs text-[var(--text)] block">Bulk Market Board</strong>
              <span className="text-[10px] text-[var(--text3)]">Compare mandi rate, demand & margins</span>
            </div>
          </div>

          <div
            onClick={() => onNavigate('s-sell')}
            className="bg-[var(--cream2)] border border-[var(--border)] rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-[var(--leaf-pale)] transition-colors"
          >
            <span className="text-xl">🧾</span>
            <div>
              <strong className="text-xs text-[var(--text)] block">Create Vendor Listing</strong>
              <span className="text-[10px] text-[var(--text3)]">Pack bulk produce into consumer-ready lots</span>
            </div>
          </div>

          <div
            onClick={() => onStartVoice('vendor')}
            className="bg-[var(--cream2)] border border-[var(--border)] rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-[var(--leaf-pale)] transition-colors"
          >
            <span className="text-xl">🎙️</span>
            <div>
              <strong className="text-xs text-[var(--text)] block">Voice Query</strong>
              <span className="text-[10px] text-[var(--text3)]">Ask in Hindi/local language for rates & stock</span>
            </div>
          </div>

          <div
            onClick={onOpenSupport}
            className="bg-[var(--cream2)] border border-[var(--border)] rounded-xl p-2.5 flex items-center gap-2.5 cursor-pointer hover:bg-[var(--leaf-pale)] transition-colors"
          >
            <span className="text-xl">📞</span>
            <div>
              <strong className="text-xs text-[var(--text)] block">Help & Support</strong>
              <span className="text-[10px] text-[var(--text3)]">Vendor onboarding, payment & transport desk</span>
            </div>
          </div>
        </div>

        {/* Priority Farmer Supply */}
        <div className="bg-[var(--white)] rounded-2xl p-3 border border-[var(--border)]">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-serif-soil text-xs font-bold text-[var(--text)]">
              Priority Farmer Supply
            </h4>
            <span className="text-[9px] bg-[var(--leaf-pale)] text-[var(--leaf2)] font-bold px-1.5 py-0.5 rounded-md">
              Verified Partners
            </span>
          </div>

          <div className="divide-y divide-[var(--leaf-pale)]">
            <div className="py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🍅</span>
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">Ramesh Patel</div>
                  <div className="text-[10px] text-[var(--text3)]">Tomato · 220kg ready</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-serif-soil text-xs font-extrabold text-[var(--text)]">
                  ₹34/kg
                </div>
                <div className="text-[9px] text-emerald-700 font-bold">Grade A</div>
              </div>
            </div>

            <div className="py-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🥬</span>
                <div>
                  <div className="text-xs font-bold text-[var(--text)]">Sunita Devi</div>
                  <div className="text-[10px] text-[var(--text3)]">Palak · 90 bunches</div>
                </div>
              </div>
              <div className="text-right">
                <div className="font-serif-soil text-xs font-extrabold text-[var(--text)]">
                  ₹16/bunch
                </div>
                <div className="text-[9px] text-emerald-700 font-bold">Organic</div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-4"></div>
      </div>
    </div>
  );
};
