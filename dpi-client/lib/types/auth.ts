/**
 * User Role Enum
 * Matches backend UserRole enum in @dpi/common
 */
export enum UserRole {
  CITIZEN = 'citizen',
  SERVICE_PROVIDER = 'service_provider',
  PLATFORM_ADMIN = 'platform_admin',
}

export interface User {
  id: string;
  mobile?: string;
  email?: string;
  fullName: string;
  mobileVerified: boolean;
  roles: string[];
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  user: User;
  tokens: AuthTokens;
}
