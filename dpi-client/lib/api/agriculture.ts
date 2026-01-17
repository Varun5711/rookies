import apiClient from './client';
import { Scheme, SchemeApplication, Advisory, MarketPrice } from '../types/agriculture';
import { PaginatedResponse, PaginationParams } from '../types/common';

export const agricultureApi = {
  // Schemes
  getSchemes: async (filters?: PaginationParams & { category?: string }): Promise<PaginatedResponse<Scheme>> => {
    const response = await apiClient.get('/services/agriculture/schemes', { params: filters });
    return response.data;
  },

  getScheme: async (id: string): Promise<Scheme> => {
    const response = await apiClient.get(`/services/agriculture/schemes/${id}`);
    return response.data.data || response.data;
  },

  applyForScheme: async (schemeId: string, data: Record<string, unknown>): Promise<SchemeApplication> => {
    const response = await apiClient.post(`/services/agriculture/schemes/${schemeId}/apply`, data);
    return response.data.data || response.data;
  },

  getMyApplications: async (filters?: PaginationParams): Promise<PaginatedResponse<SchemeApplication>> => {
    const response = await apiClient.get('/services/agriculture/schemes/me/applications', { params: filters });
    return response.data;
  },

  getApplicationStatus: async (id: string): Promise<SchemeApplication> => {
    const response = await apiClient.get(`/services/agriculture/schemes/applications/${id}`);
    return response.data.data || response.data;
  },

  // Advisories
  getAdvisories: async (
    filters?: PaginationParams & { state?: string; season?: string; category?: string }
  ): Promise<PaginatedResponse<Advisory>> => {
    const response = await apiClient.get('/services/agriculture/advisories', { params: filters });
    return response.data;
  },

  getAdvisory: async (id: string): Promise<Advisory> => {
    const response = await apiClient.get(`/services/agriculture/advisories/${id}`);
    return response.data.data || response.data;
  },

  // Market Prices
  getMarketPrices: async (
    filters?: PaginationParams & { commodity?: string; state?: string; mandi?: string }
  ): Promise<PaginatedResponse<MarketPrice>> => {
    const response = await apiClient.get('/services/agriculture/market-prices', { params: filters });
    return response.data;
  },

  getCommodities: async (): Promise<string[]> => {
    const response = await apiClient.get('/services/agriculture/market-prices/commodities');
    return response.data.data || response.data;
  },

  getMandis: async (state?: string): Promise<string[]> => {
    const response = await apiClient.get('/services/agriculture/market-prices/mandis', { params: { state } });
    return response.data.data || response.data;
  },
};
