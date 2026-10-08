import React from 'react';
import { ScreenId, UserRole } from '../types';
import { motion } from 'framer-motion';

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
  // Screens where bottom nav shouldn't show (splash, login)
  if (currentScreen === 's-splash' || currentScreen === 's-login') {
    return null;
  }

  const isVendor = userRole === 'vendor';

  const NavItem = ({
    target,
    icon,
    label,
    badge,
    isActive
  }: {
    target: ScreenId;
    icon: string;
    label: string;
    badge?: number;
    isActive: boolean;
  }) => (
    <motion.button
      whileTap={{ scale: 0.88 }}
      whileHover={{ scale: 1.05 }}
      onClick={() => onNavigate(target)}
      className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 cursor-pointer select-none relative"
    >
      <span className="text-xl leading-none transition-transform duration-150">
        {icon}
      </span>
      {badge !== undefined && badge > 0 && (
        <span className="absolute top-1 right-[28%] w-3.5 h-3.5 rounded-full bg-emerald-500 text-[8px] font-black text-white flex items-center justify-center shadow-xs">
          {badge}
        </span>
      )}
      <span
        className={`text-[9px] font-extrabold tracking-wider transition-colors duration-150 ${
          isActive ? 'text-[#6BBF6B]' : 'text-[#EDD9B8]/50'
        }`}
      >
        {label}
      </span>
      {isActive && (
        <motion.div
          layoutId="bottomNavDot"
          className="w-1 h-1 rounded-full bg-[#6BBF6B] mt-0.5"
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );

  return (
    <div
      className="h-16 flex items-center justify-around flex-shrink-0 border-t border-[rgba(237,217,184,0.15)] select-none z-20"
      style={{ backgroundColor: 'var(--soil)' }}
    >
      {userRole === 'admin' ? (
        <>
          <NavItem
            target="s-admin"
            icon="🛡️"
            label="ADMIN"
            isActive={currentScreen === 's-admin'}
          />
          <NavItem
            target="s-home"
            icon="🛒"
            label="MARKET"
            isActive={currentScreen === 's-home' || currentScreen === 's-buy'}
          />
          <NavItem
            target="s-market"
            icon="📊"
            label="PRICES"
            isActive={currentScreen === 's-market'}
          />
          <NavItem
            target="s-orders"
            icon="📦"
            label="ORDERS"
            badge={ordersCount}
            isActive={currentScreen === 's-orders' || currentScreen === 's-track'}
          />
          <NavItem
            target="s-ai"
            icon="🔬"
            label="AI DOCTOR"
            isActive={currentScreen === 's-ai' || currentScreen === 's-result'}
          />
        </>
      ) : isVendor ? (
        <>
          <NavItem
            target="s-vendor"
            icon="🏪"
            label="VENDOR"
            isActive={currentScreen === 's-vendor'}
          />
          <NavItem
            target="s-market"
            icon="📊"
            label="PRICES"
            isActive={currentScreen === 's-market'}
          />
          <NavItem
            target="s-sell"
            icon="🧾"
            label="LIST"
            isActive={currentScreen === 's-sell'}
          />
          <NavItem
            target="s-orders"
            icon="📦"
            label="ORDERS"
            badge={ordersCount}
            isActive={currentScreen === 's-orders' || currentScreen === 's-track'}
          />
          <motion.button
            whileTap={{ scale: 0.88 }}
            whileHover={{ scale: 1.05 }}
            onClick={onOpenSupport}
            className="flex-1 py-1.5 flex flex-col items-center justify-center gap-0.5 cursor-pointer"
          >
            <span className="text-xl leading-none">📞</span>
            <span className="text-[9px] font-extrabold tracking-wider text-[#EDD9B8]/50">
              HELP
            </span>
          </motion.button>
        </>
      ) : userRole === 'farmer' ? (
        <>
          <NavItem
            target="s-farmer"
            icon="👨‍🌾"
            label="FARM HUB"
            isActive={currentScreen === 's-farmer'}
          />
          <NavItem
            target="s-ai"
            icon="🔬"
            label="AI DOCTOR"
            isActive={currentScreen === 's-ai' || currentScreen === 's-result'}
          />
          <NavItem
            target="s-market"
            icon="📊"
            label="MANDI"
            isActive={currentScreen === 's-market'}
          />
          <NavItem
            target="s-sell"
            icon="📸"
            label="AI SELL"
            isActive={currentScreen === 's-sell'}
          />
          <NavItem
            target="s-home"
            icon="🛒"
            label="MARKET"
            isActive={currentScreen === 's-home' || currentScreen === 's-buy'}
          />
        </>
      ) : (
        <>
          <NavItem
            target="s-home"
            icon="🏠"
            label="HOME"
            isActive={currentScreen === 's-home' || currentScreen === 's-buy'}
          />
          <NavItem
            target="s-ai"
            icon="🔬"
            label="AI DOCTOR"
            isActive={currentScreen === 's-ai' || currentScreen === 's-result'}
          />
          <NavItem
            target="s-market"
            icon="📊"
            label="PRICES"
            isActive={currentScreen === 's-market'}
          />
          <NavItem
            target="s-sell"
            icon="🌱"
            label="SELL"
            isActive={currentScreen === 's-sell'}
          />
          <NavItem
            target="s-orders"
            icon="📦"
            label="ORDERS"
            badge={ordersCount}
            isActive={currentScreen === 's-orders' || currentScreen === 's-track'}
          />
        </>
      )}
    </div>
  );
};
