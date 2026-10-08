import { Router } from 'express';
import { getStats, listAdminUsers, listAdminOrders } from '../controllers/adminController';
import { authenticate, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.use(authenticate, requireAuth, requireRole(['ADMIN']));

router.get('/stats', getStats);
router.get('/users', listAdminUsers);
router.get('/orders', listAdminOrders);

export default router;
