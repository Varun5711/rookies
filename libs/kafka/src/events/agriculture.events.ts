export const AgricultureEventTopics = {
  ADVISORY_PUBLISHED: 'dpi.agriculture.advisory-published',
  SCHEME_APPLIED: 'dpi.agriculture.scheme-applied',
  SCHEME_APPROVED: 'dpi.agriculture.scheme-approved',
  SCHEME_REJECTED: 'dpi.agriculture.scheme-rejected',
} as const;

export type AgricultureEventTopic = typeof AgricultureEventTopics[keyof typeof AgricultureEventTopics];

export interface AdvisoryPublishedEvent {
  advisoryId: string;
  title: string;
  category: string;
  cropTypes: string[];
  region: string;
  publishedBy: string;
  timestamp: string;
}

export interface SchemeAppliedEvent {
  applicationId: string;
  userId: string;
  schemeId: string;
  schemeName: string;
  status: string;
  timestamp: string;
}

export interface SchemeApprovedEvent {
  applicationId: string;
  userId: string;
  schemeId: string;
  approvedBy: string;
  timestamp: string;
}

export interface SchemeRejectedEvent {
  applicationId: string;
  userId: string;
  schemeId: string;
  rejectedBy: string;
  rejectionReason?: string;
  timestamp: string;
}