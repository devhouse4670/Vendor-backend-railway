import axios from 'axios';

// Determine the base URL based on environment
const getBaseURL = () => {
  // If you set REACT_APP_API_URL in .env, use that
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // Otherwise, determine based on NODE_ENV
  if (process.env.NODE_ENV === 'production') {
    // Replace with your production API URL
    return 'https://your-production-api.com/api';
  }
  
  // Development fallback
  return 'http://localhost:5000/api';
};

export const API_BASE_URL = getBaseURL();

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

// Request interceptor (for adding auth tokens, etc.)
api.interceptors.request.use(
  (config) => {
    // Add auth token if you have one
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor (for handling errors globally)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle common errors
    if (error.response?.status === 401) {
      // Unauthorized - maybe redirect to login
      console.error('Unauthorized access');
    } else if (error.response?.status === 404) {
      console.error('Resource not found');
    } else if (error.response?.status === 500) {
      console.error('Server error');
    }
    return Promise.reject(error);
  }
);

// API methods
export const vendorAPI = {
  // Get all vendors
  getAll: () => api.get('/vendors'),
  
  // Get single vendor
  getById: (id) => api.get(`/vendors/${id}`),
  
  // Create vendor
  create: (data) => api.post('/vendors', data),
  
  // Update vendor
  update: (id, data) => api.put(`/vendors/${id}`, data),
  
  // Delete vendor
  delete: (id) => api.delete(`/vendors/${id}`),
};

export const campaignAPI = {
  // Get all campaigns for a vendor
  getByVendor: (vendorId) => api.get(`/campaigns/vendor/${vendorId}`),
  
  // Get single campaign
  getById: (id) => api.get(`/campaigns/${id}`),
  
  // Create campaign
  create: (data) => api.post('/campaigns', data),
  
  // Update campaign
  update: (id, data) => api.put(`/campaigns/${id}`, data),
  
  // Delete campaign
  delete: (id) => api.delete(`/campaigns/${id}`),
};

export default api;