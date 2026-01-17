import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@dpi/database';
import { AppController } from './app.controller';
import { AppService } from './app.service';

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
    // Global configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Database (connects to ingenium_urban)
    DatabaseModule.forRoot({ serviceName: 'URBAN' }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
