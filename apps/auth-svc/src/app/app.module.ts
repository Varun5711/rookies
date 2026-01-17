import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD, Reflector } from '@nestjs/core';
import { DatabaseModule } from '@dpi/database';
import { RedisModule } from '@dpi/redis';
import { KafkaModule } from '@dpi/kafka';
import { JwtAuthGuard } from '@dpi/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from '../modules/users/users.module';
import { GoogleModule } from '../modules/google/google.module';
import { OtpModule } from '../modules/otp/otp.module';
import { TokensModule } from '../modules/tokens/tokens.module';

/**
 * Auth Service Module
 * Main module for authentication service
 *
 * Features:
 * - Google OAuth 2.0 authentication
 * - Mobile OTP authentication (Twilio)
 * - JWT token generation and validation
 * - Refresh token rotation
 * - User management
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (connects to ingenium_auth)
    DatabaseModule.forRoot({ serviceName: 'AUTH' }),

    // Redis for caching and sessions
    RedisModule.register({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379', 10),
      password: process.env.REDIS_PASSWORD,
      keyPrefix: process.env.REDIS_KEY_PREFIX || 'dpi:auth:',
    }),

    // Kafka for event streaming
    KafkaModule.register({
      clientId: 'auth-svc',
      brokers: [process.env.KAFKA_BROKERS || 'localhost:9092'],
    }),

    // Auth modules
    UsersModule,
    TokensModule,
    GoogleModule,
    OtpModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    Reflector,
    // Apply JWT auth guard globally (except for @Public() routes)
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
