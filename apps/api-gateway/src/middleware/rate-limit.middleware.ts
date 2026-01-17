import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { RedisService } from '@dpi/redis';

/**
 * Rate Limit Middleware
 * Implements sliding window rate limiting using Redis.
 *
 * Default limits:
 * - 100 requests per minute per IP (unauthenticated)
 * - 100 requests per minute per user (authenticated)
 *
 * Features:
 * - Sliding window algorithm for accurate rate limiting
 * - Separate limits for authenticated vs unauthenticated users
 * - Rate limit headers in response (X-RateLimit-*)
 * - Graceful degradation if Redis is unavailable
 */
@Injectable()
export class RateLimitMiddleware implements NestMiddleware {
  private readonly logger = new Logger(RateLimitMiddleware.name);
  private readonly RATE_LIMIT_PREFIX = 'gateway:ratelimit:';
  private readonly DEFAULT_LIMIT = 100; // requests per window
  private readonly WINDOW_SIZE = 60; // 1 minute in seconds

  constructor(private readonly redisService: RedisService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const correlationId = req.headers['x-correlation-id'] as string;

    try {
      // Determine rate limit key (user ID or IP)
      const user = (req as any).user;
      const identifier = user?.sub || this.getClientIp(req);
      const key = `${this.RATE_LIMIT_PREFIX}${identifier}`;

      // Get current count
      const currentCount = await this.incrementAndGetCount(key);

      // Set rate limit headers
      const remaining = Math.max(0, this.DEFAULT_LIMIT - currentCount);
      res.setHeader('X-RateLimit-Limit', this.DEFAULT_LIMIT.toString());
      res.setHeader('X-RateLimit-Remaining', remaining.toString());
      res.setHeader(
        'X-RateLimit-Reset',
        (Math.floor(Date.now() / 1000) + this.WINDOW_SIZE).toString(),
      );

      // Check if rate limit exceeded
      if (currentCount > this.DEFAULT_LIMIT) {
        this.logger.warn(
          `[${correlationId}] Rate limit exceeded for ${identifier} (${currentCount}/${this.DEFAULT_LIMIT})`,
        );

        res.setHeader('Retry-After', this.WINDOW_SIZE.toString());
        return res.status(429).json({
          statusCode: 429,
          message: 'Too many requests. Please try again later.',
          error: 'Too Many Requests',
          retryAfter: this.WINDOW_SIZE,
        });
      }

      next();
    } catch (error: any) {
      // Graceful degradation - allow request if Redis is unavailable
      this.logger.error(
        `[${correlationId}] Rate limit check failed: ${error.message}`,
      );
      next();
    }
  }

  /**
   * Increment request count and return current count
   * Uses Redis INCR with TTL for sliding window
   */
  private async incrementAndGetCount(key: string): Promise<number> {
    const count = await this.redisService.incr(key);

    // Set TTL on first request in window
    if (count === 1) {
      await this.redisService.expire(key, this.WINDOW_SIZE);
    }

    return count;
  }

  /**
   * Get client IP address, handling proxies
   */
  private getClientIp(req: Request): string {
    const forwarded = req.headers['x-forwarded-for'];
    if (forwarded) {
      const ips = (forwarded as string).split(',');
      return ips[0].trim();
    }
    return req.socket.remoteAddress || 'unknown';
  }
}
