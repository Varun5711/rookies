import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { Category } from '../../categories/entities/category.entity';

export enum GrievanceStatus {
  SUBMITTED = 'submitted',
  ACKNOWLEDGED = 'acknowledged',
  IN_PROGRESS = 'in_progress',
  PENDING_INFO = 'pending_info',
  ESCALATED = 'escalated',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
  REJECTED = 'rejected',
}

export enum GrievancePriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('grievances')
export class Grievance extends BaseEntity {
  @Column({ name: 'user_id' })
  userId: string;

  @Column({ nullable: true, name: 'complainant_name' })
  complainantName?: string;

  @Column({ nullable: true, name: 'complainant_mobile' })
  complainantMobile?: string;

  @Column({ nullable: true, name: 'complainant_email' })
  complainantEmail?: string;

  @Column()
  title: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ nullable: true })
  location?: string;

  @Column({ nullable: true })
  address?: string;

  @Column({ nullable: true })
  ward?: string;

  @Column({ nullable: true })
  pincode?: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  latitude?: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  longitude?: number;

  @Column({ type: 'simple-array', nullable: true })
  attachments?: string[];

  @Column({
    type: 'enum',
    enum: GrievanceStatus,
    default: GrievanceStatus.SUBMITTED,
  })
  status: GrievanceStatus;

  @Column({
    type: 'enum',
    enum: GrievancePriority,
    default: GrievancePriority.MEDIUM,
  })
  priority: GrievancePriority;

  @Column({ nullable: true, name: 'assigned_to' })
  assignedTo?: string;

  @Column({ nullable: true, name: 'assigned_department' })
  assignedDepartment?: string;

  @Column({ type: 'text', nullable: true })
  resolution?: string;

  @Column({ nullable: true, name: 'resolved_at' })
  resolvedAt?: Date;

  @Column({ nullable: true, name: 'resolved_by' })
  resolvedBy?: string;

  @Column({ type: 'text', nullable: true, name: 'escalation_reason' })
  escalationReason?: string;

  @Column({ nullable: true, name: 'escalated_at' })
  escalatedAt?: Date;

  @Column({ nullable: true, name: 'due_date' })
  dueDate?: Date;

  @Column({ type: 'int', nullable: true, name: 'satisfaction_rating' })
  satisfactionRating?: number;

  @Column({ type: 'text', nullable: true })
  feedback?: string;

  @Column({ name: 'category_id' })
  categoryId: string;

  @ManyToOne(() => Category, (category) => category.grievances, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'category_id' })
  category: Category;
}
