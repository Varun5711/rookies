import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AuditAction {
    CREATE = 'create',
    READ = 'read',
    UPDATE = 'update',
    DELETE = 'delete',
    LOGIN = 'login',
    LOGOUT = 'logout',
    ACCESS = 'access',
}

export enum AuditResource {
    USER = 'user',
    HOSPITAL = 'hospital',
    DOCTOR = 'doctor',
    APPOINTMENT = 'appointment',
    SCHEME = 'scheme',
    APPLICATION = 'application',
    GRIEVANCE = 'grievance',
    ADVISORY = 'advisory',
    MARKET_PRICE = 'market_price',
}

export class QueryAuditLogDto {
    @ApiPropertyOptional({ description: 'Filter by user ID' })
    userId?: string;

    @ApiPropertyOptional({ description: 'Filter by action', enum: AuditAction })
    action?: AuditAction;

    @ApiPropertyOptional({ description: 'Filter by resource type', enum: AuditResource })
    resource?: AuditResource;

    @ApiPropertyOptional({ description: 'Filter by resource ID' })
    resourceId?: string;

    @ApiPropertyOptional({ description: 'Filter by service name', example: 'healthcare-svc' })
    serviceName?: string;

    @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)', example: '2026-01-01' })
    fromDate?: string;

    @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)', example: '2026-01-31' })
    toDate?: string;

    @ApiPropertyOptional({ description: 'Filter by success/failure', example: true })
    success?: boolean;

    @ApiPropertyOptional({ description: 'Page number', example: 1, default: 1, minimum: 1 })
    page?: number;

    @ApiPropertyOptional({ description: 'Items per page', example: 10, default: 10, minimum: 1, maximum: 100 })
    limit?: number;
}

export class AuditLogResponse {
    @ApiProperty({ description: 'Audit log ID', example: '550e8400-e29b-41d4-a716-446655440000' })
    id: string;

    @ApiPropertyOptional({ description: 'User ID who performed the action' })
    userId?: string;

    @ApiProperty({ description: 'Action performed', enum: AuditAction })
    action: AuditAction;

    @ApiProperty({ description: 'Resource type', enum: AuditResource })
    resource: AuditResource;

    @ApiPropertyOptional({ description: 'Resource ID' })
    resourceId?: string;

    @ApiProperty({ description: 'Service that generated the log', example: 'healthcare-svc' })
    serviceName: string;

    @ApiProperty({ description: 'Whether action was successful', example: true })
    success: boolean;

    @ApiPropertyOptional({ description: 'Error message (if failed)' })
    errorMessage?: string;

    @ApiPropertyOptional({ description: 'IP address' })
    ipAddress?: string;

    @ApiPropertyOptional({ description: 'User agent' })
    userAgent?: string;

    @ApiPropertyOptional({ description: 'Correlation ID for request tracking' })
    correlationId?: string;

    @ApiPropertyOptional({ description: 'Additional metadata', type: 'object' })
    metadata?: Record<string, unknown>;

    @ApiProperty({ description: 'Timestamp of the action' })
    createdAt: Date;
}

export class AuditAnalyticsResponse {
    @ApiProperty({ description: 'Total number of audit logs' })
    totalLogs: number;

    @ApiProperty({ description: 'Number of successful actions' })
    successCount: number;

    @ApiProperty({ description: 'Number of failed actions' })
    failureCount: number;

    @ApiProperty({ description: 'Actions by type', type: 'object', example: { create: 100, read: 500, update: 50 } })
    byAction: Record<string, number>;

    @ApiProperty({ description: 'Actions by resource', type: 'object', example: { hospital: 200, appointment: 300 } })
    byResource: Record<string, number>;

    @ApiProperty({ description: 'Actions by service', type: 'object', example: { 'healthcare-svc': 400, 'urban-svc': 200 } })
    byService: Record<string, number>;
}
