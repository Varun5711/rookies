/**
 * BharatSetu DPI Platform - Database Metrics Subscriber
 * Automatically collects TypeORM query metrics
 */

import { Logger } from '@nestjs/common';
import {
    EntitySubscriberInterface,
    EventSubscriber,
    InsertEvent,
    UpdateEvent,
    RemoveEvent,
    LoadEvent,
} from 'typeorm';
import { MetricsService } from './metrics.service';

@EventSubscriber()
export class DatabaseMetricsSubscriber implements EntitySubscriberInterface {
    private readonly logger = new Logger(DatabaseMetricsSubscriber.name);
    private metricsService: MetricsService | null = null;

    setMetricsService(metricsService: MetricsService) {
        this.metricsService = metricsService;
    }

    afterLoad(event: LoadEvent<any>) {
        if (this.metricsService) {
            const tableName = event.metadata?.tableName || 'unknown';
            // Note: TypeORM doesn't provide query duration in subscribers
            // For precise timing, use query logging or custom decorators
            this.metricsService.observeDbQueryDuration('SELECT', tableName, 1);
        }
    }

    afterInsert(event: InsertEvent<any>) {
        if (this.metricsService) {
            const tableName = event.metadata?.tableName || 'unknown';
            this.metricsService.observeDbQueryDuration('INSERT', tableName, 1);
        }
    }

    afterUpdate(event: UpdateEvent<any>) {
        if (this.metricsService) {
            const tableName = event.metadata?.tableName || 'unknown';
            this.metricsService.observeDbQueryDuration('UPDATE', tableName, 1);
        }
    }

    afterRemove(event: RemoveEvent<any>) {
        if (this.metricsService) {
            const tableName = event.metadata?.tableName || 'unknown';
            this.metricsService.observeDbQueryDuration('DELETE', tableName, 1);
        }
    }
}

/**
 * Decorator for measuring method execution time
 */
export function MeasureDbQuery(operation: string, table: string) {
    return function (
        target: any,
        propertyKey: string,
        descriptor: PropertyDescriptor,
    ) {
        const originalMethod = descriptor.value;

        descriptor.value = async function (...args: any[]) {
            const startTime = Date.now();
            try {
                const result = await originalMethod.apply(this, args);
                const duration = Date.now() - startTime;

                // Try to get metrics service from the instance
                if ((this as any).metricsService) {
                    (this as any).metricsService.observeDbQueryDuration(
                        operation,
                        table,
                        duration,
                    );
                }

                return result;
            } catch (error) {
                const duration = Date.now() - startTime;

                if ((this as any).metricsService) {
                    (this as any).metricsService.observeDbQueryDuration(
                        operation,
                        table,
                        duration,
                    );
                    (this as any).metricsService.incrementDbQueryError(
                        operation,
                        table,
                        (error as Error).constructor.name,
                    );
                }

                throw error;
            }
        };

        return descriptor;
    };
}
