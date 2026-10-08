import mongoose, { Schema, Document } from 'mongoose';

export interface IMarketRate extends Document {
  id: string;
  commodity: string;
  category: 'vegetables' | 'grains' | 'fruits' | 'pulses' | 'oilseeds';
  emoji: string;
  unit: string;
  price: number;
  previousPrice: number;
  changePercent: number;
  trend: 'up' | 'down' | 'stable';
  mandi: string;
  state: string;
  arrivalTonnes: number;
  demandStatus: 'HIGH' | 'STABLE' | 'LOW';
  history: Array<{
    day: string;
    price: number;
  }>;
  lastUpdated: Date;
}

const MarketRateSchema = new Schema<IMarketRate>(
  {
    commodity: { type: String, required: true },
    category: { type: String, required: true },
    emoji: { type: String, default: '🌾' },
    unit: { type: String, default: 'quintal' },
    price: { type: Number, required: true },
    previousPrice: { type: Number, required: true },
    changePercent: { type: Number, default: 0 },
    trend: { type: String, enum: ['up', 'down', 'stable'], default: 'stable' },
    mandi: { type: String, required: true },
    state: { type: String, default: 'Madhya Pradesh' },
    arrivalTonnes: { type: Number, default: 150 },
    demandStatus: { type: String, enum: ['HIGH', 'STABLE', 'LOW'], default: 'STABLE' },
    history: [
      {
        day: String,
        price: Number
      }
    ],
    lastUpdated: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

export const MarketRateModel =
  mongoose.models.MarketRate || mongoose.model<IMarketRate>('MarketRate', MarketRateSchema);
