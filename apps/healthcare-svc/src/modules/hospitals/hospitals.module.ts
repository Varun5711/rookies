import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Hospital } from './entities/hospital.entity';
import { HospitalsService } from './hospitals.service';
import { HospitalsController } from './hospitals.controller';

/**
 * Hospitals Module
 * Provides hospital management functionality
 *
 * Features:
 * - List hospitals with pagination
 * - Get hospital details
 */
@Module({
  imports: [TypeOrmModule.forFeature([Hospital])],
  controllers: [HospitalsController],
  providers: [HospitalsService],
  exports: [HospitalsService],
})
export class HospitalsModule {}
