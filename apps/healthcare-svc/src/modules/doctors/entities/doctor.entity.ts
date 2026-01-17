import { Entity, Column, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { Hospital } from '../../hospitals/entities/hospital.entity';
import { TimeSlot } from './time-slot.entity';
import { Appointment } from '../../appointments/entities/appointment.entity';

export enum Specialization {
  GENERAL_MEDICINE = 'general_medicine',
  PEDIATRICS = 'pediatrics',
  CARDIOLOGY = 'cardiology',
  ORTHOPEDICS = 'orthopedics',
  DERMATOLOGY = 'dermatology',
  GYNECOLOGY = 'gynecology',
  NEUROLOGY = 'neurology',
  OPHTHALMOLOGY = 'ophthalmology',
  ENT = 'ent',
  PSYCHIATRY = 'psychiatry',
  DENTAL = 'dental',
  OTHER = 'other',
}

@Entity('doctors')
export class Doctor extends BaseEntity {
  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: Specialization,
    default: Specialization.GENERAL_MEDICINE,
  })
  specialization: Specialization;

  @Column({ nullable: true })
  qualification?: string;

  @Column({ type: 'int', default: 0, name: 'experience_years' })
  experienceYears: number;

  @Column({ nullable: true, name: 'registration_number' })
  registrationNumber?: string;

  @Column({ nullable: true, name: 'contact_number' })
  contactNumber?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0, name: 'consultation_fee' })
  consultationFee: number;

  @Column({ default: true, name: 'is_available' })
  isAvailable: boolean;

  @Column({ name: 'hospital_id' })
  hospitalId: string;

  @ManyToOne(() => Hospital, (hospital) => hospital.doctors, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @OneToMany(() => TimeSlot, (slot) => slot.doctor)
  timeSlots: TimeSlot[];

  @OneToMany(() => Appointment, (appointment) => appointment.doctor)
  appointments: Appointment[];
}
