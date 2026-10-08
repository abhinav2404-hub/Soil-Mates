import { Router } from 'express';
import { getMarketRates } from '../controllers/marketController';

const router = Router();

router.get('/rates', getMarketRates);

export default router;
