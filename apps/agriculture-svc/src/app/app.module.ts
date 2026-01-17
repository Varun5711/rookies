import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@dpi/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Agriculture Service Module
 * Domain service for agriculture operations
 *
 * Features:
 * - Crop advisories
 * - Scheme management and applications
 * - Market price tracking
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (connects to ingenium_agriculture)
    DatabaseModule.forRoot({ serviceName: 'AGRICULTURE' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
