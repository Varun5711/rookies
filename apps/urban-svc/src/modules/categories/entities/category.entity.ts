import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { Grievance } from '../../grievances/entities/grievance.entity';

@Entity('grievance_categories')
export class Category extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  department: string;

  @Column({ nullable: true, name: 'department_email' })
  departmentEmail?: string;

  @Column({ nullable: true, name: 'department_phone' })
  departmentPhone?: string;

  @Column({ type: 'int', default: 7, name: 'sla_days' })
  slaDays: number;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ nullable: true })
  icon?: string;

  @OneToMany(() => Grievance, (grievance) => grievance.category)
  grievances: Grievance[];
}
