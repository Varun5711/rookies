import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';

/**
 * Correlation ID Middleware
 * Generates or extracts correlation IDs for request tracing.
 *
 * Features:
 * - Generates new UUID if no correlation ID provided
 * - Extracts existing correlation ID from x-correlation-id header
 * - Sets correlation ID in response header for client tracking
 * - Enables distributed tracing across microservices
 */
@Injectable()
export class CorrelationIdMiddleware implements NestMiddleware {
  private readonly logger = new Logger(CorrelationIdMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    // Extract or generate correlation ID
    let correlationId = req.headers['x-correlation-id'] as string;

    if (!correlationId) {
      correlationId = randomUUID();
      this.logger.debug(`Generated new correlation ID: ${correlationId}`);
    } else {
      this.logger.debug(`Using existing correlation ID: ${correlationId}`);
    }

    // Set correlation ID in request headers for downstream use
    req.headers['x-correlation-id'] = correlationId;

    // Set correlation ID in response headers for client tracking
    res.setHeader('x-correlation-id', correlationId);

    // Log incoming request
    this.logger.log(
      `[${correlationId}] ${req.method} ${req.originalUrl}`,
    );

    // Track request timing
    const startTime = Date.now();

    // Log response on finish
    res.on('finish', () => {
      const duration = Date.now() - startTime;
      this.logger.log(
        `[${correlationId}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`,
      );
    });

    next();
  }
}
