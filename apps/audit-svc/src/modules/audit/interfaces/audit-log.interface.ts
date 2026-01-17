export interface AuditLog {
  id: string;
  event_type: string;
  service_name: string;
  user_id?: string;
  correlation_id?: string;
  event_data: string;
  timestamp: Date;
  date: Date;
}

export interface CreateAuditLogDto {
  event_type: string;
  service_name: string;
  user_id?: string;
  correlation_id?: string;
  event_data: Record<string, any>;
}
