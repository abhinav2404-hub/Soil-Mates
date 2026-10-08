import { User, Product, Order, CropDiagnosis, MarketRate, Review, Notification, FarmProfile, VendorProfile } from './models';
import { isMongoConnected } from './connect';

/**
 * Creates optimal MongoDB indexes across all collections.
 * Safe to call idempotently on application boot.
 */
export async function ensureIndexes(): Promise<void> {
  if (!isMongoConnected) {
    console.info('[Database] MongoDB offline; skipping remote index creation.');
    return;
  }

  try {
    console.log('[Database] Ensuring collection indexes...');

    await Promise.all([
      // 1. User Indexes
      User.collection.createIndex({ email: 1 }, { unique: true, background: true }),
      User.collection.createIndex({ role: 1 }, { background: true }),

      // 2. Product Indexes
      Product.collection.createIndex(
        { name: 'text', description: 'text', location: 'text', farmName: 'text' },
        { weights: { name: 10, farmName: 5, location: 2, description: 1 }, background: true }
      ),
      Product.collection.createIndex({ category: 1, available: 1, price: 1 }, { background: true }),
      Product.collection.createIndex({ sellerId: 1 }, { background: true }),
      Product.collection.createIndex({ rating: -1 }, { background: true }),

      // 3. Order Indexes
      Order.collection.createIndex({ orderNumber: 1 }, { unique: true, background: true }),
      Order.collection.createIndex({ buyerId: 1, createdAt: -1 }, { background: true }),
      Order.collection.createIndex({ orderStatus: 1 }, { background: true }),
      Order.collection.createIndex({ 'items.sellerId': 1 }, { background: true }),

      // 4. Crop Diagnosis Indexes
      CropDiagnosis.collection.createIndex({ userId: 1, createdAt: -1 }, { background: true }),
      CropDiagnosis.collection.createIndex({ crop: 1, disease: 1 }, { background: true }),

      // 5. Market Rate Indexes
      MarketRate.collection.createIndex({ commodity: 1, mandi: 1 }, { unique: true, background: true }),
      MarketRate.collection.createIndex({ category: 1 }, { background: true }),

      // 6. Review Indexes
      Review.collection.createIndex({ productId: 1, createdAt: -1 }, { background: true }),
      Review.collection.createIndex({ farmerName: 1 }, { background: true }),

      // 7. Notification Indexes
      Notification.collection.createIndex({ userId: 1, read: 1, createdAt: -1 }, { background: true }),

      // 8. Profiles Indexes
      FarmProfile.collection.createIndex({ farmerId: 1 }, { unique: true, background: true }),
      VendorProfile.collection.createIndex({ vendorId: 1 }, { unique: true, background: true })
    ]);

    console.log('[Database] All collection indexes verified and built successfully.');
  } catch (error: any) {
    console.warn('[Database] Index creation note:', error.message);
  }
}
