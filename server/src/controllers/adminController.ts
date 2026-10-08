import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { store } from '../models/store';
import { isMongoConnected } from '../config/db';
import { config } from '../config/env';

export async function getStats(req: AuthRequest, res: Response) {
  try {
    const users = await store.listUsers();
    const products = await store.listProducts();
    const orders = await store.listOrders();
    const diagnoses = await store.listDiagnoses();

    const totalFarmers = users.filter((u: any) => u.role === 'FARMER').length;
    const totalVendors = users.filter((u: any) => u.role === 'VENDOR').length;
    const totalBuyers = users.filter((u: any) => u.role === 'BUYER').length;
    const totalAdmins = users.filter((u: any) => u.role === 'ADMIN').length;

    const totalRevenue = orders.reduce((sum: number, o: any) => sum + (o.total || 0), 0);
    const pendingOrders = orders.filter((o: any) => o.orderStatus === 'PLACED' || o.orderStatus === 'CONFIRMED').length;
    const completedOrders = orders.filter((o: any) => o.orderStatus === 'DELIVERED').length;

    const memoryUsage = process.memoryUsage();

    res.json({
      success: true,
      stats: {
        totalUsers: users.length,
        totalFarmers,
        totalVendors,
        totalBuyers,
        totalAdmins,
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders,
        completedOrders,
        grossRevenue: totalRevenue,
        diagnosisCount: diagnoses.length
      },
      systemHealth: {
        uptimeSeconds: Math.floor(process.uptime()),
        nodeVersion: process.version,
        database: isMongoConnected ? 'MongoDB (Connected)' : 'Resilient In-Memory Hybrid Store (Operational)',
        memoryRssMb: Math.round(memoryUsage.rss / 1024 / 1024),
        heapUsedMb: Math.round(memoryUsage.heapUsed / 1024 / 1024),
        aiConfigured: Boolean(config.geminiApiKey),
        status: 'HEALTHY'
      }
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to generate admin statistics.'
    });
  }
}

export async function listAdminUsers(req: AuthRequest, res: Response) {
  try {
    const users = await store.listUsers();
    res.json({
      success: true,
      count: users.length,
      data: users.map((u: any) => ({
        id: u.id || u._id,
        name: u.name,
        email: u.email,
        role: u.role,
        phone: u.phone,
        location: u.location,
        createdAt: u.createdAt
      }))
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to list users.'
    });
  }
}

export async function listAdminOrders(req: AuthRequest, res: Response) {
  try {
    const orders = await store.listOrders();
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to list orders.'
    });
  }
}
