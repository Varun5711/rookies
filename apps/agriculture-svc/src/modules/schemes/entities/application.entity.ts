import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { Scheme } from './scheme.entity';

export enum ApplicationStatus {
  PENDING = 'pending',
  UNDER_REVIEW = 'under_review',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  DISBURSED = 'disbursed',
}

@Entity('scheme_applications')
export class Application extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ nullable: true, name: 'applicant_name' })
  applicantName?: string;

  @Column({ nullable: true, name: 'applicant_mobile' })
  applicantMobile?: string;

  @Column({ nullable: true, name: 'applicant_aadhar' })
  applicantAadhar?: string;

  @Column({
    type: 'enum',
    enum: ApplicationStatus,
    default: ApplicationStatus.PENDING,
  })
  status: ApplicationStatus;

  @Column({ type: 'jsonb', nullable: true, name: 'form_data' })
  formData?: Record<string, any>;

  @Column({ type: 'simple-array', nullable: true, name: 'document_urls' })
  documentUrls?: string[];

  @Column({ type: 'text', nullable: true, name: 'rejection_reason' })
  rejectionReason?: string;

  @Column({ nullable: true, name: 'reviewed_by' })
  reviewedBy?: string;

  @Column({ nullable: true, name: 'reviewed_at' })
  reviewedAt?: Date;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true, name: 'disbursed_amount' })
  disbursedAmount?: number;

  @Column({ nullable: true, name: 'disbursed_at' })
  disbursedAt?: Date;

  @Column({ name: 'scheme_id' })
  schemeId: string;

  @ManyToOne(() => Scheme, (scheme) => scheme.applications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'scheme_id' })
  scheme: Scheme;
}
