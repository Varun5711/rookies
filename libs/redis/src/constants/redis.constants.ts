export const REDIS_CLIENT = 'REDIS_CLIENT';

export const DEFAULT_TTL = {
  SHORT: 60,
  MEDIUM: 300,
  LONG: 600,
  VERY_LONG: 3600,
} as const;

export const LOCK_DEFAULTS = {
  TTL: 10,
  RETRY_DELAY: 100,
  MAX_RETRIES: 5,
} as const;

export const DPI_REDIS_KEYS = {
  USER_SESSION: (userId: string, sessionId: string) => `session:${userId}:${sessionId}`,
  USER_SESSIONS_INDEX: (userId: string) => `session:index:${userId}`,
  SERVICE_REGISTRY: (serviceId: string) => `service:${serviceId}`,
  SERVICE_REGISTRY_LIST: () => 'services:list',
  HOSPITAL_LIST: (page: number) => `hospitals:list:page:${page}`,
  HOSPITAL_DETAILS: (hospitalId: string) => `hospital:${hospitalId}`,
  DOCTOR_SLOTS: (doctorId: string, date: string) => `doctor:${doctorId}:slots:${date}`,
  ADVISORY_LIST: (region?: string, cropType?: string) => 
    `advisories:list:${region || 'all'}:${cropType || 'all'}`,
  SCHEME_LIST: () => 'schemes:list',
  SCHEME_DETAILS: (schemeId: string) => `scheme:${schemeId}`,
  MARKET_PRICES: (cropType?: string) => `market:prices:${cropType || 'all'}`,
  GRIEVANCE_LIST: (userId: string, page: number) => `grievances:${userId}:page:${page}`,
  GRIEVANCE_DETAILS: (grievanceId: string) => `grievance:${grievanceId}`,
  RATE_LIMIT: (userId: string, endpoint: string) => `rate:limit:${userId}:${endpoint}`,
} as const;

export const DPI_REDIS_TTL = {
  USER_SESSION: 24 * 60 * 60,
  SERVICE_REGISTRY: 5 * 60,
  HOSPITAL_LIST: 60 * 60,
  HOSPITAL_DETAILS: 60 * 60,
  DOCTOR_SLOTS: 5 * 60,
  ADVISORY_LIST: 15 * 60,
  SCHEME_LIST: 60 * 60,
  SCHEME_DETAILS: 60 * 60,
  MARKET_PRICES: 5 * 60,
  GRIEVANCE_LIST: 5 * 60,
  GRIEVANCE_DETAILS: 10 * 60,
  RATE_LIMIT: 60,
} as const;