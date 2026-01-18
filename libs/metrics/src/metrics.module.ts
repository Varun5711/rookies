/**
 * BharatSetu DPI Platform - Metrics Module
 * Production-grade Prometheus metrics instrumentation
 */

import { Module, DynamicModule, Global } from '@nestjs/common';
import { MetricsService } from './metrics.service';
import { MetricsController } from './metrics.controller';
import { MetricsInterceptor } from './metrics.interceptor';
import { APP_INTERCEPTOR } from '@nestjs/core';

export interface MetricsModuleOptions {
  serviceName: string;
  defaultLabels?: Record<string, string>;
  enableDefaultMetrics?: boolean;
  pushGatewayUrl?: string;
  customBuckets?: number[];
}

@Global()
@Module({})
export class MetricsModule {
  static forRoot(options: MetricsModuleOptions): DynamicModule {
    return {
      module: MetricsModule,
      controllers: [MetricsController],
      providers: [
        {
          provide: 'METRICS_OPTIONS',
          useValue: options,
        },
        MetricsService,
        {
          provide: APP_INTERCEPTOR,
          useClass: MetricsInterceptor,
        },
      ],
      exports: [MetricsService],
    };
  }
}
