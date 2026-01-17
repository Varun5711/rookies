import { Injectable, Logger } from '@nestjs/common';
import { AuditRepository } from './audit.repository';
import { AuditLog } from './interfaces/audit-log.interface';

export interface CreateAuditLogDto {
  event_type: string;
  userId?: string;
  serviceName: string;
  eventSource?: string;
  eventData: Record<string, any>;
  correlationId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface QueryAuditLogDto {
  event_type?: string;
  userId?: string;
  serviceName?: string;
  eventSource?: string;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(private readonly auditRepository: AuditRepository) {}

  async create(dto: CreateAuditLogDto): Promise<void> {
    return this.auditRepository.create({
      event_type: dto.event_type,
      service_name: dto.serviceName,
      user_id: dto.userId,
      correlation_id: dto.correlationId,
      event_data: dto.eventData,
    });
  }

  async findAll(query: QueryAuditLogDto) {
    const {
      event_type,
      userId,
      serviceName,
      eventSource,
      fromDate,
      toDate,
      page = 1,
      limit = 50,
    } = query;

    const offset = (page - 1) * limit;
    const logs = await this.auditRepository.findAll({
      event_type,
      user_id: userId,
      service_name: serviceName,
      from_date: fromDate,
      to_date: toDate,
      limit,
      offset,
    });

    return {
      data: logs,
      meta: {
        page,
        limit,
        total: logs.length,
        totalPages: Math.ceil(logs.length / limit),
      },
    };
  }

  async findByUserId(userId: string, limit = 100): Promise<AuditLog[]> {
    return this.auditRepository.getUserActivity(userId, { limit });
  }

  async findByEventType(eventType: string, limit = 100): Promise<AuditLog[]> {
    return this.auditRepository.findAll({ event_type: eventType, limit });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayStr = today.toISOString().split('T')[0];

    const [totalLogs, todayLogs, eventCounts] = await Promise.all([
      this.auditRepository.findAll({ limit: 1 }),
      this.auditRepository.findAll({ from_date: todayStr, limit: 1 }),
      this.auditRepository.getEventCounts({}),
    ]);

    return {
      totalLogs: totalLogs.length,
      todayLogs: todayLogs.length,
      eventTypeStats: eventCounts,
      sourceStats: [],
    };
  }
}
