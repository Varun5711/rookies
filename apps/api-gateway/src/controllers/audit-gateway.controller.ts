import { Controller, Get, Query } from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiBearerAuth,
} from '@nestjs/swagger';
import {
    QueryAuditLogDto,
    AuditLogResponse,
    AuditAnalyticsResponse,
} from '../../dto/audit/audit.dto';

/**
 * Audit Gateway Controller
 * Documents audit service endpoints for Swagger UI.
 * NOTE: These endpoints are proxied to audit-svc - no implementation here.
 * 
 * All audit endpoints require PLATFORM_ADMIN role.
 */
@ApiTags('Audit Services')
@ApiBearerAuth('JWT-auth')
@Controller('services/audit')
export class AuditGatewayController {
    @ApiOperation({
        summary: 'Get audit logs',
        description: `
Retrieve a paginated list of audit logs with optional filtering.

**Requires:** PLATFORM_ADMIN role.

**Filters available:**
- User ID (to see actions by a specific user)
- Action type (create, read, update, delete, login, logout)
- Resource type (user, hospital, appointment, etc.)
- Resource ID
- Service name
- Date range
- Success/failure status
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'Audit logs retrieved successfully',
        type: [AuditLogResponse],
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Requires PLATFORM_ADMIN role' })
    @Get('logs')
    getAuditLogs(@Query() _query: QueryAuditLogDto) {
        // Proxied to audit-svc
    }

    @ApiOperation({
        summary: 'Get audit analytics',
        description: `
Retrieve aggregated analytics for audit logs.

**Requires:** PLATFORM_ADMIN role.

**Provides:**
- Total log count
- Success/failure counts
- Breakdown by action type
- Breakdown by resource type
- Breakdown by service
    `,
    })
    @ApiResponse({
        status: 200,
        description: 'Audit analytics retrieved successfully',
        type: AuditAnalyticsResponse,
    })
    @ApiResponse({ status: 401, description: 'Unauthorized' })
    @ApiResponse({ status: 403, description: 'Forbidden - Requires PLATFORM_ADMIN role' })
    @Get('analytics')
    getAuditAnalytics(@Query() _query: QueryAuditLogDto) {
        // Proxied to audit-svc
    }
}
