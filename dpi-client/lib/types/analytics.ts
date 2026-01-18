/**
 * Analytics Types
 * Type definitions for admin analytics and dashboard data
 */

export interface DashboardStats {
  total_users: number;
  total_appointments: number;
  total_applications: number;
  total_grievances: number;
  appointment_stats: AppointmentStat[];
  application_stats: ApplicationStats;
  grievance_stats: GrievanceStats;
}

export interface AppointmentStat {
  status: string;
  count: string | number;
}

export interface ApplicationStats {
  totalSchemes?: number;
  activeSchemes?: number;
  totalApplications: number;
  applicationsByStatus?: StatusCount[];
  schemesByCategory?: CategoryCount[];
}

export interface GrievanceStats {
  total: number;
  byStatus?: StatusCount[];
  byPriority?: PriorityCount[];
}

export interface StatusCount {
  status: string;
  count: string | number;
}

export interface CategoryCount {
  category: string;
  count: string | number;
}

export interface PriorityCount {
  priority: string;
  count: string | number;
}

export interface TrendData {
  date: string;
  events: number;
  unique_services: number;
}

export interface ServiceHealth {
  name: string;
  status: 'healthy' | 'unhealthy' | 'error';
  uptime?: number;
  error?: string;
}

export interface AnalyticsResponse<T> {
  data: T;
  error?: string;
  timestamp: string;
}
