import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { RedisService } from '@dpi/redis';
import { ServiceInfo } from './interfaces/service-info.interface';
import { firstValueFrom } from 'rxjs';

/**
 * Service Registry Client
 * Handles dynamic service discovery by querying the Service Registry.
 * Uses Redis caching to minimize registry requests (5 min TTL).
 */
@Injectable()
export class ServiceRegistryClient implements OnModuleInit {
  private readonly logger = new Logger(ServiceRegistryClient.name);
  private readonly CACHE_PREFIX = 'gateway:service:';
  private readonly CACHE_TTL = 300; // 5 minutes in seconds
  private readonly registryUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly redisService: RedisService,
  ) {
    this.registryUrl =
      process.env.SERVICE_REGISTRY_URL || 'http://localhost:3002';
  }

  async onModuleInit() {
    this.logger.log(
      `Service Registry Client initialized. Registry URL: ${this.registryUrl}`,
    );
  }

  /**
   * Get service info by name
   * First checks Redis cache, then queries Service Registry
   */
  async getService(serviceName: string): Promise<ServiceInfo | null> {
    const cacheKey = `${this.CACHE_PREFIX}${serviceName}`;

    // Try cache first
    const cached = await this.redisService.get<ServiceInfo>(cacheKey);
    if (cached) {
      this.logger.debug(`Cache hit for service: ${serviceName}`);
      return cached;
    }

    // Query Service Registry
    try {
      const response = await firstValueFrom(
        this.httpService.get<ServiceInfo>(
          `${this.registryUrl}/api/registry/services/${serviceName}`,
          { timeout: 5000 },
        ),
      );

      const service = response.data;

      // Cache the result
      await this.redisService.set(cacheKey, service, this.CACHE_TTL);
      this.logger.debug(`Cached service info for: ${serviceName}`);

      return service;
    } catch (error: any) {
      if (error.response?.status === 404) {
        this.logger.warn(`Service not found: ${serviceName}`);
        return null;
      }

      this.logger.error(
        `Failed to fetch service ${serviceName}: ${error.message}`,
      );
      return null;
    }
  }

  /**
   * Get all registered services
   */
  async getAllServices(): Promise<ServiceInfo[]> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<ServiceInfo[]>(
          `${this.registryUrl}/api/registry/services`,
          { timeout: 5000 },
        ),
      );

      return response.data;
    } catch (error: any) {
      this.logger.error(`Failed to fetch all services: ${error.message}`);
      return [];
    }
  }

  /**
   * Invalidate cache for a specific service
   */
  async invalidateCache(serviceName: string): Promise<void> {
    const cacheKey = `${this.CACHE_PREFIX}${serviceName}`;
    await this.redisService.del(cacheKey);
    this.logger.debug(`Cache invalidated for service: ${serviceName}`);
  }

  /**
   * Invalidate all service cache entries
   */
  async invalidateAllCache(): Promise<void> {
    await this.redisService.deletePattern(`${this.CACHE_PREFIX}*`);
    this.logger.debug('All service cache invalidated');
  }

  /**
   * Check if a service is available (active and healthy)
   */
  isServiceAvailable(service: ServiceInfo): boolean {
    return (
      service.status === 'ACTIVE' &&
      (service.healthStatus === 'HEALTHY' ||
        service.healthStatus === 'DEGRADED')
    );
  }
}
