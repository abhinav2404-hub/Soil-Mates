import { API_BASE_URL } from '../config/env';

export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  count?: number;
  [key: string]: any;
}

class ApiClient {
  private getHeaders(customHeaders: Record<string, string> = {}): Record<string, string> {
    const headers: Record<string, string> = {
      ...customHeaders
    };

    const token = localStorage.getItem('soilMatesToken');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    return headers;
  }

  private async request<T = any>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${API_BASE_URL}${endpoint}`;

    try {
      const isFormData = options.body instanceof FormData;
      const headers = this.getHeaders(
        isFormData ? {} : { 'Content-Type': 'application/json' }
      );

      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...(options.headers as any)
        }
      });

      if (response.status === 401) {
        // If unauthorized, do not clear if using demo credentials
        console.warn('[ApiClient] 401 Unauthorized for', endpoint);
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error: any) {
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Unable to connect to Soil Mates server. Please verify your connection.');
      }
      throw error;
    }
  }

  // HEALTH
  async checkHealth() {
    return this.request('/api/health', { method: 'GET' });
  }

  // AUTH
  async login(credentials: { email?: string; phone?: string; identifier?: string; password?: string }) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    });
  }

  async logout() {
    return this.request('/api/auth/logout', { method: 'POST' });
  }

  async register(data: {
    name: string;
    email: string;
    password?: string;
    role: string;
    phone?: string;
    location?: string;
    farmDetails?: any;
    vendorDetails?: any;
  }) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  async getMe() {
    return this.request('/api/auth/me', { method: 'GET' });
  }

  // PRODUCTS
  async getProducts(params: {
    search?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    availableOnly?: boolean;
    sellerId?: string;
  } = {}) {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category && params.category !== 'all') query.append('category', params.category);
    if (params.minPrice !== undefined) query.append('minPrice', params.minPrice.toString());
    if (params.maxPrice !== undefined) query.append('maxPrice', params.maxPrice.toString());
    if (params.location) query.append('location', params.location);
    if (params.availableOnly) query.append('availableOnly', 'true');
    if (params.sellerId) query.append('sellerId', params.sellerId);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return this.request(`/api/products${qs}`, { method: 'GET' });
  }

  async getProductById(id: string) {
    return this.request(`/api/products/${id}`, { method: 'GET' });
  }

  async createProduct(productData: any) {
    return this.request('/api/products', {
      method: 'POST',
      body: JSON.stringify(productData)
    });
  }

  async updateProduct(id: string, updates: any) {
    return this.request(`/api/products/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates)
    });
  }

  async deleteProduct(id: string) {
    return this.request(`/api/products/${id}`, { method: 'DELETE' });
  }

  // ORDERS
  async createOrder(orderData: {
    items: Array<{ productId: string; quantity: number }>;
    deliveryAddress: { street: string; city: string; state?: string; pincode: string };
  }) {
    return this.request('/api/orders', {
      method: 'POST',
      body: JSON.stringify(orderData)
    });
  }

  async getOrders() {
    return this.request('/api/orders', { method: 'GET' });
  }

  async getOrderById(id: string) {
    return this.request(`/api/orders/${id}`, { method: 'GET' });
  }

  async updateOrderStatus(id: string, status: string) {
    return this.request(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  }

  // CROP DIAGNOSIS (AI DOCTOR)
  async diagnoseCrop(formData: FormData) {
    return this.request('/api/diagnosis', {
      method: 'POST',
      body: formData
    });
  }

  async diagnoseCropBase64(payload: { imageBase64: string; cropHint?: string }) {
    return this.request('/api/diagnosis', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
  }

  async getDiagnosisHistory() {
    return this.request('/api/diagnosis/history', { method: 'GET' });
  }

  // MARKET RATES
  async getMarketRates() {
    return this.request('/api/market/rates', { method: 'GET' });
  }

  // REVIEWS
  async getProductReviews(productId: string) {
    return this.request(`/api/products/${productId}/reviews`, { method: 'GET' });
  }

  async addProductReview(productId: string, review: any) {
    return this.request(`/api/products/${productId}/reviews`, {
      method: 'POST',
      body: JSON.stringify(review)
    });
  }

  // ADMIN
  async getAdminStats() {
    return this.request('/api/admin/stats', { method: 'GET' });
  }

  async getAdminUsers() {
    return this.request('/api/admin/users', { method: 'GET' });
  }

  async getAdminOrders() {
    return this.request('/api/admin/orders', { method: 'GET' });
  }
}

export const api = new ApiClient();
