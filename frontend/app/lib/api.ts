import axios, { AxiosError, AxiosRequestConfig } from 'axios';

// Only use localhost as fallback in development
const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }
  // In production, don't fallback to localhost
  if (process.env.NODE_ENV === 'production') {
    console.error('NEXT_PUBLIC_API_URL is not configured in production!');
    return '/api'; // Use relative path as last resort
  }
  // Development fallback
  return 'http://localhost:5001/api';
};

const API_URL = getApiUrl();

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for adding auth token
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage if in browser
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors with retry logic
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const config = error.config as AxiosRequestConfig & { _retry?: boolean; _retryCount?: number };
    
    // Handle 401 Unauthorized errors
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        window.location.href = '/auth/login';
      }
    }
    
    // Retry logic for network errors or 5xx errors
    if (
      (!error.response || (error.response.status >= 500 && error.response.status < 600)) &&
      config &&
      !config._retry
    ) {
      config._retryCount = config._retryCount || 0;
      
      if (config._retryCount < 2) { // Retry up to 2 times
        config._retryCount += 1;
        config._retry = true;
        
        // Exponential backoff
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, config._retryCount!) * 1000));
        
        return api(config);
      }
    }
    
    return Promise.reject(error);
  }
);

// Helper function for cached GET requests
async function cachedGet<T>(url: string, config?: AxiosRequestConfig): Promise<T> {
  const cacheKey = `${url}${JSON.stringify(config?.params || {})}`;
  const cached = cache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const response = await api.get<T>(url, config);
  cache.set(cacheKey, { data: response.data, timestamp: Date.now() });
  
  return response.data;
}

// Clear cache utility
export function clearCache(pattern?: string) {
  if (pattern) {
    for (const key of cache.keys()) {
      if (key.includes(pattern)) {
        cache.delete(key);
      }
    }
  } else {
    cache.clear();
  }
}

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/auth/register', userData),
  login: (credentials: any) => api.post('/auth/login', credentials),
  getMe: () => api.get('/auth/me'),
};

// User API
export const userAPI = {
  getProfile: (userId: string) => api.get(`/users/${userId}`),
  updateProfile: (userId: string, userData: any) => api.put(`/users/${userId}`, userData),
  updatePassword: (userId: string, passwordData: any) => api.put(`/users/${userId}/password`, passwordData),
  addAddress: (userId: string, addressData: any) => api.post(`/users/${userId}/addresses`, addressData),
  updateAddress: (userId: string, addressId: string, addressData: any) => 
    api.put(`/users/${userId}/addresses/${addressId}`, addressData),
  deleteAddress: (userId: string, addressId: string) => 
    api.delete(`/users/${userId}/addresses/${addressId}`),
};

// Store API
export const storeAPI = {
  getStores: (params?: any) => cachedGet('/stores', { params }),
  getStore: (storeId: string) => cachedGet(`/stores/${storeId}`),
  getStoreCategories: (storeId: string) => cachedGet(`/stores/${storeId}/categories`),
  getStoreProducts: (storeId: string, params?: any) => 
    api.get(`/stores/${storeId}/products`, { params }),
  getFeaturedProducts: (storeId: string) => cachedGet(`/stores/${storeId}/featured`),
};

// Category API
export const categoryAPI = {
  getCategories: (params?: any) => cachedGet('/categories', { params }),
  getCategory: (categoryId: string) => cachedGet(`/categories/${categoryId}`),
  getCategoryBySlug: (slug: string, storeId: string) => 
    cachedGet(`/categories/slug/${slug}/${storeId}`),
  getCategoryHierarchy: (storeId: string) => cachedGet(`/categories/hierarchy/${storeId}`),
  createCategory: (categoryData: any) => api.post('/categories', categoryData),
  updateCategory: (categoryId: string, categoryData: any) => 
    api.put(`/categories/${categoryId}`, categoryData),
  deleteCategory: (categoryId: string) => api.delete(`/categories/${categoryId}`),
  reorderCategory: (categoryId: string, order: number) => 
    api.put(`/categories/${categoryId}/reorder`, { order }),
};

// Product API
export const productAPI = {
  getProducts: (params?: any) => api.get('/products', { params }), // Don't cache due to frequent updates
  getProduct: (productId: string) => cachedGet(`/products/${productId}`),
  searchProducts: (query: string, params?: any) => 
    api.get(`/products/search/${query}`, { params }),
};

// Cart API
export const cartAPI = {
  getCart: () => api.get('/cart'),
  createCart: (cartData: any) => api.post('/cart', cartData),
  addItem: (itemData: any) => api.put('/cart/add', itemData),
  updateItem: (itemId: string, itemData: any) => api.put(`/cart/update/${itemId}`, itemData),
  removeItem: (itemId: string) => api.delete(`/cart/remove/${itemId}`),
  clearCart: () => api.delete('/cart'),
  checkout: (checkoutData: any) => api.put('/cart/checkout', checkoutData),
};

// Order API
export const orderAPI = {
  getOrders: (params?: any) => api.get('/orders', { params }),
  getOrder: (orderId: string) => api.get(`/orders/${orderId}`),
  createOrder: (orderData: any) => api.post('/orders', orderData),
  updateOrder: (orderId: string, updateData: any) => api.put(`/orders/${orderId}`, updateData),
  cancelOrder: (orderId: string, reason?: string) => api.put(`/orders/${orderId}/cancel`, { reason }),
};

// Payment API
export const paymentAPI = {
  createPaymentIntent: (cartId: string) => 
    api.post('/payments/create-payment-intent', { cartId }),
  savePaymentMethod: (paymentData: any) => 
    api.post('/payments/save-payment-method', paymentData),
};

export default api;
