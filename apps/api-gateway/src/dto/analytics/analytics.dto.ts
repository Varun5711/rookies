import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export enum AnalyticsPeriod {
    DAILY = 'daily',
    WEEKLY = 'weekly',
    MONTHLY = 'monthly',
    YEARLY = 'yearly',
}

export class QueryAnalyticsDto {
    @ApiPropertyOptional({ description: 'Filter by service name', example: 'healthcare-svc' })
    serviceName?: string;

    @ApiPropertyOptional({ description: 'Time period for aggregation', enum: AnalyticsPeriod, default: AnalyticsPeriod.DAILY })
    period?: AnalyticsPeriod;

    @ApiPropertyOptional({ description: 'Start date (YYYY-MM-DD)', example: '2026-01-01' })
    fromDate?: string;

    @ApiPropertyOptional({ description: 'End date (YYYY-MM-DD)', example: '2026-01-31' })
    toDate?: string;
}

export class PlatformAnalyticsResponse {
    @ApiProperty({ description: 'Total registered users', example: 50000 })
    totalUsers: number;

    @ApiProperty({ description: 'Active users (last 30 days)', example: 15000 })
    activeUsers: number;

    @ApiProperty({ description: 'Total API requests', example: 1000000 })
    totalApiCalls: number;

    @ApiProperty({ description: 'Average response time in milliseconds', example: 150 })
    avgResponseTime: number;

    @ApiProperty({ description: 'Error rate percentage', example: 0.5 })
    errorRate: number;

    @ApiProperty({
        description: 'Service health overview',
        type: 'object',
        example: {
            'healthcare-svc': { healthy: true, uptime: 99.9 },
            'agriculture-svc': { healthy: true, uptime: 99.8 },
        },
    })
    serviceHealth: Record<string, { healthy: boolean; uptime: number }>;
}

export class ServiceAnalyticsResponse {
    @ApiProperty({ description: 'Service name', example: 'healthcare-svc' })
    serviceName: string;

    @ApiProperty({ description: 'Total requests', example: 100000 })
    totalRequests: number;

    @ApiProperty({ description: 'Successful requests', example: 99500 })
    successfulRequests: number;

    @ApiProperty({ description: 'Failed requests', example: 500 })
    failedRequests: number;

    @ApiProperty({ description: 'Average response time in milliseconds', example: 120 })
    avgResponseTime: number;

    @ApiProperty({ description: 'P95 response time in milliseconds', example: 250 })
    p95ResponseTime: number;

    @ApiProperty({ description: 'P99 response time in milliseconds', example: 500 })
    p99ResponseTime: number;

    @ApiProperty({
        description: 'Top endpoints by request count',
        type: 'array',
        example: [
            { endpoint: 'GET /hospitals', count: 5000 },
            { endpoint: 'GET /doctors', count: 3000 },
        ],
    })
    topEndpoints: Array<{ endpoint: string; count: number }>;

    @ApiProperty({
        description: 'Requests over time',
        type: 'array',
        example: [
            { date: '2026-01-01', count: 1000 },
            { date: '2026-01-02', count: 1200 },
        ],
    })
    requestsOverTime: Array<{ date: string; count: number }>;
}

export class UserAnalyticsResponse {
    @ApiProperty({ description: 'Total registered users', example: 50000 })
    totalUsers: number;

    @ApiProperty({ description: 'New users (selected period)', example: 1500 })
    newUsers: number;

    @ApiProperty({ description: 'Active users (selected period)', example: 10000 })
    activeUsers: number;

    @ApiProperty({
        description: 'Users by role',
        type: 'object',
        example: { citizen: 45000, service_provider: 4500, platform_admin: 50 },
    })
    byRole: Record<string, number>;

    @ApiProperty({
        description: 'Users by authentication method',
        type: 'object',
        example: { mobile_otp: 35000, google_oauth: 15000 },
    })
    byAuthMethod: Record<string, number>;

    @ApiProperty({
        description: 'User growth over time',
        type: 'array',
        example: [
            { date: '2026-01-01', count: 100 },
            { date: '2026-01-02', count: 150 },
        ],
    })
    growthOverTime: Array<{ date: string; count: number }>;
}
