import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClickHouseModule } from '@dpi/clickhouse';
import { KafkaModule } from '@dpi/kafka';
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
    AuditModule,
    HealthModule,
  ],
  controllers: [AuditConsumer],
})
export class AppModule {}
