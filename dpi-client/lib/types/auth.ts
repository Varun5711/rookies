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
