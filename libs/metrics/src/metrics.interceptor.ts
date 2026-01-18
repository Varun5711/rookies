/**
 * BharatSetu DPI Platform - Metrics Interceptor
 * Automatically collects HTTP request metrics
 */

import {
    Injectable,
    NestInterceptor,
    ExecutionContext,
    CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { MetricsService } from './metrics.service';

@Injectable()
export class MetricsInterceptor implements NestInterceptor {
    constructor(private readonly metricsService: MetricsService) { }

    intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
        const request = context.switchToHttp().getRequest();
        const response = context.switchToHttp().getResponse();

        const method = request.method;
        const path = request.route?.path || request.url;
        const startTime = Date.now();

        // Skip metrics endpoint
        if (path === '/metrics' || path === '/health') {
            return next.handle();
        }

        // Track request size
        const requestSize = parseInt(request.headers['content-length'] || '0', 10);
        if (requestSize > 0) {
            this.metricsService.observeHttpRequestSize(method, path, requestSize);
        }

        // Increment active requests
        this.metricsService.incrementActiveRequests(method, path);

        return next.handle().pipe(
            tap(() => {
                const duration = Date.now() - startTime;
                const statusCode = response.statusCode;

                // Record metrics
                this.metricsService.incrementHttpRequests(method, path, statusCode);
                this.metricsService.observeHttpDuration(method, path, statusCode, duration);
                this.metricsService.decrementActiveRequests(method, path);

                // Track response size
                const responseSize = parseInt(
                    response.getHeader('content-length') || '0',
                    10,
                );
                if (responseSize > 0) {
                    this.metricsService.observeHttpResponseSize(
                        method,
                        path,
                        statusCode,
                        responseSize,
                    );
                }
            }),
            catchError((error) => {
                const duration = Date.now() - startTime;
                const statusCode = error.status || 500;

                // Record error metrics
                this.metricsService.incrementHttpRequests(method, path, statusCode);
                this.metricsService.observeHttpDuration(method, path, statusCode, duration);
                this.metricsService.decrementActiveRequests(method, path);
                this.metricsService.incrementError(
                    error.constructor.name,
                    statusCode.toString(),
                );

                throw error;
            }),
        );
    }
}
