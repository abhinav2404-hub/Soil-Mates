import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { store } from '../models/store';
import { OrderStatus } from '../models/Order';

export async function createOrder(req: AuthRequest, res: Response) {
  try {
    const { items, deliveryAddress } = req.body;

    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item.'
      });
    }

    if (!deliveryAddress || !deliveryAddress.street || !deliveryAddress.city) {
      return res.status(400).json({
        success: false,
        message: 'A complete delivery address (street and city) is required.'
      });
    }

    // Backend price and availability re-validation (Never trust client total!)
    let computedTotal = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await store.getProductById(item.productId || item.id);
      if (!product) {
        return res.status(404).json({
          success: false,
          message: `Product "${item.name || item.productId}" is no longer available in the marketplace.`
        });
      }

      if (!product.available || product.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: `Product "${product.name}" is currently out of stock.`
        });
      }

      const quantityRequested = Math.max(1, Math.floor(Number(item.quantity) || 1));
      if (quantityRequested > product.quantity) {
        return res.status(400).json({
          success: false,
          message: `Requested quantity for "${product.name}" (${quantityRequested} ${product.unit}) exceeds available stock (${product.quantity} ${product.unit}).`
        });
      }

      const verifiedPrice = Number(product.price);
      computedTotal += verifiedPrice * quantityRequested;

      validatedItems.push({
        productId: product.id || product._id,
        name: product.name,
        price: verifiedPrice,
        quantity: quantityRequested,
        unit: product.unit || 'kg',
        emoji: product.emoji || '🌾',
        sellerId: product.sellerId,
        farmName: product.farmName
      });

      // Decrement inventory stock on order creation
      await store.updateProduct(product.id || product._id, {
        quantity: product.quantity - quantityRequested,
        available: product.quantity - quantityRequested > 0
      });
    }

    const buyerId = req.user?.id || 'usr-buyer-1';
    const buyerName = req.user?.name || 'Priya Sharma';

    const orderNumber = `SM-2026-${Math.floor(1000 + Math.random() * 9000)}`;

    const order = await store.createOrder({
      orderNumber,
      buyerId,
      buyerName,
      buyerPhone: req.user?.email || '+91 94250 88912',
      items: validatedItems,
      total: computedTotal,
      deliveryAddress: {
        street: deliveryAddress.street,
        city: deliveryAddress.city,
        state: deliveryAddress.state || 'Madhya Pradesh',
        pincode: deliveryAddress.pincode || '462001'
      },
      paymentStatus: 'ESCROW_LOCKED',
      orderStatus: 'PLACED',
      rider: {
        name: 'Vikas Sharma (Soil Mates Green Courier)',
        phone: '+91 98260 12345',
        vehicle: 'E-Cargo MP-04-EA-9912',
        status: 'Order received. Farmgate pickup scheduled.'
      },
      eta: '45 mins'
    });

    res.status(201).json({
      success: true,
      message: 'Order placed successfully! Farmgate escrow payment secured.',
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to place order.'
    });
  }
}

export async function getOrders(req: AuthRequest, res: Response) {
  try {
    let orders;

    if (!req.user || req.user.role === 'ADMIN') {
      // Admin sees all orders
      orders = await store.listOrders({});
    } else if (req.user.role === 'FARMER') {
      // Farmer sees orders for their products
      orders = await store.listOrders({ sellerId: req.user.id });
    } else {
      // Buyer sees their own orders
      orders = await store.listOrders({ buyerId: req.user.id });
    }

    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch orders.'
    });
  }
}

export async function getOrderById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const order = await store.getOrderById(id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Authorization check
    if (
      req.user &&
      req.user.role !== 'ADMIN' &&
      order.buyerId !== req.user.id &&
      !order.items.some((i: any) => i.sellerId === req.user?.id)
    ) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized access to this order.'
      });
    }

    res.json({
      success: true,
      data: order
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching order.'
    });
  }
}

export async function updateOrderStatus(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses: OrderStatus[] = ['PLACED', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid order status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await store.getOrderById(id);
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found.'
      });
    }

    // Check authorization: Farmer selling the item, or Admin
    if (req.user && req.user.role !== 'ADMIN') {
      const isSeller = order.items.some((i: any) => i.sellerId === req.user?.id);
      const isBuyer = order.buyerId === req.user.id;
      if (!isSeller && !(isBuyer && status === 'CANCELLED')) {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to change status of this order.'
        });
      }
    }

    const updated = await store.updateOrderStatus(id, status);

    res.json({
      success: true,
      message: `Order status updated to ${status}.`,
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update order status.'
    });
  }
}
