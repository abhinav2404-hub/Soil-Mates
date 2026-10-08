import { Request, Response } from 'express';
import { store } from '../models/store';

// Mandi Data Provider Abstraction Interface
export interface IMandiDataProvider {
  name: string;
  isRealTime: boolean;
  fetchRates(): Promise<any[]>;
}

// Sample APMC Mandi Provider
class SampleAgriMandiProvider implements IMandiDataProvider {
  name = 'Soil Mates Indian Mandi Intelligence Network (Demonstration Provider)';
  isRealTime = false;

  async fetchRates(): Promise<any[]> {
    return await store.listMarketRates();
  }
}

const activeProvider: IMandiDataProvider = new SampleAgriMandiProvider();

export async function getMarketRates(req: Request, res: Response) {
  try {
    const rates = await activeProvider.fetchRates();

    res.json({
      success: true,
      provider: activeProvider.name,
      isRealTime: activeProvider.isRealTime,
      disclaimer: activeProvider.isRealTime
        ? 'Verified live APMC feed.'
        : 'Demonstration and sample APMC mandi benchmark rates. Connect Agmarknet / e-NAM API for live state feeds.',
      count: rates.length,
      data: rates
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch mandi market rates.'
    });
  }
}
