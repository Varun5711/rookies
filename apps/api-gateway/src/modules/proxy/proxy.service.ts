import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { Request, Response } from 'express';
import { firstValueFrom } from 'rxjs';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { ServiceInfo } from './interfaces/service-info.interface';

/**
 * Standard API Response Format
 */
interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  meta: {
    timestamp: string;
    requestId: string;
  };
}

/**
 * Standard Error Response Format
 */
interface ApiErrorResponse {
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
 * Proxy Service
 * Handles HTTP forwarding from API Gateway to target services.
 * Wraps all responses in a standardized format.
 */
@Injectable()
export class ProxyService {
  private readonly logger = new Logger(ProxyService.name);

  constructor(private readonly httpService: HttpService) {}

  /**
   * Forward request to target service
   */
  async forwardRequest(
    req: Request,
    res: Response,
    service: ServiceInfo,
    path: string,
    correlationId: string,
  ): Promise<void> {
    const targetUrl = this.buildTargetUrl(service.baseUrl, path, req.query);
    const method = req.method.toLowerCase() as
      | 'get'
      | 'post'
      | 'put'
      | 'patch'
      | 'delete';

    this.logger.debug(
      `Forwarding ${method.toUpperCase()} ${req.originalUrl} -> ${targetUrl}`,
    );

    const headers = this.buildForwardHeaders(req, correlationId);

    const config: AxiosRequestConfig = {
      method,
      url: targetUrl,
      headers,
      data: req.body,
      timeout: 30000,
      validateStatus: () => true, // Don't throw on any status
      responseType: 'arraybuffer', // Handle binary data
    };

    try {
      const startTime = Date.now();
      const response: AxiosResponse = await firstValueFrom(
        this.httpService.request(config),
      );
      const duration = Date.now() - startTime;

      this.logger.debug(
        `Response from ${service.name}: ${response.status} (${duration}ms)`,
      );

      // Forward response headers
      this.forwardResponseHeaders(response, res);

      // Check if response is JSON
      const contentType = response.headers['content-type'] || '';
      const isJson = contentType.includes('application/json');

      if (isJson) {
        // Parse JSON from target service
        const jsonData = JSON.parse(response.data.toString());

        // Check if the response is already wrapped by the backend service
        // Backend services return: { data: ..., meta: { ... } }
        // We don't want to double-wrap this
        const isAlreadyWrapped =
          jsonData.data !== undefined && jsonData.meta !== undefined;

        if (isAlreadyWrapped) {
          // Pass through already-wrapped responses
          // Just add our standard success wrapper around it
          const wrappedResponse = {
            success: true,
            data: jsonData,
            meta: {
              timestamp: new Date().toISOString(),
              requestId: correlationId,
            },
          };
          res.status(response.status).json(wrappedResponse);
        } else {
          // Wrap non-wrapped responses in standard format
          const wrappedResponse = this.wrapResponse(
            jsonData,
            response.status,
            correlationId,
          );
          res.status(response.status).json(wrappedResponse);
        }
      } else {
        // Pass through non-JSON responses (files, html, etc.)
        res.status(response.status).send(response.data);
      }
    } catch (error: any) {
      this.logger.error(
        `Proxy error for ${service.name}: ${error.message}`,
        error.stack,
      );

      const timestamp = new Date().toISOString();

      if (error.code === 'ECONNREFUSED') {
        res
          .status(503)
          .json(
            this.createErrorResponse(
              'SERVICE_UNAVAILABLE',
              `Service ${service.displayName} is unavailable`,
              correlationId,
              timestamp,
            ),
          );
      } else if (error.code === 'ETIMEDOUT' || error.code === 'ECONNABORTED') {
        res
          .status(504)
          .json(
            this.createErrorResponse(
              'GATEWAY_TIMEOUT',
              `Request to ${service.displayName} timed out`,
              correlationId,
              timestamp,
            ),
          );
      } else {
        res
          .status(502)
          .json(
            this.createErrorResponse(
              'BAD_GATEWAY',
              `Error forwarding request to ${service.displayName}`,
              correlationId,
              timestamp,
            ),
          );
      }
    }
  }

  /**
   * Wrap response in standard format
   */
  private wrapResponse(
    data: any,
    status: number,
    correlationId: string,
  ): ApiResponse | ApiErrorResponse {
    const timestamp = new Date().toISOString();

    // Check if it's an error response (4xx or 5xx)
    if (status >= 400) {
      return this.createErrorResponse(
        data.error || this.getErrorCode(status),
        data.message || 'An error occurred',
        correlationId,
        timestamp,
        data.details || data.errors,
      );
    }

    // Success response
    return {
      success: true,
      data: data,
      meta: {
        timestamp,
        requestId: correlationId,
      },
    };
  }

  /**
   * Create standardized error response
   */
  private createErrorResponse(
    code: string,
    message: string,
    correlationId: string,
    timestamp: string,
    details?: any,
  ): ApiErrorResponse {
    return {
      success: false,
      data: null,
      error: {
        code,
        message,
        ...(details && { details }),
      },
      meta: {
        timestamp,
        requestId: correlationId,
      },
    };
  }

  /**
   * Map HTTP status to error code
   */
  private getErrorCode(status: number): string {
    const codeMap: Record<number, string> = {
      400: 'BAD_REQUEST',
      401: 'UNAUTHORIZED',
      403: 'FORBIDDEN',
      404: 'NOT_FOUND',
      409: 'CONFLICT',
      422: 'VALIDATION_ERROR',
      429: 'RATE_LIMIT_EXCEEDED',
      500: 'INTERNAL_ERROR',
      502: 'BAD_GATEWAY',
      503: 'SERVICE_UNAVAILABLE',
      504: 'GATEWAY_TIMEOUT',
    };
    return codeMap[status] || 'ERROR';
  }

  /**
   * Build target URL with path and query params
   */
  private buildTargetUrl(
    baseUrl: string,
    path: string,
    query: Request['query'],
  ): string {
    // Ensure baseUrl doesn't end with slash and path starts with slash
    const cleanBaseUrl = baseUrl.replace(/\/+$/, '');
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    let url = `${cleanBaseUrl}${cleanPath}`;

    // Append query parameters
    const queryString = Object.entries(query)
      .filter(([, value]) => value !== undefined)
      .map(
        ([key, value]) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`,
      )
      .join('&');

    if (queryString) {
      url += `?${queryString}`;
    }

    return url;
  }

  /**
   * Build headers to forward to target service
   */
  private buildForwardHeaders(
    req: Request,
    correlationId: string,
  ): Record<string, string> {
    const headers: Record<string, string> = {
      'x-correlation-id': correlationId,
      'x-forwarded-for':
        (req.headers['x-forwarded-for'] as string) ||
        req.socket.remoteAddress ||
        '',
      'x-forwarded-host': req.headers.host || '',
      'x-forwarded-proto': req.protocol,
    };

    // Forward content-type
    if (req.headers['content-type']) {
      headers['content-type'] = req.headers['content-type'] as string;
    }

    // Forward authorization
    if (req.headers['authorization']) {
      headers['authorization'] = req.headers['authorization'] as string;
    }

    // Forward accept
    if (req.headers['accept']) {
      headers['accept'] = req.headers['accept'] as string;
    }

    // Forward user context if available (set by JWT validation)
    if ((req as any).user) {
      headers['x-user-context'] = JSON.stringify((req as any).user);
    }

    return headers;
  }

  /**
   * Forward response headers from target service
   */
  private forwardResponseHeaders(response: AxiosResponse, res: Response): void {
    const headersToForward = [
      'content-type',
      'cache-control',
      'etag',
      'last-modified',
      'content-disposition',
      'x-request-id',
    ];

    for (const header of headersToForward) {
      if (response.headers[header]) {
        res.setHeader(header, response.headers[header]);
      }
    }
  }
}
