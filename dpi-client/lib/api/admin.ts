import apiClient from './client';

export const adminApi = {
  // Healthcare Admin
  createHospital: async (data: Record<string, unknown>) => {
    const response = await apiClient.post(
      '/services/healthcare/admin/hospitals',
      data,
    );
    return response.data.data;
  },

  updateHospital: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(
      `/services/healthcare/admin/hospitals/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteHospital: async (id: string) => {
    const response = await apiClient.delete(
      `/services/healthcare/admin/hospitals/${id}`,
    );
    return response.data;
  },

  createDoctor: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/services/healthcare/admin/doctors', data);
    return response.data.data;
  },

  updateDoctor: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(
      `/services/healthcare/admin/doctors/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteDoctor: async (id: string) => {
    const response = await apiClient.delete(
      `/services/healthcare/admin/doctors/${id}`,
    );
    return response.data;
  },

  getAllAppointments: async (filters?: Record<string, unknown>) => {
    const response = await apiClient.get('/services/healthcare/admin/appointments', {
      params: filters,
    });
    return response.data;
  },

  // Time Slots
  createTimeSlot: async (doctorId: string, data: Record<string, unknown>) => {
    const response = await apiClient.post(
      `/services/healthcare/admin/doctors/${doctorId}/slots`,
      data,
    );
    return response.data.data;
  },

  updateTimeSlot: async (slotId: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(
      `/services/healthcare/admin/doctors/slots/${slotId}`,
      data,
    );
    return response.data.data;
  },

  deleteTimeSlot: async (slotId: string) => {
    const response = await apiClient.delete(
      `/services/healthcare/admin/doctors/slots/${slotId}`,
    );
    return response.data;
  },

  // Service Registry (direct access through /registry/* route)
  getServices: async () => {
    const response = await apiClient.get('/registry/services');
    return response.data.services || [];
  },

  getPlatformHealth: async () => {
    const response = await apiClient.get('/registry/health');
    return response.data.platformHealth;
  },

  // Urban Admin
  getAllGrievances: async (filters?: Record<string, unknown>) => {
    const response = await apiClient.get('/services/urban/admin/grievances', {
      params: filters,
    });
    return response.data;
  },

  updateGrievanceStatus: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(
      `/services/urban/admin/grievances/${id}/status`,
      data,
    );
    return response.data.data;
  },

  // Agriculture Admin
  createScheme: async (data: Record<string, unknown>) => {
    const response = await apiClient.post(
      '/services/agriculture/admin/schemes',
      data,
    );
    return response.data.data;
  },

  updateScheme: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(
      `/services/agriculture/admin/schemes/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteScheme: async (id: string) => {
    const response = await apiClient.delete(
      `/services/agriculture/admin/schemes/${id}`,
    );
    return response.data;
  },

  createAdvisory: async (data: Record<string, unknown>) => {
    const response = await apiClient.post(
      '/services/agriculture/admin/advisories',
      data,
    );
    return response.data.data;
  },

  updateAdvisory: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(
      `/services/agriculture/admin/advisories/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteAdvisory: async (id: string) => {
    const response = await apiClient.delete(
      `/services/agriculture/admin/advisories/${id}`,
    );
    return response.data;
  },

  // Category management
  createCategory: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/services/urban/admin/categories', data);
    return response.data.data;
  },

  updateCategory: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(
      `/services/urban/admin/categories/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete(`/services/urban/admin/categories/${id}`);
    return response.data;
  },
};
