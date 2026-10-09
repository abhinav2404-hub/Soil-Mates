import path from 'path';
import fs from 'fs';
import express from 'express';
import { createServer as createViteServer } from 'vite';
import { createExpressApp } from './server/src/app';
import { connectDB } from './server/src/config/db';
import { seedDatabaseIfEmpty } from './server/src/services/seedService';
import { notFoundHandler, errorHandler } from './server/src/middleware/error';

async function startServer() {
  // 1. Initialize Database & Seed realistic Indian agri marketplace data
  await connectDB();
  await seedDatabaseIfEmpty();

  // 2. Create Express application with API routes
  const app = createExpressApp();
  const PORT = parseInt(process.env.PORT || '3000', 10);
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    // Development mode: Mount Vite middlewares for HMR and instant asset compilation
    console.log('[Dev Server] Mounting Vite development middlewares on port', PORT);
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        host: '0.0.0.0',
        port: PORT,
        hmr: false
      },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    // Production mode: Serve pre-built static assets from dist
    const distPath = path.resolve(process.cwd(), 'dist');
    if (fs.existsSync(distPath)) {
      app.use(express.static(distPath));
      app.get('*', (req, res, next) => {
        if (req.path.startsWith('/api/')) {
          return next();
        }
        res.sendFile(path.join(distPath, 'index.html'));
      });
    } else {
      console.warn('[Warning] dist/ folder not found. Run `npm run build` before starting production server.');
    }
  }

  // Fallback error handler
  app.use(errorHandler);

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Soil Mates Platform] Serving full-stack app at http://localhost:${PORT}`);
    console.log(`[Soil Mates Platform] API health check live at http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error('[Soil Mates Platform] Server failed to start:', err);
  process.exit(1);
});
