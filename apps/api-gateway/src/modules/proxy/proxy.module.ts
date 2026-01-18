import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ProxyController } from './proxy.controller';
import { ProxyService } from './proxy.service';
import { ServiceRegistryClient } from './service-registry.client';

/**
 * Proxy Module
 * Provides dynamic routing capabilities for the API Gateway.
 *
 * Features:
 * - Dynamic service discovery from Service Registry
 * - Redis caching for service info
 * - HTTP request forwarding with axios
 * - Authentication and authorization checks
 */
@Module({
  imports: [
    HttpModule.register({
      timeout: 30000,
      maxRedirects: 5,
    }),
  ],
  controllers: [ProxyController],
  providers: [ProxyService, ServiceRegistryClient],
  exports: [ProxyService, ServiceRegistryClient],
})
export class ProxyModule {}
