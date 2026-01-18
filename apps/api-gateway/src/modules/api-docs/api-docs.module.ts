import { Module } from '@nestjs/common';
import { AuthGatewayController } from '../../controllers/auth-gateway.controller';
import { HealthcareGatewayController } from '../../controllers/healthcare-gateway.controller';
import { AgricultureGatewayController } from '../../controllers/agriculture-gateway.controller';
import { UrbanGatewayController } from '../../controllers/urban-gateway.controller';
import { AuditGatewayController } from '../../controllers/audit-gateway.controller';
import { AnalyticsGatewayController } from '../../controllers/analytics-gateway.controller';
import { RegistryGatewayController } from '../../controllers/registry-gateway.controller';

/**
 * API Documentation Module
 * 
 * This module contains all gateway controllers used for Swagger documentation.
 * These controllers do NOT have implementations - they're purely for documenting
 * the API endpoints that are proxied to backend services.
 * 
 * The actual request handling is done by:
 * - AuthProxyModule - /api/auth/*
 * - RegistryProxyModule - /api/registry/*
 * - ProxyModule - /api/services/*
 * 
 * This module provides Swagger UI documentation for all these endpoints.
 */
@Module({
    controllers: [
        AuthGatewayController,
        HealthcareGatewayController,
        AgricultureGatewayController,
        UrbanGatewayController,
        AuditGatewayController,
        AnalyticsGatewayController,
        RegistryGatewayController,
    ],
})
export class ApiDocsModule { }
