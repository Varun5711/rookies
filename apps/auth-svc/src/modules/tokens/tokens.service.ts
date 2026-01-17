import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { RefreshToken } from '../users/entities/refresh-token.entity';

/**
 * Tokens Service
 * Handles JWT token generation, validation, and refresh token rotation
 *
 * Token Strategy:
 * - Access Token: 15 minutes (short-lived, for API access)
 * - Refresh Token: 7 days (long-lived, for token renewal)
 * - Refresh tokens are rotated on each use (one-time use for security)
 */
@Injectable()
export class TokensService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectRepository(RefreshToken)
    private readonly refreshTokenRepo: Repository<RefreshToken>,
  ) {}

  /**
   * Generate access token and refresh token for a user
   */
  async generateTokens(user: User, deviceInfo?: {
    ipAddress?: string;
    userAgent?: string;
  }): Promise<{ accessToken: string; refreshToken: string }> {
    // JWT payload
    const payload = {
      sub: user.id,
      email: user.email,
      mobile: user.mobile,
      name: user.fullName,
      picture: user.picture,
      googleId: user.googleId,
      mobileVerified: user.mobileVerified,
      roles: user.roles,
    };

    // Generate access token (15 min)
    const accessToken = this.jwtService.sign(payload, {
      expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    });

    // Generate refresh token (7 days)
    const refreshTokenValue = this.jwtService.sign(
      { sub: user.id },
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d' }
    );

    // Calculate expiration date
    const expiresAt = new Date();
    const refreshExpiryDays = process.env.JWT_REFRESH_EXPIRES_IN?.includes('d')
      ? parseInt(process.env.JWT_REFRESH_EXPIRES_IN)
      : 7;
    expiresAt.setDate(expiresAt.getDate() + refreshExpiryDays);

    // Store refresh token in database
    const refreshToken = this.refreshTokenRepo.create({
      token: refreshTokenValue,
      user,
      expiresAt,
      deviceInfo: deviceInfo?.userAgent,
      ipAddress: deviceInfo?.ipAddress,
      userAgent: deviceInfo?.userAgent,
    });

    await this.refreshTokenRepo.save(refreshToken);

    return {
      accessToken,
      refreshToken: refreshTokenValue,
    };
  }

  /**
   * Refresh tokens
   * Validates refresh token and generates new token pair
   * Implements token rotation: old refresh token is revoked
   */
  async refreshTokens(
    refreshToken: string,
    deviceInfo?: { ipAddress?: string; userAgent?: string }
  ): Promise<{ accessToken: string; refreshToken: string }> {
    // Find refresh token in database
    const tokenRecord = await this.refreshTokenRepo.findOne({
      where: { token: refreshToken, revoked: false },
      relations: ['user'],
    });

    // Validate token
    if (!tokenRecord) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    if (tokenRecord.expiresAt < new Date()) {
      throw new UnauthorizedException('Refresh token expired');
    }

    // Revoke old refresh token (one-time use)
    tokenRecord.revoked = true;
    tokenRecord.revokedAt = new Date();
    await this.refreshTokenRepo.save(tokenRecord);

    // Generate new token pair
    return this.generateTokens(tokenRecord.user, deviceInfo);
  }

  /**
   * Revoke refresh token (logout)
   */
  async revokeRefreshToken(refreshToken: string): Promise<void> {
    const tokenRecord = await this.refreshTokenRepo.findOne({
      where: { token: refreshToken },
    });

    if (tokenRecord && !tokenRecord.revoked) {
      tokenRecord.revoked = true;
      tokenRecord.revokedAt = new Date();
      await this.refreshTokenRepo.save(tokenRecord);
    }
  }

  /**
   * Revoke all refresh tokens for a user (logout from all devices)
   */
  async revokeAllUserTokens(userId: string): Promise<void> {
    await this.refreshTokenRepo.update(
      { user: { id: userId }, revoked: false },
      { revoked: true, revokedAt: new Date() }
    );
  }

  /**
   * Clean up expired refresh tokens (run periodically)
   */
  async cleanupExpiredTokens(): Promise<number> {
    const result = await this.refreshTokenRepo.delete({
      expiresAt: new Date(),
    });

    return result.affected || 0;
  }
}
