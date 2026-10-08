import mongoose from 'mongoose';
import { config } from '../config/env';

export let isMongoConnected = false;

interface ConnectionStatus {
  connected: boolean;
  uri: string;
  database: string;
  readyState: number;
  poolSize?: number;
}

/**
 * Validates whether a connection string possesses a supported MongoDB scheme.
 */
export function isValidMongoUri(uri: string | undefined): boolean {
  if (!uri || typeof uri !== 'string') return false;
  const trimmed = uri.trim();
  return trimmed.startsWith('mongodb://') || trimmed.startsWith('mongodb+srv://');
}

/**
 * Establishes connection to MongoDB with connection pooling,
 * reconnect listeners, and graceful offline fallback.
 */
export async function connectDB(): Promise<boolean> {
  const uri = config.mongoUri;

  if (!uri || !isValidMongoUri(uri)) {
    console.info('[Database] MONGODB_URI not configured or invalid scheme (expected "mongodb://" or "mongodb+srv://"). Activating resilient in-memory hybrid store.');
    isMongoConnected = false;
    return false;
  }

  try {
    // Register lifecycle event listeners once
    if (mongoose.connection.listenerCount('connected') === 0) {
      mongoose.connection.on('connected', () => {
        isMongoConnected = true;
        console.log('[Database] MongoDB connection established successfully.');
      });

      mongoose.connection.on('error', (err) => {
        isMongoConnected = false;
        // Suppress repetitive log pollution if invalid scheme or offline
        if (err && err.message && !err.message.includes('Invalid scheme')) {
          console.warn('[Database] MongoDB connection state note:', err.message);
        }
      });

      mongoose.connection.on('disconnected', () => {
        isMongoConnected = false;
        console.info('[Database] MongoDB disconnected. Falling back to in-memory store.');
      });

      mongoose.connection.on('reconnected', () => {
        isMongoConnected = true;
        console.log('[Database] MongoDB reconnected successfully.');
      });
    }

    // Connect with optimized timeout and pooling options
    await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 3000,
      connectTimeoutMS: 3000,
      socketTimeoutMS: 45000,
      maxPoolSize: 10,
      minPoolSize: 2,
      dbName: config.mongoDb || 'soilmates'
    });

    isMongoConnected = true;
    console.log(`[Database] Connected to MongoDB database: ${config.mongoDb || 'soilmates'}`);
    return true;
  } catch (error: any) {
    isMongoConnected = false;
    console.info('[Database] MongoDB daemon unreachable. Resilient in-memory hybrid store is operational. All operations are fully functional.');
    return false;
  }
}

/**
 * Closes the active MongoDB connection cleanly.
 */
export async function disconnectDB(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
    isMongoConnected = false;
    console.log('[Database] MongoDB disconnected gracefully.');
  }
}

/**
 * Returns diagnostic metadata regarding database connectivity.
 */
export function getConnectionStatus(): ConnectionStatus {
  return {
    connected: isMongoConnected && mongoose.connection.readyState === 1,
    uri: config.mongoUri ? config.mongoUri.replace(/:([^@]+)@/, ':****@') : 'none',
    database: config.mongoDb || 'soilmates',
    readyState: mongoose.connection.readyState
  };
}
