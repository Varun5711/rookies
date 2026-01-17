import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@dpi/database';

/**
 * Hospital Entity
 * Represents a healthcare facility in the system
 */
@Entity('hospitals')
export class Hospital extends BaseEntity {
  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  pincode: string;

  @Column('simple-array')
  facilities: string[];

  @Column({ name: 'is_active', default: true })
  isActive: boolean;

  @Column({ nullable: true })
  address: string;

  @Column({ nullable: true })
  phone: string;

  @Column({ nullable: true })
  email: string;
}
