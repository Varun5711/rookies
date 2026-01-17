import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@dpi/database';
import { AuditModule } from '../modules/audit/audit.module';
import { AuditConsumer } from '../modules/consumers/audit.consumer';
import { HealthModule } from '../modules/health/health.module';

/**
 * Audit Service Module
 * Platform service for audit logging and compliance
 *
 * Features:
 * - Event logging
 * - Audit trail
 * - Compliance reporting
 */
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    DatabaseModule.forRoot(),
    AuditModule,
    HealthModule,
  ],
  controllers: [AuditConsumer],
})
export class AppModule {}
