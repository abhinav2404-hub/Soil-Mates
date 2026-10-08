import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';
import { authenticate, requireAuth, requireRole } from '../middleware/auth';

const router = Router();

router.get('/', getProducts);
router.get('/:id', getProductById);
router.post('/', authenticate, requireAuth, requireRole(['FARMER', 'ADMIN']), createProduct);
router.patch('/:id', authenticate, requireAuth, updateProduct);
router.delete('/:id', authenticate, requireAuth, deleteProduct);

export default router;
