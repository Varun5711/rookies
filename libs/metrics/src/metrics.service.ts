/**
 * BharatSetu DPI Platform - Metrics Service
 * Provides comprehensive Prometheus metrics collection
 */

import { Injectable, Inject, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import {
    Registry,
    Counter,
    Histogram,
    Gauge,
    Summary,
    collectDefaultMetrics,
    register,
} from 'prom-client';
import { MetricsModuleOptions } from './metrics.module';

@Injectable()
export class MetricsService implements OnModuleInit, OnModuleDestroy {
    private readonly registry: Registry;
    private readonly serviceName: string;

    // HTTP Metrics
    private readonly httpRequestsTotal: Counter;
    private readonly httpRequestDuration: Histogram;
    private readonly httpRequestSize: Summary;
    private readonly httpResponseSize: Summary;
    private readonly httpActiveRequests: Gauge;

    // Application Metrics
    private readonly appInfo: Gauge;
    private readonly appUptime: Gauge;

    // Database Metrics
    private readonly dbQueryDuration: Histogram;
    private readonly dbConnectionsActive: Gauge;
    private readonly dbConnectionsIdle: Gauge;
    private readonly dbQueryTotal: Counter;
    private readonly dbQueryErrors: Counter;

    // Cache Metrics (Redis)
    private readonly cacheHits: Counter;
    private readonly cacheMisses: Counter;
    private readonly cacheOperationDuration: Histogram;

    // Kafka Metrics
    private readonly kafkaMessagesProduced: Counter;
    private readonly kafkaMessagesConsumed: Counter;
    private readonly kafkaConsumerLag: Gauge;
    private readonly kafkaMessageProcessingDuration: Histogram;

    // Business Metrics
    private readonly businessOperations: Counter;
    private readonly businessOperationDuration: Histogram;
    private readonly activeUsers: Gauge;

    // Error Metrics
    private readonly errorsTotal: Counter;
    private readonly unhandledExceptions: Counter;

    constructor(
        @Inject('METRICS_OPTIONS') private readonly options: MetricsModuleOptions,
    ) {
        this.serviceName = options.serviceName;
        this.registry = new Registry();

        // Set default labels
        this.registry.setDefaultLabels({
            service: this.serviceName,
            ...options.defaultLabels,
        });

        // HTTP Request Counter
        this.httpRequestsTotal = new Counter({
            name: 'http_requests_total',
            help: 'Total number of HTTP requests',
            labelNames: ['method', 'path', 'status', 'service'],
            registers: [this.registry],
        });

        // HTTP Request Duration Histogram
        const buckets = options.customBuckets || [
            0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10,
        ];
        this.httpRequestDuration = new Histogram({
            name: 'http_request_duration_seconds',
            help: 'HTTP request duration in seconds',
            labelNames: ['method', 'path', 'status', 'service'],
            buckets,
            registers: [this.registry],
        });

        // HTTP Request Size
        this.httpRequestSize = new Summary({
            name: 'http_request_size_bytes',
            help: 'HTTP request size in bytes',
            labelNames: ['method', 'path', 'service'],
            percentiles: [0.5, 0.9, 0.95, 0.99],
            registers: [this.registry],
        });

        // HTTP Response Size
        this.httpResponseSize = new Summary({
            name: 'http_response_size_bytes',
            help: 'HTTP response size in bytes',
            labelNames: ['method', 'path', 'status', 'service'],
            percentiles: [0.5, 0.9, 0.95, 0.99],
            registers: [this.registry],
        });

        // Active HTTP Requests
        this.httpActiveRequests = new Gauge({
            name: 'http_active_requests',
            help: 'Number of active HTTP requests',
            labelNames: ['method', 'path', 'service'],
            registers: [this.registry],
        });

        // Application Info
        this.appInfo = new Gauge({
            name: 'app_info',
            help: 'Application information',
            labelNames: ['version', 'environment', 'service'],
            registers: [this.registry],
        });

        // Application Uptime
        this.appUptime = new Gauge({
            name: 'app_uptime_seconds',
            help: 'Application uptime in seconds',
            labelNames: ['service'],
            registers: [this.registry],
        });

        // Database Query Duration
        this.dbQueryDuration = new Histogram({
            name: 'db_query_duration_seconds',
            help: 'Database query duration in seconds',
            labelNames: ['operation', 'table', 'service'],
            buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1, 5],
            registers: [this.registry],
        });

        // Database Active Connections
        this.dbConnectionsActive = new Gauge({
            name: 'db_connections_active',
            help: 'Number of active database connections',
            labelNames: ['database', 'service'],
            registers: [this.registry],
        });

        // Database Idle Connections
        this.dbConnectionsIdle = new Gauge({
            name: 'db_connections_idle',
            help: 'Number of idle database connections',
            labelNames: ['database', 'service'],
            registers: [this.registry],
        });

        // Database Query Total
        this.dbQueryTotal = new Counter({
            name: 'db_queries_total',
            help: 'Total number of database queries',
            labelNames: ['operation', 'table', 'service'],
            registers: [this.registry],
        });

        // Database Query Errors
        this.dbQueryErrors = new Counter({
            name: 'db_query_errors_total',
            help: 'Total number of database query errors',
            labelNames: ['operation', 'table', 'error_type', 'service'],
            registers: [this.registry],
        });

        // Cache Hits
        this.cacheHits = new Counter({
            name: 'cache_hits_total',
            help: 'Total number of cache hits',
            labelNames: ['cache_name', 'service'],
            registers: [this.registry],
        });

        // Cache Misses
        this.cacheMisses = new Counter({
            name: 'cache_misses_total',
            help: 'Total number of cache misses',
            labelNames: ['cache_name', 'service'],
            registers: [this.registry],
        });

        // Cache Operation Duration
        this.cacheOperationDuration = new Histogram({
            name: 'cache_operation_duration_seconds',
            help: 'Cache operation duration in seconds',
            labelNames: ['operation', 'cache_name', 'service'],
            buckets: [0.0001, 0.0005, 0.001, 0.005, 0.01, 0.05, 0.1],
            registers: [this.registry],
        });

        // Kafka Messages Produced
        this.kafkaMessagesProduced = new Counter({
            name: 'kafka_messages_produced_total',
            help: 'Total number of Kafka messages produced',
            labelNames: ['topic', 'service'],
            registers: [this.registry],
        });

        // Kafka Messages Consumed
        this.kafkaMessagesConsumed = new Counter({
            name: 'kafka_messages_consumed_total',
            help: 'Total number of Kafka messages consumed',
            labelNames: ['topic', 'consumer_group', 'service'],
            registers: [this.registry],
        });

        // Kafka Consumer Lag
        this.kafkaConsumerLag = new Gauge({
            name: 'kafka_consumer_lag',
            help: 'Kafka consumer lag',
            labelNames: ['topic', 'partition', 'consumer_group', 'service'],
            registers: [this.registry],
        });

        // Kafka Message Processing Duration
        this.kafkaMessageProcessingDuration = new Histogram({
            name: 'kafka_message_processing_duration_seconds',
            help: 'Kafka message processing duration in seconds',
            labelNames: ['topic', 'consumer_group', 'service'],
            buckets: [0.01, 0.05, 0.1, 0.5, 1, 5, 10, 30],
            registers: [this.registry],
        });

        // Business Operations Counter
        this.businessOperations = new Counter({
            name: 'business_operations_total',
            help: 'Total number of business operations',
            labelNames: ['operation', 'status', 'service'],
            registers: [this.registry],
        });

        // Business Operation Duration
        this.businessOperationDuration = new Histogram({
            name: 'business_operation_duration_seconds',
            help: 'Business operation duration in seconds',
            labelNames: ['operation', 'service'],
            buckets: [0.1, 0.5, 1, 2, 5, 10, 30, 60],
            registers: [this.registry],
        });

        // Active Users
        this.activeUsers = new Gauge({
            name: 'active_users',
            help: 'Number of active users',
            labelNames: ['role', 'service'],
            registers: [this.registry],
        });

        // Errors Total
        this.errorsTotal = new Counter({
            name: 'errors_total',
            help: 'Total number of errors',
            labelNames: ['type', 'code', 'service'],
            registers: [this.registry],
        });

        // Unhandled Exceptions
        this.unhandledExceptions = new Counter({
            name: 'unhandled_exceptions_total',
            help: 'Total number of unhandled exceptions',
            labelNames: ['exception_type', 'service'],
            registers: [this.registry],
        });
    }

    async onModuleInit() {
        // Collect default Node.js metrics
        if (this.options.enableDefaultMetrics !== false) {
            collectDefaultMetrics({
                register: this.registry,
                prefix: 'nodejs_',
                labels: { service: this.serviceName },
            });
        }

        // Set app info
        this.appInfo.set(
            {
                version: process.env.npm_package_version || '1.0.0',
                environment: process.env.NODE_ENV || 'development',
                service: this.serviceName,
            },
            1,
        );

        // Update uptime every 5 seconds
        this.updateUptime();
        setInterval(() => this.updateUptime(), 5000);
    }

    async onModuleDestroy() {
        this.registry.clear();
    }

    private updateUptime() {
        this.appUptime.set({ service: this.serviceName }, process.uptime());
    }

    // ==================== HTTP Metrics ====================

    incrementHttpRequests(method: string, path: string, status: number) {
        this.httpRequestsTotal.inc({
            method,
            path: this.normalizePath(path),
            status: status.toString(),
            service: this.serviceName,
        });
    }

    observeHttpDuration(
        method: string,
        path: string,
        status: number,
        durationMs: number,
    ) {
        this.httpRequestDuration.observe(
            {
                method,
                path: this.normalizePath(path),
                status: status.toString(),
                service: this.serviceName,
            },
            durationMs / 1000,
        );
    }

    observeHttpRequestSize(method: string, path: string, bytes: number) {
        this.httpRequestSize.observe(
            { method, path: this.normalizePath(path), service: this.serviceName },
            bytes,
        );
    }

    observeHttpResponseSize(
        method: string,
        path: string,
        status: number,
        bytes: number,
    ) {
        this.httpResponseSize.observe(
            {
                method,
                path: this.normalizePath(path),
                status: status.toString(),
                service: this.serviceName,
            },
            bytes,
        );
    }

    incrementActiveRequests(method: string, path: string) {
        this.httpActiveRequests.inc({
            method,
            path: this.normalizePath(path),
            service: this.serviceName,
        });
    }

    decrementActiveRequests(method: string, path: string) {
        this.httpActiveRequests.dec({
            method,
            path: this.normalizePath(path),
            service: this.serviceName,
        });
    }

    // ==================== Database Metrics ====================

    observeDbQueryDuration(operation: string, table: string, durationMs: number) {
        this.dbQueryDuration.observe(
            { operation, table, service: this.serviceName },
            durationMs / 1000,
        );
        this.dbQueryTotal.inc({ operation, table, service: this.serviceName });
    }

    incrementDbQueryError(operation: string, table: string, errorType: string) {
        this.dbQueryErrors.inc({
            operation,
            table,
            error_type: errorType,
            service: this.serviceName,
        });
    }

    setDbConnections(database: string, active: number, idle: number) {
        this.dbConnectionsActive.set(
            { database, service: this.serviceName },
            active,
        );
        this.dbConnectionsIdle.set({ database, service: this.serviceName }, idle);
    }

    // ==================== Cache Metrics ====================

    incrementCacheHit(cacheName: string) {
        this.cacheHits.inc({ cache_name: cacheName, service: this.serviceName });
    }

    incrementCacheMiss(cacheName: string) {
        this.cacheMisses.inc({ cache_name: cacheName, service: this.serviceName });
    }

    observeCacheOperationDuration(
        operation: string,
        cacheName: string,
        durationMs: number,
    ) {
        this.cacheOperationDuration.observe(
            { operation, cache_name: cacheName, service: this.serviceName },
            durationMs / 1000,
        );
    }

    // ==================== Kafka Metrics ====================

    incrementKafkaProduced(topic: string) {
        this.kafkaMessagesProduced.inc({ topic, service: this.serviceName });
    }

    incrementKafkaConsumed(topic: string, consumerGroup: string) {
        this.kafkaMessagesConsumed.inc({
            topic,
            consumer_group: consumerGroup,
            service: this.serviceName,
        });
    }

    setKafkaConsumerLag(
        topic: string,
        partition: number,
        consumerGroup: string,
        lag: number,
    ) {
        this.kafkaConsumerLag.set(
            {
                topic,
                partition: partition.toString(),
                consumer_group: consumerGroup,
                service: this.serviceName,
            },
            lag,
        );
    }

    observeKafkaProcessingDuration(
        topic: string,
        consumerGroup: string,
        durationMs: number,
    ) {
        this.kafkaMessageProcessingDuration.observe(
            { topic, consumer_group: consumerGroup, service: this.serviceName },
            durationMs / 1000,
        );
    }

    // ==================== Business Metrics ====================

    incrementBusinessOperation(operation: string, status: 'success' | 'failure') {
        this.businessOperations.inc({
            operation,
            status,
            service: this.serviceName,
        });
    }

    observeBusinessOperationDuration(operation: string, durationMs: number) {
        this.businessOperationDuration.observe(
            { operation, service: this.serviceName },
            durationMs / 1000,
        );
    }

    setActiveUsers(role: string, count: number) {
        this.activeUsers.set({ role, service: this.serviceName }, count);
    }

    // ==================== Error Metrics ====================

    incrementError(type: string, code: string) {
        this.errorsTotal.inc({ type, code, service: this.serviceName });
    }

    incrementUnhandledException(exceptionType: string) {
        this.unhandledExceptions.inc({
            exception_type: exceptionType,
            service: this.serviceName,
        });
    }

    // ==================== Utility Methods ====================

    private normalizePath(path: string): string {
        // Replace UUIDs with placeholder
        let normalized = path.replace(
            /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/gi,
            ':id',
        );
        // Replace numeric IDs with placeholder
        normalized = normalized.replace(/\/\d+/g, '/:id');
        return normalized;
    }

    async getMetrics(): Promise<string> {
        return this.registry.metrics();
    }

    getContentType(): string {
        return this.registry.contentType;
    }

    // Create custom counter
    createCounter(name: string, help: string, labelNames: string[]): Counter {
        return new Counter({
            name,
            help,
            labelNames: [...labelNames, 'service'],
            registers: [this.registry],
        });
    }

    // Create custom histogram
    createHistogram(
        name: string,
        help: string,
        labelNames: string[],
        buckets?: number[],
    ): Histogram {
        return new Histogram({
            name,
            help,
            labelNames: [...labelNames, 'service'],
            buckets: buckets || [0.1, 0.5, 1, 2.5, 5, 10],
            registers: [this.registry],
        });
    }

    // Create custom gauge
    createGauge(name: string, help: string, labelNames: string[]): Gauge {
        return new Gauge({
            name,
            help,
            labelNames: [...labelNames, 'service'],
            registers: [this.registry],
        });
    }
}
