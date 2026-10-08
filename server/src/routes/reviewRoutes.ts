import { Router } from 'express';
import { getProductReviews, addProductReview } from '../controllers/reviewController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/:id/reviews', getProductReviews);
router.post('/:id/reviews', authenticate, addProductReview);

export default router;
