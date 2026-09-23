import {
  ProduceItem,
  VendorReview,
  MandiPriceItem,
  OrderItem,
  CropDiagnosis,
  LanguageMeta,
  FarmerDispatchOrder
} from '../types';

export const SUPPORTED_LANGUAGES: LanguageMeta[] = [
  { code: 'Hindi', name: 'Hindi', native: 'हिन्दी' },
  { code: 'English', name: 'English', native: 'English' },
  { code: 'Marathi', name: 'Marathi', native: 'मराठी' },
  { code: 'Tamil', name: 'Tamil', native: 'தமிழ்' },
  { code: 'Telugu', name: 'Telugu', native: 'తెలుగు' },
  { code: 'Kannada', name: 'Kannada', native: 'ಕನ್ನಡ' },
  { code: 'Punjabi', name: 'Punjabi', native: 'ਪੰਜਾਬੀ' },
  { code: 'Bengali', name: 'Bengali', native: 'বাংলা' }
];

export const INITIAL_PRODUCTS: ProduceItem[] = [
  {
    id: 'prod-1',
    name: 'Desi Tomatoes',
    category: 'vegetables',
    emoji: '🍅',
    farmName: 'Ramesh Patel Farm',
    location: 'Village Sonpur, Vidisha District, MP',
    pricePerKg: 32,
    unit: 'kg',
    availableKg: 150,
    rating: 4.8,
    reviewsCount: 234,
    vendorTrustScore: 98,
    repeatBuyerRate: 86,
    totalBatchesSold: 340,
    isFreshToday: true,
    deliveryHours: 2,
    farmerAadhaarVerified: true,
    harvestTime: 'Today 5:00 AM',
    grade: 'Grade A',
    description: 'Naturally ripened heirloom desi tomatoes rich in lycopene. Picked at dawn with zero cold storage delays.'
  },
  {
    id: 'prod-2',
    name: 'Palak Spinach',
    category: 'vegetables',
    emoji: '🥬',
    farmName: 'Sunita Devi Farm',
    location: 'Berasia Road, Bhopal, MP',
    pricePerKg: 18,
    unit: 'bunch',
    availableKg: 90,
    rating: 4.9,
    reviewsCount: 118,
    vendorTrustScore: 99,
    repeatBuyerRate: 91,
    totalBatchesSold: 180,
    isOrganic: true,
    isFreshToday: true,
    deliveryHours: 2,
    farmerAadhaarVerified: true,
    harvestTime: 'Today 6:00 AM',
    grade: 'Grade A',
    description: 'Certified organic tender spinach leaves grown with bio-compost and vermiculture.'
  },
  {
    id: 'prod-3',
    name: 'Aloo Potatoes',
    category: 'vegetables',
    emoji: '🥔',
    farmName: 'Vijay Kumar Farm',
    location: 'Sehore, MP',
    pricePerKg: 22,
    unit: 'kg',
    availableKg: 420,
    rating: 4.7,
    reviewsCount: 310,
    vendorTrustScore: 96,
    repeatBuyerRate: 82,
    totalBatchesSold: 520,
    discountPercent: 15,
    deliveryHours: 3,
    farmerAadhaarVerified: true,
    harvestTime: 'Yesterday Afternoon',
    grade: 'Grade A',
    description: 'Medium-size firm chips and curry potatoes directly harvested from red loamy soil.'
  },
  {
    id: 'prod-4',
    name: 'Red Onions',
    category: 'vegetables',
    emoji: '🧅',
    farmName: 'Lakshmi Farms',
    location: 'Hoshangabad, MP',
    pricePerKg: 45,
    unit: 'kg',
    availableKg: 280,
    rating: 4.6,
    reviewsCount: 184,
    vendorTrustScore: 95,
    repeatBuyerRate: 79,
    totalBatchesSold: 290,
    isFreshToday: true,
    deliveryHours: 2,
    farmerAadhaarVerified: true,
    harvestTime: 'Today 5:30 AM',
    grade: 'Grade A',
    description: 'Crisp, pungent Nashik red onions with long shelf-life and dry outer layers.'
  },
  {
    id: 'prod-5',
    name: 'Sweet Golden Corn (Makka)',
    category: 'grains',
    emoji: '🌽',
    farmName: 'Harish Lodhi Farm',
    location: 'Raisen, MP',
    pricePerKg: 28,
    unit: 'kg',
    availableKg: 180,
    rating: 4.8,
    reviewsCount: 92,
    isFreshToday: true,
    deliveryHours: 2,
    farmerAadhaarVerified: true,
    harvestTime: 'Today 5:45 AM',
    grade: 'Grade A',
    description: 'Plump and juicy sweet corn cobs plucked fresh from irrigated river plains.'
  },
  {
    id: 'prod-6',
    name: 'Sharbati Wheat (Sehore)',
    category: 'grains',
    emoji: '🌾',
    farmName: 'Kailash Chouhan Farm',
    location: 'Ashta, Sehore, MP',
    pricePerKg: 44,
    unit: 'kg',
    availableKg: 1200,
    rating: 5.0,
    reviewsCount: 420,
    isOrganic: true,
    deliveryHours: 24,
    farmerAadhaarVerified: true,
    harvestTime: 'Current Season Fresh Harvest',
    grade: 'Grade A',
    description: 'The golden grain of Madhya Pradesh, famous for softest rotis with natural sweetness.'
  },
  {
    id: 'prod-7',
    name: 'Fresh Cow Milk (A2 Gir)',
    category: 'dairy',
    emoji: '🥛',
    farmName: 'Gau Seva Dairy Cooperative',
    location: 'Kolar Road, Bhopal, MP',
    pricePerKg: 65,
    unit: 'Litre',
    availableKg: 85,
    rating: 4.9,
    reviewsCount: 512,
    isFreshToday: true,
    deliveryHours: 1,
    farmerAadhaarVerified: true,
    harvestTime: 'Today 5:15 AM Milking',
    grade: 'Grade A',
    description: 'Pure untreated chilled A2 milk from grass-fed indigenous cows, bottled in glass containers.'
  },
  {
    id: 'prod-8',
    name: 'Fresh Coriander (Dhaniya)',
    category: 'herbs',
    emoji: '🌿',
    farmName: 'Sunita Devi Farm',
    location: 'Berasia Road, Bhopal, MP',
    pricePerKg: 12,
    unit: 'bunch',
    availableKg: 60,
    rating: 4.8,
    reviewsCount: 88,
    isFreshToday: true,
    deliveryHours: 2,
    farmerAadhaarVerified: true,
    harvestTime: 'Today 6:15 AM',
    grade: 'Grade A',
    description: 'Aromatic broad-leaf coriander with crisp roots, perfect for fresh garnishing.'
  }
];

export const MANDI_PRICES: MandiPriceItem[] = [
  {
    id: 'm-1',
    crop: 'Tomato',
    emoji: '🍅',
    category: 'vegetables',
    unit: 'per kg · Grade A',
    price: 32,
    changePercent: 12,
    changeType: 'up',
    trendNote: 'Surging demand across Bhopal & Indore markets',
    mandi: 'Karond Mandi, Bhopal',
    demandStatus: 'HIGH',
    history: [
      { day: 'Mon', fullDate: 'Apr 20', price: 24, mandiAverage: 23 },
      { day: 'Tue', fullDate: 'Apr 21', price: 25, mandiAverage: 24 },
      { day: 'Wed', fullDate: 'Apr 22', price: 27, mandiAverage: 25 },
      { day: 'Thu', fullDate: 'Apr 23', price: 28, mandiAverage: 27 },
      { day: 'Fri', fullDate: 'Apr 24', price: 29, mandiAverage: 28 },
      { day: 'Sat', fullDate: 'Apr 25', price: 30, mandiAverage: 29 },
      { day: 'Today', fullDate: 'Apr 26', price: 32, mandiAverage: 30 }
    ]
  },
  {
    id: 'm-2',
    crop: 'Onion',
    emoji: '🧅',
    category: 'vegetables',
    unit: 'per kg',
    price: 45,
    changePercent: 5,
    changeType: 'down',
    trendNote: 'Incoming arrivals from Maharashtra easing price',
    mandi: 'Vidisha Mandi',
    demandStatus: 'STABLE',
    history: [
      { day: 'Mon', fullDate: 'Apr 20', price: 49, mandiAverage: 48 },
      { day: 'Tue', fullDate: 'Apr 21', price: 48, mandiAverage: 47 },
      { day: 'Wed', fullDate: 'Apr 22', price: 47, mandiAverage: 46 },
      { day: 'Thu', fullDate: 'Apr 23', price: 47, mandiAverage: 46 },
      { day: 'Fri', fullDate: 'Apr 24', price: 46, mandiAverage: 45 },
      { day: 'Sat', fullDate: 'Apr 25', price: 46, mandiAverage: 45 },
      { day: 'Today', fullDate: 'Apr 26', price: 45, mandiAverage: 44 }
    ]
  },
  {
    id: 'm-3',
    crop: 'Potato',
    emoji: '🥔',
    category: 'vegetables',
    unit: 'per kg',
    price: 22,
    changePercent: 3,
    changeType: 'up',
    trendNote: 'Steady procurement from cold storages',
    mandi: 'Karond Mandi, Bhopal',
    demandStatus: 'STABLE',
    history: [
      { day: 'Mon', fullDate: 'Apr 20', price: 20, mandiAverage: 19 },
      { day: 'Tue', fullDate: 'Apr 21', price: 20, mandiAverage: 20 },
      { day: 'Wed', fullDate: 'Apr 22', price: 21, mandiAverage: 20 },
      { day: 'Thu', fullDate: 'Apr 23', price: 21, mandiAverage: 21 },
      { day: 'Fri', fullDate: 'Apr 24', price: 21, mandiAverage: 21 },
      { day: 'Sat', fullDate: 'Apr 25', price: 22, mandiAverage: 21 },
      { day: 'Today', fullDate: 'Apr 26', price: 22, mandiAverage: 21 }
    ]
  },
  {
    id: 'm-4',
    crop: 'Palak',
    emoji: '🥬',
    category: 'vegetables',
    unit: 'per bunch',
    price: 18,
    changePercent: 8,
    changeType: 'up',
    trendNote: 'Morning supply cleared quickly',
    mandi: 'Berasia Mandi',
    demandStatus: 'HIGH',
    history: [
      { day: 'Mon', fullDate: 'Apr 20', price: 14, mandiAverage: 14 },
      { day: 'Tue', fullDate: 'Apr 21', price: 15, mandiAverage: 14 },
      { day: 'Wed', fullDate: 'Apr 22', price: 15, mandiAverage: 15 },
      { day: 'Thu', fullDate: 'Apr 23', price: 16, mandiAverage: 15 },
      { day: 'Fri', fullDate: 'Apr 24', price: 17, mandiAverage: 16 },
      { day: 'Sat', fullDate: 'Apr 25', price: 17, mandiAverage: 16 },
      { day: 'Today', fullDate: 'Apr 26', price: 18, mandiAverage: 17 }
    ]
  },
  {
    id: 'm-5',
    crop: 'Wheat (Sharbati)',
    emoji: '🌾',
    category: 'grains',
    unit: 'per quintal',
    price: 2180,
    changePercent: 2,
    changeType: 'up',
    trendNote: 'Government MSP support and flour mill interest',
    mandi: 'Sehore Krishi Upaj Mandi',
    demandStatus: 'HIGH',
    history: [
      { day: 'Mon', fullDate: 'Apr 20', price: 2120, mandiAverage: 2100 },
      { day: 'Tue', fullDate: 'Apr 21', price: 2130, mandiAverage: 2110 },
      { day: 'Wed', fullDate: 'Apr 22', price: 2140, mandiAverage: 2125 },
      { day: 'Thu', fullDate: 'Apr 23', price: 2150, mandiAverage: 2130 },
      { day: 'Fri', fullDate: 'Apr 24', price: 2160, mandiAverage: 2140 },
      { day: 'Sat', fullDate: 'Apr 25', price: 2170, mandiAverage: 2150 },
      { day: 'Today', fullDate: 'Apr 26', price: 2180, mandiAverage: 2160 }
    ]
  },
  {
    id: 'm-6',
    crop: 'Soybean (Yellow)',
    emoji: '🫘',
    category: 'grains',
    unit: 'per quintal',
    price: 4450,
    changePercent: 1,
    changeType: 'down',
    trendNote: 'Crushing plants awaiting quality moisture test',
    mandi: 'Dewas Mandi',
    demandStatus: 'STABLE',
    history: [
      { day: 'Mon', fullDate: 'Apr 20', price: 4520, mandiAverage: 4500 },
      { day: 'Tue', fullDate: 'Apr 21', price: 4500, mandiAverage: 4480 },
      { day: 'Wed', fullDate: 'Apr 22', price: 4490, mandiAverage: 4470 },
      { day: 'Thu', fullDate: 'Apr 23', price: 4480, mandiAverage: 4460 },
      { day: 'Fri', fullDate: 'Apr 24', price: 4470, mandiAverage: 4450 },
      { day: 'Sat', fullDate: 'Apr 25', price: 4460, mandiAverage: 4440 },
      { day: 'Today', fullDate: 'Apr 26', price: 4450, mandiAverage: 4430 }
    ]
  },
  {
    id: 'm-7',
    crop: 'Chana Dal',
    emoji: '🟡',
    category: 'grains',
    unit: 'per kg',
    price: 95,
    changePercent: 6,
    changeType: 'up',
    trendNote: 'Festival demand restocking in wholesale',
    mandi: 'Indore Mandi',
    demandStatus: 'HIGH',
    history: [
      { day: 'Mon', fullDate: 'Apr 20', price: 88, mandiAverage: 87 },
      { day: 'Tue', fullDate: 'Apr 21', price: 89, mandiAverage: 88 },
      { day: 'Wed', fullDate: 'Apr 22', price: 90, mandiAverage: 89 },
      { day: 'Thu', fullDate: 'Apr 23', price: 91, mandiAverage: 90 },
      { day: 'Fri', fullDate: 'Apr 24', price: 92, mandiAverage: 91 },
      { day: 'Sat', fullDate: 'Apr 25', price: 94, mandiAverage: 92 },
      { day: 'Today', fullDate: 'Apr 26', price: 95, mandiAverage: 93 }
    ]
  },
  {
    id: 'm-8',
    crop: 'Desi Guava',
    emoji: '🍈',
    category: 'fruits',
    unit: 'per kg',
    price: 55,
    changePercent: 4,
    changeType: 'up',
    trendNote: 'Prime harvest season in full swing',
    mandi: 'Hoshangabad Fruit Market',
    demandStatus: 'HIGH',
    history: [
      { day: 'Mon', fullDate: 'Apr 20', price: 48, mandiAverage: 47 },
      { day: 'Tue', fullDate: 'Apr 21', price: 50, mandiAverage: 48 },
      { day: 'Wed', fullDate: 'Apr 22', price: 50, mandiAverage: 49 },
      { day: 'Thu', fullDate: 'Apr 23', price: 52, mandiAverage: 50 },
      { day: 'Fri', fullDate: 'Apr 24', price: 52, mandiAverage: 51 },
      { day: 'Sat', fullDate: 'Apr 25', price: 54, mandiAverage: 52 },
      { day: 'Today', fullDate: 'Apr 26', price: 55, mandiAverage: 53 }
    ]
  }
];

export const PRODUCE_TRACEABILITY_DATABASE: Record<string, import('../types').ProduceTraceabilityData> = {
  'prod-1': {
    produceId: 'prod-1',
    produceName: 'Desi Tomatoes',
    emoji: '🍅',
    batchNumber: '#BATCH-MP-2026-TM89',
    blockHash: '0x7f9a2b84c1e90d3e8a452174c8b63e9f5a7d18e2',
    contractAddress: '0x3F8821B3f2c79B4890A...SOIL_CHAIN_V2',
    farmer: {
      name: 'Ramesh Patel',
      aadhaarStatus: 'Verified',
      village: 'Village Sonpur',
      district: 'Vidisha, Madhya Pradesh',
      farmSizeAcres: 8.5,
      soilType: 'Deep Black Cotton Loam',
      organicCertified: true
    },
    harvest: {
      date: 'Today, 26 April 2026',
      exactTime: '05:00 AM IST',
      grade: 'Grade A (Export Quality)',
      moisturePercent: 93.2,
      chemicalResiduePPM: 0.00,
      certificationLab: 'SGS Agri-Certified Labs (Govt. Reg. MP-AGR-402)'
    },
    transitHistory: [
      {
        id: 'chk-1',
        stage: 'Farm Gate Handover',
        location: 'Sonpur Farm Aggregation Point, Vidisha',
        timestamp: '05:45 AM',
        handler: 'Vidisha Krishi Producer Org (FPO)',
        status: 'completed',
        temperature: '12.1°C',
        details: 'Initial sorting & digital tare weighing (150kg). QR batch code sealed.',
        blockHash: '0x1a89c...2f01'
      },
      {
        id: 'chk-2',
        stage: 'Pre-Cooling & Quality Scan',
        location: 'Vidisha Cold Hub (Chamber #2)',
        timestamp: '06:30 AM',
        handler: 'AgriCold Logistics Network',
        status: 'completed',
        temperature: '10.5°C',
        details: 'Optical spectrometry test for ripeness (Brix 4.8). Zero damage logged.',
        blockHash: '0x4b72e...99c4'
      },
      {
        id: 'chk-3',
        stage: 'Climate-Controlled Reefer Transit',
        location: 'Bhopal-Vidisha Expressway (NH-146)',
        timestamp: '07:20 AM',
        handler: 'Reefer Van #MP-04-E-8821',
        status: 'completed',
        temperature: '11.2°C',
        details: 'Real-time GPS tracking & IoT temperature sensor logged every 10 min.',
        blockHash: '0x88d31...0a2b'
      },
      {
        id: 'chk-4',
        stage: 'City Hub Distribution Center',
        location: 'Bhopal Central Agri Fulfillment Center',
        timestamp: '08:45 AM',
        handler: 'Soil Mates Last-Mile Hub',
        status: 'completed',
        temperature: '11.8°C',
        details: 'Dispatched to local courier zone with thermal insulated panniers.',
        blockHash: '0x99e4f...11cd'
      },
      {
        id: 'chk-5',
        stage: 'Last-Mile Doorstep Delivery',
        location: 'Arera Colony / Bhopal Metro',
        timestamp: '11:30 AM (In Progress)',
        handler: 'Rider Mukesh Kumar (Rider #402)',
        status: 'current',
        temperature: '12.0°C',
        details: 'Contactless OTP delivery hand-off to consumer.',
        blockHash: '0xef021...pending'
      }
    ]
  },
  'prod-2': {
    produceId: 'prod-2',
    produceName: 'Palak Spinach',
    emoji: '🥬',
    batchNumber: '#BATCH-MP-2026-PL42',
    blockHash: '0x3c990a41d8e7b1a03f982145cde12098ba4f8901',
    contractAddress: '0x3F8821B3f2c79B4890A...SOIL_CHAIN_V2',
    farmer: {
      name: 'Sunita Devi',
      aadhaarStatus: 'Verified',
      village: 'Gram Berasia',
      district: 'Bhopal, Madhya Pradesh',
      farmSizeAcres: 4.2,
      soilType: 'Organic Vermicompost Enriched',
      organicCertified: true
    },
    harvest: {
      date: 'Today, 26 April 2026',
      exactTime: '06:00 AM IST',
      grade: 'Grade A (100% Bio-Organic)',
      moisturePercent: 91.5,
      chemicalResiduePPM: 0.00,
      certificationLab: 'Jaivik Bharat / MP Organic Council'
    },
    transitHistory: [
      {
        id: 'chk-pl-1',
        stage: 'Morning Harvest Plucking',
        location: 'Berasia Road Farm, Bhopal',
        timestamp: '06:00 AM',
        handler: 'Sunita Devi Farm Self-Packing',
        status: 'completed',
        temperature: '13.0°C',
        details: 'Plucked with natural moisture. Bunch banded with biodegradable fiber.',
        blockHash: '0x22a10...901e'
      },
      {
        id: 'chk-pl-2',
        stage: 'Hydro-Chilling & Packaging',
        location: 'Berasia Organic Collection Point',
        timestamp: '06:45 AM',
        handler: 'GreenRoots Direct Co-op',
        status: 'completed',
        temperature: '9.8°C',
        details: 'Chilled water misted to preserve crisp leaves and chlorophyll.',
        blockHash: '0x77c44...bb81'
      },
      {
        id: 'chk-pl-3',
        stage: 'Direct Urban Shuttle',
        location: 'Kolar & Arera Distribution Ring',
        timestamp: '08:00 AM',
        handler: 'Soil Mates Express EV Van',
        status: 'completed',
        temperature: '11.0°C',
        details: 'Zero emission electric delivery transport.',
        blockHash: '0x55d91...33a2'
      },
      {
        id: 'chk-pl-4',
        stage: 'Customer Bag Allocation',
        location: 'Bhopal Hub',
        timestamp: '09:15 AM',
        handler: 'Soil Mates Packaging Staff',
        status: 'current',
        temperature: '11.5°C',
        details: 'Packed into customer basket for 2-hour doorstep delivery.',
        blockHash: '0x66f12...pending'
      }
    ]
  },
  'prod-3': {
    produceId: 'prod-3',
    produceName: 'Aloo Potatoes',
    emoji: '🥔',
    batchNumber: '#BATCH-MP-2026-AL10',
    blockHash: '0x1d449a02fcb88190de432174c8b63e9f5a7d9090',
    contractAddress: '0x3F8821B3f2c79B4890A...SOIL_CHAIN_V2',
    farmer: {
      name: 'Vijay Kumar',
      aadhaarStatus: 'Verified',
      village: 'Gram Bilkisganj',
      district: 'Sehore, Madhya Pradesh',
      farmSizeAcres: 14.0,
      soilType: 'Red Alluvial Sandy Loam',
      organicCertified: false
    },
    harvest: {
      date: 'Yesterday, 25 April 2026',
      exactTime: '03:30 PM IST',
      grade: 'Grade A (Table & Chip Variety)',
      moisturePercent: 78.0,
      chemicalResiduePPM: 0.01,
      certificationLab: 'Central Potato Research Institute (CPRI) Standard'
    },
    transitHistory: [
      {
        id: 'chk-al-1',
        stage: 'Mechanical Digger Sorting',
        location: 'Bilkisganj Farm Field #3',
        timestamp: 'Yesterday 04:00 PM',
        handler: 'Vijay Kumar Farm Labor',
        status: 'completed',
        temperature: '18.0°C',
        details: 'Cured skin potatoes packed in 50kg aerated jute bags.',
        blockHash: '0x88e10...44cc'
      },
      {
        id: 'chk-al-2',
        stage: 'Regional Mandi Tare Weight',
        location: 'Sehore Krishi Upaj Mandi Yard',
        timestamp: 'Yesterday 06:15 PM',
        handler: 'APMC Authorized Surveyor',
        status: 'completed',
        temperature: '16.5°C',
        details: 'Moisture and starch density test verified.',
        blockHash: '0x33b91...77d0'
      },
      {
        id: 'chk-al-3',
        stage: 'Wholesale Platform Ingest',
        location: 'Karond Hub Bhopal',
        timestamp: 'Today 06:00 AM',
        handler: 'Soil Mates Logistics',
        status: 'completed',
        temperature: '15.0°C',
        details: 'Repacked in eco-friendly consumer portions (1kg, 2kg, 5kg).',
        blockHash: '0x11e44...88ff'
      }
    ]
  },
  'prod-4': {
    produceId: 'prod-4',
    produceName: 'Red Onions',
    emoji: '🧅',
    batchNumber: '#BATCH-MP-2026-ON33',
    blockHash: '0x5e221b04fcb88190de432174c8b63e9f5a7d7711',
    contractAddress: '0x3F8821B3f2c79B4890A...SOIL_CHAIN_V2',
    farmer: {
      name: 'Lakshmi Farms',
      aadhaarStatus: 'Verified',
      village: 'Babai Khurd',
      district: 'Hoshangabad, Madhya Pradesh',
      farmSizeAcres: 12.0,
      soilType: 'Narmada River Alluvial Soil',
      organicCertified: false
    },
    harvest: {
      date: 'Today, 26 April 2026',
      exactTime: '05:30 AM IST',
      grade: 'Grade A (Export Pungency Nashik Clone)',
      moisturePercent: 82.0,
      chemicalResiduePPM: 0.00,
      certificationLab: 'Nafed Agri Quality Verification'
    },
    transitHistory: [
      {
        id: 'chk-on-1',
        stage: 'Curing & Dry Outer Sheaf Trimming',
        location: 'Babai Field Aggregation Shed',
        timestamp: '05:30 AM',
        handler: 'Lakshmi Farms Cooperative',
        status: 'completed',
        temperature: '19.0°C',
        details: 'Double skin quality check, neck trimmed to prevent fungus.',
        blockHash: '0x44d11...33aa'
      },
      {
        id: 'chk-on-2',
        stage: 'High-Speed Logistics Van',
        location: 'Hoshangabad-Bhopal Highway',
        timestamp: '07:00 AM',
        handler: 'AgriTransit Fleet #12',
        status: 'completed',
        temperature: '18.2°C',
        details: 'Arrived at Bhopal Distribution Center in under 2 hours.',
        blockHash: '0x99c88...11ef'
      }
    ]
  },
  'prod-6': {
    produceId: 'prod-6',
    produceName: 'Sharbati Wheat (Sehore)',
    emoji: '🌾',
    batchNumber: '#BATCH-MP-2026-WH90',
    blockHash: '0x88d90a02fcb88190de432174c8b63e9f5a7d2233',
    contractAddress: '0x3F8821B3f2c79B4890A...SOIL_CHAIN_V2',
    farmer: {
      name: 'Kailash Chouhan',
      aadhaarStatus: 'Verified',
      village: 'Ashta Village',
      district: 'Sehore, Madhya Pradesh',
      farmSizeAcres: 25.0,
      soilType: 'Malwa Black Soil',
      organicCertified: true
    },
    harvest: {
      date: 'Current Season Fresh Harvest',
      exactTime: 'Season Batch Harvest',
      grade: 'Grade A (Golden Lustre Sharbati)',
      moisturePercent: 10.8,
      chemicalResiduePPM: 0.00,
      certificationLab: 'ICAR-IARI Grain Standard Certified'
    },
    transitHistory: [
      {
        id: 'chk-wh-1',
        stage: 'Threshing & Air Cleaning',
        location: 'Ashta Grain Processing Center',
        timestamp: 'Apr 22, 10:00 AM',
        handler: 'Kailash Chouhan Farm',
        status: 'completed',
        details: 'Triple sifted grain to remove husk and dust particles.',
        blockHash: '0x12a99...33de'
      },
      {
        id: 'chk-wh-2',
        stage: 'Sealed Jute Bag Packing',
        location: 'Sehore Krishi Mandi Warehouse',
        timestamp: 'Apr 23, 02:00 PM',
        handler: 'Warehousing Development Authority (WDRA)',
        status: 'completed',
        details: 'Stored in moisture-free pest resistant silos.',
        blockHash: '0x55f88...77aa'
      }
    ]
  }
};


export const SAMPLE_DIAGNOSES: CropDiagnosis[] = [
  {
    id: 'diag-tomato-early-blight',
    cropName: 'Tomato',
    diseaseName: 'Tomato Early Blight',
    scientificName: 'Alternaria solani · Fungal disease',
    severity: 'high',
    confidence: 94,
    detectedVisual: '🍅',
    urgencyDays: '3-5 days',
    symptoms: [
      'Dark brown concentric ring spots ("target board") on lower leaves',
      'Yellow halo perimeter around leaf lesions with drying margins',
      'Stem dark cankers forming near soil surface',
      'Lower foliage premature shedding if untreated'
    ],
    treatmentSteps: [
      'Apply Mancozeb 75% WP @ 2.5g / Litre water foliar spray immediately',
      'Prune and safely burn or compost infected lower foliage beyond field boundary',
      'Shift irrigation to early morning drip; strictly avoid overhead wetting of leaves',
      'Repeat protective fungicide spray every 7 days for 3 consecutive weeks'
    ],
    recommendedProduct: {
      name: 'Mancozeb 75% WP (Contact Fungicide 500g)',
      dosage: '2.5g per Litre water',
      price: 280
    },
    hindiNarration: 'आपके टमाटर की फसल में अर्ली ब्लाइट यानी अगेती झुलसा रोग पाया गया है। 94% सटीकता से जांच हुई है। तुरंत मैन्कोजेब 75% WP को 2.5 ग्राम प्रति लीटर पानी में घोलकर छिड़काव करें। नीचे की संक्रमित पत्तियों को तोड़कर खेत से दूर नष्ट करें। ओवरहेड पानी देने से बचें।',
    englishNarration: 'Tomato Early Blight detected with 94% AI confidence. Fungal pathogen Alternaria solani. Spray Mancozeb 75% WP at 2.5 grams per liter of water. Prune infected leaves and avoid overhead watering.'
  },
  {
    id: 'diag-wheat-rust',
    cropName: 'Wheat',
    diseaseName: 'Wheat Brown / Leaf Rust',
    scientificName: 'Puccinia triticina · Fungal airborne rust',
    severity: 'medium',
    confidence: 88,
    detectedVisual: '🌾',
    urgencyDays: '5-7 days',
    symptoms: [
      'Small, round orange-brown pustules scattered erratically on leaf blades',
      'Dusty spore powder rubs off onto fingers when leaf is touched',
      'Reduced photosynthetic capacity causing stunted grain filling'
    ],
    treatmentSteps: [
      'Foliar application of Propiconazole 25% EC @ 1ml / Litre water',
      'Ensure balanced Nitrogen fertilization; avoid excessive urea boost',
      'Monitor nearby bunds and secondary grass weeds',
      'Re-examine plot 10 days post application'
    ],
    recommendedProduct: {
      name: 'Propiconazole 25% EC (Systemic Fungicide 250ml)',
      dosage: '1ml per Litre water',
      price: 340
    },
    hindiNarration: 'गेहूं की पत्तियों पर भूरा रतुआ यानी लीफ रस्ट के लक्षण हैं। 88% सटीकता मिली है। प्रोपिकोनाज़ोल 25% EC का 1 मिली प्रति लीटर पानी की दर से छिड़काव करें। यूरिया का अत्यधिक उपयोग न करें।',
    englishNarration: 'Wheat Leaf Rust detected with 88% confidence. Apply Propiconazole 25% EC at 1 milliliter per liter water. Maintain balanced fertilization.'
  },
  {
    id: 'diag-potato-late-blight',
    cropName: 'Potato',
    diseaseName: 'Potato Late Blight',
    scientificName: 'Phytophthora infestans · Water mold blight',
    severity: 'high',
    confidence: 96,
    detectedVisual: '🥔',
    urgencyDays: '24-48 hours',
    symptoms: [
      'Water-soaked dark lesions on leaf tips expanding rapidly in humid cold',
      'White fluffy mildew visible on leaf undersides during early morning dew',
      'Foul rotting odor and dark brown tuber decay risk'
    ],
    treatmentSteps: [
      'Immediate spray of Cymoxanil 8% + Mancozeb 64% WP @ 3g/L',
      'Ensure proper earthing up to protect developing tubers from washing spores',
      'Halt all sprinkler irrigation until canopy dries'
    ],
    recommendedProduct: {
      name: 'Curzate M8 (Cymoxanil + Mancozeb 600g)',
      dosage: '3g per Litre water',
      price: 490
    },
    hindiNarration: 'आलू की फसल में पछेती झुलसा यानी लेट ब्लाइट के लक्षण हैं। 96% सटीकता है। यह बेहद गंभीर रोग है। तुरंत साइमोक्सानिल और मैन्कोजेब युक्त कवकनाशी का 3 ग्राम प्रति लीटर की दर से छिड़काव करें।',
    englishNarration: 'Potato Late Blight identified with 96% AI confidence. Highly urgent. Spray Cymoxanil + Mancozeb at 3 grams per liter water immediately.'
  }
];

export const INITIAL_ORDERS: OrderItem[] = [
  {
    id: 'ord-1',
    orderNumber: '#SM-2026-4821',
    dateStr: 'Today, 8:15 AM',
    status: 'in_transit',
    statusLabel: 'In Transit',
    itemsSummary: '🍅 Tomatoes 2kg · 🥬 Palak 3 bunch · 🧅 Onions 1kg',
    pickupInfo: 'Pickup done 9:20 AM from Vidisha Hub',
    totalAmount: 155,
    eta: '11:30 AM (approx 15 mins)',
    riderName: 'Mukesh Kumar (Rider #402)',
    riderPhone: '+91 94251 09871',
    steps: [
      { title: 'Order Confirmed', description: 'Payment ₹155 received via UPI', timestamp: '8:15 AM', status: 'done' },
      { title: 'Farmer Notified', description: 'Ramesh Patel confirmed harvest ready', timestamp: '8:30 AM', status: 'done' },
      { title: 'Pickup Completed', description: 'Quality checked at Vidisha Agri Hub', timestamp: '9:20 AM', status: 'done' },
      { title: 'Out for Delivery', description: 'Rider Mukesh Kumar on route to Arera Colony', timestamp: '10:05 AM', status: 'active' },
      { title: 'Delivered', description: 'Contactless or OTP confirmation at doorstep', timestamp: 'Est. 11:30 AM', status: 'pending' }
    ],
    blockchainTrail: {
      originVerified: true,
      qualityCertified: true,
      coldChainMaintained: true,
      deliveryPartnerAssigned: true,
      otpDelivered: false
    }
  },
  {
    id: 'ord-2',
    orderNumber: '#SM-2026-4799',
    dateStr: 'Yesterday, 7:00 AM',
    status: 'delivered',
    statusLabel: 'Delivered',
    itemsSummary: '🥔 Potatoes 5kg · 🌽 Sweet Corn 2kg',
    pickupInfo: 'Delivered to Arera Colony, Bhopal',
    totalAmount: 166,
    eta: 'Delivered at 10:45 AM',
    riderName: 'Deepak Sharma',
    riderPhone: '+91 98932 44120',
    steps: [
      { title: 'Order Confirmed', description: 'Payment ₹166 received', timestamp: 'Yesterday 7:00 AM', status: 'done' },
      { title: 'Farmer Notified', description: 'Vijay Kumar harvested lot', timestamp: 'Yesterday 7:30 AM', status: 'done' },
      { title: 'Pickup Completed', description: 'Sehore Hub dispatch', timestamp: 'Yesterday 8:40 AM', status: 'done' },
      { title: 'Out for Delivery', description: 'Rider Deepak Sharma on way', timestamp: 'Yesterday 9:50 AM', status: 'done' },
      { title: 'Delivered', description: 'Delivered & verified by customer OTP', timestamp: 'Yesterday 10:45 AM', status: 'done' }
    ],
    blockchainTrail: {
      originVerified: true,
      qualityCertified: true,
      coldChainMaintained: true,
      deliveryPartnerAssigned: true,
      otpDelivered: true
    }
  },
  {
    id: 'ord-3',
    orderNumber: '#SM-2026-4750',
    dateStr: 'April 24, 9:00 AM',
    status: 'processing',
    statusLabel: 'Processing',
    itemsSummary: '🌾 Sharbati Wheat 20kg (Bulk Sealed Bag)',
    pickupInfo: 'Milling & grain bagging in progress',
    totalAmount: 880,
    eta: 'Tomorrow Morning',
    riderName: 'Assigned on Dispatch',
    riderPhone: '+91 98260 12345',
    steps: [
      { title: 'Order Confirmed', description: 'Prepaid order booked', timestamp: 'Apr 24, 9:00 AM', status: 'done' },
      { title: 'Farmer Bagging', description: 'Moisture certified grade packed', timestamp: 'Apr 24, 11:30 AM', status: 'active' },
      { title: 'Logistics Pickup', description: 'Truck scheduled', timestamp: 'Pending', status: 'pending' },
      { title: 'Out for Delivery', description: 'Local transit to consumer', timestamp: 'Pending', status: 'pending' },
      { title: 'Delivered', description: 'Final drop-off', timestamp: 'Pending', status: 'pending' }
    ],
    blockchainTrail: {
      originVerified: true,
      qualityCertified: true,
      coldChainMaintained: true,
      deliveryPartnerAssigned: false,
      otpDelivered: false
    }
  }
];

export const INITIAL_VENDOR_REVIEWS: VendorReview[] = [
  {
    id: 'rev-1',
    produceId: 'prod-1',
    farmerName: 'Ramesh Patel Farm',
    reviewerName: 'Ananya Sengupta',
    reviewerLocation: 'Arera Colony, Bhopal',
    rating: 5,
    date: 'Yesterday',
    comment: 'Directly harvested taste! No chemical smell at all, ripe, firm and juicy. Even the blockchain certificate verified 0.00 ppm pesticide residue. Will order weekly!',
    verifiedBuyer: true,
    tags: ['Super Fresh', 'Zero Chemicals', 'Farm Gate Pickup'],
    helpfulCount: 24
  },
  {
    id: 'rev-2',
    produceId: 'prod-1',
    farmerName: 'Ramesh Patel Farm',
    reviewerName: 'Rajesh Verma',
    reviewerLocation: 'MP Nagar, Zone-II',
    rating: 5,
    date: '2 days ago',
    comment: 'Ordered 4kg for home tomato puree and salads. Delivered in breathable cardboard cartons without a single dented piece. Ramesh ji is a genuinely hardworking farmer.',
    verifiedBuyer: true,
    tags: ['Great Packing', 'Heirloom Taste'],
    helpfulCount: 18
  },
  {
    id: 'rev-3',
    produceId: 'prod-1',
    farmerName: 'Ramesh Patel Farm',
    reviewerName: 'Meena Joshi',
    reviewerLocation: 'Gulmohar Colony',
    rating: 4,
    date: '4 days ago',
    comment: 'Authentic desi tart flavor. Much better than supermarket hybrid varieties that taste watery. Arrived within 90 minutes of morning order.',
    verifiedBuyer: true,
    tags: ['Prompt Delivery', 'Sweet & Tart'],
    helpfulCount: 9
  },
  {
    id: 'rev-4',
    produceId: 'prod-2',
    farmerName: 'Sunita Devi Farm',
    reviewerName: 'Dr. Kavita Sharma',
    reviewerLocation: 'Bhopal Central',
    rating: 5,
    date: 'Yesterday',
    comment: 'Crisp green leaves, clean roots, zero yellowing. Truly organic palak grown with bio-vermicompost. Cooked paneer palak within 2 hours of plucking!',
    verifiedBuyer: true,
    tags: ['100% Organic', 'Zero Chemicals', 'Tender Leaves'],
    helpfulCount: 31
  },
  {
    id: 'rev-5',
    produceId: 'prod-2',
    farmerName: 'Sunita Devi Farm',
    reviewerName: 'Amit Chouhan',
    reviewerLocation: 'Kolar Road',
    rating: 5,
    date: '3 days ago',
    comment: 'Verified Aadhaar farmer with authentic lab test. No mud contamination and very fresh aroma. Great initiative connecting us directly.',
    verifiedBuyer: true,
    tags: ['Verified Farmer', 'Clean Produce'],
    helpfulCount: 14
  },
  {
    id: 'rev-6',
    produceId: 'prod-3',
    farmerName: 'Vijay Kumar Farm',
    reviewerName: 'Deepa Nambiar',
    reviewerLocation: 'Shahpura, Bhopal',
    rating: 5,
    date: '3 days ago',
    comment: 'Firm medium-sized potatoes from red loamy soil. Thin skin, no green eyes or sproutings. Made delicious aloo gobi for dinner.',
    verifiedBuyer: true,
    tags: ['Great Value', 'Long Shelf Life'],
    helpfulCount: 12
  },
  {
    id: 'rev-7',
    produceId: 'prod-4',
    farmerName: 'Lakshmi Farms',
    reviewerName: 'Rohini Dixit',
    reviewerLocation: 'Habibganj, Bhopal',
    rating: 5,
    date: '5 days ago',
    comment: 'Pungent, dry outer skins, uniform size. Very durable onions that will easily stay good for 3-4 weeks. Worth every rupee.',
    verifiedBuyer: true,
    tags: ['Pungent & Crisp', 'Dry Outer Layers'],
    helpfulCount: 16
  }
];

export const INITIAL_FARMER_DISPATCHES: FarmerDispatchOrder[] = [
  {
    id: 'f-disp-1',
    batchNumber: 'LOT-TOM-2026-0923',
    cropName: 'Desi Heirloom Tomatoes',
    emoji: '🍅',
    quantityKg: 120,
    crateCount: 6,
    totalPayout: 3840,
    buyerName: 'Priya Sharma (Urban Consumer Group)',
    buyerType: 'consumer',
    destinationAddress: 'Flat 402, Green Meadows, Arera Colony, E-Sector',
    destinationCity: 'Bhopal, MP · PIN 462016',
    distanceToDestinationKm: 18.4,
    handoverOtp: '7842',
    isOtpVerified: false,
    harvestDate: 'Today 5:30 AM',
    payoutStatus: 'escrow_locked',
    rider: {
      name: 'Suresh Kumar',
      phone: '+91 98260 11928',
      vehicle: 'Hero Splendor Cargo · MP-04-EA-4921',
      rating: 4.9,
      completedPickups: 342,
      status: 'en_route_to_farm',
      isComingToFarmer: true,
      distanceToFarmKm: 2.8,
      etaToFarmMinutes: 14,
      currentLocationName: 'Near Vidisha Bypass Chowk (approaching Sonpur Farm Road)',
      temperatureReading: '12°C Insulated Crate Box'
    }
  },
  {
    id: 'f-disp-2',
    batchNumber: 'LOT-PLK-2026-0923',
    cropName: 'Crisp Palak Spinach',
    emoji: '🥬',
    quantityKg: 60,
    crateCount: 3,
    totalPayout: 1080,
    buyerName: 'Bhopal Fresh Mart (Vendor)',
    buyerType: 'vendor',
    destinationAddress: 'Wholesale Bay 4, Karond APMC Mandi',
    destinationCity: 'Bhopal, MP · PIN 462038',
    distanceToDestinationKm: 12.2,
    handoverOtp: '3910',
    isOtpVerified: false,
    harvestDate: 'Today 6:15 AM',
    payoutStatus: 'escrow_locked',
    rider: {
      name: 'Manoj Verma',
      phone: '+91 97551 28940',
      vehicle: 'Mahindra Bolero Maxi Truck · MP-04-TA-1980',
      rating: 4.8,
      completedPickups: 510,
      status: 'at_farmgate',
      isComingToFarmer: true,
      distanceToFarmKm: 0.1,
      etaToFarmMinutes: 0,
      currentLocationName: 'Arrived at your Farmgate (Waiting for crate loading)',
      temperatureReading: '8°C Chilled Compartment'
    }
  },
  {
    id: 'f-disp-3',
    batchNumber: 'LOT-WHT-2026-0922',
    cropName: 'Sharbati Gold Wheat',
    emoji: '🌾',
    quantityKg: 300,
    crateCount: 6,
    totalPayout: 13200,
    buyerName: 'Narmada Grains & Agro Mills',
    buyerType: 'apmc_mandi',
    destinationAddress: 'Godown 12, Industrial Area, Mandideep',
    destinationCity: 'Bhopal Industrial Hub · PIN 462046',
    distanceToDestinationKm: 28.5,
    handoverOtp: '5128',
    isOtpVerified: true,
    harvestDate: 'Yesterday 4:00 PM',
    payoutStatus: 'transferred_to_upi',
    escrowReleaseTime: 'Released at 11:20 AM today',
    upiTransactionId: 'UPI/629104829103/OKAXIS',
    rider: {
      name: 'Rajesh Lodhi',
      phone: '+91 94250 83921',
      vehicle: 'Tata Ace Gold · MP-04-GB-6612',
      rating: 5.0,
      completedPickups: 720,
      status: 'in_transit_to_buyer',
      isComingToFarmer: false,
      distanceToFarmKm: 16.2,
      etaToFarmMinutes: 0,
      currentLocationName: 'On Hoshangabad Highway toward Mandideep Godown',
      temperatureReading: 'Ambient Dry'
    }
  }
];

export const SAMPLE_CROP_AI_PRESETS = [
  {
    cropName: 'Desi Heirloom Tomato',
    variety: 'Pusa Ruby Hybrid',
    category: 'vegetables' as const,
    emoji: '🍅',
    confidence: 98.4,
    grade: 'Grade A' as const,
    freshnessScore: 97,
    estimatedWeightKg: 150,
    suggestedPricePerKg: 34,
    mandiPricePerKg: 32,
    defectScan: '0.00% defects, zero blight spots, firm flesh',
    chemicalResidueEst: '0.00 PPM (Bio-neem certified)',
    harvestAdvice: 'Harvest before 10:30 AM to retain skin crispness and lycopene moisture.',
    audioNarrationHindi: 'टमाटर का ग्रेड-ए पाया गया है। आजादपुर और करोंद मंडी का भाव ₹32 है, आप ₹34/किलो पर तुरंत बेच सकते हैं।',
    imageUrl: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?w=600&auto=format&fit=crop&q=80'
  },
  {
    cropName: 'Organic Palak (Spinach)',
    variety: 'All Green Broad Leaf',
    category: 'vegetables' as const,
    emoji: '🥬',
    confidence: 96.8,
    grade: 'Grade A' as const,
    freshnessScore: 99,
    estimatedWeightKg: 80,
    suggestedPricePerKg: 19,
    mandiPricePerKg: 17,
    defectScan: 'Deep green foliage, zero yellowing, crisp stem',
    chemicalResidueEst: '0.00 PPM (Trichoderma organic)',
    harvestAdvice: 'Pack in aerated crates within 2 hours to avoid post-harvest wilting.',
    audioNarrationHindi: 'पालक बिल्कुल ताजा और ग्रेड-ए है। ₹19 प्रति गड्डी पर लिस्ट करने की सिफारिश की जाती है।',
    imageUrl: 'https://images.unsplash.com/photo-1576045057995-568f588f82fb?w=600&auto=format&fit=crop&q=80'
  },
  {
    cropName: 'Nashik Red Onion',
    variety: 'Agri-Found Dark Red',
    category: 'vegetables' as const,
    emoji: '🧅',
    confidence: 97.2,
    grade: 'Grade A' as const,
    freshnessScore: 94,
    estimatedWeightKg: 250,
    suggestedPricePerKg: 46,
    mandiPricePerKg: 43,
    defectScan: 'Firm dry outer scales, single neck, zero fungal rot',
    chemicalResidueEst: 'Safe export threshold (0.00 PPM)',
    harvestAdvice: 'Dry cured for 48 hours under shaded tarpaulin before crate bagging.',
    audioNarrationHindi: 'प्याज की गुणवत्ता उत्कृष्ट है। लासलगांव और करोंद मंडी में भारी मांग है, ₹46/किलो पर तत्काल लिस्ट करें।',
    imageUrl: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=600&auto=format&fit=crop&q=80'
  }
];


