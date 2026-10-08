import bcrypt from 'bcryptjs';
import { User, Product, Order, MarketRate, Review, FarmProfile, VendorProfile } from './models';
import { isMongoConnected } from './connect';
import { store } from '../models/store';

export async function seedDatabase(): Promise<void> {
  console.log('[Seed] Checking database initialization status...');

  if (isMongoConnected) {
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`[Seed] MongoDB already contains ${existingCount} products. Skipping duplicate seed.`);
      return;
    }
  } else {
    const existingMem = await store.listProducts();
    if (existingMem.length > 0) {
      console.log(`[Seed] In-memory store already initialized with ${existingMem.length} products. Skipping duplicate seed.`);
      return;
    }
  }

  console.log('[Seed] Seeding production Indian agricultural marketplace data into database...');

  const passwordHash = bcrypt.hashSync('SoilMates@2026', 10);

  // 1. Users
  const usersData = [
    {
      id: 'usr-farmer-1',
      name: 'Ramesh Patel',
      email: 'farmer@soilmates.in',
      passwordHash,
      role: 'FARMER',
      phone: '+91 98261 45210',
      location: 'Village Sonpur, Vidisha District, Madhya Pradesh',
      farmDetails: {
        farmName: 'Ramesh Patel Farm & Organic Orchards',
        acres: 12.5,
        crops: ['Tomatoes', 'Wheat', 'Soybean', 'Palak'],
        soilType: 'Deep Black Cotton Soil (Regur)',
        aadhaarVerified: true
      }
    },
    {
      id: 'usr-buyer-1',
      name: 'Priya Sharma',
      email: 'buyer@soilmates.in',
      passwordHash,
      role: 'BUYER',
      phone: '+91 94250 88912',
      location: 'Arera Colony, Bhopal, Madhya Pradesh'
    },
    {
      id: 'usr-vendor-1',
      name: 'Rajesh Agrawal',
      email: 'vendor@soilmates.in',
      passwordHash,
      role: 'VENDOR',
      phone: '+91 98930 77123',
      location: 'New Mandi Road, Indore, Madhya Pradesh',
      vendorDetails: {
        companyName: 'Narmada Agro Procurements Pvt. Ltd.',
        gstin: '23AAACN1234F1Z5',
        procurementVolumeTonnes: 450
      }
    },
    {
      id: 'usr-admin-1',
      name: 'Soil Mates Operations Admin',
      email: 'admin@soilmates.in',
      passwordHash,
      role: 'ADMIN',
      phone: '+91 75522 33445',
      location: 'Soil Mates HQ, Bhopal, Madhya Pradesh'
    }
  ];

  for (const u of usersData) {
    if (isMongoConnected) {
      await User.findOneAndUpdate({ email: u.email }, u, { upsert: true });
    }
    await store.createUser(u);
  }

  // 2. Farm Profiles
  const farmProfilesData = [
    {
      farmerId: 'usr-farmer-1',
      farmName: 'Ramesh Patel Farm & Organic Orchards',
      acres: 12.5,
      crops: ['Tomatoes', 'Wheat', 'Soybean', 'Palak'],
      soilType: 'Deep Black Cotton Soil',
      aadhaarVerified: true,
      village: 'Sonpur',
      district: 'Vidisha',
      state: 'Madhya Pradesh',
      coldStorageAvailable: true
    }
  ];

  for (const fp of farmProfilesData) {
    if (isMongoConnected) {
      await FarmProfile.findOneAndUpdate({ farmerId: fp.farmerId }, fp, { upsert: true });
    }
  }

  // 3. Products
  const productsData = [
    {
      id: 'prod-1',
      name: 'Desi Heirloom Tomatoes',
      description: 'Naturally sun-ripened indigenous desi tomatoes with intense tangy flavour and high lycopene. Harvested at daybreak.',
      category: 'vegetables',
      price: 32,
      unit: 'kg',
      quantity: 150,
      sellerId: 'usr-farmer-1',
      sellerName: 'Ramesh Patel',
      farmName: 'Ramesh Patel Farm',
      images: ['https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'],
      emoji: '🍅',
      location: 'Vidisha, Madhya Pradesh',
      available: true,
      grade: 'Grade A',
      isOrganic: true,
      isFreshToday: true,
      deliveryHours: 3,
      rating: 4.9,
      reviewsCount: 142,
      vendorTrustScore: 98,
      repeatBuyerRate: 88,
      harvestTime: 'Today 5:30 AM'
    },
    {
      id: 'prod-2',
      name: 'Palak Tender Spinach',
      description: 'Zero chemical spray, fresh green palak bunches nourished with bio-slurry and vermiculture.',
      category: 'vegetables',
      price: 18,
      unit: 'bunch',
      quantity: 85,
      sellerId: 'usr-farmer-1',
      sellerName: 'Ramesh Patel',
      farmName: 'Ramesh Patel Farm',
      images: ['https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80'],
      emoji: '🥬',
      location: 'Bhopal Rural, Madhya Pradesh',
      available: true,
      grade: 'Grade A',
      isOrganic: true,
      isFreshToday: true,
      deliveryHours: 2,
      rating: 4.8,
      reviewsCount: 78,
      vendorTrustScore: 99,
      repeatBuyerRate: 92,
      harvestTime: 'Today 6:00 AM'
    },
    {
      id: 'prod-3',
      name: 'Sharbati Gold Wheat (MP Premium)',
      description: 'Famous Sehore Sharbati wheat grains, golden lustrous texture, high gluten strength for soft sweet chapatis.',
      category: 'grains',
      price: 48,
      unit: 'kg',
      quantity: 850,
      sellerId: 'usr-farmer-1',
      sellerName: 'Ramesh Patel',
      farmName: 'Narmada Valley Agro',
      images: ['https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600&auto=format&fit=crop&q=80'],
      emoji: '🌾',
      location: 'Sehore, Madhya Pradesh',
      available: true,
      grade: 'Grade A',
      isOrganic: false,
      isFreshToday: false,
      deliveryHours: 24,
      rating: 5.0,
      reviewsCount: 220,
      vendorTrustScore: 100,
      repeatBuyerRate: 95,
      harvestTime: 'Rabi Harvest 2026'
    },
    {
      id: 'prod-4',
      name: 'Nashik Red Onions',
      description: 'Pungent, dense three-layered dry red onions with long storage life and high dry-matter content.',
      category: 'vegetables',
      price: 36,
      unit: 'kg',
      quantity: 450,
      sellerId: 'usr-farmer-1',
      sellerName: 'Ramesh Patel',
      farmName: 'Maha-Agro Coop',
      images: ['https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?w=600&auto=format&fit=crop&q=80'],
      emoji: '🧅',
      location: 'Nashik, Maharashtra',
      available: true,
      grade: 'Grade A',
      isOrganic: false,
      isFreshToday: true,
      deliveryHours: 4,
      rating: 4.7,
      reviewsCount: 96,
      vendorTrustScore: 95,
      repeatBuyerRate: 84,
      harvestTime: 'Yesterday Evening'
    },
    {
      id: 'prod-5',
      name: 'Aloo Firm Potatoes (Chipsona/Jyoti)',
      description: 'Medium-large firm potatoes grown in well-drained sandy loam. Low sugar content ideal for boiling, frying, and curries.',
      category: 'vegetables',
      price: 24,
      unit: 'kg',
      quantity: 600,
      sellerId: 'usr-farmer-1',
      sellerName: 'Ramesh Patel',
      farmName: 'Malwa Tuber Farms',
      images: ['https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=600&auto=format&fit=crop&q=80'],
      emoji: '🥔',
      location: 'Indore, Madhya Pradesh',
      available: true,
      grade: 'Grade A',
      isOrganic: false,
      isFreshToday: true,
      deliveryHours: 3,
      rating: 4.6,
      reviewsCount: 88,
      vendorTrustScore: 94,
      repeatBuyerRate: 80,
      harvestTime: 'Yesterday Morning'
    },
    {
      id: 'prod-6',
      name: 'Yellow Gold Soybean (JS 20-34)',
      description: 'High oil and protein content soybean seeds. Machine cleaned, moisture tested below 10%, ready for oil milling or tofu.',
      category: 'grains',
      price: 52,
      unit: 'kg',
      quantity: 1200,
      sellerId: 'usr-farmer-1',
      sellerName: 'Ramesh Patel',
      farmName: 'Ujjain Krishi Sangathan',
      images: ['https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80'],
      emoji: '🌱',
      location: 'Ujjain, Madhya Pradesh',
      available: true,
      grade: 'Grade A',
      isOrganic: true,
      isFreshToday: false,
      deliveryHours: 48,
      rating: 4.9,
      reviewsCount: 165,
      vendorTrustScore: 97,
      repeatBuyerRate: 91,
      harvestTime: 'Kharif Harvest 2026'
    },
    {
      id: 'prod-7',
      name: 'Black Mustard Seeds (Rai / Sarson)',
      description: 'Bold dark pungent mustard seeds from Chambal valley. Cold pressed mustard oil test yields 38% pungent oil.',
      category: 'grains',
      price: 68,
      unit: 'kg',
      quantity: 350,
      sellerId: 'usr-farmer-1',
      sellerName: 'Ramesh Patel',
      farmName: 'Chambal Bio Farms',
      images: ['https://images.unsplash.com/photo-1509358271058-acd22cc93898?w=600&auto=format&fit=crop&q=80'],
      emoji: '🌿',
      location: 'Morena, Madhya Pradesh',
      available: true,
      grade: 'Grade A',
      isOrganic: true,
      isFreshToday: false,
      deliveryHours: 24,
      rating: 4.8,
      reviewsCount: 62,
      vendorTrustScore: 96,
      repeatBuyerRate: 87,
      harvestTime: 'Fresh Lot'
    },
    {
      id: 'prod-8',
      name: 'Guntur Sun-Dried Red Chillies',
      description: 'Deep red, glossy high-capsaicin chillies. Naturally sun-dried on clean tarpaulins without artificial coloring.',
      category: 'herbs',
      price: 180,
      unit: 'kg',
      quantity: 90,
      sellerId: 'usr-farmer-1',
      sellerName: 'Ramesh Patel',
      farmName: 'Deccan Spice Estate',
      images: ['https://images.unsplash.com/photo-1588252303782-cb80119abd6d?w=600&auto=format&fit=crop&q=80'],
      emoji: '🌶️',
      location: 'Guntur, Andhra Pradesh',
      available: true,
      grade: 'Grade A',
      isOrganic: true,
      isFreshToday: false,
      deliveryHours: 36,
      rating: 4.9,
      reviewsCount: 114,
      vendorTrustScore: 99,
      repeatBuyerRate: 93,
      harvestTime: 'Sun Dried This Week'
    }
  ];

  for (const p of productsData) {
    if (isMongoConnected) {
      await Product.findOneAndUpdate({ name: p.name }, p, { upsert: true });
    }
    await store.createProduct(p);
  }

  // 4. Mandi Rates
  const mandiRatesData = [
    {
      commodity: 'Wheat (Sharbati)',
      category: 'grains',
      emoji: '🌾',
      unit: 'quintal',
      price: 4850,
      previousPrice: 4720,
      changePercent: 2.75,
      trend: 'up',
      mandi: 'Sehore APMC Mandi',
      state: 'Madhya Pradesh',
      arrivalTonnes: 420,
      demandStatus: 'HIGH',
      history: [
        { day: 'Mon', price: 4680 },
        { day: 'Tue', price: 4710 },
        { day: 'Wed', price: 4700 },
        { day: 'Thu', price: 4740 },
        { day: 'Fri', price: 4790 },
        { day: 'Sat', price: 4850 }
      ]
    },
    {
      commodity: 'Soybean (Yellow)',
      category: 'grains',
      emoji: '🌱',
      unit: 'quintal',
      price: 4950,
      previousPrice: 5100,
      changePercent: -2.94,
      trend: 'down',
      mandi: 'Ujjain Krishi Upaj Mandi',
      state: 'Madhya Pradesh',
      arrivalTonnes: 650,
      demandStatus: 'STABLE',
      history: [
        { day: 'Mon', price: 5120 },
        { day: 'Tue', price: 5080 },
        { day: 'Wed', price: 5040 },
        { day: 'Thu', price: 5000 },
        { day: 'Fri', price: 4980 },
        { day: 'Sat', price: 4950 }
      ]
    },
    {
      commodity: 'Desi Tomatoes',
      category: 'vegetables',
      emoji: '🍅',
      unit: 'crate (25kg)',
      price: 820,
      previousPrice: 750,
      changePercent: 9.33,
      trend: 'up',
      mandi: 'Karond Mandi Bhopal',
      state: 'Madhya Pradesh',
      arrivalTonnes: 180,
      demandStatus: 'HIGH',
      history: [
        { day: 'Mon', price: 720 },
        { day: 'Tue', price: 740 },
        { day: 'Wed', price: 760 },
        { day: 'Thu', price: 775 },
        { day: 'Fri', price: 790 },
        { day: 'Sat', price: 820 }
      ]
    },
    {
      commodity: 'Red Onions',
      category: 'vegetables',
      emoji: '🧅',
      unit: 'quintal',
      price: 3600,
      previousPrice: 3800,
      changePercent: -5.26,
      trend: 'down',
      mandi: 'Lasalgaon APMC',
      state: 'Maharashtra',
      arrivalTonnes: 980,
      demandStatus: 'STABLE',
      history: [
        { day: 'Mon', price: 3850 },
        { day: 'Tue', price: 3800 },
        { day: 'Wed', price: 3750 },
        { day: 'Thu', price: 3700 },
        { day: 'Fri', price: 3650 },
        { day: 'Sat', price: 3600 }
      ]
    },
    {
      commodity: 'Mustard (Rai)',
      category: 'oilseeds',
      emoji: '🌿',
      unit: 'quintal',
      price: 5650,
      previousPrice: 5550,
      changePercent: 1.8,
      trend: 'up',
      mandi: 'Morena APMC',
      state: 'Madhya Pradesh',
      arrivalTonnes: 310,
      demandStatus: 'HIGH',
      history: [
        { day: 'Mon', price: 5480 },
        { day: 'Tue', price: 5510 },
        { day: 'Wed', price: 5540 },
        { day: 'Thu', price: 5580 },
        { day: 'Fri', price: 5610 },
        { day: 'Sat', price: 5650 }
      ]
    }
  ];

  for (const mr of mandiRatesData) {
    if (isMongoConnected) {
      await MarketRate.findOneAndUpdate(
        { commodity: mr.commodity, mandi: mr.mandi },
        mr,
        { upsert: true }
      );
    }
    await store.upsertMarketRate(mr);
  }

  // 5. Orders
  const ordersData = [
    {
      id: 'ord-1001',
      orderNumber: 'SM-2026-8941',
      buyerId: 'usr-buyer-1',
      buyerName: 'Priya Sharma',
      buyerPhone: '+91 94250 88912',
      items: [
        {
          productId: 'prod-1',
          name: 'Desi Heirloom Tomatoes',
          price: 32,
          quantity: 3,
          unit: 'kg',
          emoji: '🍅',
          sellerId: 'usr-farmer-1',
          farmName: 'Ramesh Patel Farm'
        },
        {
          productId: 'prod-2',
          name: 'Palak Tender Spinach',
          price: 18,
          quantity: 2,
          unit: 'bunch',
          emoji: '🥬',
          sellerId: 'usr-farmer-1',
          farmName: 'Ramesh Patel Farm'
        }
      ],
      total: 132,
      deliveryAddress: {
        street: 'Flat 402, Narmada Residency, Arera Colony',
        city: 'Bhopal',
        state: 'Madhya Pradesh',
        pincode: '462016'
      },
      paymentStatus: 'ESCROW_LOCKED',
      orderStatus: 'SHIPPED',
      rider: {
        name: 'Vikas Sharma (Soil Mates Green Courier)',
        phone: '+91 98260 12345',
        vehicle: 'E-Cargo MP-04-EA-9912',
        status: 'On the way to delivery address'
      },
      eta: '22 mins'
    }
  ];

  for (const o of ordersData) {
    if (isMongoConnected) {
      await Order.findOneAndUpdate({ orderNumber: o.orderNumber }, o, { upsert: true });
    }
    await store.createOrder(o);
  }

  console.log('[Seed] Database successfully seeded with 8 authentic agricultural commodities and mandi feeds.');
}

// Allow direct execution: `npx tsx server/src/db/seed.ts`
if (process.argv[1]?.endsWith('seed.ts') || process.argv[1]?.endsWith('seed.js')) {
  import('./connect').then(async ({ connectDB }) => {
    await connectDB();
    await seedDatabase();
    process.exit(0);
  });
}
