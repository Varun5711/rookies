import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Standard Error Response Format
 */
export interface ApiErrorResponse {
  success: false;
  data: null;
  error: {
    code: string;
    message: string;
    details?: any;
  };
  meta: {
    timestamp: string;
    requestId: string;
  };
}

/**
 * HTTP Exception Filter
 * Catches all HTTP exceptions and returns them in a standardized format.
 *
 * This filter ensures consistent error responses across the API Gateway.
 */
@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const status = exception.getStatus();
    const exceptionResponse = exception.getResponse();
    const correlationId =
      (request.headers['x-correlation-id'] as string) || '';

    // Extract error details
    let message: string;
    let details: any = null;
    let code: string;

    if (typeof exceptionResponse === 'string') {
      message = exceptionResponse;
      code = this.getErrorCode(status);
    } else if (typeof exceptionResponse === 'object') {
      const responseObj = exceptionResponse as any;
      message = responseObj.message || exception.message;
      details = responseObj.errors || responseObj.details || null;
      code = responseObj.error || this.getErrorCode(status);
    } else {
      message = exception.message;
      code = this.getErrorCode(status);
    }

    // Log error
    this.logger.error(
      `[${correlationId}] ${request.method} ${request.url} - ${status}: ${message}`,
    );

    const errorResponse: ApiErrorResponse = {
      success: false,
      data: null,
      error: {
        code,
        message: Array.isArray(message) ? message[0] : message,
        ...(details && { details }),
      },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: correlationId,
      },
    };

    response.status(status).json(errorResponse);
  }

  /**
   * Map HTTP status to error code
   */
  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      [HttpStatus.BAD_REQUEST]: 'BAD_REQUEST',
      [HttpStatus.UNAUTHORIZED]: 'UNAUTHORIZED',
      [HttpStatus.FORBIDDEN]: 'FORBIDDEN',
      [HttpStatus.NOT_FOUND]: 'NOT_FOUND',
      [HttpStatus.CONFLICT]: 'CONFLICT',
      [HttpStatus.UNPROCESSABLE_ENTITY]: 'VALIDATION_ERROR',
      [HttpStatus.TOO_MANY_REQUESTS]: 'RATE_LIMIT_EXCEEDED',
      [HttpStatus.INTERNAL_SERVER_ERROR]: 'INTERNAL_ERROR',
      [HttpStatus.BAD_GATEWAY]: 'BAD_GATEWAY',
      [HttpStatus.SERVICE_UNAVAILABLE]: 'SERVICE_UNAVAILABLE',
      [HttpStatus.GATEWAY_TIMEOUT]: 'GATEWAY_TIMEOUT',
    };

    return codeMap[status] || 'ERROR';
  }
}
