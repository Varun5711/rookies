import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { RegistryService } from './registry.service';

/**
 * Health Checker Service
 * Periodically checks health of all registered services
 *
 * Features:
 * - Runs every 30 seconds
 * - Checks /health endpoint of each active service
 * - Updates health status in database
 * - Logs unhealthy services
 * - Can emit Kafka events for alerting (TODO)
 */
@Injectable()
export class HealthCheckerService {
  private readonly logger = new Logger(HealthCheckerService.name);
  private isChecking = false; // Prevent concurrent checks

  constructor(
    private readonly registryService: RegistryService,
    private readonly httpService: HttpService,
  ) {}

  /**
   * Periodic health check - runs every 30 seconds
   * Using cron expression for better control
   */
  @Cron(CronExpression.EVERY_30_SECONDS)
  async checkServicesHealth(): Promise<void> {
    // Prevent concurrent health checks
    if (this.isChecking) {
      this.logger.debug('Health check already in progress, skipping...');
      return;
    }

    this.isChecking = true;

    try {
      const services = await this.registryService.getActiveServices();

      if (services.length === 0) {
        this.logger.debug('No active services to check');
        this.isChecking = false;
        return;
      }

      this.logger.debug(`Checking health of ${services.length} services...`);

      // Check all services in parallel
      const healthChecks = services.map((service) =>
        this.checkServiceHealth(service.id, service.name, service.baseUrl, service.healthEndpoint)
      );

      await Promise.allSettled(healthChecks);

      this.logger.debug('Health check completed');
    } catch (error) {
      this.logger.error('Error during health check:', error.message);
    } finally {
      this.isChecking = false;
    }
  }

  /**
   * Check health of a single service
   */
  private async checkServiceHealth(
    id: string,
    name: string,
    baseUrl: string,
    healthEndpoint: string
  ): Promise<void> {
    const healthUrl = `${baseUrl}${healthEndpoint}`;

    try {
      // Make health check request with 5 second timeout
      const response = await firstValueFrom(
        this.httpService.get(healthUrl, {
          timeout: 5000,
          validateStatus: () => true, // Don't throw on any status
        })
      );

      // Determine health status based on response
      let healthStatus: 'HEALTHY' | 'UNHEALTHY' | 'DEGRADED';

      if (response.status === 200) {
        // Check if response has status field
        const responseData = response.data;

        if (responseData?.status === 'healthy') {
          healthStatus = 'HEALTHY';
        } else if (responseData?.status === 'degraded') {
          healthStatus = 'DEGRADED';
        } else {
          // HTTP 200 but no proper status field
          healthStatus = 'HEALTHY'; // Assume healthy if endpoint responds
        }
      } else if (response.status >= 500) {
        healthStatus = 'UNHEALTHY';
      } else {
        healthStatus = 'DEGRADED'; // 4xx errors
      }

      // Update health status in database
      await this.registryService.updateHealthStatus(id, healthStatus);

      if (healthStatus !== 'HEALTHY') {
        this.logger.warn(
          `Service ${name} is ${healthStatus} (HTTP ${response.status})`
        );
      }
    } catch (error) {
      // Service is unreachable or timed out
      await this.registryService.updateHealthStatus(id, 'UNHEALTHY');

      this.logger.error(
        `Service ${name} health check failed: ${error.message}`
      );

      // TODO: Emit Kafka event for alerting
      // this.kafkaService.emit('dpi.registry.service-unhealthy', {
      //   serviceId: id,
      //   serviceName: name,
      //   error: error.message,
      //   timestamp: new Date().toISOString(),
      // });
    }
  }

  /**
   * Manual health check for a specific service (on-demand)
   */
  async checkServiceNow(serviceName: string): Promise<void> {
    const service = await this.registryService.getServiceByName(serviceName);

    if (!service) {
      throw new Error(`Service '${serviceName}' not found`);
    }

    await this.checkServiceHealth(
      service.id,
      service.name,
      service.baseUrl,
      service.healthEndpoint
    );
  }
}
