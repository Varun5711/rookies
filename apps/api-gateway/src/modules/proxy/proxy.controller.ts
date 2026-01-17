import {
  Controller,
  All,
  Param,
  Req,
  Res,
  HttpException,
  HttpStatus,
  Logger,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ProxyService } from './proxy.service';
import { ServiceRegistryClient } from './service-registry.client';
import { CurrentUser, Public } from '@dpi/common';
import { OptionalJwtAuthGuard } from '../../guards/optional-jwt-auth.guard';

/**
 * Proxy Controller
 * Handles all dynamic routing to registered services.
 *
 * Key Features:
 * 1. Dynamic route resolution from Service Registry
 * 2. Redis caching for service info (5 min TTL)
 * 3. Authentication check for non-public services
 * 4. Role-based access control
 * 5. Request forwarding with correlation ID
 *
 * Route Pattern: /api/services/:serviceName/*
 * Example: GET /api/services/healthcare/hospitals -> healthcare-svc:3010/api/hospitals
 *
 * Note: @Public() bypasses the global JwtAuthGuard.
 * OptionalJwtAuthGuard is applied to still extract user context when present.
 * Authentication is then checked dynamically based on service.isPublic.
 */
@Public() // Bypass global JwtAuthGuard - auth is handled dynamically per service
@UseGuards(OptionalJwtAuthGuard) // Extract user from JWT if present
@Controller('services')
export class ProxyController {
  private readonly logger = new Logger(ProxyController.name);

  constructor(
    private readonly proxyService: ProxyService,
    private readonly registryClient: ServiceRegistryClient,
  ) {}

  /**
   * Handle requests to /api/services/:serviceName (root path)
   */
  @All(':serviceName')
  async proxyRootRequest(
    @Param('serviceName') serviceName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    return this.handleProxyRequest(serviceName, '', req, res);
  }

  /**
   * Handle requests to /api/services/:serviceName/*
   */
  @All(':serviceName/*')
  async proxyRequest(
    @Param('serviceName') serviceName: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    // Extract path from request URL to avoid NestJS routing issues
    const pathMatch = req.url.match(/^\/api\/services\/[^\/]+\/(.+?)(?:\?|$)/);
    const fullPath = pathMatch ? pathMatch[1] : '';
    return this.handleProxyRequest(serviceName, fullPath, req, res);
  }

  /**
   * Core proxy logic
   */
  private async handleProxyRequest(
    serviceName: string,
    path: string,
    req: Request,
    res: Response,
  ) {
    const correlationId = (req.headers['x-correlation-id'] as string) || '';
    const user = (req as any).user as CurrentUser | undefined;

    this.logger.debug(
      `[${correlationId}] Routing request: ${req.method} /services/${serviceName}/${path}`,
    );

    // 1. Query Service Registry
    const service = await this.registryClient.getService(serviceName);

    // 2. Service not found
    if (!service) {
      this.logger.warn(`[${correlationId}] Service not found: ${serviceName}`);
      throw new HttpException(
        {
          statusCode: HttpStatus.NOT_FOUND,
          message: `Service '${serviceName}' not found`,
          error: 'Not Found',
        },
        HttpStatus.NOT_FOUND,
      );
    }

    // 3. Check if service is available
    if (!this.registryClient.isServiceAvailable(service)) {
      this.logger.warn(
        `[${correlationId}] Service unavailable: ${serviceName} (status: ${service.status}, health: ${service.healthStatus})`,
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.SERVICE_UNAVAILABLE,
          message: `Service '${service.displayName}' is currently unavailable`,
          error: 'Service Unavailable',
        },
        HttpStatus.SERVICE_UNAVAILABLE,
      );
    }

    // 4. Check authentication for non-public services
    if (!service.isPublic && !user) {
      this.logger.warn(
        `[${correlationId}] Unauthorized access attempt to ${serviceName}`,
      );
      throw new HttpException(
        {
          statusCode: HttpStatus.UNAUTHORIZED,
          message: 'Authentication required to access this service',
          error: 'Unauthorized',
        },
        HttpStatus.UNAUTHORIZED,
      );
    }

    // 5. Check role-based access
    if (service.requiredRoles?.length > 0 && user) {
      const userRoles = user.roles || [];
      const hasRequiredRole = service.requiredRoles.some((role) =>
        userRoles.includes(role as any),
      );

      if (!hasRequiredRole) {
        this.logger.warn(
          `[${correlationId}] Forbidden access to ${serviceName} by user ${user.sub}`,
        );
        throw new HttpException(
          {
            statusCode: HttpStatus.FORBIDDEN,
            message: 'Insufficient permissions to access this service',
            error: 'Forbidden',
          },
          HttpStatus.FORBIDDEN,
        );
      }
    }

    // 6. Build target path (add /api prefix for the target service)
    const targetPath = `/api/${path}`;

    this.logger.log(
      `[${correlationId}] Forwarding to ${service.name}: ${req.method} ${targetPath}`,
    );

    // 7. Forward request
    await this.proxyService.forwardRequest(
      req,
      res,
      service,
      targetPath,
      correlationId,
    );
  }
}
