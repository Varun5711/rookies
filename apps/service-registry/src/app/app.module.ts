import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@dpi/database';
import { RedisModule } from '@dpi/redis';
import { KafkaModule } from '@dpi/kafka';
import { AppController } from './app.controller';
import { AppService } from './app.service';
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

    // Database
    DatabaseModule.forRoot(),

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

    // Registry module
    RegistryModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
