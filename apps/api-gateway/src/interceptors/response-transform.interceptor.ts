import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request } from 'express';

/**
 * Standard API Response Format
 */
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
  };
}

/**
 * Response Transform Interceptor
 * Wraps all successful responses in a standardized format.
 *
 * Note: This interceptor does NOT apply to proxy routes because
 * they bypass NestJS response handling (using @Res() decorator).
 * It only applies to direct gateway endpoints like /api/health.
 *
 * For a fully standardized response format across all services,
 * apply this interceptor to each microservice individually.
 */
@Injectable()
export class ResponseTransformInterceptor<T>
  implements NestInterceptor<T, ApiResponse<T>>
{
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<ApiResponse<T>> {
    const request = context.switchToHttp().getRequest<Request>();
    const correlationId =
      (request.headers['x-correlation-id'] as string) || '';

    return next.handle().pipe(
      map((data) => ({
        success: true,
        data: data ?? {},
        meta: {
          timestamp: new Date().toISOString(),
          requestId: correlationId,
        },
      })),
    );
  }
}
