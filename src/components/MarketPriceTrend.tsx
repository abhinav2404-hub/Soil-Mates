import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Area,
  AreaChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import {
  TrendingUp,
  TrendingDown,
  LineChart as LineChartIcon,
  Sparkles,
  Calendar,
  Layers,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { MANDI_PRICES } from '../data/agriData';
import { MandiPriceItem } from '../types';

interface MarketPriceTrendProps {
  onSelectCrop?: (crop: MandiPriceItem) => void;
  className?: string;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
  unit?: string;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload, label, unit }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    const priceVal = payload[0].value;
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 5 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="bg-stone-900/95 text-stone-100 p-2.5 rounded-xl text-xs shadow-2xl border border-emerald-500/30 backdrop-blur-md"
      >
        <div className="font-bold flex items-center justify-between gap-3 text-[11px] border-b border-stone-800 pb-1 mb-1">
          <span className="text-emerald-400 flex items-center gap-1">
            <Calendar className="w-3 h-3" />
            {dataPoint.fullDate || label}
          </span>
          <span className="text-[9px] bg-emerald-500/20 text-emerald-300 px-1 py-0.2 rounded font-bold">
            Verified Mandi
          </span>
        </div>
        <div className="space-y-1 text-[11px]">
          <div className="flex justify-between items-center gap-3">
            <span className="text-stone-300">Arrival Price:</span>
            <span className="font-bold text-white text-xs">
              ₹{priceVal} {unit || '/kg'}
            </span>
          </div>
          {dataPoint.mandiAvg && (
            <div className="flex justify-between items-center gap-3 text-stone-400 text-[10px]">
              <span>State APMC:</span>
              <span>₹{dataPoint.mandiAvg}</span>
            </div>
          )}
        </div>
      </motion.div>
    );
  }
  return null;
};

export const MarketPriceTrend: React.FC<MarketPriceTrendProps> = ({ onSelectCrop, className = '' }) => {
  const [selectedCropId, setSelectedCropId] = useState<string>('m-1');
  const [chartView, setChartView] = useState<'line' | 'area'>('area');

  const activeCrop = MANDI_PRICES.find((m) => m.id === selectedCropId) || MANDI_PRICES[0];
  const historyData = activeCrop.history || [];

  const prices = historyData.map((h) => h.price);
  const minPrice = prices.length ? Math.min(...prices) : 0;
  const maxPrice = prices.length ? Math.max(...prices) : 0;
  const isUp = activeCrop.changeType === 'up';

  const handleChooseCrop = (crop: MandiPriceItem) => {
    setSelectedCropId(crop.id);
    onSelectCrop?.(crop);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={`bg-white dark:bg-stone-900 rounded-3xl p-4 border border-[var(--border)] shadow-xs space-y-3.5 ${className}`}
    >
      {/* Component Title & Metric Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center text-lg shadow-xs border border-emerald-500/20">
            <LineChartIcon className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-serif-soil text-sm sm:text-base font-bold text-[var(--text)]">
                Market Price Trend
              </h3>
              <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded font-extrabold">
                7-DAY LIVE
              </span>
            </div>
            <p className="text-[11px] text-[var(--text3)]">
              {activeCrop.crop} · {activeCrop.mandi.split(',')[0]}
            </p>
          </div>
        </div>

        {/* Current Rate & 7-Day Change Badge */}
        <div className="text-right">
          <div className="font-serif-soil text-lg font-black text-[var(--leaf)] leading-none">
            ₹{activeCrop.price}
            <span className="text-[10px] font-normal text-[var(--text3)] ml-0.5">
              {activeCrop.unit.split('·')[0].trim()}
            </span>
          </div>
          <div
            className={`inline-flex items-center gap-0.5 text-[10px] font-extrabold mt-0.5 px-1.5 py-0.2 rounded-full ${
              isUp
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400'
                : 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400'
            }`}
          >
            {isUp ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
            <span>{isUp ? '+' : '-'}{activeCrop.changePercent}% (7 Days)</span>
          </div>
        </div>
      </div>

      {/* Commodity Selector Pills with Framer Motion Bounce */}
      <div className="flex gap-1.5 overflow-x-auto no-scrollbar py-0.5">
        {MANDI_PRICES.slice(0, 6).map((crop) => {
          const isSelected = crop.id === selectedCropId;
          return (
            <motion.button
              key={crop.id}
              whileTap={{ scale: 0.93 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => handleChooseCrop(crop)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 cursor-pointer select-none ${
                isSelected
                  ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-md ring-2 ring-emerald-500/30'
                  : 'bg-[var(--cream2)] text-[var(--text2)] border border-[var(--border)] hover:bg-white'
              }`}
            >
              <span className="text-sm">{crop.emoji}</span>
              <span>{crop.crop}</span>
              {isSelected && (
                <motion.span
                  layoutId="activeCropDot"
                  className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-0.5"
                />
              )}
            </motion.button>
          );
        })}
      </div>

      {/* Recharts Visual Trend Chart */}
      <div className="w-full h-48 bg-gradient-to-b from-[var(--cream2)] to-white dark:from-stone-800/40 dark:to-stone-900 rounded-2xl p-2.5 border border-[var(--border)] relative overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historyData} margin={{ top: 12, right: 10, left: -22, bottom: 0 }}>
            <defs>
              <linearGradient id="mandiPriceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isUp ? '#2D6A2D' : '#D9534F'} stopOpacity={0.4} />
                <stop offset="95%" stopColor={isUp ? '#2D6A2D' : '#D9534F'} stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="rgba(45, 106, 45, 0.12)"
            />
            <XAxis
              dataKey="day"
              tick={{ fontSize: 10, fill: '#776D5D' }}
              axisLine={{ stroke: '#DDD0BC' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: '#776D5D' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={(val) => `₹${val}`}
              domain={['dataMin - 2', 'dataMax + 2']}
            />
            <Tooltip content={<CustomTooltip unit={activeCrop.unit.split('·')[0].trim()} />} />
            <Area
              type="monotone"
              dataKey="price"
              stroke={isUp ? '#2D6A2D' : '#C53030'}
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#mandiPriceGrad)"
              activeDot={{
                r: 6,
                fill: isUp ? '#2D6A2D' : '#C53030',
                stroke: '#FFFFFF',
                strokeWidth: 2
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* 7-Day Stats Footer: Min, Max & Arrival Volume */}
      <div className="grid grid-cols-3 gap-2 pt-0.5">
        <div className="p-2 rounded-xl bg-[var(--cream2)] text-center border border-[var(--border)]/60">
          <span className="text-[9px] text-[var(--text3)] uppercase block font-semibold">
            7-Day Low
          </span>
          <span className="text-xs font-bold text-rose-700 dark:text-rose-400">
            ₹{minPrice}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-[var(--cream2)] text-center border border-[var(--border)]/60">
          <span className="text-[9px] text-[var(--text3)] uppercase block font-semibold">
            7-Day High
          </span>
          <span className="text-xs font-bold text-emerald-700 dark:text-emerald-400">
            ₹{maxPrice}
          </span>
        </div>
        <div className="p-2 rounded-xl bg-[var(--cream2)] text-center border border-[var(--border)]/60">
          <span className="text-[9px] text-[var(--text3)] uppercase block font-semibold">
            Market Demand
          </span>
          <span className="text-xs font-bold text-[var(--soil)]">
            {activeCrop.demandStatus}
          </span>
        </div>
      </div>
    </motion.div>
  );
};
