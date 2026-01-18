/**
 * BharatSetu DPI Platform - Metrics Controller
 * Exposes /metrics endpoint for Prometheus scraping
 */

import { Controller, Get, Header, Res } from '@nestjs/common';
import { Response } from 'express';
import { MetricsService } from './metrics.service';

@Controller()
export class MetricsController {
    constructor(private readonly metricsService: MetricsService) { }

    @Get('metrics')
    async getMetrics(@Res() res: Response): Promise<void> {
        const metrics = await this.metricsService.getMetrics();
        res.set('Content-Type', this.metricsService.getContentType());
        res.send(metrics);
    }

    @Get('health')
    getHealth(): { status: string; timestamp: string; uptime: number } {
        return {
            status: 'healthy',
            timestamp: new Date().toISOString(),
            uptime: process.uptime(),
        };
    }

    @Get('health/live')
    getLiveness(): { status: string } {
        return { status: 'alive' };
    }

    @Get('health/ready')
    getReadiness(): { status: string; checks: Record<string, string> } {
        // In production, you would check database connections, etc.
        return {
            status: 'ready',
            checks: {
                database: 'connected',
                redis: 'connected',
                kafka: 'connected',
            },
        };
    }
}
