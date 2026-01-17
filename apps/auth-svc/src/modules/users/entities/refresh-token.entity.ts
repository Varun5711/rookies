import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@dpi/database';
import { User } from './user.entity';

/**
 * Refresh Token Entity
 * Stores refresh tokens for JWT token rotation
 *
 * Security Features:
 * - Tokens are one-time use (revoked after refresh)
 * - Expiration tracking (7 days default)
 * - Can be revoked manually (logout)
 * - Linked to user for easy revocation of all tokens
 */
@Entity('refresh_tokens')
export class RefreshToken extends BaseEntity {
  @Column({ unique: true })
  token: string;

  @ManyToOne(() => User, (user) => user.refreshTokens, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'expires_at' })
  expiresAt: Date;

  @Column({ default: false })
  revoked: boolean;

  @Column({ nullable: true, name: 'revoked_at' })
  revokedAt?: Date;

  // Device information for better security tracking
  @Column({ nullable: true, name: 'device_info' })
  deviceInfo?: string;

  @Column({ nullable: true, name: 'ip_address' })
  ipAddress?: string;

  @Column({ nullable: true, name: 'user_agent' })
  userAgent?: string;
}
