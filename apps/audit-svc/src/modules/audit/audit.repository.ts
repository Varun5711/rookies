import { Injectable, Inject, Logger } from '@nestjs/common';
import { ClickHouseClient } from '@clickhouse/client';
import { CLICKHOUSE_CLIENT } from '@dpi/clickhouse';
import { AuditLog, CreateAuditLogDto } from './interfaces/audit-log.interface';

@Injectable()
export class AuditRepository {
  private readonly logger = new Logger(AuditRepository.name);

  constructor(
    @Inject(CLICKHOUSE_CLIENT)
    private readonly clickhouse: ClickHouseClient,
  ) { }

  async create(dto: CreateAuditLogDto): Promise<void> {
    try {
      await this.clickhouse.insert({
        table: 'audit_logs',
        values: [{
          event_type: dto.event_type,
          service_name: dto.service_name,
          user_id: dto.user_id || null,
          correlation_id: dto.correlation_id || null,
          event_data: JSON.stringify(dto.event_data),
        }],
        format: 'JSONEachRow',
      });

      this.logger.debug(`Audit log created: ${dto.event_type} from ${dto.service_name}`);
    } catch (error) {
      this.logger.error(`Failed to create audit log: ${error.message}`, error.stack);
      throw error;
    }
  }

  async count(params: {
    service_name?: string;
    user_id?: string;
    event_type?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<number> {
    const { service_name, user_id, event_type, from_date, to_date } = params;
    const queryParams: Record<string, string | number> = {};
    const conditions: string[] = ['1=1'];

    if (service_name) {
      conditions.push('service_name = {serviceName:String}');
      queryParams.serviceName = service_name;
    }
    if (user_id) {
      conditions.push('user_id = {userId:String}');
      queryParams.userId = user_id;
    }
    if (event_type) {
      conditions.push('event_type = {eventType:String}');
      queryParams.eventType = event_type;
    }
    if (from_date) {
      conditions.push('date >= {fromDate:String}');
      queryParams.fromDate = from_date;
    }
    if (to_date) {
      conditions.push('date <= {toDate:String}');
      queryParams.toDate = to_date;
    }

    const whereClause = conditions.join(' AND ');
    const query = `SELECT count() as count FROM audit_logs WHERE ${whereClause}`;

    try {
      const resultSet = await this.clickhouse.query({
        query,
        query_params: queryParams,
        format: 'JSONEachRow',
      });
      const data = await resultSet.json<{ count: string }>();
      return parseInt(data[0].count, 10);
    } catch (error) {
      this.logger.error(`Failed to count audit logs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(params: {
    service_name?: string;
    user_id?: string;
    event_type?: string;
    from_date?: string;
    to_date?: string;
    limit?: number;
    offset?: number;
  }): Promise<AuditLog[]> {
    const { service_name, user_id, event_type, from_date, to_date, limit = 100, offset = 0 } = params;
    const queryParams: Record<string, string | number> = {
      limit,
      offset
    };
    const conditions: string[] = ['1=1'];

    if (service_name) {
      conditions.push('service_name = {serviceName:String}');
      queryParams.serviceName = service_name;
    }
    if (user_id) {
      conditions.push('user_id = {userId:String}');
      queryParams.userId = user_id;
    }
    if (event_type) {
      conditions.push('event_type = {eventType:String}');
      queryParams.eventType = event_type;
    }
    if (from_date) {
      conditions.push('date >= {fromDate:String}');
      queryParams.fromDate = from_date;
    }
    if (to_date) {
      conditions.push('date <= {toDate:String}');
      queryParams.toDate = to_date;
    }

    const whereClause = conditions.join(' AND ');

    const query = `
      SELECT
        id,
        event_type,
        service_name,
        user_id,
        correlation_id,
        event_data,
        timestamp,
        date
      FROM audit_logs
      WHERE ${whereClause}
      ORDER BY timestamp DESC
      LIMIT {limit:Int32}
      OFFSET {offset:Int32}
    `;

    try {
      const resultSet = await this.clickhouse.query({
        query,
        query_params: queryParams,
        format: 'JSONEachRow',
      });

      const data = await resultSet.json<AuditLog>();
      return data;
    } catch (error) {
      this.logger.error(`Failed to query audit logs: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getEventCounts(params: {
    service_name?: string;
    from_date?: string;
    to_date?: string;
  }): Promise<any[]> {
    const { service_name, from_date, to_date } = params;
    const queryParams: Record<string, string> = {};
    const conditions: string[] = ['1=1'];

    if (service_name) {
      conditions.push('service_name = {serviceName:String}');
      queryParams.serviceName = service_name;
    }
    if (from_date) {
      conditions.push('date >= {fromDate:String}');
      queryParams.fromDate = from_date;
    }
    if (to_date) {
      conditions.push('date <= {toDate:String}');
      queryParams.toDate = to_date;
    }

    const whereClause = conditions.join(' AND ');

    const query = `
      SELECT
        service_name,
        event_type,
        count() as count
      FROM audit_logs
      WHERE ${whereClause}
      GROUP BY service_name, event_type
      ORDER BY count DESC
    `;

    try {
      const resultSet = await this.clickhouse.query({
        query,
        query_params: queryParams,
        format: 'JSONEachRow',
      });

      return await resultSet.json();
    } catch (error) {
      this.logger.error(`Failed to get event counts: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getUserActivity(userId: string, params: {
    from_date?: string;
    to_date?: string;
    limit?: number;
  }): Promise<AuditLog[]> {
    const { from_date, to_date, limit = 100 } = params;
    const queryParams: Record<string, string | number> = {
      userId,
      limit
    };
    const conditions: string[] = ['user_id = {userId:String}'];

    if (from_date) {
      conditions.push('date >= {fromDate:String}');
      queryParams.fromDate = from_date;
    }
    if (to_date) {
      conditions.push('date <= {toDate:String}');
      queryParams.toDate = to_date;
    }

    const whereClause = conditions.join(' AND ');

    const query = `
      SELECT
        id,
        event_type,
        service_name,
        user_id,
        correlation_id,
        event_data,
        timestamp,
        date
      FROM audit_logs
      WHERE ${whereClause}
      ORDER BY timestamp DESC
      LIMIT {limit:Int32}
    `;

    try {
      const resultSet = await this.clickhouse.query({
        query,
        query_params: queryParams,
        format: 'JSONEachRow',
      });

      return await resultSet.json<AuditLog>();
    } catch (error) {
      this.logger.error(`Failed to get user activity: ${error.message}`, error.stack);
      throw error;
    }
  }
}
