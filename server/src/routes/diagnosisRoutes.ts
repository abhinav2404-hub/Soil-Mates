import { Router } from 'express';
import multer from 'multer';
import { diagnoseCrop, getDiagnosisHistory } from '../controllers/diagnosisController';
import { authenticate } from '../middleware/auth';

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 8 * 1024 * 1024 } // 8MB limit
});

router.post('/', authenticate as any, upload.single('image') as any, diagnoseCrop as any);
router.get('/history', authenticate as any, getDiagnosisHistory as any);

export default router;
