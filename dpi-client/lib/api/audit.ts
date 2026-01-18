import apiClient from './client';

export interface AuditLog {
  id: string;
  eventType: string;
  userId: string;
  userName?: string;
  serviceName: string;
  action: string;
  resource: string;
  metadata?: Record<string, any>;
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

export interface AuditStats {
  totalEvents: number;
  uniqueUsers: number;
  eventsByType: { eventType: string; count: number }[];
  recentActivity: number;
}

export const auditApi = {
  // Get all audit logs with filters
  getAllLogs: async (filters?: {
    page?: number;
    limit?: number;
    eventType?: string;
    userId?: string;
    serviceName?: string;
    startDate?: string;
    endDate?: string;
  }) => {
    const response = await apiClient.get('/services/audit/admin/logs', {
      params: filters,
    });
    return response.data;
  },

  // Get logs by event type
  getLogsByEventType: async (eventType: string, filters?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get(`/services/audit/admin/logs/event/${eventType}`, {
      params: filters,
    });
    return response.data;
  },

  // Get user activity logs
  getUserActivity: async (userId: string, filters?: {
    page?: number;
    limit?: number;
  }) => {
    const response = await apiClient.get(`/services/audit/admin/logs/user/${userId}`, {
      params: filters,
    });
    return response.data;
  },

  // Get audit statistics
  getStats: async () => {
    const response = await apiClient.get('/services/audit/admin/stats');
    return response.data.data as AuditStats;
  },
};
