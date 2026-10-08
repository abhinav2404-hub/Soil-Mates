// MongoDB Initialization Script for Soil Mates
db = db.getSiblingDB('soilmates');

print('[MongoInit] Initializing Soil Mates database collections and indexes...');

db.createCollection('users');
db.createCollection('products');
db.createCollection('orders');
db.createCollection('cropdiagnoses');
db.createCollection('marketrates');
db.createCollection('reviews');
db.createCollection('notifications');
db.createCollection('farmprofiles');
db.createCollection('vendorprofiles');

// Text search on products
db.products.createIndex(
  { name: 'text', description: 'text', location: 'text', farmName: 'text' },
  { weights: { name: 10, farmName: 5, location: 2, description: 1 } }
);

print('[MongoInit] Soil Mates database initialized successfully!');
