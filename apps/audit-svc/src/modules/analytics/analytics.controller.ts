import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { AdminOnly } from '@dpi/common';

@Controller('admin/analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('overview')
    @AdminOnly()
    async getOverview() {
        return this.analyticsService.getOverview();
    }

    @Get('trends')
    @AdminOnly()
    async getTrends(@Query('period') period: string = '7d') {
        return this.analyticsService.getTrends(period);
    }

    @Get('services')
    @AdminOnly()
    async getServiceStats() {
        return this.analyticsService.getServiceStats();
    }
}
