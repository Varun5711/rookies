import apiClient from './client';
import { LoginResponse } from '../types/auth';

export const authApi = {
  sendOtp: async (mobile: string) => {
    const response = await apiClient.post('/auth/otp/send', { mobile });
    return response.data;
  },

  verifyOtp: async (mobile: string, otp: string): Promise<LoginResponse> => {
    const response = await apiClient.post('/auth/otp/verify', { mobile, otp });
    return response.data.data;
  },

  getGoogleLoginUrl: () => {
    return `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api'}/auth/google/login`;
  },

  refreshToken: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/tokens/refresh', { refreshToken });
    return response.data.data;
  },

  logout: async (refreshToken: string) => {
    const response = await apiClient.post('/auth/tokens/logout', { refreshToken });
    return response.data;
  },
};
