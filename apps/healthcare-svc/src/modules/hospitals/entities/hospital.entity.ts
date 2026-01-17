import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { Doctor } from '../../doctors/entities/doctor.entity';

export enum HospitalType {
  GOVERNMENT = 'government',
  PRIVATE = 'private',
  TRUST = 'trust',
}

@Entity('hospitals')
export class Hospital extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ type: 'simple-array', default: '' })
  facilities: string[];

  @Column({
    type: 'enum',
    enum: HospitalType,
    default: HospitalType.GOVERNMENT,
  })
  type: HospitalType;

  @Column({ nullable: true, name: 'contact_number' })
  contactNumber?: string;

  @Column({ nullable: true })
  email?: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'int', default: 0, name: 'total_beds' })
  totalBeds: number;

  @Column({ type: 'int', default: 0, name: 'available_beds' })
  availableBeds: number;

  @OneToMany(() => Doctor, (doctor) => doctor.hospital)
  doctors: Doctor[];
}
