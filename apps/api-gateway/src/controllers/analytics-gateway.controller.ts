import { Controller, Get, Query } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import {
    QueryAnalyticsDto,
    PlatformAnalyticsResponse,
    ServiceAnalyticsResponse,
    UserAnalyticsResponse,
} from '../../dto/analytics/analytics.dto';

/**
 * Analytics Gateway Controller
 * Documents analytics service endpoints for Swagger UI.
 * NOTE: These endpoints are proxied to analytics-svc - no implementation here.
 * 
 * All analytics endpoints require PLATFORM_ADMIN role.
 */
@ApiTags('Analytics Services')
@ApiBearerAuth('JWT-auth')
@Controller('services/analytics')
export class AnalyticsGatewayController {
    @ApiOperation({
        summary: 'Get platform overview analytics',
        description: `
Retrieve high-level platform analytics and metrics.

**Requires:** PLATFORM_ADMIN role.

**Provides:**
- Total and active user counts
- Total API calls
- Average response time
- Error rate
- Service health status
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'Platform analytics retrieved successfully',
        type: PlatformAnalyticsResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Requires PLATFORM_ADMIN role' })
    @Get('platform')
    getPlatformAnalytics(@Query() _query: QueryAnalyticsDto) {
        // Proxied to analytics-svc
    }

    @ApiOperation({
        summary: 'Get service-specific analytics',
        description: `
Retrieve detailed analytics for a specific service.

**Requires:** PLATFORM_ADMIN role.

**Provides:**
- Request counts (total, successful, failed)
- Response time metrics (avg, P95, P99)
- Top endpoints by usage
- Request trends over time
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'Service analytics retrieved successfully',
        type: ServiceAnalyticsResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Requires PLATFORM_ADMIN role' })
    @Get('services')
    getServiceAnalytics(@Query() _query: QueryAnalyticsDto) {
        // Proxied to analytics-svc
    }

    @ApiOperation({
        summary: 'Get user analytics',
        description: `
Retrieve user-related analytics and metrics.

**Requires:** PLATFORM_ADMIN role.

**Provides:**
- User counts (total, new, active)
- Breakdown by role
- Breakdown by authentication method
- User growth trends
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'User analytics retrieved successfully',
        type: UserAnalyticsResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Requires PLATFORM_ADMIN role' })
    @Get('users')
    getUserAnalytics(@Query() _query: QueryAnalyticsDto) {
        // Proxied to analytics-svc
    }
}
