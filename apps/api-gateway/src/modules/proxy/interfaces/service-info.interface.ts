/**
 * Service Information Interface
 * Represents the service metadata retrieved from Service Registry
 */
export interface ServiceInfo {
  id: string;
  name: string;
  displayName: string;
  description: string;
  baseUrl: string;
  healthEndpoint: string;
  status: 'ACTIVE' | 'INACTIVE' | 'MAINTENANCE';
  healthStatus: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED';
  version: string;
  isPublic: boolean;
  requiredRoles: string[];
}
