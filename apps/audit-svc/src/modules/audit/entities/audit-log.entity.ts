import { Entity, Column, Index } from 'typeorm';
import { BaseEntity } from '@dpi/database';

export enum EventSource {
  HEALTHCARE = 'healthcare',
  AGRICULTURE = 'agriculture',
  URBAN = 'urban',
  AUTH = 'auth',
  GATEWAY = 'gateway',
  REGISTRY = 'registry',
  SYSTEM = 'system',
}

@Entity('audit_logs')
@Index(['eventType'])
@Index(['userId'])
@Index(['serviceName'])
@Index(['createdAt'])
export class AuditLog extends BaseEntity {
  @Column({ name: 'event_type' })
  eventType: string;

  @Column({ nullable: true, name: 'user_id' })
  userId?: string;

  @Column({ name: 'service_name' })
  serviceName: string;

  @Column({
    type: 'enum',
    enum: EventSource,
    default: EventSource.SYSTEM,
    name: 'event_source',
  })
  eventSource: EventSource;

  @Column({ type: 'jsonb', name: 'event_data' })
  eventData: Record<string, any>;

  @Column({ nullable: true, name: 'correlation_id' })
  correlationId?: string;

  @Column({ nullable: true, name: 'ip_address' })
  ipAddress?: string;

  @Column({ nullable: true, name: 'user_agent' })
  userAgent?: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', name: 'event_timestamp' })
  eventTimestamp: Date;
}
