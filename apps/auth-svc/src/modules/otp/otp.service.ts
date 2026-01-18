import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { RedisService } from '@dpi/redis';
import { TwilioService } from './twilio.service';
import { UsersService } from '../users/users.service';

/**
 * OTP Service
 * Manages OTP flow with rate limiting and session management
 *
 * Security Features:
 * - Rate limiting: 3 OTP requests per 10 minutes per mobile
 * - Session tracking in Redis (5 min TTL)
 * - Max 3 verification attempts per session
 * - Automatic cleanup of expired sessions
 */
@Injectable()
export class OtpService {
  // Rate limiting config
  private readonly MAX_OTP_REQUESTS = 3;
  private readonly OTP_RATE_LIMIT_WINDOW = 600; // 10 minutes in seconds
  private readonly OTP_SESSION_TTL = 300; // 5 minutes in seconds
  private readonly MAX_VERIFICATION_ATTEMPTS = 3;

  constructor(
    private readonly twilioService: TwilioService,
    private readonly redisService: RedisService,
    private readonly usersService: UsersService,
  ) {}

  /**
   * Send OTP to mobile number
   * Implements rate limiting and session management
   */
  async sendOTP(mobile: string): Promise<{ expiresIn: number }> {
    // Check rate limit
    await this.checkRateLimit(mobile);

    // Send OTP via Twilio
    const verificationSid = await this.twilioService.sendOTP(mobile);

    // Store OTP session in Redis
    const sessionKey = `otp:session:${mobile}`;
    await this.redisService.set(
      sessionKey,
      JSON.stringify({
        sid: verificationSid,
        attempts: 0,
        createdAt: new Date().toISOString(),
      }),
      this.OTP_SESSION_TTL
    );

    // Increment rate limit counter
    await this.incrementRateLimit(mobile);

    return {
      expiresIn: this.OTP_SESSION_TTL,
    };
  }

  /**
   * Verify OTP
   * Checks session, validates OTP via Twilio, and creates/updates user
   */
  async verifyOTP(mobile: string, otp: string) {
    // Get OTP session
    const sessionKey = `otp:session:${mobile}`;
    const sessionData = await this.redisService.get(sessionKey);

    if (!sessionData) {
      throw new BadRequestException('No OTP session found. Please request a new OTP.');
    }

    const session = JSON.parse(sessionData);

    // Check verification attempts
    if (session.attempts >= this.MAX_VERIFICATION_ATTEMPTS) {
      await this.redisService.del(sessionKey);
      throw new HttpException(
        'Too many failed attempts. Please request a new OTP.',
        HttpStatus.TOO_MANY_REQUESTS
      );
    }

    // Increment attempts
    session.attempts += 1;
    await this.redisService.set(sessionKey, JSON.stringify(session), this.OTP_SESSION_TTL);

    // Verify OTP with Twilio
    const isValid = await this.twilioService.verifyOTP(mobile, otp);

    if (!isValid) {
      throw new UnauthorizedException('Invalid OTP. Please try again.');
    }

    // OTP verified successfully - clean up session
    await this.redisService.del(sessionKey);

    // Create or update user
    const user = await this.usersService.findOrCreateMobileUser(mobile);

    return user;
  }

  /**
   * Check if mobile has exceeded rate limit for OTP requests
   */
  private async checkRateLimit(mobile: string): Promise<void> {
    const rateLimitKey = `otp:ratelimit:${mobile}`;
    const currentCount = await this.redisService.getClient().get(rateLimitKey);

    if (currentCount && parseInt(currentCount) >= this.MAX_OTP_REQUESTS) {
      const ttl = await this.redisService.getClient().ttl(rateLimitKey);
      throw new HttpException(
        `Too many OTP requests. Please try again in ${Math.ceil(ttl / 60)} minutes.`,
        HttpStatus.TOO_MANY_REQUESTS
      );
    }
  }

  /**
   * Increment rate limit counter
   * Uses raw Redis client to avoid JSON serialization for counters
   */
  private async incrementRateLimit(mobile: string): Promise<void> {
    const rateLimitKey = `otp:ratelimit:${mobile}`;
    const client = this.redisService.getClient();

    // Use raw Redis operations for counter management
    const currentCount = await client.get(rateLimitKey);

    if (!currentCount) {
      // First request - set counter with TTL (raw integer, no JSON)
      await client.setex(rateLimitKey, this.OTP_RATE_LIMIT_WINDOW, '1');
    } else {
      // Increment counter
      await client.incr(rateLimitKey);
    }
  }
}
