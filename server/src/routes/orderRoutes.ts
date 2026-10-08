import { Router } from 'express';
import {
  createOrder,
  getOrders,
  getOrderById,
  updateOrderStatus
} from '../controllers/orderController';
import { authenticate, requireAuth } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAuth);

router.post('/', createOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);
router.patch('/:id/status', updateOrderStatus);

export default router;
