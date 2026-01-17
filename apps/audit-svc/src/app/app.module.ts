import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DatabaseModule } from '@dpi/database';
import { AuditModule } from '../modules/audit/audit.module';
import { AuditConsumer } from '../modules/consumers/audit.consumer';
import { HealthModule } from '../modules/health/health.module';

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
