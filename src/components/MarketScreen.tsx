import React, { useState } from 'react';
import { MandiPriceItem, ScreenId } from '../types';
import { MANDI_PRICES } from '../data/agriData';
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Filter,
  X,
  LineChart as LineChartIcon,
  ShieldCheck,
  Calendar,
  Camera
} from 'lucide-react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { MarketPriceTrend } from './MarketPriceTrend';

interface MarketScreenProps {
  onNavigate: (screen: ScreenId) => void;
  onShowToast: (msg: string) => void;
  onOpenOriginModal?: (produceId?: string) => void;
  onOpenQRScanner?: () => void;
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
    return (
      <div className="bg-[var(--soil)] text-[#EDD9B8] p-2.5 rounded-xl text-xs shadow-xl border border-white/20 font-sans">
        <div className="font-bold flex items-center justify-between gap-3 text-[11px] border-b border-white/10 pb-1 mb-1">
          <span>{dataPoint.fullDate} ({label})</span>
          <span className="text-[10px] text-emerald-300">Verified</span>
        </div>
        <div className="space-y-0.5 text-[10px]">
          <div className="flex justify-between items-center gap-2">
            <span className="text-emerald-300 font-bold">Mandi Price:</span>
            <span className="font-serif-soil font-extrabold text-white text-xs">
              ₹{payload[0].value} {unit}
            </span>
          </div>
          {payload[1] && (
            <div className="flex justify-between items-center gap-2 text-amber-200">
              <span>State APMC Avg:</span>
              <span className="font-bold">₹{payload[1].value}</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export const MarketScreen: React.FC<MarketScreenProps> = ({
  onNavigate,
  onShowToast,
  onOpenOriginModal,
  onOpenQRScanner
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'vegetables' | 'grains' | 'fruits'>('all');
  const [selectedCrop, setSelectedCrop] = useState<MandiPriceItem | null>(null);
  const [chartCropId, setChartCropId] = useState<string>('m-1'); // Default to Tomato
  const [selectedMandi, setSelectedMandi] = useState<string>('all');

  const filteredPrices = MANDI_PRICES.filter((item) => {
    const matchCategory = activeTab === 'all' || item.category === activeTab;
    const matchMandi = selectedMandi === 'all' || item.mandi.includes(selectedMandi);
    return matchCategory && matchMandi;
  });

  const activeChartCrop = MANDI_PRICES.find((m) => m.id === chartCropId) || MANDI_PRICES[0];

  const minPrice = Math.min(...activeChartCrop.history.map((h) => h.price));
  const maxPrice = Math.max(...activeChartCrop.history.map((h) => h.price));

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
              📊 Market Prices
            </h2>
            <p className="text-[11px] text-[#EDD9B8]/75 mt-0.5 font-medium">
              Live Mandi Rates · Historical Trends & Forecasts
            </p>
          </div>
          <div className="flex items-center gap-1.5">
            {onOpenQRScanner && (
              <button
                onClick={onOpenQRScanner}
                className="px-2.5 py-1 rounded-xl bg-emerald-500/25 border border-emerald-400/40 text-emerald-300 text-[10px] font-bold flex items-center gap-1 hover:bg-emerald-500/35 transition-transform active:scale-95 shadow-xs"
                title="Scan Physical Produce Tag"
              >
                <Camera className="w-3.5 h-3.5" />
                <span>Scan Tag</span>
              </button>
            )}
            <button
              onClick={() => onOpenOriginModal?.()}
              className="px-2.5 py-1 rounded-xl bg-[rgba(107,191,107,0.2)] border border-[#6BBF6B]/40 text-[#6BBF6B] text-[10px] font-bold flex items-center gap-1 hover:bg-[#6BBF6B]/30 transition-transform active:scale-95"
              title="Trace Produce Origin on Blockchain"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Trace</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-3.5 space-y-3.5">
        {/* Mandi Intelligence Provider Banner & Disclaimer */}
        <div className="bg-emerald-950/40 border border-emerald-600/30 rounded-xl p-2.5 text-[10px] text-emerald-900 dark:text-emerald-200 flex items-start gap-2">
          <span className="text-sm shrink-0">🏛️</span>
          <div>
            <span className="font-bold block text-emerald-800 dark:text-emerald-300">
              Provider: Soil Mates Mandi Intelligence Network (Demonstration Model)
            </span>
            <span>
              Benchmark APMC rates compiled for Madhya Pradesh & Maharashtra mandis. Connect official Agmarknet / e-NAM feeds in production settings.
            </span>
          </div>
        </div>

        {/* RECHARTS HISTORICAL PRICE TRENDS COMPONENT */}
        <MarketPriceTrend
          onSelectCrop={(crop) => {
            setSelectedCrop(crop);
            setChartCropId(crop.id);
          }}
        />

        {/* AI Forecast Banner */}
        <div className="bg-[var(--leaf-pale)] border border-[rgba(45,106,45,0.2)] rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--leaf2)] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
            <span>🤖 AI Price Forecast & Procurement Signals</span>
          </div>

          <div className="space-y-1.5 text-[11px] text-[var(--text2)]">
            <div className="flex justify-between items-center bg-white/60 rounded-lg px-2 py-1">
              <span>🍅 Tomato — demand surging (+18% expected)</span>
              <strong className="text-emerald-700 font-bold">Hold for Peak</strong>
            </div>
            <div className="flex justify-between items-center bg-white/60 rounded-lg px-2 py-1">
              <span>🧅 Onion — high arrivals from Nashik</span>
              <strong className="text-rose-700 font-bold">Sell Now</strong>
            </div>
            <div className="flex justify-between items-center bg-white/60 rounded-lg px-2 py-1">
              <span>🌾 Wheat — strong flour mill booking</span>
              <strong className="text-amber-800 font-bold">Stable Buy</strong>
            </div>
          </div>
        </div>

        {/* Category & Mandi Filter Tabs */}
        <div className="space-y-2">
          {/* Category Chips */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar py-0.5">
            {[
              { id: 'all', label: 'All Items' },
              { id: 'vegetables', label: '🥦 Vegetables' },
              { id: 'grains', label: '🌾 Grains & Pulses' },
              { id: 'fruits', label: '🍎 Fruits' }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                whileTap={{ scale: 0.92 }}
                whileHover={{ scale: 1.03 }}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all flex-shrink-0 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-[var(--soil)] text-[#EDD9B8] shadow-sm'
                    : 'bg-[var(--cream2)] text-[var(--text2)] border border-[var(--border)] hover:bg-[var(--leaf-pale)]'
                }`}
              >
                {tab.label}
              </motion.button>
            ))}
          </div>

          {/* Mandi Selector */}
          <div className="flex items-center gap-2 bg-[var(--cream2)] border border-[var(--border)] rounded-xl px-2.5 py-1.5 text-xs text-[var(--text2)]">
            <Filter className="w-3 h-3 text-[var(--text3)]" />
            <span className="text-[10px] font-bold text-[var(--text3)]">Mandi:</span>
            <select
              value={selectedMandi}
              onChange={(e) => {
                setSelectedMandi(e.target.value);
                onShowToast(`Filtered by ${e.target.value === 'all' ? 'All Mandis' : e.target.value}`);
              }}
              className="bg-transparent text-xs font-bold text-[var(--text)] outline-none flex-1 cursor-pointer"
            >
              <option value="all">All MP Mandis (Karond, Sehore, Vidisha, Indore)</option>
              <option value="Karond">Karond Mandi, Bhopal</option>
              <option value="Sehore">Sehore Mandi</option>
              <option value="Vidisha">Vidisha Mandi</option>
              <option value="Indore">Indore Mandi</option>
            </select>
          </div>
        </div>

        {/* Mandi Rate Board List */}
        <div className="bg-[var(--white)] rounded-2xl p-3 border border-[var(--border)] shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-1 border-b border-[var(--leaf-pale)]">
            <h4 className="font-serif-soil text-xs font-bold text-[var(--text)]">
              Mandi Rate Board ({filteredPrices.length})
            </h4>
            <span className="text-[10px] text-[var(--text3)]">Tap crop for chart & origin</span>
          </div>

          <div className="divide-y divide-[var(--leaf-pale)]">
            {filteredPrices.map((item) => (
              <motion.div
                key={item.id}
                whileTap={{ scale: 0.98 }}
                whileHover={{ scale: 1.01 }}
                onClick={() => {
                  setSelectedCrop(item);
                  setChartCropId(item.id);
                }}
                className="py-2.5 flex items-center justify-between cursor-pointer hover:bg-[var(--leaf-pale)]/30 rounded-lg px-1 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl flex-shrink-0">{item.emoji}</span>
                  <div>
                    <div className="text-xs font-bold text-[var(--text)] flex items-center gap-1.5">
                      <span>{item.crop}</span>
                      {item.demandStatus === 'HIGH' && (
                        <span className="bg-emerald-100 text-emerald-800 text-[8px] font-extrabold px-1 rounded">
                          HIGH DEMAND
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] text-[var(--text3)]">
                      {item.unit} · {item.mandi.split(',')[0]}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-serif-soil text-sm font-extrabold text-[var(--text)]">
                    ₹{item.price}
                  </div>
                  <div
                    className={`text-[10px] font-bold flex items-center justify-end gap-0.5 ${
                      item.changeType === 'up' ? 'text-emerald-700' : 'text-rose-700'
                    }`}
                  >
                    {item.changeType === 'up' ? (
                      <TrendingUp className="w-3 h-3" />
                    ) : (
                      <TrendingDown className="w-3 h-3" />
                    )}
                    <span>
                      {item.changeType === 'up' ? '+' : '-'}
                      {item.changePercent}%
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Sell CTA Strip */}
        <div className="bg-[var(--amber-pale)] border border-[var(--amber)]/20 rounded-2xl p-3 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-xs font-bold text-[var(--amber)]">Have harvest to sell?</div>
            <div className="text-[10px] text-[var(--text3)]">Lock peak rates directly with verified buyers</div>
          </div>
          <button
            onClick={() => onNavigate('s-sell')}
            className="px-3 py-1.5 rounded-xl bg-[var(--soil)] text-[#EDD9B8] text-xs font-bold shadow-sm hover:bg-[var(--soil2)] transition-transform active:scale-95"
          >
            List Now →
          </button>
        </div>

        <div className="h-4"></div>
      </div>

      {/* Interactive Crop Trend & Traceability Modal */}
      {selectedCrop && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-sm bg-[var(--cream)] rounded-2xl p-4 border border-white/30 shadow-2xl space-y-3 animate-in fade-in zoom-in-95 duration-200 max-h-[85vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-3xl">{selectedCrop.emoji}</span>
                <div>
                  <h3 className="font-serif-soil text-base font-bold text-[var(--text)]">
                    {selectedCrop.crop} Market Intelligence
                  </h3>
                  <p className="text-[10px] text-[var(--text3)]">{selectedCrop.mandi}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedCrop(null)}
                className="w-7 h-7 rounded-full bg-[var(--cream2)] text-[var(--soil)] flex items-center justify-center font-bold text-xs"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Price Snapshot */}
            <div className="grid grid-cols-3 gap-2 text-center bg-white rounded-xl p-2.5 border border-[var(--border)]">
              <div>
                <div className="text-[9px] text-[var(--text3)] uppercase">Current Rate</div>
                <div className="font-serif-soil text-base font-extrabold text-[var(--leaf)]">
                  ₹{selectedCrop.price}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-[var(--text3)] uppercase">7-Day High</div>
                <div className="font-serif-soil text-base font-extrabold text-[var(--text)]">
                  ₹{Math.max(...selectedCrop.history.map((h) => h.price))}
                </div>
              </div>
              <div>
                <div className="text-[9px] text-[var(--text3)] uppercase">7-Day Low</div>
                <div className="font-serif-soil text-base font-extrabold text-[var(--text3)]">
                  ₹{Math.min(...selectedCrop.history.map((h) => h.price))}
                </div>
              </div>
            </div>

            {/* Mini Line Chart inside modal */}
            <div className="bg-[var(--cream2)] rounded-xl p-2 border border-[var(--border)]">
              <div className="text-[10px] font-bold text-[var(--text2)] mb-1 flex items-center justify-between">
                <span>7-Day Price Movement</span>
                <span className="text-emerald-700 font-bold">
                  {selectedCrop.changeType === 'up' ? '+' : '-'}
                  {selectedCrop.changePercent}%
                </span>
              </div>
              <div className="h-28 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={selectedCrop.history}
                    margin={{ top: 5, right: 5, left: -25, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="2 2" stroke="rgba(45, 106, 45, 0.15)" />
                    <XAxis dataKey="day" tick={{ fontSize: 9, fill: '#665D4F' }} />
                    <YAxis tick={{ fontSize: 9, fill: '#665D4F' }} domain={['dataMin - 1', 'dataMax + 1']} />
                    <Tooltip content={<CustomTooltip unit={selectedCrop.unit.split('·')[0].trim()} />} />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#2D6A2D"
                      strokeWidth={2}
                      dot={{ r: 2.5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recommendation Note */}
            <div className="bg-[var(--leaf-pale)] border border-[var(--leaf2)]/30 rounded-xl p-2.5 text-xs text-[var(--leaf2)]">
              <strong>Mandi Intelligence:</strong> {selectedCrop.trendNote}. Recommendation is to{' '}
              {selectedCrop.changeType === 'up' ? 'hold for peak prices' : 'sell lot immediately'}.
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  setSelectedCrop(null);
                  onOpenOriginModal?.();
                }}
                className="w-full py-2.5 rounded-xl text-xs font-bold bg-[var(--leaf)] text-white shadow-xs flex items-center justify-center gap-1.5 transition-transform active:scale-95"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>View Blockchain Traceability Journey →</span>
              </button>

              <button
                onClick={() => {
                  setSelectedCrop(null);
                  onNavigate('s-sell');
                }}
                className="w-full py-2 rounded-xl text-xs font-bold text-[#EDD9B8] shadow-sm"
                style={{ backgroundColor: 'var(--soil)' }}
              >
                List {selectedCrop.crop} for Sale
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
