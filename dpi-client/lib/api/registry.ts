import apiClient from './client';

export interface ServiceRegistration {
  name: string;
  displayName: string;
  description: string;
  baseUrl: string;
  healthEndpoint: string;
  version: string;
  owner: string;
  tags: string[];
  isPublic: boolean;
  requiredRoles: string[];
}

export interface Service extends ServiceRegistration {
  id: string;
  status: string;
  lastHealthCheck?: string;
  createdAt: string;
  updatedAt: string;
}

export const registryApi = {
  listServices: async (): Promise<Service[]> => {
    const response = await apiClient.get('/registry/services');
    return response.data.services || [];
  },

  getService: async (name: string): Promise<Service> => {
    const response = await apiClient.get(`/registry/services/${name}`);
    return response.data.service;
  },

  registerService: async (data: ServiceRegistration): Promise<Service> => {
    const response = await apiClient.post('/registry/services', data);
    return response.data.service;
  },

  updateService: async (
    name: string,
    data: Partial<ServiceRegistration>,
  ): Promise<Service> => {
    const response = await apiClient.put(`/registry/services/${name}`, data);
    return response.data.service;
  },

  deleteService: async (name: string): Promise<void> => {
    await apiClient.delete(`/registry/services/${name}`);
  },

  getPlatformHealth: async () => {
    const response = await apiClient.get('/registry/health');
    return response.data.platformHealth;
  },
};
