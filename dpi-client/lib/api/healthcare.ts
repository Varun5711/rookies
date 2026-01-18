import apiClient from './client';
import {
  Hospital,
  Doctor,
  Appointment,
  BookAppointmentDTO,
  TimeSlot,
} from '../types/healthcare';
import { PaginatedResponse, PaginationParams } from '../types/common';

interface HospitalFilters extends PaginationParams {
  city?: string;
  state?: string;
  type?: string;
  search?: string;
}

interface DoctorFilters extends PaginationParams {
  hospitalId?: string;
  specialization?: string;
  search?: string;
}

export const healthcareApi = {
  // Hospitals
  getHospitals: async (
    filters?: HospitalFilters,
  ): Promise<PaginatedResponse<Hospital>> => {
    const response = await apiClient.get('/services/healthcare/hospitals', {
      params: filters,
    });
    return response.data;
  },

  getHospital: async (id: string): Promise<Hospital> => {
    const response = await apiClient.get(
      `/services/healthcare/hospitals/${id}`,
    );
    return response.data.data;
  },

  // Doctors
  getDoctors: async (
    filters?: DoctorFilters,
  ): Promise<PaginatedResponse<Doctor>> => {
    const response = await apiClient.get('/services/healthcare/doctors', {
      params: filters,
    });
    return response.data;
  },

  getDoctor: async (id: string): Promise<Doctor> => {
    const response = await apiClient.get(`/services/healthcare/doctors/${id}`);
    return response.data.data;
  },

  getDoctorSlots: async (doctorId: string): Promise<TimeSlot[]> => {
    const response = await apiClient.get(
      `/services/healthcare/doctors/${doctorId}/slots`,
    );
    return response.data.data;
  },

  // Appointments
  getMyAppointments: async (
    filters?: PaginationParams,
  ): Promise<PaginatedResponse<Appointment>> => {
    const response = await apiClient.get(
      '/services/healthcare/appointments/me',
      { params: filters },
    );
    return response.data;
  },

  getAppointment: async (id: string): Promise<Appointment> => {
    const response = await apiClient.get(
      `/services/healthcare/appointments/${id}`,
    );
    return response.data.data;
  },

  bookAppointment: async (data: BookAppointmentDTO): Promise<Appointment> => {
    const response = await apiClient.post(
      '/services/healthcare/appointments',
      data,
    );
    return response.data.data;
  },

  cancelAppointment: async (
    id: string,
    reason: string,
  ): Promise<Appointment> => {
    const response = await apiClient.put(
      `/services/healthcare/appointments/${id}/cancel`,
      { reason },
    );
    return response.data.data;
  },
};
