import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctor } from './entities/doctor.entity';
import { TimeSlot } from './entities/time-slot.entity';
import { DoctorsService } from './doctors.service';
import { DoctorsController } from './doctors.controller';

/**
 * Doctors Module
 * Provides doctor directory and time slot management functionality
 *
 * Features:
 * - List doctors with optional filtering
 * - Get doctor details
 * - Find available time slots
 */
@Module({
  imports: [TypeOrmModule.forFeature([Doctor, TimeSlot])],
  controllers: [DoctorsController],
  providers: [DoctorsService],
  exports: [DoctorsService],
})
export class DoctorsModule {}
