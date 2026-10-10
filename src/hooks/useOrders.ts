import { useState, useEffect, useCallback } from 'react';
import { OrderItem } from '../types';
import { api } from '../services/api';
import { INITIAL_ORDERS } from '../data/agriData';

export function useOrders() {
  const [orders, setOrders] = useState<OrderItem[]>(INITIAL_ORDERS);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    const token = localStorage.getItem('soilMatesToken');
    if (!token) {
      setOrders(INITIAL_ORDERS);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.getOrders();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        const mapped: OrderItem[] = res.data.map((o: any) => ({
          id: o.id || o._id,
          orderNumber: o.orderNumber || `SM-2026-${o.id?.slice(-4)}`,
          dateStr: new Date(o.createdAt || Date.now()).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
          }),
          status:
            o.orderStatus === 'DELIVERED'
              ? 'delivered'
              : o.orderStatus === 'CANCELLED'
              ? 'cancelled'
              : o.orderStatus === 'SHIPPED'
              ? 'in_transit'
              : 'processing',
          statusLabel:
            o.orderStatus === 'DELIVERED'
              ? 'Delivered to Doorstep'
              : o.orderStatus === 'SHIPPED'
              ? 'In Transit (Electric Van)'
              : o.orderStatus === 'CANCELLED'
              ? 'Order Cancelled'
              : 'Confirmed & Farmgate Packing',
          itemsSummary: o.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(', ') || 'Agricultural Produce',
          pickupInfo: `${o.items?.[0]?.farmName || 'Farm'} -> ${o.deliveryAddress?.city || 'Home'}`,
          totalAmount: o.total,
          eta: o.eta || '45 mins',
          riderName: o.rider?.name || 'Vikas Sharma (Green Logistics)',
          riderPhone: o.rider?.phone || '+91 98260 12345',
          steps: [
            {
              title: 'Order Placed & Escrow Secured',
              description: 'UPI Escrow smart lock active',
              timestamp: 'Today',
              status: 'done'
            },
            {
              title: 'Harvest Quality Verified',
              description: 'Inspected at farmgate',
              timestamp: 'Today',
              status: o.orderStatus !== 'PLACED' ? 'done' : 'active'
            },
            {
              title: 'In Transit',
              description: 'Assigned to EV Courier',
              timestamp: 'In Progress',
              status: ['SHIPPED', 'DELIVERED'].includes(o.orderStatus) ? 'done' : 'pending'
            },
            {
              title: 'Delivered',
              description: 'Delivered with OTP',
              timestamp: 'Pending',
              status: o.orderStatus === 'DELIVERED' ? 'done' : 'pending'
            }
          ],
          blockchainTrail: {
            originVerified: true,
            qualityCertified: true,
            coldChainMaintained: true,
            deliveryPartnerAssigned: true,
            otpDelivered: o.orderStatus === 'DELIVERED'
          }
        }));
        setOrders(mapped);
      } else {
        setOrders(INITIAL_ORDERS);
      }
    } catch (err: any) {
      console.warn('[useOrders] API connection note:', err.message);
      setError(err.message);
      setOrders(INITIAL_ORDERS);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const createOrder = async (orderPayload: {
    items: Array<{ productId: string; quantity: number }>;
    deliveryAddress: { street: string; city: string; state?: string; pincode: string };
  }): Promise<OrderItem> => {
    setIsLoading(true);
    try {
      const res = await api.createOrder(orderPayload);
      if (res.success && res.data) {
        await fetchOrders();
        const o = res.data;
        return {
          id: o.id || o._id,
          orderNumber: o.orderNumber,
          dateStr: 'Just now',
          status: 'processing',
          statusLabel: 'Confirmed & Farmgate Packing',
          itemsSummary: o.items?.map((i: any) => `${i.quantity}x ${i.name}`).join(', ') || 'Fresh Produce',
          pickupInfo: `${o.items?.[0]?.farmName || 'Farm'} -> ${o.deliveryAddress?.city}`,
          totalAmount: o.total,
          eta: o.eta || '45 mins',
          riderName: o.rider?.name || 'Vikas Sharma',
          riderPhone: o.rider?.phone || '+91 98260 12345',
          steps: [
            { title: 'Order Placed & Escrow Secured', description: 'UPI Escrow locked', timestamp: 'Just now', status: 'done' },
            { title: 'Harvest Quality Verified', description: 'At farmgate', timestamp: 'Today', status: 'active' },
            { title: 'In Transit', description: 'EV Courier', timestamp: 'Pending', status: 'pending' },
            { title: 'Delivered', description: 'OTP delivery', timestamp: 'Pending', status: 'pending' }
          ],
          blockchainTrail: {
            originVerified: true,
            qualityCertified: true,
            coldChainMaintained: true,
            deliveryPartnerAssigned: true,
            otpDelivered: false
          }
        };
      }
      throw new Error(res.message || 'Order creation failed');
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    try {
      await api.updateOrderStatus(orderId, status);
      await fetchOrders();
    } catch (err: any) {
      console.warn('[useOrders] update error:', err);
    }
  };

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
    createOrder,
    updateOrderStatus
  };
}
