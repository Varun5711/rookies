import apiClient from './client';

export interface PlatformStats {
  totalServices: number;
  statesCovered: number;
  supportAvailability: string;
}

export const platformApi = {
  getStats: async (): Promise<PlatformStats> => {
    try {
      const response = await apiClient.get('/registry/services');
      const services = response.data.services || [];

      return {
        totalServices: services.length || 0,
        statesCovered: 28, // Static - India has 28 states + 8 UTs
        supportAvailability: '24/7', // Static - platform availability
      };
    } catch (error) {
      // Return zeros on error (will show empty state in UI)
      return {
        totalServices: 0,
        statesCovered: 28,
        supportAvailability: '24/7',
      };
    }
  },
};
