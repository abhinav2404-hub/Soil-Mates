import React from 'react';
import { ScreenId, UserRole, SupportedLanguage } from '../types';
import { ChevronRight, Fingerprint } from 'lucide-react';
import { biometricService } from '../services/biometricService';

interface ProfileScreenProps {
  userRole: UserRole;
  isDarkMode: boolean;
  currentLanguage: SupportedLanguage;
  onToggleDarkMode: () => void;
  onOpenLanguage: () => void;
  onOpenSupport: () => void;
  onOpenInstallModal?: () => void;
  onOpenYieldCalculator?: () => void;
  onOpenMaterialLister?: () => void;
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
  onOpenInstallModal,
  onOpenYieldCalculator,
  onOpenMaterialLister,
  onNavigate,
  onShowToast
}) => {
  const isAdmin = userRole === 'admin';
  const isFarmer = userRole === 'farmer';
  const isVendor = userRole === 'vendor';

  const name = isAdmin
    ? 'Soil Mates Operations Admin'
    : isVendor
    ? 'Bhopal Fresh Mart'
    : isFarmer
    ? 'Ramesh Patel'
    : 'Priya Sharma';

  const location = isAdmin
    ? 'Soil Mates Platform HQ, Bhopal'
    : isVendor
    ? 'Karond Mandi, Bhopal'
    : isFarmer
    ? 'Vidisha, Madhya Pradesh'
    : 'Arera Colony, Bhopal';

  const badgeText = isAdmin
    ? '🛡️ Platform Administrator · Level 1'
    : isVendor
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
          className="p-5 flex items-center gap-3.5 flex-shrink-0 text-white relative"
          style={{ backgroundColor: 'var(--soil)' }}
        >
          <div className="relative group cursor-pointer" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = 'image/*';
            input.onchange = (e: any) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (evt) => {
                  const url = evt.target?.result as string;
                  localStorage.setItem(`soilMatesAvatar_${userRole}`, url);
                  onShowToast('✨ Profile picture updated successfully!');
                  window.location.reload();
                };
                reader.readAsDataURL(file);
              }
            };
            input.click();
          }}>
            <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-[#6BBF6B] shadow-md flex-shrink-0 bg-stone-800 relative">
              <img
                src={localStorage.getItem(`soilMatesAvatar_${userRole}`) || (isFarmer ? '/src/assets/images/farmer_profile_portrait_1791568889913.jpg' : '/src/assets/images/fresh_mandi_produce_1791568878402.jpg')}
                alt={name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-[10px] font-bold text-white">
                Edit 📷
              </div>
            </div>
          </div>

          <div className="flex-1">
            <h3 className="font-serif-soil text-lg font-bold text-white flex items-center gap-2">
              <span>{name}</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full font-normal">Tap avatar to change photo</span>
            </h3>
            <p className="text-[11px] text-stone-200 mt-0.5 font-medium">📍 {location}</p>
            <div className="mt-1.5 inline-block bg-white/20 rounded-md px-2 py-0.5 text-[9px] text-[#6BBF6B] font-bold">
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
          {/* Farmer Logistics Command Center */}
          {isFarmer && (
            <div
              onClick={() => onNavigate('s-farmer')}
              className="p-3.5 flex items-center gap-3 cursor-pointer bg-emerald-50/50 hover:bg-emerald-100/50 transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center text-lg flex-shrink-0">
                🚚
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <span>Farmer Logistics & Delivery Boy Hub</span>
                  <span className="text-[9px] bg-emerald-600 text-white px-1.5 py-0.2 rounded font-extrabold">
                    ACTIVE
                  </span>
                </h5>
                <p className="text-[10px] text-emerald-800">Track rider coming to farm, OTP handover & destination</p>
              </div>
              <ChevronRight className="w-4 h-4 text-emerald-600" />
            </div>
          )}

          {/* AI Yield & Price Prediction Calculator */}
          {isFarmer && onOpenYieldCalculator && (
            <div
              onClick={onOpenYieldCalculator}
              className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center text-lg flex-shrink-0">
                🔮
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                  <span>AI Yield & Mandi Price Predictor</span>
                  <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold">
                    CALCULATOR
                  </span>
                </h5>
                <p className="text-[10px] text-[var(--text3)]">Acreage & variety based harvest volume & price forecast</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
            </div>
          )}

          {/* List Food Items & Farm Materials */}
          {isFarmer && onOpenMaterialLister && (
            <div
              onClick={onOpenMaterialLister}
              className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
            >
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-900 flex items-center justify-center text-lg flex-shrink-0">
                🧺
              </div>
              <div className="flex-1">
                <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                  <span>List Food Items & Farm Materials</span>
                  <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1.5 py-0.2 rounded font-bold">
                    MARKET
                  </span>
                </h5>
                <p className="text-[10px] text-[var(--text3)]">A2 milk, bilona ghee, chakki flour, bhoosa fodder & compost</p>
              </div>
              <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
            </div>
          )}

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

          {/* 10% Mandi Price Change Notification Toggle */}
          <div
            onClick={() => {
              const current = localStorage.getItem('soilMatesPriceAlert10Percent') === '1';
              const next = !current;
              localStorage.setItem('soilMatesPriceAlert10Percent', next ? '1' : '0');
              onShowToast(
                next
                  ? '🔔 10% Mandi Price Alert ON! You will get instant alerts when favorite crop prices change by >10%.'
                  : '🔕 10% Mandi Price Alert turned off.'
              );
              // Force state refresh
              window.dispatchEvent(new Event('storage'));
            }}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--amber-pale)] flex items-center justify-center text-lg flex-shrink-0">
              🔔
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <span>10% Mandi Price Change Alert</span>
                <span className="bg-amber-200 text-amber-900 text-[8px] px-1.5 py-0.2 rounded font-extrabold">
                  NOTIFICATIONS
                </span>
              </h5>
              <p className="text-[10px] text-[var(--text3)]">
                Alert when favorite crop mandi prices shift by &gt;10%
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-[var(--text3)]">
                {localStorage.getItem('soilMatesPriceAlert10Percent') !== '0' ? 'ON' : 'OFF'}
              </span>
              <div
                className={`w-11 h-6 rounded-full border transition-colors relative ${
                  localStorage.getItem('soilMatesPriceAlert10Percent') !== '0'
                    ? 'bg-amber-500 border-amber-600'
                    : 'bg-[var(--cream2)] border-[var(--border)]'
                }`}
              >
                <div
                  className={`w-4 h-4 rounded-full transition-transform absolute top-0.5 ${
                    localStorage.getItem('soilMatesPriceAlert10Percent') !== '0'
                      ? 'translate-x-5 bg-white'
                      : 'translate-x-0.5 bg-[var(--soil3)]'
                  }`}
                />
              </div>
            </div>
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

          {/* Biometric Security */}
          <div
            onClick={async () => {
              const status = await biometricService.checkAvailability();
              if (status.isAvailable) {
                const verified = await biometricService.authenticate(
                  `Verify ${status.typeName} to manage Soil Mates security`
                );
                if (verified) {
                  onShowToast(`✅ ${status.typeName} verified and active on this device`);
                } else {
                  onShowToast('Biometric prompt closed');
                }
              } else {
                onShowToast('Biometrics not available on this device');
              }
            }}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors border-b border-[var(--border)]"
          >
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center text-base flex-shrink-0 shadow-xs">
              <Fingerprint className="w-4 h-4 text-white" />
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                <span>Biometric Security (Fingerprint / Face)</span>
                <span className="bg-emerald-600 text-white text-[8px] px-1.5 py-0.2 rounded font-extrabold">
                  ENABLED
                </span>
              </h5>
              <p className="text-[10px] text-[var(--text3)]">1-tap biometric login & Android Keystore protection</p>
            </div>
            <ChevronRight className="w-4 h-4 text-[var(--text3)]" />
          </div>

          {/* Admin Command Center */}
          <div
            onClick={() => onNavigate('s-admin')}
            className="p-3.5 flex items-center gap-3 cursor-pointer hover:bg-[var(--cream2)] transition-colors bg-purple-500/10 dark:bg-purple-950/30 border-b border-purple-500/20"
          >
            <div className="w-8 h-8 rounded-lg bg-purple-700 text-white flex items-center justify-center text-base flex-shrink-0 shadow-xs">
              🛡️
            </div>
            <div className="flex-1">
              <h5 className="text-xs font-bold text-purple-950 dark:text-purple-200 flex items-center gap-1.5">
                <span>Admin Command Center</span>
                <span className="bg-purple-600 text-white text-[8px] px-1.5 py-0.2 rounded font-extrabold">
                  GOVERNANCE
                </span>
              </h5>
              <p className="text-[10px] text-purple-800 dark:text-purple-300">Live platform metrics, user directory, system health</p>
            </div>
            <ChevronRight className="w-4 h-4 text-purple-700 dark:text-purple-400" />
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-4">
          <button
            onClick={() => {
              localStorage.removeItem('soilMatesToken');
              localStorage.removeItem('soilMatesUser');
              onShowToast('Logged out of farm account.');
              onNavigate('s-login');
            }}
            className="w-full py-2.5 rounded-xl border border-[var(--border)] bg-[var(--white)] text-xs font-bold text-[var(--soil2)] hover:bg-[var(--cream2)] shadow-xs transition-colors cursor-pointer"
          >
            ← Logout of Account
          </button>
        </div>
      </div>
    </div>
  );
};

function isConsumer(role: UserRole): boolean {
  return role === 'consumer' || role === 'buyer';
}
