import apiClient from './client';

export const adminApi = {
  // Healthcare Admin
  createHospital: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/services/healthcare/hospitals', data);
    return response.data.data || response.data;
  },

  updateHospital: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/services/healthcare/hospitals/${id}`, data);
    return response.data.data || response.data;
  },

  deleteHospital: async (id: string) => {
    const response = await apiClient.delete(`/services/healthcare/hospitals/${id}`);
    return response.data;
  },

  createDoctor: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/services/healthcare/doctors', data);
    return response.data.data || response.data;
  },

  updateDoctor: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/services/healthcare/doctors/${id}`, data);
    return response.data.data || response.data;
  },

  deleteDoctor: async (id: string) => {
    const response = await apiClient.delete(`/services/healthcare/doctors/${id}`);
    return response.data;
  },

  getAllAppointments: async (filters?: Record<string, unknown>) => {
    const response = await apiClient.get('/services/healthcare/appointments', { params: filters });
    return response.data;
  },

  // Time Slots
  createTimeSlot: async (doctorId: string, data: Record<string, unknown>) => {
    const response = await apiClient.post(`/services/healthcare/doctors/${doctorId}/slots`, data);
    return response.data.data || response.data;
  },

  updateTimeSlot: async (slotId: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/services/healthcare/doctors/slots/${slotId}`, data);
    return response.data.data || response.data;
  },

  deleteTimeSlot: async (slotId: string) => {
    const response = await apiClient.delete(`/services/healthcare/doctors/slots/${slotId}`);
    return response.data;
  },

  // Service Registry
  getServices: async () => {
    const response = await apiClient.get('/registry/services');
    return response.data.data || response.data;
  },

  getPlatformHealth: async () => {
    const response = await apiClient.get('/registry/health');
    return response.data.data || response.data;
  },

  // Urban Admin
  getAllGrievances: async (filters?: Record<string, unknown>) => {
    const response = await apiClient.get('/services/urban/grievances', { params: filters });
    return response.data;
  },

  updateGrievanceStatus: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/services/urban/grievances/${id}/status`, data);
    return response.data.data || response.data;
  },

  // Agriculture Admin
  createScheme: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/services/agriculture/schemes', data);
    return response.data.data || response.data;
  },

  updateScheme: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/services/agriculture/schemes/${id}`, data);
    return response.data.data || response.data;
  },

  deleteScheme: async (id: string) => {
    const response = await apiClient.delete(`/services/agriculture/schemes/${id}`);
    return response.data;
  },

  createAdvisory: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/services/agriculture/advisories', data);
    return response.data.data || response.data;
  },

  updateAdvisory: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/services/agriculture/advisories/${id}`, data);
    return response.data.data || response.data;
  },

  deleteAdvisory: async (id: string) => {
    const response = await apiClient.delete(`/services/agriculture/advisories/${id}`);
    return response.data;
  },

  // Category management
  createCategory: async (data: Record<string, unknown>) => {
    const response = await apiClient.post('/services/urban/categories', data);
    return response.data.data || response.data;
  },

  updateCategory: async (id: string, data: Record<string, unknown>) => {
    const response = await apiClient.put(`/services/urban/categories/${id}`, data);
    return response.data.data || response.data;
  },

  deleteCategory: async (id: string) => {
    const response = await apiClient.delete(`/services/urban/categories/${id}`);
    return response.data;
  },
};
