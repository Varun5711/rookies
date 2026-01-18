import { Controller, Get, Query, Headers } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AdminOnly } from '@dpi/common';

@Controller('admin/analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('overview')
    @AdminOnly()
    async getDashboardStats(@Headers('authorization') auth: string) {
        const token = auth?.replace('Bearer ', '');
        return this.analyticsService.getDashboardStats(token);
    }

    @Get('trends')
    @AdminOnly()
    async getTrends(
        @Headers('authorization') auth: string,
        @Query('days') days?: number,
    ) {
        const token = auth?.replace('Bearer ', '');
        return this.analyticsService.getTrends(token, days || 7);
    }

    @Get('service-health')
    @AdminOnly()
    async getServiceHealth(@Headers('authorization') auth: string) {
        const token = auth?.replace('Bearer ', '');
        return this.analyticsService.getServiceHealth(token);
    }
}
