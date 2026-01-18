import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { RedisModule } from '@dpi/redis';
import { JwtAuthGuard } from '@dpi/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProxyModule } from '../modules/proxy/proxy.module';
import { AuthProxyModule } from '../modules/auth-proxy/auth-proxy.module';
import { RegistryProxyModule } from '../modules/registry-proxy/registry-proxy.module';
import { CorrelationIdMiddleware } from '../middleware/correlation-id.middleware';
import { RateLimitMiddleware } from '../middleware/rate-limit.middleware';
import { JwtStrategy } from '../strategies/jwt.strategy';

/**
 * API Gateway Module
 * Central entry point for all API requests.
 *
 * Features:
 * - Dynamic service discovery and routing
 * - Authentication proxy (/api/auth/*)
 * - Service proxy (/api/services/:serviceName/*)
 * - Correlation ID tracking
 * - Rate limiting (100 req/min per user)
 * - JWT authentication for protected services
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Redis for caching service info and rate limiting
    RedisModule.register({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'dpi:gateway:',
    }),

    // Passport for JWT authentication
    PassportModule.register({ defaultStrategy: 'jwt' }),

    // Auth proxy module - forwards /api/auth/* to auth-svc
    AuthProxyModule,

    // Registry proxy module - forwards /api/registry/* to service-registry
    RegistryProxyModule,

    // Dynamic proxy module - forwards /api/services/* to registered services
    ProxyModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Reflector,
    // JWT strategy for token validation
    JwtStrategy,
    // Apply JWT auth guard globally
    // Note: The guard checks @Public() decorator and service.isPublic
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule implements NestModule {
  /**
   * Configure middleware for all routes
   */
  configure(consumer: MiddlewareConsumer) {
    consumer
      // Apply correlation ID middleware first (generates/extracts correlation ID)
      .apply(CorrelationIdMiddleware)
      .forRoutes('*')
      // Apply rate limiting middleware
      .apply(RateLimitMiddleware)
      .forRoutes('*');
  }
}
