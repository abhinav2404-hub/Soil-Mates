# 📡 Soil Mates REST API Specification

Base URL: `/api` (or `http://localhost:3000/api`)

All responses follow the standardized JSON envelope:
```json
{
  "success": true,
  "data": {},
  "message": "Optional description string"
}
```

---

## 1. System Health
### `GET /api/health`
Checks runtime health and database connectivity.
- **Auth**: None
- **Response**:
```json
{
  "status": "UP",
  "service": "Soil Mates Agricultural API",
  "timestamp": "2026-10-07T22:45:00.000Z",
  "database": "connected",
  "version": "1.0.0"
}
```

---

## 2. Authentication
### `POST /api/auth/register`
Register a new Farmer, Buyer, or Vendor.
- **Body**:
```json
{
  "name": "Ramesh Patel",
  "email": "farmer@soilmates.in",
  "password": "Password@123",
  "role": "FARMER",
  "phone": "+91 98261 45210",
  "location": "Vidisha, MP"
}
```

### `POST /api/auth/login`
Authenticate and obtain JWT.
- **Body**:
```json
{
  "email": "farmer@soilmates.in",
  "password": "Password@123"
}
```

### `GET /api/auth/me`
Retrieve currently authenticated profile.
- **Auth**: `Bearer <token>`

---

## 3. Products
### `GET /api/products`
List marketplace products with filtering.
- **Query Params**:
  - `search`: string
  - `category`: string (vegetables, grains, fruits, herbs)
  - `minPrice`: number
  - `maxPrice`: number
  - `availableOnly`: boolean
  - `sellerId`: string

### `GET /api/products/:id`
Retrieve single product by ID.

### `POST /api/products`
Create new marketplace listing.
- **Auth**: Required (`FARMER` or `ADMIN`)
- **Body**:
```json
{
  "name": "Desi Heirloom Tomatoes",
  "category": "vegetables",
  "price": 32,
  "unit": "kg",
  "quantity": 150,
  "location": "Vidisha, MP",
  "grade": "Grade A",
  "isOrganic": true
}
```

### `PATCH /api/products/:id`
Update an existing listing.
- **Auth**: Seller or `ADMIN`

### `DELETE /api/products/:id`
Remove an existing listing.
- **Auth**: Seller or `ADMIN`

---

## 4. Orders
### `POST /api/orders`
Create a new order with escrow lock.
- **Auth**: Required
- **Body**:
```json
{
  "items": [
    { "productId": "prod-1", "quantity": 3 }
  ],
  "deliveryAddress": {
    "street": "Arera Colony Phase 2",
    "city": "Bhopal",
    "pincode": "462016"
  }
}
```

### `GET /api/orders`
List orders (Buyer sees own, Farmer sees orders for their crops, Admin sees all).
- **Auth**: Required

### `PATCH /api/orders/:id/status`
Update order lifecycle state (`PLACED` -> `CONFIRMED` -> `PACKED` -> `SHIPPED` -> `DELIVERED` | `CANCELLED`).
- **Auth**: Seller or `ADMIN`

---

## 5. Crop Diagnosis
### `POST /api/diagnosis`
Submit crop leaf image for Gemini AI analysis.
- **Auth**: Optional/Bearer
- **Payload**: Multipart file (`image`) or JSON `{ "imageBase64": "..." }`
- **Response**:
```json
{
  "success": true,
  "data": {
    "crop": "Tomato (Solanum lycopersicum)",
    "disease": "Early Blight (Alternaria solani)",
    "confidence": 0.94,
    "severity": "medium",
    "symptoms": ["Dark brown target ring lesions"],
    "treatment": ["Spray Mancozeb 75% WP @ 2.5g/L"],
    "organicTreatment": ["Trichoderma harzianum bio-spray"],
    "whenToConsultExpert": false
  }
}
```

### `GET /api/diagnosis/history`
List previous diagnoses for the authenticated user.

---

## 6. Mandi Market Intelligence
### `GET /api/market/rates`
Retrieve benchmark APMC mandi rates and price history.

---

## 7. Admin Governance
### `GET /api/admin/stats`
Platform KPI overview, revenue metrics, and system diagnostics.
- **Auth**: `ADMIN` role only

### `GET /api/admin/users`
List registered platform user directory.
- **Auth**: `ADMIN` role only

### `GET /api/admin/orders`
List all platform transactions.
- **Auth**: `ADMIN` role only
