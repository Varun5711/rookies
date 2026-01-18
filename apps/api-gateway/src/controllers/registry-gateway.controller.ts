import { Controller, Get, Param, Query } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiBearerAuth,
    ApiPropertyOptional,
    ApiProperty,
} from '@nestjs/swagger';
import { Public } from '@dpi/common';

// Inline DTO definitions for registry since it's simpler

class ServiceInfoResponse {
    @ApiProperty({ description: 'Service name', example: 'healthcare-svc' })
    name: string;

    @ApiProperty({ description: 'Service URL', example: 'http://localhost:3003' })
    url: string;

    @ApiProperty({ description: 'Health check endpoint', example: '/health' })
    healthEndpoint: string;

    @ApiProperty({ description: 'Whether service is currently healthy', example: true })
    isHealthy: boolean;

    @ApiProperty({ description: 'Last health check timestamp' })
    lastHealthCheck: Date;

    @ApiProperty({ description: 'Service version', example: '1.0.0' })
    version: string;
}

class HealthCheckResponse {
    @ApiProperty({ description: 'Service status', example: 'healthy' })
    status: string;

    @ApiProperty({ description: 'Uptime in seconds', example: 86400 })
    uptime: number;

    @ApiProperty({ description: 'Timestamp of health check' })
    timestamp: Date;

    @ApiPropertyOptional({
        description: 'Service dependencies status',
        type: 'object',
        example: { database: 'healthy', redis: 'healthy' },
    })
    dependencies?: Record<string, string>;
}

/**
 * Registry Gateway Controller
 * Documents service registry endpoints for Swagger UI.
 * NOTE: These endpoints are proxied to service-registry - no implementation here.
 */
@ApiTags('Service Registry')
@Controller('registry')
export class RegistryGatewayController {
    @ApiOperation({
        summary: 'Get all registered services',
        description: `
Retrieve a list of all services registered in the service registry.

**Provides:**
- Service name and URL
- Health status
- Version information
- Last health check timestamp
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'List of services retrieved successfully',
        type: [ServiceInfoResponse],
    })
    @Public()
    @Get('services')
    getServices() {
        // Proxied to service-registry
    }

    @ApiOperation({
        summary: 'Get service by name',
        description: 'Retrieve detailed information about a specific registered service.',
    })
    @ApiParam({ name: 'name', description: 'Service name', example: 'healthcare-svc' })
    @ApiResponse({
        status: 200,
        description: 'Service details retrieved successfully',
        type: ServiceInfoResponse,
    })
    @ApiResponse({ status: 404, description: 'Service not found' })
    @Public()
    @Get('services/:name')
    getService(@Param('name') _name: string) {
        // Proxied to service-registry
    }

    @ApiOperation({
        summary: 'Check service health',
        description: 'Perform a health check on a specific service.',
    })
    @ApiParam({ name: 'name', description: 'Service name', example: 'healthcare-svc' })
    @ApiResponse({
        status: 200,
        description: 'Health check successful',
        type: HealthCheckResponse,
    })
    @ApiResponse({ status: 404, description: 'Service not found' })
    @ApiResponse({ status: 503, description: 'Service is unhealthy' })
    @Public()
    @Get('services/:name/health')
    checkServiceHealth(@Param('name') _name: string) {
        // Proxied to service-registry
    }

    @ApiOperation({
        summary: 'Get overall system health',
        description: `
Retrieve the health status of all registered services.

**Provides:**
- Overall system health status
- Individual service health status
- Dependencies status (database, Redis, etc.)
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'System health retrieved successfully',
        schema: {
            type: 'object',
            properties: {
                status: { type: 'string', example: 'healthy' },
                services: {
                    type: 'object',
                    additionalProperties: {
                        type: 'object',
                        properties: {
                            status: { type: 'string' },
                            url: { type: 'string' },
                            lastCheck: { type: 'string' },
                        },
                    },
                    example: {
                        'healthcare-svc': { status: 'healthy', url: 'http://localhost:3003', lastCheck: '2026-01-18T13:00:00Z' },
                        'agriculture-svc': { status: 'healthy', url: 'http://localhost:3004', lastCheck: '2026-01-18T13:00:00Z' },
                    },
                },
                timestamp: { type: 'string', example: '2026-01-18T13:00:00Z' },
            },
        },
    })
    @Public()
    @Get('health')
    getSystemHealth() {
        // Proxied to service-registry
    }
}
