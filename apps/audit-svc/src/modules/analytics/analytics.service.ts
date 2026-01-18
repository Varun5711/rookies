import { Injectable, Inject } from '@nestjs/common';
import { ClickHouseClient } from '@clickhouse/client';

@Injectable()
export class AnalyticsService {
    constructor(
        @Inject('CLICKHOUSE') private readonly clickHouseClient: ClickHouseClient,
    ) { }

    async getOverview() {
        // Aggregated high-level stats from audit logs
        const query = `
      SELECT
        countIf(action = 'USER_REGISTERED') as total_users,
        countIf(action = 'GRIEVANCE_SUBMITTED') as total_grievances,
        countIf(action = 'APPOINTMENT_BOOKED') as total_appointments,
        countIf(action = 'SCHEME_APPLICATION_SUBMITTED') as total_applications
      FROM audit_logs
    `;
        const resultSet = await this.clickHouseClient.query({ query, format: 'JSONEachRow' });
        const data = await resultSet.json();
        return data[0] || {};
    }

    async getTrends(period: string) {
        // Daily activity trends
        const days = period === '30d' ? 30 : 7;
        const query = `
      SELECT
        toDate(timestamp) as date,
        count(*) as total_activity,
        countIf(severity = 'error') as error_count
      FROM audit_logs
      WHERE timestamp > now() - INTERVAL ${days} DAY
      GROUP BY date
      ORDER BY date ASC
    `;
        const resultSet = await this.clickHouseClient.query({ query, format: 'JSONEachRow' });
        return await resultSet.json();
    }

    async getServiceStats() {
        // Distribution by service
        const query = `
      SELECT
        service_name,
        count(*) as request_count
      FROM audit_logs
      WHERE timestamp > now() - INTERVAL 30 DAY
      GROUP BY service_name
      ORDER BY request_count DESC
    `;
        const resultSet = await this.clickHouseClient.query({ query, format: 'JSONEachRow' });
        return await resultSet.json();
    }
}
