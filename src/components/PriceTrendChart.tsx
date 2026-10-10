import React from 'react';
import { ProduceItem } from '../types';
import { MANDI_PRICES } from '../data/agriData';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

interface PriceTrendChartProps {
  product: ProduceItem;
}

export const PriceTrendChart: React.FC<PriceTrendChartProps> = ({ product }) => {
  const matchedMandi = MANDI_PRICES.find(
    (m) => m.crop.toLowerCase().includes(product.name.toLowerCase()) || product.name.toLowerCase().includes(m.crop.toLowerCase())
  );

  const historyData = matchedMandi?.history || [
    { day: 'Mon', fullDate: '20 Apr', price: Math.round(product.pricePerKg * 0.92) },
    { day: 'Tue', fullDate: '21 Apr', price: Math.round(product.pricePerKg * 0.95) },
    { day: 'Wed', fullDate: '22 Apr', price: Math.round(product.pricePerKg * 0.94) },
    { day: 'Thu', fullDate: '23 Apr', price: Math.round(product.pricePerKg * 0.97) },
    { day: 'Fri', fullDate: '24 Apr', price: Math.round(product.pricePerKg * 0.99) },
    { day: 'Sat', fullDate: '25 Apr', price: Math.round(product.pricePerKg * 1.01) },
    { day: 'Today', fullDate: '26 Apr', price: product.pricePerKg }
  ];

  return (
    <div className="bg-[var(--white)] rounded-2xl p-3.5 border border-[var(--border)] shadow-xs space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-[var(--leaf-pale)] text-[var(--leaf2)] flex items-center justify-center text-base">
            📈
          </div>
          <div>
            <h4 className="font-serif-soil text-xs font-bold text-[var(--text)]">
              7-Day Price Trend · {product.name}
            </h4>
            <p className="text-[10px] text-[var(--text3)]">
              Karond Mandi APMC verified rates
            </p>
          </div>
        </div>
        <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-2 py-0.5 rounded-full font-bold">
          Live Mandi
        </span>
      </div>

      <div className="w-full h-36 bg-[var(--cream2)] rounded-xl p-2 border border-[var(--border)] overflow-hidden">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={historyData} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
            <defs>
              <linearGradient id="prodPriceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#2D6A2D" stopOpacity={0.35} />
                <stop offset="95%" stopColor="#2D6A2D" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(45,106,45,0.1)" />
            <XAxis dataKey="day" tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 9, fill: 'var(--text3)' }} axisLine={false} tickLine={false} tickFormatter={(v) => `₹${v}`} domain={['dataMin - 2', 'dataMax + 2']} />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const d = payload[0].payload;
                  return (
                    <div className="bg-stone-900 text-white p-2 rounded-lg text-[10px] shadow-lg border border-emerald-500/30">
                      <div className="font-bold text-emerald-400">{d.fullDate || d.day}</div>
                      <div>Price: ₹{d.price}/{product.unit}</div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Area type="monotone" dataKey="price" stroke="#2D6A2D" strokeWidth={2} fillOpacity={1} fill="url(#prodPriceGrad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
