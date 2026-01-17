import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KafkaModule } from '@dpi/kafka';
import { Appointment } from './entities/appointment.entity';
import { AppointmentsService } from './appointments.service';
import { AppointmentsController } from './appointments.controller';

/**
 * Appointments Module
 * Provides appointment booking and management functionality
 *
 * Features:
 * - Book appointments
 * - View user's appointments
 * - Cancel appointments
 * - Emit Kafka events for state changes
 */
@Module({
  imports: [TypeOrmModule.forFeature([Appointment]), KafkaModule],
  controllers: [AppointmentsController],
  providers: [AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {}
