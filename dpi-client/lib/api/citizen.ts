import apiClient from './client';

export interface CitizenStats {
  activeAppointments: number;
  pendingApplications: number;
  openGrievances: number;
}

export interface ActivityItem {
  id: string;
  type: 'appointment' | 'application' | 'grievance';
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

export const citizenApi = {
  // Aggregate stats from multiple services
  getDashboardStats: async (): Promise<CitizenStats> => {
    const [appointments, applications, grievances] = await Promise.allSettled([
      apiClient.get('/services/healthcare/appointments/me', {
        params: { status: 'SCHEDULED', limit: 100 },
      }),
      apiClient.get('/services/agriculture/schemes/me/applications', {
        params: { status: 'PENDING', limit: 100 },
      }),
      apiClient.get('/services/urban/grievances/me', {
        params: { status: 'OPEN', limit: 100 },
      }),
    ]);

    return {
      activeAppointments:
        appointments.status === 'fulfilled'
          ? appointments.value.data.meta?.total || 0
          : 0,
      pendingApplications:
        applications.status === 'fulfilled'
          ? applications.value.data.meta?.total || 0
          : 0,
      openGrievances:
        grievances.status === 'fulfilled'
          ? grievances.value.data.meta?.total || 0
          : 0,
    };
  },

  // Aggregate recent activity from multiple services
  getRecentActivity: async (limit = 3): Promise<ActivityItem[]> => {
    const [appointments, applications, grievances] = await Promise.allSettled([
      apiClient.get('/services/healthcare/appointments/me', {
        params: { limit: 2, sort: 'createdAt:desc' },
      }),
      apiClient.get('/services/agriculture/schemes/me/applications', {
        params: { limit: 2, sort: 'createdAt:desc' },
      }),
      apiClient.get('/services/urban/grievances/me', {
        params: { limit: 2, sort: 'createdAt:desc' },
      }),
    ]);

    const activities: ActivityItem[] = [];

    // Map appointments
    if (appointments.status === 'fulfilled' && appointments.value.data.data) {
      appointments.value.data.data.forEach((apt: any) => {
        activities.push({
          id: apt.id,
          type: 'appointment',
          title: 'Appointment Confirmed',
          description: `${apt.doctor?.name || 'Doctor'} at ${apt.hospital?.name || 'Hospital'}`,
          timestamp: apt.createdAt,
          status: apt.status.toLowerCase(),
        });
      });
    }

    // Map applications
    if (applications.status === 'fulfilled' && applications.value.data.data) {
      applications.value.data.data.forEach((app: any) => {
        activities.push({
          id: app.id,
          type: 'application',
          title: 'Scheme Application',
          description: `${app.scheme?.name || 'Scheme'} - Application #${app.id.slice(0, 8)}`,
          timestamp: app.createdAt,
          status: app.status.toLowerCase(),
        });
      });
    }

    // Map grievances
    if (grievances.status === 'fulfilled' && grievances.value.data.data) {
      grievances.value.data.data.forEach((grv: any) => {
        activities.push({
          id: grv.id,
          type: 'grievance',
          title: 'Grievance Registered',
          description: `${grv.title} - Ticket #${grv.ticketNumber}`,
          timestamp: grv.createdAt,
          status: grv.status.toLowerCase(),
        });
      });
    }

    // Sort by timestamp desc and return top N
    return activities
      .sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
      )
      .slice(0, limit);
  },
};
