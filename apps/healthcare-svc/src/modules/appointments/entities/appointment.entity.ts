import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { Hospital } from '../../hospitals/entities/hospital.entity';
import { Doctor } from '../../doctors/entities/doctor.entity';

export enum AppointmentStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  IN_PROGRESS = 'in_progress',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  NO_SHOW = 'no_show',
}

@Entity('appointments')
export class Appointment extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ nullable: true, name: 'patient_name' })
  patientName?: string;

  @Column({ nullable: true, name: 'patient_mobile' })
  patientMobile?: string;

  @Column({ type: 'date', name: 'appointment_date' })
  appointmentDate: Date;

  @Column({ type: 'time', name: 'appointment_time' })
  appointmentTime: string;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  symptoms?: string;

  @Column({ type: 'text', nullable: true })
  notes?: string;

  @Column({ type: 'text', nullable: true, name: 'cancellation_reason' })
  cancellationReason?: string;

  @Column({ nullable: true, name: 'cancelled_at' })
  cancelledAt?: Date;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @ManyToOne(() => Doctor, (doctor) => doctor.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ name: 'hospital_id' })
  hospitalId: string;

  @ManyToOne(() => Hospital, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;
}
