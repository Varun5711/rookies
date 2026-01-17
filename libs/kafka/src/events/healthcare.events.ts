export const HealthcareEventTopics = {
  APPOINTMENT_BOOKED: 'dpi.healthcare.appointment-booked',
  APPOINTMENT_CANCELLED: 'dpi.healthcare.appointment-cancelled',
  APPOINTMENT_UPDATED: 'dpi.healthcare.appointment-updated',
} as const;

export type HealthcareEventTopic = typeof HealthcareEventTopics[keyof typeof HealthcareEventTopics];

export interface AppointmentBookedEvent {
  appointmentId: string;
  userId: string;
  hospitalId: string;
  doctorId: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  timestamp: string;
}

export interface AppointmentCancelledEvent {
  appointmentId: string;
  userId: string;
  hospitalId: string;
  doctorId: string;
  cancellationReason?: string;
  timestamp: string;
}

export interface AppointmentUpdatedEvent {
  appointmentId: string;
  userId: string;
  changes: {
    appointmentDate?: string;
    appointmentTime?: string;
    status?: string;
  };
  timestamp: string;
}