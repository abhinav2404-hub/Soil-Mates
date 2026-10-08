import { createExpressApp } from './app';
import { connectDB } from './config/db';
import { seedDatabaseIfEmpty } from './services/seedService';
import { notFoundHandler, errorHandler } from './middleware/error';
import { config } from './config/env';

async function startStandaloneServer() {
  await connectDB();
  await seedDatabaseIfEmpty();

  const app = createExpressApp();

  app.use(notFoundHandler);
  app.use(errorHandler);

  const port = config.backendPort || 4000;
  app.listen(port, '0.0.0.0', () => {
    console.log(`[Soil Mates Backend] Server listening on http://localhost:${port}`);
  });
}

startStandaloneServer().catch((err) => {
  console.error('[Soil Mates Backend] Fatal startup error:', err);
});
