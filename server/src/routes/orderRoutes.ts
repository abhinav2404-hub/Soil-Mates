import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController';
import { authenticate } from '../middleware/auth';

const router = Router();

// Allow optional authentication so GET /api/orders responds gracefully for unauthenticated initial load
router.get('/', authenticate, getOrders);
router.get('/:id', authenticate, getOrderById);

// Order operations
router.post('/', authenticate, createOrder);
router.patch('/:id/status', authenticate, updateOrderStatus);

export default router;
