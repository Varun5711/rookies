import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { Application } from './application.entity';

export enum SchemeCategory {
  SUBSIDY = 'subsidy',
  LOAN = 'loan',
  INSURANCE = 'insurance',
  TRAINING = 'training',
  EQUIPMENT = 'equipment',
  OTHER = 'other',
}

@Entity('schemes')
export class Scheme extends BaseEntity {
  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'enum',
    enum: SchemeCategory,
    default: SchemeCategory.SUBSIDY,
  })
  category: SchemeCategory;

  @Column({ type: 'decimal', precision: 12, scale: 2, default: 0, name: 'benefit_amount' })
  benefitAmount: number;

  @Column({ type: 'jsonb', nullable: true, name: 'eligibility_criteria' })
  eligibilityCriteria?: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true, name: 'required_documents' })
  requiredDocuments?: string[];

  @Column({ nullable: true, name: 'start_date' })
  startDate?: Date;

  @Column({ nullable: true, name: 'end_date' })
  endDate?: Date;

  @Column({ nullable: true, name: 'ministry_name' })
  ministryName?: string;

  @Column({ nullable: true, name: 'official_link' })
  officialLink?: string;

  @Column({ default: true, name: 'is_active' })
  isActive: boolean;

  @Column({ type: 'int', default: 0, name: 'total_budget' })
  totalBudget: number;

  @Column({ type: 'int', default: 0, name: 'utilized_budget' })
  utilizedBudget: number;

  @OneToMany(() => Application, (application) => application.scheme)
  applications: Application[];
}
