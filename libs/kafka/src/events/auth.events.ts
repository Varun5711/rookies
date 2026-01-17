export const AuthEventTopics = {
  USER_REGISTERED: 'dpi.auth.user-registered',
  USER_UPDATED: 'dpi.auth.user-updated',
} as const;

export type AuthEventTopic = typeof AuthEventTopics[keyof typeof AuthEventTopics];

export interface UserRegisteredEvent {
  userId: string;
  aadhaarId?: string;
  email?: string;
  phone?: string;
  fullName: string;
  dob?: string;
  address?: string;
  digilockerId?: string;
  timestamp: string;
}

export interface UserUpdatedEvent {
  userId: string;
  changes: {
    fullName?: string;
    email?: string;
    phone?: string;
    address?: string;
    photoUrl?: string;
  };
  timestamp: string;
}