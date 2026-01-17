export const UrbanEventTopics = {
  GRIEVANCE_SUBMITTED: 'dpi.urban.grievance-submitted',
  GRIEVANCE_RESOLVED: 'dpi.urban.grievance-resolved',
  GRIEVANCE_ESCALATED: 'dpi.urban.grievance-escalated',
  GRIEVANCE_UPDATED: 'dpi.urban.grievance-updated',
} as const;

export type UrbanEventTopic = typeof UrbanEventTopics[keyof typeof UrbanEventTopics];

export interface GrievanceSubmittedEvent {
  grievanceId: string;
  userId: string;
  category: string;
  title: string;
  description: string;
  location?: string;
  priority: string;
  timestamp: string;
}

export interface GrievanceResolvedEvent {
  grievanceId: string;
  userId: string;
  resolvedBy: string;
  resolution: string;
  satisfactionRating?: number;
  timestamp: string;
}

export interface GrievanceEscalatedEvent {
  grievanceId: string;
  userId: string;
  escalatedBy: string;
  escalationReason: string;
  newPriority: string;
  timestamp: string;
}

export interface GrievanceUpdatedEvent {
  grievanceId: string;
  changes: {
    status?: string;
    assignedTo?: string;
    priority?: string;
  };
  updatedBy: string;
  timestamp: string;
}