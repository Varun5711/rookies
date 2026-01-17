export const NotificationEventTopics = {
  SEND: 'dpi.notification.send',
} as const;

export type NotificationEventTopic = typeof NotificationEventTopics[keyof typeof NotificationEventTopics];

export interface NotificationSendEvent {
  notificationId: string;
  userId: string;
  type: 'email' | 'sms' | 'push' | 'in-app';
  channel: string;
  subject?: string;
  message: string;
  metadata?: Record<string, any>;
  timestamp: string;
}