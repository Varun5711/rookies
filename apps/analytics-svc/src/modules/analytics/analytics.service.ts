import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AnalyticsService {
    private readonly logger = new Logger(AnalyticsService.name);
    private readonly authSvcUrl: string;
    private readonly healthcareSvcUrl: string;
    private readonly agricultureSvcUrl: string;
    private readonly urbanSvcUrl: string;
    private readonly auditSvcUrl: string;

    constructor(
        private readonly httpService: HttpService,
        private readonly configService: ConfigService,
    ) {
        this.authSvcUrl = this.configService.get('AUTH_SVC_URL', 'http://localhost:3001/api');
        this.healthcareSvcUrl = this.configService.get('HEALTHCARE_SVC_URL', 'http://localhost:3010/api');
        this.agricultureSvcUrl = this.configService.get('AGRICULTURE_SVC_URL', 'http://localhost:3009/api');
        this.urbanSvcUrl = this.configService.get('URBAN_SVC_URL', 'http://localhost:3007/api');
        this.auditSvcUrl = this.configService.get('AUDIT_SVC_URL', 'http://localhost:3008/api');
    }

    async getDashboardStats(token: string) {
        try {
            const headers = { Authorization: `Bearer ${token}` };

            // Fetch data from all services in parallel
            const [usersData, appointmentsData, applicationsData, grievancesData] = await Promise.allSettled([
                this.fetchWithFallback(`${this.authSvcUrl}/users/count`, headers, 0),
                this.fetchWithFallback(`${this.healthcareSvcUrl}/admin/appointments/stats`, headers, []),
                this.fetchWithFallback(`${this.agricultureSvcUrl}/admin/schemes/stats`, headers, {}),
                this.fetchWithFallback(`${this.urbanSvcUrl}/admin/grievances/stats`, headers, {}),
            ]);

            const totalUsers = usersData.status === 'fulfilled' ? usersData.value : 0;
            const appointmentStats = appointmentsData.status === 'fulfilled' ? appointmentsData.value : [];
            const applicationStats = applicationsData.status === 'fulfilled' ? applicationsData.value : {};
            const grievanceStats = grievancesData.status === 'fulfilled' ? grievancesData.value : {};

            // Calculate totals
            const totalAppointments = Array.isArray(appointmentStats)
                ? appointmentStats.reduce((sum, item) => sum + parseInt(item.count || 0), 0)
                : 0;

            const totalApplications = applicationStats.totalApplications || 0;
            const totalGrievances = grievanceStats.total || 0;

            return {
                total_users: totalUsers,
                total_appointments: totalAppointments,
                total_applications: totalApplications,
                total_grievances: totalGrievances,
                appointment_stats: appointmentStats,
                application_stats: applicationStats,
                grievance_stats: grievanceStats,
            };
        } catch (error) {
            this.logger.error(`Failed to fetch dashboard stats: ${error.message}`);
            return {
                total_users: 0,
                total_appointments: 0,
                total_applications: 0,
                total_grievances: 0,
                appointment_stats: [],
                application_stats: {},
                grievance_stats: {},
            };
        }
    }

    async getTrends(token: string, days = 7) {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const fromDate = new Date();
            fromDate.setDate(fromDate.getDate() - days);

            // Fetch audit logs for trend analysis
            const auditData = await this.fetchWithFallback(
                `${this.auditSvcUrl}/audit/logs?from_date=${fromDate.toISOString()}&limit=1000`,
                headers,
                { data: [] }
            );

            const logs = Array.isArray(auditData.data) ? auditData.data : [];

            // Group by date
            const trendsByDate = logs.reduce((acc, log) => {
                const date = new Date(log.timestamp).toISOString().split('T')[0];
                if (!acc[date]) {
                    acc[date] = { date, events: 0, services: new Set() };
                }
                acc[date].events++;
                acc[date].services.add(log.service_name);
                return acc;
            }, {});

            return Object.values(trendsByDate).map((item: any) => ({
                date: item.date,
                events: item.events,
                unique_services: item.services.size,
            }));
        } catch (error) {
            this.logger.error(`Failed to fetch trends: ${error.message}`);
            return [];
        }
    }

    async getServiceHealth(token: string) {
        const headers = { Authorization: `Bearer ${token}` };
        const services = [
            { name: 'auth-svc', url: `${this.authSvcUrl}/health` },
            { name: 'healthcare-svc', url: `${this.healthcareSvcUrl}/health` },
            { name: 'agriculture-svc', url: `${this.agricultureSvcUrl}/health` },
            { name: 'urban-svc', url: `${this.urbanSvcUrl}/health` },
            { name: 'audit-svc', url: `${this.auditSvcUrl}/health` },
        ];

        const healthChecks = await Promise.allSettled(
            services.map(async (service) => {
                try {
                    const response = await firstValueFrom(
                        this.httpService.get(service.url, { headers, timeout: 3000 })
                    );
                    return {
                        name: service.name,
                        status: 'healthy',
                        uptime: response.data.uptime,
                    };
                } catch (error) {
                    return {
                        name: service.name,
                        status: 'unhealthy',
                        error: error.message,
                    };
                }
            })
        );

        return healthChecks.map((result) =>
            result.status === 'fulfilled' ? result.value : { name: 'unknown', status: 'error' }
        );
    }

    private async fetchWithFallback(url: string, headers: any, fallback: any) {
        try {
            const response = await firstValueFrom(
                this.httpService.get(url, { headers, timeout: 5000 })
            );
            return response.data;
        } catch (error) {
            this.logger.warn(`Failed to fetch from ${url}: ${error.message}`);
            return fallback;
        }
    }
}
