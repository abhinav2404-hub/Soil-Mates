import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import { MANDI_PRICES } from '../data/agriData';
import { MandiPriceItem } from '../types';

export function useMarketRates() {
  const [rates, setRates] = useState<MandiPriceItem[]>(MANDI_PRICES);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [provider, setProvider] = useState<string>('Soil Mates APMC Mandi Network');
  const [disclaimer, setDisclaimer] = useState<string>('Demonstration and sample APMC mandi benchmark rates.');
  const [error, setError] = useState<string | null>(null);

  const fetchRates = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getMarketRates();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        setProvider(res.provider || 'Soil Mates Indian Mandi Network');
        setDisclaimer(res.disclaimer || 'Sample APMC mandi rates');

        // Map backend market data to MandiPriceItem
        const mapped: MandiPriceItem[] = res.data.map((r: any, idx: number) => ({
          id: r.id || r._id || `rate-${idx}`,
          crop: r.commodity,
          emoji: r.emoji || '🌾',
          category: r.category || 'grains',
          unit: r.unit || 'quintal',
          price: r.price,
          changePercent: Math.abs(r.changePercent || 0),
          changeType: (r.changePercent || 0) >= 0 ? 'up' : 'down',
          trendNote: r.trend === 'up' ? `High demand in ${r.mandi}` : `Heavy arrivals in ${r.mandi}`,
          mandi: r.mandi,
          demandStatus: r.demandStatus || 'STABLE',
          history: (r.history || []).map((h: any) => ({
            day: h.day || 'Day',
            fullDate: 'This Week',
            price: h.price,
            mandiAverage: h.price * 0.98
          }))
        }));
        setRates(mapped);
      } else {
        setRates(MANDI_PRICES);
      }
    } catch (err: any) {
      console.warn('[useMarketRates] API note:', err.message);
      setError(err.message);
      setRates(MANDI_PRICES);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchRates();
  }, [fetchRates]);

  return {
    rates,
    isLoading,
    provider,
    disclaimer,
    error,
    refetch: fetchRates
  };
}
