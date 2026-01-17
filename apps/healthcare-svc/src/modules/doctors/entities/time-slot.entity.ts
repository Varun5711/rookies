import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { Doctor } from './doctor.entity';

/**
 * TimeSlot Entity
 * Represents available time slots for doctor appointments
 */
@Entity('time_slots')
export class TimeSlot extends BaseEntity {
  @ManyToOne(() => Doctor)
  @JoinColumn({ name: 'doctor_id' })
  doctor: Doctor;

  @Column({ name: 'doctor_id' })
  doctorId: string;

  @Column({ type: 'time', name: 'start_time' })
  startTime: string;

  @Column({ type: 'time', name: 'end_time' })
  endTime: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;
}
