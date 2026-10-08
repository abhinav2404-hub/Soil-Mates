import { isMongoConnected } from '../config/db';
import { UserModel, IUser, UserRole } from './User';
import { ProductModel, IProduct } from './Product';
import { OrderModel, IOrder, OrderStatus, PaymentStatus } from './Order';
import { CropDiagnosisModel, ICropDiagnosis } from './CropDiagnosis';
import { MarketRateModel, IMarketRate } from './MarketRate';
import { ReviewModel, IReview } from './Review';

// Resilient in-memory database store
class DataStore {
  public users: Map<string, any> = new Map();
  public products: Map<string, any> = new Map();
  public orders: Map<string, any> = new Map();
  public diagnoses: Map<string, any> = new Map();
  public marketRates: Map<string, any> = new Map();
  public reviews: Map<string, any> = new Map();

  // USERS
  async findUserByEmail(email: string) {
    if (isMongoConnected) {
      return await UserModel.findOne({ email: email.toLowerCase() });
    }
    const normalized = email.toLowerCase();
    for (const user of this.users.values()) {
      if (user.email.toLowerCase() === normalized) return user;
    }
    return null;
  }

  async findUserById(id: string) {
    if (isMongoConnected) {
      return await UserModel.findById(id);
    }
    return this.users.get(id) || null;
  }

  async createUser(data: any) {
    if (isMongoConnected) {
      const user = new UserModel(data);
      return await user.save();
    }
    const id = data.id || `usr-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const user = {
      ...data,
      id,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async listUsers() {
    if (isMongoConnected) {
      return await UserModel.find().sort({ createdAt: -1 });
    }
    return Array.from(this.users.values());
  }

  // PRODUCTS
  async listProducts(filters: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    availableOnly?: boolean;
    sellerId?: string;
  } = {}) {
    if (isMongoConnected) {
      const query: any = {};
      if (filters.category && filters.category !== 'all') {
        query.category = filters.category;
      }
      if (filters.availableOnly) {
        query.available = true;
      }
      if (filters.sellerId) {
        query.sellerId = filters.sellerId;
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        query.price = {};
        if (filters.minPrice !== undefined) query.price.$gte = filters.minPrice;
        if (filters.maxPrice !== undefined) query.price.$lte = filters.maxPrice;
      }
      if (filters.search) {
        query.$or = [
          { name: { $regex: filters.search, $options: 'i' } },
          { description: { $regex: filters.search, $options: 'i' } },
          { farmName: { $regex: filters.search, $options: 'i' } }
        ];
      }
      return await ProductModel.find(query).sort({ createdAt: -1 });
    }

    let list = Array.from(this.products.values());

    if (filters.category && filters.category !== 'all') {
      list = list.filter((p) => p.category.toLowerCase() === filters.category?.toLowerCase());
    }
    if (filters.availableOnly) {
      list = list.filter((p) => p.available === true);
    }
    if (filters.sellerId) {
      list = list.filter((p) => p.sellerId === filters.sellerId);
    }
    if (filters.minPrice !== undefined) {
      list = list.filter((p) => p.price >= (filters.minPrice || 0));
    }
    if (filters.maxPrice !== undefined) {
      list = list.filter((p) => p.price <= (filters.maxPrice || Infinity));
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q) ||
          p.farmName?.toLowerCase().includes(q) ||
          p.location?.toLowerCase().includes(q)
      );
    }

    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getProductById(id: string) {
    if (isMongoConnected) {
      return await ProductModel.findById(id);
    }
    return this.products.get(id) || null;
  }

  async createProduct(data: any) {
    if (isMongoConnected) {
      const prod = new ProductModel(data);
      return await prod.save();
    }
    const id = data.id || `prod-${Date.now()}`;
    const product = {
      ...data,
      id,
      _id: id,
      available: data.available !== undefined ? data.available : true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.products.set(id, product);
    return product;
  }

  async updateProduct(id: string, updates: any) {
    if (isMongoConnected) {
      return await ProductModel.findByIdAndUpdate(id, { ...updates, updatedAt: new Date() }, { new: true });
    }
    const existing = this.products.get(id);
    if (!existing) return null;
    const updated = {
      ...existing,
      ...updates,
      updatedAt: new Date()
    };
    this.products.set(id, updated);
    return updated;
  }

  async deleteProduct(id: string) {
    if (isMongoConnected) {
      return await ProductModel.findByIdAndDelete(id);
    }
    const deleted = this.products.get(id);
    this.products.delete(id);
    return deleted || null;
  }

  // ORDERS
  async createOrder(data: any) {
    if (isMongoConnected) {
      const order = new OrderModel(data);
      return await order.save();
    }
    const id = data.id || `ord-${Date.now()}`;
    const order = {
      ...data,
      id,
      _id: id,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.orders.set(id, order);
    return order;
  }

  async listOrders(filters: { buyerId?: string; sellerId?: string } = {}) {
    if (isMongoConnected) {
      const query: any = {};
      if (filters.buyerId) query.buyerId = filters.buyerId;
      if (filters.sellerId) query['items.sellerId'] = filters.sellerId;
      return await OrderModel.find(query).sort({ createdAt: -1 });
    }
    let list = Array.from(this.orders.values());
    if (filters.buyerId) {
      list = list.filter((o) => o.buyerId === filters.buyerId);
    }
    if (filters.sellerId) {
      list = list.filter((o) => o.items?.some((i: any) => i.sellerId === filters.sellerId));
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async getOrderById(id: string) {
    if (isMongoConnected) {
      return await OrderModel.findById(id);
    }
    return this.orders.get(id) || null;
  }

  async updateOrderStatus(id: string, status: OrderStatus) {
    if (isMongoConnected) {
      return await OrderModel.findByIdAndUpdate(id, { orderStatus: status, updatedAt: new Date() }, { new: true });
    }
    const order = this.orders.get(id);
    if (!order) return null;
    order.orderStatus = status;
    order.updatedAt = new Date();
    this.orders.set(id, order);
    return order;
  }

  // DIAGNOSIS
  async saveDiagnosis(data: any) {
    if (isMongoConnected) {
      const diag = new CropDiagnosisModel(data);
      return await diag.save();
    }
    const id = data.id || `diag-${Date.now()}`;
    const diag = {
      ...data,
      id,
      _id: id,
      createdAt: new Date()
    };
    this.diagnoses.set(id, diag);
    return diag;
  }

  async listDiagnoses(userId?: string) {
    if (isMongoConnected) {
      const q = userId ? { userId } : {};
      return await CropDiagnosisModel.find(q).sort({ createdAt: -1 });
    }
    let list = Array.from(this.diagnoses.values());
    if (userId) {
      list = list.filter((d) => d.userId === userId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  // MARKET RATES
  async listMarketRates() {
    if (isMongoConnected) {
      return await MarketRateModel.find().sort({ commodity: 1 });
    }
    return Array.from(this.marketRates.values());
  }

  async upsertMarketRate(data: any) {
    if (isMongoConnected) {
      return await MarketRateModel.findOneAndUpdate(
        { commodity: data.commodity, mandi: data.mandi },
        data,
        { upsert: true, new: true }
      );
    }
    const id = data.id || `rate-${data.commodity}-${data.mandi}`.toLowerCase().replace(/\s+/g, '-');
    const rate = { ...data, id, _id: id, lastUpdated: new Date() };
    this.marketRates.set(id, rate);
    return rate;
  }

  // REVIEWS
  async listReviews(productId?: string) {
    if (isMongoConnected) {
      const q = productId ? { productId } : {};
      return await ReviewModel.find(q).sort({ createdAt: -1 });
    }
    let list = Array.from(this.reviews.values());
    if (productId) {
      list = list.filter((r) => r.productId === productId);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async createReview(data: any) {
    if (isMongoConnected) {
      const rev = new ReviewModel(data);
      return await rev.save();
    }
    const id = data.id || `rev-${Date.now()}`;
    const rev = { ...data, id, _id: id, createdAt: new Date() };
    this.reviews.set(id, rev);
    return rev;
  }
}

export const store = new DataStore();
