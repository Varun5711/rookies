export interface RegisteredService {
  id: string;
  name: string;
  displayName: string;
  description: string;
  baseUrl: string;
  healthEndpoint: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  healthStatus: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED';
  lastHealthCheck?: Date;
  version: string;
  owner: string;
  tags: string[];
  isPublic: boolean;
  requiredRoles: string[];
  createdAt: Date;
  updatedAt: Date;
}

export interface PlatformHealth {
  totalServices: number;
  activeServices: number;
  healthyServices: number;
  unhealthyServices: number;
  degradedServices: number;
  services: Array<{
    name: string;
    status: string;
    healthStatus: string;
    lastHealthCheck?: Date;
  }>;
}
