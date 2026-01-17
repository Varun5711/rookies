import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@dpi/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (connects to ingenium_audit)
    DatabaseModule.forRoot({ serviceName: 'AUDIT' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
