# 🏛️ Soil Mates Architecture & System Design

## 1. Architectural Philosophy
Soil Mates is engineered around five fundamental pillars:
1. **Farmer-First Usability**: High-contrast, clean typography, multilingual accessibility, and mobile viewport adaptability.
2. **Server-Side AI Confidentiality**: Complete server isolation of AI prompts, API keys, and model execution.
3. **Failsafe Data Persistence**: Resilient hybrid persistence supporting enterprise MongoDB alongside zero-dependency in-memory failover.
4. **Tamper-Proof Transactions**: Strict backend re-validation of inventory stocks and unit prices during checkout.
5. **Transparent Agricultural Provenance**: Verifiable supply-chain records from harvest gate to consumer doorstep.

---

## 2. System Architecture Diagram

```
+-------------------------------------------------------------------------+
|                              CLIENT LAYER                               |
|   React 19 + TypeScript + Tailwind CSS v4 + Recharts + Lucide Icons    |
|   Responsive: Desktop Monitor / Expanded Tablet / 100dvh Mobile Frame   |
+------------------------------------+------------------------------------+
                                     |
                                     | JSON & Multipart HTTP (REST)
                                     v
+-------------------------------------------------------------------------+
|                           API GATEWAY / EXPRESS                         |
|   Helmet + CORS + JWT Role Middleware (FARMER / BUYER / VENDOR / ADMIN) |
+------------------------------------+------------------------------------+
                                     |
     +-------------------------------+-------------------------------+
     |                               |                               |
     v                               v                               v
+----------------+          +----------------+              +----------------+
|  AI DOCTOR     |          | MARKETPLACE    |              | ADMIN & OPS    |
|  @google/genai |          | Orders, Cart,  |              | Health metrics,|
|  Gemini Flash  |          | Products, Mandi|              | Platform GMV,  |
|  Diagnosis     |          | Traceability   |              | Audits         |
+----------------+          +----------------+              +----------------+
     |                               |                               |
     +-------------------------------+-------------------------------+
                                     |
                                     v
+-------------------------------------------------------------------------+
|                         DATA ACCESS LAYER (DAL)                         |
|    Mongoose ODM (MongoDB 7.x) <---> Resilient In-Memory Fallback Store  |
+-------------------------------------------------------------------------+
```

---

## 3. Data Models & Schemas

### User
```typescript
interface IUser {
  id: string;
  name: string;
  email: string;
  passwordHash?: string;
  role: 'FARMER' | 'BUYER' | 'VENDOR' | 'ADMIN';
  phone?: string;
  location?: string;
  farmDetails?: {
    farmName: string;
    acres: number;
    crops: string[];
    soilType: string;
    aadhaarVerified: boolean;
  };
  vendorDetails?: {
    companyName: string;
    gstin?: string;
    procurementVolumeTonnes?: number;
  };
}
```

### Product
```typescript
interface IProduct {
  id: string;
  name: string;
  description: string;
  category: string;
  price: number;
  unit: string;
  quantity: number;
  sellerId: string;
  sellerName?: string;
  farmName: string;
  images: string[];
  emoji?: string;
  location: string;
  available: boolean;
  grade?: string;
  isOrganic?: boolean;
  deliveryHours?: number;
  rating?: number;
  reviewsCount?: number;
}
```

### Order
```typescript
interface IOrder {
  id: string;
  orderNumber: string;
  buyerId: string;
  buyerName: string;
  items: Array<{
    productId: string;
    name: string;
    price: number;
    quantity: number;
    unit: string;
    sellerId?: string;
  }>;
  total: number;
  deliveryAddress: {
    street: string;
    city: string;
    state?: string;
    pincode: string;
  };
  paymentStatus: 'PENDING' | 'ESCROW_LOCKED' | 'COMPLETED' | 'REFUNDED';
  orderStatus: 'PLACED' | 'CONFIRMED' | 'PACKED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
}
```

### CropDiagnosis
```typescript
interface ICropDiagnosis {
  id: string;
  userId: string;
  imageUrl?: string;
  crop: string;
  disease: string;
  scientificName?: string;
  confidence: number;
  severity: 'low' | 'medium' | 'high';
  symptoms: string[];
  possibleCauses: string[];
  treatment: string[];
  prevention: string[];
  organicTreatment: string[];
  chemicalTreatment: string[];
  whenToConsultExpert: boolean;
  notes?: string;
}
```

---

## 4. AI Crop Doctor Execution Flow

```text
[Farmer captures leaf photo via HTML5 Video / File upload]
                          │
                          ▼
[Client sends base64/FormData to POST /api/diagnosis]
                          │
                          ▼
[Express controller checks size (<8MB) & image MIME type]
                          │
                          ▼
[Server invokes Gemini via GoogleGenAI SDK (model: gemini-flash-latest)]
                          │
                          ▼
[Gemini outputs structured JSON matching Type.OBJECT schema]
                          │
                          ▼
[Result saved in MongoDB/Store & returned with agronomic disclaimer]
```

---

## 5. Security Architecture
- Client never sees raw database connection strings or Gemini API tokens.
- Checkout automatically queries current product stock and database price per unit.
- Non-admin tokens are strictly blocked from `/api/admin/*` routes with HTTP 403 Forbidden.
