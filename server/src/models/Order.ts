import mongoose, { Schema, Document } from 'mongoose';

export type OrderStatus = 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type PaymentStatus = 'PENDING' | 'ESCROW_LOCKED' | 'COMPLETED' | 'REFUNDED';

export interface IOrderItemDetail {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  unit: string;
  emoji?: string;
  sellerId?: string;
  farmName?: string;
}

export interface IOrder extends Document {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  buyerPhone?: string;
  items: IOrderItemDetail[];
  total: number;
  deliveryAddress: {
    street: string;
    city: string;
    state?: string;
    pincode: string;
  };
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  rider?: {
    name: string;
    phone: string;
    vehicle?: string;
    status: string;
  };
  eta?: string;
  createdAt: Date;
  updatedAt: Date;
}

const OrderSchema = new Schema<IOrder>(
  {
    orderNumber: { type: String, required: true, unique: true },
    buyerId: { type: String, required: true, index: true },
    buyerName: { type: String, required: true },
    buyerPhone: { type: String },
    items: [
      {
        productId: { type: String, required: true },
        name: { type: String, required: true },
        price: { type: Number, required: true },
        quantity: { type: Number, required: true },
        unit: { type: String, default: 'kg' },
        emoji: { type: String, default: '🌾' },
        sellerId: { type: String },
        farmName: { type: String }
      }
    ],
    total: { type: Number, required: true },
    deliveryAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, default: 'MP' },
      pincode: { type: String, default: '462001' }
    },
    paymentStatus: {
      type: String,
      enum: ['PENDING', 'ESCROW_LOCKED', 'COMPLETED', 'REFUNDED'],
      default: 'ESCROW_LOCKED'
    },
    orderStatus: {
      type: String,
      enum: ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'],
      default: 'PLACED',
      index: true
    },
    rider: {
      name: { type: String, default: 'Vikas Sharma (Soil Mates Logistics)' },
      phone: { type: String, default: '+91 98260 12345' },
      vehicle: { type: String, default: 'E-Cargo MP-04-EA-9912' },
      status: { type: String, default: 'Assigned' }
    },
    eta: { type: String, default: '35 mins' }
  },
  { timestamps: true }
);

export const OrderModel = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
