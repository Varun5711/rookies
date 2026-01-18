import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminAppointmentsController } from './admin-appointments.controller';
import { AdminAppointmentsService } from './admin-appointments.service';
import { Appointment } from '../appointments/entities/appointment.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Appointment])],
    controllers: [AdminAppointmentsController],
    providers: [AdminAppointmentsService],
})
export class AdminAppointmentsModule { }
