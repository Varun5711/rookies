import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HttpModule } from '@nestjs/axios';
import { ScheduleModule } from '@nestjs/schedule';
import { RegistryController } from './registry.controller';
import { RegistryService } from './registry.service';
import { HealthCheckerService } from './health-checker.service';
import { RegisteredService } from './entities/registered-service.entity';

/**
 * Registry Module
 * Provides service registration, discovery, and health monitoring
 */
@Module({
  imports: [
    TypeOrmModule.forFeature([RegisteredService]),
    HttpModule, // For making HTTP requests to service health endpoints
    ScheduleModule.forRoot(), // Enable cron jobs for health checks
  ],
  controllers: [RegistryController],
  providers: [RegistryService, HealthCheckerService],
  exports: [RegistryService],
})
export class RegistryModule {}
