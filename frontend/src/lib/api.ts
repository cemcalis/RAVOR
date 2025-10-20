// API Configuration
export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

// Helper function for API calls
export async function fetchAPI(endpoint: string, options: RequestInit = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const defaultOptions: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, defaultOptions);
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Network error' }));
      throw new Error(error.error || `HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// API endpoints
export const api = {
  // Products
  getProducts: (filters?: Record<string, any>) => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          params.append(key, String(value));
        }
      });
    }
    const query = params.toString();
    return fetchAPI(`/products${query ? `?${query}` : ''}`);
  },
  
  getProduct: (slug: string) => fetchAPI(`/products/${slug}`),
  
  createProduct: (data: any) => fetchAPI('/products', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  // Categories
  getCategories: () => fetchAPI('/categories'),
  
  getCategory: (slug: string) => fetchAPI(`/categories/${slug}`),

  // Cart
  getCart: (sessionId: string) => fetchAPI(`/cart/${sessionId}`),
  
  addToCart: (sessionId: string, data: any) => fetchAPI(`/cart/${sessionId}/add`, {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  removeFromCart: (sessionId: string, productId: number) => fetchAPI(`/cart/${sessionId}/remove/${productId}`, {
    method: 'DELETE',
  }),
  
  clearCart: (sessionId: string) => fetchAPI(`/cart/${sessionId}`, {
    method: 'DELETE',
  }),

  // Orders
  createOrder: (data: any) => fetchAPI('/orders', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  getOrder: (id: string) => fetchAPI(`/orders/${id}`),
  
  // Favorites
  getFavorites: (userId: number) => fetchAPI(`/favorites/${userId}`),

  addToFavorites: (userId: number, productId: number) => fetchAPI(`/favorites/${userId}/${productId}`, {
    method: 'POST',
  }),

  removeFromFavorites: (userId: number, productId: number) => fetchAPI(`/favorites/${userId}/${productId}`, {
    method: 'DELETE',
  }),

  // Reviews
  getProductReviews: (productId: number, page?: number, limit?: number) =>
    fetchAPI(`/reviews/product/${productId}${page ? `?page=${page}&limit=${limit || 10}` : ''}`),

  addReview: (productId: number, data: { rating: number; comment: string }) =>
    fetchAPI(`/reviews/product/${productId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  updateReview: (reviewId: number, data: { rating: number; comment: string }) =>
    fetchAPI(`/reviews/${reviewId}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),

  deleteReview: (reviewId: number) =>
    fetchAPI(`/reviews/${reviewId}`, {
      method: 'DELETE',
    }),

  getAllReviews: (page?: number, limit?: number) =>
    fetchAPI(`/reviews/admin/all${page ? `?page=${page}&limit=${limit || 20}` : ''}`),

  updateReviewStatus: (reviewId: number, isApproved: boolean) =>
    fetchAPI(`/reviews/admin/${reviewId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ isApproved }),
    }),

  // Auth
  login: (email: string, password: string) => fetchAPI('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  }),
  
  register: (data: any) => fetchAPI('/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  }),
  
  verifyToken: (token: string) => fetchAPI('/auth/verify', {
    method: 'POST',
    body: JSON.stringify({ token }),
  }),
};
