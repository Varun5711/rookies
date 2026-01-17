import { UserRole } from '../enums/user-role.enum';

/**
 * Current User Interface
 * Represents the authenticated user context extracted from JWT token
 * This is attached to the request object after JWT validation
 */
export interface CurrentUser {
  /** User ID (UUID) */
  sub: string;

  /** User's email address (from Google OAuth or manual entry) */
  email?: string;

  /** User's mobile number (from OTP verification) */
  mobile?: string;

  /** User's full name */
  name: string;

  /** Profile picture URL (from Google OAuth) */
  picture?: string;

  /** Google ID (if authenticated via Google OAuth) */
  googleId?: string;

  /** Mobile number verified via OTP */
  mobileVerified: boolean;

  /** User's roles (can have multiple roles) */
  roles: UserRole[];

  /** JWT issued at timestamp */
  iat: number;

  /** JWT expiration timestamp */
  exp: number;
}
