import apiClient from './client';
import { Category, Grievance, SubmitGrievanceDTO } from '../types/urban';
import { PaginatedResponse, PaginationParams } from '../types/common';

export const urbanApi = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiClient.get('/services/urban/categories');
    return response.data.data || response.data;
  },

  getCategory: async (id: string): Promise<Category> => {
    const response = await apiClient.get(`/services/urban/categories/${id}`);
    return response.data.data;
  },

  // Grievances
  getMyGrievances: async (
    filters?: PaginationParams & { status?: string; priority?: string },
  ): Promise<PaginatedResponse<Grievance>> => {
    const response = await apiClient.get('/services/urban/grievances/me', {
      params: filters,
    });
    return response.data;
  },

  getGrievance: async (id: string): Promise<Grievance> => {
    const response = await apiClient.get(`/services/urban/grievances/${id}`);
    return response.data.data;
  },

  getGrievanceStatus: async (
    id: string,
  ): Promise<{ status: string; timeline: unknown[] }> => {
    const response = await apiClient.get(
      `/services/urban/grievances/${id}/status`,
    );
    return response.data.data;
  },

  submitGrievance: async (data: SubmitGrievanceDTO): Promise<Grievance> => {
    const response = await apiClient.post('/services/urban/grievances', data);
    return response.data.data;
  },

  escalateGrievance: async (id: string, reason: string): Promise<Grievance> => {
    const response = await apiClient.put(
      `/services/urban/grievances/${id}/escalate`,
      { reason },
    );
    return response.data.data;
  },
};
