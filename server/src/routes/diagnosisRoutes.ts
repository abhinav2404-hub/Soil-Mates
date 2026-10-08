import { Router } from 'express';
import multer from 'multer';
import { diagnoseCrop, getDiagnosisHistory } from '../controllers/diagnosisController';
import { authenticate } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 } // 8MB limit
});

router.post('/', authenticate, upload.single('image'), diagnoseCrop);
router.get('/history', authenticate, getDiagnosisHistory);

export default router;
