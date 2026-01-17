import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@dpi/database';
import { RedisModule } from '@dpi/redis';
import { KafkaModule } from '@dpi/kafka';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '@dpi/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from '../modules/auth/auth.module';
import { RegistryModule } from '../modules/registry/registry.module';

/**
 * Service Registry Module
 * Main module for service registry application
 *
 * Features:
 * - Service registration and discovery
 * - Health monitoring (cron-based)
 * - Platform health aggregation
 * - CRUD operations for service metadata
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (connects to ingenium_registry)
    DatabaseModule.forRoot({ serviceName: 'REGISTRY' }),

    // Redis for caching service metadata
    RedisModule.register({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'dpi:registry:',
    }),

    // Kafka for event streaming (health alerts, service registration events)
    KafkaModule.register({
      clientId: 'service-registry',
      brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
    }),

    // JWT Module for token validation
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'super-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),

    // Auth & Registry modules
    AuthModule,
    RegistryModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
  ],
})
export class AppModule {}
