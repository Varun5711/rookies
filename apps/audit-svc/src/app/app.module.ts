import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ClickHouseModule } from '@dpi/clickhouse';
import { KafkaModule } from '@dpi/kafka';
import { JwtModule } from '@nestjs/jwt';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard, RolesGuard } from '@dpi/common';
import { AuthModule } from '../modules/auth/auth.module';
import { AuditModule } from '../modules/audit/audit.module';
import { AuditConsumer } from '../modules/consumers/audit.consumer';
import { HealthModule } from '../modules/health/health.module';

/**
 * Audit Service Module
 * Platform service for audit logging and compliance using ClickHouse
 *
 * Features:
 * - Event logging via Kafka consumers
 * - Audit trail storage in ClickHouse
 * - Compliance reporting and analytics
 * - 90-day TTL for audit logs
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ClickHouseModule.forRoot(),
    KafkaModule.register({
      name: 'KAFKA_SERVICE',
      clientId: 'audit-svc',
      brokers: [process.env.KAFKA_BROKER || 'localhost:9092'],
      consumer: {
        groupId: 'audit-consumer-group',
      },
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
    AuditModule,
    HealthModule,
  ],
  controllers: [AuditConsumer],
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
