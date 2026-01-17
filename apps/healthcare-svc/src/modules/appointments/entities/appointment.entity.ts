import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { Doctor } from '../../doctors/entities/doctor.entity';
import { Hospital } from '../../hospitals/entities/hospital.entity';

export enum AppointmentStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

/**
 * Appointment Entity
 * Represents a patient appointment with a doctor
 */
@Entity('appointments')
export class Appointment extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @ManyToOne(() => Hospital)
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @Column({ name: 'hospital_id' })
  hospitalId: string;

  @Column({ type: 'timestamp', name: 'appointment_date' })
  appointmentDate: Date;

  @Column({
    type: 'enum',
    enum: AppointmentStatus,
    default: AppointmentStatus.PENDING,
  })
  status: AppointmentStatus;

  @Column({ type: 'text', nullable: true })
  symptoms: string;

  @Column({ name: 'patient_name' })
  patientName: string;

  @Column({ name: 'patient_age', nullable: true })
  patientAge: number;

  @Column({ name: 'patient_mobile' })
  patientMobile: string;
}
