import React from 'react';
import { ScreenId, UserRole, SupportedLanguage } from '../types';
import { ChevronRight } from 'lucide-react';

interface ProfileScreenProps {
  userRole: UserRole;
  isDarkMode: boolean;
  currentLanguage: SupportedLanguage;
  onToggleDarkMode: () => void;
  onOpenLanguage: () => void;
  onOpenSupport: () => void;
  onOpenDocs?: () => void;
  onNavigate: (screen: ScreenId) => void;
  onShowToast: (msg: string) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  userRole,
  isDarkMode,
  currentLanguage,
  onToggleDarkMode,
  onOpenLanguage,
  onOpenSupport,
  onOpenDocs,
  onNavigate,
  onShowToast
}) => {
  const isFarmer = userRole === 'farmer';
  const isVendor = userRole === 'vendor';

  const name = isVendor
    ? 'Bhopal Fresh Mart'
    : isFarmer
    ? 'Ramesh Patel'
    : 'Priya Sharma';

  const location = isVendor
    ? 'Karond Mandi, Bhopal'
    : isFarmer
    ? 'Vidisha, Madhya Pradesh'
    : 'Arera Colony, Bhopal';

  const badgeText = isVendor
    ? '🏪 Verified Agri Vendor · 4 yrs'
    : isFarmer
    ? '🌱 Verified Farmer · 3 yrs'
    : '🛒 Verified Consumer Member';

  return (
    <div className="h-full flex flex-col overflow-hidden bg-[var(--cream)]">
      {/* Scrollable Profile Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar pb-6">
        {/* Profile Hero */}
        <div
          className="p-5 flex items-center gap-3.5 flex-shrink-0"
          style={{ backgroundColor: 'var(--soil)' }}
        >
          <div className="w-14 h-14 rounded-full bg-[#EDD9B8]/20 border-2 border-[#EDD9B8]/35 flex items-center justify-center text-3xl shadow-sm">
            {isVendor ? '🏪' : isFarmer ? '👨‍🌾' : '👩'}
          </div>

          <div className="flex-1">
            <h3 className="font-serif-soil text-lg font-extrabold text-[#EDD9B8]">
              {name}
            </h3>
            <p className="text-[11px] text-[#EDD9B8]/70 mt-0.5">📍 {location}</p>
            <div className="mt-1.5 inline-block bg-[rgba(107,191,107,0.25)] border border-[#6BBF6B]/30 rounded-md px-2 py-0.5 text-[9px] text-[#6BBF6B] font-bold">
              {badgeText}
            </div>
          </div>
        </div>

        {/* 3 Stats Row */}
        <div className="grid grid-cols-3 bg-[var(--border)] gap-[1px]">
          <div className="bg-[var(--cream2)] py-3 px-1.5 text-center">
            <div className="font-serif-soil text-base font-extrabold text-[var(--leaf)]">
              {isVendor ? '₹4.8L' : isFarmer ? '₹1.2L' : '₹1.4K'}
            </div>
            <div className="text-[9px] font-bold text-[var(--text3)] uppercase mt-0.5">
              {isConsumer(userRole) ? 'SAVED' : 'EARNED APR'}
            </div>
          </div>

          <div className="bg-[var(--cream2)] py-3 px-1.5 text-center">
            <div className="font-serif-soil text-base font-extrabold text-[var(--leaf)]">
              {isVendor ? '320' : isFarmer ? '148' : '18'}
            </div>
            <div className="text-[9px] font-bold text-[var(--text3)] uppercase mt-0.5">
              ORDERS DONE
            </div>
          </div>

          <div className="bg-[var(--cream2)] py-3 px-1.5 text-center">
            <div className="font-serif-soil text-base font-extrabold text-[var(--leaf)]">
              4.9★
            </div>
            <div className="text-[9px] font-bold text-[var(--text3)] uppercase mt-0.5">
              RATING
            </div>
          </div>
        </div>

        <div className="h-2 bg-[var(--cream2)]"></div>

        {/* Menu Items List */}
        <div className="divide-y divide-[var(--leaf-pale)] bg-[var(--white)] border-y border-[var(--border)]">
          {/* AI Doctor History */}
          <div
            onClick={() => onNavigate('s-ai')}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--leaf-pale)] flex items-center justify-center text-lg flex-shrink-0">
              🔬
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--text)]">AI Crop Doctor History</h5>
              <p className="text-[10px] text-[var(--text3)]">7 leaf diagnoses this month</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
          </div>

          {/* Farm Analytics */}
          <div
            onClick={() => onShowToast('Analytics report: Tomato & Palak sales up 24%')}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--leaf-pale)] flex items-center justify-center text-lg flex-shrink-0">
              📊
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--text)]">Farm Analytics</h5>
              <p className="text-[10px] text-[var(--text3)]">Sales trends & AI crop insights</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
          </div>

          {/* Earnings & Payments */}
          <div
            onClick={() => onShowToast('Bank: State Bank of India A/C ****4821 linked with UPI')}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--amber-pale)] flex items-center justify-center text-lg flex-shrink-0">
              💰
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--text)]">Earnings & Direct Payouts</h5>
              <p className="text-[10px] text-[var(--text3)]">SBI ****4821 · UPI verified</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
          </div>

          {/* My Listings */}
          <div
            onClick={() => onNavigate('s-sell')}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--cream2)] flex items-center justify-center text-lg flex-shrink-0">
              🌾
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--text)]">My Active Listings</h5>
              <p className="text-[10px] text-[var(--text3)]">3 active · 12 sold this month</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
          </div>

          {/* Price Alerts */}
          <div
            onClick={() => onShowToast('Price Alert active: SMS & Notification for Tomato > ₹35/kg')}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--coral-pale)] flex items-center justify-center text-lg flex-shrink-0">
              🔔
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--text)]">Mandi Price Alerts</h5>
              <p className="text-[10px] text-[var(--text3)]">Instant SMS notifications enabled</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
          </div>

          {/* Dark Mode Switch */}
          <div
            onClick={onToggleDarkMode}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--cream2)] flex items-center justify-center text-lg flex-shrink-0">
              🌙
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--text)]">Dark Mode</h5>
              <p className="text-[10px] text-[var(--text3)]">
                {isDarkMode ? 'Dark theme active' : 'Light theme active'}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--text3)]">
                {isDarkMode ? 'ON' : 'OFF'}
              </span>
              <div
                className={`w-11 h-6 rounded-full border transition-colors relative ${
                  isDarkMode
                    ? 'bg-[var(--leaf-pale)] border-[var(--leaf2)]'
                    : 'bg-[var(--cream2)] border-[var(--border)]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-transform absolute top-0.5 ${
                    isDarkMode
                      ? 'translate-x-5 bg-[var(--leaf2)]'
                      : 'translate-x-0.5 bg-[var(--soil3)]'
                  }`}
                ></div>
              </div>
            </div>
          </div>

          {/* Language Switch */}
          <div
            onClick={onOpenLanguage}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--leaf-pale)] flex items-center justify-center text-lg flex-shrink-0">
              🌍
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--text)]">Language / भाषा</h5>
              <p className="text-[10px] text-[var(--text3)]">Currently: {currentLanguage}</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
          </div>

          {/* Help & Support */}
          <div
            onClick={onOpenSupport}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--cream2)] flex items-center justify-center text-lg flex-shrink-0">
              📞
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--text)]">Help & Support Desk</h5>
              <p className="text-[10px] text-[var(--text3)]">WhatsApp · 1800-111-SOIL Toll Free</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
          </div>

          {/* Project Architecture & PRD Specs */}
          <div
            onClick={onOpenDocs}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors bg-[var(--leaf-pale)]/30"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--soil)] text-[#EDD9B8] flex items-center justify-center text-sm font-bold flex-shrink-0">
              📖
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--soil)] flex items-center gap-1.5">
                <span>Architecture & PRD Specs</span>
                <span className="bg-emerald-200 text-emerald-900 text-[8px] px-1 py-0.2 rounded font-extrabold">
                  6 DOCS
                </span>
              </h5>
              <p className="text-[10px] text-[var(--text3)]">PRD, Architecture, Rules, Phases, Design, Memory</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={() => {
              onShowToast('Logged out of farm account.');
              onNavigate('s-splash');
            }}
            className="w-full py-2.5 rounded-xl border border-[var(--soil)]/30 text-xs font-bold text-[var(--soil2)] hover:bg-[var(--cream2)] transition-colors"
          >
            ← Logout of Account
          </button>
        </div>
      </div>
    </div>
  );
};

function isConsumer(role: UserRole): boolean {
  return role === 'consumer';
}
