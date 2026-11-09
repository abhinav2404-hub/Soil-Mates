import { createExpressApp } from '../server/src/app';
import { connectDB } from '../server/src/config/db';
import { seedDatabaseIfEmpty } from '../server/src/services/seedService';
import http from 'http';

async function runTestSuite() {
  console.log('--- RUNNING SOIL MATES BACKEND TEST SUITE ---');

  // Initialize DB & Seed
  await connectDB();
  await seedDatabaseIfEmpty();

  const app = createExpressApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => server.listen(4005, '127.0.0.1', () => resolve()));
  const baseUrl = 'http://127.0.0.1:4005';
  console.log('[Test Server] Running on', baseUrl);

  let passed = 0;
  let failed = 0;

  async function test(name: string, fn: () => Promise<void>) {
    try {
      await fn();
      console.log(`✅ [PASS] ${name}`);
      passed++;
    } catch (err: any) {
      console.error(`❌ [FAIL] ${name}:`, err.message);
      failed++;
    }
  }

  // 1. Health Endpoint
  await test('GET /api/health returns status UP', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    const data: any = await res.json();
    if (res.status !== 200 || data.status !== 'UP') {
      throw new Error(`Unexpected health response: ${JSON.stringify(data)}`);
    }
  });

  // 2. Authentication - User Registration
  const testFarmerEmail = `sunita.${Date.now()}@soilmates.in`;
  await test('POST /api/auth/register creates a new FARMER user', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Sunita Devi',
        email: testFarmerEmail,
        password: 'SoilMates@2026',
        role: 'FARMER',
        phone: '+91 98765 43210',
        location: 'Khandwa, MP',
        farmDetails: {
          farmName: 'Devi Organic Farms',
          acres: 5,
          crops: ['Soybean', 'Cotton']
        }
      })
    });
    const data: any = await res.json();
    if (res.status !== 201 || !data.success || !data.token || data.user.email !== testFarmerEmail) {
      throw new Error(`Registration failed: ${JSON.stringify(data)}`);
    }
  });

  // 3. Authentication - User Login with Seeded Account
  let farmerToken = '';
  await test('POST /api/auth/login succeeds with seeded credentials', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'farmer@soilmates.in',
        password: 'SoilMates@2026'
      })
    });
    const data: any = await res.json();
    if (res.status !== 200 || !data.success || !data.token) {
      throw new Error(`Login failed: ${JSON.stringify(data)}`);
    }
    farmerToken = data.token;
  });

  // 4. Authentication - Reject invalid password
  await test('POST /api/auth/login rejects incorrect password (401)', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        identifier: 'farmer@soilmates.in',
        password: 'WrongPassword999'
      })
    });
    if (res.status !== 401) {
      throw new Error(`Expected 401 Unauthorized, received ${res.status}`);
    }
  });

  // 5. Authentication - GET /api/auth/me
  await test('GET /api/auth/me returns authenticated user profile', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { Authorization: `Bearer ${farmerToken}` }
    });
    const data: any = await res.json();
    if (res.status !== 200 || !data.success || data.user.email !== 'farmer@soilmates.in') {
      throw new Error(`Failed to fetch profile: ${JSON.stringify(data)}`);
    }
  });

  // 6. Product Listing
  await test('GET /api/products returns products list', async () => {
    const res = await fetch(`${baseUrl}/api/products`);
    const data: any = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Failed to list products: ${JSON.stringify(data)}`);
    }
  });

  // 7. Product Creation with Role Authorization
  let createdProductId: string = '';
  await test('POST /api/products allows FARMER to create listing', async () => {
    const res = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${farmerToken}`
      },
      body: JSON.stringify({
        name: 'Organic Kesar Mangoes',
        category: 'fruits',
        price: 140,
        unit: 'kg',
        quantity: 50,
        location: 'Sehore, MP',
        farmName: 'Ramesh Patel Farm'
      })
    });
    const data: any = await res.json();
    if (!data.success || !data.data || data.data.name !== 'Organic Kesar Mangoes') {
      throw new Error(`Product creation failed: ${JSON.stringify(data)}`);
    }
    createdProductId = data.data.id || data.data._id;
  });

  // 4. Order Creation & Backend Validation
  await test('POST /api/orders creates order and validates stock & price', async () => {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo-buyer'
      },
      body: JSON.stringify({
        items: [{ productId: createdProductId, quantity: 2 }],
        deliveryAddress: {
          street: 'Arera Colony Phase 2',
          city: 'Bhopal',
          pincode: '462016'
        }
      })
    });
    const data: any = await res.json();
    if (!data.success || !data.data || data.data.total !== 280) {
      throw new Error(`Order creation failed or total mismatch: ${JSON.stringify(data)}`);
    }
  });

  // 5. Order Stock Overflow Protection
  await test('POST /api/orders rejects order exceeding available stock', async () => {
    const res = await fetch(`${baseUrl}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer demo-buyer'
      },
      body: JSON.stringify({
        items: [{ productId: createdProductId, quantity: 99999 }],
        deliveryAddress: { street: 'Main Road', city: 'Bhopal', pincode: '462001' }
      })
    });
    if (res.status === 200) {
      throw new Error('Server should have rejected excessive quantity order!');
    }
  });

  // 6. Mandi Market Rates
  await test('GET /api/market/rates returns mandi rates with provider notice', async () => {
    const res = await fetch(`${baseUrl}/api/market/rates`);
    const data: any = await res.json();
    if (!data.success || !Array.isArray(data.data) || !data.provider) {
      throw new Error(`Mandi rates failed: ${JSON.stringify(data)}`);
    }
  });

  // 7. Admin Dashboard Stats
  await test('GET /api/admin/stats returns platform metrics for ADMIN', async () => {
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: {
        Authorization: 'Bearer demo-admin'
      }
    });
    const data: any = await res.json();
    if (!data.success || !data.stats || !data.systemHealth) {
      throw new Error(`Admin stats failed: ${JSON.stringify(data)}`);
    }
  });

  // 8. Role Protection - Non-Admin Blocked from Admin API
  await test('GET /api/admin/stats blocks unauthorized non-admin user (403)', async () => {
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: {
        Authorization: 'Bearer demo-buyer'
      }
    });
    if (res.status !== 403) {
      throw new Error(`Expected 403 Forbidden for non-admin, received ${res.status}`);
    }
  });

  // 9. AI Crop Doctor Diagnosis API (with base64 leaf data)
  await test('POST /api/diagnosis/scan diagnoses crop disease from leaf photo', async () => {
    // 1x1 transparent png in base64
    const sampleLeafBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const res = await fetch(`${baseUrl}/api/diagnosis/scan`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${farmerToken}`
      },
      body: JSON.stringify({
        cropHint: 'Tomato',
        imageBase64: sampleLeafBase64
      })
    });
    const data: any = await res.json();
    if (!data.success || !data.data || !data.data.crop || !data.data.disease) {
      throw new Error(`Crop diagnosis failed: ${JSON.stringify(data)}`);
    }
  });

  // 10. AI Crop Doctor Diagnosis History
  await test('GET /api/diagnosis/history returns diagnosis logs', async () => {
    const res = await fetch(`${baseUrl}/api/diagnosis/history`, {
      headers: { Authorization: `Bearer ${farmerToken}` }
    });
    const data: any = await res.json();
    if (!data.success || !Array.isArray(data.data) || data.data.length === 0) {
      throw new Error(`Diagnosis history failed: ${JSON.stringify(data)}`);
    }
  });

  // 11. Product Reviews - GET & POST
  await test('POST & GET /api/products/:id/reviews allows submitting and fetching reviews', async () => {
    // Post a review
    const postRes = await fetch(`${baseUrl}/api/products/${createdProductId}/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${farmerToken}`
      },
      body: JSON.stringify({
        rating: 5,
        comment: 'Fresh farm-direct quality! Very crisp and natural flavor.',
        reviewerName: 'Sunita Devi',
        reviewerLocation: 'Khandwa, MP'
      })
    });
    const postData: any = await postRes.json();
    if (!postData.success || !postData.data || postData.data.rating !== 5) {
      throw new Error(`Post review failed: ${JSON.stringify(postData)}`);
    }

    // Get reviews
    const getRes = await fetch(`${baseUrl}/api/products/${createdProductId}/reviews`);
    const getData: any = await getRes.json();
    if (!getData.success || !Array.isArray(getData.data) || getData.data.length === 0) {
      throw new Error(`Get reviews failed: ${JSON.stringify(getData)}`);
    }
  });

  server.close();

  console.log(`\nTEST SUMMARY: ${passed} Passed, ${failed} Failed`);
  if (failed > 0) {
    process.exit(1);
  } else {
    console.log('ALL TESTS PASSED SUCCESSFULLY! 🚀');
    process.exit(0);
  }
}

runTestSuite().catch((err) => {
  console.error('Fatal test error:', err);
  process.exit(1);
});
