import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { Hospital } from '../../hospitals/entities/hospital.entity';

/**
 * Doctor Entity
 * Represents a medical professional in the system
 */
@Entity('doctors')
export class Doctor extends BaseEntity {
  @Column()
  name: string;

  @Column()
  specialization: string;

  @ManyToOne(() => Hospital)
  @JoinColumn({ name: 'hospital_id' })
  hospital: Hospital;

  @Column({ name: 'hospital_id' })
  hospitalId: string;

  @Column({ nullable: true })
  qualification: string;

  @Column({ nullable: true })
  experience: number;

  @Column({ name: 'is_available', default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  consultationFee: number;
}
