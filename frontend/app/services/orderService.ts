import { orderAPI } from '../lib/api';

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface CreateOrderData {
  items: OrderItem[];
  storeId: string;
  addressId: string;
  paymentMethodId: string;
  deliveryTimeSlot: string;
  subtotal: number;
  tax: number;
  deliveryFee: number;
  total: number;
  specialInstructions?: string;
}

export interface Order extends CreateOrderData {
  id: string;
  userId: string;
  status: 'pending' | 'confirmed' | 'processing' | 'out_for_delivery' | 'delivered' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string;
  trackingUpdates?: TrackingUpdate[];
}

export interface TrackingUpdate {
  status: string;
  message: string;
  timestamp: string;
}

class OrderService {
  private readonly STORAGE_KEY = 'orders';
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  /**
   * Create a new order
   */
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      // Try API first
      const response = await orderAPI.createOrder(orderData);
      const order = response.data;
      
      // Cache the order
      this.cacheOrder(order);
      
      return order;
    } catch (error) {
      console.error('API order creation failed, using local storage:', error);
      
      // Fallback to local storage
      const order: Order = {
        ...orderData,
        id: `ORD-${Date.now().toString().substring(6)}`,
        userId: 'local-user',
        status: 'pending',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        estimatedDelivery: this.calculateEstimatedDelivery(orderData.deliveryTimeSlot),
        trackingUpdates: [
          {
            status: 'pending',
            message: 'Order placed successfully',
            timestamp: new Date().toISOString(),
          },
        ],
      };
      
      this.saveOrderLocally(order);
      return order;
    }
  }

  /**
   * Get order by ID
   */
  async getOrder(orderId: string): Promise<Order | null> {
    try {
      // Check cache first
      const cachedOrder = this.getCachedOrder(orderId);
      if (cachedOrder) return cachedOrder;
      
      // Try API
      const response = await orderAPI.getOrder(orderId);
      const order = response.data;
      
      // Cache the result
      this.cacheOrder(order);
      
      return order;
    } catch (error) {
      console.error('API fetch failed, checking local storage:', error);
      
      // Fallback to local storage
      return this.getOrderFromLocalStorage(orderId);
    }
  }

  /**
   * Get all orders for the user
   */
  async getOrders(filters?: { status?: string; limit?: number }): Promise<Order[]> {
    try {
      // Try API
      const response = await orderAPI.getOrders(filters);
      const orders = response.data;
      
      // Cache all orders
      orders.forEach((order: Order) => this.cacheOrder(order));
      
      return orders;
    } catch (error) {
      console.error('API fetch failed, using local storage:', error);
      
      // Fallback to local storage
      return this.getOrdersFromLocalStorage(filters);
    }
  }

  /**
   * Cancel an order
   */
  async cancelOrder(orderId: string, reason?: string): Promise<Order> {
    try {
      // Try API
      const response = await orderAPI.updateOrder(orderId, { 
        status: 'cancelled',
        cancellationReason: reason 
      });
      const order = response.data;
      
      // Update cache
      this.cacheOrder(order);
      
      return order;
    } catch (error) {
      console.error('API cancel failed, updating local storage:', error);
      
      // Fallback to local storage
      const order = this.getOrderFromLocalStorage(orderId);
      if (order) {
        order.status = 'cancelled';
        order.updatedAt = new Date().toISOString();
        this.saveOrderLocally(order);
        return order;
      }
      throw new Error('Order not found');
    }
  }

  /**
   * Update order tracking
   */
  async updateOrderTracking(orderId: string): Promise<Order | null> {
    const order = await this.getOrder(orderId);
    if (!order) return null;

    // Simulate status progression based on time
    const orderTime = new Date(order.createdAt).getTime();
    const now = Date.now();
    const minutesElapsed = Math.floor((now - orderTime) / (1000 * 60));

    let newStatus = order.status;
    const updates = [...(order.trackingUpdates || [])];

    if (minutesElapsed >= 2 && order.status === 'pending') {
      newStatus = 'confirmed';
      updates.push({
        status: 'confirmed',
        message: 'Order confirmed by store',
        timestamp: new Date().toISOString(),
      });
    }

    if (minutesElapsed >= 5 && order.status === 'confirmed') {
      newStatus = 'processing';
      updates.push({
        status: 'processing',
        message: 'Order is being prepared',
        timestamp: new Date().toISOString(),
      });
    }

    if (minutesElapsed >= 15 && order.status === 'processing') {
      newStatus = 'out_for_delivery';
      updates.push({
        status: 'out_for_delivery',
        message: 'Order is out for delivery',
        timestamp: new Date().toISOString(),
      });
    }

    if (minutesElapsed >= 30 && order.status === 'out_for_delivery') {
      newStatus = 'delivered';
      updates.push({
        status: 'delivered',
        message: 'Order delivered successfully',
        timestamp: new Date().toISOString(),
      });
    }

    if (newStatus !== order.status) {
      order.status = newStatus;
      order.trackingUpdates = updates;
      order.updatedAt = new Date().toISOString();
      this.saveOrderLocally(order);
    }

    return order;
  }

  /**
   * Calculate estimated delivery time
   */
  private calculateEstimatedDelivery(deliveryTimeSlot: string): string {
    // Parse the delivery time slot and return estimated time
    return deliveryTimeSlot;
  }

  /**
   * Cache order in session storage
   */
  private cacheOrder(order: Order): void {
    const cacheKey = `order_cache_${order.id}`;
    const cacheData = {
      order,
      timestamp: Date.now(),
    };
    sessionStorage.setItem(cacheKey, JSON.stringify(cacheData));
  }

  /**
   * Get cached order
   */
  private getCachedOrder(orderId: string): Order | null {
    const cacheKey = `order_cache_${orderId}`;
    const cached = sessionStorage.getItem(cacheKey);
    
    if (!cached) return null;
    
    try {
      const { order, timestamp } = JSON.parse(cached);
      
      // Check if cache is still valid
      if (Date.now() - timestamp < this.CACHE_DURATION) {
        return order;
      }
      
      // Clear expired cache
      sessionStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Error parsing cached order:', error);
    }
    
    return null;
  }

  /**
   * Save order to local storage
   */
  private saveOrderLocally(order: Order): void {
    const orders = this.getOrdersFromLocalStorage();
    const existingIndex = orders.findIndex(o => o.id === order.id);
    
    if (existingIndex >= 0) {
      orders[existingIndex] = order;
    } else {
      orders.push(order);
    }
    
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(orders));
  }

  /**
   * Get order from local storage
   */
  private getOrderFromLocalStorage(orderId: string): Order | null {
    const orders = this.getOrdersFromLocalStorage();
    return orders.find(o => o.id === orderId) || null;
  }

  /**
   * Get all orders from local storage
   */
  private getOrdersFromLocalStorage(filters?: { status?: string; limit?: number }): Order[] {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (!stored) return [];
      
      let orders: Order[] = JSON.parse(stored);
      
      // Apply filters
      if (filters?.status) {
        orders = orders.filter(o => o.status === filters.status);
      }
      
      // Sort by date (newest first)
      orders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      
      // Apply limit
      if (filters?.limit) {
        orders = orders.slice(0, filters.limit);
      }
      
      return orders;
    } catch (error) {
      console.error('Error reading orders from local storage:', error);
      return [];
    }
  }

  /**
   * Clear all cached orders
   */
  clearCache(): void {
    // Clear session storage cache
    const keys = Object.keys(sessionStorage);
    keys.forEach(key => {
      if (key.startsWith('order_cache_')) {
        sessionStorage.removeItem(key);
      }
    });
  }
}

export const orderService = new OrderService();
