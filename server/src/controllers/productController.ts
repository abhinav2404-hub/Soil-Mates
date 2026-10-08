import { Response } from 'express';
import { AuthRequest } from '../middleware/auth';
import { store } from '../models/store';

export async function getProducts(req: AuthRequest, res: Response) {
  try {
    const { search, category, minPrice, maxPrice, location, availableOnly, sellerId } = req.query;

    const products = await store.listProducts({
      search: search as string,
      category: category as string,
      minPrice: minPrice ? parseFloat(minPrice as string) : undefined,
      maxPrice: maxPrice ? parseFloat(maxPrice as string) : undefined,
      location: location as string,
      availableOnly: availableOnly === 'true',
      sellerId: sellerId as string
    });

    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to retrieve products.'
    });
  }
}

export async function getProductById(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const product = await store.getProductById(id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    res.json({
      success: true,
      data: product
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Error fetching product.'
    });
  }
}

export async function createProduct(req: AuthRequest, res: Response) {
  try {
    const {
      name,
      description,
      category,
      price,
      unit = 'kg',
      quantity = 0,
      location = 'Madhya Pradesh',
      images = [],
      emoji = '🌾',
      grade = 'Grade A',
      isOrganic = false,
      isFreshToday = true,
      deliveryHours = 4,
      harvestTime = 'Fresh Today',
      farmName
    } = req.body;

    if (!name || price === undefined || !category) {
      return res.status(400).json({
        success: false,
        message: 'Name, price, and category are required fields.'
      });
    }

    const sellerId = req.user?.id || 'usr-farmer-1';
    const sellerName = req.user?.name || 'Ramesh Patel';
    const resolvedFarmName = farmName || `${sellerName}'s Farm`;

    const product = await store.createProduct({
      name,
      description: description || '',
      category,
      price: Number(price),
      unit,
      quantity: Number(quantity),
      sellerId,
      sellerName,
      farmName: resolvedFarmName,
      images,
      emoji,
      location,
      available: Number(quantity) > 0,
      grade,
      isOrganic: Boolean(isOrganic),
      isFreshToday: Boolean(isFreshToday),
      deliveryHours: Number(deliveryHours),
      harvestTime,
      rating: 5.0,
      reviewsCount: 1,
      vendorTrustScore: 98,
      repeatBuyerRate: 90
    });

    res.status(201).json({
      success: true,
      message: 'Product listed successfully on Soil Mates marketplace.',
      data: product
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create product listing.'
    });
  }
}

export async function updateProduct(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const existing = await store.getProductById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    // Role check: Only seller or ADMIN can update
    if (req.user && req.user.role !== 'ADMIN' && existing.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to modify this listing.'
      });
    }

    const updated = await store.updateProduct(id, req.body);

    res.json({
      success: true,
      message: 'Product listing updated successfully.',
      data: updated
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update product.'
    });
  }
}

export async function deleteProduct(req: AuthRequest, res: Response) {
  try {
    const { id } = req.params;
    const existing = await store.getProductById(id);

    if (!existing) {
      return res.status(404).json({
        success: false,
        message: 'Product not found.'
      });
    }

    if (req.user && req.user.role !== 'ADMIN' && existing.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'You are not authorized to delete this listing.'
      });
    }

    await store.deleteProduct(id);

    res.json({
      success: true,
      message: 'Product removed from marketplace.'
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete product.'
    });
  }
}
