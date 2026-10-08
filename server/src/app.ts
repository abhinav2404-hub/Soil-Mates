import express, { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import authRoutes from './routes/authRoutes';
import productRoutes from './routes/productRoutes';
import orderRoutes from './routes/orderRoutes';
import diagnosisRoutes from './routes/diagnosisRoutes';
import marketRoutes from './routes/marketRoutes';
import reviewRoutes from './routes/reviewRoutes';
import adminRoutes from './routes/adminRoutes';
import { notFoundHandler, errorHandler } from './middleware/error';
import { isMongoConnected } from './config/db';

export function createExpressApp() {
  const app = express();

  // Helmet with relaxed directives for dev iframe & assets
  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false
    })
  );

  app.use(cors({ origin: true, credentials: true }));
  app.use(express.json({ limit: '15mb' }));
  app.use(express.urlencoded({ extended: true, limit: '15mb' }));

  // Health endpoint
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'UP',
      service: 'Soil Mates Agricultural API',
      timestamp: new Date().toISOString(),
      database: isMongoConnected ? 'connected' : 'in-memory-fallback',
      version: '1.0.0'
    });
  });

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/products', productRoutes);
  app.use('/api/orders', orderRoutes);
  app.use('/api/diagnosis', diagnosisRoutes);
  app.use('/api/market', marketRoutes);
  app.use('/api/products', reviewRoutes);
  app.use('/api/admin', adminRoutes);

  return app;
}
