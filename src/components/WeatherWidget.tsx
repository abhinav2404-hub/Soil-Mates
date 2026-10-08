import React, { useState } from 'react';
import { CloudRain, Droplets, Thermometer, Wind, Sun, AlertCircle } from 'lucide-react';

interface WeatherData {
  city: string;
  temp: number;
  condition: string;
  humidity: number;
  rainProbability: number;
  windSpeed: number;
  advice: string;
  irrigationWindow: string;
}

const LOCATIONS: WeatherData[] = [
  {
    city: 'Vidisha / Sonpur, MP',
    temp: 29,
    condition: 'Sunny & Clear',
    humidity: 58,
    rainProbability: 12,
    windSpeed: 11,
    advice: 'Clear skies. Favorable for morning pesticide spraying and wheat drying.',
    irrigationWindow: 'Optimal: 6 PM - 8 PM (Low evaporation)'
  },
  {
    city: 'Bhopal Rural, MP',
    temp: 28,
    condition: 'Partly Cloudy',
    humidity: 65,
    rainProbability: 25,
    windSpeed: 14,
    advice: 'Mild humidity. Good time for transplanting nursery saplings into open fields.',
    irrigationWindow: 'Optimal: Early morning drip'
  },
  {
    city: 'Sehore Mandi Hub, MP',
    temp: 31,
    condition: 'Sunny',
    humidity: 52,
    rainProbability: 8,
    windSpeed: 9,
    advice: 'Dry hot winds expected in afternoon. Keep harvested produce shaded.',
    irrigationWindow: 'Optimal: Drip irrigation active'
  },
  {
    city: 'Indore APMC, MP',
    temp: 30,
    condition: 'Mostly Sunny',
    humidity: 55,
    rainProbability: 15,
    windSpeed: 12,
    advice: 'Stable harvest weather. Safe to transport uncovered grain trolleys.',
    irrigationWindow: 'Optimal: Evening cycle'
  }
];

export const WeatherWidget: React.FC = () => {
  const [selectedLocationIndex, setSelectedLocationIndex] = useState(0);
  const data = LOCATIONS[selectedLocationIndex];

  return (
    <div className="mx-4 my-3 p-3.5 rounded-2xl bg-gradient-to-br from-emerald-800 via-emerald-900 to-stone-900 text-white shadow-lg border border-emerald-700/40 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Header with Location Dropdown */}
      <div className="flex items-center justify-between gap-2 mb-2.5">
        <div className="flex items-center gap-1.5">
          <Sun className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '18s' }} />
          <span className="text-xs font-semibold uppercase tracking-wider text-emerald-200">
            Agri Weather & Irrigation Advisory
          </span>
        </div>
        <select
          value={selectedLocationIndex}
          onChange={(e) => setSelectedLocationIndex(Number(e.target.value))}
          className="text-[11px] bg-emerald-950/80 border border-emerald-600/40 text-emerald-100 rounded-lg px-2 py-0.5 outline-none font-medium cursor-pointer"
        >
          {LOCATIONS.map((loc, i) => (
            <option key={loc.city} value={i} className="bg-stone-900 text-white">
              {loc.city}
            </option>
          ))}
        </select>
      </div>

      {/* Main Metrics Row */}
      <div className="grid grid-cols-4 gap-2 py-1.5 border-y border-emerald-700/30 text-center">
        {/* Temperature */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5 text-stone-300 text-[10px]">
            <Thermometer className="w-3 h-3 text-amber-400" /> Temp
          </div>
          <span className="text-base font-extrabold text-white mt-0.5">{data.temp}°C</span>
          <span className="text-[9px] text-emerald-300/80 leading-tight">{data.condition}</span>
        </div>

        {/* Humidity */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5 text-stone-300 text-[10px]">
            <Droplets className="w-3 h-3 text-cyan-400" /> Humidity
          </div>
          <span className="text-base font-extrabold text-cyan-200 mt-0.5">{data.humidity}%</span>
          <span className="text-[9px] text-cyan-300/80 leading-tight">Normal</span>
        </div>

        {/* Rain Probability */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5 text-stone-300 text-[10px]">
            <CloudRain className="w-3 h-3 text-blue-400" /> Rain Prob.
          </div>
          <span className="text-base font-extrabold text-blue-200 mt-0.5">{data.rainProbability}%</span>
          <span className="text-[9px] text-blue-300/80 leading-tight">Low Risk</span>
        </div>

        {/* Wind Speed */}
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-0.5 text-stone-300 text-[10px]">
            <Wind className="w-3 h-3 text-teal-300" /> Wind
          </div>
          <span className="text-base font-extrabold text-teal-200 mt-0.5">{data.windSpeed} km/h</span>
          <span className="text-[9px] text-teal-300/80 leading-tight">Gentle Breeze</span>
        </div>
      </div>

      {/* Advisory & Irrigation Guidance */}
      <div className="mt-2.5 flex items-start gap-2 bg-emerald-950/60 p-2 rounded-xl border border-emerald-700/20 text-[11px] leading-relaxed">
        <AlertCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <p className="text-emerald-100 font-medium">{data.advice}</p>
          <p className="text-emerald-300/90 text-[10px] mt-0.5 font-semibold">
            💧 Irrigation Window: {data.irrigationWindow}
          </p>
        </div>
      </div>
    </div>
  );
};
