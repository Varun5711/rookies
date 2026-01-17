import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { DatabaseModule } from '@dpi/database';
import { RedisModule } from '@dpi/redis';
import { KafkaModule } from '@dpi/kafka';
import { JwtAuthGuard, RolesGuard } from '@dpi/common';
import { JwtModule } from '@nestjs/jwt';
import { CategoriesModule } from '../modules/categories/categories.module';
import { GrievancesModule } from '../modules/grievances/grievances.module';
import { HealthModule } from '../modules/health/health.module';
import { AuthModule } from '../modules/auth/auth.module';

/**
 * Urban Service Module
 * Domain service for urban governance operations
 *
 * Features:
 * - Grievance management
 * - Category management
 * - Status tracking
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.forRoot({ serviceName: 'URBAN' }),
    RedisModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        host: configService.get('REDIS_HOST', 'localhost'),
        port: configService.get('REDIS_PORT', 6379),
      }),
      inject: [ConfigService],
    }),
    KafkaModule.register({
      name: 'KAFKA_SERVICE',
      clientId: 'urban-svc',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET', 'super-secret-key'),
        signOptions: {
          expiresIn: configService.get('JWT_EXPIRES_IN', '15m'),
        },
      }),
      inject: [ConfigService],
    }),
    AuthModule,
    CategoriesModule,
    GrievancesModule,
    HealthModule,
  ],
  providers: [
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
