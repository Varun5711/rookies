import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@dpi/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

/**
 * Healthcare Service Module
 * Domain service for healthcare operations
 *
 * Features:
 * - Hospital management
 * - Doctor directory
 * - Appointment booking
 * - Time slot management
 */
@Module({
  imports: [
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (connects to ingenium_healthcare)
    DatabaseModule.forRoot({ serviceName: 'HEALTHCARE' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
