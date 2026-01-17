import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, Between, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { AuditLog, EventSource } from './entities/audit-log.entity';

export interface CreateAuditLogDto {
  eventType: string;
  userId?: string;
  serviceName: string;
  eventSource: EventSource;
  eventData: Record<string, any>;
  correlationId?: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface QueryAuditLogDto {
  eventType?: string;
  userId?: string;
  serviceName?: string;
  eventSource?: EventSource;
  fromDate?: string;
  toDate?: string;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditService {
  private readonly logger = new Logger(AuditService.name);

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditLogRepository: Repository<AuditLog>,
  ) {}

  async create(dto: CreateAuditLogDto): Promise<AuditLog> {
    const auditLog = this.auditLogRepository.create({
      ...dto,
      eventTimestamp: new Date(),
    });

    return this.auditLogRepository.save(auditLog);
  }

  async findAll(query: QueryAuditLogDto) {
    const {
      eventType,
      userId,
      serviceName,
      eventSource,
      fromDate,
      toDate,
      page = 1,
      limit = 50,
    } = query;

    const where: FindOptionsWhere<AuditLog> = {};

    if (eventType) where.eventType = eventType;
    if (userId) where.userId = userId;
    if (serviceName) where.serviceName = serviceName;
    if (eventSource) where.eventSource = eventSource;

    if (fromDate && toDate) {
      where.eventTimestamp = Between(new Date(fromDate), new Date(toDate));
    } else if (fromDate) {
      where.eventTimestamp = MoreThanOrEqual(new Date(fromDate));
    } else if (toDate) {
      where.eventTimestamp = LessThanOrEqual(new Date(toDate));
    }

    const [logs, total] = await this.auditLogRepository.findAndCount({
      where,
      skip: (page - 1) * limit,
      take: limit,
      order: { eventTimestamp: 'DESC' },
    });

    return {
      data: logs,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findByUserId(userId: string, limit = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { userId },
      order: { eventTimestamp: 'DESC' },
      take: limit,
    });
  }

  async findByEventType(eventType: string, limit = 100): Promise<AuditLog[]> {
    return this.auditLogRepository.find({
      where: { eventType },
      order: { eventTimestamp: 'DESC' },
      take: limit,
    });
  }

  async getStats() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalLogs,
      todayLogs,
      eventTypeStats,
      sourceStats,
    ] = await Promise.all([
      this.auditLogRepository.count(),
      this.auditLogRepository.count({
        where: { eventTimestamp: MoreThanOrEqual(today) },
      }),
      this.auditLogRepository
        .createQueryBuilder('log')
        .select('log.event_type', 'eventType')
        .addSelect('COUNT(*)', 'count')
        .groupBy('log.event_type')
        .orderBy('count', 'DESC')
        .limit(10)
        .getRawMany(),
      this.auditLogRepository
        .createQueryBuilder('log')
        .select('log.event_source', 'eventSource')
        .addSelect('COUNT(*)', 'count')
        .groupBy('log.event_source')
        .getRawMany(),
    ]);

    return {
      totalLogs,
      todayLogs,
      eventTypeStats,
      sourceStats,
    };
  }
}
