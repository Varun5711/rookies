import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { UserRole } from '@dpi/common';
import { RefreshToken } from './refresh-token.entity';

/**
 * User Entity
 * Stores user information from both Google OAuth and Mobile OTP authentication
 *
 * Authentication Methods:
 * 1. Google OAuth: googleId, email, picture populated
 * 2. Mobile OTP: mobile, mobileVerified populated
 *
 * A user can have both authentication methods linked
 */
@Entity('users')
export class User extends BaseEntity {
  // Google OAuth fields
  @Column({ nullable: true, unique: true, name: 'google_id' })
  googleId?: string;

  @Column({ nullable: true, unique: true })
  email?: string;

  @Column({ nullable: true })
  picture?: string;

  // Mobile OTP fields
  @Column({ nullable: true, unique: true })
  mobile?: string;

  @Column({ default: false, name: 'mobile_verified' })
  mobileVerified: boolean;

  @Column({ default: false, name: 'email_verified' })
  emailVerified: boolean;

  // Common fields
  @Column({ name: 'full_name' })
  fullName: string;

  // Roles (JSONB array for PostgreSQL)
  @Column({
    type: 'simple-array',
    default: UserRole.CITIZEN,
  })
  roles: UserRole[];

  // Last login tracking
  @Column({ nullable: true, name: 'last_login_at' })
  lastLoginAt?: Date;

  // Refresh tokens relationship
  @OneToMany(() => RefreshToken, (token) => token.user, { cascade: true })
  refreshTokens: RefreshToken[];
}
