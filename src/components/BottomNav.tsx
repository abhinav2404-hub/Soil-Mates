import React from 'react';
import { ScreenId, UserRole } from '../types';

interface BottomNavProps {
  currentScreen: ScreenId;
  userRole: UserRole;
  onNavigate: (screen: ScreenId) => void;
  onOpenSupport: () => void;
  ordersCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  currentScreen,
  userRole,
  onNavigate,
  onOpenSupport,
  ordersCount = 3
}) => {
  // Screens where bottom nav shouldn't show (splash, login, full result, track detail)
  if (currentScreen === 's-splash' || currentScreen === 's-login') {
    return null;
  }

  const isVendor = userRole === 'vendor';

  return (
    <div
      className="h-16 flex items-center justify-around flex-shrink-0 border-t border-[rgba(237,217,184,0.15)] select-none z-20"
      style={{ backgroundColor: 'var(--soil)' }}
    >
      {isVendor ? (
        <>
          <button
            onClick={() => onNavigate('s-vendor')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">🏪</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-vendor' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              VENDOR
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-market')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">📊</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-market' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              PRICES
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-sell')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">🧾</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-sell' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              LIST
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-orders')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95 relative"
          >
            <span className="text-xl">📦</span>
            {ordersCount > 0 && (
              <span className="absolute top-1 right-[30%] w-3.5 h-3.5 rounded-full bg-amber-500 text-[8px] font-extrabold text-white flex items-center justify-center">
                {ordersCount}
              </span>
            )}
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-orders' || currentScreen === 's-track' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              ORDERS
            </span>
          </button>

          <button
            onClick={onOpenSupport}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">📞</span>
            <span className="text-[10px] font-bold tracking-wider text-[#EDD9B8]/50">
              HELP
            </span>
          </button>
        </>
      ) : userRole === 'farmer' ? (
        <>
          <button
            onClick={() => onNavigate('s-farmer')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">👨‍🌾</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-farmer' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              FARM HUB
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-ai')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">🔬</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-ai' || currentScreen === 's-result' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              AI DOCTOR
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-market')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">📊</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-market' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              MANDI
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-sell')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">📸</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-sell' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              AI SELL
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-home')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95 relative"
          >
            <span className="text-xl">🛒</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-home' || currentScreen === 's-buy' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              MARKET
            </span>
          </button>
        </>
      ) : (
        <>
          <button
            onClick={() => onNavigate('s-home')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">🏠</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-home' || currentScreen === 's-buy' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              HOME
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-ai')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">🔬</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-ai' || currentScreen === 's-result' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              AI DOCTOR
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-market')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">📊</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-market' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              PRICES
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-sell')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95"
          >
            <span className="text-xl">🌱</span>
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-sell' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              SELL
            </span>
          </button>

          <button
            onClick={() => onNavigate('s-orders')}
            className="flex-1 py-1.5 flex flex-col items-center gap-0.5 transition-transform active:scale-95 relative"
          >
            <span className="text-xl">📦</span>
            {ordersCount > 0 && (
              <span className="absolute top-1 right-[30%] w-3.5 h-3.5 rounded-full bg-emerald-500 text-[8px] font-extrabold text-white flex items-center justify-center">
                {ordersCount}
              </span>
            )}
            <span
              className={`text-[10px] font-bold tracking-wider ${
                currentScreen === 's-orders' || currentScreen === 's-track' ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
              }`}
            >
              ORDERS
            </span>
          </button>
        </>
      )}
    </div>
  );
};
