import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from './http-exception.filter';

/**
 * All Exceptions Filter
 * Catches all non-HTTP exceptions (unexpected errors) and returns them
 * in a standardized format.
 *
 * This ensures that even unexpected errors return a consistent response.
 */
@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionsFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const correlationId =
      (request.headers['x-correlation-id'] as string) || '';

    // Log the full error for debugging
    this.logger.error(
      `[${correlationId}] Unhandled exception:`,
      exception instanceof Error ? exception.stack : exception,
    );

    const errorResponse: ApiErrorResponse = {
      success: false,
      data: null,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: correlationId,
      },
    };

    response.status(HttpStatus.INTERNAL_SERVER_ERROR).json(errorResponse);
  }
}
