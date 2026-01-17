export const AuditEventTopics = {
  EVENT: 'dpi.audit.event',
} as const;

export type AuditEventTopic = typeof AuditEventTopics[keyof typeof AuditEventTopics];

export interface AuditEvent {
  auditId: string;
  userId?: string;
  service: string;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  success: boolean;
  errorMessage?: string;
  metadata?: Record<string, any>;
  timestamp: string;
}