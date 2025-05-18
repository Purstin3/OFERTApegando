import axios from 'axios';
import { Offer, AdCount } from '../types';

// Base API configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
});

// Request interceptor for auth (if needed)
api.interceptors.request.use(
  (config) => {
    // Add auth token if available
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Offers API
export const offersApi = {
  // Get all offers
  getAll: async (): Promise<Offer[]> => {
    const response = await api.get('/offers');
    return response.data;
  },

  // Get offer by ID
  getById: async (id: string): Promise<Offer> => {
    const response = await api.get(`/offers/${id}`);
    return response.data;
  },

  // Create new offer
  create: async (offerData: Omit<Offer, 'id' | 'createdAt' | 'updatedAt'>): Promise<Offer> => {
    const response = await api.post('/offers', offerData);
    return response.data;
  },

  // Update offer
  update: async (id: string, offerData: Partial<Offer>): Promise<Offer> => {
    const response = await api.put(`/offers/${id}`, offerData);
    return response.data;
  },

  // Delete offer
  delete: async (id: string): Promise<void> => {
    await api.delete(`/offers/${id}`);
  },

  // Pause offer
  pause: async (id: string): Promise<Offer> => {
    const response = await api.patch(`/offers/${id}/pause`);
    return response.data;
  },

  // Resume offer
  resume: async (id: string): Promise<Offer> => {
    const response = await api.patch(`/offers/${id}/resume`);
    return response.data;
  },
};

// Ad Counts API
export const adCountsApi = {
  // Get ad counts for offer
  getByOfferId: async (offerId: string): Promise<AdCount[]> => {
    const response = await api.get(`/ad-counts?offerId=${offerId}`);
    return response.data;
  },

  // Add new ad count
  create: async (adCountData: Omit<AdCount, 'id'>): Promise<AdCount> => {
    const response = await api.post('/ad-counts', adCountData);
    return response.data;
  },

  // Update ad count
  update: async (id: string, adCountData: Partial<AdCount>): Promise<AdCount> => {
    const response = await api.put(`/ad-counts/${id}`, adCountData);
    return response.data;
  },

  // Delete ad count
  delete: async (id: string): Promise<void> => {
    await api.delete(`/ad-counts/${id}`);
  },

  // Get all ad counts
  getAll: async (): Promise<AdCount[]> => {
    const response = await api.get('/ad-counts');
    return response.data;
  },
};

// Sync API
export const syncApi = {
  // Sync specific offer
  syncOffer: async (offerId: string): Promise<{
    success: boolean;
    newCount?: number;
    error?: string;
  }> => {
    const response = await api.post(`/sync/offer/${offerId}`);
    return response.data;
  },

  // Sync all offers
  syncAll: async (): Promise<{
    success: boolean;
    results: Array<{
      offerId: string;
      success: boolean;
      newCount?: number;
      error?: string;
    }>;
  }> => {
    const response = await api.post('/sync/all');
    return response.data;
  },

  // Get sync status
  getStatus: async (): Promise<{
    isRunning: boolean;
    lastSync?: string;
    nextSync?: string;
  }> => {
    const response = await api.get('/sync/status');
    return response.data;
  },
};

// Facebook Ad Library API
export const facebookApi = {
  // Search ads
  searchAds: async (params: {
    searchTerms?: string;
    pageId?: string;
    platforms?: string[];
    limit?: number;
  }): Promise<{
    ads: any[];
    count: number;
  }> => {
    const response = await api.get('/facebook/search', { params });
    return response.data;
  },

  // Get ad count from URL
  getCountFromUrl: async (adLibraryUrl: string): Promise<{
    count: number;
    lastUpdated: string;
  }> => {
    const response = await api.post('/facebook/count-from-url', { adLibraryUrl });
    return response.data;
  },

  // Analyze ad library URL
  analyzeUrl: async (adLibraryUrl: string): Promise<{
    isValid: boolean;
    pageId?: string;
    searchTerms?: string;
    platforms?: string[];
  }> => {
    const response = await api.post('/facebook/analyze-url', { adLibraryUrl });
    return response.data;
  },
};

export default api;