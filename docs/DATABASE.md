# 🗄️ Soil Mates Database Architecture & Operations Guide

## 1. Overview
Soil Mates uses **MongoDB** as its primary persistent database engine, paired with **Mongoose ODM** for schema enforcement, type validation, and index lifecycle management.

To guarantee zero-downtime execution in sandboxed cloud container runtimes (such as Google AI Studio build environments or lightweight CI runners without an active `mongod` daemon), the application implements a **Resilient Hybrid Data Access Layer**. When MongoDB is reachable at `MONGODB_URI`, all writes and queries persist directly in MongoDB collections; if MongoDB is not present, the system automatically activates an in-memory hybrid store pre-seeded with authentic agricultural market data.

---

## 2. Collections & Schemas

### 2.1 `users` Collection
Stores authentication credentials, contact profiles, and user roles (`FARMER`, `BUYER`, `VENDOR`, `ADMIN`).

```typescript
{
  _id: ObjectId,
  name: String,               // Required, full name
  email: String,              // Required, unique, lowercased, indexed
  passwordHash: String,       // Bcrypt 10-round hash
  role: String,               // 'FARMER' | 'BUYER' | 'VENDOR' | 'ADMIN'
  phone: String,              // Mobile contact (+91 ...)
  location: String,           // Primary district / city
  farmDetails: {
    farmName: String,
    acres: Number,
    crops: [String],
    soilType: String,
    aadhaarVerified: Boolean
  },
  vendorDetails: {
    companyName: String,
    gstin: String,
    procurementVolumeTonnes: Number
  },
  createdAt: Date,
  updatedAt: Date
}
```

### 2.2 `products` Collection
Stores farm-direct marketplace produce offerings with inventory and pricing.

```typescript
{
  _id: ObjectId,
  name: String,               // e.g., 'Sharbati Gold Wheat'
  description: String,
  category: String,           // 'vegetables' | 'grains' | 'fruits' | 'herbs'
  price: Number,              // INR price per unit
  unit: String,               // 'kg' | 'quintal' | 'bunch' | 'pack'
  quantity: Number,           // Available quantity in inventory
  sellerId: String,           // User ID reference
  sellerName: String,
  farmName: String,           // e.g., 'Ramesh Patel Farm'
  images: [String],           // CDN or upload image URLs
  emoji: String,              // Visual badge icon
  location: String,           // Origin village & district
  available: Boolean,         // Stock availability flag
  grade: String,              // 'Grade A' | 'Grade B' | 'Mixed'
  isOrganic: Boolean,         // Organic certification flag
  isFreshToday: Boolean,
  deliveryHours: Number,
  rating: Number,             // Average score (1.0 to 5.0)
  reviewsCount: Number,
  vendorTrustScore: Number,   // 0 - 100 trust metric
  repeatBuyerRate: Number,    // Percentage
  harvestTime: String,        // Timestamp of field harvesting
  createdAt: Date,
  updatedAt: Date
}
```

### 2.3 `orders` Collection
Tracks farm-direct transactions, items, escrow status, and courier dispatch.

```typescript
{
  _id: ObjectId,
  orderNumber: String,        // Unique human-readable code e.g. SM-2026-8941
  buyerId: String,            // User ID
  buyerName: String,
  buyerPhone: String,
  items: [
    {
      productId: String,
      name: String,
      price: Number,          // Server-verified unit price
      quantity: Number,
      unit: String,
      emoji: String,
      sellerId: String,
      farmName: String
    }
  ],
  total: Number,              // Server-computed total in INR
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    pincode: String
  },
  paymentStatus: String,      // 'PENDING' | 'ESCROW_LOCKED' | 'COMPLETED' | 'REFUNDED'
  orderStatus: String,        // 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED'
  rider: {
    name: String,
    phone: String,
    vehicle: String,
    status: String
  },
  eta: String,
  createdAt: Date,
  updatedAt: Date
}
```

### 2.4 `cropdiagnoses` Collection
Persists plant disease diagnoses produced by the server-side Gemini AI model.

```typescript
{
  _id: ObjectId,
  userId: String,
  imageUrl: String,           // Uploaded leaf image path
  crop: String,               // Identified crop name
  disease: String,            // Pathogen or physiological condition
  scientificName: String,
  confidence: Number,         // 0.00 to 1.00
  severity: String,           // 'low' | 'medium' | 'high'
  symptoms: [String],
  possibleCauses: [String],
  treatment: [String],        // Immediate remediation steps
  prevention: [String],       // Long-term cultural practices
  organicTreatment: [String], // Neem oil, Trichoderma, etc.
  chemicalTreatment: [String],// Recommended sprays with dilution
  whenToConsultExpert: Boolean,
  notes: String,              // Agricultural advisory notes
  createdAt: Date
}
```

### 2.5 `marketrates` Collection
Historical and daily APMC benchmark prices across Indian mandis.

```typescript
{
  _id: ObjectId,
  commodity: String,          // e.g., 'Wheat (Sharbati)'
  category: String,           // 'grains' | 'vegetables' | 'oilseeds'
  emoji: String,
  unit: String,               // 'quintal' | 'crate' | 'kg'
  price: Number,              // Today's modal price in INR
  previousPrice: Number,      // Yesterday's close
  changePercent: Number,      // Relative difference (+/- %)
  trend: String,              // 'up' | 'down' | 'stable'
  mandi: String,              // Mandi name (e.g. 'Sehore APMC')
  state: String,
  arrivalTonnes: Number,
  demandStatus: String,       // 'HIGH' | 'STABLE' | 'LOW'
  history: [
    { day: String, price: Number }
  ],
  lastUpdated: Date
}
```

### 2.6 `reviews` Collection
Verified buyer ratings and farmgate reviews.

```typescript
{
  _id: ObjectId,
  productId: String,
  farmerName: String,
  reviewerName: String,
  reviewerLocation: String,
  rating: Number,             // 1 to 5
  comment: String,
  verifiedBuyer: Boolean,
  helpfulCount: Number,
  createdAt: Date
}
```

---

## 3. Indexing Strategy

Optimal indexes are registered in `server/src/db/indexes.ts`:

| Collection | Index Key | Type / Options | Purpose |
|---|---|---|---|
| `users` | `{ email: 1 }` | Unique, Background | Instant authentication lookup |
| `products` | `{ name: "text", description: "text", location: "text", farmName: "text" }` | Full-Text Search | Multi-keyword crop searching |
| `products` | `{ category: 1, available: 1, price: 1 }` | Compound | Fast marketplace filter queries |
| `products` | `{ sellerId: 1 }` | Single Field | Farmer inventory hub listing |
| `orders` | `{ orderNumber: 1 }` | Unique | Exact transaction retrieval |
| `orders` | `{ buyerId: 1, createdAt: -1 }` | Compound | Buyer order history timeline |
| `orders` | `{ orderStatus: 1 }` | Single Field | Logistics queue filtering |
| `marketrates` | `{ commodity: 1, mandi: 1 }` | Unique Compound | Fast mandi rate benchmarking |
| `cropdiagnoses` | `{ userId: 1, createdAt: -1 }` | Compound | Farmer diagnosis history |

---

## 4. Connection Lifecycle (`server/src/db/connect.ts`)

```typescript
import { connectDB, isMongoConnected, getConnectionStatus } from './server/src/db/connect';

// Connect with connection pooling and failover
await connectDB();

// Inspect health metadata
const status = getConnectionStatus();
console.log(status.connected ? 'MongoDB Online' : 'In-Memory Store Active');
```

Configuration parameters:
- `maxPoolSize`: 10 connections
- `minPoolSize`: 2 connections
- `serverSelectionTimeoutMS`: 3000ms
- `socketTimeoutMS`: 45000ms

---

## 5. Database Seeding (`server/src/db/seed.ts`)

Run the seed script directly:
```bash
npx tsx server/src/db/seed.ts
```

Seeds 8 agricultural commodities, 5 mandi benchmark feeds, default user profiles for all 4 roles (`FARMER`, `BUYER`, `VENDOR`, `ADMIN`), and sample escrow orders.

---

## 6. Docker Database Service

To spin up a dedicated MongoDB instance with Mongo Express:

```bash
docker compose -f docker-compose.database.yml up -d
```

- **MongoDB Endpoint**: `mongodb://localhost:27017/soilmates`
- **Mongo Express Web UI**: `http://localhost:8081`
