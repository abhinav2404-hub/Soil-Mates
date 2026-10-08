import dotenv from 'dotenv';
dotenv.config();

function parseMongoUri(raw: string | undefined): string {
  if (!raw) return '';
  const trimmed = raw.trim();
  if (trimmed.startsWith('mongodb://') || trimmed.startsWith('mongodb+srv://')) {
    return trimmed;
  }
  return '';
}

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  backendPort: parseInt(process.env.BACKEND_PORT || '4000', 10),
  mongoUri: parseMongoUri(process.env.MONGODB_URI),
  mongoDb: process.env.MONGODB_DB || 'soilmates',
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  authSecret: process.env.AUTH_SECRET || 'soil-mates-super-secret-jwt-key-2026',
  nodeEnv: process.env.NODE_ENV || 'development'
};
